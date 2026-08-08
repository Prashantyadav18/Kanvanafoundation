import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, XCircle, Star, Download, Plus, 
  Trash2, MapPin, Users, TreePine, FileText, Tag, 
  BarChart2, Lock, Eye, Share2, Sparkles, AlertCircle, RefreshCw, User, Camera, Database,
  ExternalLink, Image, ArrowLeft, RotateCcw, Phone, Award, Globe
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { store, defaultStoryImages } from '../../services/store';
import { Presentation } from 'lucide-react';
import { Submission, Enquiry, MapMarker, Surveyor, District } from '../../types';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  onOpenCertificate: (sub: Submission) => void;
  onSelectTree: (treeId: string) => void;
  onOpenPitchDeck?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenCertificate,
  onSelectTree,
  onOpenPitchDeck
}) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    return store.subscribe(() => setTick(t => t + 1));
  }, []);

  // Auth state
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin Active Tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'submissions' | 'enquiries' | 'map' | 'surveyors' | 'stats' | 'cert' | 'qr' | 'story' | 'settings'
  >('overview');

  // Tree Story Images State
  const [storyImagesInput, setStoryImagesInput] = useState<string[]>(store.getStoryImages());
  const [storySavedMsg, setStorySavedMsg] = useState(false);

  // Webhook URL state
  const [webhookInput, setWebhookInput] = useState(store.getWebhookUrl());
  const [webhookSavedMsg, setWebhookSavedMsg] = useState(false);

  // Local state bound to store
  const stats = store.getStats();
  const submissions = store.getSubmissions();
  const enquiries = store.getEnquiries();
  const mapMarkers = store.getMapMarkers();
  const surveyors = store.getSurveyors();
  const trees = store.getTrees();
  const certificates = store.getIssuedCertificates();

  // Filters for Submissions
  const [subStatusFilter, setSubStatusFilter] = useState<string>('All');
  const [selectedSubForDetail, setSelectedSubForDetail] = useState<Submission | null>(null);

  // New Surveyor Form State
  const [newSurvName, setNewSurvName] = useState('');
  const [newSurvEmail, setNewSurvEmail] = useState('');
  const [newSurvPass, setNewSurvPass] = useState('kanvana@2026');
  const [newSurvPhone, setNewSurvPhone] = useState('');
  const [newSurvDistrict, setNewSurvDistrict] = useState('Kanpur Nagar');
  const [createdSurvCard, setCreatedSurvCard] = useState<Surveyor | null>(null);

  // Site Stats Form State
  const [editTrees, setEditTrees] = useState(stats.treesPlanted);
  const [editVolunteers, setEditVolunteers] = useState(stats.volunteersActive);
  const [editDistricts, setEditDistricts] = useState(stats.districtsReached);
  const [editBirds, setEditBirds] = useState(stats.birdsServed);
  const [statsSavedMsg, setStatsSavedMsg] = useState(false);

  // Admin Certificate Form State
  const [certAdminName, setCertAdminName] = useState('');
  const [certAdminTrees, setCertAdminTrees] = useState(25);
  const [certAdminLoc, setCertAdminLoc] = useState('Nankari, IIT Kanpur');
  const [certAdminDate, setCertAdminDate] = useState(new Date().toISOString().split('T')[0]);

  // New Map Marker Form
  const [newMarkerTitle, setNewMarkerTitle] = useState('');
  const [newMarkerType, setNewMarkerType] = useState<MapMarker['type']>('Plantation');
  const [newMarkerLat, setNewMarkerLat] = useState(26.5188);
  const [newMarkerLng, setNewMarkerLng] = useState(80.2329);
  const [newMarkerTrees, setNewMarkerTrees] = useState(50);
  const [newMarkerLoc, setNewMarkerLoc] = useState('Nankari, IIT Kanpur');

  // Manual Tree Registration State
  const [treeRegId, setTreeRegId] = useState('');
  const [treeRegSpecies, setTreeRegSpecies] = useState('Neem (Azadirachta indica)');
  const [treeRegPlantedBy, setTreeRegPlantedBy] = useState('Volunteer (Field Site)');
  const [treeRegLocation, setTreeRegLocation] = useState('Nankari, IIT Kanpur');
  const [treeRegDistrict, setTreeRegDistrict] = useState<District>('Kanpur Nagar');
  const [treeRegStatusMsg, setTreeRegStatusMsg] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  const handleRegisterTree = (e: React.FormEvent) => {
    e.preventDefault();
    setTreeRegStatusMsg(null);
    const targetId = treeRegId.trim().toUpperCase() || store.generateNextTreeId();

    if (!store.isTreeIdUnique(targetId)) {
      setTreeRegStatusMsg({
        type: 'error',
        msg: `⚠️ RESTRICTION BLOCKED: Tree ID "${targetId}" already exists! Duplicate Tree IDs are strictly prohibited.`
      });
      return;
    }

    const res = store.addCustomTree({
      treeId: targetId,
      submissionId: `admin-reg-${Date.now()}`,
      species: treeRegSpecies,
      plantedBy: treeRegPlantedBy,
      plantedDate: new Date().toISOString().split('T')[0],
      locationName: treeRegLocation,
      district: treeRegDistrict,
      gps: { lat: 26.5188, lng: 80.2329 },
      photos: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'],
      growthLog: [
        {
          date: new Date().toISOString().split('T')[0],
          photo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
          note: 'Registered in Kanvana Central Unique Tree ID Database.'
        }
      ]
    });

    if (res.success) {
      setTreeRegStatusMsg({
        type: 'success',
        msg: `✅ SUCCESS: Unique Tree ID "${targetId}" registered and synced to Google Drive database!`
      });
      setTreeRegId('');
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } else {
      setTreeRegStatusMsg({
        type: 'error',
        msg: res.message || 'Failed to register Tree ID.'
      });
    }
  };

  const handleExportTreeCSV = () => {
    const csvContent = store.exportTreeDatabaseCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Kanvana_Unique_Tree_IDs_Database_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass.trim() === 'kanvana@admin2026') {
      setIsAdminAuth(true);
      setAuthError('');
    } else {
      setAuthError('Access denied! Incorrect Admin Security Password.');
    }
  };

  const handleApprove = (subId: string) => {
    store.approveSubmission(subId);
    if (selectedSubForDetail?.id === subId) {
      setSelectedSubForDetail(store.getSubmissions().find(s => s.id === subId) || null);
    }
    confetti({
      particleCount: 50,
      colors: ['#4CAF50', '#86EFAC', '#F4C430']
    });
  };

  const handleReject = (subId: string) => {
    const reason = prompt('Enter rejection reason for field record:') || 'Requires field re-verification';
    store.rejectSubmission(subId, reason);
    if (selectedSubForDetail?.id === subId) {
      setSelectedSubForDetail(store.getSubmissions().find(s => s.id === subId) || null);
    }
  };

  const handleUnpublish = (subId: string) => {
    if (confirm('Are you sure you want to unpublish this submission? It will be removed from the live website & map, and reverted to pending status.')) {
      store.unpublishSubmission(subId);
      if (selectedSubForDetail?.id === subId) {
        setSelectedSubForDetail(store.getSubmissions().find(s => s.id === subId) || null);
      }
    }
  };

  const handleDeleteSubmission = (subId: string) => {
    if (confirm('⚠️ PERMANENT DELETE: Are you sure you want to permanently delete this field submission record? This action cannot be undone.')) {
      store.deleteSubmission(subId);
      if (selectedSubForDetail?.id === subId) {
        setSelectedSubForDetail(null);
      }
    }
  };

  const [testWebhookStatus, setTestWebhookStatus] = useState<string | null>(null);
  const [selectedInspectionPhotoIndex, setSelectedInspectionPhotoIndex] = useState<number>(0);

  const handleTestWebhook = async () => {
    setTestWebhookStatus('Testing connection to Google Drive / Sheets...');
    const url = store.getWebhookUrl();
    if (!url) {
      setTestWebhookStatus('❌ Error: No Google Drive Webhook URL saved yet. Please enter your Google Apps Script URL below.');
      return;
    }
    try {
      await store.triggerGoogleDriveWebhook('submission', {
        event: 'TEST_DRIVE_SYNC',
        volunteerName: 'Test Field Volunteer',
        volunteerPhone: '+91 98765 43210',
        locationName: 'Nankari, IIT Kanpur',
        treesCount: 10,
        photoUrls: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'],
        notes: 'Test ping from Kanvana Admin Dashboard'
      });
      setTestWebhookStatus('✅ SUCCESS: Test payload sent to Google Drive / Sheets script! Check your Google Sheet for the test entry.');
    } catch (err: any) {
      setTestWebhookStatus(`❌ Error sending webhook: ${err?.message || 'Check network / URL'}`);
    }
  };

  const handleSyncAllToDrive = async () => {
    setTestWebhookStatus('Syncing all stored submissions & surveyors to Google Drive...');
    const subs = store.getSubmissions();
    const surs = store.getSurveyors();
    if (subs.length === 0 && surs.length === 0) {
      setTestWebhookStatus('No submissions or surveyors found to sync.');
      return;
    }
    for (const s of subs) {
      await store.triggerGoogleDriveWebhook('submission', s);
    }
    for (const surv of surs) {
      await store.triggerGoogleDriveWebhook('surveyor', surv);
    }
    setTestWebhookStatus(`✅ SUCCESS: Batch-synced ${subs.length} submissions and ${surs.length} surveyors to Google Drive!`);
  };

  const handleCreateSurveyor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurvName || !newSurvEmail) return;

    const surv = store.addSurveyor({
      name: newSurvName,
      email: newSurvEmail,
      phone: newSurvPhone || '+91 98765 00000',
      district: newSurvDistrict,
      password: newSurvPass || 'kanvana@2026',
      active: true
    });

    setCreatedSurvCard(surv);
    setNewSurvName('');
    setNewSurvEmail('');
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateStats({
      treesPlanted: Number(editTrees),
      volunteersActive: Number(editVolunteers),
      districtsReached: Number(editDistricts),
      birdsServed: Number(editBirds)
    });
    setStatsSavedMsg(true);
    setTimeout(() => setStatsSavedMsg(false), 2500);
  };

  const handleSaveStoryImages = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateAllStoryImages(storyImagesInput);
    setStorySavedMsg(true);
    setTimeout(() => setStorySavedMsg(false), 2500);
  };

  const handleResetStoryImages = () => {
    if (window.confirm('Reset Tree Story animation photos to default HD images?')) {
      store.updateAllStoryImages(defaultStoryImages);
      setStoryImagesInput(defaultStoryImages);
      setStorySavedMsg(true);
      setTimeout(() => setStorySavedMsg(false), 2500);
    }
  };

  const handleAddMapMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarkerTitle) return;

    store.addMapMarker({
      lat: Number(newMarkerLat),
      lng: Number(newMarkerLng),
      title: newMarkerTitle,
      type: newMarkerType,
      treesCount: Number(newMarkerTrees),
      photos: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'],
      active: true,
      locationName: newMarkerLoc
    });

    setNewMarkerTitle('');
    alert('New map marker added and published to main website map!');
  };

  const handleDownloadInitialData = () => {
    const code = store.exportInitialDataTsCode();
    const blob = new Blob([code], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'initialData.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportEnquiriesCSV = () => {
    const headers = 'ID,Name,Email,Phone,City,Intent,Source,Status,Timestamp,Message\n';
    const rows = enquiries.map(e => 
      `"${e.id}","${e.name}","${e.email}","${e.phone}","${e.city}","${e.intent}","${e.source}","${e.status}","${e.timestamp}","${e.message.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanvana_enquiries_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Recharts sample data
  const chartData = [
    { week: 'W1 Jul', surveys: 4, trees: 50 },
    { week: 'W2 Jul', surveys: 8, trees: 100 },
    { week: 'W3 Jul', surveys: 12, trees: 150 },
    { week: 'W4 Jul', surveys: 15, trees: 200 },
    { week: 'W1 Aug', surveys: 18, trees: 250 }
  ];

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-[#0D2818] text-[#F9FBF7] flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md bg-[#1B5E34]/30 rounded-3xl border-2 border-[#1B5E34] p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#F4C430] p-3 text-[#0D2818] mx-auto flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#F9FBF7] tracking-tight">
              ADMIN CONTROL PANEL
            </h2>
            <p className="text-xs text-[#86EFAC]">
              Kanvana Foundation Management Operations
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-900/50 border border-red-500 text-red-200 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                Admin Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#6B7F6E]" />
                <input
                  type="password"
                  required
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#FFF5C0] transition-all shadow-lg"
            >
              Access Admin Operations
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingList = submissions.filter(s => s.status === 'pending');
  const filteredSubmissions = submissions.filter(s => subStatusFilter === 'All' || s.status === subStatusFilter);

  return (
    <div className="min-h-screen bg-[#0D2818] text-[#F9FBF7] pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Admin Top Header */}
      <div className="bg-[#1B5E34]/40 border-2 border-[#1B5E34] p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative shrink-0">
            <img 
              src={store.getFounderPhoto()} 
              alt="Prashant Yadav (Founder & Admin)" 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#F4C430] shadow-md"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4CAF50] border-2 border-[#0D2818] rounded-full ring-2 ring-[#F4C430]" title="Active Admin Session"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#F4C430]" />
              <h1 className="font-display font-extrabold text-2xl text-[#F9FBF7]">
                ADMIN OPERATIONS DASHBOARD
              </h1>
            </div>
            <p className="text-xs text-[#86EFAC] mt-1">
              Logged in as Prashant Yadav (Founder & Admin) • Nankari, IIT Kanpur
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {onOpenPitchDeck && (
            <button
              onClick={onOpenPitchDeck}
              className="px-4 py-2 rounded-xl bg-[#F4C430] text-[#0D2818] font-black border border-[#FFE066] text-xs uppercase hover:bg-[#FFE066] transition-all flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Presentation className="w-4 h-4 text-[#0D2818]" />
              <span>📊 Launch Client PPT Deck</span>
            </button>
          )}

          <button
            onClick={() => setIsAdminAuth(false)}
            className="px-4 py-2 rounded-xl bg-[#0D2818] hover:bg-red-900/40 text-red-300 border border-red-500 text-xs font-bold uppercase transition-colors"
          >
            Logout Admin
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#1B5E34]/30 p-2 rounded-2xl border border-[#1B5E34]">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart2 className="w-3.5 h-3.5" /> },
          { id: 'submissions', label: `Submissions (${pendingList.length} Pending)`, icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'enquiries', label: `Enquiries (${enquiries.length})`, icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'map', label: 'Map Markers', icon: <MapPin className="w-3.5 h-3.5" /> },
          { id: 'surveyors', label: 'Surveyors', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'stats', label: 'Homepage Stats', icon: <TreePine className="w-3.5 h-3.5" /> },
          { id: 'cert', label: '📜 e-Certificates', icon: <Award className="w-3.5 h-3.5" /> },
          { id: 'qr', label: `Unique Tree ID Registry (${trees.length})`, icon: <Tag className="w-3.5 h-3.5" /> },
          { id: 'story', label: '✨ Tree Story Photos', icon: <Sparkles className="w-3.5 h-3.5" /> },
          { id: 'settings', label: '📁 Google Drive & Database', icon: <Lock className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? 'bg-[#F4C430] text-[#0D2818] shadow-md'
                : 'text-[#F9FBF7]/80 hover:bg-[#1B5E34]/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1B5E34]/30 p-6 rounded-3xl border border-[#1B5E34] space-y-1">
              <span className="text-xs text-[#86EFAC] font-semibold uppercase">Pending Approvals</span>
              <span className="font-display font-extrabold text-3xl text-[#F4C430] block">
                {pendingList.length}
              </span>
              <p className="text-[11px] text-[#6B7F6E]">Awaiting 1-click publish</p>
            </div>

            <div className="bg-[#1B5E34]/30 p-6 rounded-3xl border border-[#1B5E34] space-y-1">
              <span className="text-xs text-[#86EFAC] font-semibold uppercase">Total Trees Planted</span>
              <span className="font-display font-extrabold text-3xl text-[#4CAF50] block">
                {stats.treesPlanted}
              </span>
              <p className="text-[11px] text-[#6B7F6E]">Live homepage counter</p>
            </div>

            <div className="bg-[#1B5E34]/30 p-6 rounded-3xl border border-[#1B5E34] space-y-1">
              <span className="text-xs text-[#86EFAC] font-semibold uppercase">Total Enquiries</span>
              <span className="font-display font-extrabold text-3xl text-[#F9FBF7] block">
                {enquiries.length}
              </span>
              <p className="text-[11px] text-[#6B7F6E]">Volunteer & donor requests</p>
            </div>

            <div className="bg-[#1B5E34]/30 p-6 rounded-3xl border border-[#1B5E34] space-y-1">
              <span className="text-xs text-[#86EFAC] font-semibold uppercase">Active Surveyors</span>
              <span className="font-display font-extrabold text-3xl text-[#86EFAC] block">
                {surveyors.filter(s => s.active).length}
              </span>
              <p className="text-[11px] text-[#6B7F6E]">Field team staff</p>
            </div>
          </div>

          {/* Recharts Bar Chart */}
          <div className="bg-[#1B5E34]/30 p-6 sm:p-8 rounded-3xl border border-[#1B5E34] space-y-4">
            <h3 className="font-display font-bold text-lg text-[#F9FBF7]">
              Field Activity Progression (Surveys & Trees Planted)
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1B5E34" />
                  <XAxis dataKey="week" stroke="#86EFAC" fontSize={12} />
                  <YAxis stroke="#86EFAC" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D2818', borderColor: '#1B5E34', color: '#F9FBF7' }} />
                  <Bar dataKey="trees" fill="#4CAF50" radius={[6, 6, 0, 0]} name="Trees Planted" />
                  <Bar dataKey="surveys" fill="#F4C430" radius={[6, 6, 0, 0]} name="Surveys Logged" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Pending Submissions */}
          <div className="bg-[#1B5E34]/30 p-6 rounded-3xl border border-[#1B5E34] space-y-4">
            <h3 className="font-display font-bold text-lg text-[#F9FBF7]">
              Pending Field Submissions Requiring Approval ({pendingList.length})
            </h3>

            {pendingList.length === 0 ? (
              <p className="text-xs text-[#86EFAC]">All field submissions are approved and published!</p>
            ) : (
              <div className="space-y-3">
                {pendingList.map((sub) => (
                  <div key={sub.id} className="bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      {sub.photoUrls && sub.photoUrls.length > 0 ? (
                        <img 
                          src={sub.photoUrls[0]} 
                          alt="Field Preview" 
                          className="w-14 h-14 rounded-xl object-cover border border-[#1B5E34] shrink-0" 
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#1B5E34]/50 flex items-center justify-center text-[#6B7F6E] shrink-0">
                          <Image className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <span className="font-display font-bold text-sm text-[#F9FBF7] block">
                          {sub.volunteerName} ({sub.volunteerVillage}, {sub.district})
                        </span>
                        <span className="text-xs text-[#86EFAC] block">
                          {sub.activityType} • {sub.treesCount} Trees • Logged by {sub.surveyorName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSelectedSubForDetail(sub);
                          setSelectedInspectionPhotoIndex(0);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#1B5E34] text-[#F9FBF7] font-bold text-xs hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>🔍 View Details & Photos</span>
                      </button>

                      <button
                        onClick={() => handleApprove(sub.id)}
                        className="px-3.5 py-2 rounded-xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase hover:bg-[#86EFAC]"
                      >
                        ✅ Approve & Publish
                      </button>
                      <button
                        onClick={() => handleReject(sub.id)}
                        className="px-3.5 py-2 rounded-xl bg-red-900/40 text-red-300 border border-red-500 font-bold text-xs uppercase hover:bg-red-900"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUBMISSIONS MANAGEMENT */}
      {activeTab === 'submissions' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34]">
            <h3 className="font-display font-bold text-base text-[#F9FBF7]">
              Field Submissions Directory ({submissions.length})
            </h3>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#86EFAC]">Status Filter:</span>
              <select
                value={subStatusFilter}
                onChange={(e) => setSubStatusFilter(e.target.value)}
                className="bg-[#0D2818] text-[#F9FBF7] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#1B5E34]"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSubmissions.map((sub) => (
              <div key={sub.id} className="bg-[#1B5E34]/30 p-6 rounded-3xl border border-[#1B5E34] space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      sub.status === 'approved' ? 'bg-[#4CAF50]/20 text-[#86EFAC] border border-[#4CAF50]' :
                      sub.status === 'rejected' ? 'bg-red-900/40 text-red-300 border border-red-500' :
                      'bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]'
                    }`}>
                      {sub.status === 'approved' ? '✓ APPROVED & PUBLISHED' : sub.status.toUpperCase()}
                    </span>

                    <button
                      onClick={() => store.toggleFeaturedSubmission(sub.id)}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                        sub.featured ? 'bg-[#F4C430] text-[#0D2818]' : 'bg-[#0D2818] text-[#6B7F6E] border border-[#1B5E34]'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{sub.featured ? 'Featured' : 'Make Featured'}</span>
                    </button>
                  </div>

                  {/* Photo Thumbnails Gallery */}
                  {sub.photoUrls && sub.photoUrls.length > 0 ? (
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {sub.photoUrls.map((p, pIdx) => (
                        <img 
                          key={pIdx} 
                          src={p} 
                          alt={`Field photo ${pIdx + 1}`} 
                          className="w-20 h-16 rounded-xl object-cover border border-[#1B5E34] shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            setSelectedSubForDetail(sub);
                            setSelectedInspectionPhotoIndex(pIdx);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#0D2818] border border-[#1B5E34] text-[11px] text-[#6B7F6E] flex items-center space-x-2">
                      <Image className="w-4 h-4" />
                      <span>No photos attached for this log</span>
                    </div>
                  )}

                  <h4 className="font-display font-bold text-lg text-[#F9FBF7]">
                    {sub.volunteerName} ({sub.volunteerVillage})
                  </h4>
                  <p className="text-xs text-[#86EFAC]">
                    📍 {sub.locationName || sub.volunteerVillage} ({sub.district}) • {sub.treesCount} Trees ({sub.treeSpecies || 'Neem/Native'})
                  </p>
                  <p className="text-xs text-[#F9FBF7]/80 line-clamp-2 bg-[#0D2818] p-3 rounded-xl border border-[#1B5E34]">
                    {sub.notes || 'No surveyor field notes entered.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1B5E34] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#6B7F6E]">
                    <span>Surveyor: {sub.surveyorName}</span>
                    <span>Date: {sub.activityDate}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedSubForDetail(sub);
                        setSelectedInspectionPhotoIndex(0);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#FFF5C0] transition-colors shadow-md"
                    >
                      <Eye className="w-4 h-4" />
                      <span>🔍 Inspect Full Details & High-Res Photos</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {sub.status !== 'approved' ? (
                        <button
                          onClick={() => handleApprove(sub.id)}
                          className="py-2 rounded-xl bg-[#4CAF50] text-[#0D2818] font-bold text-[10px] uppercase"
                        >
                          ✅ Approve & Publish
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnpublish(sub.id)}
                          className="py-2 rounded-xl bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430] font-bold text-[10px] uppercase hover:bg-[#F4C430] hover:text-[#0D2818]"
                        >
                          ↩️ Unpublish / Revert
                        </button>
                      )}

                      {sub.status !== 'rejected' ? (
                        <button
                          onClick={() => handleReject(sub.id)}
                          className="py-2 rounded-xl bg-red-900/40 text-red-200 border border-red-500 font-bold text-[10px] uppercase"
                        >
                          ❌ Reject
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDeleteSubmission(sub.id)}
                          className="py-2 rounded-xl bg-red-900/60 text-red-200 border border-red-500 font-bold text-[10px] uppercase"
                        >
                          🗑️ Delete Record
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenCertificate(sub)}
                      className="w-full py-2 rounded-xl bg-[#1B5E34] text-[#86EFAC] font-bold text-[10px] uppercase border border-[#4CAF50]/30 hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors"
                    >
                      📜 Generate Volunteer Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENQUIRY MANAGEMENT */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34]">
            <h3 className="font-display font-bold text-base text-[#F9FBF7]">
              Website Enquiries & Leads ({enquiries.length})
            </h3>

            <button
              onClick={handleExportEnquiriesCSV}
              className="px-4 py-2 rounded-xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div key={enq.id} className="bg-[#1B5E34]/30 p-6 rounded-3xl border border-[#1B5E34] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-display font-bold text-base text-[#F9FBF7]">{enq.name}</h4>
                    <p className="text-xs text-[#86EFAC]">
                      📞 {enq.phone} • 📧 {enq.email} • 📍 {enq.city}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-[#F4C430] bg-[#0D2818] px-2.5 py-1 rounded-full border border-[#1B5E34]">
                      {enq.intent}
                    </span>

                    <select
                      value={enq.status}
                      onChange={(e) => store.updateEnquiryStatus(enq.id, e.target.value as any)}
                      className="bg-[#0D2818] text-[#86EFAC] text-xs font-semibold px-2.5 py-1 rounded-xl border border-[#1B5E34]"
                    >
                      <option value="new">NEW</option>
                      <option value="contacted">CONTACTED</option>
                      <option value="converted">CONVERTED</option>
                      <option value="closed">CLOSED</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-[#F9FBF7]/80 bg-[#0D2818] p-3 rounded-xl border border-[#1B5E34]">
                  {enq.message}
                </p>

                <p className="text-[10px] text-[#6B7F6E]">
                  Logged on: {new Date(enq.timestamp).toLocaleString()} • Source: {enq.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MAP MARKERS */}
      {activeTab === 'map' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Add New Marker Form */}
          <form onSubmit={handleAddMapMarker} className="bg-[#1B5E34]/30 p-6 sm:p-8 rounded-3xl border border-[#1B5E34] space-y-4">
            <h3 className="font-display font-bold text-base text-[#F9FBF7]">
              ➕ Add New GIS Map Marker
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Marker Title *
                </label>
                <input
                  type="text"
                  required
                  value={newMarkerTitle}
                  onChange={(e) => setNewMarkerTitle(e.target.value)}
                  placeholder="e.g. Unnao Railway Division Plantation"
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Marker Type
                </label>
                <select
                  value={newMarkerType}
                  onChange={(e) => setNewMarkerType(e.target.value as any)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                >
                  <option value="Plantation">Plantation</option>
                  <option value="Bird Water Station">Bird Water Station</option>
                  <option value="Event">Event</option>
                  <option value="HQ">HQ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={newMarkerLat}
                  onChange={(e) => setNewMarkerLat(Number(e.target.value))}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={newMarkerLng}
                  onChange={(e) => setNewMarkerLng(Number(e.target.value))}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Trees Count
                </label>
                <input
                  type="number"
                  value={newMarkerTrees}
                  onChange={(e) => setNewMarkerTrees(Number(e.target.value))}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase"
            >
              Add Marker to Live Map
            </button>
          </form>

          {/* Existing Markers List */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base text-[#F9FBF7]">
              Current Active Map Markers ({mapMarkers.length})
            </h3>

            {mapMarkers.map((m) => (
              <div key={m.id} className="bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34] flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-sm text-[#F9FBF7] block">
                    {m.title} ({m.type})
                  </span>
                  <span className="text-xs text-[#86EFAC]">
                    📍 {m.locationName} • Lat: {m.lat}, Lng: {m.lng} • {m.treesCount} Trees
                  </span>
                </div>

                <button
                  onClick={() => store.deleteMapMarker(m.id)}
                  className="p-2 rounded-xl bg-red-900/40 hover:bg-red-900 text-red-200 text-xs border border-red-500"
                  title="Delete Marker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SURVEYORS MANAGEMENT */}
      {activeTab === 'surveyors' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Create New Surveyor Form */}
          <form onSubmit={handleCreateSurveyor} className="bg-[#1B5E34]/30 p-6 sm:p-8 rounded-3xl border border-[#1B5E34] space-y-4">
            <h3 className="font-display font-bold text-base text-[#F9FBF7]">
              👤 Create New Field Surveyor Account
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSurvName}
                  onChange={(e) => setNewSurvName(e.target.value)}
                  placeholder="e.g. Vikas Yadav"
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Login Email *
                </label>
                <input
                  type="email"
                  required
                  value={newSurvEmail}
                  onChange={(e) => setNewSurvEmail(e.target.value)}
                  placeholder="e.g. vikas.surveyor@kanvana.com"
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Temporary Password *
                </label>
                <input
                  type="text"
                  required
                  value={newSurvPass}
                  onChange={(e) => setNewSurvPass(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Assigned District
                </label>
                <input
                  type="text"
                  value={newSurvDistrict}
                  onChange={(e) => setNewSurvDistrict(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase"
            >
              Create Surveyor Account
            </button>
          </form>

          {/* Generated Credentials Card */}
          {createdSurvCard && (
            <div className="p-6 rounded-3xl bg-[#0D2818] border-2 border-[#F4C430] space-y-3">
              <h4 className="font-display font-bold text-sm text-[#F4C430] uppercase">
                SURVEYOR LOGIN CREDENTIALS GENERATED
              </h4>
              <p className="text-xs text-[#86EFAC]">
                Name: {createdSurvCard.name} <br />
                Email: {createdSurvCard.email} <br />
                Password: {newSurvPass} <br />
                App URL: survey.kanvana.vercel.app
              </p>

              <a
                href={`https://wa.me/?text=Hello%20${encodeURIComponent(createdSurvCard.name)}%2C%20your%20Kanvana%20Surveyor%20login%20credentials%3A%0AEmail%3A%20${encodeURIComponent(createdSurvCard.email)}%0APassword%3A%20${encodeURIComponent(newSurvPass)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Credentials via WhatsApp</span>
              </a>
            </div>
          )}

          {/* Existing Surveyors Table */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-base text-[#F9FBF7]">
              Active Kanvana Field Staff ({surveyors.length})
            </h3>

            {surveyors.map((s) => (
              <div key={s.id} className="bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34] flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-sm text-[#F9FBF7] block">{s.name}</span>
                  <span className="text-xs text-[#86EFAC]">
                    📧 {s.email} • 📍 District: {s.district}
                  </span>
                </div>

                <button
                  onClick={() => store.toggleSurveyorActive(s.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    s.active ? 'bg-[#4CAF50] text-[#0D2818]' : 'bg-red-900 text-red-200'
                  }`}
                >
                  {s.active ? 'Active' : 'Deactivated'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: HOMEPAGE SITE STATS EDITOR */}
      {activeTab === 'stats' && (
        <form onSubmit={handleSaveStats} className="bg-[#1B5E34]/30 p-8 rounded-3xl border border-[#1B5E34] space-y-6 max-w-2xl mx-auto animate-fadeIn">
          <h3 className="font-display font-bold text-lg text-[#F9FBF7]">
            ⚙️ Edit Live Homepage Impact Counters
          </h3>

          {statsSavedMsg && (
            <div className="p-3 rounded-xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs">
              ✅ Homepage stats updated live in real-time!
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                Trees Planted
              </label>
              <input
                type="number"
                value={editTrees}
                onChange={(e) => setEditTrees(Number(e.target.value))}
                className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-sm text-[#F9FBF7]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                Active Volunteers
              </label>
              <input
                type="number"
                value={editVolunteers}
                onChange={(e) => setEditVolunteers(Number(e.target.value))}
                className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-sm text-[#F9FBF7]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                Districts Reached
              </label>
              <input
                type="number"
                value={editDistricts}
                onChange={(e) => setEditDistricts(Number(e.target.value))}
                className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-sm text-[#F9FBF7]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                Birds Served (Water)
              </label>
              <input
                type="number"
                value={editBirds}
                onChange={(e) => setEditBirds(Number(e.target.value))}
                className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-sm text-[#F9FBF7]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider shadow-lg"
          >
            Save & Update Live Homepage
          </button>
        </form>
      )}

      {/* TAB: E-CERTIFICATES CONTROL & ISSUANCE */}
      {activeTab === 'cert' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-[#1B5E34]/30 p-8 rounded-3xl border border-[#1B5E34] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#F4C430]">
                <Award className="w-6 h-6 text-[#F4C430]" />
                <h3 className="font-display font-extrabold text-xl text-[#F9FBF7]">
                  📜 Issued Certificates Registry & Control Panel
                </h3>
              </div>
              <p className="text-xs text-[#86EFAC] max-w-2xl">
                Every certificate issued (publicly or by admin) is recorded here with Reg No. Export clean data directly to CSV for Google Sheets.
              </p>
            </div>

            <button
              onClick={() => store.exportCertificatesCSV()}
              className="px-5 py-3 rounded-2xl bg-[#F4C430] text-[#0D2818] font-extrabold text-xs uppercase tracking-wider hover:bg-[#86EFAC] transition-all flex items-center space-x-2 shadow-xl shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#0D2818]" />
              <span>Export Certificates CSV (Google Sheets)</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1B5E34]/30 p-5 rounded-2xl border border-[#1B5E34] text-center">
              <span className="text-2xl font-black text-[#F4C430] block">{certificates.length}</span>
              <span className="text-xs font-bold text-[#86EFAC] uppercase">Total Certificates Issued</span>
            </div>
            <div className="bg-[#1B5E34]/30 p-5 rounded-2xl border border-[#1B5E34] text-center">
              <span className="text-2xl font-black text-[#86EFAC] block">
                {certificates.reduce((acc, c) => acc + (c.treesPlanted || 0), 0)}
              </span>
              <span className="text-xs font-bold text-[#86EFAC] uppercase">Trees Recognized on Certificates</span>
            </div>
            <div className="bg-[#1B5E34]/30 p-5 rounded-2xl border border-[#1B5E34] text-center">
              <span className="text-2xl font-black text-emerald-300 block">100% Verified</span>
              <span className="text-xs font-bold text-[#86EFAC] uppercase">Reg No. & QR Code Tracking</span>
            </div>
          </div>

          {/* Issue Custom Certificate Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!certAdminName.trim()) {
                alert('Please enter Volunteer or Sponsor Full Name.');
                return;
              }
              const issued = store.issueCertificate({
                recipientName: certAdminName.trim(),
                treesPlanted: certAdminTrees || 25,
                location: certAdminLoc,
                issuedDate: certAdminDate,
                issuedBy: 'Admin'
              });

              onOpenCertificate({
                id: issued.id,
                surveyorId: 'admin',
                surveyorName: 'Prashant Yadav',
                volunteerName: certAdminName.trim(),
                volunteerPhone: '',
                volunteerVillage: certAdminLoc,
                district: 'Kanpur Nagar',
                activityType: 'Tree Plantation',
                treesCount: certAdminTrees || 25,
                activityDate: certAdminDate,
                locationName: certAdminLoc,
                gps: { lat: 26.5188, lng: 80.2329 },
                notes: `Certificate No: ${issued.certificateNo}`,
                photoUrls: [],
                photoCaptions: [],
                consentGiven: true,
                status: 'approved',
                featured: true,
                createdAt: new Date().toISOString()
              });
              confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
            }} 
            className="bg-[#1B5E34]/30 p-6 sm:p-8 rounded-3xl border border-[#1B5E34] space-y-4"
          >
            <h4 className="font-display font-bold text-base text-[#F9FBF7] flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#F4C430]" />
              <span>Issue New Custom e-Certificate</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Volunteer / Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={certAdminName}
                  onChange={(e) => setCertAdminName(e.target.value)}
                  placeholder="e.g. Vaibhav Yadav"
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Trees Planted / Contribution
                </label>
                <input
                  type="number"
                  min="1"
                  value={certAdminTrees}
                  onChange={(e) => setCertAdminTrees(Number(e.target.value))}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Location / Institution Name
                </label>
                <input
                  type="text"
                  value={certAdminLoc}
                  onChange={(e) => setCertAdminLoc(e.target.value)}
                  placeholder="e.g. Nankari, IIT Kanpur"
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={certAdminDate}
                  onChange={(e) => setCertAdminDate(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#F4C430] text-[#0D2818] font-black text-xs uppercase tracking-wider hover:bg-[#86EFAC] transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#0D2818]" />
              <span>Issue, Log in Database & View Certificate</span>
            </button>
          </form>

          {/* ISSUED CERTIFICATES DATABASE TABLE */}
          <div className="bg-[#1B5E34]/30 rounded-3xl border border-[#1B5E34] overflow-hidden space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-base text-[#F9FBF7] flex items-center space-x-2">
                <Database className="w-4 h-4 text-[#F4C430]" />
                <span>Issued Certificates Registry ({certificates.length})</span>
              </h4>

              <button
                onClick={() => store.exportCertificatesCSV()}
                className="text-xs text-[#F4C430] hover:underline font-bold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV for Google Sheets</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#F9FBF7]">
                <thead className="bg-[#0D2818] text-[#86EFAC] font-bold uppercase text-[10px] tracking-wider border-b border-[#1B5E34]">
                  <tr>
                    <th className="py-3 px-4">Certificate No</th>
                    <th className="py-3 px-4">Recipient Name</th>
                    <th className="py-3 px-4">Trees</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Issued By</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1B5E34]/50">
                  {certificates.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                        No certificates issued yet.
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-[#1B5E34]/20 transition-all">
                        <td className="py-3 px-4 font-mono font-bold text-[#F4C430]">
                          {cert.certificateNo}
                        </td>
                        <td className="py-3 px-4 font-bold text-white">
                          {cert.recipientName}
                        </td>
                        <td className="py-3 px-4 text-[#86EFAC] font-bold">
                          🌳 {cert.treesPlanted}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          📍 {cert.location}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {cert.issuedDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            cert.issuedBy === 'Admin' ? 'bg-amber-950/80 text-amber-300 border border-amber-700' : 'bg-emerald-950/80 text-emerald-300 border border-emerald-700'
                          }`}>
                            {cert.issuedBy}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => onOpenCertificate({
                              id: cert.id,
                              surveyorId: 'admin',
                              surveyorName: 'Prashant Yadav',
                              volunteerName: cert.recipientName,
                              volunteerPhone: '',
                              volunteerVillage: cert.location,
                              district: 'Kanpur Nagar',
                              activityType: 'Tree Plantation',
                              treesCount: cert.treesPlanted,
                              activityDate: cert.issuedDate,
                              locationName: cert.location,
                              gps: { lat: 26.5188, lng: 80.2329 },
                              notes: cert.certificateNo,
                              photoUrls: [],
                              photoCaptions: [],
                              consentGiven: true,
                              status: 'approved',
                              featured: true,
                              createdAt: cert.createdAt
                            })}
                            className="px-2.5 py-1 rounded-lg bg-[#F4C430] text-[#0D2818] font-bold text-[10px] hover:bg-[#86EFAC] transition-all cursor-pointer"
                          >
                            View / Print
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete certificate record for ${cert.recipientName}?`)) {
                                store.deleteIssuedCertificate(cert.id);
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-red-950/80 text-red-300 border border-red-800 hover:bg-red-800 hover:text-white transition-all text-[10px] cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rapid Certificate Generation for Existing Approved Submissions */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-base text-[#F9FBF7]">
              Issue Certificate for Field Submissions ({submissions.filter(s => s.status === 'approved').length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submissions.filter(s => s.status === 'approved').slice(0, 10).map((sub) => (
                <div key={sub.id} className="bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34] flex items-center justify-between">
                  <div>
                    <span className="font-display font-bold text-sm text-[#F9FBF7] block">
                      {sub.volunteerName}
                    </span>
                    <span className="text-xs text-[#86EFAC]">
                      🌳 {sub.treesCount} Trees • 📍 {sub.locationName || sub.volunteerVillage}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      store.issueCertificate({
                        recipientName: sub.volunteerName,
                        treesPlanted: sub.treesCount,
                        location: sub.locationName || sub.volunteerVillage,
                        issuedDate: sub.activityDate || new Date().toISOString().split('T')[0],
                        issuedBy: 'Admin'
                      });
                      onOpenCertificate(sub);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F4C430] text-[#0D2818] font-extrabold text-xs uppercase hover:bg-[#86EFAC] transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-[#0D2818]" />
                    <span>Issue Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* TAB 7: UNIQUE TREE ID REGISTRY */}
      {activeTab === 'qr' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-[#1B5E34]/30 p-8 rounded-3xl border border-[#1B5E34] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-[#F4C430] mb-2">
                <Tag className="w-5 h-5" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider">Zero-Cost ID System</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-[#F9FBF7]">
                🏷️ Unique Tree ID Registry ({trees.length})
              </h3>
              <p className="text-xs text-[#86EFAC] mt-1">
                Zero-cost digital tree tagging. Every tree gets a non-repeating unique ID synced to the Google Drive database.
              </p>
            </div>

            <button
              onClick={handleExportTreeCSV}
              className="px-5 py-3 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#86EFAC] transition-all flex items-center space-x-2 shadow-lg shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV for Google Drive</span>
            </button>
          </div>

          {/* Form: Register New Unique Tree ID */}
          <div className="bg-[#1B5E34]/30 p-8 rounded-3xl border border-[#1B5E34] space-y-6">
            <h4 className="font-display font-bold text-lg text-[#F4C430] flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Register New Unique Tree ID (Anti-Duplication Guaranteed)</span>
            </h4>

            {treeRegStatusMsg && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold ${
                  treeRegStatusMsg.type === 'success'
                    ? 'bg-[#4CAF50]/20 text-[#86EFAC] border border-[#4CAF50]'
                    : 'bg-red-900/30 text-red-300 border border-red-500'
                }`}
              >
                {treeRegStatusMsg.msg}
              </div>
            )}

            <form onSubmit={handleRegisterTree} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#86EFAC] mb-1 font-semibold">
                  Unique Tree ID * (Auto or Custom)
                </label>
                <input
                  type="text"
                  value={treeRegId}
                  onChange={(e) => setTreeRegId(e.target.value)}
                  placeholder={`e.g. ${store.generateNextTreeId()}`}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-xs text-[#F9FBF7] font-mono focus:outline-none focus:border-[#4CAF50]"
                />
                <p className="text-[10px] text-[#6B7F6E] mt-1">Leave empty to auto-generate next sequential ID</p>
              </div>

              <div>
                <label className="block text-xs text-[#86EFAC] mb-1 font-semibold">Tree Species *</label>
                <input
                  type="text"
                  required
                  value={treeRegSpecies}
                  onChange={(e) => setTreeRegSpecies(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#86EFAC] mb-1 font-semibold">Planted By *</label>
                <input
                  type="text"
                  required
                  value={treeRegPlantedBy}
                  onChange={(e) => setTreeRegPlantedBy(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#86EFAC] mb-1 font-semibold">Location Name *</label>
                <input
                  type="text"
                  required
                  value={treeRegLocation}
                  onChange={(e) => setTreeRegLocation(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#86EFAC] mb-1 font-semibold">District *</label>
                <select
                  value={treeRegDistrict}
                  onChange={(e) => setTreeRegDistrict(e.target.value as District)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                >
                  <option value="Kanpur Nagar">Kanpur Nagar</option>
                  <option value="Kanpur Dehat">Kanpur Dehat</option>
                  <option value="Unnao">Unnao</option>
                  <option value="Lucknow">Lucknow</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#FFF5C0] transition-colors shadow-md"
                >
                  Save & Sync Unique ID
                </button>
              </div>
            </form>
          </div>

          {/* Search & Tree List Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h4 className="font-display font-bold text-base text-[#F9FBF7]">
                Registered Trees Database ({trees.length})
              </h4>

              <input
                type="text"
                value={treeSearchTerm}
                onChange={(e) => setTreeSearchTerm(e.target.value)}
                placeholder="Filter by Unique ID or Species..."
                className="w-full sm:w-72 bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trees
                .filter(t => 
                  !treeSearchTerm || 
                  t.treeId.toLowerCase().includes(treeSearchTerm.toLowerCase()) || 
                  t.species.toLowerCase().includes(treeSearchTerm.toLowerCase()) ||
                  t.plantedBy.toLowerCase().includes(treeSearchTerm.toLowerCase())
                )
                .map((t) => (
                  <div key={t.treeId} className="bg-[#1B5E34]/30 p-6 rounded-3xl border border-[#1B5E34] space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-[#F4C430] bg-[#0D2818] px-3 py-1 rounded-xl border border-[#1B5E34]">
                          {t.treeId}
                        </span>
                        <span className="text-[10px] text-[#4CAF50] font-semibold bg-[#0D2818] px-2 py-0.5 rounded-lg border border-[#1B5E34]">
                          ✓ Verified
                        </span>
                      </div>

                      <p className="text-xs font-bold text-[#F9FBF7]">{t.species}</p>

                      <p className="text-xs text-[#6B7F6E]">
                        Planted By: <strong className="text-[#F9FBF7]">{t.plantedBy}</strong> <br />
                        Location: {t.locationName} ({t.plantedDate})
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectTree(t.treeId)}
                      className="w-full py-2.5 rounded-xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase hover:bg-[#86EFAC] transition-colors mt-2"
                    >
                      View Live Tree Profile
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: GOOGLE DRIVE & FREE BACKEND SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-8 animate-fadeIn">
          {/* GitHub / Vercel Data Sync Section */}
          <div className="bg-[#1B5E34]/30 p-8 rounded-3xl border-2 border-[#F4C430]/40 space-y-6 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#F4C430] rounded-2xl text-[#0D2818] shadow-md">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-[#F9FBF7]">
                  🌐 Vercel / GitHub Live Data Sync Tool
                </h3>
                <p className="text-xs text-[#86EFAC]">
                  Fix for "Dummy Images on Vercel" — Make all your admin edits & uploaded photos visible to EVERY visitor globally!
                </p>
              </div>
            </div>

            <div className="bg-[#0D2818] p-5 rounded-2xl border border-[#1B5E34] space-y-3 text-xs leading-relaxed text-[#F9FBF7]/90">
              <p className="font-bold text-[#F4C430] text-sm">
                ❓ Kyun dusri devices par Vercel link kholne par dummy images dikhti hain?
              </p>
              <p className="text-[#86EFAC]">
                Admin panel me aap jo bhi photos upload karte ho ya badlav karte ho, wo aapke browser ke <code className="bg-black/50 px-1.5 py-0.5 rounded text-white font-mono">localStorage</code> me save hota hai. Vercel par jab koi aur apani device se website kholta hai, to uska localStorage khali hota hai aur website <code className="bg-black/50 px-1.5 py-0.5 rounded text-white font-mono">src/data/initialData.ts</code> file ke default code data ko dikhati hai.
              </p>
              <p className="font-bold text-[#4CAF50] pt-1 text-sm">
                ✅ Isko Hamesha Ke Liye Kaise Fix Karein (1 Minute Step):
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[#86EFAC]/90 pl-1">
                <li>Niche <strong>"Download Updated initialData.ts"</strong> button par click karo.</li>
                <li>Download hui <code className="bg-black/50 px-1.5 py-0.5 rounded text-white font-mono">initialData.ts</code> file ko apne project ke <code className="bg-black/50 px-1.5 py-0.5 rounded text-white font-mono">src/data/initialData.ts</code> path par replace/paste kar do.</li>
                <li>Github par push kar do (ya Vercel par nayi zip upload kar do).</li>
                <li>Ab poori duniya me kisi bhi device/browser par aapki saari real photos aur admin updates instantly live dikhenge!</li>
              </ol>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadInitialData}
                className="px-6 py-3.5 rounded-2xl bg-[#F4C430] text-[#0D2818] font-extrabold text-xs uppercase tracking-wider hover:bg-[#FFE066] transition-all shadow-xl flex items-center space-x-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0D2818]" />
                <span>📥 Download Updated initialData.ts File for GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(store.exportInitialDataTsCode());
                  alert("✅ initialData.ts code copied to clipboard! Paste this into src/data/initialData.ts in your repo.");
                }}
                className="px-5 py-3.5 rounded-2xl bg-[#0D2818] text-[#86EFAC] border border-[#1B5E34] font-bold text-xs uppercase hover:bg-[#1B5E34] transition-all flex items-center space-x-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#86EFAC]" />
                <span>📋 Copy initialData.ts Code</span>
              </button>
            </div>
          </div>

          {/* Founder Profile Photo Card */}
          <div className="bg-[#1B5E34]/30 p-8 rounded-3xl border border-[#1B5E34] space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#F4C430]/20 rounded-2xl text-[#F4C430]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-[#F9FBF7]">
                  Founder Profile Photo (Prashant Yadav)
                </h3>
                <p className="text-xs text-[#86EFAC]">
                  Upload Prashant Yadav's photo here to display on the website homepage and admin header.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#0D2818] p-6 rounded-2xl border border-[#1B5E34]">
              <img 
                src={store.getFounderPhoto()} 
                alt="Prashant Yadav" 
                className="w-24 h-24 rounded-2xl object-cover border-2 border-[#F4C430] shadow-xl"
              />
              <div className="space-y-3 text-center sm:text-left">
                <h4 className="font-bold text-sm text-[#F9FBF7]">Prashant Yadav</h4>
                <p className="text-xs text-[#6B7F6E]">Founding Director • Kanvana Foundation</p>
                
                <label className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#4CAF50] text-[#0D2818] hover:bg-[#86EFAC] rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md">
                  <Camera className="w-4 h-4" />
                  <span>Upload Prashant's Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (reader.result) store.setFounderPhoto(reader.result as string);
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-[#1B5E34]/30 p-8 rounded-3xl border border-[#1B5E34] space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[#4CAF50]/20 rounded-2xl text-[#86EFAC]">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-[#F9FBF7]">
                  Google Drive & Google Sheets Free Auto-Sync
                </h3>
                <p className="text-xs text-[#86EFAC]">
                  Automatically store every tree photo in Google Drive and every record in Google Sheets for FREE!
                </p>
              </div>
            </div>

            {/* Webhook Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                store.setWebhookUrl(webhookInput.trim());
                setWebhookSavedMsg(true);
                setTimeout(() => setWebhookSavedMsg(false), 3000);
              }}
              className="space-y-4 bg-[#0D2818] p-6 rounded-2xl border border-[#1B5E34]"
            >
              <div>
                <label className="text-xs font-bold uppercase text-[#F4C430] block mb-2">
                  Your Google Apps Script Webhook URL
                </label>
                <input
                  type="url"
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  className="w-full bg-[#1B5E34]/40 border border-[#1B5E34] rounded-xl p-3.5 text-xs text-[#F9FBF7] font-mono focus:outline-none focus:border-[#4CAF50]"
                />
                <p className="text-[11px] text-[#6B7F6E] mt-1.5">
                  When configured, every user submission and surveyor upload instantly POSTs to your Google Drive folder and Google Sheet!
                </p>
              </div>

              {testWebhookStatus && (
                <div className="p-3 rounded-xl bg-[#1B5E34]/50 border border-[#4CAF50] text-xs font-mono text-[#86EFAC]">
                  {testWebhookStatus}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#86EFAC] transition-all"
                >
                  Save Webhook URL
                </button>

                <button
                  type="button"
                  onClick={handleTestWebhook}
                  className="px-5 py-2.5 rounded-xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#FFF5C0] transition-all"
                >
                  🧪 Test Google Drive Connection
                </button>

                <button
                  type="button"
                  onClick={handleSyncAllToDrive}
                  className="px-5 py-2.5 rounded-xl bg-[#0D2818] text-[#86EFAC] border border-[#1B5E34] font-bold text-xs uppercase hover:bg-[#1B5E34] transition-all"
                >
                  ⚡ Sync All Submissions to Drive
                </button>

                {webhookSavedMsg && (
                  <span className="text-xs text-[#86EFAC] font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                    <span>Saved successfully!</span>
                  </span>
                )}
              </div>
            </form>

            {/* 3-Step Setup Guide */}
            <div className="space-y-4 pt-4 border-t border-[#1B5E34]">
              <h4 className="font-display font-bold text-sm text-[#F4C430] uppercase tracking-wider">
                ⚡ How to setup your 100% Free Google Drive Backend (2 Minutes):
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34] space-y-2">
                  <span className="font-bold text-[#86EFAC] text-sm block">Step 1: Open Google Sheets</span>
                  <p className="text-[#F9FBF7]/80 leading-relaxed">
                    Go to <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-[#86EFAC] underline">sheets.google.com</a> and create a blank sheet named <strong>"Kanvana Tree Records"</strong>.
                  </p>
                </div>

                <div className="bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34] space-y-2">
                  <span className="font-bold text-[#86EFAC] text-sm block">Step 2: Add Apps Script</span>
                  <p className="text-[#F9FBF7]/80 leading-relaxed">
                    Click <strong>Extensions → Apps Script</strong> in Google Sheets, delete all code, paste the script code below, and click Save.
                  </p>
                </div>

                <div className="bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34] space-y-2">
                  <span className="font-bold text-[#86EFAC] text-sm block">Step 3: Deploy Web App</span>
                  <p className="text-[#F9FBF7]/80 leading-relaxed">
                    Click <strong>Deploy → New deployment → Web app</strong>. Set <i>Execute as: Me</i> and <i>Who has access: Anyone</i>. Copy the URL and paste it above!
                  </p>
                </div>
              </div>

              {/* Ready to Copy Apps Script */}
              <div className="bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#86EFAC] uppercase">
                    📜 Free Google Apps Script Code (Copy & Paste)
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`function doGet(e) {
  return ContentService.createTextOutput("✅ Kanvana Google Drive Sync Service Active!").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var payload = data.data || {};
    var recordType = data.type || "submission";
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    var folder = DriveApp.getFoldersByName("Kanvana Tree Photos").hasNext() ? DriveApp.getFoldersByName("Kanvana Tree Photos").next() : DriveApp.createFolder("Kanvana Tree Photos");
    var drivePhotoLinks = [];
    var photos = payload.photoUrls || [];
    if (payload.photoUrl) photos.push(payload.photoUrl);
    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      if (photo && photo.indexOf("data:image") === 0) {
        var parts = photo.split(",");
        var mimeType = parts[0].match(/:(.*?);/)[1];
        var decoded = Utilities.base64Decode(parts[1]);
        var blob = Utilities.newBlob(decoded, mimeType, "Kanvana_Photo_" + Date.now() + "_" + (i+1) + ".jpg");
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        drivePhotoLinks.push(file.getUrl());
      } else if (photo) drivePhotoLinks.push(photo);
    }

    var treeSheet = ss.getSheetByName("🌳 Tree Plantations") || ss.insertSheet("🌳 Tree Plantations", 0);
    if (treeSheet.getLastRow() === 0) {
      treeSheet.appendRow(["Timestamp", "Volunteer Name", "Phone", "Location", "District", "Surveyor", "Trees", "Species", "Notes", "Photos"]);
      treeSheet.getRange("1:1").setFontWeight("bold").setBackground("#1B5E34").setFontColor("#FFF");
    }

    var certSheet = ss.getSheetByName("📜 Issued Certificates") || ss.insertSheet("📜 Issued Certificates", 1);
    if (certSheet.getLastRow() === 0) {
      certSheet.appendRow(["Timestamp", "Certificate No", "Recipient Name", "Trees Recognized", "Location", "Issued Date", "Issued By"]);
      certSheet.getRange("1:1").setFontWeight("bold").setBackground("#1B5E34").setFontColor("#FFF");
    }

    var surveyorSheet = ss.getSheetByName("👷 Surveyors") || ss.insertSheet("👷 Surveyors", 2);
    if (surveyorSheet.getLastRow() === 0) {
      surveyorSheet.appendRow(["Timestamp", "Surveyor Name", "Role", "Phone", "District", "Photos"]);
      surveyorSheet.getRange("1:1").setFontWeight("bold").setBackground("#1B5E34").setFontColor("#FFF");
    }

    var photoStr = drivePhotoLinks.length > 0 ? drivePhotoLinks.join(" , ") : "No Photos";

    if (recordType === "certificate") {
      certSheet.appendRow([timestamp, payload.certificateNo || "KNV-CERT-2026", payload.recipientName || "Volunteer", Number(payload.treesPlanted || 1), payload.location || "Nankari", payload.issuedDate || timestamp.split(" ")[0], payload.issuedBy || "Public Portal"]);
    } else if (recordType === "surveyor") {
      surveyorSheet.appendRow([timestamp, payload.name || payload.surveyorName || "Surveyor", payload.role || "Surveyor", "'" + (payload.phone || "N/A"), payload.district || "Kanpur", photoStr]);
    } else {
      treeSheet.appendRow([timestamp, payload.volunteerName || payload.name || "Volunteer", "'" + (payload.volunteerPhone || payload.phone || "N/A"), payload.locationName || payload.volunteerVillage || "Kanpur", payload.district || "Kanpur", payload.surveyorName || "Online", Number(payload.treesCount || payload.treesPlanted || 1), payload.treeSpecies || payload.activityType || "Tree Plantation", payload.notes || "Record", photoStr]);
    }
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch(err) { return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(ContentService.MimeType.TEXT); }
}`);
                      alert("Multi-Tab Google Sheets & Drive Script Code copied to clipboard!");
                    }}
                    className="px-3 py-1 bg-[#1B5E34] text-[#86EFAC] hover:bg-[#4CAF50] hover:text-[#0D2818] rounded-lg text-[11px] font-bold transition-all"
                  >
                    Copy Complete Script Code
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-[#86EFAC]/90 bg-[#123820] p-3 rounded-xl overflow-x-auto">
{`function doGet(e) {
  return ContentService.createTextOutput("✅ Kanvana Google Drive Sync Service is Active! Send POST requests from Admin Dashboard.").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var payload = data.data || {};
    var recordType = data.type || "submission";
    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    // 1. Get or Create "Kanvana Tree Photos" Folder in Google Drive
    var folderName = "Kanvana Tree Photos";
    var folders = DriveApp.getFoldersByName(folderName);
    var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
    
    // 2. Upload Base64 Photos to Google Drive & generate viewable links
    var drivePhotoLinks = [];
    var photos = payload.photoUrls || [];
    if (payload.photoUrl) photos.push(payload.photoUrl);
    
    for (var i = 0; i < photos.length; i++) {
      var photo = photos[i];
      if (photo && photo.indexOf("data:image") === 0) {
        var parts = photo.split(",");
        var mimeType = parts[0].match(/:(.*?);/)[1];
        var decoded = Utilities.base64Decode(parts[1]);
        var blob = Utilities.newBlob(decoded, mimeType, "Kanvana_Tree_Photo_" + Date.now() + "_" + (i+1) + ".jpg");
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        drivePhotoLinks.push(file.getUrl());
      } else if (photo) {
        drivePhotoLinks.push(photo);
      }
    }

    // 3. AUTO-CREATE ALL 3 TABS UPFRONT IF THEY DO NOT EXIST YET
    
    // Tab 1: "📊 Kanvana Overview"
    var overviewSheet = ss.getSheetByName("📊 Kanvana Overview");
    if (!overviewSheet) {
      overviewSheet = ss.insertSheet("📊 Kanvana Overview", 0);
      overviewSheet.getRange("A1:D1").merge().setValue("KANVANA FOUNDATION - FIELD DATA DASHBOARD").setFontWeight("bold").setFontSize(13).setBackground("#1B5E34").setFontColor("#FFFFFF").setHorizontalAlignment("center");
      
      overviewSheet.getRange("A3").setValue("Total Trees Planted").setFontWeight("bold");
      overviewSheet.getRange("B3").setFormula("=SUM('🌳 Tree Plantations'!G2:G1000)").setFontWeight("bold").setFontSize(12).setFontColor("#1B5E34");

      overviewSheet.getRange("A4").setValue("Total Field Records").setFontWeight("bold");
      overviewSheet.getRange("B4").setFormula("=COUNTA('🌳 Tree Plantations'!A2:A1000)").setFontWeight("bold").setFontSize(12).setFontColor("#1B5E34");

      overviewSheet.getRange("A5").setValue("Registered Surveyors").setFontWeight("bold");
      overviewSheet.getRange("B5").setFormula("=COUNTA('👷 Surveyors'!A2:A1000)").setFontWeight("bold").setFontSize(12).setFontColor("#1B5E34");

      overviewSheet.getRange("A6").setValue("Last Sync Timestamp").setFontWeight("bold");
      overviewSheet.getRange("B6").setValue(timestamp).setFontColor("#666666");
      
      overviewSheet.autoResizeColumns(1, 4);
    } else {
      overviewSheet.getRange("B6").setValue(timestamp);
    }

    // Tab 2: "🌳 Tree Plantations"
    var treeSheet = ss.getSheetByName("🌳 Tree Plantations");
    if (!treeSheet) {
      treeSheet = ss.insertSheet("🌳 Tree Plantations", 1);
      treeSheet.appendRow(["Timestamp", "Volunteer Name", "Phone", "Village / Location", "District", "Surveyor Name", "Trees Count", "Species / Activity", "Notes", "Google Drive Photos"]);
      treeSheet.getRange("1:1").setFontWeight("bold").setBackground("#1B5E34").setFontColor("#FFFFFF").setHorizontalAlignment("center");
      treeSheet.setFrozenRows(1);
    }

    // Tab 3: "👷 Surveyors"
    var surveyorSheet = ss.getSheetByName("👷 Surveyors");
    if (!surveyorSheet) {
      surveyorSheet = ss.insertSheet("👷 Surveyors", 2);
      surveyorSheet.appendRow(["Timestamp", "Surveyor Name", "Role / Code", "Phone", "District / Region", "Google Drive Photo"]);
      surveyorSheet.getRange("1:1").setFontWeight("bold").setBackground("#1B5E34").setFontColor("#FFFFFF").setHorizontalAlignment("center");
      surveyorSheet.setFrozenRows(1);
    }

    // Optional: Delete default blank "Sheet1" if user hasn't deleted it
    var defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && ss.getSheets().length > 1) {
      try { ss.deleteSheet(defaultSheet); } catch(e) {}
    }

    // 4. ROUTE DATA TO SPECIFIC TAB
    var photoString = drivePhotoLinks.length > 0 ? drivePhotoLinks.join(" , ") : "No Photos";

    if (recordType === "surveyor") {
      surveyorSheet.appendRow([
        timestamp,
        payload.name || payload.surveyorName || "Field Surveyor",
        payload.role || payload.code || "Surveyor",
        "'" + (payload.phone || "N/A"),
        payload.district || "Kanpur Nagar",
        photoString
      ]);
      surveyorSheet.autoResizeColumns(1, 6);

    } else {
      treeSheet.appendRow([
        timestamp,
        payload.volunteerName || payload.name || "Volunteer / Supporter",
        "'" + (payload.volunteerPhone || payload.phone || "N/A"),
        payload.locationName || payload.volunteerVillage || "Kanpur",
        payload.district || "Kanpur Nagar",
        payload.surveyorName || "Admin / Online",
        Number(payload.treesCount || payload.treesPlanted || 1),
        payload.treeSpecies || payload.activityType || "Tree Plantation",
        payload.notes || "Field Record",
        photoString
      ]);
      treeSheet.autoResizeColumns(1, 10);
    }
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TREE STORY ANIMATION IMAGE MANAGER */}
      {activeTab === 'story' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-[#1B5E34]/30 p-6 rounded-3xl border-2 border-[#1B5E34] space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F4C430] p-3 text-[#0D2818] flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#F9FBF7]">
                  वृक्ष यात्रा फोटो नियंत्रण (Tree Story Animation Manager)
                </h2>
                <p className="text-xs text-[#86EFAC]">
                  Admin controls the 5 stage photos shown in the intro Tree Story Animation on website load. Update photos as recent plantation drives happen in Kanpur!
                </p>
              </div>
            </div>

            {storySavedMsg && (
              <div className="p-3 bg-[#4CAF50]/20 border border-[#4CAF50] text-[#86EFAC] rounded-2xl text-xs font-bold flex items-center space-x-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                <span>✅ Tree Story Animation photos updated live on website!</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSaveStoryImages} className="space-y-6">
            {/* 5 Stages Image Editor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { stage: 0, title: 'Step 01: Sowing (बीज)', desc: 'Organic Native Seed in Soil' },
                { stage: 1, title: 'Step 02: Sprouting (अंकुरण)', desc: 'Dew Drops & Tender Sprout' },
                { stage: 2, title: 'Step 03: Field Care (सुरक्षा घेरा)', desc: 'Tree Guard, Terracotta Pot & Geotag' },
                { stage: 3, title: 'Step 04: Environmental Canopy (विशाल वृक्ष)', desc: 'Full Grown Canopy & Oxygen Production' },
                { stage: 4, title: 'Step 05: People Movement (कान्वना क्रांति)', desc: 'Kanpur Plantation Drive & Volunteers' },
              ].map((item) => (
                <div key={item.stage} className="bg-[#1B5E34]/30 p-5 rounded-3xl border border-[#1B5E34] space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#F4C430] text-[#0D2818] text-[10px] font-black uppercase">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-[#86EFAC] font-mono">Stage #{item.stage + 1}</span>
                    </div>
                    <p className="text-xs text-[#86EFAC]">{item.desc}</p>
                  </div>

                  {/* Image Preview */}
                  <div className="relative h-44 rounded-2xl overflow-hidden border border-[#1B5E34] bg-black/60 group">
                    <img
                      src={storyImagesInput[item.stage] || defaultStoryImages[item.stage]}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10px] text-[#F9FBF7]/90 font-mono truncate">
                        {storyImagesInput[item.stage] ? 'Custom Admin Photo' : 'Default HD Image'}
                      </span>
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase text-[#86EFAC] block">
                      Image URL (Direct Link / Unsplash / Drive):
                    </label>
                    <input
                      type="url"
                      required
                      value={storyImagesInput[item.stage] || ''}
                      onChange={(e) => {
                        const updated = [...storyImagesInput];
                        updated[item.stage] = e.target.value;
                        setStoryImagesInput(updated);
                      }}
                      placeholder="Paste image URL (https://...)"
                      className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-xl px-3 py-2 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                    />

                    {/* Quick Pick from Field Surveyor Uploads */}
                    {submissions.some(s => s.photoUrls && s.photoUrls.length > 0) && (
                      <div className="pt-1">
                        <label className="text-[10px] text-[#F4C430] font-bold block mb-1">
                          📸 Pick from Recent Surveyor Uploads:
                        </label>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              const updated = [...storyImagesInput];
                              updated[item.stage] = e.target.value;
                              setStoryImagesInput(updated);
                            }
                          }}
                          className="w-full bg-[#0D2818] border border-[#1B5E34] text-[11px] text-[#86EFAC] rounded-xl p-1.5 focus:outline-none"
                        >
                          <option value="">-- Select uploaded tree photo --</option>
                          {submissions.flatMap(s => (s.photoUrls || []).map((url, i) => ({
                            url,
                            name: `${s.volunteerName} (${s.locationName || s.volunteerVillage}) #${i + 1}`
                          }))).map((opt, idx) => (
                            <option key={idx} value={opt.url}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-[#1B5E34]/30 rounded-3xl border border-[#1B5E34]">
              <div className="flex items-center space-x-2">
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-[#F4C430] text-[#0D2818] font-extrabold text-xs uppercase tracking-wider hover:bg-[#FFE066] transition-all shadow-xl flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#0D2818]" />
                  <span>Save & Publish Tree Story Photos</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleResetStoryImages}
                className="px-5 py-3 rounded-2xl bg-[#0D2818] text-[#86EFAC] border border-[#1B5E34] font-bold text-xs uppercase hover:bg-red-900/30 hover:text-red-300 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Default HD Photos</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FULL FIELD SUBMISSION DETAIL & HIGH-RES IMAGE INSPECTION MODAL */}
      {selectedSubForDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 animate-fadeIn">
          <div className="min-h-full w-full flex items-center justify-center py-4 sm:py-8">
            <div className="bg-[#0A3319] border-2 border-[#15803D] rounded-2xl sm:rounded-3xl max-w-4xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto text-white">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#1B5E34] pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedSubForDetail.status === 'approved' ? 'bg-[#4CAF50]/20 text-[#86EFAC] border border-[#4CAF50]' :
                    selectedSubForDetail.status === 'rejected' ? 'bg-red-900/40 text-red-300 border border-red-500' :
                    'bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]'
                  }`}>
                    {selectedSubForDetail.status === 'approved' ? '✓ APPROVED & PUBLISHED' : selectedSubForDetail.status.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-[#6B7F6E]">ID: {selectedSubForDetail.id}</span>
                </div>
                <h3 className="font-display font-bold text-2xl text-[#F9FBF7] mt-2">
                  {selectedSubForDetail.volunteerName}
                </h3>
                <p className="text-xs text-[#86EFAC]">
                  📍 {selectedSubForDetail.locationName || selectedSubForDetail.volunteerVillage}, {selectedSubForDetail.district}
                </p>
              </div>

              <button
                onClick={() => setSelectedSubForDetail(null)}
                className="p-2 rounded-xl bg-[#1B5E34]/50 hover:bg-[#1B5E34] text-[#F9FBF7] transition-colors"
                title="Close Modal"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* High-Res Photo Viewer */}
            <div className="space-y-3">
              <h4 className="font-display font-bold text-sm text-[#F4C430] uppercase tracking-wider flex items-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Field Surveyor Uploaded Photos ({selectedSubForDetail.photoUrls?.length || 0})</span>
              </h4>

              {selectedSubForDetail.photoUrls && selectedSubForDetail.photoUrls.length > 0 ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#1B5E34] bg-black max-h-[420px] flex items-center justify-center group">
                    <img
                      src={selectedSubForDetail.photoUrls[selectedInspectionPhotoIndex] || selectedSubForDetail.photoUrls[0]}
                      alt="Field Submission High Resolution"
                      className="max-h-[420px] w-full object-contain"
                    />
                    <a
                      href={selectedSubForDetail.photoUrls[selectedInspectionPhotoIndex] || selectedSubForDetail.photoUrls[0]}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black text-[#F9FBF7] rounded-xl text-xs font-bold flex items-center space-x-1 backdrop-blur-sm border border-white/20 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Full Size Image</span>
                    </a>
                  </div>

                  {/* Thumbnail Row */}
                  {selectedSubForDetail.photoUrls.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto py-2">
                      {selectedSubForDetail.photoUrls.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedInspectionPhotoIndex(idx)}
                          className={`relative rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                            selectedInspectionPhotoIndex === idx ? 'border-[#F4C430] scale-105 shadow-lg' : 'border-[#1B5E34] opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={p} alt={`Thumb ${idx + 1}`} className="w-20 h-16 object-cover" />
                          <span className="absolute bottom-0 right-0 bg-black/80 text-[#F9FBF7] text-[9px] font-bold px-1.5 py-0.5 rounded-tl-md">
                            #{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#1B5E34]/20 border border-[#1B5E34] text-center text-xs text-[#6B7F6E]">
                  No photo attached to this field log submission.
                </div>
              )}
            </div>

            {/* Field Report Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#1B5E34]/20 p-6 rounded-2xl border border-[#1B5E34] text-xs">
              <div className="space-y-1">
                <span className="text-[#6B7F6E] uppercase font-bold text-[10px]">Volunteer Name & Phone:</span>
                <p className="font-bold text-[#F9FBF7] text-sm">{selectedSubForDetail.volunteerName}</p>
                <p className="text-[#86EFAC]">{selectedSubForDetail.volunteerPhone || 'No phone recorded'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7F6E] uppercase font-bold text-[10px]">Logged By Field Surveyor:</span>
                <p className="font-bold text-[#F9FBF7] text-sm">{selectedSubForDetail.surveyorName}</p>
                <p className="text-[#86EFAC]">Date: {selectedSubForDetail.activityDate}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7F6E] uppercase font-bold text-[10px]">Activity & Species:</span>
                <p className="font-bold text-[#F4C430] text-sm">{selectedSubForDetail.activityType}</p>
                <p className="text-[#F9FBF7]">{selectedSubForDetail.treesCount} Trees • {selectedSubForDetail.treeSpecies || 'Neem / Local Species'}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6B7F6E] uppercase font-bold text-[10px]">GPS Coordinates & Location:</span>
                <p className="font-bold text-[#F9FBF7]">{selectedSubForDetail.locationName || selectedSubForDetail.volunteerVillage}, {selectedSubForDetail.district}</p>
                {selectedSubForDetail.gps && selectedSubForDetail.gps.lat && selectedSubForDetail.gps.lng ? (
                  <a
                    href={`https://www.google.com/maps?q=${selectedSubForDetail.gps.lat},${selectedSubForDetail.gps.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-[#86EFAC] hover:underline font-mono text-[11px]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#F4C430]" />
                    <span>GPS: {selectedSubForDetail.gps.lat.toFixed(4)}, {selectedSubForDetail.gps.lng.toFixed(4)} (Open in Maps)</span>
                  </a>
                ) : (
                  <span className="text-[#6B7F6E]">GPS not logged</span>
                )}
              </div>

              <div className="col-span-1 md:col-span-2 space-y-1 pt-2 border-t border-[#1B5E34]">
                <span className="text-[#6B7F6E] uppercase font-bold text-[10px]">Surveyor Ground Zero Notes:</span>
                <p className="text-[#F9FBF7] leading-relaxed bg-[#0D2818] p-3 rounded-xl border border-[#1B5E34]">
                  {selectedSubForDetail.notes || 'No detailed ground notes added.'}
                </p>
              </div>
            </div>

            {/* Action Bar inside Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#1B5E34]">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => onOpenCertificate(selectedSubForDetail)}
                  className="px-4 py-2.5 rounded-xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase hover:bg-[#FFF5C0] transition-colors"
                >
                  📜 Generate Certificate
                </button>
              </div>

              <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
                {selectedSubForDetail.status !== 'approved' ? (
                  <button
                    onClick={() => handleApprove(selectedSubForDetail.id)}
                    className="px-5 py-2.5 rounded-xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase hover:bg-[#86EFAC] shadow-md"
                  >
                    ✅ Approve & Publish to Website
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnpublish(selectedSubForDetail.id)}
                    className="px-5 py-2.5 rounded-xl bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430] font-bold text-xs uppercase hover:bg-[#F4C430] hover:text-[#0D2818] transition-colors"
                  >
                    ↩️ Unpublish / Remove from Website
                  </button>
                )}

                {selectedSubForDetail.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(selectedSubForDetail.id)}
                    className="px-4 py-2.5 rounded-xl bg-red-900/40 text-red-300 border border-red-500 font-bold text-xs uppercase hover:bg-red-900"
                  >
                    ❌ Reject
                  </button>
                )}

                <button
                  onClick={() => handleDeleteSubmission(selectedSubForDetail.id)}
                  className="px-4 py-2.5 rounded-xl bg-red-950 text-red-400 border border-red-800 font-bold text-xs uppercase hover:bg-red-900 hover:text-white"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

    </div>
  );
};
