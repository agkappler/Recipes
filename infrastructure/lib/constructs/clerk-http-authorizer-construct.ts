import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import * as cdk from 'aws-cdk-lib';
import type { BundlingOptions, ILocalBundling } from 'aws-cdk-lib/core';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

/** Clerk JWT verification for the shared HTTP API default authorizer. CDK context key `clerk`. */
export interface ClerkHttpAuthorizerProps {
    readonly jwtIssuer: string;
}

/**
 * Prefer host-side bundling: Docker bind mounts often hit EPERM reading the repo on macOS
 * (Documents/iCloud, privacy). Falls back to Docker with VOLUME_COPY if local pip fails.
 */
function tryBundleClerkAuthorizerLocally(lambdasRoot: string, outputDir: string): boolean {
    try {
        const requirements = path.join(lambdasRoot, 'clerk_authorizer', 'requirements.txt');
        fs.mkdirSync(outputDir, { recursive: true });
        execFileSync(
            'python3',
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
        fs.copyFileSync(path.join(lambdasRoot, 'clerk_authorizer', 'handler.py'), path.join(outputDir, 'handler.py'));
        fs.mkdirSync(path.join(outputDir, 'shared'), { recursive: true });
        fs.copyFileSync(path.join(lambdasRoot, 'shared', 'clerk_auth.py'), path.join(outputDir, 'shared', 'clerk_auth.py'));
        fs.copyFileSync(path.join(lambdasRoot, 'shared', '__init__.py'), path.join(outputDir, 'shared', '__init__.py'));
        return true;
    } catch (e) {
        console.warn('Clerk authorizer: local bundling failed, falling back to Docker.', e);
        return false;
    }
}

/**
 * Lambda authorizer + {@link HttpLambdaAuthorizer} for use as {@link apigwv2.HttpApiProps.defaultAuthorizer}.
 * Attach once on the API so every route inherits it unless a route overrides with `authorizer: undefined`
 * or another authorizer.
 */
export class ClerkHttpAuthorizerConstruct extends Construct {
    public readonly handler: lambda.Function;
    public readonly authorizer: apigwv2.IHttpRouteAuthorizer;

    constructor(scope: Construct, id: string, props: ClerkHttpAuthorizerProps) {
        super(scope, id);

        const bundlePath = lambdasBundleRootPath();

        const authorizerEnv: Record<string, string> = {
            CLERK_JWT_ISSUER: props.jwtIssuer,
        };

        const localBundling: ILocalBundling = {
            tryBundle(outputDir: string, _options: BundlingOptions): boolean {
                return tryBundleClerkAuthorizerLocally(bundlePath, outputDir);
            },
        };

        this.handler = new lambda.Function(this, 'ClerkAuthorizer', {
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: 'handler.handler',
            code: lambda.Code.fromAsset(bundlePath, {
                bundling: {
                    local: localBundling,
                    image: lambda.Runtime.PYTHON_3_12.bundlingImage,
                    user: 'root',
                    /** If bind mounts block reads (macOS), copy via temp container instead. */
                    bundlingFileAccess: cdk.BundlingFileAccess.VOLUME_COPY,
                    command: [
                        'bash',
                        '-c',
                        [
                            'pip install --no-cache-dir -r clerk_authorizer/requirements.txt -t /asset-output',
                            'cp clerk_authorizer/handler.py /asset-output/',
                            'mkdir -p /asset-output/shared',
                            'cp shared/clerk_auth.py /asset-output/shared/',
                            'cp shared/__init__.py /asset-output/shared/',
                        ].join(' && '),
                    ],
                },
            }),
            architecture: lambda.Architecture.ARM_64,
            timeout: cdk.Duration.seconds(10),
            memorySize: 256,
            environment: authorizerEnv,
        });

        this.authorizer = new HttpLambdaAuthorizer('ClerkJwtAuthorizer', this.handler, {
            responseTypes: [HttpLambdaResponseType.SIMPLE],
            /** Always invoke authorizer so public GETs work without `Authorization` (see AWS HTTP API docs). */
            identitySource: [],
            resultsCacheTtl: cdk.Duration.seconds(0),
        });
    }
}

/** Directory that contains both `clerk_authorizer/` and `shared/` (single Docker volume mount). */
function lambdasBundleRootPath(): string {
    const candidates = [
        path.join(process.cwd(), 'lambdas'),
        path.join(process.cwd(), 'infrastructure', 'lambdas'),
    ];
    for (const dir of candidates) {
        const handler = path.join(dir, 'clerk_authorizer', 'handler.py');
        const shared = path.join(dir, 'shared', 'clerk_auth.py');
        if (fs.existsSync(handler) && fs.existsSync(shared)) {
            return dir;
        }
    }
    throw new Error(
        `Could not find lambdas/clerk_authorizer and lambdas/shared. Tried under cwd=${process.cwd()}`,
    );
}
