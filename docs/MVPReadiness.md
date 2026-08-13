# MVP Readiness

## Architecture and capabilities

LifeOS consists of independent Angular and NestJS repositories coordinated by this documentation repository. The backend is a modular monolith with Prisma/PostgreSQL, Redis-backed rate limiting, BullMQ workers, Supabase JWKS authentication, request IDs, validation, structured logging, Swagger, and health probes.

Backend APIs exist for authentication/user provisioning, Command Center, Tasks, Calendar, Goals, Projects, Habits, Journal, Personal Notes, Reading, Finance, Study, Gym, Notifications, and Reminders. The frontend currently provides complete workspaces for Command Center, Tasks, Calendar, Goals, Projects, Habits, Journal, Personal Notes, and Notifications. Finance, Reading, Study, Gym, and Reminders are navigation placeholders and are release blockers for the stated full-domain MVP.

## Testing and CI

Use `npm run validate:back` and `npm run validate:front`. Backend CI runs install, Prisma validation, formatting, lint, unit/e2e tests, build, and production dependency audit. Its integration workflow uses healthy PostgreSQL and Redis services, deploys committed migrations, checks migration status, runs integration tests, and probes the compiled API. The frontend repository currently has no committed GitHub Actions workflow; adding CI that runs its full validation and desktop/mobile Playwright suite is required before release.

## Deployment checklist

- Provide Node.js 22+ for API and worker processes, persistent PostgreSQL, and Redis with persistence appropriate to reminder durability.
- Apply committed Prisma migrations before starting the new API version; back up PostgreSQL first.
- Run API and worker as separate supervised processes and retain structured logs.
- Host the Angular build behind HTTPS with SPA fallback to `index.html`.
- Set production API, Supabase, CORS, proxy-hop, rate-limit, and Swagger values; disable Swagger unless intentionally protected/exposed.
- Configure Supabase production redirect URLs and place only its public anon/publishable key in browser configuration.
- Probe `/api/v1/health/live` for liveness and `/api/v1/health/ready` for readiness.
- Back up PostgreSQL and monitor Redis persistence. Delayed reminders depend on Redis state; no startup reconciliation currently recreates lost delayed jobs.

## Known limitations and residual risks

- Missing frontend Finance, Reading, Study, Gym, and Reminders workspaces block the declared full-domain MVP.
- Frontend CI is absent.
- Docker image/Compose execution, clean migration replay, live Supabase authentication, and production-origin CORS require environment-backed verification.
- Development dependency advisories remain in framework/test/build toolchains; production dependency audits are clean. Avoid forced major upgrades and reassess during routine framework upgrades.
- Redis persistence and backups are operational requirements for delayed Reminder reliability until bounded database-to-queue reconciliation is implemented.
