# LifeOS — Today v1.0 Implementation Specification

**Status:** Approved design direction  
**Release:** First beta  
**Primary experience:** Personal Daily Companion  
**Priority:** UX refinement, not feature expansion

## 1. Product objective

Redesign the existing Today page so it helps users:

1. Understand their day.
2. Capture and complete daily intentions with minimal friction.
3. Maintain meaningful habits.
4. Reflect on their day without feeling pressured.

**Design principle:** LifeOS should reflect the user's life, not make them feel obligated to populate dashboards.

The page must feel complete and intentional with zero, sparse, normal, or dense data.

## 2. Non-negotiable constraints

- Preserve the existing LifeOS visual identity, including typography, cosmic header, dark theme, accent colors, spacing conventions, and established components.
- Reuse existing application architecture and UI primitives wherever possible.
- Do not create a parallel design system.
- Do not rewrite unrelated application modules.
- Do not modify database schemas or backend API contracts without demonstrating that a required beta interaction cannot work with existing contracts.
- Preserve existing task, event, habit, and check-in functionality, including edit/delete and persistence behaviors.
- Preserve authentication, authorization, account isolation, timezone preferences, and existing data synchronization.
- Do not introduce new third-party dependencies without explicit approval.
- Do not fabricate user data, artificial analytics, or activity history.
- Preserve mobile and desktop accessibility.
- Implement no new analytics, AI recommendations, gamification, or onboarding system as part of this change.

## 3. Page hierarchy

### Section A — Greeting and daily orientation

Keep the existing cosmic banner.

Display:
- Contextual greeting.
- User's preferred display name, when available.
- Current local date.
- One concise contextual status message.

Status message examples:
- Naturally clear day: "Your day is open."
- Outstanding commitments: "You have a few things planned."
- Completed all scheduled tasks and habits: "You've taken care of everything planned for today."

Messages must be grounded in real state.

Avoid motivational quotes, artificial praise, repetitive copy, or language that creates guilt.

### Section B — Daily status

Replace the existing four fixed KPI cards with two compact, contextual cards.

**Primary card: Today's habits**
- Show completed / scheduled habits.
- Make completion progress visually clear.
- If no habits exist, show an appropriate setup state.
- If no habits are scheduled today, say so instead of presenting 0/0 as a failure.
- Respect active schedules, including recurring habits.

**Secondary card: Next up**
- If a future event exists today, display its name and time.
- If today's events have already finished, communicate that there are no remaining events.
- If no event is scheduled, display "Open day" or an equivalent message.
- Long event titles must truncate gracefully, with the full title available accessibly.
- Do not display past events as upcoming.

**Overdue tasks**
- Do not occupy a permanent KPI card.
- If overdue tasks exist, surface a subtle but visible attention indicator within the Tasks section.
- Preserve access to the full overdue-task list.

**Focus**
- Remove the permanent focus KPI from Today.
- Do not delete underlying study or reading session data.
- Keep existing focus-related functionality elsewhere unchanged.
- Do not relabel study/reading duration as measured focus without a valid basis.

### Section C — Today's tasks

This section should allow quick capture, inspection, completion, and access to detailed task editing.

States:

**First-use empty**
- Explain briefly what tasks are for.
- Display one prominent "Add your first task" action.
- Do not display a large empty illustration or dashed placeholder.

**Naturally empty**
- Display a calm message such as "You're all clear."
- Provide a low-emphasis "Add a task" action.
- Do not encourage users to create unnecessary work.

**Completed**
- When tasks existed and all tasks due today are completed, show a compact completion state.
- Preserve access to completed tasks.
- Do not misrepresent completed work as if no tasks ever existed.

**Populated**
- Show outstanding tasks clearly.
- Use existing priority and life-area metadata unobtrusively.
- Provide accessible completion controls.
- Group overdue tasks separately when present.
- Preserve discoverable actions to edit or delete a task.

**Dense**
- Prioritize outstanding and urgent tasks.
- Do not render unlimited rows by default.
- Initially show a small, sensible subset, approximately five tasks.
- Offer "View all" or "Show more" for remaining items.
- Maintain access to completed and overdue tasks without losing context.

Task creation:

**Quick capture**
- Clicking the section-level plus opens a lightweight creation interface.
- Title is the only required field if existing domain rules permit.
- Due date defaults to the current day in the user's configured timezone.
- Optional fields are collapsed under "More options".
- Optional fields include life area, priority, estimated duration, due date, and notes.
- Preserve existing backend validation.
- Enter submits when appropriate; keyboard behavior must not interfere with multiline notes or dropdown selection.
- Submission must prevent duplicate requests.
- New tasks must be reflected in Today immediately after successful persistence.
- If persistence fails, do not pretend that the task was saved.

**Editing**
- Keep access to all existing metadata.
- Editing need not use the quick-capture interface.
- Preserve the current valid task lifecycle.

### Section D — Schedule

The schedule must have its own identity. An event represents committed time, not merely another task.

States:

**First use**
- Explain the purpose of events.
- Provide "Add your first event".

**Naturally empty**
- Display "Your time is open" or equivalent.
- Provide an unobtrusive "Plan an event" action.
- Do not use the exact same illustration and content as Tasks.

**Populated**
- Show today's events in chronological order.
- Display relevant start and end times.
- Visually distinguish past, current, and upcoming events when the underlying data supports it.
- Clearly indicate the next upcoming event.

**Dense**
- Keep the initial list compact.
- Offer access to the complete day's schedule.
- Never hide overlapping events without a way to inspect them.

Event creation:
- Keep title, date, start, and end visible.
- Default the date to today.
- Allow the user to change the date and times.
- Start and end must have clear validation.
- Keep description optional.
- Use accessible date/time inputs.
- Preserve current event persistence, edit, and delete behavior.

Do not add recurring-event functionality, automatic scheduling, calendar-provider integration, or AI time-blocking.

### Section E — Today's habits

This remains a prominent interactive section.

Show:
- Habits scheduled today.
- Completion controls.
- Completed / scheduled count.
- Relevant, low-emphasis habit metadata.

Rules:
- Completing a habit should update the interface promptly.
- If persistence fails, revert misleading optimistic UI and show feedback.
- Repeated completion actions must not create duplicate records.
- Completed and pending habits remain distinguishable.
- If all habits are completed, communicate completion calmly.
- If no habits are scheduled, show an appropriate rest-day state.
- If no habits have ever been created, offer a clear path to create the first habit.
- "All habits" remains accessible.

Avoid overemphasizing streaks on Today. Historical consistency belongs primarily in Habits.

### Section F — Daily check-in

Replace the current large invitation card and multi-step modal with a compact, optional inline interaction.

Before check-in:
- Show "A moment to reflect" and a short optional invitation.
- Provide a clearly identifiable action.

During check-in:
- Expand inline.
- Show mood as five clearly labeled choices, with accessible semantics.
- Show energy using labeled choices.
- Make the selected state obvious.
- Do not silently change the existing 1–5 storage model; map labels to existing values where appropriate.
- Provide save and cancel functionality.
- Do not require users to record mood or energy unless required by validated domain behavior.

After check-in:
- Collapse into a concise summary of the recorded values.
- Provide Edit.
- Do not automatically reopen the form on subsequent page visits.

Error handling:
- Failed submissions should preserve selections.
- Display clear error feedback and retry behavior.

Check-in is optional. Never represent its absence as failure.

### Section G — Behavioral calendar

Remove the full monthly behavioral calendar from Today.

Preserve historical habit data and existing analytics.

Keep or relocate the monthly calendar to the Habits module, depending on the current component architecture.

Do not add a replacement calendar to Today in this beta implementation.

## 4. Data-state model

The application must support these test fixtures:

- USER_EMPTY
- USER_SPARSE
- USER_NORMAL
- USER_DENSE

These are development/test scenarios, not global user classifications stored in the database.

Components determine their states independently.

### USER_EMPTY
- No user-created tasks.
- No events.
- No habits.
- No daily check-in.
- No recorded activity.

Expected: Welcoming, useful guidance without showing meaningless zeros or empty charts.

### USER_SPARSE
- Two habits scheduled today.
- No tasks due today.
- No scheduled events.
- No check-in yet.
- Little historical data.

Expected: Compact, visually balanced page; neither artificial filler nor large empty panels.

### USER_NORMAL
- Several tasks with mixed completion.
- Several scheduled habits.
- Two to four events.
- Completed daily check-in.
- Some historical activity.

Expected: Efficient daily overview with clear action hierarchy.

### USER_DENSE
- Fifteen or more tasks.
- Multiple overdue tasks.
- Several completed tasks.
- Many scheduled habits.
- Eight or more events.
- Historical activity and long text values.

Expected: Controlled content density, progressive disclosure, sensible truncation, and no uncontrolled page expansion.

Test mixed scenarios as well: empty Tasks, dense Habits, and populated Schedule must coexist correctly.

## 5. Layout rules

Desktop:
1. Greeting and daily orientation.
2. Two contextual status cards.
3. Tasks and Schedule side by side.
4. Habits across available content width.
5. Compact optional check-in.

Tablet:
- Use responsive sizing.
- Collapse side-by-side content when horizontal space is insufficient.
- Preserve reading order and action visibility.

Mobile:
- Single column.
- Order: greeting, status, tasks, schedule, habits, check-in.
- Touch targets should generally be at least 44 × 44 CSS pixels for primary touch actions where feasible.
- No horizontal scrolling caused by page content.
- All primary actions must remain reachable.

Across all viewports:
- Do not enforce equal heights across unrelated cards.
- Avoid nested scroll containers except where genuinely necessary.
- Empty components must not use unnecessary minimum heights.
- Do not leave visually orphaned components or large artificial gaps.
- Respect reduced-motion preferences.
- Maintain sufficient text contrast and visible keyboard focus.

## 6. Interaction design

Use existing LifeOS components wherever possible.

Every user-facing interaction must support:
- Default.
- Hover, where applicable.
- Keyboard focus.
- Disabled.
- Loading or saving.
- Success or persisted state.
- Error and retry.

For data mutations:
- Prevent duplicate submissions.
- Preserve form state following errors.
- Ensure UI consistency after navigation or refresh.
- Provide immediate, understandable feedback.
- Avoid unnecessary confirmation dialogs for harmless reversible actions.
- Keep confirmation or undo protection for destructive operations as appropriate.

## 7. Data and timezone correctness

- Use real authenticated account data.
- Respect the user's configured timezone.
- Avoid mixing browser-local, UTC, and server dates without explicit conversion.
- Handle day-boundary transitions correctly.
- Preserve records across reloads and sessions.
- Avoid assuming every day has scheduled tasks or habits.
- Ensure overdue calculations exclude completed tasks where appropriate.
- Distinguish never-created records from records completed or absent on the selected day.

## 8. Acceptance criteria

The Today redesign is complete only if:

- [ ] Existing LifeOS styling remains recognizable.
- [ ] First-use empty state looks intentional.
- [ ] Naturally empty days do not feel broken or punitive.
- [ ] Completed-task days are distinguishable from days with no tasks.
- [ ] Two contextual status cards replace the four permanent KPIs.
- [ ] Task creation requires minimal interaction.
- [ ] Event creation is clear and correctly validated.
- [ ] Habit completion works and persists.
- [ ] Check-in is compact, optional, editable, and persistent.
- [ ] Monthly calendar no longer consumes Today layout space.
- [ ] Sparse state has no awkward structural gaps.
- [ ] Dense state handles overflow and long content.
- [ ] Mobile and desktop layouts remain usable.
- [ ] Loading and error states are handled.
- [ ] Keyboard navigation and focus are functional.
- [ ] No unrelated backend or schema changes were introduced.
- [ ] Existing relevant tests pass and new critical state tests are added.

## 9. Implementation workflow

**Do not immediately refactor the page upon reading this document.**

Phase 1 — Inspect:
- Identify actual components, hooks, endpoints, types, state management, and existing tests.
- Compare current behavior with this specification.
- Identify contradictions with current backend contracts.
- Identify reusable design primitives.
- Produce a concise implementation plan and file-impact list.

Phase 2 — Implement:
1. Information hierarchy and KPI behavior.
2. Tasks and Schedule state handling.
3. Lightweight creation interactions.
4. Habits and check-in refinements.
5. Responsive layout and accessibility.

Phase 3 — Validate:
- Run relevant tests, linting, and type checking.
- Verify all four data fixtures.
- Test with real persisted records.
- Test page reloads and network failures.
- Report any incomplete criteria honestly.

Do not proceed with broad unrelated code changes.

## 10. Definition of done

Today is ready for beta when a first-time or returning user can understand their day, create and complete a task, inspect scheduled events, complete a habit, and optionally record a check-in without guidance.

The page must remain calm and purposeful with no data or extensive data.

**Visual perfection, new features, and elaborate analytics are explicitly outside the definition of done.**