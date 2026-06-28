# ProjectSeaT | Development Standards & Conventions

This document outlines the coding standards, file structures, and development conventions to keep the Maritime Training Platform frontend codebase consistent, scalable, and maintainable.

---

## 1. Directory Structure & Architecture

All application files reside within the `src/` directory, grouped by architectural responsibility:

| Directory | Purpose | Naming Convention |
| :--- | :--- | :--- |
| `src/app/` | Main application bootstrappers (e.g., config routers) | camelCase / PascalCase |
| `src/components/ui/` | Reusable atomic UI elements (Buttons, Cards, Form controls) | PascalCase (e.g. `Button.tsx`) |
| `src/components/layout/` | Structural containers and page wrappers | PascalCase (e.g. `AppLayout.tsx`) |
| `src/components/navigation/` | Header, Sidebar, Breadcrumbs, and navigation panels | PascalCase (e.g. `Header.tsx`) |
| `src/pages/` | Complete screen pages bound to React Router paths | PascalCase (e.g. `Home.tsx`) |
| `src/contexts/` | Global React Context state providers | PascalCase (e.g. `AppContext.tsx`) |
| `src/mock/` | Local datasets and mock databases for offline/API-free development | camelCase (e.g. `db.ts`) |
| `src/utils/` | Reusable pure helper functions | camelCase (e.g. `formatters.ts`) |
| `src/constants/` | Constant configurations and static lookup dictionary maps | camelCase (e.g. `index.ts`) |
| `src/types/` | Shared TypeScript interface files | camelCase |

---

## 2. File and Component Naming

- **React Components**: Use PascalCase (e.g., `Card.tsx`, `TextInput.tsx`).
- **Hooks**: Use camelCase prefixed with `use` (e.g., `useApp.ts`).
- **Helper Scripts / Utilities**: Use camelCase (e.g., `formatters.ts`).
- **Tests**: Append `.test.tsx` or `.spec.tsx`.

---

## 3. Import Organization

Always use the path alias `@/` mapping to `src/` to prevent complex relative imports (e.g., `../../hooks` -> `@/hooks`).

Group imports in the following order, separated by a blank line:
1. React core imports (`react`, `useState`, etc.)
2. Third-party packages (e.g., `react-router-dom`, `lucide-react`)
3. Global Contexts and Custom Hooks (e.g., `@/contexts/AppContext`)
4. Reusable UI and Layout components (e.g., `@/components/ui/Button`)
5. Mock databases and helper utilities (e.g., `@/mock/db`, `@/utils/formatters`)
6. Styles or assets (if any)

Example:
```typescript
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award } from 'lucide-react'

import { useApp } from '@/contexts/AppContext'
import { Card } from '@/components/ui/Card'
import { formatScore } from '@/utils/formatters'
```

---

## 4. TypeScript Guidelines

- **Explicit Interfaces**: Always declare types for React component props.
- **Strict Typing**: Avoid using `any`. Use custom types or generics.
- **Exporting Components**: Prefer named exports for components (`export const ComponentName`) to ensure clean autocomplete indexing, except for the entry `App` file.

---

## 5. CSS & Styling Standards

- **Tailwind Utility Classes**: Avoid nesting raw CSS style overrides. Use utility classes from Tailwind CSS v4.
- **Design Tokens**: Centralize design tokens (colors, font-families, radii) inside the `@theme` block in `src/index.css`. Reference them via Tailwind custom classes (e.g., `bg-brand-navy`, `font-sans`).
- **Responsive Layouts**: Apply **Responsive-First Design**. Use responsive prefix bounds (e.g. `flex flex-col lg:flex-row`) to adapt fluidly across small mobile, tablet, and desktop screens.
