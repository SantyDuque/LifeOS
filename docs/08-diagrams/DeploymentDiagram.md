# Deployment Diagram

## Purpose
Visualize the LifeOS ecosystem architecture.

## Responsibilities
```mermaid
flowchart TB
  CDN[Vercel/CDN] --> Web[Angular App]
  Web --> API[API containers]
  API --> Worker[Worker containers]
  API --> DB[(Managed PostgreSQL)]
  API --> Redis[(Managed Redis)]
  Worker --> DB
  Worker --> Redis
```

## Design Decisions
The diagram represents clear frontend, backend, data, and asynchronous-work boundaries.

## Best Practices
Keep diagrams aligned with the architecture documentation.

## Future Improvements
Add operational detail as the deployment matures.

## Related Documentation
[Architecture](../../ARCHITECTURE.md)

