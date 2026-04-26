# Fargopolis CDK (AWS)

TypeScript [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html) app that provisions API and frontend resources. The entry point is [`bin/recipes-infra.ts`](bin/recipes-infra.ts).

## Stacks

| Stack id | Purpose |
| -------- | ------- |
| **`FargopolisApi`** | HTTP API (API Gateway v2), DynamoDB, Python Lambdas (bounties today; more verticals later). |
| **`FargopolisFrontend`** | Private S3 + CloudFront (OAC) for the Vite SPA build — **not** the same bucket as user file uploads. |

List stacks: `npx cdk list`. Deploy one stack: `npx cdk deploy FargopolisApi` (or `FargopolisFrontend`). Add [`--profile`](#using-a-named-aws-profile) (or set `AWS_PROFILE`) whenever you are not using the default credentials.

## API stack (`FargopolisApi`)

- **[`FargopolisApiStack`](lib/stacks/fargopolis-api-stack.ts)** composes:
  - **[`BountiesConstruct`](lib/constructs/bounties-construct.ts)** — DynamoDB tables for bounty categories and bounties.
  - **[`PythonSharedLayerConstruct`](lib/constructs/python-shared-layer-construct.ts)** — shared `infrastructure/lambdas/shared` code and wheels for Python 3.12 / arm64 handlers.
  - **[`ClerkHttpAuthorizerConstruct`](lib/constructs/clerk-http-authorizer-construct.ts)** — default HTTP API authorizer: verifies Clerk-issued JWTs (issuer from context).
  - **[`FargopolisHttpApiConstruct`](lib/constructs/fargopolis-http-api-construct.ts)** — shared **HTTP API** with CORS; all Lambda-backed routes use this same base URL.
  - **[`BountiesApiRoutesConstruct`](lib/constructs/bounties-api-routes-construct.ts)** — bounties Lambda and routes (reference pattern for the next verticals).

**Outputs (CloudFormation):** `HttpApiUrl`, `BountyCategoriesTableName`, `BountiesTableName` — the SPA and CI set `VITE_API_GATEWAY_URL` to `HttpApiUrl` for strangler traffic to Lambdas.

### Clerk JWT issuer

JWT verification for **mutations** is configured in [`cdk.json`](cdk.json) under `context.clerk.jwtIssuer` (Clerk “Frontend API URL” / issuer). The authorizer Lambda receives this at deploy time. Update the value when you change Clerk instances; then redeploy `FargopolisApi`.

### Python Lambda bundling

Per-function assets live under `infrastructure/lambdas/`. Shared packaging logic: [`lib/python-lambda-bundling.ts`](lib/python-lambda-bundling.ts) (picks a local Python 3.10+ for `pip install`, or Docker as fallback).

## Frontend stack (`FargopolisFrontend`)

**[`FrontendStack`](lib/stacks/frontend-stack.ts)** — SPA hosting only. After deploy, sync `fargopolis-web/dist` to the output bucket and invalidate CloudFront (see repo root [README.md](../README.md) and [`.github/workflows/deploy-static-frontend.yml`](../.github/workflows/deploy-static-frontend.yml)).

## Bootstrap and deploy

From `infrastructure/` (after `npm ci`).

### Using a named AWS profile

The CDK CLI accepts **`--profile`** (same as the AWS CLI). Use it for **every** command that talks to AWS if you are not using the default profile:

| Command | Example |
| -------- | -------- |
| Bootstrap (once per account/region) | `npx cdk bootstrap --profile YOUR_PROFILE` |
| List stacks | `npx cdk list --profile YOUR_PROFILE` |
| Synth | `npx cdk synth --profile YOUR_PROFILE` |
| Deploy all stacks | `npx cdk deploy --all --profile YOUR_PROFILE` |
| Deploy one stack | `npx cdk deploy FargopolisApi --profile YOUR_PROFILE` |

**Alternative:** set the environment for your shell session so you do not repeat the flag:

```bash
export AWS_PROFILE=your-profile-name
npx cdk deploy --all
```

`AWS_PROFILE` and `--profile` behave the same; the flag wins if both are set. With **AWS IAM Identity Center (SSO)**, run `aws sso login --profile YOUR_PROFILE` before deploy when the session has expired.

### One-shot sequence

```bash
cd infrastructure
npm ci
npx cdk bootstrap --profile YOUR_PROFILE   # once per account/region
npx cdk deploy --all --profile YOUR_PROFILE
```

## Adding a new vertical (pattern)

1. New DynamoDB constructs (or items in an existing design) in `lib/constructs/`.
2. New Lambda directory under `infrastructure/lambdas/<name>/` with `requirements.txt` and handler; attach **`PythonSharedLayerConstruct`** if you import `shared/`.
3. New routes construct: register integrations on the **same** `HttpApi` from `FargopolisHttpApiConstruct` (see `BountiesApiRoutesConstruct`).
4. Wire the construct into `FargopolisApiStack` and add `CfnOutput`s as needed.

See the migration checklist at repo root: [`../recipes_dnd_migration.plan.md`](../recipes_dnd_migration.plan.md).
