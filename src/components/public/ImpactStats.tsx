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
      icon: <TreePine className="w-8 h-8 text-[#15803D]" />,
      value: counts.trees > 0 ? `${counts.trees.toLocaleString()}+` : 'Coming Soon',
      label: getTranslation(language, 'stat_trees'),
      subtext: counts.trees > 0 ? 'Planted across UP' : 'Official Drive Launching Soon'
    },
    {
      icon: <Users className="w-8 h-8 text-[#D97706]" />,
      value: counts.volunteers > 0 ? counts.volunteers.toLocaleString() : 'Coming Soon',
      label: getTranslation(language, 'stat_volunteers'),
      subtext: counts.volunteers > 0 ? 'Student & Community' : 'Registration Launching Soon'
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#059669]" />,
      value: counts.districts > 0 ? counts.districts.toString() : 'Coming Soon',
      label: getTranslation(language, 'stat_districts'),
      subtext: counts.districts > 0 ? 'Expanding Nationally' : 'Expanding Across UP'
    },
    {
      icon: <Bird className="w-8 h-8 text-[#0284C7]" />,
      value: counts.birds > 0 ? `${counts.birds.toLocaleString()}+` : 'Coming Soon',
      label: getTranslation(language, 'stat_birds'),
      subtext: counts.birds > 0 ? 'Summer Water Stations' : 'Summer Water Network'
    }
  ];

  return (
    <section id="stats" className="py-20 bg-[#EBF4EC] text-slate-800 relative border-b border-emerald-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-black uppercase tracking-widest text-[#15803D] bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 inline-block">
            Verified Impact Metrics
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#0A3319] tracking-tight">
            TRANSPARENT, FIELD-VERIFIED NUMBERS
          </h2>
          <p className="text-slate-700 font-medium text-base sm:text-lg">
            Every tree planted and water station set up is logged by our verified surveyors across Uttar Pradesh.
          </p>

          {/* 1,000+ Trees Target Card (Attractive & Balanced Size) */}
          <div className="pt-2">
            <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#0A3319] text-white border-2 border-[#F4C430] shadow-xl max-w-2xl w-full mx-auto">
              <div className="flex items-center space-x-3 text-left">
                <div className="w-12 h-12 rounded-xl bg-[#F4C430] text-[#0A3319] flex items-center justify-center font-black shrink-0 shadow-md">
                  <TreePine className="w-7 h-7 fill-current" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#86EFAC] bg-[#16A34A]/30 px-2 py-0.5 rounded border border-emerald-500/40">
                      FOUNDATION MISSION
                    </span>
                    <span className="text-xs text-[#F4C430] font-bold">2026–2027</span>
                  </div>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-white mt-0.5">
                    {language === 'hi'
                      ? '2027 से पहले 1,000+ पौधे लगाने का लक्ष्य'
                      : 'Target: Plant 1,000+ Native Trees Before 2027'}
                  </h3>
                </div>
              </div>

              <div className="shrink-0 bg-[#031A0D] px-4 py-2 rounded-xl border border-emerald-500/40 text-center">
                <span className="block text-[10px] text-emerald-300 font-bold uppercase tracking-wider">PRIMARY GOAL</span>
                <span className="font-display font-black text-xl text-[#F4C430]">1,000+ TREES</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="bg-white text-slate-900 p-8 rounded-3xl border-2 border-emerald-200/80 shadow-lg hover:shadow-2xl hover:border-[#15803D] transition-all transform hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono font-extrabold text-[#0A3319] bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
                  LIVE DATA
                </span>
              </div>

              <div>
                <span className="font-display font-extrabold text-4xl sm:text-5xl text-[#0A3319] tracking-tight block">
                  {item.value}
                </span>
                <span className="font-display font-bold text-lg text-slate-900 block mt-1">
                  {item.label}
                </span>
                <span className="text-xs font-semibold text-emerald-800 block mt-1">
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
