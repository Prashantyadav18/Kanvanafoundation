export type ActivityType = 'Tree Plantation' | 'Bird Water Station' | 'General Survey' | 'Event Documentation';

export type District = 
  | 'Kanpur Nagar' 
  | 'Kanpur Dehat' 
  | 'Lucknow' 
  | 'Unnao' 
  | 'Prayagraj' 
  | 'Varanasi' 
  | 'Gorakhpur' 
  | 'Jhansi' 
  | 'Agra' 
  | 'Other UP District'
  | 'Coming Soon';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type EnquiryStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface GPSLocation {
  lat: number;
  lng: number;
}

export interface Submission {
  id: string;
  surveyorId: string;
  surveyorName: string;
  volunteerName: string;
  volunteerPhone: string;
  volunteerVillage: string;
  district: District;
  activityType: ActivityType;
  treesCount: number;
  activityDate: string;
  locationName: string;
  gps: GPSLocation;
  notes: string;
  photoUrls: string[];
  photoCaptions: string[];
  consentGiven: boolean;
  status: SubmissionStatus;
  featured: boolean;
  rejectionNote?: string;
  publishedAt?: string;
  createdAt: string;
  treeSpecies?: string;
  treeId?: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  intent: 'Plant trees with you' | 'Sponsor a plantation drive' | 'Donate' | 'Partner with Kanvana' | 'Media / Press' | 'Just curious';
  source: 'Social Media' | 'Friend / Colleague' | 'IIT Kanpur Campus' | 'News' | 'Search Engine' | 'Other';
  message: string;
  timestamp: string;
  status: EnquiryStatus;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'Plantation' | 'Bird Water Station' | 'Event' | 'HQ';
  treesCount: number;
  photos: string[];
  submissionId?: string;
  active: boolean;
  createdAt: string;
  locationName: string;
}

export interface SiteStats {
  treesPlanted: number;
  volunteersActive: number;
  districtsReached: number;
  birdsServed: number;
  lastUpdated: string;
}

export interface Surveyor {
  id: string;
  name: string;
  email: string;
  phone: string;
  district: string;
  active: boolean;
  password?: string;
  totalSubmissions: number;
  approvedCount: number;
  createdAt: string;
  lastActive: string;
}

export interface GrowthEntry {
  date: string;
  photo: string;
  note: string;
}

export interface TreeProfile {
  treeId: string;
  submissionId: string;
  species: string;
  plantedBy: string;
  plantedDate: string;
  locationName: string;
  district: string;
  gps: GPSLocation;
  photos: string[];
  growthLog: GrowthEntry[];
  qrCodeUrl: string;
}

export type Language = 'en' | 'hi';

export interface IssuedCertificate {
  id: string;
  certificateNo: string;
  recipientName: string;
  treesPlanted: number;
  location: string;
  issuedDate: string;
  issuedBy: 'Public Portal' | 'Admin';
  createdAt: string;
}
