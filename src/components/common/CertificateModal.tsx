import React, { useState, useEffect } from 'react';
import { X, Award, Printer, CheckCircle2, Leaf, Sparkles, ShieldCheck, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialTrees?: number;
  initialLocation?: string;
  initialDate?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  initialName = 'Volunteer (Field Site)',
  initialTrees = 25,
  initialLocation = 'Nankari, IIT Kanpur',
  initialDate
}) => {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [name, setName] = useState(initialName);
  const [trees, setTrees] = useState(initialTrees);
  const [location, setLocation] = useState(initialLocation);
  const [date, setDate] = useState(getTodayDate());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setName(initialName);
    setTrees(initialTrees);
    setLocation(initialLocation);
    // Always default date to current date when opened/updated
    setDate(initialDate && initialDate.length > 0 ? initialDate : getTodayDate());
  }, [initialName, initialTrees, initialLocation, initialDate, isOpen]);

  if (!isOpen) return null;

  const certNumber = `KNV-CERT-${date.replace(/-/g, '')}-${Math.abs(name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 100))}`;

  const currentVerificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?verify=${certNumber}`
    : `https://kanvana.org/verify?cert=${certNumber}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentVerificationUrl)}`;

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#4CAF50', '#86EFAC', '#F4C430', '#1B5E34']
    });
  };

  const handlePrint = () => {
    triggerConfetti();

    // Trigger native browser print
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const handleOpenPrintWindow = () => {
    triggerConfetti();
    const printContent = document.getElementById('printable-certificate')?.outerHTML;
    if (!printContent) return;

    const printWin = window.open('', '_blank', 'width=1100,height=800');
    if (printWin) {
      printWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Kanvana Foundation Certificate - ${name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @page { size: landscape A4; margin: 10mm; }
              body { background: #ffffff; padding: 20px; font-family: system-ui, sans-serif; }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              setTimeout(() => { window.print(); }, 500);
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 no-print-bg">
      {/* Print CSS styles */}
      <style>{`
        @media print {
          @page {
            size: landscape A4;
            margin: 0;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible !important;
          }
          #printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 2.5rem !important;
            box-sizing: border-box !important;
            background-color: #FAF9F5 !important;
            border: 12px double #1B5E34 !important;
            box-shadow: none !important;
            z-index: 999999 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-full w-full flex items-center justify-center py-4 sm:py-8">
        <div className="bg-[#0A3319] border-2 border-[#15803D] rounded-2xl sm:rounded-3xl max-w-5xl w-full p-4 sm:p-8 shadow-2xl relative text-white my-auto no-print">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-[#1B5E34]/50 hover:bg-[#1B5E34] text-[#F9FBF7] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-7 h-7 text-[#F4C430]" />
          <div>
            <h2 className="font-display font-bold text-2xl text-[#F9FBF7]">
              Official Environmental Honor Certificate
            </h2>
            <p className="text-xs text-[#86EFAC]">
              Customize details below to generate an official Kanvana Foundation certificate.
            </p>
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 p-4 bg-[#1B5E34]/30 rounded-2xl border border-[#1B5E34]">
          <div>
            <label className="text-[11px] font-semibold text-[#86EFAC] uppercase block mb-1">
              Volunteer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-xl px-3 py-1.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#86EFAC] uppercase block mb-1">
              Trees Planted
            </label>
            <input
              type="number"
              value={trees}
              onChange={(e) => setTrees(Number(e.target.value))}
              className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-xl px-3 py-1.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#86EFAC] uppercase block mb-1">
              Location / District
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-xl px-3 py-1.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#86EFAC] uppercase block mb-1">
              Issue Date (Current)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-xl px-3 py-1.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
            />
          </div>
        </div>

        {/* Highly Attractive Royal Certificate Display Card */}
        <div 
          id="printable-certificate"
          className="bg-[#FAF9F5] text-[#0D2818] p-8 lg:p-14 rounded-3xl border-[10px] border-[#1B5E34] shadow-2xl relative overflow-hidden text-center my-4 font-sans select-none"
        >
          {/* Outer Filigree Gold Border Frame */}
          <div className="absolute inset-3 border-2 border-[#D4AF37] rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 border border-[#1B5E34]/30 rounded-xl pointer-events-none" />

          {/* Decorative Corner Filigree Ornaments */}
          <div className="absolute top-6 left-6 w-14 h-14 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-lg" />
          <div className="absolute top-6 right-6 w-14 h-14 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-lg" />
          <div className="absolute bottom-6 left-6 w-14 h-14 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-lg" />
          <div className="absolute bottom-6 right-6 w-14 h-14 border-b-4 border-r-4 border-[#D4AF37] rounded-br-lg" />

          {/* Background Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Leaf className="w-96 h-96 text-[#1B5E34]" />
          </div>

          {/* Header & Logo */}
          <div className="relative z-10 flex flex-col items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1B5E34] to-[#0D2818] p-4 text-[#F4C430] flex items-center justify-center shadow-xl border-2 border-[#D4AF37] mb-3">
              <Leaf className="w-12 h-12 text-[#F4C430]" />
            </div>
            
            <span className="font-display font-black text-2xl lg:text-3xl tracking-widest text-[#0D2818] uppercase">
              KANVANA FOUNDATION
            </span>
            <span className="text-xs font-bold text-[#1B5E34] tracking-[0.25em] uppercase mt-1">
              ENVIRONMENTAL CONSERVATION COUNCIL • NANKARI, IIT KANPUR
            </span>
            <span className="text-[10px] font-mono text-[#6B7F6E] mt-0.5">
              Reg. No: KNV/2026/UP/0481 • {certNumber}
            </span>
          </div>

          <div className="w-48 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-3" />

          {/* Title */}
          <div className="relative z-10 my-3">
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-wider text-[#1B5E34] drop-shadow-sm">
              CERTIFICATE OF ENVIRONMENTAL HONOR
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#556B2F] mt-2 font-medium">
              This official honor is proudly presented to
            </p>
          </div>

          {/* Recipient Name */}
          <div className="relative z-10 my-4 py-2">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#0D2818] tracking-wide inline-block px-8 py-2 border-b-4 border-[#F4C430] bg-[#1B5E34]/5 rounded-xl">
              {name || 'Volunteer Name'}
            </h2>
          </div>

          {/* Citation Body */}
          <p className="relative z-10 text-sm sm:text-base text-[#1A2E1F] max-w-3xl mx-auto leading-relaxed my-4 px-4 font-medium">
            In deep recognition of selfless service and dedication toward greening India. For successfully leading and planting{' '}
            <strong className="text-[#1B5E34] font-extrabold text-lg px-2 py-0.5 bg-[#4CAF50]/15 rounded-md border border-[#4CAF50]/30">{trees} Trees</strong>{' '}
            at <strong className="text-[#0D2818] font-bold underline decoration-[#D4AF37]">{location}</strong>, directly contributing to habitat restoration and carbon reduction under Kanvana Movement.
          </p>

          {/* Signature, Stamp & Verification Row */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-6 border-t-2 border-[#D4AF37]/40 items-end max-w-3xl mx-auto">
            {/* Left: Founder Signature */}
            <div className="text-center sm:text-left">
              <div className="font-serif italic text-2xl lg:text-3xl font-bold text-[#1B5E34] tracking-wide mb-1 select-none">
                Prashant Yadav
              </div>
              <div className="w-36 h-0.5 bg-[#0D2818]/30 mb-1 mx-auto sm:mx-0" />
              <p className="font-display text-xs font-extrabold uppercase text-[#0D2818] tracking-wider">
                PRASHANT YADAV
              </p>
              <p className="text-[11px] font-semibold text-[#556B2F]">
                Founding Director • Kanvana
              </p>
            </div>

            {/* Middle: Gold Metallic Medal Seal */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-4 border-[#D4AF37] bg-gradient-to-br from-[#FFF9E6] via-[#F4C430]/20 to-[#D4AF37]/30 flex flex-col items-center justify-center p-2 text-[#0D2818] shadow-lg relative">
                <ShieldCheck className="w-7 h-7 text-[#1B5E34] mb-0.5" />
                <span className="text-[9px] font-black tracking-widest uppercase leading-tight text-[#0D2818]">
                  VERIFIED
                </span>
                <span className="text-[8px] font-bold text-[#1B5E34] tracking-tight">
                  OFFICIAL SEAL
                </span>
                <span className="text-[7px] font-mono font-bold text-[#6B7F6E]">ESTD 2026</span>
              </div>
              <p className="text-[11px] font-mono font-bold text-[#1B5E34] mt-2">
                Issued Date: {date}
              </p>
            </div>

            {/* Right: Verification QR & Reg */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
              <div className="p-2 bg-white rounded-xl border-2 border-[#1B5E34] shadow-sm mb-1 flex items-center space-x-2">
                <img 
                  src={qrImageUrl} 
                  alt="Scannable Verification QR Code" 
                  className="w-12 h-12 object-contain bg-white rounded border border-gray-200" 
                  referrerPolicy="no-referrer"
                />
                <div className="text-[9px] text-left font-mono text-[#1B5E34] leading-tight">
                  <span className="font-bold block text-[#0D2818]">SCAN TO VERIFY</span>
                  <span className="text-[8px] text-[#1B5E34] font-semibold block">{certNumber}</span>
                  <span className="text-[7px] text-[#6B7F6E] block">Official Digital Record</span>
                </div>
              </div>
              <p className="text-[10px] text-[#6B7F6E]">Authentic Digital Certificate</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <button
            onClick={() => {
              triggerConfetti();
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#1B5E34] text-xs font-semibold text-[#86EFAC] hover:bg-[#1B5E34]/80 transition-colors flex items-center space-x-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-[#86EFAC]" /> : <Award className="w-4 h-4 text-[#F4C430]" />}
            <span>{copied ? 'Certificate Code Verified!' : 'Verify Certificate Code'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenPrintWindow}
              className="px-6 py-3 rounded-xl bg-[#F4C430] text-[#0D2818] font-black text-xs uppercase tracking-wider hover:bg-[#86EFAC] transition-all flex items-center space-x-2 shadow-xl hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#0D2818]" />
              <span>🖨️ Print / Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
