# System Context Diagram

## Purpose
Visualize the LifeOS ecosystem architecture.

## Responsibilities
```mermaid
flowchart LR
  User[User] --> Frontend[LifeOS.front]
  Frontend --> Backend[LifeOS.back]
  Backend --> Auth[Supabase Auth]
  Backend --> Providers[External Integrations]
```

## Design Decisions
The diagram represents clear frontend, backend, data, and asynchronous-work boundaries.

## Best Practices
Keep diagrams aligned with the architecture documentation.

## Future Improvements
Add operational detail as the deployment matures.

## Related Documentation
[Architecture](../../ARCHITECTURE.md)

