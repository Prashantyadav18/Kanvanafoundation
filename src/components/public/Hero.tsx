import React, { useState, useEffect } from 'react';
import { ArrowDown, Calendar, Sparkles, TreePine, Droplets, Users, Heart } from 'lucide-react';
import { FloatingLeaves } from '../common/FloatingLeaves';
import { Language } from '../../types';
import { getTranslation } from '../common/translations';

interface HeroProps {
  language: Language;
  onPlantClick: () => void;
  onImpactClick: () => void;
  onOpenJoinModal: () => void;
  onOpenStory?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onPlantClick,
  onImpactClick,
  onOpenJoinModal,
  onOpenStory
}) => {
  // Countdown to August 15, 2026 00:00:00 IST
  const targetDate = new Date('2026-08-15T00:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [targetDate]);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0D2818] via-[#1B5E34]/40 to-[#0D2818] overflow-hidden">
      {/* Ambient particles */}
      <FloatingLeaves />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#1B5E34]/60 border border-[#86EFAC]/30 backdrop-blur-md text-[#86EFAC] text-xs font-semibold tracking-wider uppercase shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
          <span>Nankari, IIT Kanpur — Environmental Movement</span>
        </div>

        {/* Display Headings */}
        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#F9FBF7] leading-none">
            {getTranslation(language, 'hero_title')}
          </h1>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#86EFAC] leading-none">
            {getTranslation(language, 'hero_title_sub')}
          </h2>
        </div>

        {/* Sub-headline */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-[#F9FBF7]/80 font-sans leading-relaxed">
          {getTranslation(language, 'hero_desc')}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onPlantClick}
            className="px-8 py-4 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-display font-bold text-base uppercase tracking-wider hover:bg-[#86EFAC] transition-all transform hover:-translate-y-0.5 shadow-xl shadow-[#4CAF50]/20 flex items-center space-x-2 cursor-pointer"
          >
            <TreePine className="w-5 h-5" />
            <span>{getTranslation(language, 'cta_plant')}</span>
          </button>

          {onOpenStory && (
            <button
              onClick={onOpenStory}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F4C430] to-[#FFE066] text-[#0D2818] font-display font-bold text-base uppercase tracking-wider hover:scale-105 transition-all shadow-xl shadow-[#F4C430]/20 flex items-center space-x-2 border-2 border-[#F4C430] cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-[#0D2818]" />
              <span>{language === 'hi' ? '✨ पेड़ की कहानी (Tree Story)' : '✨ Tree Story Animation'}</span>
            </button>
          )}

          <button
            onClick={onImpactClick}
            className="px-8 py-4 rounded-2xl border-2 border-[#1B5E34] bg-[#0D2818]/60 text-[#F9FBF7] font-display font-bold text-base uppercase tracking-wider hover:bg-[#1B5E34] transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>{getTranslation(language, 'cta_impact')}</span>
          </button>
        </div>

        {/* MISSION COUNTDOWN TIMER BLOCK */}
        <div className="mt-12 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0D2818]/90 border-2 border-[#F4C430] shadow-2xl relative overflow-hidden group">
          {/* Pulsing Gold Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4C430]/10 via-transparent to-[#F4C430]/10 animate-pulse pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-[#F4C430] font-display font-bold text-sm tracking-wider uppercase">
              <Calendar className="w-4 h-4" />
              <span>{getTranslation(language, 'timer_title')}</span>
            </div>

            <p className="text-xs text-[#86EFAC] font-medium">
              {getTranslation(language, 'timer_subtitle')}
            </p>

            {/* Timer Digits */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto pt-2">
              <div className="bg-[#1B5E34]/80 p-3 sm:p-4 rounded-2xl border border-[#1B5E34]">
                <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4C430] block">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-[#86EFAC] font-semibold uppercase tracking-wider block">
                  Days
                </span>
              </div>

              <div className="bg-[#1B5E34]/80 p-3 sm:p-4 rounded-2xl border border-[#1B5E34]">
                <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4C430] block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-[#86EFAC] font-semibold uppercase tracking-wider block">
                  Hours
                </span>
              </div>

              <div className="bg-[#1B5E34]/80 p-3 sm:p-4 rounded-2xl border border-[#1B5E34]">
                <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4C430] block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-[#86EFAC] font-semibold uppercase tracking-wider block">
                  Mins
                </span>
              </div>

              <div className="bg-[#1B5E34]/80 p-3 sm:p-4 rounded-2xl border border-[#1B5E34]">
                <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4C430] block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-[#86EFAC] font-semibold uppercase tracking-wider block">
                  Secs
                </span>
              </div>
            </div>

            <button
              onClick={onOpenJoinModal}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#FFF5C0] transition-all inline-flex items-center space-x-1.5 shadow-md"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Register for Independence Day Drive</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pt-8">
          <a
            href="#stats"
            className="inline-flex flex-col items-center text-xs font-semibold text-[#86EFAC] hover:text-[#F4C430] transition-colors"
          >
            <span className="uppercase tracking-widest mb-1">Scroll to Explore</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#F4C430]" />
          </a>
        </div>
      </div>
    </section>
  );
};
