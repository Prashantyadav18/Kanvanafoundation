import React, { useEffect, useState } from 'react';

export const ScrollTree: React.FC = () => {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const currentProgress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
      setScrollPercent(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Growth calculations based on scrollPercent (0 to 100)
  const trunkProgress = Math.min(1, scrollPercent / 20);
  const branch1Progress = Math.min(1, Math.max(0, (scrollPercent - 20) / 25));
  const branch2Progress = Math.min(1, Math.max(0, (scrollPercent - 40) / 25));
  const canopyProgress = Math.min(1, Math.max(0, (scrollPercent - 60) / 30));

  return (
    <div 
      className="fixed right-2 bottom-6 z-20 pointer-events-none hidden lg:block opacity-30 hover:opacity-80 transition-opacity duration-300"
      title="Scroll-reactive tree growth progress"
    >
      <div className="bg-[#0D2818]/80 backdrop-blur-md p-3 rounded-2xl border border-[#1B5E34] shadow-2xl flex flex-col items-center">
        <svg className="w-24 h-48 overflow-visible" viewBox="0 0 100 200">
          {/* Ground Soil */}
          <line x1="10" y1="190" x2="90" y2="190" stroke="#C8A96E" strokeWidth="4" strokeLinecap="round" />

          {/* Main Trunk */}
          <path
            d="M 50 190 Q 48 130 50 70"
            stroke="#1B5E34"
            strokeWidth="8"
            fill="none"
            strokeDasharray="130"
            strokeDashoffset={130 * (1 - trunkProgress)}
            strokeLinecap="round"
          />

          {/* Left Branch */}
          <path
            d="M 50 130 Q 30 110 20 95"
            stroke="#4CAF50"
            strokeWidth="5"
            fill="none"
            strokeDasharray="60"
            strokeDashoffset={60 * (1 - branch1Progress)}
            strokeLinecap="round"
          />

          {/* Right Branch */}
          <path
            d="M 50 110 Q 70 90 82 75"
            stroke="#4CAF50"
            strokeWidth="5"
            fill="none"
            strokeDasharray="60"
            strokeDashoffset={60 * (1 - branch2Progress)}
            strokeLinecap="round"
          />

          {/* Lush Canopy Leaves */}
          {canopyProgress > 0 && (
            <g transform={`scale(${canopyProgress})`} style={{ transformOrigin: '50px 60px' }}>
              <circle cx="20" cy="90" r="12" fill="#86EFAC" opacity="0.8" />
              <circle cx="82" cy="70" r="14" fill="#86EFAC" opacity="0.8" />
              <circle cx="50" cy="50" r="24" fill="#4CAF50" opacity="0.9" />
              <circle cx="35" cy="40" r="16" fill="#86EFAC" opacity="0.7" />
              <circle cx="65" cy="45" r="18" fill="#F4C430" opacity="0.6" />
            </g>
          )}
        </svg>

        <div className="mt-2 text-center">
          <span className="font-display text-[10px] uppercase font-bold text-[#86EFAC] tracking-wider block">
            Tree Growth
          </span>
          <span className="font-mono text-xs font-semibold text-[#F4C430]">
            {Math.round(scrollPercent)}%
          </span>
        </div>
      </div>
    </div>
  );
};
