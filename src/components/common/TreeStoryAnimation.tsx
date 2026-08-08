import React, { useState, useEffect } from 'react';
import { 
  X, Play, Pause, SkipForward, RotateCcw, Sparkles, 
  Heart, Award, Volume2, VolumeX, Leaf, TreePine, Eye, ShieldCheck, MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../../types';
import { store } from '../../services/store';

interface TreeStoryAnimationProps {
  language: Language;
  onClose: () => void;
  onStartPlanting?: () => void;
}

export const TreeStoryAnimation: React.FC<TreeStoryAnimationProps> = ({
  language,
  onClose,
  onStartPlanting
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [storyImages, setStoryImages] = useState<string[]>(store.getStoryImages());

  useEffect(() => {
    return store.subscribe(() => {
      setStoryImages(store.getStoryImages());
    });
  }, []);

  const totalStages = 5;
  const stageDurationMs = 3800; // Snappy 3.8s per stage playback

  // Ultra-Soft Organic Ambient Bell Sound Effect
  const playChime = (stage: number) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Soft Lowpass Filter for warm acoustic feel
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      // Gentle Pentatonic Notes: C4, E4, G4, A4, C5
      const freqs = [261.63, 329.63, 392.00, 440.00, 523.25];
      const freq = freqs[stage] || 329.63;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Very soft gain fade (0.04 volume peak)
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // Audio context ignored if browser restricts
    }
  };

  // Auto progression timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      const stepMs = 50;
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStage < totalStages - 1) {
              const nextStage = currentStage + 1;
              setCurrentStage(nextStage);
              playChime(nextStage);
              if (nextStage === totalStages - 1) {
                confetti({ particleCount: 70, spread: 90, origin: { y: 0.6 } });
              }
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + (stepMs / stageDurationMs) * 100;
        });
      }, stepMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStage]);

  const handleStageChange = (newStage: number) => {
    setCurrentStage(newStage);
    setProgress(0);
    setIsPlaying(true);
    playChime(newStage);
    if (newStage === totalStages - 1) {
      confetti({ particleCount: 90, spread: 100, origin: { y: 0.6 } });
    }
  };

  const storyData = [
    {
      titleEn: '1. The Native Seed in Kanpur Soil',
      titleHi: '१. कान्वना की पावन धरा में एक बीज',
      subtitleEn: 'Deep in dark fertile earth, life begins in stillness.',
      subtitleHi: 'उपजाऊ मिट्टी की गहराई में, एक नन्हे जीवन का सपना आकार लेता है।',
      descEn: 'Every magnificent Banyan, Neem, and Peepal tree begins with a carefully selected native seed sown in Nankari, Kanpur by Kanvana Foundation.',
      descHi: 'कान्वना फाउंडेशन द्वारा कानपुर के ननकारी में रोपा गया हर एक देसी बीज आगे चलकर एक विशाल नीम या बरगद का पेड़ बनता है।',
      image: storyImages[0] || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80',
      badge: 'Step 01: Sowing',
      accentColor: '#F4C430',
      overlayBadge: 'Grown in Organic Soil'
    },
    {
      titleEn: '2. Dew Drops & First Sunlight',
      titleHi: '२. जल, ओस की बूंदें और प्रथम सूर्यकिरण',
      subtitleEn: 'Soft rains nourish roots as a vibrant green shoot emerges.',
      subtitleHi: 'मिट्टी से नमी पाकर अंकुर फूटता है और सूर्यदेव का स्वागत करता है।',
      descEn: 'Rainwater and ground moisture activate the seedling. The tiny tender sprout reaches upward to break through the dark earth into daylight.',
      descHi: 'वर्षा का जल और उपजाऊ भूमि मिलकर बीज को जागृत करते हैं, और नन्हा हरा अंकुर धरती का सीना चीरकर बाहर निकलता है।',
      image: storyImages[1] || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1000&q=80',
      badge: 'Step 02: Sprouting',
      accentColor: '#4CAF50',
      overlayBadge: 'Natural Germination'
    },
    {
      titleEn: '3. Field Surveyor & Tree Guard Care',
      titleHi: '३. फील्ड सर्वेयर, मटका सिंचाई और सुरक्षा',
      subtitleEn: 'Protected with tree guards and assigned a Digital QR ID.',
      subtitleHi: 'ट्री-गार्ड का सुरक्षा घेरा, मटका सिंचाई प्रणाली और जीपीएस डिजिटल टैगिंग।',
      descEn: 'Kanvana field surveyors protect the young sapling using heavy-duty tree guards and terracotta clay water pots, geotagging each tree with a unique QR code.',
      descHi: 'फील्ड सर्वेयर पौधे को ट्री-गार्ड से सुरक्षित करते हैं, मिट्टी के मटके से धीमी सिंचाई देते हैं और ऐप पर इसका GPS location + Unique ID रजिस्टर करते हैं।',
      image: storyImages[2] || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
      badge: 'Step 03: Field Nurturing',
      accentColor: '#86EFAC',
      overlayBadge: 'Digital Geotagged QR'
    },
    {
      titleEn: '4. The Majestic Green Canopy',
      titleHi: '४. विशाल छाया, शुद्ध वायु और जीवनदायिनी ओस',
      subtitleEn: 'Producing 260 lbs of Oxygen yearly & reducing local temperature by 4°C.',
      subtitleHi: 'प्रतिवर्ष २६० पाउंड शुद्ध ऑक्सीजन और प्रदूषण से मुक्ति।',
      descEn: 'As the tree matures into a giant green canopy, it filters tons of carbon dioxide, cools Kanpur’s urban heat, and provides home to hundreds of birds.',
      descHi: 'विशाल हरियाली कानपुर की हवा को विषैली गैसों से मुक्त करती है, तापमान को ४ डिग्री तक कम करती है और अनगिनत पक्षियों का घर बनती है।',
      image: storyImages[3] || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80',
      badge: 'Step 04: Environmental Impact',
      accentColor: '#10B981',
      overlayBadge: '+260 lbs O₂ / Year'
    },
    {
      titleEn: '5. The Kanvana Green Revolution',
      titleHi: '५. कान्वना १०,०००+ वृक्ष संकल्प',
      subtitleEn: 'Independence Day 2026: Restoring Kanpur together.',
      subtitleHi: '१५ अगस्त २०२६ तक १०,००० पौधों का संकल्प! आप भी जुड़ें।',
      descEn: 'Join 1,000+ citizens and surveyors building a greener future for Kanpur & Uttar Pradesh. Sponsor a tree with live updates and certificate!',
      descHi: '१,००० से अधिक नागरिकों के साथ मिलकर कानपुर को फिर से हरा-भरा बनाएं। आज ही अपने या प्रियजनों के नाम एक पौधा रोपित करें।',
      image: storyImages[4] || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
      badge: 'Step 05: People Movement',
      accentColor: '#F4C430',
      overlayBadge: '10,000+ Trees Target'
    }
  ];

  const curr = storyData[currentStage];

  return (
    <div className="fixed inset-0 z-50 bg-[#040E07]/95 backdrop-blur-2xl overflow-y-auto p-3 sm:p-6 select-none text-[#F9FBF7] animate-in fade-in duration-300">
      <div className="min-h-full max-w-5xl mx-auto flex flex-col justify-between items-center py-2 sm:py-4 gap-6">
      
      {/* Top Header */}
      <div className="w-full max-w-5xl flex items-center justify-between border-b border-[#1B5E34]/50 pb-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1B5E34] to-[#0D2818] flex items-center justify-center border border-[#86EFAC]/40 shadow-xl shadow-[#1B5E34]/30">
            <TreePine className="w-6 h-6 text-[#F4C430]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-[#86EFAC] font-display">
                Kanvana Tree Story
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]/30 text-[9px] font-bold uppercase">
                HD Realistic
              </span>
            </div>
            <p className="text-[11px] text-[#F9FBF7]/70">
              {language === 'hi' ? 'कान्वना वृक्ष जीवन यात्रा (Real Life Story)' : 'The Real Life Journey of a Kanpur Tree'}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2">
          {/* Audio toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-[#0D2818] border border-[#1B5E34] text-[#86EFAC] hover:bg-[#1B5E34] transition-colors text-xs flex items-center space-x-1.5 cursor-pointer"
            title="Toggle Ambient Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F4C430]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            <span className="hidden sm:inline text-[11px] text-[#86EFAC]">
              {soundEnabled ? 'Sound ON' : 'Muted'}
            </span>
          </button>

          {/* Close / Skip button */}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1B5E34] to-[#2E7D32] text-[#86EFAC] hover:text-[#0D2818] hover:from-[#86EFAC] hover:to-[#4CAF50] transition-all text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-lg border border-[#86EFAC]/30 cursor-pointer"
          >
            <span>{language === 'hi' ? 'वेबसाइट देखें' : 'Skip to Website'}</span>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Stage Presentation Card */}
      <div className="w-full max-w-5xl my-auto py-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        
        {/* Realistic High Definition Photo Stage Showcase */}
        <div className="w-full max-w-md lg:max-w-lg h-72 sm:h-96 rounded-3xl bg-[#081C0E] border-2 border-[#1B5E34] shadow-2xl relative overflow-hidden shrink-0 group">
          
          {/* Photorealistic Background Image with Ken-Burns scale & growth zoom effect */}
          <div className="w-full h-full relative overflow-hidden">
            <img
              key={curr.image}
              src={curr.image}
              alt={curr.titleEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform transition-all duration-1000 ease-out filter contrast-105 brightness-95"
              style={{
                transform: currentStage === 0 ? 'scale(1.2) translateY(8%)' :
                           currentStage === 1 ? 'scale(1.15) translateY(4%)' :
                           currentStage === 2 ? 'scale(1.1) translateY(0%)' :
                           currentStage === 3 ? 'scale(1.05) translateY(-2%)' :
                           'scale(1.0) translateY(0%)'
              }}
            />
          </div>

          {/* Gradient Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040E07] via-transparent to-black/30" />

          {/* Real Live Growth Height Gauge Overlay */}
          <div className="absolute bottom-12 left-4 px-3 py-1.5 bg-[#040E07]/90 backdrop-blur-md rounded-xl border border-[#4CAF50]/60 text-xs flex items-center space-x-2 shadow-xl">
            <TreePine className="w-4 h-4 text-[#4CAF50] animate-pulse" />
            <div>
              <p className="text-[9px] text-[#86EFAC] font-bold uppercase tracking-wider">Live Growth Stage</p>
              <p className="text-xs font-black text-[#F4C430]">
                {currentStage === 0 && '🌱 Seed (0 cm)'}
                {currentStage === 1 && '🌿 Sprout (8 cm)'}
                {currentStage === 2 && '🪴 Sapling (1.2 m)'}
                {currentStage === 3 && '🌳 Young Tree (5.5 m)'}
                {currentStage === 4 && '🌲 Giant Canopy (18+ m)'}
              </p>
            </div>
          </div>

          {/* Real Floating Environmental Glow & Sparkles */}
          <div className="absolute top-4 right-4 flex items-center space-x-1 px-3 py-1 bg-[#040E07]/80 backdrop-blur-md rounded-full border border-[#86EFAC]/40 text-[#F4C430] text-xs font-extrabold shadow-lg">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>{curr.overlayBadge}</span>
          </div>

          {/* Geotag Marker Overlay for Stage 3 */}
          {currentStage === 2 && (
            <div className="absolute bottom-16 left-6 right-6 p-3 bg-[#0D2818]/90 backdrop-blur-md rounded-2xl border border-[#F4C430]/50 text-xs flex items-center justify-between shadow-xl animate-bounce">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#F4C430]" />
                <div>
                  <p className="font-bold text-[#F9FBF7]">Nankari Kanpur, UP</p>
                  <p className="text-[10px] text-[#86EFAC]">GPS: 26.5123° N, 80.2329° E</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-[#F4C430] text-[#0D2818] font-mono text-[10px] font-black rounded">
                TAG: KAN-082
              </span>
            </div>
          )}

          {/* Environmental Impact Metrics for Stage 4 */}
          {currentStage === 3 && (
            <div className="absolute bottom-16 left-6 right-6 grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-[#0D2818]/90 backdrop-blur-md rounded-xl border border-[#38BDF8] shadow">
                <p className="text-[10px] text-[#38BDF8] font-bold uppercase">Oxygen Produced</p>
                <p className="text-base font-black text-white">+260 lbs/yr</p>
              </div>
              <div className="p-2.5 bg-[#0D2818]/90 backdrop-blur-md rounded-xl border border-[#86EFAC] shadow">
                <p className="text-[10px] text-[#86EFAC] font-bold uppercase">Temp Reduction</p>
                <p className="text-base font-black text-white">-4°C Cool</p>
              </div>
            </div>
          )}

          {/* Stage Step Pill */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1B5E34]/90 backdrop-blur-md border border-[#86EFAC]/40 text-[#86EFAC] text-xs font-bold uppercase tracking-wider shadow">
            {curr.badge}
          </div>

          {/* Bottom Photo Caption */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-[#F9FBF7]/70 font-mono">
            <span>Kanvana Field Project 2026</span>
            <span>HD Photo Archives</span>
          </div>

        </div>

        {/* Text Story & Content Column */}
        <div className="flex-1 space-y-5 text-center lg:text-left">
          
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1B5E34]/40 border border-[#86EFAC]/30">
              <Leaf className="w-3.5 h-3.5 text-[#86EFAC]" />
              <span 
                className="text-xs font-extrabold uppercase tracking-widest"
                style={{ color: curr.accentColor }}
              >
                {language === 'hi' ? curr.titleHi : curr.titleEn}
              </span>
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#F9FBF7] leading-tight pt-1">
              {language === 'hi' ? curr.subtitleHi : curr.subtitleEn}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-[#F9FBF7]/90 font-sans leading-relaxed bg-[#0D2818]/90 p-5 rounded-2xl border border-[#1B5E34] shadow-inner">
            {language === 'hi' ? curr.descHi : curr.descEn}
          </p>

          {/* Action buttons at Stage 5 */}
          {currentStage === totalStages - 1 && (
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (onStartPlanting) onStartPlanting();
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#F4C430] to-[#FFE066] text-[#0D2818] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-2xl hover:scale-105 transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-current text-[#0D2818]" />
                <span>{language === 'hi' ? 'पौधा प्रायोजित करें (₹50 - ₹500)' : 'Sponsor A Tree (₹50 - ₹500)'}</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Bottom Timeline Controls */}
      <div className="w-full max-w-5xl space-y-4 border-t border-[#1B5E34]/50 pt-4">
        
        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#0D2818] rounded-full overflow-hidden border border-[#1B5E34] relative shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#1B5E34] via-[#4CAF50] to-[#F4C430] transition-all duration-100"
            style={{ width: `${((currentStage) / totalStages) * 100 + (progress / totalStages)}%` }}
          />
        </div>

        {/* Step Navigation Dots & Controls */}
        <div className="flex items-center justify-between">
          
          {/* Step Jumpers */}
          <div className="flex items-center space-x-2">
            {storyData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleStageChange(idx)}
                className={`h-3 rounded-full transition-all cursor-pointer ${
                  idx === currentStage
                    ? 'w-9 bg-[#F4C430] shadow-md shadow-[#F4C430]/40'
                    : idx < currentStage
                    ? 'w-3.5 bg-[#4CAF50]'
                    : 'w-3.5 bg-[#1B5E34]'
                }`}
                title={`Jump to Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Media Playback Controls */}
          <div className="flex items-center space-x-2">
            {/* Replay */}
            <button
              onClick={() => handleStageChange(0)}
              className="p-2.5 rounded-xl bg-[#0D2818] border border-[#1B5E34] hover:bg-[#1B5E34] text-[#86EFAC] transition-colors cursor-pointer"
              title="Replay Story"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-[#F4C430] hover:bg-[#FFE066] text-[#0D2818] font-bold transition-all shadow-md cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Next Step */}
            <button
              onClick={() => handleStageChange((currentStage + 1) % totalStages)}
              className="px-4 py-2.5 rounded-xl bg-[#1B5E34] hover:bg-[#4CAF50] text-[#86EFAC] hover:text-[#0D2818] font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer border border-[#86EFAC]/20"
            >
              <span>{language === 'hi' ? 'अगला पड़ाव' : 'Next Stage'}</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  </div>
);
};
