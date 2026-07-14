# Production Push Info

This document tracks all production commits and push logs for **ProjectSeaT**, recording the exact timestamps, affected modules, and code modifications.

---

## Git Push Log History

| Push Date | Push Time (seconds) | Commit Hash | What Was Updated | Things Pushed (Files Affected) | Changes Pushed (Technical Summary) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2026-07-01** | 00:01:41 | `157ab69` | Objectives Panel & Image Path References | `ObjectivePanel.tsx`<br>`SimulationLayout.tsx`<br>`SimulationPlay.tsx`<br>`For_Developers.md`<br>`architecture.md`<br>`src/Images/SeaT Captain/*` | Made the objectives sidebar panel retractable with a floating `Target` button, added header `X` collapse button, integrated ESC key keyboard listener to trigger retraction, and updated Captain welcome asset paths. |
| **2026-06-30** | 23:19:22 | `b12fe34` | Vercel SPA Routing Configuration | `vercel.json` | Added routing rules and redirects in `vercel.json` to map all sub-routes to `index.html`, resolving Vercel 404 page-refresh issues for client-side React Router. |
| **2026-06-30** | 23:15:15 | `d138172` | Build Engine Runtime Setup | `package.json` | Added Node.js engine compatibility checks (`>=20.0.0`) in `package.json` to enforce modern runtime compiling on Vercel. |
| **2026-06-30** | 23:08:09 | `f6e413f` | Repository Gitignore Rules & Project Manuals | `.gitignore`<br>`DoNotPush_InfoOnly/*` | Commented out the local reference bypass in `.gitignore` to track, commit, and push all project checklists, specs, and design resources to origin/main. |
| **2026-06-30** | 23:03:55 | `41959ee` | Simulator Frame Layout & Accessibility close hooks | `SimulationPlay.tsx`<br>`SimulationLayout.tsx`<br>`SceneContainer.tsx`<br>`MissionHeader.tsx`<br>`ObjectivePanel.tsx`<br>`MissionFooter.tsx`<br>`DialoguePanel.tsx`<br>`Feedback.tsx`<br>`Header.tsx`<br>`AppLayout.tsx`<br>`welcome.png` | Refactored active simulator route to render inside a viewport-containment 16:9 canvas card to prevent scrollbars, made all controls absolute overlays, and added Escape close handlers for pause, logbooks, and clipboards. |
| **2026-06-29** | 22:42:55 | `d409c87` | Authentication Flows & Briefing Setup | `AuthContext.tsx`<br>`SimulationPlay.tsx`<br>`InitializationScreen.tsx`<br>`LoginPage.tsx`<br>`OffboardingScreen.tsx` | Added Captain's welcoming briefing layout prior to simulator launch, integrated dynamic user profiles, added sign-out offboarding port-break animation route (runs 5-8 seconds), and redirect scripts. |
| **2026-07-01** | 00:24:40 | `{{COMMIT_HASH}}` | Documentation and Push Log | `README.md`<br>`DoNotPush_InfoOnly/Production Push Info.md`<br>`DoNotPush_InfoOnly/Production Push Info.csv` | Updated README with project theme, appended new push entry to markdown and CSV logs. |
