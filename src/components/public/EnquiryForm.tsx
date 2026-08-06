import React, { useState } from 'react';
import { Send, CheckCircle2, TreePine, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { store } from '../../services/store';
import { Language } from '../../types';
import { getTranslation } from '../common/translations';

interface EnquiryFormProps {
  language: Language;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    intent: 'Plant trees with you' as const,
    source: 'IIT Kanpur Campus' as const,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.phone || !formData.city) {
      setError('Please fill in your name, phone number, and city/district.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Save to store (persisted in localStorage / state)
      store.addEnquiry({
        name: formData.name,
        email: formData.email || 'N/A',
        phone: formData.phone,
        city: formData.city,
        intent: formData.intent,
        source: formData.source,
        message: formData.message || 'Expressed interest via Kanvana website.'
      });

      setLoading(false);
      setSubmitted(true);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#86EFAC', '#F4C430', '#1B5E34']
      });
    }, 600);
  };

  return (
    <section id="enquiry" className="py-24 bg-[#0D2818] text-[#F9FBF7] relative border-b border-[#1B5E34]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1B5E34] text-[#86EFAC] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C430]" />
            <span>Join Kanvana Network</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#F9FBF7] tracking-tight">
            {getTranslation(language, 'form_title')}
          </h2>
          <p className="text-sm text-[#86EFAC]">
            {getTranslation(language, 'form_subtitle')}
          </p>
        </div>

        <div className="bg-[#1B5E34]/30 rounded-3xl border-2 border-[#1B5E34] p-8 sm:p-12 shadow-2xl relative">
          
          {submitted ? (
            <div className="text-center py-12 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-[#4CAF50] text-[#0D2818] rounded-full p-4 mx-auto flex items-center justify-center shadow-2xl">
                <TreePine className="w-12 h-12 animate-bounce" />
              </div>

              <div>
                <h3 className="font-display font-extrabold text-2xl text-[#F4C430]">
                  THANK YOU FOR STANDING WITH NATURE!
                </h3>
                <p className="text-sm text-[#86EFAC] max-w-md mx-auto mt-2">
                  We have received your message. Prashant or our team from Nankari, IIT Kanpur will reach out within 48 hours. 🌱
                </p>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    city: '',
                    intent: 'Plant trees with you',
                    source: 'IIT Kanpur Campus',
                    message: ''
                  });
                }}
                className="px-6 py-2.5 rounded-xl bg-[#1B5E34] text-[#86EFAC] text-xs font-bold uppercase tracking-wider hover:bg-[#4CAF50] hover:text-[#0D2818] transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 rounded-xl bg-red-900/50 border border-red-500 text-red-200 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Your Full Name"
                    className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-3 text-sm text-[#F9FBF7] placeholder-[#6B7F6E] focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 83182 88563"
                    className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-3 text-sm text-[#F9FBF7] placeholder-[#6B7F6E] focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-3 text-sm text-[#F9FBF7] placeholder-[#6B7F6E] focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-2">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Kanpur Dehat / Lucknow"
                    className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-3 text-sm text-[#F9FBF7] placeholder-[#6B7F6E] focus:outline-none focus:border-[#4CAF50]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-2">
                    I want to... *
                  </label>
                  <select
                    value={formData.intent}
                    onChange={(e) => setFormData({ ...formData, intent: e.target.value as any })}
                    className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-3 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                  >
                    <option value="Plant trees with you">Plant trees with you</option>
                    <option value="Sponsor a plantation drive">Sponsor a plantation drive</option>
                    <option value="Donate">Donate / Support</option>
                    <option value="Partner with Kanvana">Partner with Kanvana</option>
                    <option value="Media / Press">Media / Press</option>
                    <option value="Just curious">Just curious</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                    className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-3 text-sm text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                  >
                    <option value="IIT Kanpur Campus">IIT Kanpur Campus</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Friend / Colleague">Friend / Colleague</option>
                    <option value="News">News / Article</option>
                    <option value="Search Engine">Search Engine</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-2">
                  Message / Details
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details about your location, available land, or preferred timeline..."
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-4 text-sm text-[#F9FBF7] placeholder-[#6B7F6E] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#F4C430] text-[#0D2818] font-display font-bold text-sm uppercase tracking-wider hover:bg-[#FFF5C0] transition-all shadow-xl flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Submitting Interest...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send My Interest</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
