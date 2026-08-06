import React, { useEffect, useState } from 'react';
import { TreePine, Users, MapPin, Bird } from 'lucide-react';
import { SiteStats, Language } from '../../types';
import { getTranslation } from '../common/translations';

interface ImpactStatsProps {
  stats: SiteStats;
  language: Language;
}

export const ImpactStats: React.FC<ImpactStatsProps> = ({ stats, language }) => {
  const [counts, setCounts] = useState({
    trees: 0,
    volunteers: 0,
    districts: 0,
    birds: 0
  });

  useEffect(() => {
    // Simple duration animate count up to target numbers
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        trees: Math.floor(stats.treesPlanted * easeOut),
        volunteers: Math.floor(stats.volunteersActive * easeOut),
        districts: Math.floor(stats.districtsReached * easeOut),
        birds: Math.floor(stats.birdsServed * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          trees: stats.treesPlanted,
          volunteers: stats.volunteersActive,
          districts: stats.districtsReached,
          birds: stats.birdsServed
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [stats]);

  const statItems = [
    {
      icon: <TreePine className="w-8 h-8 text-[#4CAF50]" />,
      value: counts.trees > 0 ? `${counts.trees.toLocaleString()}+` : 'Coming Soon',
      label: getTranslation(language, 'stat_trees'),
      subtext: counts.trees > 0 ? 'Planted across UP' : 'Official Drive Launching Soon'
    },
    {
      icon: <Users className="w-8 h-8 text-[#F4C430]" />,
      value: counts.volunteers > 0 ? counts.volunteers.toLocaleString() : 'Coming Soon',
      label: getTranslation(language, 'stat_volunteers'),
      subtext: counts.volunteers > 0 ? 'Student & Community' : 'Registration Launching Soon'
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#C8A96E]" />,
      value: counts.districts > 0 ? counts.districts.toString() : 'Coming Soon',
      label: getTranslation(language, 'stat_districts'),
      subtext: counts.districts > 0 ? 'Expanding Nationally' : 'Expanding Across UP'
    },
    {
      icon: <Bird className="w-8 h-8 text-[#86EFAC]" />,
      value: counts.birds > 0 ? `${counts.birds.toLocaleString()}+` : 'Coming Soon',
      label: getTranslation(language, 'stat_birds'),
      subtext: counts.birds > 0 ? 'Summer Water Stations' : 'Summer Water Network'
    }
  ];

  return (
    <section id="stats" className="py-20 bg-[#F9FBF7] text-[#1A2E1F] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1B5E34] block mb-2">
            Verified Impact Metrics
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0D2818] tracking-tight">
            TRANSPARENT, FIELD-VERIFIED NUMBERS
          </h2>
          <p className="mt-4 text-[#6B7F6E] text-base sm:text-lg">
            Every tree planted and water station set up is logged by our verified surveyors across Uttar Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="bg-[#0D2818] text-[#F9FBF7] p-8 rounded-3xl border border-[#1B5E34] shadow-xl hover:border-[#4CAF50] transition-all transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-[#1B5E34]/50 rounded-2xl border border-[#1B5E34]">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono text-[#86EFAC] bg-[#1B5E34]/60 px-2 py-1 rounded-md">
                  LIVE DATA
                </span>
              </div>

              <div>
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-[#4CAF50] tracking-tight block">
                  {item.value}
                </span>
                <span className="font-display font-bold text-lg text-[#F9FBF7] block mt-1">
                  {item.label}
                </span>
                <span className="text-xs text-[#6B7F6E] block mt-1">
                  {item.subtext}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
