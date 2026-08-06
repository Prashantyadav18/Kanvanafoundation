import React, { useState } from 'react';
import { Tag, Search, ShieldCheck, Database, ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { TreeProfile, Language } from '../../types';

interface TreeQRSectionProps {
  trees: TreeProfile[];
  language: Language;
  onSelectTree: (treeId: string) => void;
}

export const TreeQRSection: React.FC<TreeQRSectionProps> = ({
  trees,
  onSelectTree
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const trimmed = searchCode.trim().toUpperCase();
    const found = trees.find(t => t.treeId.toUpperCase() === trimmed);

    if (found) {
      onSelectTree(found.treeId);
    } else {
      setErrorMsg(`No tree record found with ID "${searchCode}". Try KANVANA-TREE-001`);
    }
  };

  return (
    <section id="tree-qr" className="py-24 bg-[#0D2818] text-[#F9FBF7] relative border-b border-[#1B5E34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Info & Search Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1B5E34] text-[#F4C430] text-xs font-bold uppercase tracking-wider border border-[#4CAF50]/30">
                <Tag className="w-3.5 h-3.5" />
                <span>Zero-Cost Digital ID System</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#4CAF50] text-[#0D2818] text-xs font-black uppercase tracking-wider">
                ⚡ 100% FREE & VERIFIED
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F9FBF7] tracking-tight">
              UNIQUE <span className="text-[#86EFAC]">DIGITAL TREE ID</span> REGISTRY
            </h2>

            <p className="text-sm sm:text-base text-[#F9FBF7]/80 leading-relaxed">
              Physical tags are expensive and unnecessary! Kanvana operates a <strong>100% zero-cost Unique Digital Tree ID System</strong>. Every planted sapling receives a non-repeating Unique Tree ID (e.g. <code className="text-[#F4C430] bg-[#0D2818] px-1.5 py-0.5 rounded border border-[#1B5E34]">KANVANA-TREE-001</code>) that is strictly validated against duplication and synced directly to our central Google Drive database.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              <div className="p-4 rounded-2xl bg-[#1B5E34]/30 border border-[#1B5E34]">
                <Lock className="w-6 h-6 text-[#4CAF50] mb-2" />
                <h4 className="font-display font-bold text-sm text-[#F9FBF7]">Strict Anti-Duplication</h4>
                <p className="text-xs text-[#6B7F6E] mt-1">
                  Guaranteed unique Tree IDs so no two trees share the same registration identity.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B5E34]/30 border border-[#1B5E34]">
                <Database className="w-6 h-6 text-[#F4C430] mb-2" />
                <h4 className="font-display font-bold text-sm text-[#F9FBF7]">Google Drive Database</h4>
                <p className="text-xs text-[#6B7F6E] mt-1">
                  Synced in real-time to central Google Drive spreadsheet for full transparency.
                </p>
              </div>
            </div>

            {/* Tree ID Lookup Search Box */}
            <div className="p-6 rounded-3xl bg-[#1B5E34]/40 border-2 border-[#1B5E34] space-y-4">
              <label className="font-display font-bold text-sm text-[#F4C430] block">
                🔍 Lookup Tree by Unique Digital ID
              </label>

              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Enter Unique Tree ID (e.g., KANVANA-TREE-001)"
                  className="flex-1 bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-3 text-xs text-[#F9FBF7] placeholder-[#6B7F6E] focus:outline-none focus:border-[#4CAF50]"
                />

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#86EFAC] transition-all flex items-center space-x-1"
                >
                  <Search className="w-4 h-4" />
                  <span>Lookup</span>
                </button>
              </form>

              {errorMsg && (
                <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
              )}

              {/* Sample Quick Links */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-[#6B7F6E]">Sample Digital Tree IDs:</span>
                {trees.slice(0, 3).map((t) => (
                  <button
                    key={t.treeId}
                    onClick={() => onSelectTree(t.treeId)}
                    className="px-2.5 py-1 rounded-lg bg-[#0D2818] hover:bg-[#1B5E34] text-[11px] text-[#86EFAC] font-mono border border-[#1B5E34] transition-colors flex items-center space-x-1"
                  >
                    <span>{t.treeId}</span>
                    <ExternalLink className="w-3 h-3 text-[#F4C430]" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup / ID Tag Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm bg-[#1B5E34]/40 p-8 rounded-3xl border-2 border-[#1B5E34] shadow-2xl text-center space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-[#4CAF50] text-[#0D2818] p-4 mx-auto flex items-center justify-center shadow-lg">
                <Tag className="w-12 h-12" />
              </div>

              <div>
                <h3 className="font-display font-extrabold text-xl text-[#F9FBF7]">
                  REGISTERED BY KANVANA
                </h3>
                <p className="text-xs text-[#86EFAC] font-mono mt-0.5">
                  UNIQUE ID: KANVANA-TREE-001
                </p>
              </div>

              <div className="bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34] space-y-2 text-left">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7F6E]">Species:</span>
                  <span className="text-[#F9FBF7] font-semibold">Neem Tree</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7F6E]">Planted By:</span>
                  <span className="text-[#F4C430] font-semibold">Volunteer (Field Site)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7F6E]">Location:</span>
                  <span className="text-[#86EFAC] font-semibold">Nankari, IIT Kanpur</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7F6E]">Drive Status:</span>
                  <span className="text-[#4CAF50] font-semibold">✓ Synced to Database</span>
                </div>
              </div>

              <button
                onClick={() => onSelectTree('KANVANA-TREE-001')}
                className="w-full py-3 rounded-2xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#FFF5C0] transition-colors flex items-center justify-center space-x-2"
              >
                <span>View Sample Tree Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
