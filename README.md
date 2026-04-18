# Recipes aka Fargopolis
This platform was built as a personal project to explore different technologies, manage my own recipes, gamify recurring tasks as bounties, and organize Dungeons & Dragons characters. It's also a way to showcase my work and experiment with new ideas. Feel free to explore and see what I've been working on!

## Startup
#### Backend
Navigate to `java-recipes` directory
./gradlew build
./gradlew bootrun
api endpoint localhost:8080

#### Frontend (Vite SPA)
From the repo root, enable Corepack if needed (`corepack enable`), then:

```bash
cd fargopolis-web
pnpm install
cp .env.example .env   # set VITE_API_URL to your API origin, e.g. http://localhost:8080
pnpm dev
```

The dev server listens on port **3000** (see `vite.config.ts`). The legacy Next app remains under `recipe-site/` until you remove it.

## AWS: CDK static hosting (`fargopolis-web`)

Infrastructure for the Vite app lives in **`infrastructure/`**: a private S3 bucket, CloudFront (with OAC), and SPA-style error routing. The stack id is **`FargopolisFrontend`**.

### Prerequisites

- Node.js (LTS) and npm
- AWS CLI configured (`aws sts get-caller-identity` succeeds)
- IAM permissions sufficient to create the stack (bootstrap and deploy need CloudFormation plus IAM, S3, CloudFront, and related resources—or use a profile with admin/bootstrap rights)

### One-time bootstrap (per AWS account and region)

If this account/region has never been CDK-bootstrapped:

```bash
cd infrastructure
npm ci
npx cdk bootstrap
```

Use `--profile YOUR_PROFILE` if you rely on named credentials. Bootstrap only needs to succeed once per account/region.

### Deploy or update the stack

```bash
cd infrastructure
npm ci
npx cdk deploy
```

With a named profile:

```bash
npx cdk deploy --profile YOUR_PROFILE
```

After a successful deploy, note the CloudFormation **Outputs**: **SiteBucketName**, **CloudFrontDistributionId**, and **SiteUrl**. Upload the Vite build to the bucket and invalidate CloudFront (see `.github/workflows/deploy-static-frontend.yml` for the CI version using repo secrets).
