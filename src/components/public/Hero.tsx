import React, { useState, useEffect } from 'react';
import { ArrowDown, Calendar, Sparkles, TreePine, Droplets, Users, Heart, Presentation } from 'lucide-react';
import { FloatingLeaves } from '../common/FloatingLeaves';
import { Language } from '../../types';
import { getTranslation } from '../common/translations';

interface HeroProps {
  language: Language;
  onPlantClick: () => void;
  onImpactClick: () => void;
  onOpenJoinModal: () => void;
  onOpenPitchDeck?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onPlantClick,
  onImpactClick,
  onOpenJoinModal,
  onOpenPitchDeck
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
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A3319] via-[#0D2818] to-[#124223] text-white overflow-hidden border-b-4 border-[#F4C430]">
      {/* Ambient particles */}
      <FloatingLeaves />

      {/* Decorative Forest Glow Effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#16A34A]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F4C430]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Eyebrow badge */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#1B5E34]/80 border border-[#4CAF50]/50 text-[#86EFAC] text-xs font-extrabold tracking-wider uppercase shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
            <span>Nankari, IIT Kanpur — Environmental Movement</span>
          </div>

          {/* 1,000+ Trees Before 2027 Target Card */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#0D2818] via-[#1B5E34] to-[#0D2818] border-2 border-[#F4C430] text-white shadow-xl backdrop-blur-md hover:scale-105 transition-all">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F4C430] animate-ping shrink-0" />
            <span className="text-xs font-black text-[#F4C430] tracking-wide">
              {language === 'hi' ? '🎯 लक्ष्य: 2027 से पहले 1,000+ पौधे लगाना' : '🎯 TARGET: Plant 1,000+ Trees Before 2027'}
            </span>
          </div>
        </div>

        {/* Display Headings */}
        <div className="space-y-3">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-none drop-shadow-md">
            {getTranslation(language, 'hero_title')}
          </h1>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#86EFAC] leading-none drop-shadow-sm">
            {getTranslation(language, 'hero_title_sub')}
          </h2>
        </div>

        {/* Sub-headline */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-emerald-100/90 font-sans leading-relaxed drop-shadow-sm">
          {getTranslation(language, 'hero_desc')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 w-full px-2 sm:px-0">
          <button
            onClick={onPlantClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F4C430] text-[#0A3319] font-display font-black text-sm sm:text-base uppercase tracking-wider hover:bg-white hover:text-[#0A3319] transition-all transform hover:-translate-y-1 shadow-2xl shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer border-2 border-amber-300"
          >
            <TreePine className="w-5 h-5 text-[#0A3319]" />
            <span>{getTranslation(language, 'cta_plant')}</span>
          </button>

          <button
            onClick={onImpactClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl border-2 border-emerald-400/80 bg-[#0A3319]/60 backdrop-blur-md text-emerald-100 font-display font-bold text-sm sm:text-base uppercase tracking-wider hover:bg-emerald-800/80 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
          >
            <span>{getTranslation(language, 'cta_impact')}</span>
          </button>
        </div>

        {/* MISSION COUNTDOWN TIMER BLOCK */}
        <div className="mt-12 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-[#0D2818]/90 border-2 border-[#F4C430] shadow-2xl backdrop-blur-md relative overflow-hidden group">
          {/* Pulsing Gold Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 animate-pulse pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-[#F4C430] font-display font-extrabold text-sm tracking-wider uppercase">
              <Calendar className="w-4 h-4 text-[#F4C430]" />
              <span>{getTranslation(language, 'timer_title')}</span>
            </div>

            <p className="text-xs text-[#86EFAC] font-bold">
              {getTranslation(language, 'timer_subtitle')}
            </p>

            {/* Timer Digits */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto pt-2">
              <div className="bg-[#1B5E34]/80 p-3 sm:p-4 rounded-2xl border border-[#4CAF50]/40 shadow-inner">
                <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4C430] block drop-shadow-sm">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-[#86EFAC] font-extrabold uppercase tracking-wider block">
                  Days
                </span>
              </div>

              <div className="bg-[#1B5E34]/80 p-3 sm:p-4 rounded-2xl border border-[#4CAF50]/40 shadow-inner">
                <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4C430] block drop-shadow-sm">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-[#86EFAC] font-extrabold uppercase tracking-wider block">
                  Hours
                </span>
              </div>

              <div className="bg-[#1B5E34]/80 p-3 sm:p-4 rounded-2xl border border-[#4CAF50]/40 shadow-inner">
                <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4C430] block drop-shadow-sm">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-[#86EFAC] font-extrabold uppercase tracking-wider block">
                  Mins
                </span>
              </div>

              <div className="bg-[#1B5E34]/80 p-3 sm:p-4 rounded-2xl border border-[#4CAF50]/40 shadow-inner">
                <span className="font-display font-extrabold text-2xl sm:text-4xl text-[#F4C430] block drop-shadow-sm">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs text-[#86EFAC] font-extrabold uppercase tracking-wider block">
                  Secs
                </span>
              </div>
            </div>

            <button
              onClick={onOpenJoinModal}
              className="mt-4 px-6 py-3 rounded-xl bg-[#F4C430] text-[#0A3319] font-black text-xs uppercase tracking-wider hover:bg-white hover:text-[#0A3319] transition-all inline-flex items-center space-x-1.5 shadow-xl cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current text-[#0A3319]" />
              <span>Register for Independence Day Drive</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pt-8">
          <a
            href="#stats"
            className="inline-flex flex-col items-center text-xs font-bold text-[#86EFAC] hover:text-[#F4C430] transition-colors"
          >
            <span className="uppercase tracking-widest mb-1">Scroll to Explore</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-[#F4C430]" />
          </a>
        </div>
      </div>
    </section>
  );
};
