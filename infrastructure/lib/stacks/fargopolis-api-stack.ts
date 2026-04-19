import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BountiesApiRoutesConstruct } from '../constructs/bounties-api-routes-construct';
import { BountiesConstruct } from '../constructs/bounties-construct';
import { FargopolisHttpApiConstruct } from '../constructs/fargopolis-http-api-construct';

/**
 * Serverless API resources (Lambda, API Gateway, DynamoDB, etc.).
 * Initially contains the bounties vertical; more constructs can be added here later.
 */
export class FargopolisApiStack extends cdk.Stack {
    public readonly bounties: BountiesConstruct;
    public readonly httpApiGateway: FargopolisHttpApiConstruct;
    public readonly bountiesApi: BountiesApiRoutesConstruct;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        cdk.Tags.of(this).add('Project', 'recipes');

        this.bounties = new BountiesConstruct(this, 'Bounties');

        this.httpApiGateway = new FargopolisHttpApiConstruct(this, 'HttpApiGateway');

        this.bountiesApi = new BountiesApiRoutesConstruct(this, 'BountiesApi', {
            httpApi: this.httpApiGateway.httpApi,
            apiKeySecret: this.httpApiGateway.apiKeySecret,
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
        // Never output the secret *value* — it would appear in CloudFormation, consoles, and logs. ARN only.
        new cdk.CfnOutput(this, 'HttpApiWireSecretArn', {
            description:
                'Secrets Manager ARN for the shared wire secret (safe to output). Retrieve apiKey via CLI: aws secretsmanager get-secret-value --secret-id <arn> --query SecretString --output text | jq -r .apiKey',
            value: this.httpApiGateway.apiKeySecret.secretArn,
        });
    }
}
