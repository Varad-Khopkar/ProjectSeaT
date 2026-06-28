import { 
  BookOpen, 
  FileText, 
  ShieldAlert, 
  User, 
  CheckSquare, 
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Compass,
  Settings
} from 'lucide-react'

export interface SearchItem {
  id: string
  title: string
  category: 'Modules' | 'Regulations' | 'Certificates' | 'Missions' | 'Vessel Documents' | 'Crew' | 'Checklists' | 'PSC Deficiencies'
  description: string
  path: string
}

export interface HeaderNotification {
  id: string
  title: string
  description: string
  time: string
  category: 'Mission Updates' | 'PSC Alerts' | 'Certificate Warnings' | 'Messages' | 'System Notifications'
  type: 'info' | 'warning' | 'error' | 'success' | 'message'
  read: boolean
}

export const searchDatabase: SearchItem[] = [
  // Training Modules
  {
    id: 's-mod-1',
    title: 'Port State Control Preparation',
    category: 'Modules',
    description: 'Learn how to inspect documentation, safety equipment, and watchkeeper logs before port entry.',
    path: '/modules'
  },
  {
    id: 's-mod-2',
    title: 'MARPOL Compliance & Oil Discharge',
    category: 'Modules',
    description: 'Review Annex I requirements, 15ppm limitations, and Oily Water Separator operation.',
    path: '/modules'
  },
  {
    id: 's-mod-3',
    title: 'Crew Fatigue & MLC Rest Hours',
    category: 'Modules',
    description: 'Guidelines on managing watchkeeper shift schedules to prevent critical exhaustion.',
    path: '/modules'
  },

  // Regulations
  {
    id: 's-reg-1',
    title: 'SOLAS Chapter II-2 (Fire Doors)',
    category: 'Regulations',
    description: 'Mandatory standard requiring self-closing fire boundaries to remain unobstructed.',
    path: '/help'
  },
  {
    id: 's-reg-2',
    title: 'MLC 2006 Rule 2.3 (Hours of Rest)',
    category: 'Regulations',
    description: 'Regulates minimum 10 hours rest in 24h and max 2 rest intervals.',
    path: '/help'
  },
  {
    id: 's-reg-3',
    title: 'MARPOL Annex I Reg 15',
    category: 'Regulations',
    description: 'Prohibits any bilge water discharge exceeding 15 parts per million of oil.',
    path: '/help'
  },

  // Certificates
  {
    id: 's-cert-1',
    title: 'Minimum Safe Manning Certificate',
    category: 'Certificates',
    description: 'Flag State certificate listing necessary crew roles and crew sizes.',
    path: '/simulation/results'
  },
  {
    id: 's-cert-2',
    title: 'International Oil Pollution Prevention (IOPP)',
    category: 'Certificates',
    description: 'Statutory certificate validating oil filtering equipment and survey dates.',
    path: '/simulation/results'
  },
  {
    id: 's-cert-3',
    title: 'Cargo Ship Safety Construction Certificate',
    category: 'Certificates',
    description: 'Certifies hull structure and annual hull inspections.',
    path: '/simulation/results'
  },

  // Missions
  {
    id: 's-miss-1',
    title: 'Port State Control (PSC) Audit',
    category: 'Missions',
    description: 'Simulated boarding audit on M/V Sea Guardian with Inspector Kowalski.',
    path: '/simulation/psc-mission-01'
  },

  // Vessel Documents
  {
    id: 's-doc-1',
    title: 'Oil Record Book (Part I)',
    category: 'Vessel Documents',
    description: 'Vessel machinery operations log detailing bilge transfers and OWS usage.',
    path: '/simulation/psc-mission-01'
  },
  {
    id: 's-doc-2',
    title: 'Bridge Watch Logbook',
    category: 'Vessel Documents',
    description: 'Official navigation coordinates and watch shift registrations.',
    path: '/simulation/psc-mission-01'
  },

  // Crew
  {
    id: 's-crew-1',
    title: 'Chief Officer N. Petrov',
    category: 'Crew',
    description: 'Currently serving as Chief Officer on M/V Sea Guardian.',
    path: '/profile'
  },
  {
    id: 's-crew-2',
    title: 'Deck Cadet S. Al-Farsi',
    category: 'Crew',
    description: 'Cadet undergoing navigation training and logs monitoring.',
    path: '/profile'
  },
  {
    id: 's-crew-3',
    title: 'Captain J. Henderson',
    category: 'Crew',
    description: 'Master Mariner commanding M/V Sea Guardian.',
    path: '/profile'
  },

  // Checklists
  {
    id: 's-chk-1',
    title: 'Statutory Certs Desk Checklist',
    category: 'Checklists',
    description: 'Checklist to verifySafe Manning, GMDSS, and IOPP expiry dates.',
    path: '/simulation/psc-mission-01'
  },
  {
    id: 's-chk-2',
    title: 'Watchkeeper Rest Hour Verification Grid',
    category: 'Checklists',
    description: 'Checklist auditing Cadet and Chief Mate watch split intervals.',
    path: '/simulation/psc-mission-01'
  },

  // PSC Deficiencies
  {
    id: 's-def-1',
    title: 'Oily Rag on Exhaust Manifold (Code 30)',
    category: 'PSC Deficiencies',
    description: 'Detainable fire hazard deficiency under SOLAS standards.',
    path: '/simulation/results'
  },
  {
    id: 's-def-2',
    title: 'Tied-Open Fire door (Code 17)',
    category: 'PSC Deficiencies',
    description: 'Deficiency requiring rectification before vessel departure.',
    path: '/simulation/results'
  },
  {
    id: 's-def-3',
    title: 'Sewage holding bypass piping (Code 30)',
    category: 'PSC Deficiencies',
    description: 'Illegal pollution routing bypass violating MARPOL Annex IV.',
    path: '/simulation/results'
  }
]

export const headerNotifications: HeaderNotification[] = [
  {
    id: 'hn-1',
    title: 'PSC Inspector Boarded',
    description: 'Inspector Kowalski is waiting in the Ship Office to audit documentation.',
    time: '2 mins ago',
    category: 'Mission Updates',
    type: 'info',
    read: false
  },
  {
    id: 'hn-2',
    title: 'Detainable Fire Risk (Code 30)',
    description: 'Engine room inspection flagged an oily rag left on the exhaust manifold.',
    time: '15 mins ago',
    category: 'PSC Alerts',
    type: 'error',
    read: false
  },
  {
    id: 'hn-3',
    title: 'Certificate Expiry Warning',
    description: 'MARPOL IOPP Certificate and Chief Mate GMDSS license are expired.',
    time: '1 hour ago',
    category: 'Certificate Warnings',
    type: 'warning',
    read: false
  },
  {
    id: 'hn-4',
    title: 'Message from Port Agent',
    description: 'Customs clearances for Rotterdam Terminal 4 have been finalized.',
    time: '2 hours ago',
    category: 'Messages',
    type: 'message',
    read: true
  },
  {
    id: 'hn-5',
    title: 'System Synced',
    description: 'Simulation progress and crew leaderboard metrics updated successfully.',
    time: '3 hours ago',
    category: 'System Notifications',
    type: 'success',
    read: true
  }
]

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Modules':
      return BookOpen
    case 'Regulations':
      return ShieldAlert
    case 'Certificates':
      return ShieldCheck
    case 'Missions':
      return Compass
    case 'Vessel Documents':
      return FileText
    case 'Crew':
      return User
    case 'Checklists':
      return CheckSquare
    case 'PSC Deficiencies':
      return AlertTriangle
    default:
      return FileText
  }
}

export const getNotificationIcon = (category: string) => {
  switch (category) {
    case 'Mission Updates':
      return Compass
    case 'PSC Alerts':
      return AlertTriangle
    case 'Certificate Warnings':
      return ShieldAlert
    case 'Messages':
      return MessageSquare
    default:
      return Settings
  }
}
