# Port State Control (PSC) Training Simulation - Agent Guidelines

This file documents the structure, storyline flow, and module architecture of the PSC Training Simulator to ensure consistency in future development and AI generation tasks. 

## 🏗️ Core Design Philosophy
1. **Interactive Over Reading**: Minimize static text. Replace long reading sections with graphical minigames, visual discrepancy spotters, and point-and-click interactions.
2. **Integrated Storyline**: Do not build disconnected mini-games. All modules must flow seamlessly into one another via interconnected scenes (`sceneFlow.json`) and dialogue-driven transitions (`SimulationContext.tsx`).
3. **Animated Aesthetics**: Backgrounds should blend realistic elements with Ghibli-inspired artistry (without unauthorized text/characters). Interactions must feel dynamic and engaging.

---

## 🗺️ Walkthrough Sequence & Module Mapping

The simulation adheres to a strict numerical flow sequence. Any new modules or features must respect this sequence mapping.

### 1. Module 1: Welcome & What is PSC?
* **Scene**: Boarding Gangway (`m1_s1_boarding`)
* **Activity**: Rigging the safety gangway netting to prevent falls.
* **Transition**: Cadet Kai leads the player into the Ship Office.

### 2. Module 2: What PSC Inspects
* **Scenes**: Ship Office (`m1_s2_office`), Navigation Bridge (`m1_s3_bridge`)
* **Activities**: 
  * Swipe-to-approve document certificates audit.
  * Adjusting MLC rest hour shift timelines on a clipboard.
  * Testing GMDSS DSC Radio loops.
  * Inspecting A-Class Fire Door automatic magnetic releases.
* **Transition**: Proceeds down to the Emergency Generator Room.

### 3. Module 3: Avoiding Detentions
* **Scene**: Emergency Generator Room (`m1_s8_detention`)
* **Activity**: S.S. Zenith Case Study - A point-and-click hazards game to resolve quick-closing valves, battery terminals, pipe lagging, and fuel leaks.
* **Transition**: Moves to the Ship Meeting Room.

### 4. Module 4: Cooperating with PSC Inspector
* **Scenes**: Ship Meeting Room (`m1_s5_meeting_room`), Navigation Bridge (`m1_s6_cooperation`)
* **Activities**: 
  * Equipping mandatory PPE (helmet, boots, gas monitor) from the safety locker.
  * Escort Trust Challenge: Navigating Inspector Kowalski's questions while maintaining the trust index gauge and avoiding bribe codes.
* **Transition**: Concludes and moves to the Crew Mess hall.

### 5. Module 5: Real Case Studies
* **Scene**: Ship Crew Mess (`m1_s7_mess`)
* **Activity**: Inspecting study table archives. A Logbook Discrepancy Spotter comparing crew logs against Kowalski’s findings to identify fatigue forgery and sludge bypass violations (e.g., Paris MOU / USCG case studies).
* **Transition**: Moves to the final mission in the Engine Room.

### 6. Final Mission & Assessment (Module 9)
* **Scene**: Engine Room (`m1_s4_engine`)
* **Activity**: OWS Separator 15ppm bilge alarm sensor verification and failsafe bypass check.
* **Transition**: Ends the walkthrough and loads the Debrief Scorecard.

---

## 🛠️ Code Architecture Rules

* **Scene Configuration (`src/simulation/mock/sceneFlow.json`)**:
  * Every scene must contain clear objectives, descriptive hotspots, and defined target transitions.
* **Dialogue and Routing (`src/simulation/mock/missionTemplate.ts`)**:
  * Dialogues (`mockDialogues`) must be punchy, short, and contain precise `targetDialogueId` branching or transition choices.
* **State Management (`src/simulation/state/SimulationContext.tsx`)**:
  * The `makeDialogueChoice` method handles transitioning the `nextSceneId` and loading the corresponding minigames (`activeMinigame`) or dialogue IDs (`activeDialogueId`).
  * Always verify that choice identifiers precisely match between `missionTemplate.ts` and `SimulationContext.tsx`.
