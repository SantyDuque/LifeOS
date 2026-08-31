# System Diagram

## Purpose
Visualize the LifeOS ecosystem architecture.

## Responsibilities
```mermaid
flowchart TB
  Frontend[React SPA] -. future API adapter .-> Backend[NestJS]
  Backend --> DB[(PostgreSQL)]
  Backend --> Redis[(Redis)]
  Redis --> Workers[BullMQ Workers]
  Workers --> DB
```

## Design Decisions
The diagram represents clear frontend, backend, data, and asynchronous-work boundaries.

## Best Practices
Keep diagrams aligned with the architecture documentation.

## Future Improvements
Add operational detail as the deployment matures.

## Related Documentation
[Architecture](../../ARCHITECTURE.md)
