import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, MapPin, TreePine, Bird } from 'lucide-react';

interface PageLoaderProps {
  onComplete?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress timer (0% to 100% in ~3.5 seconds)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        return prev + 1.2;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 100);
  };

  if (!visible) return null;

  // Status message based on loading progress
  const getStatusText = () => {
    if (progress < 25) return 'Nurturing Planet Earth & Native Ecosystems...';
    if (progress < 55) return 'Planting Forests & Native Trees across Landmasses...';
    if (progress < 85) return 'Welcoming Birds & Establishing Wildlife Sanctuaries...';
    return 'Rooted in Purpose. Welcome to Kanvana Foundation.';
  };

  return (
    <AnimatePresence>
      <motion.div
        key="global-loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.04 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] bg-[#020D06] flex flex-col items-center justify-center p-6 text-white select-none overflow-hidden"
      >
        {/* Soft radial atmospheric background glow */}
        <div className="absolute w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Floating Stars Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                top: `${(i * 37) % 100}%`,
                left: `${(i * 53) % 100}%`,
                width: `${(i % 3) + 1}px`,
                height: `${(i % 3) + 1}px`,
                animationDuration: `${2 + (i % 4)}s`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* 3D SVG Photorealistic Rotating Globe Container */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center mb-6">
          {/* Outer Atmosphere Glow Halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/30 via-emerald-400/20 to-teal-300/10 blur-xl animate-pulse" />

          {/* Orbiting Birds (3D depth layers) */}
          {/* Birds Layer BEHIND Earth */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* EllipticalOrbit Path behind */}
              <g className="animate-[spin_12s_linear_infinite_reverse] origin-center opacity-40">
                {/* Bird 1 */}
                <path
                  d="M 50,110 Q 55,100 60,110 Q 65,100 70,110 Q 60,115 50,110 Z"
                  fill="#86efac"
                  transform="scale(0.6) translate(30, 40)"
                />
                {/* Bird 2 */}
                <path
                  d="M 230,190 Q 235,180 240,190 Q 245,180 250,190 Q 240,195 230,190 Z"
                  fill="#6ee7b7"
                  transform="scale(0.5) translate(80, -20)"
                />
              </g>
            </svg>
          </div>

          {/* Main 3D Earth Globe SVG */}
          <div className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.35)] border border-cyan-400/30">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <defs>
                {/* Earth Sphere Mask */}
                <clipPath id="earth-sphere-clip">
                  <circle cx="150" cy="150" r="140" />
                </clipPath>

                {/* Ocean Radial Shader */}
                <radialGradient id="oceanShading" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="30%" stopColor="#0284c7" />
                  <stop offset="65%" stopColor="#0369a1" />
                  <stop offset="90%" stopColor="#075985" />
                  <stop offset="100%" stopColor="#021d2d" />
                </radialGradient>

                {/* Land Gradient */}
                <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>

                {/* Day/Night 3D Shadow Shader */}
                <radialGradient id="dayNightShadow" cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                  <stop offset="50%" stopColor="rgba(0,0,0,0)" />
                  <stop offset="85%" stopColor="rgba(1, 15, 8, 0.4)" />
                  <stop offset="100%" stopColor="rgba(1, 10, 5, 0.85)" />
                </radialGradient>

                {/* Atmosphere Rim Highlight */}
                <linearGradient id="rimGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(186,230,253,0.8)" />
                  <stop offset="50%" stopColor="rgba(52,211,153,0.4)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
              </defs>

              {/* Ocean Base Sphere */}
              <circle cx="150" cy="150" r="140" fill="url(#oceanShading)" />

              {/* Rotating Continents (Clipped to Globe) */}
              <g clipPath="url(#earth-sphere-clip)">
                {/* Continuous 60fps GPU-accelerated rotation container */}
                <g className="animate-[earthRotate_22s_linear_infinite]">
                  {/* Repeated World Continents Map Pattern (Width: 600px) */}
                  {[0, 300].map((offsetX) => (
                    <g key={offsetX} transform={`translate(${offsetX}, 0)`}>
                      {/* North America */}
                      <path
                        d="M 30,70 Q 45,50 70,55 Q 85,70 80,95 Q 65,110 50,100 Q 35,110 25,90 Z"
                        fill="url(#landGrad)"
                        stroke="#86efac"
                        strokeWidth="1"
                      />

                      {/* Greenland */}
                      <path
                        d="M 90,35 Q 105,30 110,45 Q 95,55 85,45 Z"
                        fill="#86efac"
                        opacity="0.9"
                      />

                      {/* South America (Amazon Rainforest) */}
                      <path
                        d="M 60,130 Q 80,125 90,145 Q 85,185 70,205 Q 55,210 50,180 Q 55,150 60,130 Z"
                        fill="url(#landGrad)"
                        stroke="#86efac"
                        strokeWidth="1"
                      />

                      {/* Europe */}
                      <path
                        d="M 135,65 Q 155,55 170,70 Q 160,85 145,85 Q 135,75 135,65 Z"
                        fill="url(#landGrad)"
                        stroke="#86efac"
                        strokeWidth="1"
                      />

                      {/* Africa */}
                      <path
                        d="M 130,95 Q 165,90 175,115 Q 170,165 150,185 Q 135,180 125,145 Q 120,115 130,95 Z"
                        fill="url(#landGrad)"
                        stroke="#86efac"
                        strokeWidth="1"
                      />

                      {/* Asia & India */}
                      <path
                        d="M 165,55 Q 215,45 250,65 Q 240,110 215,115 Q 195,110 180,130 Q 170,115 160,85 Z"
                        fill="url(#landGrad)"
                        stroke="#86efac"
                        strokeWidth="1"
                      />

                      {/* India Detail */}
                      <path
                        d="M 182,105 Q 198,102 192,125 Q 180,135 178,118 Z"
                        fill="#4ade80"
                        stroke="#fef08a"
                        strokeWidth="1.2"
                      />

                      {/* Australia */}
                      <path
                        d="M 225,160 Q 255,155 260,180 Q 245,200 220,190 Q 215,170 225,160 Z"
                        fill="url(#landGrad)"
                        stroke="#86efac"
                        strokeWidth="1"
                      />

                      {/* SE Asia Islands */}
                      <circle cx="215" cy="135" r="4" fill="#4ade80" />
                      <circle cx="225" cy="142" r="3.5" fill="#4ade80" />
                      <circle cx="235" cy="138" r="3" fill="#4ade80" />
                    </g>
                  ))}
                </g>

                {/* Sprouting Trees Layer (Grows smoothly on Earth surface) */}
                <g className="pointer-events-none">
                  {/* Tree 1: India (IIT Kanpur - Kanvana HQ) */}
                  {progress >= 10 && (
                    <g transform="translate(182, 115)" className="animate-[bounce_2s_infinite]">
                      {/* Tree Trunk */}
                      <rect x="-1.5" y="-6" width="3" height="6" fill="#4A2E12" rx="1" />
                      {/* Tree Crown */}
                      <circle cx="0" cy="-10" r="7" fill="#15803d" />
                      <circle cx="-3" cy="-9" r="5" fill="#22c55e" />
                      <circle cx="3" cy="-9" r="5" fill="#4ade80" />
                      <circle cx="0" cy="-12" r="4" fill="#86efac" />
                    </g>
                  )}

                  {/* Tree 2: Amazon Rainforest */}
                  {progress >= 30 && (
                    <g transform="translate(70, 160)">
                      <rect x="-1.5" y="-6" width="3" height="6" fill="#4A2E12" rx="1" />
                      <circle cx="0" cy="-10" r="7" fill="#166534" />
                      <circle cx="-3" cy="-9" r="5" fill="#15803d" />
                      <circle cx="3" cy="-9" r="5" fill="#22c55e" />
                    </g>
                  )}

                  {/* Tree 3: Europe & Africa */}
                  {progress >= 55 && (
                    <g transform="translate(145, 120)">
                      <rect x="-1.5" y="-6" width="3" height="6" fill="#4A2E12" rx="1" />
                      <circle cx="0" cy="-10" r="6.5" fill="#22c55e" />
                      <circle cx="0" cy="-12" r="4" fill="#86efac" />
                    </g>
                  )}

                  {/* Tree 4: East Asia */}
                  {progress >= 75 && (
                    <g transform="translate(225, 80)">
                      <rect x="-1.5" y="-6" width="3" height="6" fill="#4A2E12" rx="1" />
                      <circle cx="0" cy="-10" r="6" fill="#15803d" />
                      <circle cx="2" cy="-10" r="4.5" fill="#4ade80" />
                    </g>
                  )}
                </g>

                {/* Swirling Translucent Clouds Layer */}
                <g className="animate-[earthRotate_16s_linear_infinite] opacity-35">
                  <path
                    d="M 20,80 Q 40,70 60,85 Q 80,75 100,80 Q 70,95 30,90 Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M 160,140 Q 190,130 210,145 Q 230,135 250,140 Q 210,155 170,150 Z"
                    fill="#ffffff"
                  />
                  <path
                    d="M 320,80 Q 340,70 360,85 Q 380,75 400,80 Z"
                    fill="#ffffff"
                  />
                </g>

                {/* 3D Day/Night Shadow Shading Overlay */}
                <circle cx="150" cy="150" r="140" fill="url(#dayNightShadow)" />
              </g>

              {/* Atmosphere Rim Specular Highlight Line */}
              <circle
                cx="150"
                cy="150"
                r="139.5"
                fill="none"
                stroke="url(#rimGlow)"
                strokeWidth="2.5"
              />
            </svg>
          </div>

          {/* Orbiting Birds Layer IN FRONT of Earth */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <g className="animate-[spin_9s_linear_infinite] origin-center">
                {/* Bird 1 (Front Orbit) */}
                <g transform="translate(210, 80) scale(0.9)">
                  <path
                    d="M 0,0 Q 8,-10 16,-4 Q 8,-2 0,0 Z M 0,0 Q -8,-10 -16,-4 Q -8,-2 0,0 Z"
                    fill="#ecfdf5"
                    className="drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  />
                </g>
                {/* Bird 2 */}
                <g transform="translate(80, 220) scale(0.8)">
                  <path
                    d="M 0,0 Q 8,-10 16,-4 Q 8,-2 0,0 Z M 0,0 Q -8,-10 -16,-4 Q -8,-2 0,0 Z"
                    fill="#fef08a"
                    className="drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]"
                  />
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* CSS Keyframes for smooth 60fps Earth rotation */}
        <style>{`
          @keyframes earthRotate {
            0% { transform: translateX(0px); }
            100% { transform: translateX(-300px); }
          }
        `}</style>

        {/* Brand & Progress Card */}
        <div className="text-center space-y-3.5 max-w-md w-full px-4 relative z-30">
          <div className="inline-flex items-center space-x-2 bg-[#0A3319] border border-emerald-500/50 px-4 py-1.5 rounded-full shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4C430] animate-ping" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#86EFAC]">
              GLOBAL GREEN EARTH INITIATIVE
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-white">
            KANVANA <span className="text-[#F4C430]">FOUNDATION</span>
          </h1>

          <p className="text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide min-h-[20px]">
            {getStatusText()}
          </p>

          {/* Plantation Drive Badge & Callout (Replaces generic 0-100% bar) */}
          <div className="pt-2 space-y-3">
            <div className="bg-gradient-to-r from-emerald-950/80 via-[#0A3319] to-emerald-950/80 border border-emerald-500/40 p-3.5 rounded-2xl shadow-xl backdrop-blur-md flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2 text-[#F4C430] font-black text-xs sm:text-sm tracking-wide">
                <TreePine className="w-4 h-4 text-[#86EFAC] animate-bounce" />
                <span>BE A PART OF OUR PLANTATION DRIVE</span>
                <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
              </div>
              <p className="text-[11px] text-emerald-200/90 font-medium max-w-xs leading-relaxed">
                Join hands to plant native trees, restore green cover, and build a sustainable sanctuary at <span className="text-white font-bold underline decoration-[#F4C430]">Nankari, IIT Kanpur</span>.
              </p>
            </div>

            {/* Subtle Enter / Skip Action Button */}
            <div className="flex items-center justify-center pt-1">
              <button
                onClick={handleSkip}
                className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-200 hover:text-white bg-emerald-900/40 hover:bg-emerald-800/60 px-5 py-2 rounded-full border border-emerald-500/40 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
              >
                <span>Enter Kanvana Foundation</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#F4C430]" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
