# Request Flow

## Purpose
Visualize the LifeOS ecosystem architecture.

## Responsibilities
```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend
  participant B as Backend
  participant D as Database
  U->>F: Action
  F->>B: Authenticated request
  B->>B: Guard and validation
  B->>D: Query or transaction
  D-->>B: Result
  B-->>F: Response
```

## Design Decisions
The diagram represents clear frontend, backend, data, and asynchronous-work boundaries.

## Best Practices
Keep diagrams aligned with the architecture documentation.

## Future Improvements
Add operational detail as the deployment matures.

## Related Documentation
[Architecture](../../ARCHITECTURE.md)

