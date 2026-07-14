# PSC Simulator - Comprehensive Changelog

This document provides a complete summary of all codebase modifications, features, and scene integrations made to the Port State Control (PSC) Simulator project during the Module 1 - 5 revamp phases.

## 🧭 Flow & Sequence Restructuring
* **Strict Numerical Module Sequence (1-9)**: Fully restructured the simulation flow to rigorously match the 1 to 9 numerical module sequence.
  1. **Module 1**: Boarding Gangway (`m1_s1_boarding`)
  2. **Module 2**: Ship Office (`m1_s2_office`) & Bridge (`m1_s3_bridge`)
  3. **Module 3**: Emergency Generator Room (`m1_s8_detention`)
  4. **Module 4**: Meeting Room (`m1_s5_meeting_room`) & Bridge Escort (`m1_s6_cooperation`)
  5. **Module 5**: Crew Mess (`m1_s7_mess`)
  6. **Final Mission**: Engine Room (`m1_s4_engine`)
* **`sceneFlow.json` Mapping**: Updated all `targetSceneId` hotspots and transition arrays to correctly point to the next numerical module in the sequence. Removed all exit transitions from the Engine Room to mark it as the concluding scene.
* **Dialogue Context (`SimulationContext.tsx`)**: Re-routed `makeDialogueChoice` transition statements to correctly swap `nextSceneId` and load the respective `activeDialogueId` according to the sequence flow.
* **Shortened Dialogues (`missionTemplate.ts`)**: Entirely replaced `mockDialogues` with punchy, interactive-focused texts and updated the dialogue choices and keys to reflect the new sequence.

---

## 🏗️ New Scenes & Minigames Implemented

### 1. Boarding Gangway (Module 1)
* **Scene**: `m1_s1_boarding`
* **Features**: Added interactive safety gangway netting (`gangway_netting`). 
* **Changes**: Implemented gap closure mechanics, created realistic gangway background images, and integrated Cadet Kai onboarding dialogues.

### 2. Ship Office & Bridge (Module 2)
* **Scenes**: `m1_s2_office`, `m1_s3_bridge`
* **Features**: 
  * Swipe-to-approve/reject Ship Certificates audit component.
  * Drag-and-drop Watchkeeping Fatigue Timeline to resolve OOW MLC rest hour violations.
  * GMDSS DSC Radio loop test sequence on the Bridge console.
  * A-Class Fire Door automatic magnetic release verifications.

### 3. Emergency Generator Room (Module 3)
* **Scene**: `m1_s8_detention`
* **Features**: S.S. Zenith Case Study (`detention_sort`). 
* **Changes**: Created a Ghibli-realistic Emergency Generator Room background. Implemented an interactive point-and-click overlay to spot and sort safety hazards (quick-closing valves, battery terminals, pipe lagging, and fuel leaks).

### 4. Meeting Room & Bridge Escort (Module 4)
* **Scenes**: `m1_s5_meeting_room`, `m1_s6_cooperation`
* **Features**: 
  * Interactive PPE Safety Locker (`escort_gear`) allowing the player to equip mandatory helmet, boots, and gas monitors.
  * Escort Trust Gauge Challenge (`escort_trust`) simulating an inspector walkaround, where the player answers Kowalski's questions while maintaining a high trust index.

### 5. Crew Mess Case Studies (Module 5)
* **Scene**: `m1_s7_mess`
* **Features**: Paris MOU & USCG Detention Case Studies (`case_studies`).
* **Changes**: Added a Crew Mess background. Designed a Logbook Discrepancy Spotter where the player inspects and compares crew logs against Kowalski's findings to catch fatigue log forgeries and OWS magic pipe bypasses.

### 6. Engine Room (Final Mission)
* **Scene**: `m1_s4_engine`
* **Features**: OWS 15ppm Bilge Alarm test.
* **Changes**: Placed precisely at the end of the walkthrough sequence. Passing this minigame triggers the walkaround conclusion and loads the debrief scorecard.

---

## 🎨 Asset Generation & Aesthetics
* **Backgrounds**: Leveraged the `generate_image` tool to create and inject rich, high-quality, text-free scene backgrounds in a hyper-realistic, Ghibli-inspired art style:
  * `landing_page.png`
  * `login_page.png`
  * `crew_mess.png`
  * `emergency_gen.png`
  * `modern_bridge.png`
  * `meeting_room.png`
* **Integration**: Ensured all Minigames are rendered over their respective backgrounds using responsive styling and Tailwind-free vanilla CSS approaches to maintain a premium web application aesthetic.

---

## 💻 Engine & State Improvements
* **`SimulationContext.tsx`**: Overhauled state management to support tracking of completed minigames (`activeMinigame`), dynamic scorecard points accumulation (`trustScore`, `score`), and overlay feedback modules (`activeFeedback`).
* **Clean Typings (`types.ts`)**: Resolved interface discrepancies across scenes, guaranteeing `tsc --noEmit` compilations with 0 errors across the entire codebase.
