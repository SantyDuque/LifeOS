# Frontend Overview

`LifeOS.front` is an independently runnable React + TypeScript SPA. TanStack Router owns navigation, React Query owns asynchronous domain state, and the LifeOS adapter boundary isolates presentation from transport.

Local development defaults to deterministic mock data and mock authentication. UI components call query hooks, query hooks call `LifeOsAdapter`, and only an adapter may communicate with a future API. The current mock adapter performs no network requests and can be reset by tests.

See `LifeOS.front/README.md` for commands, directories, routes, and deferred integration gaps.
