# Graph Report - ProjectSeaT  (2026-07-01)

## Corpus Check
- 72 files · ~462,101 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 430 nodes · 618 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `157ab69a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 24|Community 24]]

## God Nodes (most connected - your core abstractions)
1. `useSimulation()` - 31 edges
2. `compilerOptions` - 18 edges
3. `compilerOptions` - 15 edges
4. `4. Phase 3.1 Extension: Simulation Engine Readiness` - 8 edges
5. `⚓ ProjectSeaT: Maritime Training Platform (Demo)` - 8 edges
6. `useApp()` - 7 edges
7. `Mission` - 7 edges
8. `ProjectSeaT | Development Standards & Conventions` - 7 edges
9. `ProjectSeaT | Environment Setup & Requirements` - 7 edges
10. `useInView()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AuthGuard()` --calls--> `useAuth()`  [INFERRED]
  src/App.tsx → src/contexts/AuthContext.tsx
- `AppLayout()` --calls--> `useApp()`  [INFERRED]
  src/components/layout/AppLayout.tsx → src/contexts/AppContext.tsx
- `Header()` --calls--> `useApp()`  [INFERRED]
  src/components/navigation/Header.tsx → src/contexts/AppContext.tsx
- `Sidebar()` --calls--> `cn()`  [INFERRED]
  src/components/navigation/Sidebar.tsx → src/utils/formatters.ts
- `AppProvider()` --calls--> `useAuth()`  [INFERRED]
  src/contexts/AppContext.tsx → src/contexts/AuthContext.tsx

## Import Cycles
- None detected.

## Communities (23 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (39): hotspotColors, hotspotIcons, MissionEngine, SceneEngine, SimulationEngine, DebriefLayout(), mockDialogues, pscMissionTemplate (+31 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (20): CardProps, AlertProps, BadgeProps, ModalProps, ProgressBarProps, StatusChipProps, ToastProps, TooltipProps (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (20): Header(), DialoguePanel(), CertItem, DocumentDesk(), FeedbackModal(), HotspotLayer(), MissionFooter(), MissionHeader() (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (20): 🧭 1. Project Mission & Objectives, 2.1 Color Palette, 2.2 Typography & Sizing tokens, 🎨 2. Design System & Theme, 3.1 Single-Frame Viewport Overlay Layout, 3.2 Interactive Audits, 3.3 Keyboard Accessibility, 3.4 Timed Onboarding/Offboarding Loops (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (21): SectionContainerProps, BreadcrumbProps, NavbarProps, SidebarProps, TabsProps, Checkbox, CheckboxProps, Dropdown (+13 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (26): dependencies, lucide-react, react, react-dom, react-router-dom, devDependencies, oxlint, tailwindcss (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (12): COMPARISON, ComparisonSection(), FEATURES, FeaturesSection(), StatsSection(), TEAM, TeamSection(), TECH (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (29): AuthGuard(), AppLayout(), AppLayoutProps, MainContainer(), MainContainerProps, iconMap, Sidebar(), SidebarProps (+21 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (6): AccordionItem, AccordionProps, EmptyStateProps, PaginationProps, TableProps, TimelineProps

### Community 11 - "Community 11"
Cohesion: 0.06
Nodes (30): 1. Directory Structure & Architecture, 2. File and Component Naming, 3. Import Organization, 4. TypeScript Guidelines, 5. CSS & Styling Standards, 6. Git Push Deployment Log Rules, ProjectSeaT | Development Standards & Conventions, 1. High-Level Flow Chart (+22 more)

### Community 12 - "Community 12"
Cohesion: 0.17
Nodes (11): 1. Prerequisites, 2. Installation, 3. Development Stack Reference, 4. Environment Scripts, 5. Editor Recommendations, 6. Standards Compliance, Linter Check, Local Development Server (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.12
Nodes (16): 1. Phase 1: Project Initialization, 2. Phase 2: Design System & Component Library, 3. Phase 3: Application Foundation & Architecture, 4.1 Module Structure (`src/simulation/`), 4.2 Simulation UI Components, 4.3 Layout Compositions, 4.4 Routing, 4.5 Mock Mission Template (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 22 - "Community 22"
Cohesion: 0.29
Nodes (4): HeaderNotification, headerNotifications, searchDatabase, SearchItem

## Knowledge Gaps
- **208 isolated node(s):** `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components`, `name` (+203 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useSimulation()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `Header()` connect `Community 2` to `Community 8`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `⚓ ProjectSeaT: Maritime Training Platform (Demo)` connect `Community 3` to `Community 11`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `$schema`, `plugins`, `react/rules-of-hooks` to the rest of the system?**
  _208 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05698778833107191 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06306306306306306 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12857142857142856 - nodes in this community are weakly interconnected._