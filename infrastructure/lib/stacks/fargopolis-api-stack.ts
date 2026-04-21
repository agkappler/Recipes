import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BountiesApiRoutesConstruct } from '../constructs/bounties-api-routes-construct';
import { BountiesConstruct } from '../constructs/bounties-construct';
import { ClerkHttpAuthorizerConstruct } from '../constructs/clerk-http-authorizer-construct';
import { FargopolisHttpApiConstruct } from '../constructs/fargopolis-http-api-construct';

/**
 * Serverless API resources (Lambda, API Gateway, DynamoDB, etc.).
 * Initially contains the bounties vertical; more constructs can be added here later.
 */
export class FargopolisApiStack extends cdk.Stack {
    public readonly bounties: BountiesConstruct;
    public readonly clerkAuthorizer: ClerkHttpAuthorizerConstruct;
    public readonly httpApiGateway: FargopolisHttpApiConstruct;
    public readonly bountiesApi: BountiesApiRoutesConstruct;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        cdk.Tags.of(this).add('Project', 'recipes');

        this.bounties = new BountiesConstruct(this, 'Bounties');

        const clerk = (this.node.tryGetContext('clerk') ?? {}) as {
            jwtIssuer?: string;
            publishableKey?: string;
        };

        this.clerkAuthorizer = new ClerkHttpAuthorizerConstruct(this, 'ClerkAuthorizer', {
            jwtIssuer: clerk.jwtIssuer ?? '',
            publishableKey: clerk.publishableKey ?? '',
        });

        this.httpApiGateway = new FargopolisHttpApiConstruct(this, 'HttpApiGateway', {
            defaultAuthorizer: this.clerkAuthorizer.authorizer,
        });

        this.bountiesApi = new BountiesApiRoutesConstruct(this, 'BountiesApi', {
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
