import React, { useState, useEffect } from 'react';
import { Leaf, Menu, X, Globe, Shield, Smartphone, QrCode, Home, Heart } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from './translations';

interface NavbarProps {
  currentPortal: 'public' | 'surveyor' | 'admin' | 'tree';
  onSelectPortal: (portal: 'public' | 'surveyor' | 'admin' | 'tree') => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onOpenJoinModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  onSelectPortal,
  language,
  onToggleLanguage,
  onOpenJoinModal
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
          ? 'bg-[#0D2818]/95 backdrop-blur-md border-b border-[#1B5E34] py-3 shadow-xl'
          : 'bg-gradient-to-b from-[#0D2818]/90 via-[#0D2818]/50 to-transparent py-5'
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#1B5E34] p-2 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Leaf className="w-6 h-6 text-[#86EFAC]" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-[#F9FBF7] block leading-none">
              KANVANA <span className="text-[#F4C430]">FOUNDATION</span>
            </span>
            <span className="text-[10px] text-[#86EFAC] tracking-widest uppercase font-medium block mt-0.5">
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
                className="text-[#F9FBF7]/80 hover:text-[#86EFAC] transition-colors py-1 font-semibold"
              >
                {link.label}
              </a>
            ))
          ) : (
            <button
              onClick={() => onSelectPortal('public')}
              className="px-3 py-1.5 rounded-full bg-[#1B5E34] text-[#86EFAC] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors flex items-center space-x-1.5 text-xs font-bold"
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
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-[#1B5E34] text-xs font-medium text-[#86EFAC] hover:bg-[#1B5E34]/50 transition-colors"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'EN | हिं' : 'हिं | EN'}</span>
          </button>

          {/* Join Movement Button */}
          <button
            onClick={onOpenJoinModal}
            className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase border-2 border-[#F4C430] text-[#F4C430] hover:bg-[#F4C430] hover:text-[#0D2818] transition-all shadow-md hover:shadow-[#F4C430]/20 flex items-center space-x-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{getTranslation(language, 'join_button')}</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center space-x-2 lg:hidden">
          <button
            onClick={() => onToggleLanguage(language === 'en' ? 'hi' : 'en')}
            className="p-2 rounded-lg border border-[#1B5E34] text-xs font-bold text-[#86EFAC]"
          >
            {language === 'en' ? 'हिं' : 'EN'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#1B5E34]/60 text-[#F9FBF7] border border-[#1B5E34]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D2818] border-b border-[#1B5E34] px-6 py-6 space-y-6 animate-fadeIn">
          {/* Nav Links */}
          <div className="space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left font-display text-base text-[#F9FBF7]/90 hover:text-[#86EFAC] py-1 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Join Movement button */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenJoinModal();
            }}
            className="w-full py-3 rounded-xl bg-[#F4C430] text-[#0D2818] font-bold text-sm tracking-wide uppercase shadow-lg text-center"
          >
            {getTranslation(language, 'join_button')}
          </button>

          {/* Discreet Staff Portal Access */}
          <div className="pt-4 border-t border-[#1B5E34]">
            <p className="text-[10px] uppercase font-bold text-[#6B7F6E] tracking-wider mb-2">
              Staff & Field Access
            </p>
            <div className="flex items-center space-x-2 text-[11px]">
              <button
                onClick={() => { onSelectPortal('surveyor'); setMobileMenuOpen(false); }}
                className="px-2.5 py-1 rounded-lg bg-[#1B5E34]/40 text-[#86EFAC] hover:bg-[#1B5E34]"
              >
                Surveyor Login
              </button>
              <button
                onClick={() => { onSelectPortal('admin'); setMobileMenuOpen(false); }}
                className="px-2.5 py-1 rounded-lg bg-[#1B5E34]/40 text-[#86EFAC] hover:bg-[#1B5E34]"
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
