# ⚓ ProjectSeaT: Maritime Training Platform (Demo)

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-success?style=flat&logo=vercel&color=000000)](https://project-sea-t.vercel.app/)
[![React Version](https://img.shields.io/badge/React-19-blue?style=flat&logo=react&color=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind%20v4-blue?style=flat&logo=tailwindcss&color=38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](https://opensource.org/licenses/MIT)

ProjectSeaT is a gamified, interactive training platform designed for seafarers to simulate **Port State Control (PSC)** ship audits. It replaces passive slide-deck training courses with a fully playable, immersive 3D-illustrated simulation workspace.

---

## 🧭 1. Project Mission & Objectives
- **Interactive Audits**: Allow seafarers to walk through ship rooms (Ship Office, Navigation Bridge, Engine Room) to inspect logging logs, certification details, and safety items.
- **Cooperative Branching Dialogue**: Engage in conversation nodes with PSC Inspectors where decisions directly affect their cooperate trust level and overall compliance score.
- **Dynamic Checklists**: Track audit requirements on active sideboards, awarding points on success and applying penalty ratings on unmitigated defects.

---

## 🎨 2. Design System & Theme

ProjectSeaT features a custom-designed maritime design system inspired by naval operations and industrial port systems.

### 2.1 Color Palette
The interface leverages a clean, high-contrast dark mode palette using custom theme color variables:

| Color Badge | Color Name | Hex Code | Purpose & Application |
| :--- | :--- | :--- | :--- |
| ![#12355B](https://img.shields.io/badge/-%2312355B-12355B?style=flat-square) | **Harbor Navy** | `#12355B` | Primary branding color. Used for dashboard foundations, sidebars, headers, and major containers. |
| ![#2F6690](https://img.shields.io/badge/-%232F6690-2F6690?style=flat-square) | **Sea Blue** | `#2F6690` | Secondary branding accent. Used for interactive buttons, progress meters, and operational borders. |
| ![#F4A261](https://img.shields.io/badge/-%23F4A261-F4A261?style=flat-square) | **Harbor Gold** | `#F4A261` | Accent color. Used for highlighting objectives, points awarded, and successful checklist logs. |
| ![#E76F51](https://img.shields.io/badge/-%23E76F51-E76F51?style=flat-square) | **Sunset Coral** | `#E76F51` | Alert/warning highlight. Used for countdown timers, critical deficiencies, and negative inspector reviews. |
| ![#FAF7F2](https://img.shields.io/badge/-%23FAF7F2-FAF7F2?style=flat-square) | **Pearl** | `#FAF7F2` | Text and background offset color. Represents crisp white paperwork audits and active clipboard text. |

### 2.2 Typography & Sizing tokens
- **Typeface**: `Manrope` (modern, geometric sans-serif loaded from Google Fonts for ultimate readability in dashboard layouts).
- **Rounding Tokens**: Custom `border-radius` variables applied consistently:
  - Cards: `16px` (`rounded-2xl`)
  - Buttons & Input fields: `12px` (`rounded-xl`)
  - Overlay Dialogs: `20px` (`rounded-3xl`)

---

## 📐 3. Core Features & Architecture

### 3.1 Single-Frame Viewport Overlay Layout
- The active simulation route (`SimulationPlay`) is locked inside a responsive **16:9 aspect-ratio canvas card** (`SimulationLayout.tsx`). 
- This locks all controls (Mission Header HUD, Objective sidebar list, Description cards, and location-based hints) as absolute overlays directly on top of the viewport background, completely eliminating browser scrollbars and preventing page scrolling.

### 3.2 Interactive Audits
- **Document Desk Clipboard**: Audits certificates and safety logs (SOLAS, MARPOL, Crew lists) against deficiency codes (e.g. Code 30, Code 17) to flag compliance.
- **Rest Hours MLC logs**: Audits watchkeeper sheets against international MLC rest hours rules (e.g. 77-hour limits, rest periods).
- **Hotspot Inspect Layers**: Percentage-positioned coordinates trigger inspection feedback modals or dialogues.
- **Dialogue Trees**: Branching choice systems managing inspector cooperation ratings (0-100% trust meters).

### 3.3 Keyboard Accessibility
- Support for keyboard escape closures (`Escape` key triggers) on all overlays:
  - Pause Menu modal (`MissionOverlay.tsx`)
  - Document Audit Desk (`DocumentDesk.tsx`)
  - MLC Rest Hours log panel (`RestHourLog.tsx`)
  - Feedback modals (`FeedbackModal.tsx`)
  - Retractable Objectives Panel (`ObjectivePanel.tsx`)

### 3.4 Timed Onboarding/Offboarding Loops
- **Captain Briefing**: Renders the captain's welcome panel (`Captain_welcome.png` greeting scene) and onboarding information sheet prior to launching the simulation.
- **Port Break Offboarding**: Timed offboarding break animation running for 5-8 seconds on user logouts before routing back to the public landing page.

---

## 🛠️ 4. Development Stack
- **Framework**: React 19 + Vite 8
- **Language**: TypeScript 6 (strict checks enabled)
- **Styling**: Tailwind CSS v4 (native compiling using `@tailwindcss/vite` plugin)
- **Icons**: Lucide React
- **Routing**: React Router v7

---

## 🚀 5. Getting Started

### 5.1 Installation
```bash
npm install
```

### 5.2 Running Locally
```bash
npm run dev
```

### 5.3 Building & Compiling
```bash
npm run build
```

---

## 📖 6. Developer Handbooks & Specifications
Detailed architectural handbooks and conventions are maintained in the local workspace:
- **[DEVELOPMENT_STANDARDS.md](./DEVELOPMENT_STANDARDS.md)**: Coding conventions, React structure rules, path aliases (`@/`), and Tailwind theme guidelines.
- **[STRUCTURE.md](./STRUCTURE.md)**: File structure diagrams, design tokens, responsive drawer actions, and mock database schemes.
- **[For_Developers.md](./DoNotPush_InfoOnly/For_Developers.md)**: Technical developer handover guides covering Phase 1 through 3.2.
- **[architecture.md](./DoNotPush_InfoOnly/architecture.md)**: Detailed runtime architectural maps from bootstrapping to gameplay states.

---

## ☁️ 7. Production Deployments (Vercel)
This frontend repository is deployed live on Vercel. 

### 7.1 Vercel SPA Routing Configuration
To prevent Vercel from returning 404 pages when reloading nested paths (e.g., `/simulation/psc-01` or `/profile`), the project uses **[`vercel.json`](./vercel.json)** to redirect all client requests back to the entry `index.html`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 7.2 Cleaning Vercel Build Caches
If asset paths, Tailwind CSS styling tokens, or route components do not immediately show up on the live Vercel site:
1. Navigate to the **Vercel Dashboard** > **Deployments** tab.
2. Select your latest build.
3. Click the options icon (`...`) on the right side and click **Redeploy**.
4. Check **"Clean Build Cache"** and click **Redeploy** to force Vercel to rebuild the production bundle completely from scratch.

### 7.3 Push Registry Audit Sheets
All successful and failed pushes to GitHub are registered in the tracking logs:
- **[Production Push Info.md](./DoNotPush_InfoOnly/Production%20Push%20Info.md)**: Markdown history summary table.
- **[Production Push Info.csv](./DoNotPush_InfoOnly/Production%20Push%20Info.csv)**: CSV format sheet compatible with Microsoft Excel.
> [!IMPORTANT]
> Both push files **must** be updated immediately on every push attempt.
