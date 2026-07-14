import type { MissionBriefingConfig } from '../types'

export const briefingConfigs: Record<string, MissionBriefingConfig> = {
  'psc-mission-01': {
    schemaVersion: '1.0.0',
    version: '1.0.0',
    missionId: 'psc-mission-01',
    missionCode: 'PSC-01',
    metadata: {
      title: 'PSC Audit Preparedness Briefing',
      description: 'Review statutory ship certificates, MLC watchkeeper rest hour limits, and MARPOL engine room bilge discharge protocols before boarding inspections.',
      difficulty: 'Intermediate',
      category: 'Compliance',
      tags: ['MARPOL', 'SOLAS', 'STCW', 'MLC', 'Auditing'],
      estimatedDuration: '10 mins',
    },
    unlockRules: {
      prerequisites: [],
      requiresBriefing: true,
      requiredScorePercent: 100, // Requires 100% score (3/3 correct) to unlock
    },
    sections: [
      {
        id: 'sec-cert-docs',
        title: 'Certificates & Logbooks',
        description: 'Vessel administrative audit preparations and record verification.',
        blocks: [
          {
            id: 'b-intro',
            type: 'introduction',
            title: 'Rotterdam Port State Boarding',
            content: 'A Port State Control (PSC) inspector is boarding the M/V Sea Guardian at Rotterdam Anchorage. Administrative checks are the first step. Ensuring that vessel certificates and deck logs are correct is essential to prevent vessel detention.',
          },
          {
            id: 'b-objectives',
            type: 'learning_objectives',
            title: 'Pre-Audit Audit Objectives',
            objectives: [
              'Verify validation stamps on statutory certificates (Safe Manning, IOPP, SOLAS).',
              'Review bridge logbook watch signatures and positional records.',
              'Check GMDSS DSC transceiver diagnostic logs and digital alerts.',
              'Inspect machinery space valve settings for bilge separation recirculating loops.',
            ],
          },
          {
            id: 'b-certificates',
            type: 'info_card',
            title: 'Statutory Vessel Certificates',
            content: 'Vessel trading certificates are subject to absolute compliance. The Safe Manning Certificate defines the minimum crew size and rank requirements. The International Oil Pollution Prevention (IOPP) document certifies that bilge filtering systems conform to conventions. Expired or uncertified items are direct triggers for a Code 30 detention.',
          },
        ],
      },
      {
        id: 'sec-reg-standards',
        title: 'Environmental & Safety Standards',
        description: 'Deep dive into MARPOL bilge operations, MLC shifts, and SOLAS boundary safety.',
        blocks: [
          {
            id: 'b-marpol',
            type: 'image_text',
            title: 'MARPOL 15ppm Discharge Controls',
            content: 'MARPOL Annex I restricts engine room oily water discharges overboard. The discharge must go through a calibrated Oily Water Separator (OWS) and must contain less than 15 parts per million (ppm) of oil. An automatic 3-way divert valve is installed on the output. If the monitor detects oil above 15ppm, the valve must automatically route the flow back to the bilge holding tank.',
            assets: [
              {
                type: 'image',
                url: '/assets/images/bilge_diagram.png',
                caption: 'Standard OWS setup with automatic recirculation loop and 15ppm discharge alarm.',
              },
            ],
          },
          {
            id: 'b-solas',
            type: 'note_callout',
            title: 'Critical Safety Deficiency: Fire Barriers',
            content: 'SOLAS Chapter II-2 regulates fire boundaries. Self-closing fire isolation doors prevent toxic smoke and flashover from breaching stairwells. Securing self-closing doors in an open position using ropes, wedges, or blocks is a severe safety breach and is a detainable deficiency. All fire doors must remain unobstructed.',
            metadata: {
              calloutType: 'danger',
            },
          },
          {
            id: 'b-mlc',
            type: 'image_text',
            title: 'MLC 2006 Crew Rest Requirements',
            content: 'The Maritime Labour Convention (MLC 2006) mandates strict fatigue management safeguards. Watchkeepers and deck officers must receive at least 10 hours of rest in any 24-hour period (which can be split into maximum two periods, one of which must be at least 6 hours). They must also receive at least 77 hours of rest in any 7-day period. Accurate records must be signed and matched against logbooks.',
            assets: [
              {
                type: 'image',
                url: '/assets/images/rest_hours.png',
                caption: 'Watchkeeper rest registry cards preventing crew exhaustion and navigational error.',
              },
            ],
          },
        ],
      },
    ],
    assessment: {
      id: 'psc-assessment-01',
      title: 'PSC Audit Readiness Assessment',
      passingScore: 100, // 100% correct answers required to pass
      questions: [
        {
          id: 'q-ows-limit',
          question: 'What is the maximum allowed oil content for discharges overboard from the engine room bilge according to MARPOL Annex I?',
          options: ['5 ppm', '15 ppm', '30 ppm', '100 ppm'],
          correctIndex: 1,
          explanation: 'MARPOL Annex I strictly limits overboard machinery bilge discharges to 15 ppm. Anything higher triggers the automatic divert valve to recirculate liquid back into bilge holding tanks.',
        },
        {
          id: 'q-mlc-rest',
          question: 'Under MLC 2006, what is the minimum required rest hours for any watchkeeper in a 7-day period?',
          options: ['48 hours', '70 hours', '77 hours', '84 hours'],
          correctIndex: 2,
          explanation: 'MLC 2006 mandates that watchkeepers receive a minimum of 77 rest hours in any 7-day period to prevent exhaustion and protect vessel operations.',
        },
        {
          id: 'q-code-30',
          question: 'What does a Port State Control "Code 30" action indicate?',
          options: [
            'A minor warning with 30 days to resolve',
            'Detention of the vessel at port',
            'Standard crew training recommendation',
            'Immediate safe manning clearance',
          ],
          correctIndex: 1,
          explanation: 'A Code 30 action is a formal detention notice issued by a Port State inspector, banning the ship from leaving port until the deficiency is resolved.',
        },
      ],
    },
  },
}
