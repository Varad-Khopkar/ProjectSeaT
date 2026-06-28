export interface UserProfile {
  id: string
  name: string
  rank: string
  avatar: string
  email: string
  completedMissions: number
  totalScore: number
  rankTitle: string
}

export interface TrainingModule {
  id: string
  title: string
  code: string
  description: string
  duration: string
  category: 'Safety' | 'Operations' | 'Technical' | 'Compliance'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  status: 'locked' | 'available' | 'in_progress' | 'completed'
  progress: number // percentage 0-100
  itemsCount: number
  completedItemsCount: number
}

export interface LeaderboardEntry {
  rank: number
  name: string
  rankTitle: string
  score: number
  badgeCount: number
  avatar: string
}

export interface Badge {
  id: string
  title: string
  description: string
  iconName: string
  unlockedAt: string | null
  category: 'PSC' | 'Milestone' | 'Skill'
}

export const mockUser: UserProfile = {
  id: 'usr-1',
  name: 'Capt. Henderson',
  rank: 'Master Mariner',
  avatar: 'CH',
  email: 'henderson.c@sea-voyager.com',
  completedMissions: 4,
  totalScore: 4250,
  rankTitle: 'Captain of the Fleet',
}

export const mockModules: TrainingModule[] = [
  {
    id: 'mod-1',
    title: 'Port State Control (PSC) Inspection',
    code: 'PSC-01',
    description: 'Learn to prepare and conduct Port State Control checks on dry cargo vessels, addressing bridge logs and engine bilge setups.',
    duration: '45 mins',
    category: 'Compliance',
    difficulty: 'Intermediate',
    status: 'in_progress',
    progress: 35,
    itemsCount: 12,
    completedItemsCount: 4,
  },
  {
    id: 'mod-2',
    title: 'Emergency Lifeboat Drills',
    code: 'LFB-02',
    description: 'Safety protocols for launching lifeboats, operating limit switches, and crew embarkation procedures under pressure.',
    duration: '30 mins',
    category: 'Safety',
    difficulty: 'Beginner',
    status: 'available',
    progress: 0,
    itemsCount: 8,
    completedItemsCount: 0,
  },
  {
    id: 'mod-3',
    title: 'Engine Room Bilge Cleanliness',
    code: 'ENG-03',
    description: 'Mastering the standards for oily water separator discharge and prevention of oil pollution in coastal waters.',
    duration: '40 mins',
    category: 'Technical',
    difficulty: 'Advanced',
    status: 'available',
    progress: 0,
    itemsCount: 10,
    completedItemsCount: 0,
  },
  {
    id: 'mod-4',
    title: 'SOLAS Radio Equipment Setup',
    code: 'SLS-04',
    description: 'Testing and configuring VHF/DSC radio apparatus and EPIRB beacons according to GMDSS regulations.',
    duration: '25 mins',
    category: 'Operations',
    difficulty: 'Intermediate',
    status: 'completed',
    progress: 100,
    itemsCount: 6,
    completedItemsCount: 6,
  },
  {
    id: 'mod-5',
    title: 'Cargo Stowage & Securing',
    code: 'CRG-05',
    description: 'Advanced concepts in container securement and weight calculations to avoid ship list during transit.',
    duration: '50 mins',
    category: 'Operations',
    difficulty: 'Advanced',
    status: 'locked',
    progress: 0,
    itemsCount: 15,
    completedItemsCount: 0,
  },
]

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Chief Eng. Kowalski',
    rankTitle: 'Chief Engineer',
    score: 4850,
    badgeCount: 8,
    avatar: 'KK',
  },
  {
    rank: 2,
    name: 'Capt. Henderson',
    rankTitle: 'Master Mariner',
    score: 4250,
    badgeCount: 6,
    avatar: 'CH',
  },
  {
    rank: 3,
    name: 'Second Officer Zhao',
    rankTitle: 'Navigator',
    score: 3950,
    badgeCount: 5,
    avatar: 'JZ',
  },
  {
    rank: 4,
    name: 'Third Officer Smith',
    rankTitle: 'Deck Officer',
    score: 3100,
    badgeCount: 4,
    avatar: 'TS',
  },
  {
    rank: 5,
    name: 'Cadet Rodriguez',
    rankTitle: 'Apprentice Officer',
    score: 1800,
    badgeCount: 2,
    avatar: 'MR',
  },
]

export const mockBadges: Badge[] = [
  {
    id: 'bdg-1',
    title: 'Solas Master',
    description: 'Completed SOLAS GMDSS compliance setup with zero infractions.',
    iconName: 'ShieldAlert',
    unlockedAt: '2026-06-25T14:30:00Z',
    category: 'PSC',
  },
  {
    id: 'bdg-2',
    title: 'Perfect Logbook',
    description: 'Maintained consecutive bridge log audits without any notes.',
    iconName: 'BookOpen',
    unlockedAt: '2026-06-26T11:00:00Z',
    category: 'Milestone',
  },
  {
    id: 'bdg-3',
    title: 'Bilge Guard',
    description: 'Checked and cleared engine bilge separation checklists.',
    iconName: 'Droplet',
    unlockedAt: null,
    category: 'Skill',
  },
  {
    id: 'bdg-4',
    title: 'PSC Survivor',
    description: 'Passed a simulated Port State Control deck audit.',
    iconName: 'Anchor',
    unlockedAt: null,
    category: 'PSC',
  },
]
