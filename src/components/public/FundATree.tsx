import React, { useState } from 'react';
import { 
  Heart, CheckCircle2, ShieldAlert, Copy, ExternalLink, 
  Upload, X, Award, Printer, Share2, Sparkles, Leaf, Check, FileImage 
} from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../common/translations';
import { store } from '../../services/store';

interface FundATreeProps {
  language: Language;
}

interface Tier {
  amount: number;
  title: string;
  treesCount: number;
  desc: string;
  perks: string[];
  popular?: boolean;
}

export const FundATree: React.FC<FundATreeProps> = ({ language }) => {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form State
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorVillage, setDonorVillage] = useState('Kanpur Nagar');
  const [utrRef, setUtrRef] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Certificate State
  const [generatedCert, setGeneratedCert] = useState<{
    id: string;
    name: string;
    amount: number;
    treesCount: number;
    date: string;
  } | null>(null);

  const tiers: Tier[] = [
    {
      amount: 50,
      title: '₹50 / 1 Sapling Support',
      treesCount: 1,
      desc: 'Sponsor 1 native sapling with organic soil mix & sapling care.',
      perks: ['1 Sapling sponsored in your name', 'Instant Digital Certificate']
    },
    {
      amount: 100,
      title: '₹100 / 1 Tree Planted',
      treesCount: 1,
      desc: 'Plant 1 native sapling with organic manure & tree guard.',
      perks: ['1 Tree planted in field', 'Verified Certificate of Honor', 'WhatsApp photo update']
    },
    {
      amount: 200,
      title: '₹200 / 2 Trees + Tracking',
      treesCount: 2,
      desc: 'Plant 2 trees with unique digital IDs and Google Drive tracking.',
      perks: ['2 Trees planted', 'Unique Digital Tree ID', 'Growth updates on map', 'Official Certificate'],
      popular: true
    },
    {
      amount: 500,
      title: '₹500 / 5 Trees + Plaque',
      treesCount: 5,
      desc: 'Sponsor a mini plantation drive of 5 native trees.',
      perks: ['5 Trees planted in field', 'Honorary Certificate with QR', 'Field report & photo updates']
    }
  ];

  const upiId = '8318288563@upi';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=Kanvana%20Foundation&cu=INR`)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectTier = (tier: Tier) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitSponsorship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorPhone.trim()) {
      alert('Please fill in your Name and Phone Number.');
      return;
    }

    if (!selectedTier) return;

    setIsSubmitting(true);

    try {
      const certId = `KAN-CERT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      const certDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      // Add to central store -> triggers admin sync & webhook
      store.addSubmission({
        surveyorId: 'public-donor',
        surveyorName: 'Online Supporter',
        volunteerName: donorName.trim(),
        volunteerPhone: donorPhone.trim(),
        volunteerVillage: donorVillage.trim() || 'Kanpur Nagar',
        district: 'Kanpur Nagar',
        activityType: 'Tree Plantation',
        treesCount: selectedTier.treesCount,
        activityDate: new Date().toISOString().split('T')[0],
        locationName: donorVillage.trim() || 'Kanpur',
        gps: { lat: 26.4499, lng: 80.3319 },
        notes: `Sponsorship Tier: ₹${selectedTier.amount} (${selectedTier.title}) | UTR/Ref: ${utrRef || 'N/A'} | Email: ${donorEmail || 'N/A'} | Cert ID: ${certId}`,
        photoUrls: screenshotBase64 ? [screenshotBase64] : [],
        photoCaptions: ['Payment Screenshot'],
        consentGiven: true,
        treeSpecies: 'Neem / Peepal / Banyan Native Saplings'
      });

      // Prepare certificate modal
      setGeneratedCert({
        id: certId,
        name: donorName.trim(),
        amount: selectedTier.amount,
        treesCount: selectedTier.treesCount,
        date: certDate
      });

      // Close Form Modal
      setIsModalOpen(false);

      // Reset Form
      setDonorName('');
      setDonorPhone('');
      setDonorEmail('');
      setUtrRef('');
      setScreenshotBase64('');
      setScreenshotName('');

    } catch (err) {
      console.error(err);
      alert('An error occurred while saving your contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintCert = () => {
    window.print();
  };

  const handleWhatsAppCert = () => {
    if (!generatedCert) return;
    const msg = `Hello Kanvana Team! I have contributed ₹${generatedCert.amount} for ${generatedCert.treesCount} tree(s). My Name: ${generatedCert.name}, Certificate ID: ${generatedCert.id}`;
    window.open(`https://wa.me/918318288563?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section id="fund" className="py-24 bg-[#EDF5EE] text-slate-800 relative border-b border-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#0A3319] text-xs font-extrabold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-[#D97706] fill-current" />
            <span>Direct Field Funding & Sponsorship</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0A3319] tracking-tight">
            {getTranslation(language, 'fund_title')}
          </h2>

          <p className="text-sm sm:text-base text-slate-600">
            {getTranslation(language, 'fund_subtitle')}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tiers.map((t) => (
            <div
              key={t.amount}
              onClick={() => handleSelectTier(t)}
              className={`cursor-pointer rounded-3xl p-6 border-2 transition-all flex flex-col justify-between relative group hover:scale-[1.03] ${
                t.popular
                  ? 'bg-[#0A3319] text-white border-[#F4C430] shadow-2xl ring-4 ring-[#F4C430]/20'
                  : 'bg-white text-slate-900 border-emerald-100 hover:border-emerald-300 shadow-md'
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#F4C430] text-[#0A3319] text-[10px] font-extrabold uppercase px-3 py-0.5 rounded-full shadow-md flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>Most Popular</span>
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className={`font-display font-extrabold text-2xl block ${t.popular ? 'text-[#F4C430]' : 'text-[#15803D]'}`}>
                    {t.title}
                  </span>
                </div>

                <p className={`text-xs leading-relaxed ${t.popular ? 'text-emerald-100' : 'text-slate-600'}`}>
                  {t.desc}
                </p>

                <ul className={`space-y-2 pt-3 border-t ${t.popular ? 'border-emerald-800' : 'border-slate-100'}`}>
                  {t.perks.map((p, idx) => (
                    <li key={idx} className={`flex items-start space-x-2 text-xs ${t.popular ? 'text-emerald-200' : 'text-slate-700'}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${t.popular ? 'text-[#F4C430]' : 'text-[#15803D]'}`} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTier(t);
                  }}
                  className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer ${
                    t.popular
                      ? 'bg-[#F4C430] hover:bg-white text-[#0A3319]'
                      : 'bg-emerald-50 hover:bg-[#0A3319] text-[#15803D] hover:text-[#F4C430] border border-emerald-200'
                  }`}
                >
                  <Leaf className="w-4 h-4" />
                  <span>Select ₹{t.amount} Tier</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Bank Details & Verification Info Banner */}
        <div className="bg-[#0A3319] text-white rounded-3xl border-2 border-[#F4C430] p-6 lg:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* QR Code & UPI Copy */}
          <div className="lg:col-span-4 flex flex-col items-center text-center p-5 bg-[#031A0D] rounded-2xl border-2 border-emerald-500/40 relative z-10 shadow-inner">
            <div className="w-44 h-44 bg-white p-2.5 rounded-2xl shadow-xl flex flex-col items-center justify-center mb-3 border-4 border-[#F4C430]">
              <img
                src={qrCodeUrl}
                alt="Kanvana Foundation UPI QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs font-mono font-black text-[#86EFAC] tracking-wider">UPI ID: {upiId}</p>
            <button
              onClick={handleCopyUpi}
              className="mt-2.5 px-4 py-2 rounded-xl bg-[#F4C430] hover:bg-white text-[#0A3319] text-xs font-black transition-all flex items-center space-x-1.5 cursor-pointer shadow-lg hover:scale-105 active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied UPI ID!' : 'Copy UPI ID'}</span>
            </button>
          </div>

          {/* Account Details Box - High Contrast & Crisp Visibility */}
          <div className="lg:col-span-8 space-y-5 relative z-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#F4C430] block mb-1">
                Direct Bank Transfer Account
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-wide">
                KANVANA FOUNDATION OFFICIAL ACCOUNT
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#031A0D] p-5 sm:p-6 rounded-2xl border-2 border-emerald-500/50 text-sm shadow-inner">
              <div className="border-b sm:border-b-0 sm:border-r border-emerald-800/80 pb-3 sm:pb-0 sm:pr-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300 font-bold text-xs sm:text-sm">Account Holder:</span>
                  <span className="font-black text-white text-sm sm:text-base">Prashant Yadav</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300 font-bold text-xs sm:text-sm">Bank Name:</span>
                  <span className="font-black text-white text-sm sm:text-base">Kotak Mahindra Bank</span>
                </div>
              </div>

              <div className="pt-2 sm:pt-0 sm:pl-2 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300 font-bold text-xs sm:text-sm">Account No:</span>
                  <span className="font-mono font-black text-[#F4C430] text-sm sm:text-base bg-[#082813] px-2.5 py-1 rounded-lg border border-amber-500/50 shadow-inner">
                    6349227535
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-300 font-bold text-xs sm:text-sm">IFSC Code:</span>
                  <span className="font-mono font-black text-[#86EFAC] text-sm sm:text-base bg-[#082813] px-2.5 py-1 rounded-lg border border-emerald-500/50 shadow-inner">
                    KKBK0005133
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-400/50 text-xs sm:text-sm text-amber-200 flex items-start space-x-3 shadow-md">
              <ShieldAlert className="w-5 h-5 shrink-0 text-[#F4C430] mt-0.5" />
              <p className="leading-relaxed">
                Click any Tier above to open the instant Info & Payment form. Upload your payment screenshot to automatically send your details to the Admin Panel and receive your official Digital Certificate!
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL 1: SPONSORSHIP INFO & PAYMENT FORM MODAL */}
      {isModalOpen && selectedTier && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6">
          <div className="min-h-full w-full flex items-center justify-center py-4 sm:py-8">
            <div className="bg-[#0A3319] border-2 border-[#F4C430] rounded-2xl sm:rounded-3xl max-w-xl w-full p-5 sm:p-8 text-white shadow-2xl relative my-auto animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#15803D] text-[#86EFAC] hover:bg-[#F4C430] hover:text-[#0A3319] transition-all cursor-pointer z-10 shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F4C430] text-[#0D2818] text-xs font-black uppercase tracking-wider">
                <Award className="w-3.5 h-3.5" />
                <span>Selected: {selectedTier.title}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#F9FBF7] font-display">
                Complete Tree Sponsorship Details
              </h3>
              <p className="text-xs text-[#86EFAC]">
                Enter your info and upload your payment screenshot to generate your certificate.
              </p>
            </div>

            {/* Quick UPI QR & Bank Section */}
            <div className="bg-[#123820] p-4 rounded-2xl border border-[#1B5E34] mb-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-28 h-28 bg-white p-1.5 rounded-xl border-2 border-[#F4C430] shrink-0">
                <img src={qrCodeUrl} alt="UPI QR" className="w-full h-full object-contain" />
              </div>
              <div className="text-xs space-y-1.5 w-full">
                <div className="flex justify-between items-center bg-[#0D2818] p-2 rounded-lg border border-[#1B5E34]">
                  <span className="text-[#86EFAC] font-mono font-bold">{upiId}</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-2 py-0.5 bg-[#1B5E34] text-[#86EFAC] hover:bg-[#4CAF50] hover:text-[#0D2818] rounded text-[10px] font-bold"
                  >
                    {copied ? 'Copied' : 'Copy UPI'}
                  </button>
                </div>
                <p className="text-[11px] text-[#F9FBF7]/80">
                  <strong className="text-[#F4C430]">Kotak Bank:</strong> 6349227535 | <strong className="text-[#86EFAC]">IFSC:</strong> KKBK0005133 (Prashant Yadav)
                </p>
                <p className="text-[10px] text-[#F4C430]/90 italic">
                  * Scan QR or send ₹{selectedTier.amount} via GPay/PhonePe/Paytm, then attach screenshot below.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitSponsorship} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#86EFAC] mb-1">
                  Your Full Name * (Appears on Certificate)
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-[#08180E] border border-[#1B5E34] focus:border-[#F4C430] rounded-xl text-xs text-[#F9FBF7] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#86EFAC] mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 bg-[#08180E] border border-[#1B5E34] focus:border-[#F4C430] rounded-xl text-xs text-[#F9FBF7] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#86EFAC] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-4 py-2.5 bg-[#08180E] border border-[#1B5E34] focus:border-[#F4C430] rounded-xl text-xs text-[#F9FBF7] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#86EFAC] mb-1">
                  Location / District / Village
                </label>
                <input
                  type="text"
                  value={donorVillage}
                  onChange={(e) => setDonorVillage(e.target.value)}
                  placeholder="e.g. Kanpur Nagar / Kalyanpur"
                  className="w-full px-4 py-2.5 bg-[#08180E] border border-[#1B5E34] focus:border-[#F4C430] rounded-xl text-xs text-[#F9FBF7] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#86EFAC] mb-1">
                    Upload Payment Screenshot
                  </label>
                  <label className="flex items-center space-x-2 px-3 py-2 bg-[#08180E] border border-dashed border-[#1B5E34] hover:border-[#4CAF50] rounded-xl cursor-pointer transition-all text-xs text-[#86EFAC]">
                    <Upload className="w-4 h-4 text-[#F4C430]" />
                    <span className="truncate">{screenshotName || 'Choose image file...'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#86EFAC] mb-1">
                    UPI Ref / UTR No. (Optional)
                  </label>
                  <input
                    type="text"
                    value={utrRef}
                    onChange={(e) => setUtrRef(e.target.value)}
                    placeholder="e.g. 4231XXXXXX"
                    className="w-full px-4 py-2.5 bg-[#08180E] border border-[#1B5E34] focus:border-[#F4C430] rounded-xl text-xs text-[#F9FBF7] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Preview screenshot */}
              {screenshotBase64 && (
                <div className="mt-2 p-2 bg-[#123820] rounded-xl border border-[#1B5E34] flex items-center space-x-3">
                  <img src={screenshotBase64} alt="Payment Screenshot" className="w-12 h-12 object-cover rounded-lg border border-[#F4C430]" />
                  <div className="text-xs">
                    <p className="font-bold text-[#86EFAC] flex items-center space-x-1">
                      <FileImage className="w-3.5 h-3.5 text-[#F4C430]" />
                      <span>Payment Screenshot Attached</span>
                    </p>
                    <p className="text-[10px] text-[#F9FBF7]/70">Will be sent to Admin Dashboard & Drive.</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#4CAF50] hover:bg-[#86EFAC] text-[#0D2818] font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.01]"
                >
                  <Award className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving Contribution...' : 'Submit & Get Digital Certificate'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
      )}

      {/* MODAL 2: GENERATED DIGITAL CERTIFICATE MODAL */}
      {generatedCert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6">
          <div className="min-h-full w-full flex items-center justify-center py-4 sm:py-8">
            <div className="bg-[#FFFDF6] text-[#0D2818] rounded-2xl sm:rounded-3xl max-w-2xl w-full p-5 sm:p-10 border-8 border-[#15803D] shadow-2xl relative my-auto animate-in fade-in zoom-in duration-300">
            
            {/* Close Button */}
            <button
              onClick={() => setGeneratedCert(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#1B5E34] text-[#86EFAC] hover:bg-[#0D2818] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner Gold Frame */}
            <div className="border-2 border-[#F4C430] p-6 sm:p-8 rounded-2xl bg-white/80 text-center relative overflow-hidden">
              
              {/* Watermark Seal */}
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Leaf className="w-80 h-80 text-[#1B5E34]" />
              </div>

              {/* Certificate Header */}
              <div className="space-y-2 mb-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1B5E34] text-[#86EFAC] text-[11px] font-bold uppercase tracking-widest">
                  <Leaf className="w-3.5 h-3.5 text-[#F4C430]" />
                  <span>Kanvana Foundation • Kanpur</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold font-display text-[#1B5E34] tracking-tight uppercase pt-2">
                  CERTIFICATE OF HONOR
                </h2>
                <p className="text-xs font-bold text-[#F4C430] tracking-widest uppercase">
                  पर्यावरण सम्मान पत्र
                </p>
              </div>

              {/* Recipient */}
              <div className="my-6 space-y-2">
                <p className="text-xs text-[#555] uppercase tracking-wider">This is proudly presented to</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0D2818] font-display underline decoration-[#F4C430] decoration-2 underline-offset-8">
                  {generatedCert.name}
                </h3>
              </div>

              {/* Body */}
              <p className="text-xs sm:text-sm text-[#333] max-w-md mx-auto leading-relaxed my-6">
                In sincere appreciation for your invaluable contribution of <strong className="text-[#1B5E34]">₹{generatedCert.amount}</strong> toward planting <strong className="text-[#1B5E34]">{generatedCert.treesCount} Native Tree(s)</strong> in Kanpur & surrounding districts.
              </p>

              {/* Metadata & Signatures */}
              <div className="pt-6 border-t border-[#E2E8F0] grid grid-cols-2 gap-4 items-end text-left text-[11px]">
                <div className="space-y-1">
                  <p className="text-gray-500 font-mono">Cert ID: <strong className="text-[#0D2818]">{generatedCert.id}</strong></p>
                  <p className="text-gray-500">Issued On: <strong className="text-[#0D2818]">{generatedCert.date}</strong></p>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-serif italic text-lg font-bold text-[#1B5E34]">Prashant Yadav</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider border-t border-gray-300 pt-0.5 inline-block">
                    Founder, Kanvana Foundation
                  </div>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrintCert}
                className="flex-1 py-3 bg-[#1B5E34] hover:bg-[#0D2818] text-[#86EFAC] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Certificate</span>
              </button>

              <button
                onClick={handleWhatsAppCert}
                className="flex-1 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </button>

              <button
                onClick={() => setGeneratedCert(null)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-bold uppercase transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
      )}

    </section>
  );
};
