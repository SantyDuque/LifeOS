# Architecture

LifeOS comprises an Angular frontend and NestJS modular-monolith backend. The frontend presents accessible feature workspaces and communicates with a versioned REST API. The backend owns business rules and persists source data in PostgreSQL through Prisma. Redis supports caching and BullMQ workers; Supabase provides authentication; integrations are isolated behind provider adapters.

See [System Overview](docs/02-architecture/SystemOverview.md) and [Architecture Diagrams](docs/08-diagrams/ContextDiagram.md).

