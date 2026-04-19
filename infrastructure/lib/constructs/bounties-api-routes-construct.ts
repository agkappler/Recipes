import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface BountiesApiRoutesProps {
    /** Shared API — routes are registered here alongside future verticals. */
    readonly httpApi: apigwv2.HttpApi;
    readonly categoryTable: dynamodb.ITable;
    readonly bountyTable: dynamodb.ITable;
}

/** Resolve lambda asset when `cdk` is run from `infrastructure/` or repo root. */
function bountiesLambdaAssetPath(): string {
    const candidates = [
        path.join(process.cwd(), 'lambdas', 'bounties'),
        path.join(process.cwd(), 'infrastructure', 'lambdas', 'bounties'),
    ];
    for (const dir of candidates) {
        if (fs.existsSync(path.join(dir, 'handler.py'))) {
            return dir;
        }
    }
    throw new Error(
        `Could not find lambdas/bounties/handler.py. Tried: ${candidates.join(', ')} (cwd=${process.cwd()})`,
    );
}

/**
 * Bounties Lambda plus HTTP API routes on the shared {@link FargopolisHttpApiConstruct}.
 */
export class BountiesApiRoutesConstruct extends Construct {
    public readonly handler: lambda.Function;

    constructor(scope: Construct, id: string, props: BountiesApiRoutesProps) {
        super(scope, id);

        const assetPath = bountiesLambdaAssetPath();

        this.handler = new lambda.Function(this, 'BountyHandler', {
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: 'handler.handler',
            code: lambda.Code.fromAsset(assetPath),
            architecture: lambda.Architecture.ARM_64,
            timeout: cdk.Duration.seconds(30),
            memorySize: 256,
            environment: {
                BOUNTY_CATEGORIES_TABLE_NAME: props.categoryTable.tableName,
                BOUNTIES_TABLE_NAME: props.bountyTable.tableName,
            },
        });

        props.categoryTable.grantReadWriteData(this.handler);
        props.bountyTable.grantReadWriteData(this.handler);

        const integration = new integrations.HttpLambdaIntegration('BountyLambdaIntegration', this.handler, {
            scopePermissionToRoute: false,
        });

        const routeSpecs: { path: string; methods: apigwv2.HttpMethod[] }[] = [
            { path: '/api/bounties', methods: [apigwv2.HttpMethod.GET] },
            { path: '/api/bountyCategories', methods: [apigwv2.HttpMethod.GET] },
            { path: '/api/createBounty', methods: [apigwv2.HttpMethod.POST] },
            { path: '/api/updateBounty', methods: [apigwv2.HttpMethod.POST] },
            { path: '/api/createBountyCategory', methods: [apigwv2.HttpMethod.POST] },
        ];

        for (const spec of routeSpecs) {
            props.httpApi.addRoutes({
                path: spec.path,
                methods: spec.methods,
                integration,
            });
        }
    }
}
