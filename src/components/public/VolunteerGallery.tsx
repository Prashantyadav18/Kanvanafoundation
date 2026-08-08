import React, { useState } from 'react';
import { Submission, District, ActivityType, Language } from '../../types';
import { MapPin, Calendar, CheckCircle2, User, Sparkles, Eye, Filter, TreePine, Bird, Camera, Upload, X } from 'lucide-react';
import { getTranslation } from '../common/translations';
import { store } from '../../services/store';

interface VolunteerGalleryProps {
  submissions: Submission[];
  language: Language;
  onOpenCertificate: (sub: Submission) => void;
}

export const VolunteerGallery: React.FC<VolunteerGalleryProps> = ({
  submissions,
  language,
  onOpenCertificate
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadPhone, setUploadPhone] = useState('');
  const [uploadType, setUploadType] = useState<ActivityType>('Tree Plantation');
  const [uploadTrees, setUploadTrees] = useState(10);
  const [uploadLocation, setUploadLocation] = useState('Nankari, IIT Kanpur');
  const [uploadDistrict, setUploadDistrict] = useState<District>('Kanpur Nagar');
  const [uploadGps, setUploadGps] = useState<{ lat: number; lng: number }>({ lat: 26.5188, lng: 80.2329 });
  const [uploadGpsStatus, setUploadGpsStatus] = useState('');
  const [uploadGpsLoading, setUploadGpsLoading] = useState(false);
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadTreeId, setUploadTreeId] = useState('');
  const [uploadPhotoUrl, setUploadPhotoUrl] = useState('');
  const [uploadSubmitted, setUploadSubmitted] = useState(false);

  const isTreeIdDuplicate = uploadTreeId.trim() ? !store.isTreeIdUnique(uploadTreeId) : false;

  // Filter approved submissions only
  const approvedList = submissions.filter(s => s.status === 'approved');

  const districts = ['All', ...Array.from(new Set(approvedList.map(s => s.district)))];
  const types = ['All', 'Tree Plantation', 'Bird Water Station', 'General Survey'];

  const filtered = approvedList.filter(s => {
    const matchDist = selectedDistrict === 'All' || s.district === selectedDistrict;
    const matchType = selectedType === 'All' || s.activityType === selectedType;
    return matchDist && matchType;
  });

  const handleGetLocation = () => {
    setUploadGpsLoading(true);
    setUploadGpsStatus('Requesting GPS location...');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          setUploadGps({ lat, lng });
          setUploadGpsLoading(false);
          setUploadGpsStatus(`✅ GPS Captured (${lat}, ${lng})`);
        },
        (err) => {
          console.warn('GPS error', err);
          setUploadGpsLoading(false);
          setUploadGpsStatus('⚠️ GPS permission blocked or unavailable. Set to default Kanpur coordinates.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUploadGpsLoading(false);
      setUploadGpsStatus('⚠️ Geolocation not supported by browser.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setUploadPhotoUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName || !uploadPhotoUrl) return;

    if (isTreeIdDuplicate) {
      alert(`⚠️ Tree ID "${uploadTreeId}" already exists in the database! Duplicate Tree IDs are strictly blocked. Please use a unique ID.`);
      return;
    }

    store.addSubmission({
      surveyorId: 'public-user',
      surveyorName: 'Public User / Volunteer Upload',
      volunteerName: uploadName,
      volunteerPhone: uploadPhone || '+91 90000 00000',
      volunteerVillage: uploadLocation || 'Field Site',
      district: uploadDistrict,
      activityType: uploadType,
      treesCount: uploadType === 'Tree Plantation' ? uploadTrees : 0,
      activityDate: new Date().toISOString().split('T')[0],
      locationName: uploadLocation || 'Field Site',
      gps: uploadGps,
      notes: uploadNotes || 'Volunteer plantation activity photo submission',
      photoUrls: [uploadPhotoUrl],
      photoCaptions: ['Volunteer uploaded field photo'],
      consentGiven: true,
      treeSpecies: 'Native Sapling',
      treeId: uploadTreeId.trim() ? uploadTreeId.trim().toUpperCase() : undefined
    });

    setUploadSubmitted(true);
    setTimeout(() => {
      setUploadSubmitted(false);
      setIsUploadOpen(false);
      setUploadName('');
      setUploadPhone('');
      setUploadTreeId('');
      setUploadPhotoUrl('');
      setUploadNotes('');
      setUploadGpsStatus('');
    }, 3500);
  };

  return (
    <section id="gallery" className="py-24 bg-[#EAF3EC] text-slate-800 relative border-b border-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0A3319] text-xs font-extrabold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Live Field Activity</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0A3319] tracking-tight">
              {getTranslation(language, 'gallery_title')}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              {getTranslation(language, 'gallery_subtitle')}
            </p>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#0A3319] text-[#F4C430] font-display font-extrabold text-xs uppercase tracking-wider hover:bg-[#15803D] hover:text-white transition-all flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>📸 Upload Field Photo</span>
            </button>

            <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-2xl border border-emerald-200 shadow-sm">
              <div className="flex items-center space-x-1.5 px-2 text-xs font-bold text-[#15803D]">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>

              {/* District dropdown */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-emerald-50 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 focus:outline-none focus:border-[#15803D]"
              >
                <option value="All">All Districts</option>
                {districts.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              {/* Activity Type dropdown */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-emerald-50 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 focus:outline-none focus:border-[#15803D]"
              >
                <option value="All">All Activity Types</option>
                {types.filter(t => t !== 'All').map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-emerald-100 shadow-md space-y-3">
            <TreePine className="w-12 h-12 text-[#15803D] mx-auto opacity-50" />
            <p className="font-display font-bold text-lg text-slate-800">
              No field activities matching this filter yet.
            </p>
            <p className="text-xs text-slate-500">
              Our first volunteers are heading out soon! Be the first to be featured here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const isNew = new Date().getTime() - new Date(item.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-md hover:shadow-2xl hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  {/* Photo area */}
                  <div className="relative h-56 overflow-hidden bg-emerald-950">
                    <img
                      src={item.photoUrls[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'}
                      alt={item.locationName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {item.featured ? (
                        <span className="bg-[#D97706] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured</span>
                        </span>
                      ) : isNew ? (
                        <span className="bg-[#16A34A] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          <span>NEW</span>
                        </span>
                      ) : <div />}

                      <span className="bg-white/90 text-[#0A3319] text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                        {item.activityType}
                      </span>
                    </div>

                    {/* Hover Overlay Button */}
                    <button
                      onClick={() => setSelectedSub(item)}
                      className="absolute inset-0 bg-[#0A3319]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-[#F4C430] font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View Field Details</span>
                    </button>
                  </div>

                  {/* Card Info */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-[#15803D] mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                        <span className="font-semibold truncate">
                          {item.locationName === 'Coming Soon' ? '📍 Field Site (Coming Soon)' : item.locationName}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg text-slate-900 line-clamp-1">
                        {item.volunteerVillage === 'Coming Soon' || item.district === 'Coming Soon' ? (
                          <span className="text-[#D97706]">Field Location Coming Soon</span>
                        ) : (
                          `${item.volunteerVillage} (${item.district})`
                        )}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-2">
                        {item.notes}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center space-x-1.5 text-[#0A3319]">
                          <User className="w-3.5 h-3.5 text-[#15803D]" />
                          <span className="font-semibold">{item.volunteerName}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.activityDate}</span>
                        </div>
                      </div>

                      {item.treesCount > 0 && (
                        <div className="flex items-center justify-between bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                          <span className="text-xs text-[#0A3319] font-semibold flex items-center space-x-1">
                            <TreePine className="w-4 h-4 text-[#15803D]" />
                            <span>Trees Planted:</span>
                          </span>
                          <span className="font-display font-extrabold text-sm text-[#D97706]">
                            {item.treesCount} Trees
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedSub(item)}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-all flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => onOpenCertificate(item)}
                          className="py-2 px-3 rounded-xl bg-[#0A3319] hover:bg-[#15803D] text-[#F4C430] hover:text-white text-[11px] font-extrabold transition-all flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#F4C430]" />
                          <span>Certificate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal Detail View */}
      {selectedSub && (
        <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6">
          <div className="min-h-full w-full flex items-center justify-center py-4 sm:py-8">
            <div className="bg-[#0A3319] border-2 border-[#15803D] rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative text-white my-auto">
              <button
                onClick={() => setSelectedSub(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-[#15803D] text-white hover:bg-[#F4C430] hover:text-[#0A3319] transition-all cursor-pointer z-10 shadow-md"
              >
                ✕
              </button>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <span className="bg-[#16A34A] text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full shadow-sm">
                    VERIFIED FIELD SUBMISSION
                  </span>
                  <span className="text-xs text-[#86EFAC] font-semibold">Verified by {selectedSub.surveyorName}</span>
                </div>

                {/* Photo Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSub.photoUrls.map((photo, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-emerald-700/60 h-48 bg-[#0D2818]">
                      <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                    {selectedSub.locationName}
                  </h3>
                  <p className="text-xs text-[#86EFAC] font-semibold mt-1">
                    📍 {selectedSub.volunteerVillage}, {selectedSub.district}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-[#0D2818]/80 p-4 rounded-2xl border border-emerald-700/60">
                  <div>
                    <span className="text-[10px] text-[#86EFAC] uppercase block font-extrabold">Volunteer Name</span>
                    <span className="font-display font-bold text-sm text-white">{selectedSub.volunteerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86EFAC] uppercase block font-extrabold">Activity Date</span>
                    <span className="font-display font-bold text-sm text-white">{selectedSub.activityDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86EFAC] uppercase block font-extrabold">Activity Type</span>
                    <span className="font-display font-bold text-sm text-white">{selectedSub.activityType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#86EFAC] uppercase block font-extrabold">Trees Planted</span>
                    <span className="font-display font-black text-sm text-[#F4C430]">{selectedSub.treesCount} Saplings</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#86EFAC] font-extrabold uppercase block mb-1">Field Notes</span>
                  <p className="text-sm text-emerald-100/90 bg-[#0D2818]/80 p-4 rounded-xl border border-emerald-700/60 leading-relaxed font-normal">
                    {selectedSub.notes}
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-700/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedSub(null);
                      onOpenCertificate(selectedSub);
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#F4C430] text-[#0A3319] font-black text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Generate Volunteer Certificate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Photo Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6">
          <div className="min-h-full w-full flex items-center justify-center py-4 sm:py-8">
            <div className="bg-[#0A3319] border-2 border-[#15803D] rounded-2xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 shadow-2xl relative text-white my-auto">
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-[#15803D] text-white hover:bg-[#F4C430] hover:text-[#0A3319] transition-all cursor-pointer z-10 shadow-md"
              >
                ✕
              </button>

            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1B5E34] text-[#86EFAC] text-xs font-bold uppercase mb-2">
                  <Camera className="w-3.5 h-3.5 text-[#F4C430]" />
                  <span>Direct Volunteer Photo Upload</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl text-[#F9FBF7]">
                  Upload Field Plantation Photo
                </h3>
                <p className="text-xs text-[#86EFAC] mt-1">
                  Upload your tree plantation or water station photos. Your submission goes directly to the Admin Panel for 1-click verification & live publishing!
                </p>
              </div>

              {uploadSubmitted ? (
                <div className="p-6 bg-[#1B5E34]/80 rounded-2xl border-2 border-[#4CAF50] text-center space-y-3">
                  <div className="w-12 h-12 bg-[#4CAF50] text-[#0D2818] rounded-full flex items-center justify-center mx-auto text-2xl">
                    ✅
                  </div>
                  <h4 className="font-display font-bold text-xl text-[#F9FBF7]">
                    Submitted to Admin Panel!
                  </h4>
                  <p className="text-xs text-[#86EFAC] leading-relaxed">
                    Thank you! Your photo and details have been submitted. The Admin will review and publish it live to the gallery in 1 click!
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePhotoUploadSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                      Volunteer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vaibhav Yadav"
                      value={uploadName}
                      onChange={(e) => setUploadName(e.target.value)}
                      className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 83182 88563"
                        value={uploadPhone}
                        onChange={(e) => setUploadPhone(e.target.value)}
                        className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                        Activity Type
                      </label>
                      <select
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value as ActivityType)}
                        className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      >
                        <option value="Tree Plantation">Tree Plantation</option>
                        <option value="Bird Water Station">Bird Water Station</option>
                        <option value="General Survey">General Survey</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                      Field Photo *
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer px-4 py-2 bg-[#1B5E34] hover:bg-[#15803D] text-[#86EFAC] text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors border border-[#15803D]">
                          <Camera className="w-4 h-4 text-[#F4C430]" />
                          <span>Choose File from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-[#86EFAC]">or paste URL below</span>
                      </div>

                      <input
                        type="url"
                        required
                        placeholder="https://... or select file above"
                        value={uploadPhotoUrl}
                        onChange={(e) => setUploadPhotoUrl(e.target.value)}
                        className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      />

                      {uploadPhotoUrl && (
                        <div className="relative rounded-xl overflow-hidden border border-[#15803D] h-32 bg-black flex items-center justify-center">
                          <img
                            src={uploadPhotoUrl}
                            alt="Selected preview"
                            className="h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setUploadPhotoUrl('')}
                            className="absolute top-2 right-2 bg-black/80 text-white rounded-full p-1 text-xs hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                        Site / Location Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Nankari, IIT Kanpur"
                        value={uploadLocation}
                        onChange={(e) => setUploadLocation(e.target.value)}
                        className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                        District *
                      </label>
                      <select
                        value={uploadDistrict}
                        onChange={(e) => setUploadDistrict(e.target.value as District)}
                        className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      >
                        <option value="Kanpur Nagar">Kanpur Nagar</option>
                        <option value="Kanpur Dehat">Kanpur Dehat</option>
                        <option value="Unnao">Unnao</option>
                        <option value="Lucknow">Lucknow</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                      GPS Live Location (For Impact Map Pin)
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={uploadGpsLoading}
                        className="px-3.5 py-2 bg-[#15803D] hover:bg-[#4CAF50] text-[#F9FBF7] hover:text-[#0D2818] font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors border border-[#4CAF50]/40 shrink-0 cursor-pointer"
                      >
                        <MapPin className="w-4 h-4 text-[#F4C430]" />
                        <span>{uploadGpsLoading ? 'Getting GPS...' : '📍 Auto-Detect My Live Location'}</span>
                      </button>

                      <div className="flex items-center space-x-2 text-xs font-mono text-[#86EFAC]">
                        <span>Lat: {uploadGps.lat}</span>
                        <span>Lng: {uploadGps.lng}</span>
                      </div>
                    </div>
                    {uploadGpsStatus && (
                      <p className="text-[11px] text-[#F4C430] mt-1 font-semibold">{uploadGpsStatus}</p>
                    )}
                  </div>

                  {uploadType === 'Tree Plantation' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                          Unique Tree ID (Tag Number e.g. 0018 or KANVANA-TREE-0018)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 0018 or KANVANA-TREE-0018 (Optional / Auto-generated if blank)"
                          value={uploadTreeId}
                          onChange={(e) => setUploadTreeId(e.target.value)}
                          className={`w-full bg-[#1B5E34]/30 border rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none ${
                            isTreeIdDuplicate 
                              ? 'border-red-500 bg-red-950/40 focus:border-red-400' 
                              : 'border-[#1B5E34] focus:border-[#4CAF50]'
                          }`}
                        />
                        {isTreeIdDuplicate ? (
                          <div className="mt-1.5 p-2 rounded-lg bg-red-900/60 border border-red-500 text-red-200 text-xs font-bold flex items-center space-x-1.5">
                            <span>❌ Error: Tree ID "{uploadTreeId}" is ALREADY registered in the database! Duplicate Tree IDs are strictly blocked.</span>
                          </div>
                        ) : uploadTreeId.trim() ? (
                          <p className="text-[11px] text-[#86EFAC] mt-1 font-semibold">
                            ✅ Tree ID "{uploadTreeId.toUpperCase()}" is available and ready for verification!
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                          Number of Trees Planted
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={uploadTrees}
                          onChange={(e) => setUploadTrees(parseInt(e.target.value) || 1)}
                          className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-[#86EFAC] uppercase block mb-1">
                      Notes / Message
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add details about tree sapling type or drive location..."
                      value={uploadNotes}
                      onChange={(e) => setUploadNotes(e.target.value)}
                      className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-[#4CAF50] text-[#0D2818] font-display font-extrabold text-sm uppercase tracking-wider hover:bg-[#86EFAC] transition-all shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Submit Photo for Admin Verification</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </section>
  );
};
