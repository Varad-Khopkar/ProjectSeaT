# ProjectSeaT | Development Standards & Conventions

This document outlines the coding standards, folder structures, and architectural boundaries to keep the Maritime Training Platform frontend codebase consistent, scalable, and maintainable. All development agents and engineers must adhere to these guidelines.

---

## 1. Directory Structure & Architecture

All application files reside within the `src/` directory, separated into the **Platform** domain (the orchestrator) and the **Simulator** domain (the interactive runtime):

| Directory | Domain / Scope | Purpose | Naming Convention |
| :--- | :--- | :--- | :--- |
| `src/components/common/` | Platform (Shared) | Generic shared reusable application components | PascalCase (e.g. `Card.tsx`) |
| `src/components/ui/` | Platform (Shared) | Reusable atomic UI primitive elements (Button, Input, etc.) | PascalCase (e.g. `Button.tsx`) |
| `src/components/layout/` | Platform | Platform layout containers and page shells | PascalCase (e.g. `AppLayout.tsx`) |
| `src/components/navigation/` | Platform | Platform headers, sidebars, and breadcrumbs | PascalCase (e.g. `Header.tsx`) |
| `src/pages/` | Platform | Complete screen pages bound to React Router paths | PascalCase (e.g. `Home.tsx`) |
| `src/contexts/` | Platform | Global React Context state providers | PascalCase (e.g. `AuthContext.tsx`) |
| `src/data/` | Platform | Application-level structured or static Platform datasets | camelCase (e.g. `headerDb.ts`) |
| `src/mock/` | Platform | Platform-level mock data representing unavailable API/backend data | camelCase |
| `src/types/` | Shared | Domain types and TypeScript contracts genuinely shared across the application | camelCase |
| `src/simulation/` | Simulator | Bounded subsystem container folder for all Simulator runtime assets | (Contains nested subdirectories) |
| `src/simulation/components/` | Simulator | Simulator-specific React components (not to be merged with Platform) | PascalCase (e.g. `DialoguePanel.tsx`) |
| `src/simulation/config/` | Simulator | Intentional Simulator and mission configuration defining runtime behavior | camelCase (e.g. `briefingConfig.ts`) |
| `src/simulation/engine/` | Simulator | Reusable engine logic focused on runtime behavior (evaluations, scoring) | camelCase |
| `src/simulation/layouts/` | Simulator | Simulator runtime viewports and HUD overlays | PascalCase (e.g. `SimulationLayout.tsx`) |
| `src/simulation/mock/` | Simulator | Simulator-specific mocked inputs, mocked services, or temporary data | camelCase |
| `src/simulation/routes/` | Simulator | Simulator page-level screens bound to routes | PascalCase (e.g. `SimulationPlay.tsx`) |
| `src/simulation/services/` | Simulator | Persistence abstractions, state sync, and synchronization services | PascalCase |
| `src/simulation/state/` | Simulator | Simulator-internal runtime context and state management | PascalCase (e.g. `SimulationContext.tsx`) |
| `src/simulation/types/` | Simulator | Simulator-internal runtime types (not shared with Platform) | camelCase / index.ts |
| `src/simulation/utils/` | Simulator | Reusable simulator-specific pure helper utilities | camelCase |

---

## 2. Platform and Simulator Architectural Boundaries

The Platform and Simulator have distinct boundaries. Neither domain should absorb the responsibilities of the other.

### 2.1. Communication Interface
Communication between the Platform and Simulator occurs through a clear, strictly typed integration boundary:
* **Platform Input (Launch Context)**: The Platform provides information such as User ID, Course ID, Module ID, Lesson ID, and Mission ID.
* **Simulator Result**: The Simulator returns information such as Completion Status, Completed Timestamp, Score, Objective Completion list, and deficiency metrics.

This integration boundary must use single compatible TypeScript contracts rather than duplicate interfaces. Conceptual contracts may include SimulatorLaunchContext and SimulatorResult. Before introducing new contracts, search for and reuse or safely extend existing equivalent types.

### 2.2. Import Restrictions & Encapsulation
* Platform code must avoid deep imports into Simulator internal folders (e.g., `import '@/simulation/engine/internal/...'` is prohibited).
* Platform code should only import approved Simulator features via the public integration boundary [src/simulation/index.ts](./src/simulation/index.ts).
* Circular domain dependencies (Platform → Simulator → Platform) are strictly prohibited.

---

## 3. Component Reuse & Shared Classification

To avoid code bloat and duplication of UI primitives (e.g., Buttons, Cards, Badges):
1. **Search Before Creating**: Before implementing any new component, developers must inspect existing components in:
   * `src/components/common/`
   * `src/components/ui/`
   * `src/components/navigation/`
   * `src/components/layout/`
   * `src/simulation/components/` (if working inside the Simulator)
2. **Classification**:
   * Do not automatically merge or consolidate `common` and `ui` directories.
   * Reusable UI primitives belong in `src/components/ui/` or `src/components/common/`.
   * Simulator-specific elements must remain encapsulated in `src/simulation/components/`.

---

## 4. Data Classification Rules

Distinguish clearly between data folders using these strict semantic rules:

* **Configuration (`src/simulation/config/`)**: Defines intended, data-driven Simulator/mission behavior (objectives, passing requirements, questions, answers, notes, hotspot coordinates).
* **Mock Data (`src/mock/` or `src/simulation/mock/`)**: Imitates backend API databases and responses that are currently unavailable.
* **Static Data (`src/data/`)**: Represents static application text content or local structured datasets.

---

## 5. Scalability & Learning Hierarchy

### 5.1. Learning Hierarchy Model
The ProjectSeaT learning hierarchy must be represented as follows:
`Learning Path` → `Course` → `Module` → `Lesson` → `Activity`

We do not collapse these separate entities into a single flat model. The system must remain structured to scale for hundreds of future training modules.

### 5.2. Simulator Scalability
To support scalable module additions without code duplication, follow this model:
$$\text{Reusable Simulator Engine} + \text{Reusable Components} + \text{Mission Configuration}$$
We explicitly reject the pattern of duplicating the application for each mission:
$$\times \text{ Mission 1 Application } + \text{ Mission 2 Application } + \text{ Mission 3 Application}$$

---

## 6. Mission Briefing Subsystem

The Mission Briefing flow is a reusable sequence that must progress through these stages:
1. **Introduction / Objectives**
2. **Information Cards / Notes**
3. **MCQs / Grading**
4. **All Passed**
5. **State Sync**
6. **Accessible Anytime**
7. **Simulation Transition**

Briefing content and assessments must be data-driven via mission configuration rather than hardcoded in React presentation files.

---

## 7. Technology Stack Conventions

All code must align with the verified technology stack:
* **React 19**: Use modern functional components, standard hooks, and strict state lifecycle boundaries. Explicitly declare interface types for component props.
* **TypeScript 6**: Maintain strict typing, avoid `any`, and export components via named exports (`export const MyComponent`) for indexing efficiency.
* **Tailwind CSS v4**: Build responsive-first user interfaces using Tailwind utility classes. Centralize design tokens inside the `@theme` block in [src/index.css](./src/index.css).
* **Oxlint**: Utilize the fast Oxlint linter configuration for code validation.
* **Module Resolution**: Use ES Modules format.
* **Node Runtime**: Develop and run code on Node.js runtimes `node >= 20.0.0` (specifically requiring `^20.19.0 || >=22.12.0` due to bundler requirements).

---

## 8. Git and Agent Execution Rules

Git operations, push tracking, walkthrough restrictions, and development-agent execution constraints are governed by `AGENTS.md`.

All development agents must read and follow `AGENTS.md` before executing repository-altering Git operations.

`AGENTS.md` is the authoritative source for Git safety, push logging, walkthrough restrictions, and agent execution rules.

Do not duplicate or redefine those policies in this document.
