import React, { useState } from 'react';
import { Award, Printer, Sparkles, CheckCircle2, Search, Leaf, ShieldCheck, QrCode } from 'lucide-react';
import { Language } from '../../types';
import { store } from '../../services/store';
import confetti from 'canvas-confetti';

interface CertificateGeneratorSectionProps {
  language: Language;
  onOpenCertificateModal: (data: { name: string; trees: number; location: string; date: string }) => void;
}

export const CertificateGeneratorSection: React.FC<CertificateGeneratorSectionProps> = ({
  language,
  onOpenCertificateModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [volunteerName, setVolunteerName] = useState('');
  const [treeCount, setTreeCount] = useState<number>(10);
  const [location, setLocation] = useState('Nankari, IIT Kanpur');
  const [foundTreeInfo, setFoundTreeInfo] = useState<string | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toUpperCase();
    const trees = store.getTrees();
    const found = trees.find(t => {
      const id = t.treeId.toUpperCase();
      return id === query || id === `KANVANA-TREE-${query}` || id.endsWith(`-${query}`) || t.plantedBy.toUpperCase().includes(query);
    });

    if (found) {
      setVolunteerName(found.plantedBy);
      setTreeCount(1);
      setLocation(found.locationName || found.district);
      setFoundTreeInfo(`✅ Found Registered Tree Tag: ${found.treeId} (${found.species})`);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      // Also check submissions
      const subs = store.getSubmissions();
      const subFound = subs.find(s => s.volunteerName.toUpperCase().includes(query) || (s.treeId && s.treeId.toUpperCase().includes(query)));
      
      if (subFound) {
        setVolunteerName(subFound.volunteerName);
        setTreeCount(subFound.treesCount || 5);
        setLocation(subFound.locationName || subFound.volunteerVillage);
        setFoundTreeInfo(`✅ Found Volunteer Record for "${subFound.volunteerName}"`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else {
        setFoundTreeInfo(`ℹ️ Custom details applied. Enter your name below to issue a verified e-Certificate.`);
      }
    }
  };

  const handleGenerateClick = () => {
    const finalName = volunteerName.trim() || 'Kanvana Environmental Volunteer';
    const finalLoc = location.trim() || 'Nankari, IIT Kanpur';
    const finalTrees = treeCount || 10;
    const finalDate = new Date().toISOString().split('T')[0];

    // Save persistent log into store & trigger Google Sheets sync
    store.issueCertificate({
      recipientName: finalName,
      treesPlanted: finalTrees,
      location: finalLoc,
      issuedDate: finalDate,
      issuedBy: 'Public Portal'
    });

    onOpenCertificateModal({
      name: finalName,
      trees: finalTrees,
      location: finalLoc,
      date: finalDate
    });
  };

  return (
    <section id="certificate-generator" className="py-20 bg-[#0A3319] text-white relative border-b border-emerald-800 overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#16A34A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F4C430]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-[#F4C430]/50 text-[#F4C430] text-xs font-black uppercase tracking-wider shadow-lg">
            <Award className="w-4 h-4 text-[#F4C430]" />
            <span>Official Recognition Portal</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            {language === 'hi'
              ? 'इ-प्रमाणपत्र जनरेटर (e-Certificate)'
              : 'OFFICIAL VOLUNTEER e-CERTIFICATE GENERATOR'}
          </h2>
          <p className="text-emerald-100 text-sm sm:text-lg font-medium">
            {language === 'hi'
              ? 'अपना नाम या वृक्ष टैग आईडी (Tree ID) दर्ज करें और अपना आधिकारिक कनवना पर्यावरण सम्मान प्रमाण पत्र प्राप्त करें।'
              : 'Search by Tree Tag ID or enter your name to claim your official Kanvana Environmental Honor Certificate.'}
          </p>
        </div>

        {/* Generator Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0D2818]/90 p-6 sm:p-10 rounded-3xl border-2 border-[#16A34A]/50 shadow-2xl backdrop-blur-md">
          
          {/* Left Form Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Search Box */}
            <div className="bg-[#1B5E34]/30 p-5 rounded-2xl border border-emerald-600/40">
              <label className="text-xs font-bold text-[#F4C430] uppercase tracking-wider block mb-2 flex items-center space-x-1.5">
                <Search className="w-3.5 h-3.5 text-[#F4C430]" />
                <span>Search Record by Tree ID or Volunteer Name</span>
              </label>
              <form onSubmit={handleLookup} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. 0018 or Prashant or KANVANA-TREE-001"
                  className="flex-1 bg-[#0A3319] border border-emerald-500/50 rounded-xl px-3.5 py-2 text-xs text-white placeholder-emerald-400/60 focus:outline-none focus:border-[#F4C430]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#F4C430] text-[#0A3319] font-black text-xs uppercase rounded-xl hover:bg-[#86EFAC] transition-all cursor-pointer"
                >
                  Lookup
                </button>
              </form>
              {foundTreeInfo && (
                <p className="text-[11px] font-semibold text-[#86EFAC] mt-2.5 p-2 bg-[#0A3319]/80 rounded-lg border border-emerald-500/40">
                  {foundTreeInfo}
                </p>
              )}
            </div>

            {/* Custom Details Input */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-[#86EFAC] uppercase block mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  placeholder="e.g. Vaibhav Yadav"
                  className="w-full bg-[#0A3319] border border-emerald-600/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F4C430]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-[#86EFAC] uppercase block mb-1">
                    Trees Planted
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={treeCount}
                    onChange={(e) => setTreeCount(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#0A3319] border border-emerald-600/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F4C430]"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-[#86EFAC] uppercase block mb-1">
                    District / Site
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Kanpur / Nankari"
                    className="w-full bg-[#0A3319] border border-emerald-600/60 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F4C430]"
                  />
                </div>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={handleGenerateClick}
              className="w-full py-4 rounded-2xl bg-[#F4C430] text-[#0A3319] font-black text-sm uppercase tracking-wider hover:bg-[#86EFAC] transition-all flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Printer className="w-5 h-5 text-[#0A3319]" />
              <span>Generate & Download Official e-Certificate</span>
            </button>

            <div className="flex items-center space-x-2 text-[11px] text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#F4C430] shrink-0" />
              <span>Includes verification QR Code, Reg No. KNV/2026/UP, and Official Gold Seal.</span>
            </div>
          </div>

          {/* Right Feature Summary & How-It-Works Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#1B5E34]/30 p-6 sm:p-8 rounded-2xl border border-emerald-600/40 space-y-6">
              <h3 className="font-display font-extrabold text-xl text-[#F4C430] flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#F4C430]" />
                <span>Features of Kanvana Verified e-Certificate</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0A3319] p-4 rounded-xl border border-emerald-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-[#86EFAC] font-bold text-xs uppercase">
                    <ShieldCheck className="w-4 h-4 text-[#F4C430]" />
                    <span>Official Gold Seal</span>
                  </div>
                  <p className="text-xs text-emerald-100/80">
                    Recognized under Kanvana Environmental Movement (Reg. KNV/2026/UP).
                  </p>
                </div>

                <div className="bg-[#0A3319] p-4 rounded-xl border border-emerald-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-[#86EFAC] font-bold text-xs uppercase">
                    <QrCode className="w-4 h-4 text-[#F4C430]" />
                    <span>Live QR Verification</span>
                  </div>
                  <p className="text-xs text-emerald-100/80">
                    Scan anytime to verify authenticity and linked GIS tree location.
                  </p>
                </div>

                <div className="bg-[#0A3319] p-4 rounded-xl border border-emerald-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-[#86EFAC] font-bold text-xs uppercase">
                    <Award className="w-4 h-4 text-[#F4C430]" />
                    <span>Director Signature</span>
                  </div>
                  <p className="text-xs text-emerald-100/80">
                    Signed digitally by Founding Director Prashant Yadav.
                  </p>
                </div>

                <div className="bg-[#0A3319] p-4 rounded-xl border border-emerald-500/30 space-y-1">
                  <div className="flex items-center space-x-2 text-[#86EFAC] font-bold text-xs uppercase">
                    <Printer className="w-4 h-4 text-[#F4C430]" />
                    <span>Instant High-Res Print</span>
                  </div>
                  <p className="text-xs text-emerald-100/80">
                    Ready to download, save as PDF, or frame for your portfolio.
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="pt-4 border-t border-emerald-600/40">
                <h4 className="text-xs font-black text-[#86EFAC] uppercase tracking-wider mb-3">
                  How to get your certificate (3 Easy Steps):
                </h4>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-100">
                  <li className="flex items-start space-x-2 bg-[#0A3319]/80 p-3 rounded-lg border border-emerald-500/20">
                    <span className="font-mono font-black text-[#F4C430]">1.</span>
                    <span>Search by Tree Tag ID or enter your full name.</span>
                  </li>
                  <li className="flex items-start space-x-2 bg-[#0A3319]/80 p-3 rounded-lg border border-emerald-500/20">
                    <span className="font-mono font-black text-[#F4C430]">2.</span>
                    <span>Click 'Generate & Download' button on the left.</span>
                  </li>
                  <li className="flex items-start space-x-2 bg-[#0A3319]/80 p-3 rounded-lg border border-emerald-500/20">
                    <span className="font-mono font-black text-[#F4C430]">3.</span>
                    <span>Your certificate pops up instantly ready to print/save!</span>
                  </li>
                </ol>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
