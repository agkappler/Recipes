import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { BountiesApiRoutesConstruct } from '../constructs/bounties-api-routes-construct';
import { BountiesConstruct } from '../constructs/bounties-construct';
import { ClerkHttpAuthorizerConstruct } from '../constructs/clerk-http-authorizer-construct';
import { FargopolisHttpApiConstruct } from '../constructs/fargopolis-http-api-construct';
import { PythonSharedLayerConstruct } from '../constructs/python-shared-layer-construct';

/**
 * Serverless API resources (Lambda, API Gateway, DynamoDB, etc.).
 * Initially contains the bounties vertical; more constructs can be added here later.
 */
export class FargopolisApiStack extends cdk.Stack {
    public readonly bounties: BountiesConstruct;
    /** Shared `shared` package + common wheels; attach to new Python 3.12 arm64 handlers that import it. */
    public readonly pythonSharedLayer: lambda.LayerVersion;
    public readonly clerkAuthorizer: ClerkHttpAuthorizerConstruct;
    public readonly httpApiGateway: FargopolisHttpApiConstruct;
    public readonly bountiesApi: BountiesApiRoutesConstruct;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        cdk.Tags.of(this).add('Project', 'recipes');

        this.bounties = new BountiesConstruct(this, 'Bounties');

        this.pythonSharedLayer = new PythonSharedLayerConstruct(this, 'PythonShared').layer;

        const clerk = (this.node.tryGetContext('clerk') ?? {}) as {
            jwtIssuer?: string;
        };

        this.clerkAuthorizer = new ClerkHttpAuthorizerConstruct(this, 'ClerkAuthorizer', {
            pythonSharedLayer: this.pythonSharedLayer,
            jwtIssuer: clerk.jwtIssuer ?? '',
        });

        this.httpApiGateway = new FargopolisHttpApiConstruct(this, 'HttpApiGateway', {
            defaultAuthorizer: this.clerkAuthorizer.authorizer,
        });

        this.bountiesApi = new BountiesApiRoutesConstruct(this, 'BountiesApi', {
            pythonSharedLayer: this.pythonSharedLayer,
            httpApi: this.httpApiGateway.httpApi,
            categoryTable: this.bounties.categoryTable,
            bountyTable: this.bounties.bountyTable,
        });

        new cdk.CfnOutput(this, 'BountyCategoriesTableName', {
            description: 'DynamoDB table for bounty categories',
            value: this.bounties.categoryTable.tableName,
        });
        new cdk.CfnOutput(this, 'BountiesTableName', {
            description: 'DynamoDB table for bounties',
            value: this.bounties.bountyTable.tableName,
        });
        new cdk.CfnOutput(this, 'HttpApiUrl', {
            description: 'Shared HTTP API base URL (all Lambda routes; use with /api/... paths)',
            value: this.httpApiGateway.httpApi.apiEndpoint,
        });
    }
}
