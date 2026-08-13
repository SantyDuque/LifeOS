# LifeOS

LifeOS is a personal operating system built as an Angular frontend, a NestJS API and worker, PostgreSQL, Redis/BullMQ, Prisma, and Supabase authentication.

## Repository topology

This container repository tracks ecosystem documentation and lightweight orchestration only. `LifeOS.back/` and `LifeOS.front/` are independent nested Git repositories with their own histories and remotes; they are intentionally ignored by the root repository and are not submodules.

## Local development

Prerequisites: Node.js 22 or newer, npm, Docker with Compose, and a Supabase project.

1. Run `npm run install:all`.
2. Copy `LifeOS.back/.env.example` to `LifeOS.back/.env` and set the Supabase values.
3. Copy `LifeOS.front/public/config.example.json` to `LifeOS.front/public/config.json` and set the public Supabase URL and anon/publishable key. Never put a service-role or `sb_secret_*` key in browser configuration.
4. Run `npm run infra:up`.
5. Run `npm run migrate`.
6. In separate terminals run `npm run backend`, `npm run worker`, and `npm run frontend`.
7. Open `http://localhost:4200`; Swagger is at `http://localhost:3000/docs` when enabled.

API liveness is `/api/v1/health/live`; readiness is `/api/v1/health/ready`. The legacy `/api/v1/health` remains a readiness alias.

Run `npm run validate:back`, `npm run validate:front`, or `npm run validate` for coordinated checks. See [MVP readiness](docs/MVPReadiness.md) for deployment requirements, capabilities, and known gaps.
