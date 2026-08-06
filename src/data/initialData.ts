import { SiteStats, Submission, MapMarker, Enquiry, Surveyor, TreeProfile } from '../types';

export const initialSiteStats: SiteStats = {
  treesPlanted: 0,
  volunteersActive: 0,
  districtsReached: 0,
  birdsServed: 0,
  lastUpdated: '2026-08-05T00:00:00.000Z'
};

export const initialSubmissions: Submission[] = [
  {
    id: 'sub-001',
    surveyorId: 'surv-01',
    surveyorName: 'Amit Sharma',
    volunteerName: 'Volunteer (Field Site)',
    volunteerPhone: '+91 98765 00000',
    volunteerVillage: 'Coming Soon',
    district: 'Coming Soon',
    activityType: 'Tree Plantation',
    treesCount: 25,
    activityDate: '2026-07-28',
    locationName: 'Coming Soon',
    gps: { lat: 26.5188, lng: 80.2329 },
    notes: 'Planted Neem, Peepal, and Sheesham saplings with student volunteers. Tree guards installed.',
    photoUrls: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=800'
    ],
    photoCaptions: ['Student volunteers planting Neem sapling', 'Group photo at green zone'],
    consentGiven: true,
    status: 'approved',
    featured: true,
    publishedAt: '2026-07-28T14:30:00.000Z',
    createdAt: '2026-07-28T12:00:00.000Z',
    treeSpecies: 'Neem (Azadirachta indica)'
  },
  {
    id: 'sub-002',
    surveyorId: 'surv-02',
    surveyorName: 'Priya Verma',
    volunteerName: 'Volunteer (Field Site)',
    volunteerPhone: '+91 91234 00000',
    volunteerVillage: 'Coming Soon',
    district: 'Coming Soon',
    activityType: 'Tree Plantation',
    treesCount: 50,
    activityDate: '2026-07-20',
    locationName: 'Coming Soon',
    gps: { lat: 26.4176, lng: 80.0028 },
    notes: 'Community plantation drive involving 30 school children and village elders.',
    photoUrls: [
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800'
    ],
    photoCaptions: ['Children helping water young Banyan tree', 'Villagers setting up tree protection netting'],
    consentGiven: true,
    status: 'approved',
    featured: true,
    publishedAt: '2026-07-20T16:00:00.000Z',
    createdAt: '2026-07-20T11:20:00.000Z',
    treeSpecies: 'Banyan & Gulmohar'
  },
  {
    id: 'sub-003',
    surveyorId: 'surv-01',
    surveyorName: 'Amit Sharma',
    volunteerName: 'Volunteer (Field Site)',
    volunteerPhone: '+91 99887 00000',
    volunteerVillage: 'Coming Soon',
    district: 'Coming Soon',
    activityType: 'Bird Water Station',
    treesCount: 0,
    activityDate: '2026-06-15',
    locationName: 'Coming Soon',
    gps: { lat: 26.4950, lng: 80.2580 },
    notes: 'Installed 40 clay water bowls for birds during peak summer week. Refill schedule set up.',
    photoUrls: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&q=80&w=800'
    ],
    photoCaptions: ['Clay water pot hung on Mango tree branch', 'Local sparrow drinking water'],
    consentGiven: true,
    status: 'approved',
    featured: true,
    publishedAt: '2026-06-15T10:00:00.000Z',
    createdAt: '2026-06-15T09:15:00.000Z',
    treeSpecies: 'N/A (Bird Station)'
  },
  {
    id: 'sub-004',
    surveyorId: 'surv-03',
    surveyorName: 'Rohan Gupta',
    volunteerName: 'Volunteer (Field Site)',
    volunteerPhone: '+91 98112 00000',
    volunteerVillage: 'Coming Soon',
    district: 'Coming Soon',
    activityType: 'Tree Plantation',
    treesCount: 30,
    activityDate: '2026-07-10',
    locationName: 'Coming Soon',
    gps: { lat: 26.8467, lng: 80.9462 },
    notes: 'Urban micro-forest drive. Planted Amaltas, Gulmohar, and Jacaranda trees.',
    photoUrls: [
      'https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&q=80&w=800'
    ],
    photoCaptions: ['Amaltas saplings planted along river pathway'],
    consentGiven: true,
    status: 'approved',
    featured: false,
    publishedAt: '2026-07-10T12:00:00.000Z',
    createdAt: '2026-07-10T10:00:00.000Z',
    treeSpecies: 'Amaltas & Jacaranda'
  },
  {
    id: 'sub-005',
    surveyorId: 'surv-02',
    surveyorName: 'Priya Verma',
    volunteerName: 'Volunteer (Field Site)',
    volunteerPhone: '+91 97654 00000',
    volunteerVillage: 'Coming Soon',
    district: 'Coming Soon',
    activityType: 'Tree Plantation',
    treesCount: 15,
    activityDate: '2026-08-01',
    locationName: 'Coming Soon',
    gps: { lat: 26.5393, lng: 80.4878 },
    notes: 'Plantation of shade-giving trees along road dividers with local market association.',
    photoUrls: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800'
    ],
    photoCaptions: ['Volunteers preparing soil beds'],
    consentGiven: true,
    status: 'pending',
    featured: false,
    createdAt: '2026-08-01T15:30:00.000Z',
    treeSpecies: 'Peepal (Ficus religiosa)'
  }
];

export const initialMapMarkers: MapMarker[] = [
  {
    id: 'marker-001',
    lat: 26.5188,
    lng: 80.2329,
    title: 'Kanvana HQ — Nankari, IIT Kanpur',
    type: 'HQ',
    treesCount: 50,
    locationName: 'Nankari Gate, IIT Kanpur, UP',
    photos: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'],
    active: true,
    createdAt: '2026-06-01T00:00:00.000Z'
  },
  {
    id: 'marker-002',
    lat: 26.4176,
    lng: 80.0028,
    title: 'Akbarpur Site (Coming Soon)',
    type: 'Plantation',
    treesCount: 120,
    locationName: 'Coming Soon',
    photos: ['https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800'],
    submissionId: 'sub-002',
    active: true,
    createdAt: '2026-07-20T00:00:00.000Z'
  },
  {
    id: 'marker-003',
    lat: 26.4950,
    lng: 80.2580,
    title: 'Bird Water Network (Coming Soon)',
    type: 'Bird Water Station',
    treesCount: 0,
    locationName: 'Coming Soon',
    photos: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=800'],
    submissionId: 'sub-003',
    active: true,
    createdAt: '2026-06-15T00:00:00.000Z'
  },
  {
    id: 'marker-004',
    lat: 26.8467,
    lng: 80.9462,
    title: 'Urban Green Belt (Coming Soon)',
    type: 'Plantation',
    treesCount: 30,
    locationName: 'Coming Soon',
    photos: ['https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&q=80&w=800'],
    submissionId: 'sub-004',
    active: true,
    createdAt: '2026-07-10T00:00:00.000Z'
  }
];

export const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-101',
    name: 'Dr. Siddharth Pandey',
    email: 'spandey@iitk.ac.in',
    phone: '+91 94150 12345',
    city: 'Kanpur',
    intent: 'Sponsor a plantation drive',
    source: 'IIT Kanpur Campus',
    message: 'We would like to sponsor a drive of 100 trees around the campus perimeter for Independence Day.',
    timestamp: '2026-08-04T10:15:00.000Z',
    status: 'new'
  },
  {
    id: 'enq-102',
    name: 'Meera Kapoor',
    email: 'meera.k@gmail.com',
    phone: '+91 98390 98765',
    city: 'Lucknow',
    intent: 'Plant trees with you',
    source: 'Social Media',
    message: 'I am a student at Lucknow University and want to start a Kanvana volunteer chapter here.',
    timestamp: '2026-08-02T14:20:00.000Z',
    status: 'contacted'
  }
];

export const initialSurveyors: Surveyor[] = [
  {
    id: 'surv-01',
    name: 'Amit Sharma',
    email: 'surveyor1@kanvana.com',
    phone: '+91 98765 11223',
    district: 'Kanpur Nagar',
    active: true,
    totalSubmissions: 14,
    approvedCount: 12,
    createdAt: '2026-06-01T00:00:00.000Z',
    lastActive: '2026-08-04T16:00:00.000Z'
  },
  {
    id: 'surv-02',
    name: 'Priya Verma',
    email: 'priya.surveyor@kanvana.com',
    phone: '+91 91234 44556',
    district: 'Kanpur Dehat',
    active: true,
    totalSubmissions: 9,
    approvedCount: 8,
    createdAt: '2026-06-10T00:00:00.000Z',
    lastActive: '2026-08-01T15:30:00.000Z'
  },
  {
    id: 'surv-03',
    name: 'Rohan Gupta',
    email: 'rohan.lko@kanvana.com',
    phone: '+91 98112 66778',
    district: 'Lucknow',
    active: true,
    totalSubmissions: 5,
    approvedCount: 5,
    createdAt: '2026-07-01T00:00:00.000Z',
    lastActive: '2026-07-10T12:00:00.000Z'
  }
];

export const initialTrees: TreeProfile[] = [
  {
    treeId: 'KANVANA-TREE-001',
    submissionId: 'sub-001',
    species: 'Neem (Azadirachta indica)',
    plantedBy: 'Volunteer (Field Site)',
    plantedDate: '2026-07-28',
    locationName: 'Coming Soon',
    district: 'Kanpur Nagar',
    gps: { lat: 26.5188, lng: 80.2329 },
    photos: [
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
    ],
    growthLog: [
      {
        date: '2026-07-28',
        photo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        note: 'Sapling planted during monsoon drive with steel guard protection.'
      },
      {
        date: '2026-08-04',
        photo: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&q=80&w=800',
        note: 'New green shoots emerging! Watered twice this week.'
      }
    ],
    qrCodeUrl: 'https://kanvana.vercel.app/tree/KANVANA-TREE-001'
  },
  {
    treeId: 'KANVANA-TREE-002',
    submissionId: 'sub-002',
    species: 'Peepal (Ficus religiosa)',
    plantedBy: 'Volunteer (Field Site)',
    plantedDate: '2026-07-20',
    locationName: 'Coming Soon',
    district: 'Kanpur Dehat',
    gps: { lat: 26.4176, lng: 80.0028 },
    photos: [
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800'
    ],
    growthLog: [
      {
        date: '2026-07-20',
        photo: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800',
        note: 'Planted with local village students in Akbarpur.'
      }
    ],
    qrCodeUrl: 'https://kanvana.vercel.app/tree/KANVANA-TREE-002'
  }
];
