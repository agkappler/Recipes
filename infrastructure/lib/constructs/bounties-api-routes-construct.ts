import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import type { BundlingOptions, ILocalBundling } from 'aws-cdk-lib/core';
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

/** Host-side copy avoids Docker EPERM reading the bind-mounted repo on macOS. */
function tryBundleBountyHandlerLocally(bountiesDir: string, outputDir: string): boolean {
    try {
        fs.mkdirSync(outputDir, { recursive: true });
        fs.copyFileSync(path.join(bountiesDir, 'handler.py'), path.join(outputDir, 'handler.py'));
        return true;
    } catch (e) {
        console.warn('Bounty handler: local bundling failed, falling back to Docker.', e);
        return false;
    }
}

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
 * Uses the API-level default Clerk authorizer; writes require a signed-in user (validated JWT).
 */
export class BountiesApiRoutesConstruct extends Construct {
    public readonly handler: lambda.Function;

    constructor(scope: Construct, id: string, props: BountiesApiRoutesProps) {
        super(scope, id);

        const assetPath = bountiesLambdaAssetPath();

        const localBundling: ILocalBundling = {
            tryBundle(outputDir: string, _options: BundlingOptions): boolean {
                return tryBundleBountyHandlerLocally(assetPath, outputDir);
            },
        };

        this.handler = new lambda.Function(this, 'BountyHandler', {
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: 'handler.handler',
            code: lambda.Code.fromAsset(assetPath, {
                bundling: {
                    local: localBundling,
                    image: lambda.Runtime.PYTHON_3_12.bundlingImage,
                    user: 'root',
                    bundlingFileAccess: cdk.BundlingFileAccess.VOLUME_COPY,
                    command: ['bash', '-c', 'cp handler.py /asset-output/'],
                },
            }),
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
