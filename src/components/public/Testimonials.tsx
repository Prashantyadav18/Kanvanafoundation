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
    <section className="py-24 bg-[#0D2818] text-[#F9FBF7] relative border-b border-[#1B5E34]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <span className="text-xs font-bold uppercase tracking-widest text-[#F4C430] block mb-2">
          Community Voices
        </span>

        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F9FBF7] mb-12">
          WHAT OUR VOLUNTEERS SAY
        </h2>

        {/* Carousel Card */}
        <div className="bg-[#1B5E34]/30 rounded-3xl border border-[#1B5E34] p-8 sm:p-12 shadow-2xl relative">
          <Quote className="w-12 h-12 text-[#F4C430]/30 mx-auto mb-6" />

          <div className="flex justify-center space-x-1 mb-6 text-[#F4C430]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>

          <blockquote className="font-serif-quote italic text-xl sm:text-2xl text-[#F9FBF7] leading-relaxed max-w-3xl mx-auto min-h-[100px]">
            &ldquo;{current.quote}&rdquo;
          </blockquote>

          <div className="mt-8 space-y-1">
            <h4 className="font-display font-bold text-lg text-[#86EFAC]">
              {current.author}
            </h4>
            <p className="text-xs text-[#F9FBF7]/70">
              {current.role} • <span className="text-[#F4C430]">{current.location}</span>
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={() => setActiveIndex((activeIndex - 1 + reviews.length) % reviews.length)}
              className="p-2 rounded-full bg-[#0D2818] border border-[#1B5E34] text-[#86EFAC] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-2">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeIndex === idx ? 'bg-[#F4C430] w-6' : 'bg-[#1B5E34]'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((activeIndex + 1) % reviews.length)}
              className="p-2 rounded-full bg-[#0D2818] border border-[#1B5E34] text-[#86EFAC] hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
