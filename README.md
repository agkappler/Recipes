# Recipes aka Fargopolis
> [!WARNING]
> This repository is **legacy** and the architecture documented here has been **deprecated**.
> It is kept for historical reference and maintenance of old behavior only.
> Active development has moved to the new architecture repository.

This platform was built as a personal project to explore different technologies, manage my own recipes, gamify recurring tasks as bounties, and organize Dungeons & Dragons characters. It's also a way to showcase my work and experiment with new ideas. Feel free to explore and see what I've been working on!

## Architecture at a glance

This legacy repository is centered on the original monolith:

| Layer | What it is | How the client uses it |
| ----- | ---------- | ---------------------- |
| **Backend** | **Spring Boot** + PostgreSQL ([`java-recipes/`](java-recipes/)) | API + cookies for legacy behavior. |
| **Frontend** | Vite SPA ([`fargopolis-web/`](fargopolis-web/)) and older Next app ([`recipe-site/`](recipe-site/)) | Local development UI for legacy backend workflows. |

## Documentation

- **[`java-recipes/`](java-recipes/)** — legacy Spring Boot application source.
- **[`fargopolis-web/README.md`](fargopolis-web/README.md)** — frontend setup details for local development.
- **[`recipe-site/`](recipe-site/)** — older Next.js frontend kept for historical reference.

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

The dev server listens on port **3000** (see `vite.config.ts`). The legacy Next app remains under `recipe-site/`.
