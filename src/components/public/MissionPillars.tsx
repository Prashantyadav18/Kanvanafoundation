import React from 'react';
import { TreePine, Bird, Users, ArrowRight } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../common/translations';

interface MissionPillarsProps {
  language: Language;
  onSelectAction: (action: string) => void;
}

export const MissionPillars: React.FC<MissionPillarsProps> = ({ language, onSelectAction }) => {
  const pillars = [
    {
      id: 'plantation',
      icon: <TreePine className="w-10 h-10 text-[#4CAF50] group-hover:scale-110 transition-transform" />,
      title: getTranslation(language, 'pillar1_title'),
      body: getTranslation(language, 'pillar1_desc'),
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
      tag: 'Native Species Focus',
      actionText: 'Request Plantation Drive'
    },
    {
      id: 'birds',
      icon: <Bird className="w-10 h-10 text-[#86EFAC] group-hover:scale-110 transition-transform" />,
      title: getTranslation(language, 'pillar2_title'),
      body: getTranslation(language, 'pillar2_desc'),
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&q=80&w=800',
      tag: 'Summer Lifesaver',
      actionText: 'Sponsor Water Pots'
    },
    {
      id: 'volunteers',
      icon: <Users className="w-10 h-10 text-[#F4C430] group-hover:scale-110 transition-transform" />,
      title: getTranslation(language, 'pillar3_title'),
      body: getTranslation(language, 'pillar3_desc'),
      image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=800',
      tag: 'Ground Operations',
      actionText: 'Become a Surveyor'
    }
  ];

  return (
    <section id="pillars" className="py-24 bg-[#F9FBF7] text-[#1A2E1F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B5E34] block mb-2">
            What We Do
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0D2818] tracking-tight">
            {getTranslation(language, 'pillars_title')}
          </h2>
          <p className="mt-4 text-[#6B7F6E] text-base sm:text-lg">
            Structured field interventions designed for long-term ecological survival and community ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <div
              key={p.id}
              className="group bg-[#0D2818] text-[#F9FBF7] rounded-3xl border border-[#1B5E34] overflow-hidden shadow-xl hover:border-[#4CAF50] transition-all flex flex-col justify-between"
            >
              {/* Image Header */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D2818] via-transparent to-transparent" />
                <span className="absolute top-4 right-4 bg-[#0D2818]/90 text-[#86EFAC] text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-[#1B5E34]">
                  {p.tag}
                </span>
              </div>

              {/* Body Content */}
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-4">{p.icon}</div>
                  <h3 className="font-display font-bold text-2xl text-[#F9FBF7] group-hover:text-[#86EFAC] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#F9FBF7]/80 leading-relaxed">
                    {p.body}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#1B5E34]">
                  <button
                    onClick={() => onSelectAction(p.id)}
                    className="w-full py-3 px-4 rounded-xl bg-[#1B5E34]/60 hover:bg-[#4CAF50] text-[#86EFAC] hover:text-[#0D2818] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                  >
                    <span>{p.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
