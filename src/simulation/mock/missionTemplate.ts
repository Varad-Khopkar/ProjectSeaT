import type { Mission, Dialogue } from '../types'

export const pscMissionTemplate: Mission = {
  id: 'psc-mission-01',
  code: 'PSC-01',
  title: 'Port State Control (PSC) Audit',
  description: 'Conduct a simulated PSC boarding audit on the dry cargo ship M/V Sea Guardian. Review the bridge logbook, test radio alerts, and check the oily bilge valves.',
  settings: {
    timerLimitSeconds: 600, // 10 minutes
    passingScore: 80,
    allowRetries: true,
  },
  initialSceneId: 'ship_office',
  scenes: {
    ship_office: {
      id: 'ship_office',
      title: 'Ship Office',
      description: 'The administrative hub of the ship. The PSC Inspector is waiting at the desk to audit the logs.',
      imageUrl: '/assets/images/ship_office.png',
      hotspots: [
        {
          id: 'hs-inspector',
          x: 45,
          y: 35,
          width: 15,
          height: 30,
          label: 'Speak with PSC Inspector',
          type: 'dialogue',
          actionId: 'dlg-inspector-intro',
          explanationTitle: 'PSC Inspector Introduced',
          explanationText: 'You initiated a conversation with Inspector Kowalski. Mutual cooperation and clear documentation are key to a smooth Port State Control audit.',
          actionCode: 'Code 10'
        },
        {
          id: 'hs-desk-log',
          x: 20,
          y: 60,
          width: 12,
          height: 10,
          label: 'Audit Oil Record Book',
          type: 'inspect',
          actionId: 'evt-audit-orb',
          explanationTitle: 'Oil Record Book (Part I) Verified',
          explanationText: 'ORB entries match the machinery space sludge tank capacities and transfer logs. In compliance with MARPOL Annex I requirements.',
          actionCode: 'Code 30'
        },
        {
          id: 'hs-decoy-coffee',
          x: 35,
          y: 70,
          width: 8,
          height: 8,
          label: 'Coffee Mug on Logbooks',
          type: 'inspect',
          isDecoy: true,
          explanationTitle: 'Housekeeping Non-Conformity (-10 PTS)',
          explanationText: 'A wet coffee mug has been left directly on top of official record logs. Spillages violate documentation procedures and degrade records.',
          actionCode: 'Code 10'
        },
        {
          id: 'hs-document-desk',
          x: 10,
          y: 40,
          width: 10,
          height: 12,
          label: 'Verify Statutory Certificates',
          type: 'inspect',
          actionId: 'evt-audit-docs',
          explanationTitle: 'Ship Certificates Desk',
          explanationText: 'Review Safe Manning, MARPOL IOPP, and SOLAS Safety certificates on the desk to verify validity dates.',
          actionCode: 'Code 30'
        },
        {
          id: 'hs-rest-hours',
          x: 5,
          y: 60,
          width: 9,
          height: 12,
          label: 'Audit Watchkeeper Rest Hours',
          type: 'inspect',
          actionId: 'evt-audit-rest',
          explanationTitle: 'MLC Rest Hours Registry',
          explanationText: 'Check shift logs of the Chief Mate and Deck Cadet to verify compliance with MLC 2006 limits.',
          actionCode: 'Code 17'
        },
        {
          id: 'hs-door-to-bridge',
          x: 80,
          y: 20,
          width: 10,
          height: 50,
          label: 'Proceed to Navigation Bridge',
          type: 'transition',
          targetSceneId: 'bridge',
        },
      ],
      objectives: [
        {
          id: 'obj-inspect-orb',
          title: 'Audit Oil Record Book',
          description: 'Confirm ORB entries match machinery discharge valves and logs.',
          points: 20,
          status: 'pending',
        },
        {
          id: 'obj-audit-docs',
          title: 'Verify Ship Certificates',
          description: 'Ensure Safe Manning, MARPOL, and SOLAS safety certificates are current.',
          points: 20,
          status: 'pending',
        },
        {
          id: 'obj-audit-rest',
          title: 'Audit Watchkeeper Rest Hours',
          description: 'Verify OOW rest sheets comply with MLC 77-hour limits.',
          points: 20,
          status: 'pending',
        },
      ],
      transitions: [
        {
          id: 'tr-office-to-bridge',
          sourceSceneId: 'ship_office',
          targetSceneId: 'bridge',
        },
      ],
    },
    bridge: {
      id: 'bridge',
      title: 'Navigation Bridge',
      description: 'The commanding deck. Verify the navigation logs and DSC radio installations.',
      imageUrl: '/assets/images/bridge.png',
      hotspots: [
        {
          id: 'hs-logbook',
          x: 15,
          y: 50,
          width: 10,
          height: 8,
          label: 'Examine Bridge Logbook',
          type: 'inspect',
          actionId: 'evt-inspect-logbook',
          explanationTitle: 'Bridge Logbook Checked',
          explanationText: 'Reviewed recent watches. Entries are counter-signed by the Officer of the Watch (OOW) and master, in compliance with STCW Watchkeeping standards.',
          actionCode: 'Code 17'
        },
        {
          id: 'hs-gmdss-radio',
          x: 60,
          y: 40,
          width: 14,
          height: 12,
          label: 'Test GMDSS DSC Radio',
          type: 'inspect',
          actionId: 'evt-test-radio',
          explanationTitle: 'DSC Loop Test Passed',
          explanationText: 'VHF Digital Selective Calling (DSC) transceiver returns a successful self-test loop verification. Verifies compliance with SOLAS Chapter IV.',
          actionCode: 'Code 30'
        },
        {
          id: 'hs-decoy-gps',
          x: 30,
          y: 48,
          width: 7,
          height: 6,
          label: 'Inspect Custom GPS unit',
          type: 'inspect',
          isDecoy: true,
          explanationTitle: 'Unauthorized Modification (-10 PTS)',
          explanationText: 'An uncertified, domestic GPS receiver was spliced into the console dashboard. Spliced custom components bypass standard isolation fuses and violate type-approval standards.',
          actionCode: 'Code 15'
        },
        {
          id: 'hs-fire-door',
          x: 48,
          y: 35,
          width: 8,
          height: 18,
          label: 'Inspect Fire Safety Door',
          type: 'inspect',
          actionId: 'evt-fire-door',
          explanationTitle: 'Fire Door Restored',
          explanationText: 'The self-closing fire door was tied open with a rope. Removing the obstruction allows the door to seal automatically, maintaining structural fire protection under SOLAS Chapter II-2.',
          actionCode: 'Code 17'
        },
        {
          id: 'hs-door-to-office',
          x: 5,
          y: 30,
          width: 8,
          height: 45,
          label: 'Return to Ship Office',
          type: 'transition',
          targetSceneId: 'ship_office',
        },
        {
          id: 'hs-stairs-to-engine',
          x: 85,
          y: 45,
          width: 12,
          height: 40,
          label: 'Descend to Engine Room',
          type: 'transition',
          targetSceneId: 'engine_room',
        },
      ],
      objectives: [
        {
          id: 'obj-verify-bridge-log',
          title: 'Examine Bridge Logbook',
          description: 'Verify entries are signed by the Master Mariner and correct coordinates mapped.',
          points: 15,
          status: 'pending',
        },
        {
          id: 'obj-test-dsc-radio',
          title: 'Test GMDSS Radio apparatus',
          description: 'Establish a successful loop test on the VHF DSC transceiver unit.',
          points: 15,
          status: 'pending',
        },
        {
          id: 'obj-fix-fire-door',
          title: 'Audit Bridge Fire Door Boundaries',
          description: 'Ensure self-closing fire isolation doors are unobstructed and operational.',
          points: 10,
          status: 'pending',
        },
      ],
      transitions: [
        {
          id: 'tr-bridge-to-office',
          sourceSceneId: 'bridge',
          targetSceneId: 'ship_office',
        },
        {
          id: 'tr-bridge-to-engine',
          sourceSceneId: 'bridge',
          targetSceneId: 'engine_room',
        },
      ],
    },
    engine_room: {
      id: 'engine_room',
      title: 'Engine Room',
      description: 'Machinery room containing the propulsion engine and bilge treatment separators.',
      imageUrl: '/assets/images/engine_room.png',
      hotspots: [
        {
          id: 'hs-bilge-separator',
          x: 35,
          y: 40,
          width: 18,
          height: 35,
          label: 'Inspect Oily Bilge Separator',
          type: 'inspect',
          actionId: 'evt-check-separator',
          explanationTitle: '15ppm Bilge Alarm Verified',
          explanationText: 'Verified the 3-way divert valves are locked. Recirculation loop successfully blocks sea discharge when oily residues exceed 15ppm, conforming with MARPOL Annex I.',
          actionCode: 'Code 30'
        },
        {
          id: 'hs-decoy-rag',
          x: 60,
          y: 35,
          width: 9,
          height: 8,
          label: 'Oily Rag on Manifold',
          type: 'inspect',
          isDecoy: true,
          explanationTitle: 'Critical Fire Hazard (-10 PTS)',
          explanationText: 'An oil-saturated rag was left sitting directly on the engine exhaust manifold cover. High surface temperatures can trigger flash-point ignition, violating SOLAS fire prevention requirements.',
          actionCode: 'Code 30'
        },
        {
          id: 'hs-sewage-bypass',
          x: 80,
          y: 55,
          width: 10,
          height: 15,
          label: 'Inspect Overboard Piping',
          type: 'inspect',
          isDecoy: true,
          explanationTitle: 'Illegal Bypass Piping (-10 PTS)',
          explanationText: 'A flexible hose bypass bypasses the sewage holding tank directly into the overboard discharge valve. Illegal sewage routing violates MARPOL Annex IV regulations (detainable deficiency).',
          actionCode: 'Code 30'
        },
        {
          id: 'hs-ladders-to-bridge',
          x: 10,
          y: 15,
          width: 12,
          height: 60,
          label: 'Climb Stairs to Bridge',
          type: 'transition',
          targetSceneId: 'bridge',
        },
      ],
      objectives: [
        {
          id: 'obj-check-separator',
          title: 'Inspect Bilge Separator Valves',
          description: 'Verify 3-way discharge valves are locked in the recirculation loop.',
          points: 20,
          status: 'pending',
        },
      ],
      transitions: [
        {
          id: 'tr-engine-to-bridge',
          sourceSceneId: 'engine_room',
          targetSceneId: 'bridge',
        },
      ],
    },
  },
  rewards: {
    xp: 500,
    badges: ['bdg-4'], // Unlocks PSC Survivor badge
  },
}

// Dialog trees definitions for the inspector dialogue
export const mockDialogues: Record<string, Dialogue> = {
  'dlg-inspector-intro': {
    id: 'dlg-inspector-intro',
    speaker: 'Inspector Kowalski',
    message: 'Welcome, Captain. I am conducting the quarterly Port State Control audit. Are your logbooks and separator systems ready?',
    choices: [
      {
        id: 'ch-intro-yes',
        text: 'Yes, Inspector. We welcome the audit. You can review our logs here in the ship office.',
        targetDialogueId: 'dlg-inspector-logs',
        triggerEventId: 'evt-trust-increase',
      },
      {
        id: 'ch-intro-no',
        text: 'One moment, Inspector. We are currently busy with a watch handover.',
        targetDialogueId: 'dlg-inspector-wait',
        triggerEventId: 'evt-trust-decrease-minor',
      },
      {
        id: 'ch-intro-argue',
        text: 'Why are you auditing us now? We have a tight cargo window, this is disruptive.',
        targetDialogueId: 'dlg-inspector-wait',
        triggerEventId: 'evt-trust-decrease-major',
      },
    ],
  },
  'dlg-inspector-logs': {
    id: 'dlg-inspector-logs',
    speaker: 'Inspector Kowalski',
    message: 'Good. Please present the Oil Record Book for audit, and have your deck officer test GMDSS alarms on the bridge. I will inspect the engine bilge valve setups later.',
    choices: [
      {
        id: 'ch-logs-ok',
        text: 'Proceeding with the check immediately.',
      },
    ],
  },
  'dlg-inspector-wait': {
    id: 'dlg-inspector-wait',
    speaker: 'Inspector Kowalski',
    message: 'Delays and defensive behavior are noted in my report. Let me know when you are ready.',
    choices: [
      {
        id: 'ch-wait-ok',
        text: 'Understood, Inspector.',
      },
    ],
  },
  'dlg-m1-kai-intro': {
    id: 'dlg-m1-kai-intro',
    speaker: 'Cadet Kai',
    message: 'Welcome aboard the M/V Sea Guardian, Officer! Today is a critical Port State Control (PSC) audit. Do you know what PSC is?',
    choices: [
      {
        id: 'ch-m1-intro-correct',
        text: 'An inspection system where foreign ships undergo checks to verify compliance with international safety standards.',
        targetDialogueId: 'dlg-m1-kai-intro-success',
        triggerEventId: 'evt-trust-increase',
      },
      {
        id: 'ch-m1-intro-wrong-1',
        text: 'A cargo custom checkpoint managed by port gates.',
        targetDialogueId: 'dlg-m1-kai-intro-fail',
        triggerEventId: 'evt-trust-decrease-minor',
      },
      {
        id: 'ch-m1-intro-wrong-2',
        text: 'A flag registry management protocol for domestic trading.',
        targetDialogueId: 'dlg-m1-kai-intro-fail',
        triggerEventId: 'evt-trust-decrease-minor',
      },
    ],
  },
  'dlg-m1-kai-intro-success': {
    id: 'dlg-m1-kai-intro-success',
    speaker: 'Cadet Kai',
    message: 'Exactly! PSC checks foreign vessels to verify they satisfy safety, security, and environmental codes. Let\'s check the Gangway Netting safety first!',
    choices: [
      {
        id: 'ch-m1-intro-success-ok',
        text: 'Rig the safety netting',
      },
    ],
  },
  'dlg-m1-kai-intro-fail': {
    id: 'dlg-m1-kai-intro-fail',
    speaker: 'Cadet Kai',
    message: 'Not quite. Remember, PSC focuses on international compliance of foreign vessels visiting national ports. Try again!',
    choices: [
      {
        id: 'ch-m1-intro-fail-retry',
        text: 'Let me reconsider.',
        targetDialogueId: 'dlg-m1-kai-intro',
      },
    ],
  },
  'dlg-m1-kai-office': {
    id: 'dlg-m1-kai-office',
    speaker: 'Cadet Kai',
    message: 'This is the Ship Office. Audit our certificates binder and crew rest logs at the desks.',
    choices: [
      {
        id: 'ch-m1-office-ok',
        text: 'I will start the audits.',
      },
    ],
  },
  'dlg-m1-inspector-intro': {
    id: 'dlg-m1-inspector-intro',
    speaker: 'Inspector Kowalski',
    message: 'Good morning. I am boarding your vessel for audit. Can you state the three main regulatory pillars of Port State Control?',
    choices: [
      {
        id: 'ch-m1-pillars-correct',
        text: 'Safety (SOLAS), Security (ISPS), and Environment (MARPOL).',
        targetDialogueId: 'dlg-m1-pillars-success',
        triggerEventId: 'evt-trust-increase',
      },
      {
        id: 'ch-m1-pillars-wrong',
        text: 'Cargo manifests, crew wages, and flag taxes.',
        targetDialogueId: 'dlg-m1-pillars-fail',
        triggerEventId: 'evt-trust-decrease-minor',
      },
    ],
  },
  'dlg-m1-pillars-success': {
    id: 'dlg-m1-pillars-success',
    speaker: 'Inspector Kowalski',
    message: 'Excellent. Audit our certificates and watch rest hours now.',
    choices: [
      {
        id: 'ch-m1-pillars-success-ok',
        text: 'Understood, Inspector.',
      },
    ],
  },
  'dlg-m1-pillars-fail': {
    id: 'dlg-m1-pillars-fail',
    speaker: 'Inspector Kowalski',
    message: 'No! The three pillars are SOLAS, ISPS, and MARPOL. Please review the ship certificates folder on the desk immediately!',
    choices: [
      {
        id: 'ch-m1-pillars-fail-ok',
        text: 'Opening certificates...',
      },
    ],
  },
  'dlg-m1-kai-bridge': {
    id: 'dlg-m1-kai-bridge',
    speaker: 'Cadet Kai',
    message: 'Bridge safety checks. Execute GMDSS DSC Radio loop tests and check fire doors.',
    choices: [
      {
        id: 'ch-m1-bridge-ok',
        text: 'Got it. I will test them.',
      },
    ],
  },
  'dlg-m1-kai-engine': {
    id: 'dlg-m1-kai-engine',
    speaker: 'Cadet Kai',
    message: 'Great job! You\'ve completed the final OWS audit mission. All walkthrough modules are fully complete!',
    choices: [
      {
        id: 'ch-m1-engine-ok',
        text: 'Submit Walkthrough & Debrief',
      },
    ],
  },
  'dlg-m1-netting-success': {
    id: 'dlg-m1-netting-success',
    speaker: 'Cadet Kai',
    message: 'Excellent netting setup! Gaps are secure. Let\'s head into the Ship Office now.',
    choices: [
      {
        id: 'ch-m1-netting-success-ok',
        text: 'Proceed into Ship Office',
      },
    ],
  },
  'dlg-m1-certs-success': {
    id: 'dlg-m1-certs-success',
    speaker: 'Cadet Kai',
    message: 'Certificates verify OK! Now audit the crew rest hours timeline on the clipboard.',
    choices: [
      {
        id: 'ch-m1-certs-success-ok',
        text: 'Audit Rest Hours',
      },
    ],
  },
  'dlg-m1-rest-success': {
    id: 'dlg-m1-rest-success',
    speaker: 'Cadet Kai',
    message: 'MLC rest hour compliance cleared! Let\'s proceed to the Bridge.',
    choices: [
      {
        id: 'ch-m1-rest-success-ok',
        text: 'Proceed to Bridge',
      },
    ],
  },
  'dlg-m1-gmdss-success': {
    id: 'dlg-m1-gmdss-success',
    speaker: 'Cadet Kai',
    message: 'VHF DSC check returns 100%! Now verify the automatic closing of fire containment doors.',
    choices: [
      {
        id: 'ch-m1-gmdss-success-ok',
        text: 'Inspect Fire Door',
      },
    ],
  },
  'dlg-m1-firedoor-success': {
    id: 'dlg-m1-firedoor-success',
    speaker: 'Cadet Kai',
    message: 'SOLAS fire door test passed! Let\'s descend to the Emergency Generator Room.',
    choices: [
      {
        id: 'ch-m1-firedoor-success-ok',
        text: 'Descend to Emergency Gen',
      },
    ],
  },
  'dlg-m1-ows-intro': {
    id: 'dlg-m1-ows-intro',
    speaker: 'Cadet Kai',
    message: 'Engine Room! Under MARPOL, we must verify the OWS alarm. Click the OWS control panel to run the 15ppm compliance test.',
    choices: [
      {
        id: 'ch-m1-ows-intro-ok',
        text: 'Audit OWS bilges',
      },
    ],
  },
  'dlg-m1-ows-success': {
    id: 'dlg-m1-ows-success',
    speaker: 'Cadet Kai',
    message: 'Bilge alarm triggered correctly and redirected water. Overboard discharge safe!',
    choices: [
      {
        id: 'ch-m1-ows-success-ok',
        text: 'Conclude OWS Check',
      },
    ],
  },
  'dlg-m1-detention-intro': {
    id: 'dlg-m1-detention-intro',
    speaker: 'Inspector Kowalski',
    message: 'To avoid detentions, a crew must prioritize shipboard issues correctly. Let\'s evaluate 6 deficiencies now.',
    choices: [
      {
        id: 'ch-m1-detention-start',
        text: 'Start Detention Assessment',
      },
    ],
  },
  'dlg-m1-detention-success': {
    id: 'dlg-m1-detention-success',
    speaker: 'Inspector Kowalski',
    message: 'Remarkable sorting! All risks prioritized. Let\'s head to the Meeting Room.',
    choices: [
      {
        id: 'ch-m1-detention-success-ok',
        text: 'Go to Meeting Room',
      },
    ],
  },
  'dlg-m4-kai-welcome': {
    id: 'dlg-m4-kai-welcome',
    speaker: 'Cadet Kai',
    message: 'Let\'s grab our safety gear from the locker (Helmet, Boots, Gas Detector, Flashlight) before Kowalski joins.',
    choices: [
      {
        id: 'ch-m4-kai-welcome-ok',
        text: 'Inspect Safety Locker',
      },
    ],
  },
  'dlg-m4-escort-intro': {
    id: 'dlg-m4-escort-intro',
    speaker: 'Inspector Kowalski',
    message: 'Let\'s check bridge logs and the EPIRB beacon. Remember, no lies or bribes.',
    choices: [
      {
        id: 'ch-m4-escort-start',
        text: 'Begin Escort Challenge',
      },
    ],
  },
  'dlg-m4-cooperate-success': {
    id: 'dlg-m4-cooperate-success',
    speaker: 'Inspector Kowalski',
    message: 'Excellent cooperation index! Now, let\'s head to the Crew Mess hall to study real-world Paris MOU / USCG detention case studies.',
    choices: [
      {
        id: 'ch-m4-cooperate-success-ok',
        text: 'Proceed to Crew Mess Hall',
      },
    ],
  },
  'dlg-m5-kai-welcome': {
    id: 'dlg-m5-kai-welcome',
    speaker: 'Cadet Kai',
    message: 'Welcome to the Crew Mess. Let\'s inspect the study table archives and spot the crew\'s forged log book entries!',
    choices: [
      {
        id: 'ch-m5-case-study-start',
        text: 'Inspect Case Study Logs',
      },
    ],
  },
  'dlg-m5-conclude': {
    id: 'dlg-m5-conclude',
    speaker: 'Cadet Kai',
    message: 'Fantastic logs audit! You spotted the rest hour lies and expired EPIRB batteries. Let\'s head to the Engine Room for our final OWS mission!',
    choices: [
      {
        id: 'ch-m5-conclude-ok',
        text: 'Proceed to Engine Room',
      },
    ],
  },
}

