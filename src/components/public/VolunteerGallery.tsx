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
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadPhotoUrl, setUploadPhotoUrl] = useState('');
  const [uploadSubmitted, setUploadSubmitted] = useState(false);

  // Filter approved submissions only
  const approvedList = submissions.filter(s => s.status === 'approved');

  const districts = ['All', ...Array.from(new Set(approvedList.map(s => s.district)))];
  const types = ['All', 'Tree Plantation', 'Bird Water Station', 'General Survey'];

  const filtered = approvedList.filter(s => {
    const matchDist = selectedDistrict === 'All' || s.district === selectedDistrict;
    const matchType = selectedType === 'All' || s.activityType === selectedType;
    return matchDist && matchType;
  });

  const handlePhotoUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName || !uploadPhotoUrl) return;

    store.addSubmission({
      surveyorId: 'public-user',
      surveyorName: 'Public Volunteer Direct Upload',
      volunteerName: uploadName,
      volunteerPhone: uploadPhone || '+91 90000 00000',
      volunteerVillage: 'Field Site',
      district: 'Kanpur Nagar',
      activityType: uploadType,
      treesCount: uploadTrees,
      activityDate: new Date().toISOString().split('T')[0],
      locationName: 'Submitted Field Site',
      gps: { lat: 26.5188, lng: 80.2329 },
      notes: uploadNotes || 'Volunteer plantation activity photo submission',
      photoUrls: [uploadPhotoUrl],
      photoCaptions: ['Volunteer uploaded field photo'],
      consentGiven: true,
      treeSpecies: 'Native Sapling'
    });

    setUploadSubmitted(true);
    setTimeout(() => {
      setUploadSubmitted(false);
      setIsUploadOpen(false);
      setUploadName('');
      setUploadPhone('');
      setUploadPhotoUrl('');
      setUploadNotes('');
    }, 3500);
  };

  return (
    <section id="gallery" className="py-24 bg-[#0D2818] text-[#F9FBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1B5E34] text-[#86EFAC] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
              <span>Live Field Activity</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F9FBF7] tracking-tight">
              {getTranslation(language, 'gallery_title')}
            </h2>
            <p className="mt-2 text-sm text-[#86EFAC] max-w-2xl">
              {getTranslation(language, 'gallery_subtitle')}
            </p>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-display font-extrabold text-xs uppercase tracking-wider hover:bg-[#86EFAC] transition-all flex items-center space-x-2 shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>📸 Upload Field Photo</span>
            </button>

            <div className="flex flex-wrap items-center gap-3 bg-[#1B5E34]/40 p-2 rounded-2xl border border-[#1B5E34]">
              <div className="flex items-center space-x-1.5 px-2 text-xs font-bold text-[#86EFAC]">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>

              {/* District dropdown */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-[#0D2818] text-[#F9FBF7] text-xs font-medium px-3 py-1.5 rounded-xl border border-[#1B5E34] focus:outline-none focus:border-[#4CAF50]"
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
                className="bg-[#0D2818] text-[#F9FBF7] text-xs font-medium px-3 py-1.5 rounded-xl border border-[#1B5E34] focus:outline-none focus:border-[#4CAF50]"
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
          <div className="p-12 text-center bg-[#1B5E34]/20 rounded-3xl border border-[#1B5E34] space-y-3">
            <TreePine className="w-12 h-12 text-[#4CAF50] mx-auto opacity-50" />
            <p className="font-display font-bold text-lg text-[#F9FBF7]">
              No field activities matching this filter yet.
            </p>
            <p className="text-xs text-[#6B7F6E]">
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
                  className="group bg-[#1B5E34]/30 rounded-3xl border border-[#1B5E34] overflow-hidden shadow-xl hover:border-[#4CAF50] transition-all flex flex-col justify-between"
                >
                  {/* Photo area */}
                  <div className="relative h-56 overflow-hidden bg-[#0D2818]">
                    <img
                      src={item.photoUrls[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'}
                      alt={item.locationName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D2818] via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      {item.featured ? (
                        <span className="bg-[#F4C430] text-[#0D2818] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Featured</span>
                        </span>
                      ) : isNew ? (
                        <span className="bg-[#4CAF50] text-[#0D2818] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow flex items-center space-x-1">
                          <span className="w-2 h-2 rounded-full bg-[#0D2818] animate-ping" />
                          <span>NEW</span>
                        </span>
                      ) : <div />}

                      <span className="bg-[#0D2818]/90 text-[#86EFAC] text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full border border-[#1B5E34]">
                        {item.activityType}
                      </span>
                    </div>

                    {/* Hover Overlay Button */}
                    <button
                      onClick={() => setSelectedSub(item)}
                      className="absolute inset-0 bg-[#0D2818]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-[#F4C430] font-bold text-xs uppercase tracking-wider"
                    >
                      <Eye className="w-5 h-5" />
                      <span>View Field Details</span>
                    </button>
                  </div>

                  {/* Card Info */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-[#86EFAC] mb-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F4C430]" />
                        <span className="font-semibold truncate">
                          {item.locationName === 'Coming Soon' ? '📍 Field Site (Coming Soon)' : item.locationName}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-lg text-[#F9FBF7] line-clamp-1">
                        {item.volunteerVillage === 'Coming Soon' || item.district === 'Coming Soon' ? (
                          <span className="text-[#F4C430]">Field Location Coming Soon</span>
                        ) : (
                          `${item.volunteerVillage} (${item.district})`
                        )}
                      </h3>

                      <p className="text-xs text-[#F9FBF7]/70 line-clamp-2 mt-2">
                        {item.notes}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#1B5E34] space-y-3">
                      <div className="flex items-center justify-between text-xs text-[#6B7F6E]">
                        <div className="flex items-center space-x-1.5 text-[#86EFAC]">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-semibold">{item.volunteerName}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.activityDate}</span>
                        </div>
                      </div>

                      {item.treesCount > 0 && (
                        <div className="flex items-center justify-between bg-[#1B5E34]/50 p-2.5 rounded-xl border border-[#1B5E34]">
                          <span className="text-xs text-[#86EFAC] font-semibold flex items-center space-x-1">
                            <TreePine className="w-4 h-4 text-[#4CAF50]" />
                            <span>Trees Planted:</span>
                          </span>
                          <span className="font-display font-extrabold text-sm text-[#F4C430]">
                            {item.treesCount} Trees
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedSub(item)}
                          className="py-2 px-3 rounded-xl bg-[#1B5E34] hover:bg-[#4CAF50] text-[#86EFAC] hover:text-[#0D2818] text-[11px] font-bold uppercase transition-all flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => onOpenCertificate(item)}
                          className="py-2 px-3 rounded-xl bg-[#F4C430]/20 hover:bg-[#F4C430] text-[#F4C430] hover:text-[#0D2818] text-[11px] font-bold uppercase transition-all flex items-center justify-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-[999] bg-[#0D2818]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D2818] border-2 border-[#1B5E34] rounded-3xl max-w-2xl w-full p-6 lg:p-8 shadow-2xl relative my-8 text-[#F9FBF7]">
            <button
              onClick={() => setSelectedSub(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1B5E34] text-[#F9FBF7] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors"
            >
              ✕
            </button>

            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <span className="bg-[#4CAF50] text-[#0D2818] text-xs font-bold uppercase px-3 py-1 rounded-full">
                  VERIFIED FIELD SUBMISSION
                </span>
                <span className="text-xs text-[#86EFAC]">Verified by {selectedSub.surveyorName}</span>
              </div>

              {/* Photo Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedSub.photoUrls.map((photo, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-[#1B5E34] h-48 bg-[#1B5E34]/30">
                    <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-display font-bold text-2xl text-[#F9FBF7]">
                  {selectedSub.locationName}
                </h3>
                <p className="text-xs text-[#86EFAC] mt-1">
                  📍 {selectedSub.volunteerVillage}, {selectedSub.district}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34]">
                <div>
                  <span className="text-[10px] text-[#86EFAC] uppercase block font-semibold">Volunteer Name</span>
                  <span className="font-display font-bold text-sm text-[#F9FBF7]">{selectedSub.volunteerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#86EFAC] uppercase block font-semibold">Activity Date</span>
                  <span className="font-display font-bold text-sm text-[#F9FBF7]">{selectedSub.activityDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#86EFAC] uppercase block font-semibold">Activity Type</span>
                  <span className="font-display font-bold text-sm text-[#F9FBF7]">{selectedSub.activityType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#86EFAC] uppercase block font-semibold">Trees Planted</span>
                  <span className="font-display font-bold text-sm text-[#F4C430]">{selectedSub.treesCount} Saplings</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-[#86EFAC] font-semibold uppercase block mb-1">Field Notes</span>
                <p className="text-sm text-[#F9FBF7]/80 bg-[#1B5E34]/20 p-4 rounded-xl border border-[#1B5E34]">
                  {selectedSub.notes}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1B5E34] flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedSub(null);
                    onOpenCertificate(selectedSub);
                  }}
                  className="px-6 py-3 rounded-xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#FFF5C0] transition-colors flex items-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Generate Volunteer Certificate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Public Photo Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-[999] bg-[#0D2818]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0D2818] border-2 border-[#1B5E34] rounded-3xl max-w-xl w-full p-6 lg:p-8 shadow-2xl relative my-8 text-[#F9FBF7]">
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1B5E34] text-[#F9FBF7] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors"
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
                      Photo URL / Image Link *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/... or paste image URL"
                      value={uploadPhotoUrl}
                      onChange={(e) => setUploadPhotoUrl(e.target.value)}
                      className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-4 py-2.5 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                    />
                    <p className="text-[10px] text-[#86EFAC] mt-1">
                      Tip: Enter any image URL (Unsplash, Google Photos link, Imgur, etc.)
                    </p>
                  </div>

                  {uploadType === 'Tree Plantation' && (
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
      )}
    </section>
  );
};
