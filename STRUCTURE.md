# Maritime Training Platform (Demo) | Project Structure

This document outlines the codebase organization, configuration decisions, and development guidelines for the Maritime Training Platform Frontend Demo.

## Tech Stack Overview

- **Core Framework**: React 19 + Vite 8
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS v4 (native `@tailwindcss/vite` configuration)
- **Routing**: React Router v7 (`react-router-dom`)
- **Iconography**: Lucide React

## Folder Architecture

The codebase utilizes a clean and scalable modular directory structure located in the `src/` folder:

```text
src/
├── assets/             # Images, logos, static illustrations, and ship schematics
├── components/         # Reusable React components
│   ├── common/         # Atomic UI building blocks (Button, Card, Badge, Modal, etc.)
│   └── layout/         # Shell containers (AppLayout, Header, Navigation)
├── pages/              # Screen components corresponding to the demo flow stages
├── hooks/              # Custom reusable React hooks
├── types/              # TypeScript types, interfaces, and domain definitions
├── utils/              # Pure utility functions and formatters
├── data/               # Local mock database and static configuration data
├── App.tsx             # Main routing configurations and global state boundary
├── index.css           # Tailwind CSS directives and primary styles entry point
└── main.tsx            # Application bootstrapping and React DOM mounting
```

## Key Configuration Decisions

### 1. Tailwind CSS v4 Integration
Tailwind CSS v4 is configured natively in [vite.config.ts](file:///c:/Users/admin/Documents/ProjectSeaT/vite.config.ts) using the new `@tailwindcss/vite` plugin. The styles are imported inside [src/index.css](file:///c:/Users/admin/Documents/ProjectSeaT/src/index.css) using the directive:
```css
@import "tailwindcss";
```

### 2. Path Aliases
To avoid messy relative path traversals (e.g., `../../components/common/Button`), we have configured a path alias `@` mapping to `src/`.
- **TypeScript Configuration**: Set up in [tsconfig.app.json](file:///c:/Users/admin/Documents/ProjectSeaT/tsconfig.app.json) under `compilerOptions.paths`.
- **Vite Configuration**: Resolved in [vite.config.ts](file:///c:/Users/admin/Documents/ProjectSeaT/vite.config.ts) under `resolve.alias`.

Example import:
```typescript
import { Button } from '@/components/common/Button'
```

### 3. Application Flow Stages
Components under `src/pages/` should correspond directly to the sequential learning stages:
1. **Splash Screen**: Initial loading and intro logo.
2. **Mission Selection**: Overview of available training missions (focusing on Port State Control).
3. **Mission Brief**: Mission goals, context, and checklists.
4. **Ship Overview**: Interactive overview map of the ship compartments.
5. **Interactive Challenges**: Interactive mini-games and scenario simulations.
6. **Inspector Interaction**: Interactive dialogues.
7. **Mission Summary / Complete**: Final score, checklist confirmation, and feedback.
