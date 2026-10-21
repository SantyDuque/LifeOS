---
name: LifeOS
description: A calm, Aurora-led personal operating system with precise data surfaces.
colors:
  # Finance V2.1 Checkpoint A only; preserved global/Today tokens remain authoritative elsewhere.
  finance-v21-a-primary: "#43bd98"
  finance-v21-a-light-primary: "#187d61"
  ink-background: "#10161f"
  ink-surface: "#161e29"
  ink-surface-raised: "#1d2835"
  ink-border: "#2a3848"
  ink-text: "#eef3f7"
  ink-muted: "#9baabd"
  paper-background: "#f6f8fa"
  paper-surface: "#ffffff"
  paper-border: "#d6e0e8"
  finance-emerald: "#35cda2"
  habits-teal: "#42c9b6"
  gym-cyan: "#43afd0"
  reading-violet: "#a487ea"
  study-blue: "#6b9def"
  goals-teal: "#41b8ad"
  analytics-blue: "#7796e7"
  settings-slate: "#8291a3"
  profile-teal: "#14b8a6"
  profile-cyan: "#22b8d6"
  profile-blue: "#4b8df8"
  profile-violet: "#9468ef"
  profile-rose: "#e84f72"
  profile-amber: "#e99a24"
  # Today V1 only; incumbent tokens above remain authoritative elsewhere.
  today-background: "#0b1420"
  today-foreground: "#f1f5f9"
  today-card: "#162331"
  today-popover: "#1c2b39"
  today-primary: "#46c7b7"
  today-primary-foreground: "#04211d"
  today-muted-foreground: "#94a8bc"
  today-destructive: "#e58a7b"
  today-border: "rgb(148 168 188 / 14%)"
  today-input: "rgb(148 168 188 / 18%)"
  today-surface: "#121e2c"
  today-surface-raised: "#182736"
  today-subtle: "#7d92a8"
  today-warm: "#e2b87a"
  today-hairline: "rgb(148 168 188 / 10%)"
  today-light-background: "#f6f8fa"
  today-light-foreground: "#192b3a"
  today-light-surface: "#ffffff"
  today-light-primary: "#167e73"
  today-light-muted: "#e5edf2"
  today-light-muted-foreground: "#506577"
  today-light-surface-raised: "#eaf0f4"
  today-light-border: "rgb(25 43 58 / 14%)"
  today-light-input: "rgb(25 43 58 / 18%)"
  today-light-hairline: "rgb(25 43 58 / 10%)"
typography:
  finance-v21-a-intro:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(36px, 3vw, 44px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  finance-v21-a-figure:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(23px, 2vw, 30px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  display:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.1em"
  micro:
    fontFamily: "Montserrat, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 500
    lineHeight: 1.4
  today-display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "104px"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.025em"
  today-body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
  today-section:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  today-label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  finance-v21-a-panel: "18px"
  finance-v21-a-transaction: "26px"
  control: "6px"
  surface: "8px"
  spacious: "12px"
  full: "9999px"
  today-base: "14px"
  today-panel: "28px"
  today-panel-strong: "32px"
spacing:
  finance-v21-a-panel: "24px"
  finance-v21-a-summary-panel: "20px"
  compact: "8px"
  standard: "16px"
  section: "24px"
  today-mobile-gutter: "20px"
  today-tablet-gutter: "32px"
  today-desktop-gutter: "56px"
  today-mobile-section: "40px"
  today-column-gap: "56px"
components:
  finance-v21-a-transaction:
    rounded: "{rounded.finance-v21-a-transaction}"
    padding: "28px"
    width: "640px"
  panel:
    backgroundColor: "{colors.ink-surface}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.surface}"
    padding: "16px"
  interactive-surface:
    backgroundColor: "{colors.ink-surface-raised}"
    textColor: "{colors.ink-text}"
    rounded: "{rounded.surface}"
    padding: "16px"
  today-rail:
    backgroundColor: "rgb(15 26 38 / 80%)"
    textColor: "{colors.today-subtle}"
    rounded: "{rounded.today-panel}"
    padding: "20px 16px"
    width: "72px"
  today-task-panel:
    textColor: "{colors.today-foreground}"
    rounded: "{rounded.today-panel-strong}"
    padding: "32px"
  today-habits-panel:
    textColor: "{colors.today-foreground}"
    rounded: "{rounded.today-panel}"
    padding: "28px"
---

# Design System: LifeOS

## Overview

**Creative North Star: "The Aurora Console"**

LifeOS is a dark-first personal operating system: information-dense enough to operate daily, calm enough to remain open for long sessions, and recognizable through its per-module Aurora headers. Its visual identity comes from cool ink surfaces, restrained borders, Montserrat typography, truthful data states, and precise module accents—not generic glass, heavy shadows, or decorative cards.

The approved mock defines visual intent. Mock and API implementations reuse the same presentation components wherever practical. Data-source differences belong at the adapter or view-model layer and must never create alternate visual systems.

**Key Characteristics:**

- Dark-first with complete light-theme support.
- Aurora imagery carries module identity; content surfaces stay restrained.
- Compact, aligned, numeric dashboards with honest empty semantics.
- Calm, fast interaction feedback without page-wide decorative motion.

### Scoped exception: Today V1

The global definitions in this document remain authoritative for unmigrated routes. Today V1 alone uses the approved [v0 source](https://github.com/SDuque28/lifeos-development/tree/bffc9c7abe600898ce9bf4a49e9656ea511ca7a7) pinned to `bffc9c7abe600898ce9bf4a49e9656ea511ca7a7`. Its navy/teal palette, editorial serif date, floating rail, large panel corners and orbital atmosphere are intentional source fidelity. The source, rather than a generated comp or this incumbent Aurora system, governs this exception.

Prefixed `today-*` frontmatter tokens describe the exception; they do not replace global tokens. Its implementation lives in `src/components/lifeos/today/today.css`, `fonts.css` and `atmosphere.tsx`. Styles apply under `.lifeos-v0` and to supported Radix portals only while that shell is mounted. Finance and Habits routes keep their incumbent design. Component mapping, intentional functional adaptations and review evidence live in [Today V1 integration](docs/v0-today-v1.md).

## Colors

Cool charcoal and navy surfaces support a controlled family of module accents. Light mode uses cool paper neutrals rather than pure gray.

**The Module Identity Rule.** Finance is emerald; Habits and Goals are distinct teals; Gym is cyan; Reading is violet; Study is blue; Analytics is cyan/blue; Settings is slate; Profile uses its selected personal accent. Never replace these identities with one universal product accent.

**The Accent Restraint Rule.** Module color belongs on icons, meaningful series, selection, focus, and small indicators. Large competing color fields are avoided.

Semantic success, warning, and destructive colors describe state and must not be recolored to match a module.

### Today V1 palette

The prefixed dark tokens preserve the source navy background, layered blue-navy surfaces, near-white text, muted blue text and teal primary/focus treatment. Secondary and accent share the popover value; muted shares the card value; their foregrounds share the foreground value. Ring uses the primary value. Warm and destructive remain distinct semantic accents. These assignments are scoped to Today and its mounted portals.

The source is dark-only. The prefixed light palette is a local adaptation that preserves the application's theme control; light primary foreground is white, popovers use the light surface, and selection text uses the active theme foreground. It is not a claim of source-provided light design.

## Typography

**Display Font:** Montserrat with system sans-serif fallback  
**Body Font:** Montserrat with system sans-serif fallback  
**Numeric Font:** Montserrat with tabular figures

Montserrat is used throughout unmigrated routes. Hierarchy comes from size, weight, spacing, and opacity rather than mixing font families.

### Hierarchy

- **Page title:** bold and immediately readable over Aurora artwork.
- **Panel title:** compact, strong, and aligned with optional actions.
- **Body:** regular or medium weight with comfortable line height.
- **Labels:** compact and often uppercase with measured tracking; never used as decorative eyebrow copy.
- **KPI values:** tabular numerals, medium weight, and stable widths.

### Today V1 typography

Geist supplies body and controls (self-hosted weights 400/500/600/700); Instrument Serif supplies the date and section titles (regular and italic). Font assets and OFL licenses are under `public/assets/fonts/v0/`. The date uses the desktop display token, adapts to 88px from 1024-1279px, 80px below 1024px and 58px below 640px. Its second line is italic. Section titles use the Today section token; narrative is 17px with 1.625 line height, rows are 14-15px, and metadata is 11-13px. This pairing and scale are intentional exceptions to Montserrat.

## Layout

Authenticated pages use a persistent shell, stable Aurora header, responsive metric grid, and a constrained content canvas. Desktop favors aligned dashboard grids; tablet reduces columns without changing information order; mobile stacks primary content, preserves touch targets, and uses the established bottom navigation.

Spacing follows a compact 8px rhythm, 16px component padding, and 24px separation between major sections. Horizontal scrolling is reserved for meaningful dense collections such as correlation or timeline cards. No shared primitive may introduce horizontal viewport overflow.

### Today V1 layout

The collapsed floating rail is 72px wide; expansion retains the existing navigation preference and destinations. Desktop begins at 1024px, with a 1280px content maximum and asymmetric 7:5 columns. The desktop gutter and column gap are 56px, both reduced to 32px and 40px respectively at 1024-1279px. Independently stacked sections use 32px left-column and 48px right-column spacing. Mobile/tablet stack in DOM and keyboard order: tasks, schedule, habits, check-in, week. Side gutters are 20px below 640px and 32px on tablet; section gaps are 40px. Bottom navigation retains safe-area accommodation.

Today V1.1 corrects the desktop presentation within this V1 layout. The hero uses 1.3:1 columns, a 64px gap (32px at 1024–1279px), and bottom alignment; the status surface uses 1.45:1 columns. Preserve the existing tablet/mobile rules and section order. This checkpoint does not migrate Finance or the Habits route.

## Elevation & Depth

LifeOS uses tonal layering and borders first. The hierarchy is: page background → passive panel → interactive surface → selected surface → elevated dialog/popover. Passive panels remain stable and do not lift. Interactive surfaces may change border and surface value, with at most a 1px pressed translation. Shadows are reserved for floating UI, tooltips, dialogs, and restrained state feedback.

**The Stable Panel Rule.** A panel does not animate merely because it mounted or refreshed.

### Today V1 atmosphere and surfaces

Today replaces its Aurora header with three background layers, a masked 720px starfield, 820px/540px orbit outlines and a blurred teal glow. The decoration is hidden from accessibility APIs and ignores pointer input. Strong task surfaces use the source navy gradient; glance and habit surfaces use translucent layered gradients. Insets and diffuse shadows define depth, while panels remain stable. Full gradients and shadow values are in the sidecar and scoped CSS. The orbit turns over 240 seconds linearly; reduced motion stops it. Reduced transparency removes shell blur and uses the opaque theme background.

## Shapes

Primary panels and interactive card-like surfaces use gently curved 8px corners. Inner controls are tighter at approximately 6px. Larger 12px corners are reserved for deliberately spacious overlays or branded containers. Pills are limited to compact badges, filters, avatars, and status controls.

Borders are one pixel and semantic. Do not stack multiple bordered cards when rows, spacing, or separators communicate the hierarchy more clearly.

### Today V1 shapes

The rail and softer panels use the Today panel radius (28px); task and check-in panels use the stronger radius (32px). The base scoped radius is 14px, fields are 12px, navigation items and check-in choices are 16px, task checkboxes are circular, and action buttons are pill-shaped. These source shapes apply only to the scoped Today presentation.

## Components

### Buttons

- Real buttons and links provide semantics, keyboard access, disabled behavior, and visible focus.
- Hover changes surface or color subtly; pressed feedback uses at most 1px translation.
- Primary actions use the current module accent. Secondary and ghost actions remain quieter.

### Cards / Containers

- **Panel:** passive structural surface with an 8px radius, one-pixel border, and 16–20px responsive padding.
- **InteractiveSurface:** clickable card-like button with distinct hover, pressed, focus-visible, selected, and disabled states.
- **KPI card:** stable height, tabular value, compact supporting copy, and accent confined mainly to its icon or meaningful state.
- **Chart card:** passive panel with canonical LifeOS tooltip and legend behavior.
- **SettingsRow:** lightweight separated row inside a Settings panel; do not create card-inside-card nesting.

### Inputs / Fields

Use LifeOS custom selects, date pickers, radio controls, checkboxes, and switches. Normal product UI must not fall back to browser-native replacements. Fields use the input border token, compact radius, visible focus, and explicit disabled/error treatment.

### Charts

Tooltips use the dark LifeOS popover surface in both themes where established. Series use canonical module accents. Legends permit intentional visibility control. Sparse ranges retain truthful domains; missing history renders an educational empty state rather than fabricated geometry.

### Aurora Header

Preserve each module’s approved dark and light Aurora assets, fixed header geometry, fade into the page, and readable near-white title treatment. Aurora motion remains slow and ambient. It must not change document sizing or overpower functional content.

### Empty Semantics

An em dash (`—`) means the value cannot yet be calculated or lacks sufficient history. `0` means a real measured zero. Never substitute one for the other.

### Motion

Motion is calm, fast, intentional, and reduced-motion aware. Micro feedback is 120ms, ordinary interaction is 180ms, and surfaces/dialogs are 240ms, using `cubic-bezier(.22, 1, .36, 1)`. Route, dialog, newly created content, or meaningful state transitions may animate; foundational panels do not cascade on mount.

### Today V1 integration

The shared Today presentation serves mock and API adapters while preserving AuthGate, TanStack Router, React Query and backend contracts. Existing task editors, schedule CRUD and location fields, persisted habit actions, check-in validation, history and truthful week semantics retain their real controls and state handling. The timeline, progress ring, moon/energy choices and completion bars adopt source geometry while using application values. Existing search, notifications, profile actions, navigation destinations and sign-out remain functional. Source scenario controls, demo providers and fixture history are excluded. This is a Today checkpoint; Finance V2 and Habits V3 require Today approval.

### Today V1.1 desktop correction

The pinned visual source remains `bffc9c7abe600898ce9bf4a49e9656ea511ca7a7`. The implementation record is [docs/v0-today-v11.md](docs/v0-today-v11.md); review artifacts live in `.impeccable/review/v1.1`.

- **Hero and status:** the profile timezone drives greeting, date, clock and event context. Current events show the source pulse, remaining duration, optional location and timed-event progress; upcoming events show time until start; an open day uses the quiet empty state. The habit ring is 76px with a 4px segment stroke, real completed/scheduled counts, and a dashed empty ring with an em dash when nothing is scheduled.
- **Day timeline:** show past events muted, current events teal, and upcoming events blue-gray. Timed events sit on the 6 AM–midnight horizon with the current-time marker. Keyboard-focusable event buttons open a mounted-Today portal tooltip with title, time range, duration and optional location. Its 8px radius, 8px 10px padding, 12px type and restrained shadow follow v0 `RailTooltip`; the source horizon's native `title` is reference behavior only. Preserve collision handling, focus visibility and theme inheritance.
- **Task composer:** keep the inline title input mounted while activation reveals actions so typing and focus remain stable. Preserve Enter submission, Escape cancellation, IME handling, pending/error states and existing task edit/delete controls. More options retains area, priority, estimate, due date and notes through the existing application fields and validation.
- **Habit continuity:** use the source icon-led row, schedule/quantity metadata, completion control and separate detail link. The seven-day dots represent actual scheduled, kept and rest days, including today's outline; accessible copy retains real continuity, streak and 30-day rate. Do not invent history. When no habits are scheduled, omit the section subtitle so the empty state and action have room.
- **Reflection:** retain the source collapsed invitation, editing form and saved summary. Mood uses five moon phases and energy uses five bar levels inside semantic radio groups, preserving the existing numeric 1–5 mapping, labels and keyboard behavior. Validate both values, prevent duplicate pending saves, and keep the draft after save failure. Notes remain available only through the existing optional-note contract; preserve existing saved notes, edit/remove actions and backend callbacks. Show a saved time only when an actual timestamp is supplied by that contract, formatted in the profile timezone.

### Today desktop refinement

The narrow follow-up is recorded in [docs/today-desktop-refinement.md](docs/today-desktop-refinement.md), with captures under `.impeccable/review/today-refinement/`. It preserves the pinned Today source, V1/V1.1 foundations, profile-local date context and shared mock/API presentation.

- **Form surfaces:** at desktop widths of 1024px and above, advanced task/edit, event and reflection fields use the elevated surface with the stronger border, an inset `0 1px 2px rgb(0 0 0 / 12%)` shadow and theme foreground. Focus uses a 2px primary outline with a 2px offset; invalid fields keep the destructive border. The edited task title gains 6px 10px padding and an 8px radius. The title-only new-task anchor retains its established appearance.
- **Schedule forms:** Add event and event editing reveal an inline form inside Schedule. End date defaults to the start date; a custom LifeOS checkbox progressively reveals a separate End date for multi-day events. Preserve profile-timezone conversion, location, date/time validation, pending feedback, drafts after errors and focus return. The desktop reveal uses 180ms ease-out opacity with a -3px-to-zero vertical translation; reduced motion disables it.
- **Week mood:** retain the existing habit completion bars and place a 12px moon phase below each bar for an actual daily journal mood. Missing moods and future days show a neutral dashed circle. Preserve the established mood mapping, accessible meaning and configured calendar week; never synthesize mood history. API mode reads the weekly journal range through the existing `entryFrom`/`entryTo` contract with an additive query under the existing `api-today` journal prefix. Existing query keys and invalidation behavior remain intact.

This refinement adds no backend change, deployment, mobile redesign or Finance/Habits route migration. Validation results belong to the refinement record; this design reference does not establish that pending checks or authenticated persistence have passed.

### Today V1.3 timezone and input continuity

The scoped follow-up is recorded in [docs/today-v13.md](docs/today-v13.md), with eight review captures under `.impeccable/review/v1.3/`. It extends the existing Today checkpoints and preserves their palette, typography, layout, theme behavior and application contracts.

- **Timezone preference:** detect the device timezone through `Intl` while retaining any valid saved profile timezone, including UTC. A discreet inline hero metadata control opens a Popover that explains a mismatch: Keep profile timezone closes without mutation; Use device timezone saves through the existing profile mutation. New mock profiles default to the device timezone. In incomplete onboarding only, initial UTC can visibly suggest the device timezone, with a Keep saved timezone link; persistence requires explicit Finish. The backend has no flag distinguishing deliberately selected UTC from default UTC, so this suggestion must remain visible and reversible, with no automatic preference writes or backend changes.
- **Clock and event day:** a minute clock updates the Today adapters across profile-local day boundaries. API event reads span local midnight to the next local midnight and refetch after timezone changes even when the local date string is unchanged. Preserve existing query keys and invalidation behavior.
- **Calendar and time controls:** the calendar portal uses 24px corners and 8px padding; its inner calendar uses 16px corners and 8px padding. Retain 16px collision padding, 10px offset and stacking level 80. The time picker uses 16px corners, highlights the current option and focuses/centers it on opening. Quarter-hour options retain an original off-grid time; Arrow keys, Home and End navigate the choices.
- **Event defaults and edits:** round the current local hour forward when minutes are at least 30, and default the end to one real elapsed hour later. If the rounded time falls in a nonexistent DST gap, advance to the first valid quarter hour; retain the current occurrence in an overlap. Preserve unchanged UTC instants during edits. The end follows start changes until explicitly edited; keep valid explicit ends and reveal the correct end date/multi-day state when crossing midnight.
- **Task focus and area:** the task title receives focus through its outer teal anchor only, with no inner outline or shadow; this is the title-specific exception to the desktop field focus treatment above. New tasks default to no Life Area; None/clear maps to the existing nullable backend contract and displays no area tag. Retain assigned areas on existing tasks.
- **Your Week:** remove only the All habits action; retain the existing completion bars, real mood indicators and calculations.

Independent visual review reported no findings. Final test/build results belong to the implementation record; this reference does not claim pending checks or authenticated persistence have passed. Finance and Habits routes remain outside this checkpoint.

### Today V1.4 current presentation overrides

The current scoped guidance is recorded in [docs/today-v14.md](docs/today-v14.md), with ten captures under `.impeccable/review/v1.4/`. The rules below supersede earlier Today hero timezone-control, fixed-horizon and edited-title inner-field guidance; older checkpoint descriptions remain as history. All other established Today foundations and unrelated route definitions remain in force.

- **Hero metadata:** show clean week/day/time metadata without a timezone label or control. Continue using the effective saved profile timezone, including valid UTC; preserve device detection during initial onboarding, saved preferences and existing Settings timezone review/edit behavior. Removing the hero control does not change timezone calculation or authorize automatic preference writes.
- **Schedule actions:** reserve a 20px flex action slot in each event title/header, with centered 24px icon buttons. Preserve the same geometry for past, current and upcoming events, with visible keyboard focus and no opacity-driven layout shift.
- **Day horizon:** `day-horizon-model.ts` starts at 06:00-22:00 in the profile timezone. Relevant timed events outside that base expand the full interval to their earliest start/latest end with at least 30 minutes of padding, rounded outward to local hours. A linear scale of actual elapsed UTC time preserves event duration across DST. Show full overnight spans with readable 12-hour tick labels and previous/next-day offsets; bound tick density as the range grows. Hide NOW outside the visible interval instead of clamping it to an edge. Invalid, unrelated and all-day records do not become fabricated timed bars.
- **Integrated task title:** both creation and editing keep the title transparent, borderless and without padding or inner outline/shadow, within the single outer teal focus surface. This overrides the older edited-title padding/radius and inner-field treatment. Advanced fields retain their established contrast, validation and focus behavior.
- **Time picker labels:** `LifeOSTimePicker` displays 12-hour AM/PM labels through `formatClockTime`. Values and callbacks remain raw `HH:mm`; backend timestamps, quarter-hour choices, current-option scrolling, automatic event ends and DST behavior remain unchanged.

The checkpoint passed typecheck, lint, build, 78 focused tests across 15 files and 14 desktop browser tests. Independent visual review passed with no material findings. Authenticated API persistence is unverified because no session is available. This checkpoint includes no backend change, deployment, mobile redesign or Finance/Habits route migration.

### Today V1.5 latest presentation overrides

The latest Today guidance is recorded in [docs/today-v15.md](docs/today-v15.md), with nine captures under `.impeccable/review/v1.5/`. These rules supersede historical Today rail width/expansion, long-list time-picker and next-event title-area rules. Older checkpoint tokens and metadata remain preserved for history; use the current overrides below for Today. Unrelated routes retain their incumbent guidance.

- **Horizon event color:** every timed segment uses `color-mix(in srgb, var(--primary) 65%, var(--background))`. Past/current/upcoming states differ by opacity (0.4/0.95/0.65) and height (5px/8px/7px; base 7px). Preserve the V1.4 elapsed-time geometry, duration, range expansion, ticks and truthful NOW visibility.
- **NOW halo:** animate only the outer pseudo-element over 4 seconds with ease-in-out, opacity 0.08-0.2, 4px blur and scale 0.85-1.3. The center dot and event segments remain static. Reduced motion stops the animation and sets halo opacity to 0.1.
- **Compact time picker:** replace the long list with three snap columns: Hour 1-12, Minutes 00/15/30/45 and Period AM/PM. Each column is 200px high with 40px rows and 80px vertical padding, centers the selected value and supports wheel, touch, keyboard and pointer interaction. Contain overscroll within the picker; restore selection/focus on opening. Done commits any pending wheel position before closing. Retain an original off-quarter minute only as a limited legacy-value option; opening must not silently round it. Raw `HH:mm` callbacks, timezone conversion, UTC timestamps, event automatic-end and DST semantics remain unchanged.
- **Today rail:** use a fixed floating 64px rail without an expand button or expansion interaction, independently of the saved collapse preference. Keep primary navigation at the top and Settings/Profile at the bottom, with sign-out and tooltips preserved. Let the flex layout derive its content offset. Other desktop routes retain their existing rail behavior; mobile navigation is unchanged.
- **Desktop next-event title:** reserve a centered flex title area with an 86px minimum height for roughly three typical lines. Short and wrapped titles retain consistent surrounding geometry without changing typography or split proportions. Exceptionally long text may grow the area to remain readable instead of clipping.

Validation passed: 85 focused tests across 16 files, 18 desktop browser tests, typecheck, lint and build. Browser coverage includes real wheel input, CDP touch, scroll containment, motion, rail and title geometry. Independent visual review opened all nine captures and reported no issues; the footer Profile teal tooltip was consistent with the design. Captures recorded no browser errors or viewport overflow; reduced motion disabled the halo animation. Temporary mock event data was deleted and the edited title restored. Authenticated API persistence remains unverified because no session is available. This checkpoint adds no backend change, deployment, mobile redesign or Finance/Habits route migration.

### V2 shared desktop rail and Finance overview overrides

This approved V2 scope supersedes the historical Today-only rail rules and the earlier statements that Finance remains unmigrated. Older checkpoints, tokens and validation records remain historical. The implementation record is [docs/finance-v2.md](docs/finance-v2.md); evidence belongs to that record and `.impeccable/review/v2/`. The implementation record reports 60 focused tests and 11 applicable desktop checks passed; the visual reviewer confirmed the source direction and scored its light-avatar contrast fix resolved (ship at correction scope). Typecheck, lint and production build passed; authenticated persistence remains unverified.

- **Shared desktop navigation:** every AppShell route uses the fixed-width floating rail from `app-shell.tsx` and `app-shell.css` at widths of 1024px and above. Its width is 58px, with 44px interaction targets, 16px left/vertical margins and an 8px right margin. Primary destinations stay at the top and Settings stays at the bottom. Remove expansion controls/interactions and the sidebar Profile shortcut; Profile remains available through the existing top-right account menu. Destinations, visibility rules, sign-out, tooltips and keyboard focus remain functional. Flex layout derives the content offset. Mobile navigation remains unchanged.
- **Finance visual authority:** only the desktop `/finances` overview adopts the approved v0 Finance visual system. The reference was last verified through the GitHub API against `SDuque28/lifeos-development` main at `bffc9c7abe600898ce9bf4a49e9656ea511ca7a7` (October 20); the local source is the sibling `.reference-v0-finance` checkout. Geist body/controls and Instrument Serif display/section typography use the existing self-hosted v0 assets. `overview.css` scopes the source navy/teal assignments and supported mounted-overview portals at the desktop breakpoint; matching `today-*` primitives remain preserved rather than becoming global replacements. The light palette is an application adaptation. Finance detail subpages and the mobile overview retain their existing presentation.
- **Finance density and geometry:** the source visual system is adapted to preserve the real product's information: a 52-68px responsive introduction instead of the source 84px heading, all four totals (balance, income, expenses, net cash flow) instead of three, a 1280px content maximum, 40px desktop side padding (28px at 1024-1199px), and a 28px section gap. Panels use 28px corners/24px padding; compact total panels use 24px corners/20px padding. A 1.3:0.7 primary grid pairs cash flow with upcoming payments; the three-column summary grid becomes two columns with its final panel spanning both at 1024-1199px.
- **Real financial information:** the overview consumes the existing snapshot, selectors and range model without introducing queries or prototype state. Cash flow keeps the real cash-balance chart and range availability semantics instead of six-month demo bars. Show up to three actual upcoming standing orders, account/category/budget summaries and five actual recent records. Keep existing category, transaction, account, budget and recurring destinations and actions. Format actual record/account currencies; never hardcode COP or copy source fixtures. Preserve the existing no-FX guard, mixed-currency explanations, sparse-history states and the distinction between unavailable values and measured zero.
- **Forms and boundaries:** retain the existing transaction forms and their behavior; Amount and Counterparty receive explicit input aria labels. This scope changes no backend, cache contract, routing contract or deployment. Habits and other module content keep their established presentation, apart from the authorized shared desktop rail.

### Finance V2.1 Checkpoint A scoped overrides

This desktop Finance refinement supersedes only the conflicting Finance V2 presentation rules above. Global tokens, Today checkpoints and shared desktop rail metadata remain historical and unchanged. The implementation record is [docs/finance-v21-a.md](docs/finance-v21-a.md), with refreshed captures under `.impeccable/review/v21/`. Checkpoint B must wait for the user's approval of A.

- **Scope and navigation:** apply the override only to the desktop `/finances` overview at widths of 1024px and above and its supported mounted portals. Remove the segmented overview navigation while preserving every existing destination and action through the relevant panels, links and controls. Mobile overview, Finance detail-page visuals and Today remain unchanged. Finance no longer mounts the Today orbital/starfield atmosphere; its restrained local background wash remains.
- **Color and type:** use the prefixed Finance primary tokens for emerald actions, selection, series and focus in dark/light mode. These override the earlier Finance teal assignment locally, never the global Finance emerald or Today palette. Keep Geist for body, controls and all financial figures with tabular numerals; retain Instrument Serif for editorial titles. The introduction uses the prefixed compact introduction token and keeps its second phrase inline. Intro and panel context labels move below their corresponding headings in normal sentence case; preserve their content and real date-range values.
- **Composition:** retain the 1280px maximum, 40px desktop gutters (28px at 1024-1199px) and 28px section spacing. Present all four existing totals as one divided strip rather than separate rounded cards. Row one pairs Cash flow with Spending by category in the existing 1.3:0.7 proportions. Row two contains Accounts, Budgets and Next payments; at 1024-1199px its final panel spans the two columns. Recent activity spans the full content width. Panels use the prefixed panel radius and spacing tokens, with the compact padding for row-two panels and 20px grid gaps.
- **Interactive rows:** account, category, budget, payment and recent-activity surfaces extend their hover/focus background across the panel's usable row width. Use a 7% primary mix for hover and keyboard focus, retain the two-pixel primary focus outline inset by 3px, and disable transitions under reduced motion. The surrounding passive panel remains stable.
- **Transaction dialog:** style the existing desktop Add transaction dialog with a 640px maximum width bounded by the viewport, the prefixed transaction radius, 28px padding and a navy dialog in both themes; the light overview panel adaptation is separate. Retain scrolling within its 90dvh/900px height bound. The 34px serif title, pill transaction-type choices/footer actions, 12px custom-field corners, stronger field borders and 25px tabular amount establish hierarchy. Keep custom selects and the shared LifeOS calendar; `FinanceDatePicker` delegates to `LifeOSDatePicker` without changing its value contract. Preserve labels, validation, focus handling, pending/error states, mutation payloads and cache invalidation behavior.
- **Product boundaries:** reuse the same real snapshot, selectors, no-FX guard, currencies, range availability and unavailable-versus-zero semantics. Keep up to three actual upcoming payments and five actual recent records. No new product data, prototype state, backend change, routing/cache contract change or deployment is introduced.

Verification at documentation time: 63 tests across 17 files, all seven desktop Playwright checks in one final run, typecheck and lint passed. Production build passed. Independent visual review reopened 13 refreshed captures and reported ship at the scored correction scope, with both heading and report findings resolved; evidence is recorded in `.impeccable/review/v21/review.md` and `validation.json`. Controlled API contracts pass; authenticated live saving remains unverified because the API session expired. Checkpoint approval is not implied by passing checks.

## Do's and Don'ts

### Do:

- **Do** preserve the pinned v0 visual foundation within Today while keeping global Aurora definitions authoritative elsewhere.
- **Do** retain mobile DOM/focus order and active-theme selection contrast when adjusting Today.

- **Do** treat the approved mock as the source of visual intent.
- **Do** share presentation components between mock and API modes.
- **Do** preserve module accents and Aurora identities across themes.
- **Do** use real controls with visible focus and reduced-motion support.
- **Do** distinguish passive, interactive, selected, and elevated surfaces semantically.

### Don't:

- **Don't** propagate Today tokens, fonts, corners or atmosphere into unmigrated routes.
- **Don't** replace live application capabilities or data contracts with v0 fixtures or local demo state.

- **Don't** redesign LifeOS into a generic SaaS dashboard.
- **Don't** create alternate mock and API visual systems.
- **Don't** animate every panel or add bouncy decorative movement.
- **Don't** use large competing module-colored surfaces in Analytics.
- **Don't** nest bordered cards when a section row or separator is sufficient.
- **Don't** replace custom LifeOS controls with browser-native substitutes.
