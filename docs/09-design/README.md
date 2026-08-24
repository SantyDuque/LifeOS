# LifeOS design handoff

This directory is the local design source of truth when Figma access is unavailable. Keep exports normalized so design evidence maps predictably to product code.

## Naming rules

### Figma components

Use purpose-first hierarchy: `Category / Component / Variant`.

- Use singular nouns for reusable components.
- Put states and styles in variants or properties, not unrelated base names.
- Do not encode dimensions or presentational colors in names.
- Prefer explicit terms; use `Focused`, never `Focussed`, and avoid abbreviations such as `SC`.
- Examples: `Navigation / Sidebar / Collapsed`, `Data Display / KPI Card / Focused`, `Actions / Button / Primary`.

### Figma frames

Use `Area / Screen / State / Shell`.

- Screen purposes include `Overview`, `Detail`, `Create`, and `Edit`.
- Content states are `Populated`, `Empty`, `Loading`, or `Error`, and are named only when a dedicated frame exists.
- Shell states are `Expanded`, `Collapsed`, or `Public`.
- Example: `Habits / Overview / Empty / Collapsed`.

### Repository paths

Use lowercase kebab-case:

- Components: `components/<category>/<component>/spec.md` and `reference.png`.
- Frames: `frames/<area>/<screen>/<state>-<shell>/spec.md` and `reference.png`.
- Keep variants from one exported component set together. Use a variant subdirectory only when separately exported assets materially differ, as with `forms/text-field/default/` and `forms/text-field/complete/`.
- Never edit exported numeric values in `spec.md`. Missing export content must be fixed at the source, not reconstructed by hand.

### Angular mappings

Angular names remain semantic PascalCase, such as `UiStatCardComponent`, `UiProgressRingComponent`, `UiConsistencyHeatmapComponent`, and `UiEmptyStateComponent`. Figma and Angular names map by purpose, not identical syntax. Shell-owned primitives may remain in `AppShellComponent`; CSS primitives may remain shared classes when no standalone Angular component is warranted.

## Terminology

- `Login`: existing-user authentication.
- `Sign Up`: account creation.
- `Expanded`: full authenticated sidebar.
- `Collapsed`: icon-only authenticated sidebar.
- `Public`: unauthenticated shell.

Do not use `Sign In` to mean registration, `LogIn` as a compound word, or `SC` for a shell state.

## Evidence precedence

1. Exported Markdown specification.
2. Reference PNG.
3. Shared Aurora token and component system.

Codex must inspect every relevant frame and shared-component spec before implementation, use exported measurements rather than screenshot estimates, preserve truthful product contracts over representative sample data, and document unsupported differences.

## Adding exports

1. Normalize the Figma node name before export.
2. Choose the canonical component or frame path.
3. Store the Markdown as `spec.md` and PNG as `reference.png`.
4. Keep variants together unless their separately exported evidence materially differs.
5. Add the mapping to [rename-map.md](rename-map.md) when migrating a legacy name.
6. Validate links, asset counts, and duplicate destinations before committing.

See [rename-map.md](rename-map.md) for the complete legacy migration and [figma-rename-checklist.md](figma-rename-checklist.md) for source-file cleanup.
