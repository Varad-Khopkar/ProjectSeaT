# ProjectSeaT | Environment Setup & Requirements

This document provides system prerequisites, installation guides, and environment scripts to help developers set up and verify the local development environment for the Maritime Training Platform.

---

## 1. Prerequisites

Ensure the following tools are installed on your local development machine:

* **Node.js**: `v18.x` or `v20.x` (LTS versions recommended)
* **npm**: `v9.x` or `v10.x` (comes bundled with Node.js)
* **OS**: Windows, macOS, or Linux
* **IDE**: VS Code (recommended) or any modern editor with TypeScript support

---

## 2. Installation

1. Clone or download the repository to your local directory.
2. Open a terminal in the root of the project directory.
3. Install the dependencies:
   ```bash
   npm install
   ```

---

## 3. Development Stack Reference

The application is built on a modern, fast development stack:

* **Framework**: React 19.x (utilizing concurrent rendering and modern hook systems)
* **Build Bundler**: Vite 8.x
* **Language**: TypeScript 6.x
* **CSS System**: Tailwind CSS v4 (configured via `@tailwindcss/vite` compiler plugin)
* **Router**: React Router v7.x (configured with nested route controllers)
* **Icons Library**: Lucide React
* **Linter**: Oxlint (ultra-fast JS/TS linter)

---

## 4. Environment Scripts

The following npm scripts are defined in `package.json`:

### Local Development Server
Start the development server with hot-module replacement (HMR):
```bash
npm run dev
```
By default, the application will be accessible at: **`http://localhost:5173`**

### Production Build
To compile the TypeScript project and build optimized static assets for production:
```bash
npm run build
```
This runs `tsc -b && vite build`. The output assets will be generated in the `/dist` folder.

### Local Preview
To serve and preview the compiled production build locally (useful for debugging bundle issues):
```bash
npm run preview
```

### Linter Check
To run the Oxlint code-quality checks across all source scripts:
```bash
npm run lint
```
Linter rules can be customized or checked in the `.oxlintrc.json` configuration file.

---

## 5. Editor Recommendations

To ensure formatting and convention alignment:

1. **Install Extensions**:
   * **Tailwind CSS IntelliSense** (for utility class autocomplete)
   * **TypeScript Language Features** (built-in/extension for syntax diagnostics)
   * **Prettier - Code Formatter** (for code styling consistency)
2. **Path Aliasing**:
   Use the `@/` prefix to reference the `src/` root directory (e.g. `import { Card } from '@/components/ui/Card'`). This prevents relative directory traversal errors (`../../../`).

---

## 6. Standards Compliance

* **Responsive Design**: Developers must adhere to the responsive-first layout principles outlined in `DoNotPush_InfoOnly/Global Development Requirement Re.txt`.
* **Coding Conventions**: Refer to `DEVELOPMENT_STANDARDS.md` for naming rules, imports ordering, state models, and design systems conventions.
