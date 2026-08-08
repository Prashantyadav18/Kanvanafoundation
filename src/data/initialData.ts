import { SiteStats, Submission, MapMarker, Enquiry, Surveyor, TreeProfile } from '../types';

export const initialSiteStats: SiteStats = {
  treesPlanted: 0,
  volunteersActive: 0,
  districtsReached: 0,
  birdsServed: 0,
  lastUpdated: '2026-08-05T00:00:00.000Z'
};

export const initialSubmissions: Submission[] = [];

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
    totalSubmissions: 0,
    approvedCount: 0,
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
    totalSubmissions: 0,
    approvedCount: 0,
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
    totalSubmissions: 0,
    approvedCount: 0,
    createdAt: '2026-07-01T00:00:00.000Z',
    lastActive: '2026-07-10T12:00:00.000Z'
  }
];

export const initialTrees: TreeProfile[] = [];
