import { 
  SiteStats, Submission, MapMarker, Enquiry, Surveyor, TreeProfile, Language 
} from '../types';
import { 
  initialSiteStats, initialSubmissions, initialMapMarkers, 
  initialEnquiries, initialSurveyors, initialTrees 
} from '../data/initialData';

const STORAGE_KEYS = {
  STATS: 'kanvana_site_stats_v2',
  SUBMISSIONS: 'kanvana_submissions_v2',
  MARKERS: 'kanvana_map_markers_v2',
  ENQUIRIES: 'kanvana_enquiries_v2',
  SURVEYORS: 'kanvana_surveyors_v2',
  TREES: 'kanvana_trees_v2',
  LANG: 'kanvana_language_v1',
  WEBHOOK: 'kanvana_google_webhook_v1',
  FOUNDER_PHOTO: 'kanvana_founder_photo_v1',
  STORY_IMAGES: 'kanvana_story_images_v1'
};

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
  private language: Language = loadStorage(STORAGE_KEYS.LANG, 'en');
  private storyImages: string[] = loadStorage(STORAGE_KEYS.STORY_IMAGES, defaultStoryImages);
  private webhookUrl: string = loadStorage(STORAGE_KEYS.WEBHOOK, '');
  private founderPhoto: string = loadStorage(
    STORAGE_KEYS.FOUNDER_PHOTO, 
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
  );

  private listeners: Set<Listener> = new Set();

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
    const clean = treeId.toUpperCase().trim();
    return !this.trees.some(t => t.treeId.toUpperCase().trim() === clean);
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

  async triggerGoogleDriveWebhook(type: 'submission' | 'enquiry' | 'surveyor', data: any) {
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
  getLanguage(): Language { return this.language; }

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
    this.notify();
    this.triggerGoogleDriveWebhook('enquiry', newEnq);
    return newEnq;
  }

  updateEnquiryStatus(id: string, status: Enquiry['status']) {
    this.enquiries = this.enquiries.map(e => e.id === id ? { ...e, status } : e);
    saveStorage(STORAGE_KEYS.ENQUIRIES, this.enquiries);
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

    // Update Surveyor activity stats
    if (subData.surveyorId || subData.surveyorName) {
      this.surveyors = this.surveyors.map(s => {
        if (s.id === subData.surveyorId || s.name === subData.surveyorName || s.email === subData.surveyorId) {
          return {
            ...s,
            totalSubmissions: (s.totalSubmissions || 0) + 1,
            lastActive: 'Just now'
          };
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

    this.submissions = this.submissions.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'approved' as const,
          publishedAt: new Date().toISOString()
        };
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);

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

    // Auto-generate Tree Profile if trees planted > 0
    if (target.treesCount > 0) {
      const treeId = this.generateNextTreeId();
      const newTree: TreeProfile = {
        treeId,
        submissionId: id,
        species: target.treeSpecies || 'Neem / Local Shade Species',
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
            note: 'Planted during Kanvana field activity drive.'
          }
        ],
        qrCodeUrl: `https://kanvana.vercel.app/tree/${treeId}`
      };
      this.trees = [newTree, ...this.trees];
      saveStorage(STORAGE_KEYS.TREES, this.trees);
    }

    this.notify();
  }

  unpublishSubmission(id: string) {
    const target = this.submissions.find(s => s.id === id);
    if (!target) return;

    const isApproved = target.status === 'approved';

    this.submissions = this.submissions.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'pending' as const,
          publishedAt: undefined
        };
      }
      return s;
    });

    // Remove associated map markers
    this.mapMarkers = this.mapMarkers.filter(m => m.submissionId !== id);
    saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);

    // Revert tree stats if previously approved
    if (isApproved && target.treesCount > 0) {
      this.updateStats({
        treesPlanted: Math.max(0, this.stats.treesPlanted - target.treesCount)
      });
    }

    // Remove tree profiles created for this submission
    this.trees = this.trees.filter(t => t.submissionId !== id);
    saveStorage(STORAGE_KEYS.TREES, this.trees);

    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
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

    this.submissions = this.submissions.filter(s => s.id !== id);
    this.mapMarkers = this.mapMarkers.filter(m => m.submissionId !== id);
    this.trees = this.trees.filter(t => t.submissionId !== id);

    saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);
    saveStorage(STORAGE_KEYS.TREES, this.trees);
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.notify();
    this.triggerGoogleDriveWebhook('submission', { event: 'SUBMISSION_DELETED', id });
  }

  rejectSubmission(id: string, rejectionNote: string) {
    this.submissions = this.submissions.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'rejected' as const,
          rejectionNote
        };
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
    this.notify();
  }

  toggleFeaturedSubmission(id: string) {
    this.submissions = this.submissions.map(s => {
      if (s.id === id) {
        return { ...s, featured: !s.featured };
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SUBMISSIONS, this.submissions);
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
    this.notify();
    return newMarker;
  }

  deleteMapMarker(id: string) {
    this.mapMarkers = this.mapMarkers.filter(m => m.id !== id);
    saveStorage(STORAGE_KEYS.MARKERS, this.mapMarkers);
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
    this.notify();
    this.triggerGoogleDriveWebhook('surveyor', newSurv);
    return newSurv;
  }

  toggleSurveyorActive(id: string) {
    this.surveyors = this.surveyors.map(s => {
      if (s.id === id) {
        return { ...s, active: !s.active };
      }
      return s;
    });
    saveStorage(STORAGE_KEYS.SURVEYORS, this.surveyors);
    this.notify();
  }

  addTreeGrowthEntry(treeId: string, entry: { date: string; photo: string; note: string }) {
    this.trees = this.trees.map(t => {
      if (t.treeId === treeId) {
        return {
          ...t,
          growthLog: [entry, ...t.growthLog]
        };
      }
      return t;
    });
    saveStorage(STORAGE_KEYS.TREES, this.trees);
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
