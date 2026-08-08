import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, 
  Download, Printer, Sparkles, FileText, CheckCircle2, TreePine, 
  QrCode, ShieldCheck, Award, MapPin, Users, Globe, ExternalLink,
  Presentation, Lightbulb, TrendingUp, Heart
} from 'lucide-react';
import { store } from '../../services/store';

interface ClientPitchDeckProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlanting?: () => void;
}

export const ClientPitchDeck: React.FC<ClientPitchDeckProps> = ({
  isOpen,
  onClose,
  onStartPlanting
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const stats = store.getStats();
  const storyImages = store.getStoryImages();

  // Download standalone offline Presentation Deck HTML
  const handleDownloadDeck = () => {
    const slideItems = [
      {
        badge: 'Executive Pitch Deck 2026',
        title: 'Kanvana Foundation: Green Kanpur Revolution',
        subtitle: 'Reclaiming Kanpur & Uttar Pradesh through Digital Geotagged Plantation Drives',
        notes: 'Greet the client/sponsor warmly. Core goal: Planting 10,000+ native geotagged trees across Nankari, Kanpur & UP by Aug 15, 2026.',
        body: `
          <div class="grid">
            <div class="card"><div class="stat-number">${stats.treesPlanted.toLocaleString()}+</div><div style="font-size:11px;color:#86EFAC;">Trees Planted</div></div>
            <div class="card"><div class="stat-number">10,000</div><div style="font-size:11px;color:#86EFAC;">2026 Target</div></div>
            <div class="card"><div class="stat-number">100%</div><div style="font-size:11px;color:#86EFAC;">GPS Geotagged</div></div>
            <div class="card"><div class="stat-number">${stats.volunteersActive}+</div><div style="font-size:11px;color:#86EFAC;">Active Volunteers</div></div>
          </div>
        `
      },
      {
        badge: 'The Environmental Imperative',
        title: 'Why Kanpur Needs Immediate Action',
        subtitle: 'Combating Industrial Air Pollution, Urban Heat Islands, and Groundwater Depletion',
        notes: 'Highlight severe air quality (AQI 300+) and heatwaves in Kanpur. Explain how native trees (Neem, Banyan, Peepal) save lives.',
        body: `
          <div class="grid">
            <div class="card"><h4 style="color:#f87171;">1. Hazardous AQI Levels</h4><p style="font-size:13px;">Kanpur AQI touches 300+ in peak winter. Particulate dust PM2.5 threatens public health.</p></div>
            <div class="card"><h4 style="color:#fbbf24;">2. Extreme Heat Waves</h4><p style="font-size:13px;">Summer temperatures cross 45°C due to concrete surfaces and lack of dense tree canopy.</p></div>
            <div class="card"><h4 style="color:#4CAF50;">3. The Kanvana Solution</h4><p style="font-size:13px;">Planting deep-rooted native trees that release maximum oxygen and cool ambient temperature by 4°C.</p></div>
          </div>
        `
      },
      {
        badge: 'Transparency & Technology',
        title: 'Digital Geotagging & Unique QR Registry',
        subtitle: 'Eliminating Ghost Plantations with 100% Real-Time GPS Tracking & Proof of Survival',
        notes: 'Emphasize trust & transparency! Every tree gets a unique QR Code with precise latitude/longitude coordinates and live status.',
        body: `
          <ul style="line-height:1.8;font-size:14px;">
            <li>✅ <strong>GPS Coordinate Locking:</strong> Exact latitude & longitude recorded during field planting.</li>
            <li>✅ <strong>Verification Badges:</strong> Multi-stage audit by field surveyors for 92%+ survival rate.</li>
            <li>✅ <strong>Live Sponsor Dashboard:</strong> Corporates & donors track tree growth & location anytime.</li>
          </ul>
        `
      },
      {
        badge: 'Sustainable Field Operations',
        title: '5-Stage Lifecycle & Terracotta Clay Irrigation',
        subtitle: 'Combining Traditional Clay Pot Sub-Surface Irrigation with Heavy-Duty Protection',
        notes: 'Explain our innovation: Terracotta earthen pots buried at root level save 70% water and protect roots during dry seasons.',
        body: `
          <div class="grid">
            <div class="card"><strong>01. Seedling</strong><br/><span style="font-size:12px;">Sown in Nankari Nursery</span></div>
            <div class="card"><strong>02. Sprouting</strong><br/><span style="font-size:12px;">Nurtured under natural light</span></div>
            <div class="card"><strong>03. Planting</strong><br/><span style="font-size:12px;">Guard + Clay pot setup</span></div>
            <div class="card"><strong>04. Geotagging</strong><br/><span style="font-size:12px;">QR assigned on portal</span></div>
            <div class="card"><strong>05. Mature Canopy</strong><br/><span style="font-size:12px;">Carbon-absorbing tree</span></div>
          </div>
        `
      },
      {
        badge: 'CSR & Sponsorship Models',
        title: 'Partner with Kanvana: Corporate CSR Packages',
        subtitle: 'Fulfill ESG Compliance, Gain Brand Goodwill, and Receive Verified Certificates',
        notes: 'Present clear packages: Citizen (5 trees), Corporate CSR (500+ trees), Institutional (1,000+ trees).',
        body: `
          <div class="grid">
            <div class="card"><h4 style="color:#F4C430;">Citizen Package</h4><p style="font-size:13px;">5 Trees • Personalized Impact Certificate + WhatsApp Growth Updates</p></div>
            <div class="card" style="border:2px solid #F4C430;"><h4 style="color:#86EFAC;">Corporate CSR Drive</h4><p style="font-size:13px;">500+ Trees • Dedicated Green Zone + Co-branded Steel Guards + Carbon Audit</p></div>
            <div class="card"><h4 style="color:#4CAF50;">Institutional Partner</h4><p style="font-size:13px;">1,000+ Trees • Mobile Inspector App + Auto Webhook Integration</p></div>
          </div>
        `
      },
      {
        badge: 'Seamless Data Integration',
        title: 'Automated Google Drive & Webhook Sync',
        subtitle: 'Zero Manual Entry — Field Submissions Sync Instantly to Cloud Repositories',
        notes: 'Demonstrate technical reliability: Mobile submissions automatically update Google Sheets and Google Drive photo archives.',
        body: `
          <p style="font-size:14px;line-height:1.6;">
            Field surveyors capture geotagged photos ➔ Data sent via Webhook ➔ Google Sheets master database & Google Drive folders updated in real-time.
          </p>
        `
      },
      {
        badge: 'Measurable Impact',
        title: 'Target Environmental Metrics by Aug 2026',
        subtitle: 'Tangible Ecological Benefits Delivered to Kanpur Citizens',
        notes: '10,000 trees produce 2.6M+ lbs of oxygen, absorb 480k lbs of CO2 annually, and create 100+ rural green jobs.',
        body: `
          <div class="grid">
            <div class="card"><div class="stat-number">2.6M+ lbs</div><div style="font-size:12px;">Annual Oxygen</div></div>
            <div class="card"><div class="stat-number">480,000 lbs</div><div style="font-size:12px;">CO₂ Neutralized</div></div>
            <div class="card"><div class="stat-number">-4°C</div><div style="font-size:12px;">Local Cooling</div></div>
            <div class="card"><div class="stat-number">100+</div><div style="font-size:12px;">Rural Jobs Created</div></div>
          </div>
        `
      },
      {
        badge: 'Join The Green Movement',
        title: 'Partner with Kanvana Foundation Today',
        subtitle: 'Let’s Build a Greener, Healthier Kanpur Together',
        notes: 'Invite clients to sponsor trees or call Founder (+91 91253 68361) for customized CSR proposals.',
        body: `
          <div style="text-align:center;padding:20px;background:#1B5E34;border-radius:12px;">
            <h3>Sponsor Trees & Schedule Field Visits Today</h3>
            <p style="font-size:14px;">📍 Nankari, Kanpur, UP | 📞 +91 91253 68361 | ✉️ contact@kanvana.org</p>
          </div>
        `
      }
    ];

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kanvana Foundation - Executive Pitch Deck 2026</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #041009; color: #F9FBF7; margin: 0; padding: 24px; }
    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1B5E34; padding-bottom: 20px; }
    .slide { background: #0D2818; border: 2px solid #1B5E34; border-radius: 16px; padding: 32px; margin-bottom: 30px; page-break-after: always; box-shadow: 0 8px 25px rgba(0,0,0,0.6); }
    .badge { display: inline-block; background: #F4C430; color: #0D2818; font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 5px 14px; border-radius: 20px; margin-bottom: 12px; }
    h1 { color: #F4C430; margin: 0 0 8px 0; font-size: 26px; }
    h2 { color: #F9FBF7; margin: 0 0 8px 0; font-size: 22px; }
    .subtitle { color: #86EFAC; font-size: 15px; margin-bottom: 24px; font-weight: 500; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; }
    .card { background: rgba(0,0,0,0.5); border: 1px solid #1B5E34; padding: 16px; border-radius: 12px; }
    .stat-number { font-size: 26px; font-weight: 900; color: #F4C430; }
    .notes { background: #1B5E34; border-left: 4px solid #F4C430; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-top: 24px; color: #86EFAC; }
    @media print {
      body { background: white; color: black; padding: 0; }
      .slide { background: white; color: black; border: 1px solid #999; box-shadow: none; page-break-after: always; }
      .badge { background: #0D2818; color: #F4C430; }
      .subtitle { color: #333; }
      .card { background: #f5f5f5; border: 1px solid #ccc; color: #111; }
      .stat-number { color: #0D2818; }
      .notes { background: #eef7f0; color: #111; border-left-color: #0D2818; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>KANVANA FOUNDATION - CLIENT PITCH DECK 2026</h1>
    <p style="color:#86EFAC;margin:0;">Green Kanpur Revolution • Geotagged Afforestation Movement</p>
  </div>
  ${slideItems.map((s, idx) => `
    <div class="slide">
      <div class="badge">${s.badge} • Slide ${idx + 1} of 8</div>
      <h2>${s.title}</h2>
      <div class="subtitle">${s.subtitle}</div>
      <div>${s.body}</div>
      <div class="notes">
        <strong>🎙️ Presenter Pitching Guide:</strong> ${s.notes}
      </div>
    </div>
  `).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Kanvana_Foundation_Executive_Pitch_Deck_2026.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Safe print handler with fallback
  const handlePrintDeck = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Direct print blocked by browser sandbox, triggering download fallback', err);
      handleDownloadDeck();
    }
  };

  const totalSlides = 8;

  // Auto slideshow when playing
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slides = [
    // SLIDE 1: Title & Executive Summary
    {
      id: 'title',
      badge: 'Executive Pitch Deck 2026',
      title: 'Kanvana Foundation: Green Kanpur Revolution',
      subtitle: 'Reclaiming Kanpur & Uttar Pradesh through Digital Geotagged Plantation Drives',
      bgImage: storyImages[4] || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
      presenterNotes: 'Greet the client/sponsor warmly. State our core goal: Planting 10,000+ native geotagged trees across Nankari, Kanpur & UP by Aug 15, 2026 with 100% digital transparency.',
      content: (
        <div className="space-y-6 text-left max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#F4C430] text-[#0D2818] font-black text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Kanvana Foundation Pitch Deck</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-[#F9FBF7] leading-tight">
            Transforming Kanpur’s Air & Urban Ecosystem
          </h1>

          <p className="text-base sm:text-xl text-[#86EFAC] font-medium leading-relaxed">
            A tech-driven, community-backed afforestation movement leveraging GPS Geotagging, Terracotta Clay Pot Irrigation, and Live Verification.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="bg-black/50 p-4 rounded-2xl border border-[#1B5E34] text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F4C430]">{stats.treesPlanted.toLocaleString()}+</div>
              <div className="text-[11px] text-[#86EFAC] uppercase font-bold mt-1">Trees Planted</div>
            </div>
            <div className="bg-black/50 p-4 rounded-2xl border border-[#1B5E34] text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#4CAF50]">10,000</div>
              <div className="text-[11px] text-[#86EFAC] uppercase font-bold mt-1">2026 Target</div>
            </div>
            <div className="bg-black/50 p-4 rounded-2xl border border-[#1B5E34] text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#38BDF8]">100%</div>
              <div className="text-[11px] text-[#86EFAC] uppercase font-bold mt-1">GPS Verified</div>
            </div>
            <div className="bg-black/50 p-4 rounded-2xl border border-[#1B5E34] text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E11D48]">{stats.volunteersActive}+</div>
              <div className="text-[11px] text-[#86EFAC] uppercase font-bold mt-1">Active Volunteers</div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 2: Problem & Urgent Need
    {
      id: 'problem',
      badge: 'The Environmental Imperative',
      title: 'Why Kanpur Needs Immediate Action',
      subtitle: 'Combating Industrial Air Pollution, Urban Heat Islands, and Groundwater Depletion',
      bgImage: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1600&q=80',
      presenterNotes: 'Highlight the severe air quality (AQI) challenge in Kanpur during winters and summers, the urban heat island effect (+3°C to +5°C), and why native species like Banyan, Neem, Peepal are crucial.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl">
          <div className="bg-[#0D2818]/80 p-6 rounded-3xl border border-red-500/30 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">01</div>
            <h3 className="font-bold text-lg text-red-300">Hazardous AQI Levels</h3>
            <p className="text-xs text-[#86EFAC]/90 leading-relaxed">
              Kanpur frequently touches AQI levels over 300+ in peak months. Dust and particulate matter (PM2.5) pose severe respiratory health risks to residents.
            </p>
          </div>

          <div className="bg-[#0D2818]/80 p-6 rounded-3xl border border-amber-500/30 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">02</div>
            <h3 className="font-bold text-lg text-amber-300">Extreme Heat Waves</h3>
            <p className="text-xs text-[#86EFAC]/90 leading-relaxed">
              Summer temperatures cross 45°C. Dense concrete surfaces trap heat without adequate green canopy coverage in residential and rural belts.
            </p>
          </div>

          <div className="bg-[#0D2818]/80 p-6 rounded-3xl border border-[#4CAF50]/30 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#4CAF50]/20 text-[#86EFAC] flex items-center justify-center font-bold">03</div>
            <h3 className="font-bold text-lg text-[#86EFAC]">The Kanvana Solution</h3>
            <p className="text-xs text-[#86EFAC]/90 leading-relaxed">
              Deploying native deep-rooted trees (Neem, Peepal, Bargad, Mango) that release maximum oxygen (+260 lbs/yr each), lower ambient heat by 4°C, and survive decades.
            </p>
          </div>
        </div>
      )
    },

    // SLIDE 3: Geotagging & Technology
    {
      id: 'technology',
      badge: 'Transparency & Technology',
      title: 'Digital Geotagging & Unique QR Registry',
      subtitle: 'Eliminating Ghost Plantations with 100% Real-Time GPS Tracking & Proof of Survival',
      bgImage: storyImages[2] || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80',
      presenterNotes: 'Emphasize trust & transparency! Every single tree gets a unique QR Code (e.g. KANVANA-TREE-001) with precise GPS coordinates, soil health data, surveyor verification badge, and timestamped photos.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left max-w-5xl">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F4C430] text-[#0D2818] flex items-center justify-center font-black">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-[#F9FBF7]">Every Tree Has an Identity</h3>
                <p className="text-xs text-[#86EFAC]">Scan QR code on physical tree guard to view live tree profile</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-[#F9FBF7]/90">
              <li className="flex items-start space-x-3 bg-[#0D2818]/80 p-3 rounded-2xl border border-[#1B5E34]">
                <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                <span><strong>GPS Coordinate Locking:</strong> Precise latitude & longitude registered during planting by field surveyors.</span>
              </li>
              <li className="flex items-start space-x-3 bg-[#0D2818]/80 p-3 rounded-2xl border border-[#1B5E34]">
                <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                <span><strong>Verification Badges:</strong> Multi-tiered field audit by Kanvana surveyors to ensure 92%+ sapling survival rate.</span>
              </li>
              <li className="flex items-start space-x-3 bg-[#0D2818]/80 p-3 rounded-2xl border border-[#1B5E34]">
                <CheckCircle2 className="w-5 h-5 text-[#4CAF50] shrink-0 mt-0.5" />
                <span><strong>Live Sponsor Dashboard:</strong> Donors & CSR partners can monitor tree growth status and location online.</span>
              </li>
            </ul>
          </div>

          <div className="bg-black/60 p-6 rounded-3xl border-2 border-[#F4C430] space-y-4 text-center">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-xl">
              <QrCode className="w-28 h-28 text-[#0D2818]" />
            </div>
            <div className="font-mono text-xs text-[#F4C430] font-bold">KANVANA-TREE-001 (Nankari Site)</div>
            <p className="text-[11px] text-[#86EFAC]">Lat: 26.5123° N | Long: 80.2329° E</p>
            <div className="px-3 py-1 rounded-full bg-[#4CAF50]/20 text-[#86EFAC] text-[10px] font-bold inline-block border border-[#4CAF50]">
              Verified Healthy Sapling • Terracotta Clay Irrigation
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 4: Plantation Lifecycle & Clay Pot Irrigation
    {
      id: 'process',
      badge: 'Sustainable Field Operations',
      title: '5-Stage Lifecycle & Terracotta Irrigation',
      subtitle: 'Combining Traditional Clay Pot Sub-Surface Irrigation with Heavy-Duty Protection',
      bgImage: storyImages[1] || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1600&q=80',
      presenterNotes: 'Explain our secret sauce: Terracotta Clay Water Pots buried alongside the roots provide continuous micro-drip moisture, reducing water consumption by 70% while keeping saplings hydrated in hot summers.',
      content: (
        <div className="space-y-6 text-left max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'Organic Seed', desc: 'Sown in fertile soil at Nankari nursery' },
              { step: '02', title: 'Germination', desc: 'Sprouting under natural sunlight' },
              { step: '03', title: 'Field Planting', desc: 'Tree guard + Clay pot irrigation' },
              { step: '04', title: 'GPS Geotag', desc: 'Unique QR registered on live portal' },
              { step: '05', title: 'Canopy Growth', desc: 'Matures into carbon-absorbing canopy' }
            ].map((s, idx) => (
              <div key={idx} className="bg-[#0D2818]/90 p-4 rounded-2xl border border-[#1B5E34] flex flex-col justify-between">
                <div className="text-xs font-black text-[#F4C430] font-mono">STAGE {s.step}</div>
                <div className="font-bold text-sm text-[#F9FBF7] my-1">{s.title}</div>
                <div className="text-[10px] text-[#86EFAC] leading-tight">{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-3xl bg-black/60 border border-[#1B5E34] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-left">
              <span className="text-xs font-bold text-[#F4C430] uppercase">💡 Clay Pot Micro-Drip Innovation:</span>
              <p className="text-xs text-[#86EFAC]">
                Burying porous terracotta earthen pots near sapling roots saves up to 70% water, prevents soil evaporation, and fosters deep root growth.
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-[#1B5E34] text-[#F9FBF7] font-bold text-xs shrink-0 border border-[#86EFAC]/30">
              70% Water Saved
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 5: Corporate CSR & Sponsorship Packages
    {
      id: 'csr',
      badge: 'CSR & Sponsorship Models',
      title: 'Partner with Kanvana: CSR & Sponsorship',
      subtitle: 'Fulfill Environmental Compliance, Gain Brand Goodwill, and Receive Verified Certificates',
      bgImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1600&q=80',
      presenterNotes: 'Offer clear sponsorship packages for corporations, institutions, and individuals. Highlight co-branded certificates, customized tree nameplates, and tax benefit support.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl">
          <div className="bg-[#0D2818]/90 p-6 rounded-3xl border border-[#1B5E34] hover:border-[#F4C430] transition-all space-y-4">
            <div className="text-xs font-bold uppercase text-[#86EFAC]">Citizen Package</div>
            <div className="text-2xl font-extrabold text-[#F4C430]">Sponsor 5 Trees</div>
            <p className="text-xs text-[#86EFAC]/90">Ideal for birthday gifts, memorials, and individual pledges.</p>
            <ul className="text-xs text-[#F9FBF7] space-y-2">
              <li>✓ Personalized Impact Certificate</li>
              <li>✓ Unique QR Code Tagging</li>
              <li>✓ WhatsApp Growth Updates</li>
            </ul>
          </div>

          <div className="bg-[#1B5E34]/80 p-6 rounded-3xl border-2 border-[#F4C430] space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#F4C430] text-[#0D2818] text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl">
              Most Popular
            </div>
            <div className="text-xs font-bold uppercase text-[#F4C430]">Corporate CSR Drive</div>
            <div className="text-2xl font-extrabold text-[#F9FBF7]">500+ Trees Forest</div>
            <p className="text-xs text-[#86EFAC]">Dedicated Kanvana Green Zone in Kanpur for your enterprise.</p>
            <ul className="text-xs text-[#F9FBF7] space-y-2">
              <li>✓ Co-Branded Steel Tree Guards</li>
              <li>✓ Dedicated Geo-Map Dashboard</li>
              <li>✓ Annual ESG & Carbon Report</li>
              <li>✓ Employee Tree Planting Event</li>
            </ul>
          </div>

          <div className="bg-[#0D2818]/90 p-6 rounded-3xl border border-[#1B5E34] hover:border-[#4CAF50] transition-all space-y-4">
            <div className="text-xs font-bold uppercase text-[#86EFAC]">Institutional Partner</div>
            <div className="text-2xl font-extrabold text-[#4CAF50]">1,000+ Trees Drive</div>
            <p className="text-xs text-[#86EFAC]/90">Universities, Hospitals, Government & Industrial Parks.</p>
            <ul className="text-xs text-[#F9FBF7] space-y-2">
              <li>✓ Custom Mobile Surveyor Access</li>
              <li>✓ Google Drive & Sheet Integration</li>
              <li>✓ Lifetime Maintenance Pledge</li>
            </ul>
          </div>
        </div>
      )
    },

    // SLIDE 6: Automated Workflows & Google Drive Integration
    {
      id: 'automation',
      badge: 'Seamless Data Integration',
      title: 'Automated Google Drive & Live Webhook Sync',
      subtitle: 'Zero Manual Data Entry — Field Submissions Instantly Sync to Cloud Repositories',
      bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
      presenterNotes: 'Showcase our robust technology stack! When field surveyors upload geotagged photos and details, Google Webhooks automatically update live Google Sheets and Google Drive photo folders.',
      content: (
        <div className="space-y-6 text-left max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0D2818]/90 p-5 rounded-3xl border border-[#1B5E34] space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center font-bold">1</div>
              <h4 className="font-bold text-sm text-[#F9FBF7]">Field Inspector Mobile App</h4>
              <p className="text-xs text-[#86EFAC]">Surveyors capture tree photos, village/GPS coordinates, and tree species on field.</p>
            </div>

            <div className="bg-[#0D2818]/90 p-5 rounded-3xl border border-[#1B5E34] space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#F4C430]/20 text-[#F4C430] flex items-center justify-center font-bold">2</div>
              <h4 className="font-bold text-sm text-[#F9FBF7]">Google Webhook Engine</h4>
              <p className="text-xs text-[#86EFAC]">Data instantly transmits via secure Google Apps Script webhook to central databases.</p>
            </div>

            <div className="bg-[#0D2818]/90 p-5 rounded-3xl border border-[#1B5E34] space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#4CAF50]/20 text-[#4CAF50] flex items-center justify-center font-bold">3</div>
              <h4 className="font-bold text-sm text-[#F9FBF7]">Live Cloud Drive Archive</h4>
              <p className="text-xs text-[#86EFAC]">Sponsors & admins access real-time photos and master spreadsheet anytime.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#1B5E34]/40 border border-[#4CAF50]/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-[#4CAF50]" />
              <span className="text-xs text-[#F9FBF7]">Verified Compatible with Google Drive, Sheets & Cloud Storage</span>
            </div>
            <span className="text-[10px] font-mono text-[#86EFAC] bg-black/50 px-3 py-1 rounded-full">Automated Webhook Sync</span>
          </div>
        </div>
      )
    },

    // SLIDE 7: Quantifiable Environmental Impact
    {
      id: 'impact',
      badge: 'Measurable Outcomes',
      title: 'Target Environmental Metrics by Aug 2026',
      subtitle: 'Tangible Ecological Benefits Delivered to Kanpur Citizens',
      bgImage: storyImages[3] || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1600&q=80',
      presenterNotes: 'Share these impressive stats: 10,000 mature native trees produce over 2.6 million lbs of pure oxygen annually, sequester 480,000 lbs of CO2, and employ local rural youth.',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left max-w-5xl">
          <div className="bg-[#0D2818]/90 p-6 rounded-3xl border border-[#1B5E34] text-center space-y-2">
            <div className="text-3xl font-black text-[#F4C430]">2.6M+ lbs</div>
            <div className="text-xs font-bold text-[#F9FBF7]">Annual Oxygen</div>
            <p className="text-[10px] text-[#86EFAC]">Sufficient for 20,000+ residents to breathe daily</p>
          </div>

          <div className="bg-[#0D2818]/90 p-6 rounded-3xl border border-[#1B5E34] text-center space-y-2">
            <div className="text-3xl font-black text-[#4CAF50]">480,000 lbs</div>
            <div className="text-xs font-bold text-[#F9FBF7]">CO₂ Sequestration</div>
            <p className="text-[10px] text-[#86EFAC]">Directly neutralizes urban vehicle emissions</p>
          </div>

          <div className="bg-[#0D2818]/90 p-6 rounded-3xl border border-[#1B5E34] text-center space-y-2">
            <div className="text-3xl font-black text-[#38BDF8]">-4°C</div>
            <div className="text-xs font-bold text-[#F9FBF7]">Local Cooling</div>
            <p className="text-[10px] text-[#86EFAC]">Shade canopy reduces ground surface temperatures</p>
          </div>

          <div className="bg-[#0D2818]/90 p-6 rounded-3xl border border-[#1B5E34] text-center space-y-2">
            <div className="text-3xl font-black text-[#E11D48]">100+</div>
            <div className="text-xs font-bold text-[#F9FBF7]">Rural Jobs</div>
            <p className="text-[10px] text-[#86EFAC]">Employment for local potters, surveyors & caretakers</p>
          </div>
        </div>
      )
    },

    // SLIDE 8: Call to Action & Contact
    {
      id: 'cta',
      badge: 'Join The Green Movement',
      title: 'Partner with Kanvana Foundation Today',
      subtitle: 'Let’s Build a Greener, Healthier Kanpur Together',
      bgImage: storyImages[4] || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
      presenterNotes: 'Conclude the presentation with a warm invitation to plant trees today, visit our field site in Nankari, or sponsor a CSR green zone.',
      content: (
        <div className="space-y-8 text-center max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-[#0D2818]/90 border-2 border-[#F4C430] space-y-6 shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[#F9FBF7]">
              Ready to Make Kanpur Greener?
            </h3>
            <p className="text-sm text-[#86EFAC] max-w-xl mx-auto">
              Sponsor a tree, schedule a field visit, or start a corporate plantation drive with live geotagged proof.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onStartPlanting) onStartPlanting();
                }}
                className="px-8 py-4 rounded-2xl bg-[#F4C430] text-[#0D2818] font-black text-sm uppercase tracking-wider hover:bg-[#FFE066] transition-all shadow-xl flex items-center space-x-2 cursor-pointer"
              >
                <TreePine className="w-5 h-5 text-[#0D2818]" />
                <span>Sponsor Trees Now</span>
              </button>

              <a
                href="tel:919125368361"
                className="px-6 py-4 rounded-2xl bg-[#1B5E34] text-[#F9FBF7] font-bold text-sm hover:bg-[#258348] transition-all border border-[#86EFAC]/30 flex items-center space-x-2"
              >
                <span>📞 Call Founder: +91 91253 68361</span>
              </a>
            </div>

            <div className="pt-4 border-t border-[#1B5E34] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#86EFAC]">
              <div>📍 <strong>Address:</strong> Nankari, Kanpur, UP</div>
              <div>✉️ <strong>Email:</strong> contact@kanvana.org</div>
              <div>🌐 <strong>Portal:</strong> Live Geotagging Ready</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSlideData = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-[#F9FBF7] animate-fadeIn select-none overflow-hidden">
      {/* BACKGROUND IMAGE SLIDESHOW WITH SMOOTH CROSSFADE */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={currentSlideData.bgImage}
          alt="Slide Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 scale-105 transition-all duration-1000 blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      {/* TOP CONTROL BAR */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 border-b border-[#1B5E34]/40 bg-black/60 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#F4C430] text-[#0D2818] flex items-center justify-center font-black">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-[#F9FBF7]">Kanvana Foundation PPT Deck</div>
            <div className="text-[10px] text-[#86EFAC]">Client & Sponsor Presentation Mode</div>
          </div>
        </div>

        {/* TOP ACTION CONTROLS */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Presenter Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              showNotes ? 'bg-[#F4C430] text-[#0D2818]' : 'bg-[#1B5E34]/60 text-[#86EFAC] border border-[#1B5E34]'
            }`}
            title="Toggle Speaker Notes for Client Pitching"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Speaker Notes</span>
          </button>

          {/* Download Presentation File Button */}
          <button
            onClick={handleDownloadDeck}
            className="px-3.5 py-1.5 rounded-xl bg-[#F4C430] text-[#0D2818] text-xs font-extrabold hover:bg-[#FFE066] transition-all flex items-center space-x-1.5 cursor-pointer shadow-md"
            title="Download Full Offline Presentation Deck HTML/PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Deck</span>
          </button>

          {/* Print PDF Button */}
          <button
            onClick={handlePrintDeck}
            className="px-3 py-1.5 rounded-xl bg-[#1B5E34]/80 hover:bg-[#1B5E34] text-[#86EFAC] hover:text-[#F9FBF7] text-xs font-bold border border-[#1B5E34] transition-all flex items-center space-x-1.5 cursor-pointer"
            title="Print Presentation or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#86EFAC]" />
            <span className="hidden sm:inline">Print PDF</span>
          </button>

          {/* Play / Pause Auto Slideshow */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-[#1B5E34]/60 hover:bg-[#1B5E34] text-[#86EFAC] border border-[#1B5E34] transition-all cursor-pointer"
            title={isPlaying ? 'Pause' : 'Auto Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#F4C430]" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Close PPT Mode */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-700/50 transition-all cursor-pointer"
            title="Exit Presentation Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MAIN SLIDE CONTENT CANVAS */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 sm:px-12 py-6 text-center overflow-y-auto">
        <div className="w-full max-w-5xl space-y-6 my-auto animate-fadeIn key={currentSlide}">
          {/* SLIDE HEADER */}
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]/40 text-[11px] font-black uppercase tracking-wider inline-block">
              {currentSlideData.badge} • Slide {currentSlide + 1} / {totalSlides}
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-[#F9FBF7]">
              {currentSlideData.title}
            </h2>
            <p className="text-xs sm:text-base text-[#86EFAC] font-medium max-w-2xl mx-auto">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* SLIDE BODY */}
          <div className="py-4">
            {currentSlideData.content}
          </div>
        </div>
      </div>

      {/* SPEAKER NOTES BOX (WHEN ENABLED) */}
      {showNotes && (
        <div className="relative z-20 bg-[#0D2818] border-t border-[#F4C430]/40 p-3 sm:p-4 text-left max-h-32 overflow-y-auto">
          <div className="max-w-5xl mx-auto flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-[#F4C430] text-[#0D2818] shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-[#F4C430] uppercase tracking-wider block">
                🎙️ Client Pitching Guide (What to speak on this slide):
              </span>
              <p className="text-xs text-[#F9FBF7]/90 leading-relaxed font-sans">
                {currentSlideData.presenterNotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SLIDE NAVIGATION & THUMBNAILS */}
      <div className="relative z-10 flex items-center justify-between p-4 bg-black/80 border-t border-[#1B5E34]/40">
        {/* Previous Slide Button */}
        <button
          disabled={currentSlide === 0}
          onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
          className="px-4 py-2 rounded-2xl bg-[#1B5E34] text-[#F9FBF7] font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#258348] transition-all flex items-center space-x-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Slide Indicators / Jump Dots */}
        <div className="flex items-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-[#F4C430]' : 'w-2.5 bg-[#1B5E34] hover:bg-[#86EFAC]'
              }`}
              title={`Jump to Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Slide Button */}
        <button
          disabled={currentSlide === totalSlides - 1}
          onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
          className="px-5 py-2.5 rounded-2xl bg-[#F4C430] text-[#0D2818] font-extrabold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FFE066] transition-all flex items-center space-x-1 cursor-pointer shadow-lg"
        >
          <span className="hidden sm:inline">Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
