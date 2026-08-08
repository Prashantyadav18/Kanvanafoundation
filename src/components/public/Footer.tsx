import React from 'react';
import { Leaf, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube, Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  onSelectPortal: (portal: 'public' | 'surveyor' | 'admin' | 'tree') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectPortal }) => {
  return (
    <footer className="bg-[#0A3319] text-white border-t border-emerald-900/30 pt-16 pb-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#F4C430] p-2 flex items-center justify-center text-[#0A3319] shadow-md">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                KANVANA <span className="text-[#F4C430]">FOUNDATION</span>
              </span>
            </div>

            <p className="font-serif-quote italic text-lg text-emerald-300">
              &ldquo;Rooted in Nankari. Reaching for the sky.&rdquo;
            </p>

            <p className="text-xs text-emerald-100/80 leading-relaxed max-w-sm">
              Kanvana Foundation is a registered environmental organization based at Nankari, IIT Kanpur, dedicated to native tree plantation, summer bird water stations, and youth field mobilization.
            </p>

            <div className="flex items-center space-x-3 pt-2 text-emerald-200">
              <a href="https://www.instagram.com/kanvanafoundation/" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-emerald-900/60 hover:bg-[#F4C430] hover:text-[#0A3319] transition-all border border-emerald-800" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://x.com/officialkanvana" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-emerald-900/60 hover:bg-[#F4C430] hover:text-[#0A3319] transition-all border border-emerald-800" title="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/share/18Ro4TpB38/" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-emerald-900/60 hover:bg-[#F4C430] hover:text-[#0A3319] transition-all border border-emerald-800" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/kanvana-foundation-6b1567411/" target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-emerald-900/60 hover:bg-[#F4C430] hover:text-[#0A3319] transition-all border border-emerald-800" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div>
            <h4 className="font-display font-extrabold text-xs text-[#F4C430] uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/90 font-medium">
              <li><a href="#hero" className="hover:text-[#F4C430] transition-colors">Home</a></li>
              <li><a href="#founder" className="hover:text-[#F4C430] transition-colors">Founder & Vision</a></li>
              <li><a href="#pillars" className="hover:text-[#F4C430] transition-colors">Mission Pillars</a></li>
              <li><a href="#gallery" className="hover:text-[#F4C430] transition-colors">Field Activity Gallery</a></li>
              <li><a href="#map" className="hover:text-[#F4C430] transition-colors">Interactive GIS Map</a></li>
              <li><a href="#enquiry" className="hover:text-[#F4C430] transition-colors">Get Involved</a></li>
            </ul>
          </div>

          {/* Column 2: Staff & Internal Tools */}
          <div>
            <h4 className="font-display font-extrabold text-xs text-[#F4C430] uppercase tracking-wider mb-4">
              Staff & Field
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/90 font-medium">
              <li>
                <button onClick={() => onSelectPortal('tree')} className="hover:text-[#F4C430] transition-colors text-left cursor-pointer">
                  Tree QR Code Lookup
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPortal('surveyor')} className="hover:text-[#F4C430] transition-colors text-left cursor-pointer text-emerald-100/70">
                  Field Surveyor App
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPortal('admin')} className="hover:text-[#F4C430] transition-colors text-left cursor-pointer text-emerald-100/70">
                  Admin Panel Login
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-display font-extrabold text-xs text-[#F4C430] uppercase tracking-wider mb-4">
              Headquarters
            </h4>
            <ul className="space-y-3 text-xs text-emerald-100/90 font-medium">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#F4C430] shrink-0 mt-0.5" />
                <span>Nankari, IIT Kanpur - 208016, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#F4C430] shrink-0" />
                <a href="mailto:kanvanafoundation@gmail.com" className="hover:text-[#F4C430] transition-colors">
                  kanvanafoundation@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#F4C430] shrink-0" />
                <a href="tel:+918318288563" className="hover:text-[#F4C430] transition-colors">
                  +91 83182 88563
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/80 gap-4">
          <p>© 2026 Kanvana Foundation. Founded by Prashant Yadav at Nankari, IIT Kanpur.</p>
          <p className="flex items-center space-x-1 font-semibold">
            <span>Built with passion for a greener India</span>
            <Heart className="w-3.5 h-3.5 text-[#F4C430] fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
};
