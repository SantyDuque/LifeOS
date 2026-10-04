# LifeOS Design System

This document records the visual system already established by the approved LifeOS mock implementation. It is descriptive, not aspirational: existing mock screens, shared presentation components, and tokens are the source of truth.

## 1. Governing rule

> **Mock defines visual intent.**  
> **API mode must reuse the same presentation components.**  
> **Data-source differences must not create alternate visual systems.**

Mock and API modes may differ in data adapters, loading, errors, permissions, and truthful empty values. They must not differ in page hierarchy, card composition, typography, spacing, chart treatment, controls, or responsive behavior.

The target architecture is:

```text
mock adapter --+
               +--> shared view model --> shared presentation components
API adapter ----+
```

Do not maintain a polished mock dashboard beside a simplified API/CRUD dashboard. When visual intent is ambiguous, inspect the populated mock and its empty-state counterpart before changing presentation.

## 2. Canonical implementation sources

- Theme tokens and global utilities: `LifeOS.front/src/styles.css`
- Application shell, navigation, and Aurora header: `LifeOS.front/src/components/lifeos/app-shell.tsx`
- Panels, empty/error/loading states: `LifeOS.front/src/components/lifeos/states.tsx`
- KPI layout and action card: `LifeOS.front/src/components/lifeos/metric-grid.tsx`
- KPI card: `LifeOS.front/src/components/lifeos/stat.tsx`
- Charts and chart tooltips: `LifeOS.front/src/components/lifeos/charts.tsx`
- Buttons and Radix primitives: `LifeOS.front/src/components/ui/`
- Product select and date controls: `LifeOS.front/src/components/lifeos/lifeos-select.tsx` and `lifeos-date-picker.tsx`
- Approved module compositions: mock branches in `LifeOS.front/src/routes/`

Prefer extending these sources over adding route-local visual primitives.

## 3. Design character

LifeOS is calm, precise, compact, and information-dense without feeling clinical. The visual language combines dark ink surfaces, thin cool borders, controlled module color, compact typography, restrained motion, and luminous Aurora headers.

Principles:

1. **Structure before decoration.** Hierarchy comes from grids, spacing, type, and surface elevation.
2. **Color communicates ownership and state.** Module accents identify context; semantic colors identify success, warning, danger, and focus.
3. **Truthful data presentation.** Unknown values use `—`; empty states explain how data becomes available. Never invent zeroes, scores, trends, or history.
4. **Compact, not cramped.** Controls are generally 32–40px tall; cards use deliberate 16–20px internal padding.
5. **One component language.** Native controls are not visual substitutes for LifeOS controls.
6. **Accessible by default.** Keyboard focus, readable contrast, reduced motion, text summaries, and non-color state cues are part of the design.

## 4. Foundations

### 4.1 Typography

The sole product typeface is **Montserrat**, loaded in weights 400, 500, 600, and 700. System sans-serif is the fallback. Display, body, and numeric text all remain Montserrat; LifeOS does not introduce a decorative display face or monospace numerals.

| Role | Existing treatment |
|---|---|
| Page title | 24px mobile, 30px from `sm`; bold; tight line height; white over Aurora |
| Panel title | 18px; bold; `foreground/85` |
| Dialog title | 18px; semibold; tight line height |
| Body/control | 14px; regular or medium |
| Supporting text | 12px; muted foreground; relaxed only for explanatory copy |
| Eyebrow/KPI label | 10–11px; uppercase; wide tracking; muted |
| KPI value | 26px; medium; tight line height |
| Microcopy | 9–11px; uppercase only for short labels |

Global headings use a slight `-0.01em` letter spacing. Numbers use the `.num`/`.lifeos-number` treatment with tabular numerals and `-0.02em` tracking. Do not substitute monospace fonts for metrics.

### 4.2 Spacing

Use the existing Tailwind spacing scale. Recurring product intervals are:

| Context | Value |
|---|---|
| Dense inline gap | 4–8px (`gap-1` to `gap-2`) |
| Control/form gap | 12–16px (`gap-3` to `gap-4`) |
| Card grid gap | 12px for KPI grids; 16–24px for content grids |
| Section rhythm | 24px (`space-y-6`) |
| Panel padding | 16px mobile, 20px from `sm` |
| KPI padding | 16px horizontal, 14px vertical |
| Page gutters | 16px mobile, 24px `sm`, 32px `lg` |
| Main content | 24px vertical, with the existing header overlap treatment |

Labels sit close to their controls; descriptions sit close to their titles. Increase whitespace between semantic groups, not within a label/control pair.

### 4.3 Radius and dimensions

The base radius is `0.5rem` (8px).

| Token/use | Radius |
|---|---|
| Small | 4px |
| Medium | 6px |
| Standard panel/control | 8px |
| Large/popover emphasis | 12px |
| Circular icon/avatar | Full pill |

Standard controls are 36px high. Small buttons are 32px; large buttons are 40px; icon buttons are 36×36px. Calendar cells are 32px. Do not arbitrarily enlarge controls or round every surface into a pill.

### 4.4 Surfaces

LifeOS is dark-mode first, with a coordinated light override.

| Token | Dark | Light | Purpose |
|---|---:|---:|---|
| `background` | `#10161f` | `#f6f8fa` | App canvas |
| `surface` / `card` | `#161e29` | `#ffffff` | Panels and cards |
| `surface-raised` / `popover` | `#1d2835` | `#ffffff` | Menus, popovers, raised content |
| `surface-muted` | `#202c39` | `#e7edf2` | Quiet nested regions |
| `foreground` | `#eef3f7` | `#18222d` | Primary text |
| `muted-foreground` | `#9baabd` | `#596a7b` | Supporting text |

Use semantic variables in components. Do not hardcode theme-specific surface or text colors.

### 4.5 Borders, shadows, and focus

- Standard panels: 1px `border`, standard 8px radius, no default decorative shadow.
- Strong separation: `border-strong`; input borders use `input`.
- Popovers and dialogs: standard border plus restrained `shadow-md`/`shadow-lg`.
- Focus: visible ring using `ring`, normally 1–2px. Header controls use a white ring for contrast over Aurora imagery.
- Destructive/error containers: destructive border at approximately 40% plus a 10% tinted background.
- Avoid glow except for Aurora, profile personalization, and intentionally accented action hover states.

## 5. Color system

### 5.1 Shared semantic colors

- Primary teal: `#42c9b6` dark / `#007f73` light
- Success: `#35cda2` dark / `#007b5c` light
- Warning: `#e2a64f` dark / `#b66000` light
- Danger/destructive: `#df6464` dark / `#ba1a1a` light

Always use the semantic token appropriate to meaning. A module accent is not an error or success color.

### 5.2 Module accents

| Module | Dark | Light | Character |
|---|---:|---:|---|
| Today/default | Aurora teal | Primary teal | Daily command center |
| Finances | `#35cda2` | `#007b5c` | Emerald |
| Habits | `#42c9b6` | `#007c72` | Teal |
| Gym | `#43afd0` | `#08738c` | Cyan |
| Reading | `#a487ea` | `#7651d6` | Violet |
| Study | `#6b9def` | `#2468bd` | Blue |
| Goals | `#41b8ad` | `#14766f` | Strategic teal |
| Analytics | `#7796e7` | `#4d5fba` | Analytical blue |
| Settings | Aurora neutral | Aurora neutral | Shared/neutral |

Module themes set `--primary` and header Aurora variables. Use those tokens for primary actions, selected controls, chart emphasis, contextual icons, and collapsed-navigation tooltips. Do not create route-local lookalike colors.

## 6. Application shell and Aurora headers

The application shell is a full dynamic viewport (`100dvh`) with one intentional vertical scroll container. Horizontal overflow is hidden globally.

Desktop sidebar:

- Visible from `lg`.
- Expanded width: 240px (`w-60`).
- Collapsed rail: 64px (`w-16`).
- 12px horizontal and 24px vertical padding.
- Width transition: 250ms ease-out; labels fade without translating the sidebar.
- Module-colored active and hover treatments use low-opacity accent mixes.
- Pointer interaction is temporarily disabled during width transitions; keyboard focus remains available.

Aurora header:

- Sticky at the top; the art layer is fixed, 130px tall, masked into the page background.
- Every module uses its dedicated dark/light asset from `public/*-aurora-bg*`.
- Crossfades preserve the same shell geometry; reduced-motion mode swaps without animation.
- Header content uses 16/24/32px responsive gutters and 16px vertical padding.
- Title and subtitle retain strong text shadows and the shared white/muted-white colors.
- Search is a translucent blurred field; Bell and Profile remain 36px circular controls.
- Do not modify header height, artwork placement, search, Bell, Profile, or spacing per module.

Main content begins with the established `-16px` header overlap and `32px` top compensation. Preserve this relationship rather than adding module-specific top margins.

## 7. Cards and panels

`.panel` is the canonical card: `surface` background, 1px border, 8px radius. `Panel` adds 16px padding, increasing to 20px at `sm`.

`PanelHeader` uses a two-column grid:

- Title/hint on the left, optional action on the right.
- 16px bottom spacing.
- 18px bold title; 12px muted hint with a 2px top gap.
- Actions do not stretch the title column or force artificial card height.

Cards should hug their content unless a shared dashboard composition explicitly stretches a row. Nested content may use muted surfaces or separators; avoid placing a second oversized dashed card inside every panel.

## 8. KPI pattern

`MetricGrid`, `MetricAction`, and `Stat` define the approved KPI row.

- Mobile: two columns with 12px gaps.
- Desktop with one action: a fixed 124px action card plus four fluid KPI cards.
- Desktop with two actions: two fixed 124px action cards plus four fluid metrics.
- Without an action: four columns from `sm`.
- Action cards use a low-opacity primary tint, primary border, circular 32px icon, and 12px label.
- KPI cards use the standard panel, 11px uppercase label, 20px tinted icon container, 26px value, and a single 12px support line.
- Trend copy uses semantic positive/warning/danger tokens.
- Unknown metrics render `—`, not fake `0`, `0%`, or `0/100`.

Primary page creation belongs in `MetricAction`. Secondary management actions belong in contextual menus, panel actions, or subordinate buttons—not competing KPI-sized buttons.

## 9. Buttons and controls

### 9.1 Buttons

Canonical variants are default, destructive, outline, secondary, ghost, and link.

- Default: module primary background and contrasting primary foreground.
- Outline: input border, background surface, subtle shadow, accent hover.
- Ghost: no resting container; accent surface on hover.
- Destructive: destructive token and explicit destructive foreground.
- Disabled: 50% opacity and no pointer interaction.
- Every button retains a visible keyboard ring.

Use 16px Lucide icons. Do not create one-off button heights, gradients, or oversized corner radii.

### 9.2 Custom dropdowns

Use the shared Radix Select, DropdownMenu, Command, or `LifeOSSelect`; do not fall back to native `<select>` for product UI.

- Trigger: 36px, full width when form-bound, 12px horizontal padding, 8px radius.
- Popup: raised popover surface, 1px border, 8px radius, `shadow-md`, animated fade/zoom/short slide.
- Popup width normally matches its trigger.
- Items: compact 6px vertical padding; accent focus; selected state uses a low-opacity module primary tint and checkmark where applicable.
- Long collections use an internal maximum height and the shared scrollbar treatment.
- Searchable collections place a search field above the scrollable result region.

### 9.3 Date pickers

Use `LifeOSDatePicker` and the shared Calendar, never a native browser date input.

- Trigger matches the 36px outline-control language and uses `dd MMM yyyy` display formatting.
- Popover is content-width with no extra outer padding.
- Calendar uses 32px cells, compact 12px padding, muted outside dates, accent-tinted today, and primary selected states.
- Date values remain canonical `yyyy-MM-dd` strings behind the presentation.

## 10. Dialogs

Dialogs use the Radix shared shell:

- Black 80% overlay.
- Centered, full-width container capped at 512px unless a task explicitly needs another approved size.
- 24px padding, 16px internal grid gap, border, background surface, and large shadow.
- 8px radius from `sm`; mobile may meet viewport edges.
- Fade and 95% zoom transitions over 200ms.
- Close button in the top-right with hover opacity and a visible focus ring.
- Header is centered on mobile and left-aligned from `sm`.
- Footer stacks in reverse order on mobile and aligns actions right from `sm`.
- Forms use `noValidate` plus clear LifeOS inline errors; do not expose browser-native validation bubbles.
- Maintain consistent label → small gap → control and 12–20px row spacing.

## 11. Charts and data visualization

Charts use Recharts inside `ResponsiveContainer` and a semantic `Frame` with an accessible text summary.

Approved styling:

- Default chart height: 200–240px; 220px is the common baseline.
- Axes: no axis lines or tick lines; 11px muted labels.
- Grid: horizontal only, using `border`, with `2 4` or similarly restrained dash patterns.
- Lines: 1.5–1.75px; no default dots; compact active dot.
- Area fills: module primary fading from roughly 28% to 2% opacity.
- Bars: maximum width around 26px with 3px top radius.
- Donuts: surface-colored 1px separation; shared 400ms delay and 1500ms ease entrance.
- Radar: primary stroke with approximately 14% fill.
- Missing values stay null/unknown; do not connect or manufacture pre-tracking history.
- Unsupported ranges are disabled rather than populated with synthetic data.

Charts must remain responsive and clipped within their card, never force page-level horizontal scrolling.

## 12. Tooltips

Two tooltip languages exist for distinct jobs:

1. **Control/navigation tooltip:** compact 12px type, 12×6px padding, 8px radius, fade/zoom/slide animation. Collapsed sidebar tooltips use the destination module accent for border, text, and a 14% tint over the popover surface.
2. **Chart tooltip:** 8px radius, border, popover surface, 12×8px padding, 12px text, small shadow. Series are identified with a 6px colored dot and tabular values.

Tooltips appear on hover and keyboard focus, remain within portals, and never replace accessible names.

## 13. Empty, loading, partial, and error states

### Empty states

`EmptyState` is a contained state inside the approved card structure:

- 1px dashed border and 6px radius.
- Centered content with 24px horizontal and 40px vertical padding by default.
- 20px muted or module-colored icon.
- 14px title, 12px muted description capped at a readable width.
- Optional action with 16px separation.

Preserve the complete dashboard skeleton around empty data: KPI row, named sections, chart cards, and contextual actions remain visible. Reduce padding for compact side cards instead of using giant blank dashed boxes.

### Skeletons

- Use shared `Skeleton` with muted/primary tint, pulse animation, and 6px radius.
- List loading uses 44px rows separated by 10px.
- Chart loading preserves the final chart height.
- Include `role="status"`, a useful label, and screen-reader loading text.
- Reduced-motion preferences must disable unnecessary animation where applicable.

### Partial and error states

- One failing module must not collapse an aggregate dashboard.
- Successful regions remain rendered; the failed region receives a compact error/retry state.
- Partial-data notices use a muted surface, standard border, 12px type, and compact padding.
- Error copy is safe and user-facing; raw provider or infrastructure errors do not enter the UI.

## 14. Motion

- Content panels fade in over 360ms with the existing ease-out curve and light 35ms staggering.
- Metric actions may lift 2px over 180ms with a very soft primary shadow.
- Dropdowns, dialogs, and tooltips use the shared Radix state animations.
- Sidebar width and label opacity share the 250ms ease-out timing.
- Never animate competing width and horizontal transforms on the same shell surface.
- `prefers-reduced-motion` removes decorative entrance/lift behavior and Aurora crossfades without changing layout or meaning.

## 15. Responsive behavior

LifeOS is mobile-first.

| Range | Expected behavior |
|---|---|
| Mobile | 16px page gutters; two-column KPIs; stacked content cards; desktop sidebar hidden; bottom navigation visible; full-width controls/dialog actions |
| `sm` (640px+) | 24px gutters; larger header title; search field appears; four-column KPI grids where no action exists |
| Tablet/intermediate | Fluid grids use `minmax(0,1fr)`; controls wrap without clipping; charts retain bounded height |
| `lg` (1024px+) | Desktop sidebar appears; 32px page gutters; major two-column dashboard compositions activate |
| `xl` (1280px+) | KPI action + four-metric layout and asymmetric analytical grids activate |

Rules:

- Every grid child that contains charts or long text must allow shrinking with `min-w-0`.
- Avoid fixed content heights except established visualization frames and controls.
- Tables and dense timelines may own local horizontal scrolling; the entire page must not.
- Seven-day weekly layouts must remain visible without page-level horizontal scrolling.
- Mobile stacking order follows semantic reading order, not desktop column source order by accident.
- Touch targets remain comfortable even when the icon rail is compact.

## 16. Implementation checklist

Before accepting a UI change:

- [ ] Does it preserve the approved mock hierarchy?
- [ ] Do mock and API mode render the same presentation component?
- [ ] Are all colors and surfaces token-based?
- [ ] Does it use shared Panel, KPI, Button, Select, DatePicker, Dialog, Tooltip, EmptyState, and Skeleton primitives where applicable?
- [ ] Are unknown values represented truthfully with `—` or an early-history explanation?
- [ ] Are light and dark modes both supported?
- [ ] Are keyboard focus, accessible names, chart summaries, and reduced motion preserved?
- [ ] Does it work at mobile, tablet, desktop, and collapsed-sidebar widths?
- [ ] Is overflow local and intentional rather than hidden globally?
- [ ] Does the change avoid introducing a second design language?

## 17. Prohibited drift

Do not:

- Build separate mock and API visual trees for the same module.
- Replace shared controls with browser-native selects or date inputs.
- Invent data to make an empty dashboard resemble a populated mock.
- Remove approved dashboard sections merely because data is unavailable.
- Add arbitrary colors, radii, shadows, gradients, typefaces, or spacing.
- Turn secondary CRUD actions into competing primary cards.
- Hide full-page failures behind “not connected” placeholders when partial real data can render.
- Create route-specific tooltip, chart, dialog, or empty-state languages.
- Change Aurora shell geometry per module.

When product data is incomplete, preserve the visual system and change only the truthful content state.
