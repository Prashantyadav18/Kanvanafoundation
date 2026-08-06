import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageLoaderProps {
  onComplete?: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check session storage so loader doesn't repeat unnecessarily within session
    const hasLoaded = sessionStorage.getItem('kanvana_loaded');
    if (hasLoaded) {
      setVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            sessionStorage.setItem('kanvana_loaded', 'true');
            setVisible(false);
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="global-loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="fixed inset-0 z-[9999] bg-[#0D2818] flex flex-col items-center justify-center p-6 text-[#F9FBF7]"
      >
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          {/* Animated SVG Tree Growth */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 200">
            {/* Ground Soil */}
            <motion.path
              d="M 20 170 Q 100 160 180 170"
              stroke="#C8A96E"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
            />

            {/* Main Trunk */}
            <motion.path
              d="M 100 170 C 100 130, 95 100, 100 60"
              stroke="#4CAF50"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.min(1, progress / 40) }}
            />

            {/* Left Branch */}
            <motion.path
              d="M 100 110 Q 70 90 50 80"
              stroke="#4CAF50"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.max(0, (progress - 30) / 40) }}
            />

            {/* Right Branch */}
            <motion.path
              d="M 100 90 Q 130 75 150 65"
              stroke="#4CAF50"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: Math.max(0, (progress - 45) / 40) }}
            />

            {/* Leaves Blooming */}
            {progress > 50 && (
              <>
                <motion.circle
                  cx="50"
                  cy="80"
                  r="14"
                  fill="#86EFAC"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.circle
                  cx="150"
                  cy="65"
                  r="16"
                  fill="#86EFAC"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
                <motion.circle
                  cx="100"
                  cy="50"
                  r="22"
                  fill="#4CAF50"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </>
            )}
          </svg>

          {/* Glowing central ring */}
          <div className="absolute inset-0 border-2 border-[#1B5E34] rounded-full animate-ping opacity-20 pointer-events-none" />
        </div>

        {/* Brand & Loading Text */}
        <div className="text-center space-y-3">
          <h1 className="font-display text-3xl font-bold tracking-wider text-[#F9FBF7]">
            KANVANA <span className="text-[#F4C430]">FOUNDATION</span>
          </h1>
          <p className="text-[#86EFAC] text-sm font-medium tracking-widest uppercase">
            Growing a greener tomorrow...
          </p>

          {/* Progress Bar */}
          <div className="w-64 h-1.5 bg-[#1B5E34] rounded-full overflow-hidden mx-auto mt-4">
            <div
              className="h-full bg-gradient-to-r from-[#4CAF50] via-[#86EFAC] to-[#F4C430] transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-[#6B7F6E]">Nankari, IIT Kanpur, UP, India</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
