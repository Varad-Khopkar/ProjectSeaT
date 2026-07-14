# ProjectSeaT Architecture Contract

## 1. Architecture Authority Rule

* The actual current repository structure and working implementation are the primary source of architectural truth.
* `AGENTS.md` defines the mandatory development and architectural constraints for development agents.
* `STRUCTURE.md`, `DEVELOPMENT_STANDARDS.md`, `README.md`, and other documentation files are supporting references and may become outdated as the project evolves.
* When documentation conflicts with the actual working codebase, do not blindly restructure the code to match outdated documentation.
* Inspect the current implementation and preserve the established working architecture.
* If a significant architectural contradiction is discovered, report it to the user instead of silently choosing one interpretation.
* Do not perform project-wide folder migrations or architectural cleanup solely to make the repository match older documentation.

## 2. High-Level System Architecture

ProjectSeaT is divided into two major application domains:

1. **Platform**
2. **Simulator**

The Platform and Simulator have different responsibilities and must remain logically separated.

The intended high-level relationship is:

Platform → Training Launch → Simulator Runtime → Training Result → Platform

The Platform is the application orchestrator.

The Simulator is the interactive training runtime.

Neither domain should unnecessarily absorb the internal responsibilities of the other.

## 3. Platform Ownership Rule

The Platform owns the broader ProjectSeaT application experience.

Platform responsibilities include, but are not limited to:

* Public landing experience.
* Application navigation.
* Learner dashboard.
* Training discovery.
* Module discovery.
* Learning path presentation.
* Course and module access.
* User profile.
* Settings.
* Help interfaces.
* Leaderboards.
* Platform-level progress presentation.
* Training launch orchestration.
* Future authentication integration.
* Future user and organization context.
* Future role-based access.
* Future backend and API orchestration.
* Receiving training results from the Simulator.

Platform page-level screens belong under the established `src/pages/` architecture.

Platform-wide reusable UI may use the established shared component architecture under `src/components/`.

Do not move Simulator runtime internals into Platform page components.

Do not implement simulation engine logic directly inside `src/pages/`.

## 4. Simulator Ownership Rule

The Simulator is a dedicated interactive training runtime.

The Simulator owns:

* Mission runtime behavior.
* Training scenario execution.
* Simulation progression.
* Mission state.
* Objective state.
* Interactive inspection mechanics.
* Hotspot interaction.
* Scenario-specific runtime events.
* Branching dialogue behavior.
* Simulation scoring.
* Runtime feedback.
* Simulation completion.
* Simulation result generation.
* Mission Briefing runtime where associated with the training execution flow.
* Preparation stage runtime.
* Simulation stage runtime.

Simulator-specific implementation belongs under:

`src/simulation/`

The existing Simulator subsystem structure is authoritative and may contain:

* `src/simulation/components/`
* `src/simulation/config/`
* `src/simulation/engine/`
* `src/simulation/layouts/`
* `src/simulation/mock/`
* `src/simulation/routes/`
* `src/simulation/services/`
* `src/simulation/state/`
* `src/simulation/types/`
* `src/simulation/utils/`

Do not move Simulator-specific components into `src/components/` merely because they are React components.

Do not move Simulator state into Platform contexts unless the state is genuinely Platform-owned.

Do not place Simulator scenario configuration in Platform-level mock or data directories.

The Simulator must remain internally organized as a bounded application subsystem.

## 5. Platform and Simulator Boundary Rule

The Platform must not directly manipulate internal Simulator runtime state.

The Simulator must not directly manipulate unrelated Platform UI state.

Communication between Platform and Simulator must occur through a clear integration boundary.

Conceptually:

Platform Input → Simulator Runtime → Simulator Result

The Platform may provide training launch information such as:

* User identifier.
* Training identifier.
* Learning path identifier.
* Course identifier.
* Module identifier.
* Lesson identifier.
* Activity identifier.
* Mission identifier.
* Previously saved progress.
* Training configuration.
* User or organization context required by the simulation.

The Simulator may return result information such as:

* Mission identifier.
* Completion status.
* Completion timestamp.
* Score.
* Objective completion.
* Assessment result.
* Simulation performance metrics.
* Deficiencies identified.
* Decision outcomes.
* Runtime duration.
* Training result metadata.

Do not tightly couple this boundary to mock data structures when a stable typed contract can be used.

The integration boundary should use explicit TypeScript interfaces.

## 6. Simulator Integration Contract Rule

Simulator launch data and Simulator result data must use clearly defined TypeScript contracts.

Shared integration contracts should be stored in a location appropriate for cross-domain use.

Do not define separate incompatible copies of the same Simulator launch or result interface in Platform and Simulator code.

The agent must prefer a single typed contract for shared Platform-Simulator communication.

Example conceptual contracts include:

* `SimulatorLaunchContext`
* `SimulatorResult`
* `SimulatorProgress`
* `SimulatorCompletionStatus`

The exact interface names may follow the existing codebase where equivalent types already exist.

Before creating a new integration type:

1. Search `src/types/`.
2. Search `src/simulation/types/`.
3. Search existing contexts and services.
4. Reuse or safely extend an existing compatible type where appropriate.

Do not create duplicate domain contracts solely for implementation convenience.

## 7. Simulator Encapsulation Rule

Code outside `src/simulation/` must not import deep Simulator internals without a clear architectural reason.

Avoid imports such as:

`@/simulation/engine/internal/...`

or:

`@/simulation/state/internal/...`

from Platform code.

The Simulator should expose approved public functionality through its established public entry boundary.

`src/simulation/index.ts` should be treated as the preferred public export boundary for Simulator functionality where technically appropriate.

Platform code should prefer importing Simulator-facing functionality from the Simulator public boundary instead of deep internal paths.

Do not expose every Simulator internal component, utility, or state function publicly.

Only expose functionality required for integration.

## 8. Shared Component Classification Rule

The repository currently contains both:

* `src/components/common/`
* `src/components/ui/`

Do not automatically merge, rename, or migrate these directories.

Until explicitly refactored, classify new shared components using existing implementation patterns.

Before creating a new component:

1. Search `src/components/common/`.
2. Search `src/components/ui/`.
3. Search `src/components/navigation/`.
4. Search `src/components/layout/`.
5. Search `src/simulation/components/`.

Reuse an existing component when technically appropriate.

Do not create a duplicate Button, Card, Badge, Modal, Dialog, Progress indicator, or other generic UI primitive solely because it exists in another folder.

When a component is Simulator-specific, keep it under `src/simulation/components/`.

When a component is Platform-specific and page-local, it may remain near the relevant Platform implementation if that matches the current pattern.

When a component is genuinely reusable across the broader application, use the established shared component architecture.

Do not perform a `common` versus `ui` consolidation unless explicitly commanded by the user.

## 9. Data Classification Rule

The repository currently contains:

* `src/data/`
* `src/mock/`
* `src/simulation/mock/`
* `src/simulation/config/`

These directories have different architectural purposes.

### `src/data/`

Use for application-level structured data and static Platform datasets.

### `src/mock/`

Use for Platform-level mock data that represents unavailable backend or API data.

### `src/simulation/mock/`

Use for Simulator-specific mocked runtime inputs, mocked services, or temporary Simulator integration data.

### `src/simulation/config/`

Use for structured Simulator and mission configuration that defines intended runtime behavior.

Do not place intentional mission configuration in a mock directory merely because the data is currently local.

Do not place temporary fake backend responses in configuration directories.

The distinction is:

Configuration defines intended behavior.

Mock data imitates unavailable external data.

Static data represents application content or structured local datasets.

Agents must preserve this distinction.

## 10. Mission Configuration Rule

ProjectSeaT must support hundreds of future maritime training modules.

Therefore, module-specific training content must not be deeply hardcoded into reusable Simulator engine components.

Mission-specific content should be represented through structured configuration wherever technically reasonable.

Configuration may define:

* Mission metadata.
* Mission objectives.
* Briefing content.
* Information cards.
* Notes.
* Assessment questions.
* Assessment answers.
* Passing requirements.
* Preparation content.
* Locations.
* Inspection hotspots.
* Documents.
* Deficiencies.
* Dialogue nodes.
* Decision outcomes.
* Feedback.
* Scoring rules.
* Completion conditions.

Reusable runtime components should consume configuration rather than contain the content of a single mission directly.

Do not create a separate Simulator architecture for every training module.

The preferred scalability model is:

Reusable Engine + Reusable Runtime Components + Mission Configuration

not:

Mission 1 Custom Application + Mission 2 Custom Application + Mission 3 Custom Application

## 11. Mission Briefing Architecture Rule

The Mission Briefing system is part of the reusable training runtime architecture.

The approved Mission Briefing flow is:

1. Introduction / Objectives.
2. Information Cards / Notes.
3. MCQs / Grading.
4. All Passed.
5. State Sync.
6. Accessible Anytime.
7. Simulation transition.

Mission Briefing content must be data-driven.

Briefing presentation components must not be tightly coupled to a single maritime module.

Assessment questions, answers, grading rules, notes, and objectives should come from structured mission configuration.

The Briefing engine must support future modules primarily through configuration changes.

Do not duplicate the Mission Briefing UI for each module.

## 12. Training Hierarchy Rule

The ProjectSeaT learning hierarchy is:

Learning Path → Course → Module → Lesson → Activity

Simulator missions or interactive training experiences are launched within this broader learning structure.

Do not flatten the entire Platform into a mission-only data model.

Do not assume:

Course = Module.

Module = Mission.

Lesson = Activity.

Mission = Learning Path.

Identifiers for these entities must remain conceptually distinct even when the current demo uses only one active training module.

The current single-module demo must not be used as justification for permanently hardcoding a single-module architecture.

## 13. State Ownership Rule

State must be owned by the domain responsible for it.

### Platform-owned state may include:

* User context.
* Authentication context.
* Organization context.
* Role context.
* Platform navigation state.
* Learning path state.
* Course and module availability.
* Platform-level progress records.
* User preferences.

### Simulator-owned state may include:

* Active mission state.
* Current simulation stage.
* Objective progress.
* Runtime score.
* Active location.
* Inspected hotspots.
* Dialogue state.
* Decision history.
* Deficiency findings.
* Simulation timer.
* Runtime feedback.
* Mission completion state.

Do not duplicate Simulator runtime state in Platform contexts.

Do not make Platform pages directly update internal mission state.

When Simulator completion occurs, produce a result that can be consumed by the Platform.

## 14. Service Boundary Rule

Simulator-specific service logic belongs under:

`src/simulation/services/`

Services may abstract:

* Progress persistence.
* Result submission.
* Mission loading.
* Training synchronization.
* Future API communication.

Do not directly scatter backend or persistence calls throughout Simulator visual components.

Visual components should not become API integration layers.

Until a real backend exists, service interfaces may use local or mock implementations.

Mock implementations must not be represented as real backend integration.

The architecture should allow mock services to be replaced with real API services without rebuilding the Simulator UI.

## 15. Engine Rule

Reusable simulation logic belongs under:

`src/simulation/engine/`

Engine logic should focus on reusable runtime behavior rather than visual presentation.

Examples include:

* Objective evaluation.
* Scoring evaluation.
* Completion evaluation.
* Scenario progression.
* Decision processing.
* Deficiency evaluation.
* Runtime event handling.

Do not place large visual React components inside the engine layer.

Do not place mission-specific textual content directly inside generic engine functions.

Engine logic should operate on typed state and configuration where technically appropriate.

## 16. Route Ownership Rule

Platform routes are orchestrated by the main application routing architecture.

Simulator route definitions and Simulator-specific route behavior belong under:

`src/simulation/routes/`

Do not duplicate the same Simulator route definition across unrelated Platform files.

Platform routing may mount or expose Simulator routes.

The Simulator route layer owns Simulator-specific navigation behavior.

Preserve SPA deep-link and direct refresh compatibility.

Do not change Simulator URLs solely for naming cleanup.

## 17. Layout Ownership Rule

Platform layouts belong under the established Platform/shared layout architecture.

Simulator runtime layouts belong under:

`src/simulation/layouts/`

A Simulator layout may control:

* Runtime viewport.
* Simulation HUD placement.
* Mission overlays.
* Objective panels.
* Runtime aspect ratio.
* Simulation-specific responsive behavior.

Do not force Simulator runtime screens into a generic Platform dashboard layout when doing so damages the training experience.

Likewise, do not use Simulator layouts for unrelated Platform pages.

## 18. Shared Type Rule

Use `src/types/` for domain types that are genuinely shared across the broader ProjectSeaT application.

Use `src/simulation/types/` for types internal to the Simulator runtime.

A type required by both Platform and Simulator should not remain hidden as an internal Simulator type if doing so creates duplicated definitions.

Before moving a type, inspect all consumers and preserve compatibility.

Do not move types solely for theoretical architectural purity.

## 19. Import Boundary Rule

Preferred dependency direction:

Shared Application Types / Utilities
↓
Platform and Simulator

Platform
↓
Simulator Public Integration Boundary

Simulator Public Boundary
↓
Simulator Internals

Avoid dependency direction such as:

Simulator Engine → Platform Page

Simulator State → Platform Navigation Component

Platform Page → Simulator Internal Engine Utility

Shared UI Component → Mission-Specific Simulator State

Circular domain dependencies are prohibited.

If a requested implementation creates a circular dependency between Platform and Simulator, stop and restructure the integration boundary.

## 20. Platform-Simulator Merge Safety Rule

Platform and Simulator are developed in parallel by different development teams.

Therefore:

* Assume both domains may contain recent independent changes.
* Do not overwrite a file with another branch's version without inspecting both versions.
* Do not resolve merge conflicts using blanket "ours" or "theirs" strategies for shared or integration files.
* Shared files must be merged intentionally.
* Preserve valid functionality from both development streams.
* Treat `package.json`, lock files, application routing, application entry files, global styles, shared types, shared components, and build configuration as high-risk merge surfaces.
* Simulator directory changes should remain isolated whenever possible.
* Platform changes should avoid unnecessary edits inside `src/simulation/`.
* Simulator changes should avoid unnecessary edits to Platform pages and shared application files.
* Cross-domain changes must be explicitly identified in completion reporting.

## 21. Architecture Change Rule

The architecture defined here is not permission to perform an immediate repository-wide refactor.

These rules govern new development and targeted modifications.

Do not:

* Move all existing files.
* Rename all directories.
* Consolidate all components.
* Rewrite all imports.
* Rebuild all contexts.
* Reorganize all mock data.

unless explicitly commanded by the user.

Architecture improvements should be incremental and task-driven.

Preserve working behavior first.

Improve structural consistency when the requested task naturally touches the affected area.

## 22. Architecture Conflict Reporting Rule

If the agent discovers:

* Duplicate architectural ownership.
* Conflicting shared types.
* Duplicate components.
* Platform-Simulator circular dependencies.
* Mission-specific logic embedded in reusable engine code.
* Mock data represented as real data.
* Conflicting route ownership.
* Conflicting state ownership.
* Documentation that materially contradicts working code.

the agent must:

1. Avoid destructive automatic restructuring.
2. Identify the conflict.
3. Explain the affected area.
4. Complete safe requested work where possible.
5. Report the architectural risk to the user.

Do not silently hide architectural conflicts through temporary aliases, duplicated code, or unsafe type assertions.
