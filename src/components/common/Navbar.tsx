import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, Globe, Shield, Smartphone, QrCode, Home, Heart, Presentation } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from './translations';

interface NavbarProps {
  currentPortal: 'public' | 'surveyor' | 'admin' | 'tree';
  onSelectPortal: (portal: 'public' | 'surveyor' | 'admin' | 'tree') => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenJoinModal: () => void;
  onOpenPitchDeck?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  onSelectPortal,
  language,
  onToggleLanguage,
  onOpenJoinModal,
  onOpenPitchDeck
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: getTranslation(language, 'nav_home'), href: '#hero' },
    { label: getTranslation(language, 'nav_about'), href: '#founder' },
    { label: getTranslation(language, 'nav_mission'), href: '#pillars' },
    { label: getTranslation(language, 'nav_gallery'), href: '#gallery' },
    { label: getTranslation(language, 'nav_map'), href: '#map' },
    { label: getTranslation(language, 'nav_certificate'), href: '#certificate-generator' },
    { label: getTranslation(language, 'nav_tree_qr'), href: '#tree-qr' },
    { label: getTranslation(language, 'nav_contact'), href: '#enquiry' }
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentPortal !== 'public') {
      onSelectPortal('public');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || currentPortal !== 'public'
          ? 'bg-white/95 backdrop-blur-md border-b border-emerald-900/10 py-3 shadow-md'
          : 'bg-gradient-to-b from-white/90 via-white/70 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            onSelectPortal('public');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-3 text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#0A3319] p-2 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-[#0A3319] block leading-none">
              KANVANA <span className="text-[#D97706]">FOUNDATION</span>
            </span>
            <span className="text-[10px] text-[#15803D] tracking-widest uppercase font-semibold block mt-0.5">
              Nankari, IIT Kanpur
            </span>
          </div>
        </button>

        {/* Desktop Website Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium">
          {currentPortal === 'public' ? (
            navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-slate-700 hover:text-[#15803D] transition-colors py-1 font-semibold"
              >
                {link.label}
              </a>
            ))
          ) : (
            <button
              onClick={() => onSelectPortal('public')}
              className="px-3 py-1.5 rounded-full bg-emerald-50 text-[#15803D] hover:bg-[#15803D] hover:text-white transition-colors flex items-center space-x-1.5 text-xs font-bold border border-emerald-200"
            >
              <Home className="w-3.5 h-3.5" />
              <span>← Return to Public Website</span>
            </button>
          )}
        </nav>

        {/* Right CTA + Language Toggle */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Language Toggle */}
          <button
            onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-200 text-xs font-semibold text-[#15803D] bg-emerald-50/60 hover:bg-emerald-100 transition-colors"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'EN | हिं' : 'हिं | EN'}</span>
          </button>

          {/* Join Movement Button */}
          <button
            onClick={onOpenJoinModal}
            className="px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide uppercase bg-[#0A3319] text-[#F4C430] hover:bg-[#15803D] hover:text-white transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{getTranslation(language, 'join_button')}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
            className="p-2 rounded-lg border border-emerald-200 text-xs font-bold text-[#15803D] bg-emerald-50"
          >
            {language === 'en' ? 'हिं' : 'EN'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-emerald-50 text-[#0A3319] border border-emerald-200"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 border-b border-emerald-100 px-6 py-6 space-y-6 animate-fadeIn shadow-2xl">
          {/* Nav Links */}
          <div className="space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left py-2 font-bold text-slate-800 hover:text-[#15803D] border-b border-slate-100 text-sm"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinModal();
              }}
              className="w-full py-3 rounded-xl bg-[#0A3319] text-[#F4C430] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{getTranslation(language, 'join_button')}</span>
            </button>
          </div>

          {/* Discreet Staff Portal Access */}
          <div className="pt-4 border-t border-slate-200">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
              Staff & Field Access
            </p>
            <div className="flex items-center space-x-2 text-[11px]">
              <button
                onClick={() => { onSelectPortal('surveyor'); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#15803D] border border-emerald-200 hover:bg-emerald-100 font-semibold"
              >
                Surveyor Login
              </button>
              <button
                onClick={() => { onSelectPortal('admin'); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#15803D] border border-emerald-200 hover:bg-emerald-100 font-semibold"
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
