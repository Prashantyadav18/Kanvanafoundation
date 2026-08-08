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
    <section id="pillars" className="py-24 bg-[#E8F2EA] text-slate-800 relative border-b border-emerald-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#15803D] bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 inline-block mb-3">
            What We Do
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0A3319] tracking-tight">
            {getTranslation(language, 'pillars_title')}
          </h2>
          <p className="mt-4 text-slate-700 font-medium text-base sm:text-lg">
            Structured field interventions designed for long-term ecological survival and community ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((p) => (
            <div
              key={p.id}
              className="group bg-white text-slate-900 rounded-3xl border-2 border-emerald-200/90 overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#15803D] transition-all transform hover:-translate-y-1 flex flex-col justify-between"
            >
              {/* Image Header */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A3319]/60 via-transparent to-transparent" />
                <span className="absolute top-4 right-4 bg-[#0A3319] text-[#F4C430] text-[10px] font-black uppercase px-3 py-1 rounded-full border border-[#F4C430]/40 shadow-md">
                  {p.tag}
                </span>
              </div>

              {/* Body Content */}
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="mb-4">{p.icon}</div>
                  <h3 className="font-display font-extrabold text-2xl text-[#0A3319] group-hover:text-[#15803D] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
                    {p.body}
                  </p>
                </div>

                <div className="pt-4 border-t border-emerald-100">
                  <button
                    onClick={() => onSelectAction(p.id)}
                    className="w-full py-3 px-4 rounded-xl bg-[#0A3319] hover:bg-[#15803D] text-[#F4C430] hover:text-white text-xs font-extrabold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>{p.actionText}</span>
                    <ArrowRight className="w-4 h-4 text-[#F4C430]" />
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
