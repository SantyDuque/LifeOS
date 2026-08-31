# ADR-003: React Frontend Architecture

**Status:** Accepted

LifeOS adopts React + TypeScript, Vite, TanStack Router, React Query, Tailwind CSS, and accessible Radix-style primitives as its official frontend architecture. Angular and its compatibility layer are removed.

During the redesign foundation phase, the frontend runs against a typed in-memory `LifeOsAdapter` with deterministic fixtures and mock authentication. This preserves a clean integration seam while allowing independent UI iteration. A future HTTP adapter will implement the same interface; this decision does not claim backend integration is complete.
