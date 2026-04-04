---
name: Lambda DynamoDB migration
overview: Incremental migration from Spring Boot + PostgreSQL to AWS Lambda + DynamoDB. **Decisions:** JWT auth, **first vertical = bounties**, **two DynamoDB tables**, **CDK in TypeScript**, **Lambda handlers: Python first** (bounties), **Go optional** for a later vertical or function. Strangler routing keeps Java on unmigrated routes until cutover.
todos:
  - id: pick-vertical
    content: Choose first vertical and auth approach (sessions vs JWT/Cognito)
    status: completed
  - id: jwt-design
    content: "Pick issuance path (Cognito vs custom vs external IdP); wire API Gateway authorizer + claims; Next.js token storage + Bearer header"
    status: pending
  - id: ddb-model
    content: "Define keys for BountyCategories and Bounties tables (PK, optional SK/GSI for list-by-category if needed)"
    status: pending
  - id: handler-runtime
    content: "Bounties slice: Python 3.12 + boto3; later slice optional Go — document in stack when added"
    status: completed
  - id: go-handler-later
    content: "Optional follow-up: new Lambda or vertical in Go after AWS patterns are stable (binary zip, arm64)"
    status: pending
  - id: local-dev-workflow
    content: "Define dev vs prod isolation, shared dev Dynamo OK; document local HTTP dev server + .env for Next; cdk watch/hotswap to dev"
    status: pending
  - id: cdk-bounties-stack
    content: "Add CDK (TypeScript) app/stack: DynamoDB tables, Python Function + bundling (asset/layer), HTTP API, IAM, JWT authorizer, CfnOutputs"
    status: pending
  - id: bounties-lambda
    content: "Implement bounty handlers in Python; wire handler + IAM env (table names) from CDK"
    status: pending
  - id: routing
    content: Point bounties UI to new base URL or API Gateway paths; keep legacy Java for other features
    status: pending
  - id: files-auth
    content: Defer S3/presigned uploads until a files vertical; JWT works for API auth first
    status: pending
isProject: false
---

# Lambda + DynamoDB migration (updated decisions)

## How to use this plan (moving forward)

- **Canonical location (this repo):** Root file [`lambda_dynamodb_migration.plan.md`](lambda_dynamodb_migration.plan.md) — **edit this file** for all plan changes so git history stays accurate. If Cursor’s **Plans** UI still has a copy, treat **this path as source of truth** (or delete the duplicate after confirming sync) so nothing drifts.
- **Optional:** One line in [`README.md`](README.md) pointing to `./lambda_dynamodb_migration.plan.md` for discoverability.
- **Single source of truth:** This file is the **architecture + checklist**; update it when decisions change (e.g. locking **Cognito** for JWT).
- **Todos:** The YAML **`todos`** at the top are the **work queue**. Mark items **`completed`** in this file as you finish them (or mirror them in GitHub Issues / Jira if you prefer — keep one place authoritative).
- **New chats:** Reference **`lambda_dynamodb_migration.plan.md`** at repo root (or attach it) and say “continue the bounties / Lambda migration per plan.”
- **Per vertical:** After bounties ships, **copy the same phases** (tables → handler → API → auth → frontend) for the next feature; extend **this** doc or add new sections below — no separate index required unless the file grows unwieldy.
- **Do not delete Java** until an explicit cutover milestone (already a locked rule).

## Implementation order (where to start)

Work **top to bottom**; later phases depend on earlier ones. This aligns with the **`todos`** list.

### Phase 0 — Tooling and AWS access

- **AWS:** Dev (or single non-prod) **account/region** decided; **`AWS_PROFILE`** (or SSO) works from CLI (`aws sts get-caller-identity`).
- **CDK bootstrap:** `cdk bootstrap aws://ACCOUNT/REGION` once per account/region.
- **Install:** Node.js (LTS), `aws-cdk` / `npx cdk`, Python **3.12**, `python -m venv` for handler projects.

### Phase 1 — CDK app skeleton (`local-dev-workflow` + start of `cdk-bounties-stack`)

- Add **`infra/`** (or `cdk/`) at repo root: `cdk init app --language typescript`.
- **`context`** in `cdk.json`: e.g. `env=dev`, `region`, optional `account`; stacks **name-suffixed** by env so prod is never ambiguous.
- First **`cdk synth`** and **`cdk deploy`** with an **empty or minimal** stack to validate pipeline and profile.

### Phase 2 — DynamoDB model + tables (`ddb-model`)

- Define **`BountyCategories`** and **`Bounties`** tables (PKs, optional GSI) in CDK — match the **Two-table sketch** section of this plan.
- **`cdk deploy`** to dev; **`CfnOutput`** table names (or pass as env to Lambda later).
- Optional: **data backfill** script Postgres → Dynamo (one-off) when you are ready to mirror real data — not blocking “hello world.”

### Phase 3 — Python handlers + local HTTP server (`bounties-lambda` + local dev section)

- Create **`lambdas/bounties/`** (or similar): **service layer** (Dynamo access) + thin **Lambda entry** that delegates to it.
- Add **FastAPI** (or Flask) **`dev_server.py`**: same routes as API Gateway will expose; **`AWS_PROFILE=dev`**; boto3 → **same dev tables** as Phase 2 (**shared dev DB**).
- **`NEXT_PUBLIC_BOUNTIES_API_URL=http://localhost:…`** in **`recipe-site/.env.local`** while iterating.
- Implement **read** paths first (`GET /bounties`, `GET /bountyCategories`), then writes.

### Phase 4 — Lambda + HTTP API in AWS (`cdk-bounties-stack`)

- **CDK:** `lambda.Function` (Python 3.12), **IAM** `dynamodb:GetItem`/`Query`/`Scan`/`PutItem`/… on the two tables; env vars = table names.
- **API Gateway HTTP API:** routes → Lambda integrations; **path design** should mirror existing Java paths under **`/api`** (or document differences if frontend uses a small adapter).
- **`cdk deploy` to dev**; point Next at **dev API URL** instead of localhost to verify **deployed** behavior.

### Phase 5 — JWT (`jwt-design`)

- **Lock** issuance path (Cognito vs custom vs external) using the **JWT section** of this plan.
- **CDK:** JWT authorizer (or Lambda authorizer) on **write** and **read** routes as needed; **Cognito** outputs if applicable.
- **`RequestManager`:** **`Authorization: Bearer`** for bounties; token storage per your security choice.
- Mark **`jwt-design`** **completed** in the frontmatter when authorizer + login flow work end-to-end in dev.

### Phase 6 — Strangler cutover (`routing`)

- Reserve **`NEXT_PUBLIC_BOUNTIES_API_URL`** for **dev/staging** API; production promotion only via your release process.
- **Java stays** in repo; bounties UI simply **stops calling** old Java paths for those operations when you trust the new API.
- Parity checks, then soak; **do not remove** Java bounties code until explicitly decided.

### After bounties

- Optional **`go-handler-later`**; next **vertical** repeats Phases 2–6 (tables, handler, API, auth touchpoints, frontend env).
- **`files-auth`** when you tackle uploads (S3, etc.).

## Locked-in decisions


| Decision           | Choice           | Notes                                                                                                                                                                                                                                |
| ------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Auth**           | **JWT**          | Replaces browser session cookies for migrated clients. API Gateway JWT authorizer (Cognito or custom issuer) or validate in Lambda.                                                                                                  |
| **First vertical** | **Bounties**     | Smallest relational surface: two Postgres tables, no `rel_*` join tables. Good proving ground for Lambda + Dynamo modeling.                                                                                                          |
| **DynamoDB (bounties)** | **Two tables** | **`BountyCategories`** and **`Bounties`** as separate DynamoDB tables — mirrors Postgres, simple keys, clear IAM/backup per entity. Link: store `categoryId` on each bounty; resolve category with `GetItem` on the categories table (or denormalize category name on bounty for fewer reads). |
| **IaC** | **AWS CDK (TypeScript)** | New AWS resources for this vertical are defined in **CDK** (`aws-cdk-lib`, constructs in TS), not one-off console setup — versioned, reviewable, repeatable per environment (`cdk deploy`). |
| **Lambda handlers** | **Python first; Go later (optional)** | **Bounties:** Python (**not** Node — still avoids TS in handlers). **Later:** optional **Go** function or vertical for binaries/cold-starts practice. **CDK** remains TypeScript. |
| **Java during migration** | **Do not delete** | Keep **`java-recipes`** and all Spring/JDBC code **intact** while the strangler runs. Route traffic away from Java per vertical only after the new path is proven; **removal** of Java is an explicit **end-of-migration** (or never) decision — not part of each slice. |

## AWS CDK (TypeScript) for new entities

- **Scope:** Provision **DynamoDB** tables (`BountyCategories`, `Bounties`), **Lambda** function(s) for bounty APIs, **API Gateway** (HTTP API is often simpler/cheaper; REST if you need features HTTP API lacks), **IAM** roles/policies (Lambda → DynamoDB least privilege), and **JWT authorizer** (or integration config) as decided — all from **CDK stacks** written in **TypeScript**.
- **CDK vs handler language:** **CDK always TypeScript.** Bounties use **`lambda.Function` + `Runtime.PYTHON_3_12`** and **`PythonFunction`** or **`Code.fromAsset`** with **`BundlingOptions`** / **Lambda layer** for dependencies — e.g. `infra/` (CDK) + `lambdas/bounties/` (Python). A **later** Go Lambda uses **`provided.al2023`** / **`go1.x`** (legacy) or **custom `bootstrap`** zip from **`Code.fromAsset`** when you add that slice.
- **Outputs:** Export **API base URL** and any needed ids (table names, user pool id if using Cognito) via **`CfnOutput`** so `NEXT_PUBLIC_BOUNTIES_API_URL` (or CI) can be set after deploy.
- **Later verticals:** Add constructs or nested stacks for additional Lambdas/tables without abandoning CDK — keeps one IaC story.

## Local development (fast iteration, low risk to production)

**Goal:** Change **Python handlers** and **infra** quickly without touching **prod** resources or customer traffic.

### Isolate production

| Layer | Practice |
|-------|-----------|
| **AWS accounts** | **Best:** separate **dev** (and optional **staging**) account from **prod**. Deploy experiments only to dev from your laptop. |
| **CDK stages** | Single repo, **`context` / env** (e.g. `env=dev` vs `env=prod`) that drives **stack names**, **resource suffixes** (`Bounties-dev`), and **removal policies** (dev: destroy OK; prod: retain / termination protection). |
| **Credentials** | Use **`AWS_PROFILE`** (or SSO) so **prod** is never the default profile on a dev machine unless intentional. |
| **Frontend** | **`NEXT_PUBLIC_BOUNTIES_API_URL`** for **local** work can point at a **local-only HTTP server** (see below), **dev API Gateway**, or a mock — **never prod** for experiments. Use `.env.local` / CI secrets per environment. |
| **Guardrails (optional)** | In CDK, **assert** `Stack.account` / tags before `prod` deploys; enable **termination protection** only on prod stacks. |

### Shared dev database (explicitly okay here)

- **One non-prod DynamoDB** (same tables) used by both **deployed dev Lambda** and **your laptop** is **productive**: no drift between “what local sees” and “what dev stack sees,” and boto3 on your machine talks to the **real** DynamoDB API (transactions, indexes, etc. match prod class of service).
- **Still not production:** keep this **dev/staging** account or at least **dev-named** tables — just don’t insist on a *second* copy of data for “local vs cloud dev.”
- **Caveats:** (1) **Destructive tests** (delete table, wipe items) affect anyone else using the same dev DB — coordinate or use **separate test prefixes** / disposable items. (2) **Credentials** on the laptop must have IAM to those tables only via **dev profile**. (3) If **two writers** run concurrently (local server + dev Lambda), you get normal distributed-system behavior — fine for personal dev.

### Local-only HTTP server (yes, very productive)

Run a **small FastAPI or Flask app** on `localhost` that **reuses the same Python modules** as the Lambda handler (extract **`handle(event, context)`** core into callables that take route + body + auth headers).

| Piece | Role |
|-------|------|
| **Server** | Maps HTTP routes (`GET /bounties`, …) to the same logic Lambda uses; returns JSON like API Gateway. |
| **DynamoDB** | boto3 uses **`AWS_PROFILE`** (dev) → same **dev** tables as deployed Lambdas if you choose the shared-DB approach. |
| **JWT** | **Option A:** Forward `Authorization` and use valid **dev** tokens. **Option B (local only):** env flag `ALLOW_INSECURE_LOCAL_AUTH=1` or a **fixed dev secret** — **never** enable in Lambda; document clearly. |
| **Next.js** | `.env.local`: `NEXT_PUBLIC_BOUNTIES_API_URL=http://localhost:8xxx` while iterating on handlers; switch to dev Gateway URL when testing authorizers/CORS end-to-end. |

**Why it helps:** **Sub-second** restarts, debugger breakpoints, and no **deploy** for every line change — while still hitting **real DynamoDB** (if you want). Periodically **`cdk deploy`** to dev to confirm **Lambda packaging**, **IAM**, and **API Gateway JWT** behavior still match.

**Related:** **Mangum** (wrap FastAPI for Lambda) can keep **one** ASGI app for both local **uvicorn** and Lambda — optional pattern to avoid drift.

### Fast iteration loops (combine as you like)

1. **Local HTTP server + shared dev Dynamo** — Tightest loop for **handler + DB** logic; Next points at localhost.
2. **Deploy to dev AWS only** — After handler changes, **`cdk deploy`** (with `--profile` + dev context) updates **dev** Lambda + API. Use **CDK `watch`** or **hotswap**-style workflows where supported so **code-only** changes redeploy in **seconds** without full CloudFormation churn. Validates **API Gateway**, **JWT authorizer**, and **IAM** as deployed.
3. **Unit tests** — Factor **core logic**; **`pytest`** + **`moto`** or stubs for fast tests **without** network.
4. **DynamoDB Local (optional)** — If you later want **offline** or **destructive** experiments without touching shared dev data — optional extra; not required if shared dev DB is acceptable.
5. **SAM / RIE (optional)** — **AWS SAM CLI** `local invoke` or **Lambda RIE** in Docker when debugging “only in Lambda” packaging issues.

### What to avoid

- **No prod deploy** from ad-hoc scripts without review; treat **`cdk deploy`** to prod as a **release** step (CI + approval).
- **Do not** point local Next.js at **prod** API when testing destructive operations on bounties.

**Summary:** Prefer **dev account + non-prod profile**; **sharing one dev Dynamo between local runs and deployed dev** is fine if you accept coordination on destructive ops. Use a **local-only HTTP server** for the fastest handler iteration (Next → `localhost`); **`cdk deploy` to dev** to validate Lambda + API Gateway + JWT periodically. Prod stays untouched until **promotion**.

## Lambda handler language (locked staged plan)

**Locked:** **Python** for the **bounties** slice (fast path, boto3, you already know it). **Go** intentionally **deferred** — introduce for a **later** vertical or an additional Lambda when CDK + Dynamo + auth patterns feel routine.

**Reference — other runtimes** (not the current slice):

| Language | Pros for learning | CDK integration notes |
|----------|-------------------|------------------------|
| **Go** | Small binaries, fast cold starts, official AWS SDK v2 | Build `GOOS=linux GOARCH=arm64` (or amd64) `bootstrap` → zip; `CommandHooks` or Makefile before deploy |
| **Python** | Fastest to ship CRUD, huge examples | `Runtime.PYTHON_3_12`, bundle deps in asset or **Lambda layer** |
| **Rust** | Performance, ownership model practice | **cargo-lambda** artifact or Docker bundling; more setup |
| **Kotlin (JVM)** | JVM without Spring; closer to Java background | **Java** runtime or **SnapStart**; fat JAR or custom runtime |

**Operational note:** Use **ARM (Graviton)** Lambdas if you standardize on **arm64** builds — slightly cheaper; match **architecture** in CDK to your zip/binary.

### Python vs Go (tradeoffs, including “most useful experience”)

| Dimension | **Python** | **Go** |
|-----------|------------|--------|
| **Time to first working bounty API** | **Faster** — you already know it; **boto3** is ubiquitous; small handlers are a few files | Slower ramp: modules, AWS SDK v2 patterns, **linux/arm64** cross-compile, `bootstrap` zip discipline |
| **What you learn that’s *new*** | Mostly **AWS Lambda + API Gateway + DynamoDB + CDK wiring**; language surface is familiar | **New:** static typing + **interfaces**, explicit error handling, **small static binaries**, goroutines if you add concurrency; culture of “simple deploy artifact” matches many **infra / platform** tools |
| **Cold start & cost at low traffic** | Heavier runtime; **mitigate** with arm64, slim deps, **Lambda SnapStart N/A for Python** in same way as Java — generally **Go wins** on tail latency | **Usually faster cold start** and smaller package than a typical Python zip with deps |
| **Packaging** | `pip` + **layer** or vendored `site-packages` in asset; watch **bundle size** | Single **binary** in zip; reproducible builds; **no** interpreter on the image |
| **Ecosystem for this stack** | Huge examples for Lambda+DynamoDB; stacks overflow | Official AWS SDK v2 for Go is excellent; slightly fewer “copy-paste tutorial” hits than Python |
| **Overlap with TypeScript CDK** | Dynamic typing + gradual typing — mental model partly similar to TS | Forces different habits (**explicit errors, no exceptions for flow**) — **broader** skill stretch |
| **“Moving forward” signal** | Great if next steps are **data, scripting, ML ops, or rapid backend iteration** | Great if next steps are **platform eng, Kubernetes-adjacent tooling, high-performance services, or shipping tiny binaries** |

**Pragmatic read:** If the main goal is **finish the migration with low risk**, **Python** is the rational pick. If the main goal is **maximize new durable skills** *beyond* “yet another dynamically typed service,” **Go** tends to pay off longer for **cloud-native / backend** work — at the cost of a steeper first slice. **You chose** the hybrid: **Python now**, **Go when ready**.

### Staged learning (locked)

1. **Now:** Bounties handlers in **Python** — learn Lambda, API Gateway JWT, DynamoDB, CDK integration with minimal language friction.
2. **Later:** Add a **Go** handler (new function or migrated route) using the same CDK app — reuse VPC-less patterns, **arm64** `bootstrap` zip, AWS SDK v2.

## Why two tables (locked)

- Matches **two source tables** (`bounty_categories`, `bounties`) and the **FK** pattern you already have.
- **List + get-by-id** for each entity type maps cleanly: partition key = stable id (or use a single partition + SK only if you intentionally want one hot partition — usually avoid for growth).
- Later verticals (e.g. heavy `rel_*`) can still use **additional** tables or a **different** single-table design where needed; the bounties slice does not commit the whole app to one table.

## Bounties vertical — scope (current Java)

`[BountyController](java-recipes/src/main/java/com/fargopolis/controllers/BountyController.java)` under `/api`:


| Method | Path                    | Permission |
| ------ | ----------------------- | ---------- |
| GET    | `/bounties`             | canRead    |
| POST   | `/createBounty`         | canWrite   |
| POST   | `/updateBounty`         | canWrite   |
| GET    | `/bountyCategories`     | canRead    |
| POST   | `/createBountyCategory` | canWrite   |


Data today: `[BountyService](java-recipes/src/main/java/com/fargopolis/services/BountyService.java)` → `bounties` (columns include `category_id`); `[BountyCategoryService](java-recipes/src/main/java/com/fargopolis/services/BountyCategoryService.java)` → `bounty_categories`. **No join tables** in this slice — only a FK from bounty → category.

## Two-table DynamoDB sketch (bounties)

**`BountyCategories` table**

- **PK:** `categoryId` (string or number — align with migrated ids).
- **Attributes:** `name`, etc., matching [`BountyCategory`](java-recipes/src/main/java/com/fargopolis/models/BountyCategory.java).
- **List all categories:** `Scan` (acceptable if the set stays small) or a **GSI**/shared partition pattern if the list grows large.

**`Bounties` table**

- **PK:** `bountyId`.
- **Attributes:** `title`, `description`, `status`, `categoryId`, `expirationDate`, etc., matching [`Bounty`](java-recipes/src/main/java/com/fargopolis/models/Bounty.java).
- **Optional GSI:** `categoryId` as GSI PK if you need **query bounties by category** without scanning.

**Later domains:** recipes/D&D/`rel_*` can introduce **more** tables or a dedicated single-table design in a **separate** migration — not required to match the bounties layout.

## JWT: issuance options and validation

**Issuance** is who creates and signs the JWT after the user proves identity (password, OAuth, etc.). **Validation** is API Gateway (or Lambda) verifying signature, `exp`, `iss`, `aud` before your bounty handlers run.

### Option A — Amazon Cognito User Pools (most common on AWS)

- **Issuance:** Users authenticate via **Cognito** (Hosted UI, or `InitiateAuth` from your Next app with USER_PASSWORD_AUTH / SRP). Cognito returns **ID token**, **access token**, and **refresh token** (JWTs for id/access).
- **API calls:** Send **`Authorization: Bearer <access_token>`** (or ID token depending on resource-server setup; for API Gateway JWT authorizer, configure **audience** = Cognito **app client id** and use the token type Cognito documents for that authorizer — typically **access token** for custom scopes, **ID token** for simpler setups).
- **Validation:** **HTTP API JWT authorizer** or **REST API JWT** — point **issuer** at `https://cognito-idp.<region>.amazonaws.com/<userPoolId>` and provide **audience** (app client id). No custom authorizer code if claims are enough.
- **Custom claims (e.g. `canRead` / `canWrite`):** Add via **Cognito pre token generation** Lambda trigger, or map groups to claims.
- **Pros:** Managed users, MFA, password reset, lockout, **CDK** `UserPool` + `UserPoolClient` — little crypto code.
- **Cons:** Cognito-specific behavior and limits; migrating existing password hashes from Java may need a **migration** flow or one-time password reset.

### Option B — Custom JWT from your Lambda (full control)

- **Issuance:** After your **login Lambda** validates credentials (e.g. against **DynamoDB** users migrated from Postgres, or by calling legacy Java once), **sign** a JWT.
  - **HS256:** Single **symmetric** secret in **Secrets Manager**; simple; API validates with same secret (Lambda authorizer or HTTP API JWT if you expose issuer/JWKS — HTTP API JWT authorizer prefers **asymmetric** issuers; often people use a **Lambda authorizer** for HS256).
  - **RS256 / ES256:** **Asymmetric** key in **KMS** or stored public key; publish **JWKS** URL for API Gateway JWT authorizer — better for rotation and public verification.
- **Authorization:** Put **`canRead` / `canWrite`** (or roles) in claims at sign time.
- **Pros:** Same flow as today’s mental model (your code owns login); easy to prototype.
- **Cons:** **You** own threat model, rotation, rate limiting, and secure password storage; more code than Cognito.

### Option C — External IdP (Auth0, Clerk, Okta, etc.)

- **Issuance:** User logs in with the provider; JWTs issued with their **issuer** and **audience**.
- **Validation:** API Gateway JWT authorizer with that issuer’s **JWKS** URL and your app’s **audience**.
- **Pros:** Product features (Auth0 rules, Clerk components), less AWS-specific.
- **Cons:** Cost, another vendor; still need to map identities to your **permissions** (groups/claims or lookup in Lambda).

### Option D — Hybrid during the strangler (practical)

- **Legacy:** Cookie session → Java for unmigrated routes.
- **New bounties API:** JWT from **Cognito** or **custom** as above. Users may **log in twice** until you unify on one login that issues the JWT (or bridge Java session → token exchange — more work).

### What to put in tokens

- **Standard:** `sub` (user id), `exp`, `iat`, `iss`, `aud`.
- **App:** Custom claims or groups for **read/write** to replace `[PermissionsService](java-recipes)` checks in Lambda.
- **Refresh:** Prefer **refresh token** (opaque or JWT) with short **access token** TTL; store refresh securely (httpOnly cookie or secure storage per your threat model).

### Frontend (all options)

- `[RequestManager](recipe-site/app/_helpers/RequestManager.ts)` — add **`Authorization: Bearer <access_token>`** for bounties calls; keep **unmigrated** pages on `credentials: "include"` to Java until unified.

**Recommendation sketch:** If you want **least custom crypto** and are fine migrating users into Cognito over time → **Option A**. If you must **keep existing password hashes and login flow** longer → **Option B** for the first slice, with a path to Cognito later. Lock **A vs B vs C** in `jwt-design` before wiring CDK authorizers.

## Strangler routing

- `**NEXT_PUBLIC_BOUNTIES_API_URL`** (or similar) for bounties-only requests to API Gateway, **or** single host with path-based routes — either works; env split is usually fastest for a first slice.
- Java + Postgres **unchanged** for non-bounty routes until those verticals migrate.
- **Do not delete or gut Java during migration:** Treat `[java-recipes](java-recipes)` as the **source of truth** and **fallback** until each vertical is fully cut over and you deliberately choose decommissioning. Bounties may stop **receiving** frontend traffic for those paths, but **leave the code and DB paths in place** until the team agrees it is safe to remove (often after parity tests and a soak period). This avoids dead-ends if you need to **roll back** or **compare** behavior.

## Should we pivot off Java because of Lambda?

**No — Lambda does not force dropping Java.** AWS Lambda has a **Java runtime**; you *could* implement new handlers in Java and deploy JARs from CDK if you wanted one language end to end.

**What usually happens in this kind of migration:**

| Approach | Meaning |
|----------|---------|
| **Coexist (strangler)** | **New** verticals on **Lambda + Dynamo** with **CDK (TS) + handler language of choice**. **Existing** app stays on **Spring + PostgreSQL** until each domain is ported. **No big-bang rewrite.** |
| **Gradual pivot** | Over time, **more Lambdas**, **less Java**. When the **last** routes and data depend on Java + Postgres, **decommission** the Spring service and shrink or retire the RDS footprint for app data. |
| **Stay multi-runtime** | Some teams keep **a small Java Lambda** for a library-heavy edge case; most handlers in TS/Python. Uncommon for a green slice but valid. |

**Your split:** **TypeScript for CDK only**; **handlers in Python** for bounties, **Go later** if you want static binaries / different idioms. CDK stays the “glue”; Python zips (and later maybe Go `bootstrap` zips) ship as assets.

**Bottom line:** Treat **“pivot off Java”** as a **product/roadmap** goal (**retire Spring when everything is migrated**), not as a Lambda requirement. **Short term:** hybrid is expected and healthy. **Long term:** yes — if you complete the strangler, you **can** shut down Java for this API surface entirely.

## What you have today (unchanged summary)

- Spring MVC + hand-written JDBC on PostgreSQL; `rel_`* and joins appear in **other** services (recipes, D&D), not in bounties.
- Current frontend uses `credentials: "include"` for session auth — **bounties slice on Lambda will use JWT** as above; full-site JWT cutover can trail the first vertical.

## Summary

- **Bounties first** with **two DynamoDB tables** (categories + bounties): straightforward mapping from Postgres and clear ownership per table.
- **AWS CDK (TypeScript)** defines the new tables, Lambdas, API Gateway, and related IAM/auth wiring — extend the same app as more verticals migrate.
- **Local dev:** **Dev** profile/stack; **shared dev Dynamo** between laptop and dev Lambdas is OK; **local-only HTTP server** (e.g. FastAPI) for fastest iteration + **periodic `cdk deploy`** to validate Lambda/Gateway/JWT — keep **prod** off the default path.
- **JWT** simplifies API Gateway + Lambda compared to sticky sessions; align issuer/claims with future Cognito or custom auth.
- **Java:** **Coexist** during migration; **do not delete Java** as part of incremental slices — **optional full retirement** only as an **explicit later** decision when all verticals are migrated and validated. **Bounties:** **Python** handlers; **optional later Go** slice; **CDK** stays **TypeScript**.
- **Future verticals** remain flexible: other features can add tables or adopt single-table patterns where joins/access patterns demand it.

