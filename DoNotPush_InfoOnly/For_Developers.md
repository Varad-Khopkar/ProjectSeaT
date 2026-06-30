# ProjectSeaT | Developer Handover Documentation

This document serves as the guide for engineers working on the Maritime Training Platform Frontend Demo. It summarizes all features, architectural configurations, design tokens, and files implemented from project bootstrapping through Phase 3.

---

## 1. Phase 1: Project Initialization

Established the foundation stack using high-performance modern web tooling:
- **Framework**: React 19 + Vite 8.
- **Compiler**: TypeScript 6 configured with strict type checks.
- **Styling**: Tailwind CSS v4.3.1 integrated natively using `@tailwindcss/vite` plugin (eliminating legacy postcss pipelines).
- **Icons**: Lucide React.
- **Path Aliasing**: Configured `@/` as a path alias pointing directly to `src/` to prevent relative folder clutter (e.g. `../../` imports).
  - Configured in [tsconfig.app.json](file:///c:/Users/admin/Documents/ProjectSeaT/tsconfig.app.json) (`paths` key) and [vite.config.ts](file:///c:/Users/admin/Documents/ProjectSeaT/vite.config.ts) (`resolve.alias`).

---

## 2. Phase 2: Design System & Component Library

Built the design tokens, typography scales, and a comprehensive atomic component library shown on a dedicated Showcase page:
- **Primary Typeface**: `Manrope` loaded from Google Fonts in [index.html](file:///c:/Users/admin/Documents/ProjectSeaT/index.html) and assigned as the primary `--font-sans` in [src/index.css](file:///c:/Users/admin/Documents/ProjectSeaT/src/index.css).
- **Centralized Design Tokens**: Defined custom theme color variables inside the `@theme` block in [src/index.css](file:///c:/Users/admin/Documents/ProjectSeaT/src/index.css):
  - **Colors**: Harbor Navy (`#12355B`), Sea Blue (`#2F6690`), Harbor Gold (`#F4A261`), Sunset Coral (`#E76F51`), and Pearl (`#FAF7F2`).
  - **Radii**: Buttons (12px), Inputs (12px), Cards (16px), Dialogs (20px).
- **Atomic UI Components**:
  - `Button.tsx`: Named export supporting `variant` (`primary`, `secondary`, `outline`, `ghost`), sizes (`sm`, `md`, `lg`), loading spinner states, and left/right icon options.
  - `Card.tsx`: Flex container supporting borders and hover interactions (`standard`, `elevated`, `interactive`).
  - `Form.tsx`: Inputs (`TextInput`, `PasswordInput`, `SearchField`, `Textarea`), accessibility selections (`Checkbox`, `RadioButton`, `Dropdown`), and interactive switches (`ToggleSwitch`).
  - `Feedback.tsx`: Overlay warnings (`Alert` banner, status indicators, `Toast` timers, `Modal` overlays, `Tooltip` details, and custom `ProgressBar` meters).
  - `Data.tsx`: Multi-dimensional visual feeds (`Table` grids, chronological `Timeline`, custom `Accordion` FAQs, `EmptyState` course charts, `Pagination` bars, and pulse `SkeletonLoader` loaders).

---

## 3. Phase 3: Application Foundation & Architecture

Implemented the global layouts, responsive navigation, routing, global state, and folder structures:
- **Restructured Folder Hierarchy**: Relocated source code to match standard modular project structures:
  - `src/components/ui/` for raw visual components.
  - `src/components/layout/` for structural wrapping.
  - `src/components/navigation/` for headers, sidebars, and tab components.
  - `src/contexts/` for global state modules.
  - `src/mock/` for mock datasets.
  - `src/utils/` for helper formatters.
  - `src/constants/` for shared constants.
- **Routing & Pages**: Linked pages under [src/App.tsx](file:///c:/Users/admin/Documents/ProjectSeaT/src/App.tsx) inside a central `<AppLayout>` router using `react-router-dom`:
  - **Home** (`/`): Dashboard summarizing crew scores, completed checklist counters, and in-progress training checks.
  - **Modules** (`/modules`): List grid of unlocked, completed, and locked checks.
  - **Leaderboard** (`/leaderboard`): Top 3 podium layouts and score logs.
  - **Profile** (`/profile`): Seafarer licensing, emails, and unlocked compliance badges.
  - **Settings** (`/settings`): Accessibility selectors toggling high contrast modes, font scale ranges, sound setups, and synchronization rules.
  - **Help** (`/help`): Accordion items answering common SOLAS questions and mock ticket submission forms.
  - **NotFound** (`*`): Maritime-themed 404 screen.
  - **Design System Showcase** (`/design-system`): Grid page demonstrating all atomic components.
- **Global Context (`AppContext.tsx`)**: Managing sidebar expansion toggles on desktop, drawer slide-outs on mobile, alerts, global loading indicators, and accessibility preferences.
- **Responsive Navigation Drawer**: Configured a slide-out overlay menu panel triggers on mobile widths (`< 1024px`) when clicking the Header menu button, which automatically closes when link clicks transition paths.
- **Mock Data DB (`db.ts`)**: Serves local seafarer profiles, training progress percentages, crew scores, and unlocked compliance badges to allow offline UI development prior to API integration.
- **Utility Formatters (`formatters.ts`)**: Date-time formatters, score layout separators, and className joiners (`cn()`).
- **Coding Conventions**: Created [DEVELOPMENT_STANDARDS.md](file:///c:/Users/admin/Documents/ProjectSeaT/DEVELOPMENT_STANDARDS.md) detailing folder hierarchies, naming schemes, absolute imports, and TypeScript typing conventions.

---

## 4. Phase 3.1 Extension: Simulation Engine Readiness

Established the complete architectural foundation for the data-driven Simulation Engine without implementing any gameplay logic. Every future maritime mission can be created through configuration data rather than custom application code.

### 4.1 Module Structure (`src/simulation/`)

The simulation subsystem is fully isolated under `src/simulation/` with the following directories:

| Directory | Purpose |
|---|---|
| `types/` | Core TypeScript interfaces (`Mission`, `MissionScene`, `Hotspot`, `Objective`, `Dialogue`, `Reward`, `PlayerState`, `SimulationState`, etc.) |
| `mock/` | Sample PSC mission configuration template demonstrating the data-driven format |
| `state/` | `SimulationContext.tsx` — React context provider managing active missions, scene transitions, timer ticks, hotspot interactions, dialogue branching, and objective completions |
| `engine/` | Orchestrator class stubs (`SimulationEngine`, `MissionEngine`, `SceneEngine`) for future game loop integration |
| `services/` | Placeholder API service classes (`MissionService`, `SceneService`, `EventService`, `DialogueService`, `RewardService`, `ProgressService`) |
| `utils/` | Helper utilities (`MissionHelpers`, `SceneHelpers`, `EventHelpers`, `RewardHelpers`) for score calculations and hotspot positioning |
| `components/` | Reusable simulation UI blocks (see 4.2) |
| `layouts/` | Page-level composition layouts (see 4.3) |
| `routes/` | Route page components registered in App.tsx (see 4.4) |
| `hooks/` | Reserved for future custom hooks |
| `assets/` | Reserved for simulation-specific static assets |
| `index.ts` | Module gateway re-exporting all public APIs |

### 4.2 Simulation UI Components

All components consume the `useSimulation()` hook from the context provider:

- **`MissionHeader.tsx`** — Top bar displaying mission code, title, countdown timer (with red pulse under 60s), live score, and Pause/Resume toggle.
- **`MissionFooter.tsx`** — Bottom hint bar showing contextual guidance per active scene.
- **`ObjectivePanel.tsx`** — Sidebar checklist rendering objectives with pending/completed states, point values, and completion counts.
- **`DialoguePanel.tsx`** — Bottom-anchored slide-up overlay showing NPC speaker name, dialogue message, and branching choice buttons.
- **`SceneContainer.tsx`** — 16:9 aspect-ratio viewport container with scene title badge, placeholder background, and nested hotspot layer.
- **`HotspotLayer.tsx`** — Renders interactive hotspot buttons at percentage-based coordinates. Each hotspot type (`inspect`, `dialogue`, `action`, `transition`) has distinct colors and icons with pulse animations.
- **`MissionOverlay.tsx`** — Full-screen modal overlay for Paused, Success/Debrief, and Failed states with contextual action buttons.

### 4.3 Layout Compositions

- **`SimulationLayout.tsx`** — Primary simulation viewport composing MissionHeader → SceneContainer + ObjectivePanel (sidebar grid) → MissionFooter, with DialoguePanel and MissionOverlay as floating overlays.
- **`DebriefLayout.tsx`** — Post-mission summary screen with score cards (Points, Accuracy%, Elapsed Time, XP Earned), progress bar, objectives review checklist, and retry/return actions.

### 4.4 Routing

Reserved routes registered in [src/App.tsx](file:///c:/Users/admin/Documents/ProjectSeaT/src/App.tsx), each wrapped with `<SimulationProvider>`:

| Route | Component | Purpose |
|---|---|---|
| `/simulation` | `SimulationHub` | Config-driven card grid listing available missions with metadata and launch buttons |
| `/simulation/:missionId` | `SimulationPlay` | Active simulation viewport — auto-starts mission based on URL param |
| `/simulation/debrief` | `SimulationDebrief` | Post-mission score summary and objectives audit |
| `/simulation/results` | `SimulationResults` | Detailed per-scene objectives breakdown |

### 4.5 Mock Mission Template

The file [src/simulation/mock/missionTemplate.ts](file:///c:/Users/admin/Documents/ProjectSeaT/src/simulation/mock/missionTemplate.ts) contains a fully-structured PSC audit configuration demonstrating:

- **3 Scenes**: Ship Office, Navigation Bridge, Engine Room — each with positioned hotspots, typed objectives, and scene transition paths.
- **Hotspot Types**: `inspect` (Oil Record Book, Bridge Logbook, GMDSS Radio, Bilge Separator), `dialogue` (Inspector Kowalski conversation), `transition` (room-to-room navigation).
- **Dialogue Trees**: Branching dialogue nodes with choice-driven navigation between dialogue states.
- **Scoring**: 100 total points across 4 objectives, 80% passing threshold, 10-minute timer, 500 base XP with score-based multipliers.

### 4.6 Data-Driven Design Principle

**Creating a new mission requires ONLY configuration data**, not new application code:

1. Define a new `Mission` object following the interface contract in `types/index.ts`.
2. Populate `scenes`, `hotspots`, `objectives`, `transitions`, and `rewards`.
3. Add dialogue trees in the `mockDialogues` record.
4. Register the mission ID in `SimulationPlay.tsx`'s validation check (or later via a mission registry service).

The simulation engine, context provider, UI components, and layouts are all reusable across any number of missions.

### 4.7 Navigation

Added **Simulation Hub** entry to the sidebar navigation menu in [src/constants/index.ts](file:///c:/Users/admin/Documents/ProjectSeaT/src/constants/index.ts) with the `Compass` icon, appearing between Training Modules and Leaderboard.

---

## 5. Phase 3.2: Simulator Enhancements, ESC Handlers, and Authentication Offboarding

Implemented core interactive simulation features, keyboard accessibility controls, and custom authentication flows:

### 5.1 Single-Frame Viewport Overlay Layout
- **Responsiveness and Aspect Ratio**: Refactored the active simulator viewport inside `SimulationLayout.tsx` to maintain a strict, responsive 16:9 canvas card centered in a dark fullscreen background (`bg-slate-950`).
  - Constrained the canvas using:
    ```css
    width: '100vw',
    height: '56.25vw',
    maxHeight: '100vh',
    maxWidth: '177.78vh',
    ```
    This completely eliminates browser scrollbars, ensuring a single-frame app presentation on any screen size.
- **Absolute Overlay Position**: Restructured all HUD components (Header controls, Objective checklists, Dialog sheets, Hints footers, and Audit desk overlays) as absolute overlays layered *directly on top* of the scene viewport background.
- **Captain's Briefing Screen**: Integrated the Captain's welcome scene (`Captain_welcome.png`) and welcome message dialogue, presenting a landing briefing screen overlay prior to opening the active full-screen simulator workspace.

### 5.2 Keyboard Close Listeners (ESC Key)
- Added global event listeners mapping the `Escape` key (`keydown` handler) to close active interactive screens:
  - **Pause Menu Overlay**: Bounded within `MissionOverlay.tsx`.
  - **Document Inspection Desk**: Bounded within `DocumentDesk.tsx`.
  - **MLC Rest Hours logs Audit Panel**: Bounded within `RestHourLog.tsx`.
  - **Interactive feedback panels**: Bounded within `FeedbackModal.tsx`.
  - Automatically cleans up window event listeners on component unmounts.

### 5.3 Custom Authentication Offboarding Sequence
- **Logout Action**: Attached a route trigger handler to the header's sign out/logout actions.
- **Port Break Offboarding**: Clicking logout routes to a dedicated path `/offboard` displaying a port offboarding break animation. The animation runs for a timed span of 5-8 seconds before deleting local auth tokens and redirecting the seafarer to the public `/landing` route.
- **User Profile Management**: Refactored `AuthContext.tsx` and custom hooks to serve dynamic crew profiles, tracking levels, licenses, and badges.
