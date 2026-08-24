# Design asset rename map

## Components

| Current name/path | Canonical Figma name | Canonical repo path | Angular mapping if any | Action |
|---|---|---|---|---|
| `Components/Button` | `Actions / Button / [variant]` | `components/actions/button/` | Shared `.btn` / `.button` primitive | Moved; retain variants in one set |
| `Components/Header - Top App Bar` | `Navigation / Top Bar / Default` | `components/navigation/top-bar/` | `AppShellComponent` top bar | Moved and clarified purpose |
| `Components/Icons` | `Foundations / Icon / [purpose]` | `components/foundations/icon/` | Shared `.ui-icon` and shell icon assets | Moved; singularized |
| `Components/Insights & Recovery` | `Insights / Recovery Card / Default` | `components/insights/recovery-card/` | No shared component yet | Moved; separated category from component |
| `Components/KPI - Cards` | `Data Display / KPI Card / [variant]` | `components/data-display/kpi-card/` | `UiStatCardComponent` | Moved; singularized |
| `Components/KPI - Subtitles` | `Data Display / KPI Subtitle / [variant]` | `components/data-display/kpi-subtitle/` | Stat-card supporting text | Moved; singularized |
| `Components/Link` | `Actions / Link / [variant]` | `components/actions/link/` | Shared link styling | Moved |
| `Components/Link Accounts` | `Actions / Account Link / [variant]` | `components/actions/account-link/` | Auth inline actions | Moved; purpose clarified |
| `Components/Logo Area` | `Branding / Logo Area / Default` | `components/branding/logo-area/` | `AppShellComponent` brand row | Moved |
| `Components/Logos` | `Branding / Logo / [brand]` | `components/branding/logo/` | Shell/auth logo asset | Moved; singularized |
| `Components/Navigation Content` | `Navigation / Navigation Item Content / [destination]` | `components/navigation/navigation-item-content/` | `AppShellComponent` navigation item | Moved; responsibility clarified |
| `Components/Sidebar Navigation` | `Navigation / Sidebar / [shell]` | `components/navigation/sidebar/` | `AppShellComponent` sidebar | Moved; hierarchy normalized |
| `Components/Text Field` | `Forms / Text Field / Default` | `components/forms/text-field/default/` | Shared `.field` / `.ui-input` | Moved as separately exported variant evidence |
| `Components/Text Field Complete` | `Forms / Text Field / Complete` | `components/forms/text-field/complete/` | Shared `.field` / `.ui-input` | Moved under the same component concept |

## Frames

| Current name/path | Canonical Figma name | Canonical repo path | Angular mapping if any | Action |
|---|---|---|---|---|
| `Frames/LifeOS Finance/LifeOS Finance` | `Finance / Overview / Populated / Expanded` | `frames/finance/overview/populated-expanded/` | `FinanceLandingComponent` | Moved |
| `Frames/LifeOS Finance/LifeOS Finance - SC` | `Finance / Overview / Populated / Collapsed` | `frames/finance/overview/populated-collapsed/` | `FinanceLandingComponent` | Moved; expanded `SC` |
| `Frames/LifeOS Finance/LifeOS Finance Empty` | `Finance / Overview / Empty / Expanded` | `frames/finance/overview/empty-expanded/` | `FinanceLandingComponent` | Moved |
| `Frames/LifeOS Finance/LifeOS Finance Empty - SC` | `Finance / Overview / Empty / Collapsed` | `frames/finance/overview/empty-collapsed/` | `FinanceLandingComponent` | Moved; expanded `SC` |
| `Frames/LifeOS Habits/LifeOS Habits` | `Habits / Overview / Populated / Expanded` | `frames/habits/overview/populated-expanded/` | `HabitsWorkspaceComponent` | Moved |
| `Frames/LifeOS Habits/LifeOS Habits - SC` | `Habits / Overview / Populated / Collapsed` | `frames/habits/overview/populated-collapsed/` | `HabitsWorkspaceComponent` | Moved; expanded `SC` |
| `Frames/LifeOS Habits/LifeOS Habits Empty` | `Habits / Overview / Empty / Expanded` | `frames/habits/overview/empty-expanded/` | `HabitsWorkspaceComponent` | Moved |
| `Frames/LifeOS Habits/LifeOS Habits Empty - SC` | `Habits / Overview / Empty / Collapsed` | `frames/habits/overview/empty-collapsed/` | `HabitsWorkspaceComponent` | Moved; expanded `SC` |
| `Frames/LogIn Desktop` | `Auth / Login / Default / Public` | `frames/auth/login/default-public/` | `SignInComponent` login mode | Moved; normalized `Login` |
| `Frames/SignIn Desktop` | `Auth / Sign Up / Default / Public` | `frames/auth/sign-up/default-public/` | Account-creation UI not currently routed separately | Moved; corrected registration semantics |

The legacy `SignIn Desktop` frame contains “Create your account,” password confirmation, and “Create Account”; it is therefore Sign Up. The legacy `LogIn Desktop` frame contains “Log In” and “Forgot Password?”; it is Login.

The exported `kpi-card/spec.md`, `navigation/top-bar/spec.md`, and `finance/overview/populated-expanded/spec.md` remain zero-byte because their source Markdown exports were already empty. Their PNG references were preserved; re-export these specs from Figma instead of inventing numeric data.
