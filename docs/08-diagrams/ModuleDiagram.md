# Module Diagram

## Purpose
Visualize the LifeOS ecosystem architecture.

## Responsibilities
```mermaid
flowchart LR
  Dashboard --> Finance
  Dashboard --> Habits
  Dashboard --> Gym
  Analytics --> Finance
  Analytics --> Goals
  Integrations --> Finance
  Integrations --> Gym
```

## Design Decisions
The diagram represents clear frontend, backend, data, and asynchronous-work boundaries.

## Best Practices
Keep diagrams aligned with the architecture documentation.

## Future Improvements
Add operational detail as the deployment matures.

## Related Documentation
[Architecture](../../ARCHITECTURE.md)

