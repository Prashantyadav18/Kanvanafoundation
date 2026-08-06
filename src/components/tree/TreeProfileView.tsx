import React, { useState } from 'react';
import { TreeProfile } from '../../types';
import { QrCode, MapPin, Calendar, User, TreePine, ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';
import { store } from '../../services/store';

interface TreeProfileViewProps {
  treeId: string;
  onBack: () => void;
}

export const TreeProfileView: React.FC<TreeProfileViewProps> = ({ treeId, onBack }) => {
  const trees = store.getTrees();
  const tree = trees.find(t => t.treeId.toUpperCase() === treeId.toUpperCase()) || trees[0];

  const [newLogNote, setNewLogNote] = useState('');
  const [logAddedMsg, setLogAddedMsg] = useState(false);

  const handleAddGrowthLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote) return;

    store.addTreeGrowthEntry(tree.treeId, {
      date: new Date().toISOString().split('T')[0],
      photo: tree.photos[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      note: newLogNote
    });

    setNewLogNote('');
    setLogAddedMsg(true);
    setTimeout(() => setLogAddedMsg(false), 2500);
  };

  if (!tree) {
    return (
      <div className="min-h-screen bg-[#0D2818] text-[#F9FBF7] pt-24 pb-16 px-4 text-center">
        <p className="text-lg font-bold text-[#F4C430]">Tree Tag Not Found</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-[#1B5E34] text-[#86EFAC] rounded-xl text-xs font-bold">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D2818] text-[#F9FBF7] pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#1B5E34] pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-[#1B5E34] hover:bg-[#4CAF50] text-[#86EFAC] hover:text-[#0D2818] text-xs font-bold uppercase transition-colors flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </button>

        <span className="font-mono font-extrabold text-sm text-[#F4C430] bg-[#1B5E34]/50 px-3 py-1 rounded-xl border border-[#1B5E34]">
          TAG: {tree.treeId}
        </span>
      </div>

      {/* Main Hero Card */}
      <div className="bg-[#1B5E34]/30 rounded-3xl border-2 border-[#1B5E34] p-6 sm:p-10 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#4CAF50] text-[#0D2818] text-[10px] font-extrabold uppercase tracking-wider mb-2">
              <TreePine className="w-3.5 h-3.5" />
              <span>Verified Kanvana Tree</span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9FBF7]">
              {tree.species}
            </h1>
            <p className="text-xs text-[#86EFAC] mt-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#F4C430]" />
              <span>{tree.locationName} ({tree.district})</span>
            </p>
          </div>

          {/* QR Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-[#F4C430] text-[#0D2818] p-3 flex items-center justify-center shadow-lg shrink-0">
            <QrCode className="w-10 h-10" />
          </div>
        </div>

        {/* Tree Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34]">
          <div>
            <span className="text-[10px] text-[#6B7F6E] uppercase font-semibold block">Planted By</span>
            <span className="font-display font-bold text-sm text-[#F4C430]">{tree.plantedBy}</span>
          </div>

          <div>
            <span className="text-[10px] text-[#6B7F6E] uppercase font-semibold block">Planted Date</span>
            <span className="font-display font-bold text-sm text-[#F9FBF7]">{tree.plantedDate}</span>
          </div>

          <div>
            <span className="text-[10px] text-[#6B7F6E] uppercase font-semibold block">District</span>
            <span className="font-display font-bold text-sm text-[#86EFAC]">{tree.district}</span>
          </div>

          <div>
            <span className="text-[10px] text-[#6B7F6E] uppercase font-semibold block">GPS Coordinates</span>
            <span className="font-mono text-xs text-[#F9FBF7]">
              {tree.gps?.lat.toFixed(3)}, {tree.gps?.lng.toFixed(3)}
            </span>
          </div>
        </div>

        {/* Photo Gallery */}
        <div>
          <h3 className="font-display font-bold text-sm text-[#86EFAC] uppercase tracking-wider mb-3">
            Tree Field Photos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tree.photos.map((photo, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-[#1B5E34] h-52 bg-[#0D2818]">
                <img src={photo} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>

        {/* Growth Log Diary */}
        <div className="space-y-4 pt-4 border-t border-[#1B5E34]">
          <h3 className="font-display font-bold text-lg text-[#F9FBF7] flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#F4C430]" />
            <span>Growth Log & Diary</span>
          </h3>

          <div className="space-y-3">
            {tree.growthLog.map((log, idx) => (
              <div key={idx} className="bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#86EFAC]">Logged on {log.date}</span>
                  <span className="text-[10px] text-[#6B7F6E]">Kanvana Surveyor Inspection</span>
                </div>
                <p className="text-xs text-[#F9FBF7]/80">{log.note}</p>
              </div>
            ))}
          </div>

          {/* Add Growth Update Form */}
          <form onSubmit={handleAddGrowthLog} className="pt-4 border-t border-[#1B5E34] space-y-3">
            <label className="text-xs font-bold uppercase text-[#86EFAC] block">
              ✍️ Add Field Inspection Note
            </label>

            {logAddedMsg && (
              <p className="text-xs text-[#4CAF50] font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Growth note logged successfully!</span>
              </p>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newLogNote}
                onChange={(e) => setNewLogNote(e.target.value)}
                placeholder="e.g. Watered today. New green shoots emerging..."
                className="flex-1 bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
              />

              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase"
              >
                Log Note
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};
