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

Run `npm run frontend` by itself for the React mock application on port 4200; it needs no external services. Backend work can separately start `npm run backend` and `npm run worker`, with PostgreSQL on 5432, Redis on 6379, and the API on 3000. Frontend/API integration is deferred; once enabled, `CORS_ORIGINS` must list every actual frontend origin.

Diagnostics: `/api/v1/health/live` checks only the API process; `/api/v1/health/ready` checks PostgreSQL and Redis. Run `npm run validate` for the coordinated validation suite.
