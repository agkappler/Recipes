import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { BundlingOptions, ILocalBundling } from 'aws-cdk-lib/core';
import { execFileSync } from 'child_process';
import { Construct } from 'constructs';
import * as fs from 'fs';
import * as path from 'path';

export interface BountiesApiRoutesProps {
    /** Shared API — routes are registered here alongside future verticals. */
    readonly httpApi: apigwv2.HttpApi;
    readonly categoryTable: dynamodb.ITable;
    readonly bountyTable: dynamodb.ITable;
}

/**
 * Lambdas root containing `bounties/` and `shared/` (same layout as the Clerk authorizer asset).
 * `pip install -t` runs first; we copy `shared/` afterward so a hypothetical PyPI `shared` package
 * cannot shadow our tree.
 */
function lambdasRootForBounties(): string {
    const candidates = [
        path.join(process.cwd(), 'lambdas'),
        path.join(process.cwd(), 'infrastructure', 'lambdas'),
    ];
    for (const dir of candidates) {
        const handler = path.join(dir, 'bounties', 'handler.py');
        const util = path.join(dir, 'shared', 'lambda_utils.py');
        if (fs.existsSync(handler) && fs.existsSync(util)) {
            return dir;
        }
    }
    throw new Error(
        `Could not find lambdas/bounties + shared/lambda_utils. Tried: ${candidates.join(', ')} (cwd=${process.cwd()})`,
    );
}

/** Host-side copy avoids Docker EPERM reading the bind-mounted repo on macOS. */
function tryBundleBountyHandlerLocally(lambdasRoot: string, outputDir: string): boolean {
    try {
        const requirements = path.join(lambdasRoot, 'bounties', 'requirements.txt');
        const handlerSrc = path.join(lambdasRoot, 'bounties', 'handler.py');
        const sharedSrc = path.join(lambdasRoot, 'shared');
        fs.mkdirSync(outputDir, { recursive: true });
        if (fs.existsSync(requirements)) {
            execFileSync(
                'python3.12',
                [
                    '-m',
                    'pip',
                    'install',
                    '--no-cache-dir',
                    '--platform',
                    'manylinux2014_aarch64',
                    '--implementation',
                    'cp',
                    '--python-version',
                    '3.12',
                    '--only-binary=:all:',
                    '-t',
                    outputDir,
                    '-r',
                    requirements,
                ],
                { stdio: 'inherit', env: process.env },
            );
        }
        fs.copyFileSync(handlerSrc, path.join(outputDir, 'handler.py'));
        fs.cpSync(sharedSrc, path.join(outputDir, 'shared'), { recursive: true });
        return true;
    } catch (e) {
        console.warn('Bounty handler: local bundling failed, falling back to Docker.', e);
        return false;
    }
}

/**
 * Bounties Lambda plus HTTP API routes on the shared {@link FargopolisHttpApiConstruct}.
 * Uses the API-level default Clerk authorizer; writes require a signed-in user (validated JWT).
 */
export class BountiesApiRoutesConstruct extends Construct {
    public readonly handler: lambda.Function;

    constructor(scope: Construct, id: string, props: BountiesApiRoutesProps) {
        super(scope, id);

        const assetPath = lambdasRootForBounties();

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
                    command: [
                        'bash',
                        '-c',
                        [
                            'if [ -f bounties/requirements.txt ]; then python3 -m pip install --no-cache-dir --platform manylinux2014_aarch64 --implementation cp --python-version 3.12 --only-binary=:all: -r bounties/requirements.txt -t /asset-output; fi',
                            'cp bounties/handler.py /asset-output/',
                            'cp -R shared /asset-output/',
                        ].join(' && '),
                    ],
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
