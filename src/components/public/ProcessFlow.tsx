import React from 'react';
import { FileText, MapPin, TreePine, QrCode } from 'lucide-react';
import { Language } from '../../types';
import { getTranslation } from '../common/translations';

interface ProcessFlowProps {
  language: Language;
}

export const ProcessFlow: React.FC<ProcessFlowProps> = ({ language }) => {
  const steps = [
    {
      num: '01',
      icon: <FileText className="w-6 h-6 text-[#F4C430]" />,
      title: getTranslation(language, 'step1_title'),
      desc: getTranslation(language, 'step1_desc')
    },
    {
      num: '02',
      icon: <MapPin className="w-6 h-6 text-[#F4C430]" />,
      title: getTranslation(language, 'step2_title'),
      desc: getTranslation(language, 'step2_title_sub')
    },
    {
      num: '03',
      icon: <TreePine className="w-6 h-6 text-[#F4C430]" />,
      title: getTranslation(language, 'step3_title'),
      desc: getTranslation(language, 'step3_desc')
    },
    {
      num: '04',
      icon: <QrCode className="w-6 h-6 text-[#F4C430]" />,
      title: getTranslation(language, 'step4_title'),
      desc: getTranslation(language, 'step4_desc')
    }
  ];

  return (
    <section className="py-24 bg-[#0D2818] text-[#F9FBF7] relative border-b border-[#1B5E34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F4C430] block mb-2">
            Execution Lifecycle
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F9FBF7] tracking-tight">
            {getTranslation(language, 'process_title')}
          </h2>
          <p className="mt-4 text-[#86EFAC] text-base">
            From field enquiry to verified survival tracking on our digital ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="bg-[#1B5E34]/30 p-6 sm:p-8 rounded-3xl border border-[#1B5E34] hover:border-[#F4C430] transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display font-extrabold text-4xl text-[#F4C430]">
                    {s.num}
                  </span>
                  <div className="p-3 bg-[#0D2818] rounded-2xl border border-[#1B5E34]">
                    {s.icon}
                  </div>
                </div>

                <h3 className="font-display font-bold text-xl text-[#F9FBF7] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#F9FBF7]/80 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-0.5 bg-[#F4C430]" />
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
