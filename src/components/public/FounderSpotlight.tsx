import React, { useState, useEffect } from 'react';
import { Quote, Linkedin, Twitter, Instagram, Mail, Award } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../common/translations';
import { store } from '../../services/store';

interface FounderSpotlightProps {
  language: Language;
}

export const FounderSpotlight: React.FC<FounderSpotlightProps> = ({ language }) => {
  const [founderPhoto, setFounderPhoto] = useState(store.getFounderPhoto());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setFounderPhoto(store.getFounderPhoto());
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="founder" className="py-24 bg-[#0D2818] text-[#F9FBF7] relative border-t border-b border-[#1B5E34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Portrait & Badge */}
          <div className="lg:col-span-5 flex flex-col items-center text-center">
            <div className="relative group">
              {/* Gold Ring Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#F4C430] via-[#86EFAC] to-[#4CAF50] rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500" />
              
              {/* Founder Avatar Image */}
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-[#0D2818] bg-[#1B5E34] shadow-2xl flex items-center justify-center">
                <img
                  src={founderPhoto}
                  alt="Prashant Yadav - Founder, Kanvana Foundation"
                  className="w-full h-full object-cover transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Tag overlay */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-[#0D2818] border-2 border-[#F4C430] text-[#F4C430] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-xl flex items-center space-x-1.5 whitespace-nowrap">
                <Award className="w-4 h-4 text-[#F4C430]" />
                <span>Founding Director</span>
              </div>
            </div>

            <div className="mt-8 space-y-1">
              <span className="text-xs font-mono text-[#86EFAC]">Est. August 15, 2026</span>
              <p className="text-xs text-[#6B7F6E]">Nankari, IIT Kanpur, UP, India</p>
            </div>
          </div>

          {/* Right Column: Information & Quote */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F4C430] block mb-2">
                {getTranslation(language, 'founder_eyebrow')}
              </span>

              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-gold-shimmer tracking-tight">
                {getTranslation(language, 'founder_title')}
              </h2>

              <p className="font-display font-semibold text-lg text-[#86EFAC] mt-1">
                {getTranslation(language, 'founder_role')}
              </p>
              <p className="text-sm text-[#6B7F6E]">
                {getTranslation(language, 'founder_subtitle')}
              </p>
            </div>

            {/* Quote Block */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#1B5E34]/30 border border-[#1B5E34] backdrop-blur-md space-y-4">
              <Quote className="w-10 h-10 text-[#F4C430]/40 absolute top-4 left-4 pointer-events-none" />
              
              <blockquote className="font-serif-quote italic text-xl sm:text-2xl text-[#F9FBF7] leading-relaxed relative z-10 pt-2">
                {getTranslation(language, 'founder_quote')}
              </blockquote>

              <div className="pt-2 border-t border-[#1B5E34] text-xs text-[#86EFAC]">
                — Prashant Yadav, on launching Kanvana Foundation from Nankari, IIT Kanpur
              </div>
            </div>

            {/* Bio Details */}
            <p className="text-sm sm:text-base text-[#F9FBF7]/80 leading-relaxed">
              Prashant Yadav founded Kanvana Foundation with a singular vision: to transition environmental conservation from symbolic annual events into a continuous, ground-level field movement. Starting from Nankari adjacent to IIT Kanpur, Kanvana mobilizes student youth and rural communities across Uttar Pradesh to plant, protect, and track indigenous trees while providing critical summer water points for birds.
            </p>

            {/* Social Links Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://www.linkedin.com/in/prashant-yadav-77167931b?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[#1B5E34]/50 hover:bg-[#4CAF50] text-[#F9FBF7] hover:text-[#0D2818] transition-all border border-[#1B5E34]"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/Baadshaprashant"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[#1B5E34]/50 hover:bg-[#4CAF50] text-[#F9FBF7] hover:text-[#0D2818] transition-all border border-[#1B5E34]"
                title="Twitter/X Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/prashantyadav18_?igsh=MWs1bHc3cmQ1Ymh0NA=="
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl bg-[#1B5E34]/50 hover:bg-[#4CAF50] text-[#F9FBF7] hover:text-[#0D2818] transition-all border border-[#1B5E34]"
                title="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:18prashantyadav@gmail.com"
                className="px-4 py-2.5 rounded-xl bg-[#1B5E34]/50 hover:bg-[#1B5E34] text-[#86EFAC] text-xs font-semibold transition-all border border-[#1B5E34] flex items-center space-x-2"
                title="Email Founder"
              >
                <Mail className="w-4 h-4" />
                <span>18prashantyadav@gmail.com</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
