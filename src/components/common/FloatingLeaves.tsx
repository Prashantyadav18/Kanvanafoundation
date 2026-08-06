import React from 'react';

export const FloatingLeaves: React.FC = () => {
  const leaves = Array.from({ length: 18 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {leaves.map((_, i) => {
        const left = Math.floor(Math.random() * 95) + 2;
        const duration = Math.floor(Math.random() * 12) + 14; // 14s to 26s
        const delay = Math.floor(Math.random() * 15);
        const size = Math.floor(Math.random() * 16) + 12;

        return (
          <div
            key={i}
            className="absolute opacity-30 text-[#4CAF50] animate-leaf-float"
            style={{
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              width: `${size}px`,
              height: `${size}px`
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#86EFAC]/40">
              <path d="M17,8C8,10,5,16,5,22C11,22,17,19,19,10C19,9,18,8,17,8Z" />
              <path d="M7,14C12,13,16,11,18,7" stroke="#1B5E34" strokeWidth="1" fill="none" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
