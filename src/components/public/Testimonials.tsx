import React, { useState, useEffect } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      id: 1,
      quote: "Planting trees with Kanvana was one of the most meaningful things I've done during my time at IIT Kanpur. Seeing native Neem saplings take root brings real joy.",
      author: 'IIT Kanpur Student Volunteer',
      role: 'Environmental Drive Participant',
      location: 'Nankari, IIT Kanpur'
    },
    {
      id: 2,
      quote: 'The surveyor visited our village site and helped us plant 50 trees around the school ground. The kids love watering them every morning after assembly.',
      author: 'Community Field Volunteer',
      role: 'Village Drive Partner',
      location: 'Field Site (Coming Soon)'
    },
    {
      id: 3,
      quote: 'A small team doing big, honest work on the ground. Transparent records, real QR code tracking, and genuine dedication from Prashant and his team.',
      author: 'Dr. Siddharth Pandey',
      role: 'Donor & Campus Patron',
      location: 'Kanpur Nagar'
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const current = reviews[activeIndex];

  return (
    <section className="py-24 bg-[#EAF3EC] text-slate-800 relative border-b border-emerald-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#15803D] block mb-2">
          Community Voices
        </span>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#0A3319] mb-12">
          WHAT OUR VOLUNTEERS SAY
        </h2>

        {/* Carousel Card */}
        <div className="bg-white rounded-3xl border border-emerald-200/80 p-8 sm:p-12 shadow-xl relative">
          <Quote className="w-12 h-12 text-emerald-200 mx-auto mb-6" />

          <div className="flex justify-center space-x-1 mb-6 text-[#D97706]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          <blockquote className="font-serif-quote italic text-xl sm:text-2xl text-slate-800 leading-relaxed max-w-3xl mx-auto min-h-[100px]">
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          <div className="mt-8 space-y-1">
            <h4 className="font-display font-bold text-lg text-[#0A3319]">
              {current.author}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {current.role} • <span className="text-[#D97706] font-semibold">{current.location}</span>
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => setActiveIndex((activeIndex - 1 + reviews.length) % reviews.length)}
              className="p-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0A3319] hover:bg-[#0A3319] hover:text-[#F4C430] transition-colors cursor-pointer shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    activeIndex === idx ? 'bg-[#D97706] w-6' : 'bg-emerald-200 w-2.5'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((activeIndex + 1) % reviews.length)}
              className="p-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0A3319] hover:bg-[#0A3319] hover:text-[#F4C430] transition-colors cursor-pointer shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
