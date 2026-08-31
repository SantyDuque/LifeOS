# LifeOS

LifeOS is a personal operating system with a React + TypeScript frontend and a NestJS backend. The frontend currently runs as a deliberately standalone mock application; PostgreSQL, Redis, Supabase, Docker, and the API are not required to explore or test it.

## Frontend-only development

```bash
cd LifeOS.front
npm ci
npm run dev
```

Mock mode is the default. Set `VITE_DATA_SOURCE=mock` explicitly when desired. See [the frontend README](LifeOS.front/README.md) for architecture and validation commands.

Backend development remains independent under `LifeOS.back/`. The backend is preserved as the eventual source of truth, but frontend API integration is intentionally deferred.

From the repository root, `npm run install:all`, `npm run frontend`, `npm run backend`, and `npm run worker` remain available. The frontend command does not require either backend process.
