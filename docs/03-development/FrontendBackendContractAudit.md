# Frontend–Backend Contract Audit

Audit date: 2026-08-24. This document records the retired frontend/API mapping and is retained only as integration research. The current React application is intentionally disconnected and classifications below must be revalidated before an API adapter is implemented.

## Contract matrix

| Domain                       | Frontend route/component                   | Frontend service                              | Backend endpoint/module                                                                              | Data used                                                                      | Classification | Gap / redundancy                                                                                                               | Recommended action                                                                                           |
| ---------------------------- | ------------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Authentication/profile       | `/sign-in`, guard, shell                   | `AuthService` plus Supabase browser client    | Supabase session; `GET /auth/me`; `AuthModule`, `UsersModule`                                        | Session token, id, email, display name, avatar, timezone, locale               | USED           | No frontend profile/settings editor                                                                                            | Preserve Supabase authority; define settings scope before adding writes                                      |
| Command Center               | `/command-center`                          | direct `ApiClient`                            | `GET /command-center`; `PersonalCommandCenterModule`                                                 | bounded task, habit, calendar and module summaries; monthly transaction totals | USED           | API intentionally cannot supply Life Score, streak, trends, heatmap or insights                                                | Keep bounded aggregate; add metrics only after product definitions                                           |
| Tasks                        | `/tasks`, detail                           | `TasksApi`, list/tag/note/attachment services | `/tasks`, `/tasks/lists`, `/tasks/tags`, `/tasks/:id/notes`, `/tasks/:id/attachments`; `TasksModule` | CRUD, completion, ordering, associations, notes, attachments                   | USED           | No material route mismatch found                                                                                               | Preserve contracts and coverage                                                                              |
| Calendar                     | `/calendar`, event detail                  | `CalendarApi`, `CalendarLookups`              | `/calendar/events`; `CalendarModule`                                                                 | event CRUD, archive/restore, task/project/goal lookups                         | USED           | Cross-domain lookup calls are intentionally composed client-side                                                               | Keep; aggregation is unnecessary for edit-form lookups                                                       |
| Projects                     | `/projects`, detail                        | `ProjectsApi`                                 | `/projects`, project-goal assignment; `ProjectsModule`                                               | CRUD, status/archive, goal relationships                                       | USED           | None demonstrated                                                                                                              | Preserve                                                                                                     |
| Goals                        | `/goals`, detail                           | `GoalsApi`                                    | `/goals`, `/goals/:id/progress`, project-goal assignment; `GoalsModule`                              | CRUD, authoritative decimal progress, project links                            | USED           | No portfolio/roadmap aggregate                                                                                                 | REQUIRED-SOON only for approved overview metrics; define aggregation contract first                          |
| Habits                       | `/habits`, detail                          | `HabitsApi`                                   | `/habits`, `/habits/:id/completions`; `HabitsModule`                                                 | schedules, targets, dated completions, links                                   | USED           | Streak and heatmap aggregates absent                                                                                           | Existing records support calendar completion views; streak rules need backend definition                     |
| Finance records              | `/finance/*`                               | `FinanceApi`                                  | categories, accounts, transactions, budgets, subscriptions and reminder preferences; `FinanceModule` | full CRUD/filter/archive flows                                                 | USED           | `amountMinor` is a JSON number in frontend while backend persistence uses bigint conversion; safe only within JS integer range | Keep current public DTO; document/guard safe integer range if values can exceed it                           |
| Finance overview             | no redesigned screen yet                   | none                                          | `GET /finance/overview`, `/cash-flow`, `/categories/breakdown`; reporting services                   | existing authoritative aggregates                                              | REQUIRED-SOON  | Reporting endpoints are not called by current UI                                                                               | Reuse these endpoints for the next Finance overview; verify response model against Figma before coding       |
| Finance merchants            | no frontend route/service                  | none                                          | `/finance/merchants`                                                                                 | merchant persistence and transaction categorization support                    | UNRESOLVED     | No current UI consumer; may support future transaction UX/imports                                                              | Do not delete; decide whether merchants are user-managed or internal enrichment                              |
| Gym                          | `/gym/*`                                   | `GymApi`                                      | exercises, templates, workouts, performed exercises/sets; `GymModule`                                | CRUD and workout logging                                                       | USED           | No overview/analytics endpoint                                                                                                 | Basic overview can list workouts; volume, PR and trend cards need authoritative aggregate definitions        |
| Reading                      | `/reading`, book/session details           | `ReadingApi`                                  | `/reading/books`, nested sessions; `ReadingModule`                                                   | books, page state, reading sessions                                            | USED           | No reading analytics aggregate                                                                                                 | Counts/pages may be derived for a bounded view; pace/streak/trend metrics need backend aggregation and rules |
| Study                        | `/study`, subject/session details          | `StudyApi`                                    | `/study/subjects`, nested sessions; `StudyModule`                                                    | subjects, sessions and cross-domain links                                      | USED           | No study analytics aggregate                                                                                                   | Recent duration can be summed only over an explicit range; trends need backend contract                      |
| Journal                      | `/journal`, detail                         | `JournalApi`                                  | `/journal/entries`; `JournalModule`                                                                  | entry CRUD/archive and bounded lookups                                         | USED           | Command Center correctly avoids private bodies                                                                                 | Preserve privacy boundary                                                                                    |
| Personal Notes               | `/notes`, notebook/note detail             | `PersonalNotesApi`                            | `/personal-notes`, `/notebooks`; `PersonalNotesModule`                                               | notebook/note CRUD, archive/restore                                            | USED           | Duplicate `/notes` Angular route existed                                                                                       | Duplicate route removed; backend unchanged                                                                   |
| Notifications                | `/notifications`                           | `NotificationsService`                        | `/notifications`, unread count, read/archive actions, preferences; `NotificationsModule`             | inbox state and notification preferences                                       | USED           | None demonstrated                                                                                                              | Preserve                                                                                                     |
| Reminders                    | `/reminders`, execution detail             | `RemindersApi`                                | `/reminders`, executions; `RemindersModule`, BullMQ processor/scheduler                              | recurrence, lifecycle, execution state                                         | USED           | UI does not directly call queue internals                                                                                      | Keep queue/worker BACKEND-ONLY                                                                               |
| Activity feed                | Command Center has no feed integration yet | none                                          | `GET /activity`; `ActivityModule`                                                                    | safe projected habit/finance activity with cursor pagination                   | REQUIRED-SOON  | Approved Command Center includes recent activity but currently composes no activity request                                    | Add a typed frontend client when the feed is enabled; keep private source bodies out                         |
| Activity outbox/worker       | no direct product route                    | none                                          | outbox dispatcher and BullMQ projection worker                                                       | reliable, idempotent activity projection                                       | BACKEND-ONLY   | No direct UI consumer required                                                                                                 | Preserve internal orchestration and migrations                                                               |
| Health, Redis, rate limiting | none                                       | none                                          | health controller, Redis client, throttler storage                                                   | readiness, queue transport, distributed rate limiting                          | BACKEND-ONLY   | Invisible by design                                                                                                            | Preserve security/operations boundary                                                                        |
| Analytics placeholder        | dynamic `/:feature` placeholder            | none                                          | no analytics module                                                                                  | none                                                                           | UNRESOLVED     | Approved visual concept has no product metric definitions or API                                                               | Keep placeholder; define KPIs and privacy rules before backend work                                          |
| Settings placeholder         | dynamic `/:feature` placeholder            | none                                          | auth profile read and notification preferences only                                                  | partial settings data                                                          | UNRESOLVED     | No unified settings contract                                                                                                   | Define account/profile/preferences scope; do not invent generic settings persistence                         |

## Contract findings

- Every concrete service in the retired frontend mapped to an existing Nest controller family. This does not establish support for the new redesign.
- Backend reporting endpoints for Finance are the clearest currently unconsumed API surface and are directly relevant to the approved Finance overview. They are not legacy.
- Finance merchants are the only product-facing controller family with neither a frontend client nor a proven approved screen requirement. Internal transaction/import relevance remains unresolved.
- `GET /activity` is currently unconsumed but is the existing backend support for the approved recent-activity area, so it is REQUIRED-SOON rather than legacy. Its BullMQ projection/outbox machinery remains backend-only.
- Health, Redis, BullMQ scheduling/projection, rate limiting, database access, and Supabase token verification are backend-only by design.
- The Command Center consumes only bounded summaries and never exposes journal/note bodies. Its ignored record bodies and unrequested fields should remain excluded at the projection boundary.
- A duplicate `/notes` route declaration was unreachable redundancy and was removed. Placeholder `/:feature` remains intentionally last and currently represents Analytics/Settings without API integration.
- No Prisma model, migration, controller, worker, queue, DTO field, or public behavior met the evidence threshold for deletion.

## MVP backend readiness

### Finance overview

- Existing: accounts, transactions, budgets, subscriptions, categories, merchants, plus overview, cash-flow and category-breakdown reporting endpoints.
- Defensible now: balances/totals only as defined by the existing reporting service, monthly income/expense, category breakdown and budget comparisons by currency/range.
- Missing: confirm a typed React reporting adapter and exact range/currency semantics against the approved design.
- Unsupported honestly: a single cross-currency net-worth score without conversion/rate policy.
- Frontend can proceed: **yes**, after a narrow response-contract review. Best next module.

### Gym overview

- Existing: exercises, templates, workouts, performed exercises and sets.
- Defensible now: recent workouts, completed set counts, explicit recorded volume over a selected range.
- Missing: overview/analytics aggregation and definitions for PRs, muscle distribution and trends.
- Unsupported honestly: progress scores or strength trends without range, exercise normalization and unit rules.
- Frontend can proceed: **partially** for operational lists; not for the full analytics design.

### Habits

- Existing: habit schedules, targets, dated completions and completion values.
- Defensible now: completion state by date and a date-range completion grid.
- Missing: authoritative streak/current-best streak and summary endpoint.
- Unsupported honestly: streak summaries until timezone, partial-completion and missed-day rules are defined.
- Frontend can proceed: **yes** for daily/list and raw heatmap views; summary metrics need backend work.

### Reading

- Existing: books, status/page data and dated reading sessions.
- Defensible now: recent sessions, pages logged, books by status, totals for an explicit bounded range.
- Missing: overview aggregate for pace, consistency and trends.
- Unsupported honestly: reading streak, forecast completion and trend comparisons without definitions.
- Frontend can proceed: **partially**; operational overview is safe, analytics cards are not.

### Study

- Existing: subjects, dated sessions, duration and cross-domain associations.
- Defensible now: recent sessions and explicit-range duration totals.
- Missing: study overview aggregation and trend/baseline contract.
- Unsupported honestly: productivity score, focus quality and comparative trends.
- Frontend can proceed: **partially** for subjects/recent sessions.

### Goals

- Existing: goals, target/current values, status, dates and project associations.
- Defensible now: per-goal progress using authoritative decimal values, status counts and due dates.
- Missing: portfolio/roadmap aggregation and policy for weighting unlike units.
- Unsupported honestly: a single portfolio score or roll-up across heterogeneous goals.
- Frontend can proceed: **yes** for a goal portfolio composed from individual goals; aggregate score cards require backend/product work.

## Architecture boundary decisions

- React owns presentation, routing, form composition and display-only formatting.
- Nest owns persisted rules, authorization, lifecycle transitions and authoritative cross-record calculations.
- Complex trends, streaks, scores and cross-currency metrics should be backend aggregates after product semantics are approved, not reconstructed opportunistically in React.
- Supabase remains the session issuer; Nest validates bearer identity and returns the local profile.
- API envelopes remain `{ data }`, with paginated collections adding `meta`; no audit change weakened this convention or any privacy/security boundary.
