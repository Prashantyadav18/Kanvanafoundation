import React from 'react';
import { Leaf, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube, Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  onSelectPortal: (portal: 'public' | 'surveyor' | 'admin' | 'tree') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectPortal }) => {
  return (
    <footer className="bg-[#0D2818] text-[#F9FBF7] border-t border-[#1B5E34] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#4CAF50] p-2 flex items-center justify-center text-[#0D2818]">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-[#F9FBF7]">
                KANVANA <span className="text-[#F4C430]">FOUNDATION</span>
              </span>
            </div>

            <p className="font-serif-quote italic text-lg text-[#86EFAC]">
              &ldquo;Rooted in Nankari. Reaching for the sky.&rdquo;
            </p>

            <p className="text-xs text-[#F9FBF7]/70 leading-relaxed max-w-sm">
              Kanvana Foundation is a registered environmental organization based at Nankari, IIT Kanpur, dedicated to native tree plantation, summer bird water stations, and youth field mobilization.
            </p>

            <div className="flex items-center space-x-3 pt-2 text-[#86EFAC]">
              <a href="https://www.instagram.com/kanvanafoundation/" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#1B5E34] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://x.com/officialkanvana" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#1B5E34] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors" title="Twitter / X">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/share/18Ro4TpB38/" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#1B5E34] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors" title="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/kanvana-foundation-6b1567411/" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#1B5E34] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div>
            <h4 className="font-display font-bold text-sm text-[#F4C430] uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F9FBF7]/80">
              <li><a href="#hero" className="hover:text-[#86EFAC] transition-colors">Home</a></li>
              <li><a href="#founder" className="hover:text-[#86EFAC] transition-colors">Founder & Vision</a></li>
              <li><a href="#pillars" className="hover:text-[#86EFAC] transition-colors">Mission Pillars</a></li>
              <li><a href="#gallery" className="hover:text-[#86EFAC] transition-colors">Field Activity Gallery</a></li>
              <li><a href="#map" className="hover:text-[#86EFAC] transition-colors">Interactive GIS Map</a></li>
              <li><a href="#enquiry" className="hover:text-[#86EFAC] transition-colors">Get Involved</a></li>
            </ul>
          </div>

          {/* Column 2: Staff & Internal Tools */}
          <div>
            <h4 className="font-display font-bold text-sm text-[#F4C430] uppercase tracking-wider mb-4">
              Staff & Field
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F9FBF7]/80">
              <li>
                <button onClick={() => onSelectPortal('tree')} className="hover:text-[#86EFAC] transition-colors text-left">
                  Tree QR Code Lookup
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPortal('surveyor')} className="hover:text-[#86EFAC] transition-colors text-left text-[#F9FBF7]/60">
                  Field Surveyor App
                </button>
              </li>
              <li>
                <button onClick={() => onSelectPortal('admin')} className="hover:text-[#86EFAC] transition-colors text-left text-[#F9FBF7]/60">
                  Admin Panel Login
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="font-display font-bold text-sm text-[#F4C430] uppercase tracking-wider mb-4">
              Headquarters
            </h4>
            <ul className="space-y-3 text-xs text-[#F9FBF7]/80">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#4CAF50] shrink-0 mt-0.5" />
                <span>Nankari, IIT Kanpur - 208016, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <a href="mailto:kanvanafoundation@gmail.com" className="hover:text-[#86EFAC] transition-colors">
                  kanvanafoundation@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#4CAF50] shrink-0" />
                <a href="tel:+918318288563" className="hover:text-[#86EFAC] transition-colors">
                  +91 83182 88563
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1B5E34] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7F6E] gap-4">
          <p>© 2026 Kanvana Foundation. Founded by Prashant Yadav at Nankari, IIT Kanpur.</p>
          <p className="flex items-center space-x-1">
            <span>Built with passion for a greener India</span>
            <Heart className="w-3.5 h-3.5 text-[#F4C430] fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
};
