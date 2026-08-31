# Architecture

LifeOS contains two independently runnable applications:

- `LifeOS.front`: React 19, TypeScript, Vite, TanStack Router, React Query, Tailwind CSS, Radix primitives, Recharts, Lucide, and Zod.
- `LifeOS.back`: the existing NestJS modular monolith, Prisma/PostgreSQL persistence, Supabase authentication, and Redis/BullMQ infrastructure.

The current frontend flow is `routes/components → query hooks → LifeOsAdapter → mock adapter → deterministic fixtures`. Components do not perform transport calls. A future HTTP adapter must implement `LifeOsAdapter` and be selected in `src/lib/api/index.ts`; it must not require page rewrites.

Mock authentication returns a deterministic signed-in profile through the same adapter contract. This is intentional temporary infrastructure for redesign work, not completed backend integration.
