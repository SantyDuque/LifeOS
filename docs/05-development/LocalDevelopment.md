# Local Development

Use Node.js 22+ and Docker Compose. From the container repository:

```powershell
npm run install:all
Copy-Item LifeOS.back/.env.example LifeOS.back/.env
Copy-Item LifeOS.front/public/config.example.json LifeOS.front/public/config.json
npm run infra:up
npm run migrate
```

Set the real Supabase project URL, issuer, audience, and JWKS URL in the ignored backend `.env`. Set only the public project URL and anon/publishable key in frontend `public/config.json`. Configure Supabase redirect URLs for `http://localhost:4200` and the production HTTPS origin.

Start `npm run backend`, `npm run worker`, and `npm run frontend` in separate terminals. PostgreSQL uses port 5432, Redis 6379, the API 3000, and Angular 4200. `CORS_ORIGINS` must list every actual frontend origin.

Diagnostics: `/api/v1/health/live` checks only the API process; `/api/v1/health/ready` checks PostgreSQL and Redis. Run `npm run validate` for the coordinated validation suite.
