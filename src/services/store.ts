import { 
  SiteStats, Submission, MapMarker, Enquiry, Surveyor, TreeProfile, Language, IssuedCertificate 
} from '../types';
import { 
  initialSiteStats, initialSubmissions, initialMapMarkers, 
  initialEnquiries, initialSurveyors, initialTrees 
} from '../data/initialData';
import { db, collection, doc, setDoc, deleteDoc, onSnapshot } from '../lib/firebase';

const STORAGE_KEYS = {
  STATS: 'kanvana_site_stats_v4',
  SUBMISSIONS: 'kanvana_submissions_v4',
  MARKERS: 'kanvana_map_markers_v4',
  ENQUIRIES: 'kanvana_enquiries_v4',
  SURVEYORS: 'kanvana_surveyors_v4',
  TREES: 'kanvana_trees_v4',
  CERTIFICATES: 'kanvana_certificates_v1',
  LANG: 'kanvana_language_v1',
  WEBHOOK: 'kanvana_google_webhook_v1',
  FOUNDER_PHOTO: 'kanvana_founder_photo_v1',
  STORY_IMAGES: 'kanvana_story_images_v1'
};

const initialCertificates: IssuedCertificate[] = [
  {
    id: 'cert-101',
    certificateNo: 'KNV-CERT-2026-001',
    recipientName: 'Vaibhav Yadav',
    treesPlanted: 10,
    location: 'Nankari, IIT Kanpur',
    issuedDate: '2026-08-01',
    issuedBy: 'Public Portal',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'cert-102',
    certificateNo: 'KNV-CERT-2026-002',
    recipientName: 'Prashant Yadav',
    treesPlanted: 25,
    location: 'Bhitargaon, Kanpur Dehat',
    issuedDate: '2026-08-05',
    issuedBy: 'Admin',
    createdAt: '2026-08-05T12:30:00Z'
  }
];

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error loading localStorage key', key, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Error saving localStorage key', key, e);
  }
}

export const defaultStoryImages: string[] = [
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
];

type Listener = () => void;

class KanvanaStore {
  private stats: SiteStats = loadStorage(STORAGE_KEYS.STATS, initialSiteStats);
  private submissions: Submission[] = loadStorage(STORAGE_KEYS.SUBMISSIONS, initialSubmissions);
  private mapMarkers: MapMarker[] = loadStorage(STORAGE_KEYS.MARKERS, initialMapMarkers);
  private enquiries: Enquiry[] = loadStorage(STORAGE_KEYS.ENQUIRIES, initialEnquiries);
  private surveyors: Surveyor[] = loadStorage(STORAGE_KEYS.SURVEYORS, initialSurveyors);
  private trees: TreeProfile[] = loadStorage(STORAGE_KEYS.TREES, initialTrees);
  private certificates: IssuedCertificate[] = loadStorage(STORAGE_KEYS.CERTIFICATES, initialCertificates);
  private language: Language = loadStorage(STORAGE_KEYS.LANG, 'en');
  private storyImages: string[] = loadStorage(STORAGE_KEYS.STORY_IMAGES, defaultStoryImages);
  private webhookUrl: string = loadStorage(STORAGE_KEYS.WEBHOOK, '');
  private founderPhoto: string = loadStorage(
    STORAGE_KEYS.FOUNDER_PHOTO, 
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
  );

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.initFirestoreSync();
  }

  private async syncDoc(collectionName: string, docId: string, data: any) {
    try {
      if (!docId) return;
      await setDoc(doc(db, collectionName, docId), data, { merge: true });
    } catch (e) {
      console.warn(`[Firestore Sync] Failed to sync ${collectionName}/${docId}:`, e);
    }
  }

  private async removeDoc(collectionName: string, docId: string) {
    try {
      if (!docId) return;
      await deleteDoc(doc(db, collectionName, docId));
    } catch (e) {
      console.warn(`[Firestore Sync] Failed to delete ${collectionName}/${docId}:`, e);
    }
  }

  private initFirestoreSync() {
    try {
      // Submissions Live Listener
      onSnapshot(collection(db, 'submissions'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Submission[] = [];
          snapshot.forEach(d => list.push(d.data() as Submission));
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          this.submissions = list;
          saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
          this.notify();
        } else {
          this.submissions.forEach(s => this.syncDoc('submissions', s.id, s));
        }
      }, err => console.warn('[Firestore] Submissions listener error:', err));

      // Surveyors Live Listener
      onSnapshot(collection(db, 'surveyors'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Surveyor[] = [];
          snapshot.forEach(d => list.push(d.data() as Surveyor));
          this.surveyors = list;
          saveStorage(STORAGE_KEYS.SURVEYORS, this.surveyors);
          this.notify();
        } else {
          this.surveyors.forEach(s => this.syncDoc('surveyors', s.id, s));
        }
      }, err => console.warn('[Firestore] Surveyors listener error:', err));

      // Certificates Live Listener
      onSnapshot(collection(db, 'certificates'), (snapshot) => {
        if (!snapshot.empty) {
          const list: IssuedCertificate[] = [];
          snapshot.forEach(d => list.push(d.data() as IssuedCertificate));
          list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          this.certificates = list;
          saveStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);
          this.notify();
        } else {
          this.certificates.forEach(c => this.syncDoc('certificates', c.id, c));
        }
      }, err => console.warn('[Firestore] Certificates listener error:', err));

      // Impact Stats Live Listener
      onSnapshot(doc(db, 'impact_stats', 'global'), (docSnap) => {
        if (docSnap.exists()) {
          this.stats = { ...this.stats, ...(docSnap.data() as SiteStats) };
          saveStorage(STORAGE_KEYS.STATS, this.stats);
          this.notify();
        } else {
          this.syncDoc('impact_stats', 'global', this.stats);
        }
      }, err => console.warn('[Firestore] Stats listener error:', err));

      // Enquiries Live Listener
      onSnapshot(collection(db, 'enquiries'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Enquiry[] = [];
          snapshot.forEach(d => list.push(d.data() as Enquiry));
          this.enquiries = list;
          saveStorage(STORAGE_KEYS.ENQUIRIES, this.enquiries);
          this.notify();
        } else {
          this.enquiries.forEach(e => this.syncDoc('enquiries', e.id, e));
        }
      }, err => console.warn('[Firestore] Enquiries listener error:', err));

      // Map Markers Live Listener
      onSnapshot(collection(db, 'markers'), (snapshot) => {
        if (!snapshot.empty) {
          const list: MapMarker[] = [];
          snapshot.forEach(d => list.push(d.data() as MapMarker));
          this.mapMarkers = list;
          saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);
          this.notify();
        } else {
          this.mapMarkers.forEach(m => this.syncDoc('markers', m.id, m));
        }
      }, err => console.warn('[Firestore] Markers listener error:', err));

      // Tree Profiles Live Listener
      onSnapshot(collection(db, 'trees'), (snapshot) => {
        if (!snapshot.empty) {
          const list: TreeProfile[] = [];
          snapshot.forEach(d => list.push(d.data() as TreeProfile));
          this.trees = list;
          saveStorage(STORAGE_KEYS.TREES, this.trees);
          this.notify();
        } else {
          this.trees.forEach(t => this.syncDoc('trees', t.treeId, t));
        }
      }, err => console.warn('[Firestore] Trees listener error:', err));

    } catch (e) {
      console.warn('[Firestore] Sync init failed:', e);
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // Helper for generating guaranteed unique Tree IDs
  generateNextTreeId(): string {
    const existing = new Set(this.trees.map(t => t.treeId.toUpperCase().trim()));
    let idx = this.trees.length + 1;
    while (true) {
      const candidate = `KANVANA-TREE-${String(idx).padStart(3, '0')}`;
      if (!existing.has(candidate)) {
        return candidate;
      }
      idx++;
    }
  }

  isTreeIdUnique(treeId: string): boolean {
    if (!treeId || !treeId.trim()) return true;
    const clean = treeId.toUpperCase().trim();
    
    // Check against registered tree profiles
    const inTrees = this.trees.some(t => {
      const existing = t.treeId.toUpperCase().trim();
      return existing === clean || existing === `KANVANA-TREE-${clean}` || existing.endsWith(`-${clean}`);
    });
    if (inTrees) return false;

    // Check against existing submissions with treeId
    const inSubmissions = this.submissions.some(s => {
      if (!s.treeId) return false;
      const existing = s.treeId.toUpperCase().trim();
      return existing === clean || existing === `KANVANA-TREE-${clean}` || existing.endsWith(`-${clean}`);
    });

    return !inSubmissions;
  }

  addCustomTree(treeData: Omit<TreeProfile, 'qrCodeUrl'>): { success: boolean; message?: string; tree?: TreeProfile } {
    const cleanId = treeData.treeId.toUpperCase().trim();
    if (!cleanId) {
      return { success: false, message: 'Tree ID cannot be empty.' };
    }
    if (!this.isTreeIdUnique(cleanId)) {
      return { success: false, message: `Tree ID "${cleanId}" already exists in the central registry! Duplicate Tree IDs are strictly blocked.` };
    }

    const newTree: TreeProfile = {
      ...treeData,
      treeId: cleanId,
      qrCodeUrl: `https://kanvana.vercel.app/tree/${cleanId}`
    };

    this.trees = [newTree, ...this.trees];
    saveStorage(STORAGE_KEYS.TREES, this.trees);
    this.syncDoc('trees', cleanId, newTree);
    this.notify();
    this.triggerGoogleDriveWebhook('submission', {
      event: 'NEW_UNIQUE_TREE_REGISTERED',
      treeId: cleanId,
      species: treeData.species,
      plantedBy: treeData.plantedBy,
      district: treeData.district,
      plantedDate: treeData.plantedDate
    });
    return { success: true, tree: newTree };
  }

  exportTreeDatabaseCSV(): string {
    const headers = 'UniqueTreeID,Species,PlantedBy,PlantedDate,Location,District,Latitude,Longitude,GrowthLogsCount\n';
    const rows = this.trees.map(t => {
      const lat = t.gps?.lat ?? '';
      const lng = t.gps?.lng ?? '';
      return `"${t.treeId}","${t.species}","${t.plantedBy}","${t.plantedDate}","${t.locationName.replace(/"/g, '""')}","${t.district}","${lat}","${lng}","${t.growthLog.length}"`;
    }).join('\n');
    return headers + rows;
  }
  getFounderPhoto(): string { return this.founderPhoto; }
  setFounderPhoto(url: string) {
    this.founderPhoto = url;
    saveStorage(STORAGE_KEYS.FOUNDER_PHOTO, url);
    this.notify();
  }

  getWebhookUrl(): string { return this.webhookUrl; }
  setWebhookUrl(url: string) {
    this.webhookUrl = url;
    saveStorage(STORAGE_KEYS.WEBHOOK, url);
    this.notify();
  }

  async triggerGoogleDriveWebhook(type: 'submission' | 'enquiry' | 'surveyor' | 'certificate', data: any) {
    const url = this.getWebhookUrl();
    if (!url) return;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          timestamp: new Date().toISOString(),
          data
        })
      });
      console.log(`[Kanvana Google Sync] Triggered ${type} sync to Google Drive/Sheets`);
    } catch (err) {
      console.warn('[Kanvana Google Sync] Failed to send webhook:', err);
    }
  }

  // Getters
  getStats(): SiteStats { return this.stats; }
  getSubmissions(): Submission[] { return this.submissions; }
  getApprovedSubmissions(): Submission[] {
    return this.submissions.filter(s => s.status === 'approved');
  }
  getMapMarkers(): MapMarker[] { return this.mapMarkers; }
  getActiveMapMarkers(): MapMarker[] {
    return this.mapMarkers.filter(m => m.active);
  }
  getEnquiries(): Enquiry[] { return this.enquiries; }
  getSurveyors(): Surveyor[] { return this.surveyors; }
  getTrees(): TreeProfile[] { return this.trees; }
  getIssuedCertificates(): IssuedCertificate[] { return this.certificates; }
  getLanguage(): Language { return this.language; }

  // Issue e-Certificate and record in persistent store & Google Sheet
  issueCertificate(data: {
    recipientName: string;
    treesPlanted: number;
    location: string;
    issuedDate?: string;
    issuedBy?: 'Public Portal' | 'Admin';
  }): IssuedCertificate {
    const certNo = `KNV-CERT-2026-${String(this.certificates.length + 1).padStart(3, '0')}`;
    const newCert: IssuedCertificate = {
      id: `cert-${Date.now()}`,
      certificateNo: certNo,
      recipientName: data.recipientName.trim(),
      treesPlanted: data.treesPlanted || 1,
      location: data.location.trim() || 'Nankari, IIT Kanpur',
      issuedDate: data.issuedDate || new Date().toISOString().split('T')[0],
      issuedBy: data.issuedBy || 'Public Portal',
      createdAt: new Date().toISOString()
    };

    this.certificates = [newCert, ...this.certificates];
    saveStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);
    this.syncDoc('certificates', newCert.id, newCert);
    this.notify();
    this.triggerGoogleDriveWebhook('certificate', newCert);
    return newCert;
  }

  deleteIssuedCertificate(id: string) {
    this.certificates = this.certificates.filter(c => c.id !== id);
    saveStorage(STORAGE_KEYS.CERTIFICATES, this.certificates);
    this.removeDoc('certificates', id);
    this.notify();
  }

  exportCertificatesCSV() {
    const headers = ['Certificate No', 'Recipient Name', 'Trees Planted', 'Location', 'Issued Date', 'Issued By', 'Created At'];
    const rows = this.certificates.map(c => [
      c.certificateNo,
      `"${c.recipientName.replace(/"/g, '""')}"`,
      c.treesPlanted,
      `"${c.location.replace(/"/g, '""')}"`,
      c.issuedDate,
      c.issuedBy,
      c.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kanvana_issued_certificates_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Setters & Actions
  setLanguage(lang: Language) {
    this.language = lang;
    saveStorage(STORAGE_KEYS.LANG, lang);
    this.notify();
  }

  updateStats(newStats: Partial<SiteStats>) {
    this.stats = {
      ...this.stats,
      ...newStats,
      lastUpdated: new Date().toISOString()
    };
    saveStorage(STORAGE_KEYS.STATS, this.stats);
    this.syncDoc('impact_stats', 'global', this.stats);
    this.notify();
  }

  addEnquiry(enquiryData: Omit<Enquiry, 'id' | 'timestamp' | 'status'>) {
    const newEnq: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    this.enquiries = [newEnq, ...this.enquiries];
    saveStorage(STORAGE_KEYS.ENQUIRIES, this.enquiries);
    this.syncDoc('enquiries', newEnq.id, newEnq);
    this.notify();
    this.triggerGoogleDriveWebhook('enquiry', newEnq);
    return newEnq;
  }

  updateEnquiryStatus(id: string, status: Enquiry['status']) {
    this.enquiries = this.enquiries.map(e => e.id === id ? { ...e, status } : e);
    saveStorage(STORAGE_KEYS.ENQUIRIES, this.enquiries);
    const updated = this.enquiries.find(e => e.id === id);
    if (updated) this.syncDoc('enquiries', id, updated);
    this.notify();
  }

  addSubmission(subData: Omit<Submission, 'id' | 'createdAt' | 'status' | 'featured'>): Submission {
    const newSub: Submission = {
      ...subData,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      featured: false
    };
    this.submissions = [newSub, ...this.submissions];
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.syncDoc('submissions', newSub.id, newSub);

    // Update Surveyor activity stats
    if (subData.surveyorId || subData.surveyorName) {
      this.surveyors = this.surveyors.map(s => {
        if (s.id === subData.surveyorId || s.name === subData.surveyorName || s.email === subData.surveyorId) {
          const updatedSurv = {
            ...s,
            totalSubmissions: (s.totalSubmissions || 0) + 1,
            lastActive: 'Just now'
          };
          this.syncDoc('surveyors', s.id, updatedSurv);
          return updatedSurv;
        }
        return s;
      });
      saveStorage(STORAGE_KEYS.SURVEYORS, this.surveyors);
    }

    this.notify();
    this.triggerGoogleDriveWebhook('submission', newSub);
    return newSub;
  }

  approveSubmission(id: string, adminName: string = 'Prashant Yadav') {
    const target = this.submissions.find(s => s.id === id);
    if (!target) return;

    let updatedSub: Submission | null = null;
    this.submissions = this.submissions.map(s => {
      if (s.id === id) {
        updatedSub = {
          ...s,
          status: 'approved' as const,
          publishedAt: new Date().toISOString()
        };
        return updatedSub;
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    if (updatedSub) this.syncDoc('submissions', id, updatedSub);

    // Auto-update site stats tree count
    if (target.treesCount > 0) {
      this.updateStats({
        treesPlanted: this.stats.treesPlanted + target.treesCount
      });
    }

    // Auto-add to map if GPS exists and not already on map
    if (target.gps && target.gps.lat && target.gps.lng) {
      const exists = this.mapMarkers.some(m => m.submissionId === id);
      if (!exists) {
        this.addMapMarker({
          lat: target.gps.lat,
          lng: target.gps.lng,
          title: `${target.volunteerName}'s ${target.activityType}`,
          type: target.activityType === 'Bird Water Station' ? 'Bird Water Station' : 'Plantation',
          treesCount: target.treesCount,
          photos: target.photoUrls,
          submissionId: id,
          active: true,
          locationName: target.locationName || target.volunteerVillage
        });
      }
    }

    // Auto-generate or use assigned Tree Profile if trees planted > 0
    if (target.treesCount > 0) {
      const treeId = target.treeId?.trim().toUpperCase() || this.generateNextTreeId();
      const exists = this.trees.some(t => t.treeId.toUpperCase().trim() === treeId);
      if (!exists) {
        const newTree: TreeProfile = {
          treeId,
          submissionId: id,
          species: target.treeSpecies || 'Neem / Native Shade Species',
          plantedBy: target.volunteerName,
          plantedDate: target.activityDate || new Date().toISOString().split('T')[0],
          locationName: target.locationName || target.volunteerVillage,
          district: target.district,
          gps: target.gps,
          photos: target.photoUrls,
          growthLog: [
            {
              date: target.activityDate || new Date().toISOString().split('T')[0],
              photo: target.photoUrls[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
              note: `Planted by ${target.volunteerName} at ${target.locationName || target.volunteerVillage}`
            }
          ],
          qrCodeUrl: `https://kanvana.vercel.app/tree/${treeId}`
        };
        this.trees = [newTree, ...this.trees];
        saveStorage(STORAGE_KEYS.TREES, this.trees);
        this.syncDoc('trees', treeId, newTree);
      }
    }

    this.notify();
  }

  unpublishSubmission(id: string) {
    const target = this.submissions.find(s => s.id === id);
    if (!target) return;

    const isApproved = target.status === 'approved';

    let updatedSub: Submission | null = null;
    this.submissions = this.submissions.map(s => {
      if (s.id === id) {
        updatedSub = {
          ...s,
          status: 'pending' as const,
          publishedAt: undefined
        };
        return updatedSub;
      }
      return s;
    });

    // Remove associated map markers
    const markersToRemove = this.mapMarkers.filter(m => m.submissionId === id);
    markersToRemove.forEach(m => this.removeDoc('markers', m.id));
    this.mapMarkers = this.mapMarkers.filter(m => m.submissionId !== id);
    saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);

    // Revert tree stats if previously approved
    if (isApproved && target.treesCount > 0) {
      this.updateStats({
        treesPlanted: Math.max(0, this.stats.treesPlanted - target.treesCount)
      });
    }

    // Remove tree profiles created for this submission
    const treesToRemove = this.trees.filter(t => t.submissionId === id);
    treesToRemove.forEach(t => this.removeDoc('trees', t.treeId));
    this.trees = this.trees.filter(t => t.submissionId !== id);
    saveStorage(STORAGE_KEYS.TREES, this.trees);

    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    if (updatedSub) this.syncDoc('submissions', id, updatedSub);
    this.notify();
    this.triggerGoogleDriveWebhook('submission', { event: 'SUBMISSION_UNPUBLISHED', id });
  }

  deleteSubmission(id: string) {
    const target = this.submissions.find(s => s.id === id);
    if (!target) return;

    if (target.status === 'approved' && target.treesCount > 0) {
      this.updateStats({
        treesPlanted: Math.max(0, this.stats.treesPlanted - target.treesCount)
      });
    }

    const markersToRemove = this.mapMarkers.filter(m => m.submissionId === id);
    markersToRemove.forEach(m => this.removeDoc('markers', m.id));

    const treesToRemove = this.trees.filter(t => t.submissionId === id);
    treesToRemove.forEach(t => this.removeDoc('trees', t.treeId));

    this.submissions = this.submissions.filter(s => s.id !== id);
    this.mapMarkers = this.mapMarkers.filter(m => m.submissionId !== id);
    this.trees = this.trees.filter(t => t.submissionId !== id);

    saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);
    saveStorage(STORAGE_KEYS.TREES, this.trees);
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.removeDoc('submissions', id);
    this.notify();
    this.triggerGoogleDriveWebhook('submission', { event: 'SUBMISSION_DELETED', id });
  }

  rejectSubmission(id: string, rejectionNote: string) {
    let updatedSub: Submission | null = null;
    this.submissions = this.submissions.map(s => {
      if (s.id === id) {
        updatedSub = {
          ...s,
          status: 'rejected' as const,
          rejectionNote
        };
        return updatedSub;
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    if (updatedSub) this.syncDoc('submissions', id, updatedSub);
    this.notify();
  }

  toggleFeaturedSubmission(id: string) {
    let updatedSub: Submission | null = null;
    this.submissions = this.submissions.map(s => {
      if (s.id === id) {
        updatedSub = { ...s, featured: !s.featured };
        return updatedSub;
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    if (updatedSub) this.syncDoc('submissions', id, updatedSub);
    this.notify();
  }

  addMapMarker(markerData: Omit<MapMarker, 'id' | 'createdAt'>) {
    const newMarker: MapMarker = {
      ...markerData,
      id: `marker-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.mapMarkers = [newMarker, ...this.mapMarkers];
    saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);
    this.syncDoc('markers', newMarker.id, newMarker);
    this.notify();
    return newMarker;
  }

  deleteMapMarker(id: string) {
    this.mapMarkers = this.mapMarkers.filter(m => m.id !== id);
    saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);
    this.removeDoc('markers', id);
    this.notify();
  }

  addSurveyor(survData: Omit<Surveyor, 'id' | 'createdAt' | 'totalSubmissions' | 'approvedCount' | 'lastActive'>) {
    const newSurv: Surveyor = {
      ...survData,
      id: `surv-${Date.now()}`,
      totalSubmissions: 0,
      approvedCount: 0,
      createdAt: new Date().toISOString(),
      lastActive: 'Just now'
    };
    this.surveyors = [newSurv, ...this.surveyors];
    saveStorage(STORAGE_KEYS.SURVEYORS, this.surveyors);
    this.syncDoc('surveyors', newSurv.id, newSurv);
    this.notify();
    this.triggerGoogleDriveWebhook('surveyor', newSurv);
    return newSurv;
  }

  toggleSurveyorActive(id: string) {
    let updatedSurv: Surveyor | null = null;
    this.surveyors = this.surveyors.map(s => {
      if (s.id === id) {
        updatedSurv = { ...s, active: !s.active };
        return updatedSurv;
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SURVEYORS, this.surveyors);
    if (updatedSurv) this.syncDoc('surveyors', id, updatedSurv);
    this.notify();
  }

  addTreeGrowthEntry(treeId: string, entry: { date: string; photo: string; note: string }) {
    let updatedTree: TreeProfile | null = null;
    this.trees = this.trees.map(t => {
      if (t.treeId === treeId) {
        updatedTree = {
          ...t,
          growthLog: [entry, ...t.growthLog]
        };
        return updatedTree;
      }
      return t;
    });
    saveStorage(STORAGE_KEYS.TREES, this.trees);
    if (updatedTree) this.syncDoc('trees', treeId, updatedTree);
    this.notify();
  }

  getStoryImages(): string[] {
    return this.storyImages && this.storyImages.length === 5 ? this.storyImages : defaultStoryImages;
  }

  updateStoryImage(index: number, newUrl: string) {
    if (index >= 0 && index < 5) {
      const updated = [...this.getStoryImages()];
      updated[index] = newUrl;
      this.storyImages = updated;
      saveStorage(STORAGE_KEYS.STORY_IMAGES, this.storyImages);
      this.notify();
    }
  }

  updateAllStoryImages(images: string[]) {
    if (Array.isArray(images) && images.length === 5) {
      this.storyImages = images;
      saveStorage(STORAGE_KEYS.STORY_IMAGES, this.storyImages);
      this.notify();
    }
  }

  exportInitialDataTsCode(): string {
    return `import { SiteStats, Submission, MapMarker, Enquiry, Surveyor, TreeProfile } from '../types';

export const initialSiteStats: SiteStats = ${JSON.stringify(this.stats, null, 2)};

export const initialSubmissions: Submission[] = ${JSON.stringify(this.submissions, null, 2)};

export const initialMapMarkers: MapMarker[] = ${JSON.stringify(this.mapMarkers, null, 2)};

export const initialEnquiries: Enquiry[] = ${JSON.stringify(this.enquiries, null, 2)};

export const initialSurveyors: Surveyor[] = ${JSON.stringify(this.surveyors, null, 2)};

export const initialTrees: TreeProfile[] = ${JSON.stringify(this.trees, null, 2)};
`;
  }

  resetToDefaults() {
    this.stats = initialSiteStats;
    this.submissions = initialSubmissions;
    this.mapMarkers = initialMapMarkers;
    this.enquiries = initialEnquiries;
    this.surveyors = initialSurveyors;
    this.trees = initialTrees;
    this.storyImages = defaultStoryImages;

    saveStorage(STORAGE_KEYS.STATS, this.stats);
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);
    saveStorage(STORAGE_KEYS.ENQUIRIES, this.enquiries);
    saveStorage(STORAGE_KEYS.SURVEYORS, this.surveyors);
    saveStorage(STORAGE_KEYS.TREES, this.trees);
    saveStorage(STORAGE_KEYS.STORY_IMAGES, this.storyImages);
    this.notify();
  }
}

export const store = new KanvanaStore();
