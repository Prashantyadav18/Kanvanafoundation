import React, { useState, useEffect } from 'react';
import { PageLoader } from './components/common/PageLoader';
import { ScrollTree } from './components/common/ScrollTree';
import { Navbar } from './components/common/Navbar';
import { Hero } from './components/public/Hero';
import { ImpactStats } from './components/public/ImpactStats';
import { FounderSpotlight } from './components/public/FounderSpotlight';
import { MissionPillars } from './components/public/MissionPillars';
import { ProcessFlow } from './components/public/ProcessFlow';
import { VolunteerGallery } from './components/public/VolunteerGallery';
import { ImpactMap } from './components/public/ImpactMap';
import { TreeQRSection } from './components/public/TreeQRSection';
import { EnquiryForm } from './components/public/EnquiryForm';
import { FundATree } from './components/public/FundATree';
import { Testimonials } from './components/public/Testimonials';
import { Footer } from './components/public/Footer';
import { CertificateModal } from './components/common/CertificateModal';
import { SurveyorPortal } from './components/surveyor/SurveyorPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TreeProfileView } from './components/tree/TreeProfileView';
import { TreeStoryAnimation } from './components/common/TreeStoryAnimation';
import { store } from './services/store';
import { Language, Submission } from './types';

export default function App() {
  // Store reactive trigger
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setTick(t => t + 1));
    return unsubscribe;
  }, []);

  // Active Portal State: 'public' | 'surveyor' | 'admin' | 'tree'
  const [currentPortal, setCurrentPortal] = useState<'public' | 'surveyor' | 'admin' | 'tree'>('public');

  // Handle Hash-based URL Routing for direct Surveyor & Admin access (e.g. site.com/#surveyor)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'surveyor') {
        setCurrentPortal('surveyor');
      } else if (hash === 'admin') {
        setCurrentPortal('admin');
      } else if (hash.startsWith('tree-')) {
        setSelectedTreeId(hash.replace('tree-', '').toUpperCase());
        setCurrentPortal('tree');
      }
    };

    handleHashChange();
    
    // Check for ?verify= QR code scan URL
    const params = new URLSearchParams(window.location.search);
    const verifyCode = params.get('verify');
    if (verifyCode) {
      setCertData({
        name: 'Kanvana Environmental Volunteer',
        trees: 25,
        location: 'Nankari, IIT Kanpur',
        date: new Date().toISOString().split('T')[0]
      });
      setCertModalOpen(true);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Active Tree ID when viewing tree profile
  const [selectedTreeId, setSelectedTreeId] = useState<string>('KANVANA-TREE-001');

  // Language state: 'en' | 'hi'
  const [language, setLanguage] = useState<Language>(store.getLanguage());

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certData, setCertData] = useState({
    name: 'Volunteer (Field Site)',
    trees: 25,
    location: 'Nankari, IIT Kanpur',
    date: new Date().toISOString().split('T')[0]
  });

  // Tree Story Animation State (auto opens on site load)
  const [showTreeStory, setShowTreeStory] = useState(true);

  const handleToggleLanguage = (lang: Language) => {
    setLanguage(lang);
    store.setLanguage(lang);
  };

  const handleOpenCertificateForSub = (sub: Submission) => {
    setCertData({
      name: sub.volunteerName,
      trees: sub.treesCount || 5,
      location: sub.locationName || sub.volunteerVillage,
      date: sub.activityDate || new Date().toISOString().split('T')[0]
    });
    setCertModalOpen(true);
  };

  const handleSelectTree = (treeId: string) => {
    setSelectedTreeId(treeId);
    setCurrentPortal('tree');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSection = (id: string) => {
    if (currentPortal !== 'public') {
      setCurrentPortal('public');
      setTimeout(() => {
        const el = document.querySelector(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D2818] text-[#F9FBF7] font-sans relative selection:bg-[#4CAF50] selection:text-[#0D2818]">
      
      {/* Global Page Entry SVG Growth Loader */}
      <PageLoader />

      {/* Signature Scroll-Reactive Tree Indicator */}
      <ScrollTree />

      {/* Main Sticky Navbar */}
      <Navbar
        currentPortal={currentPortal}
        onSelectPortal={setCurrentPortal}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenJoinModal={() => handleScrollToSection('#enquiry')}
      />

      {/* PORTAL VIEW SWITCHING */}
      {currentPortal === 'public' && (
        <main className="animate-fadeIn">
          {/* SECTION 3: HERO */}
          <Hero
            language={language}
            onPlantClick={() => handleScrollToSection('#enquiry')}
            onImpactClick={() => handleScrollToSection('#stats')}
            onOpenJoinModal={() => handleScrollToSection('#enquiry')}
            onOpenStory={() => setShowTreeStory(true)}
          />

          {/* SECTION 4: IMPACT STATS */}
          <ImpactStats
            stats={store.getStats()}
            language={language}
          />

          {/* SECTION 5: FOUNDER SPOTLIGHT */}
          <FounderSpotlight
            language={language}
          />

          {/* SECTION 6: THREE MISSION PILLARS */}
          <MissionPillars
            language={language}
            onSelectAction={() => handleScrollToSection('#enquiry')}
          />

          {/* SECTION 7: PROCESS FLOW */}
          <ProcessFlow
            language={language}
          />

          {/* SECTION 8: VOLUNTEER ACTIVITY GALLERY */}
          <VolunteerGallery
            submissions={store.getSubmissions()}
            language={language}
            onOpenCertificate={handleOpenCertificateForSub}
          />

          {/* SECTION 9: INTERACTIVE IMPACT MAP */}
          <ImpactMap
            markers={store.getMapMarkers()}
            language={language}
          />

          {/* SECTION 10: TREE QR TAGGING */}
          <TreeQRSection
            trees={store.getTrees()}
            language={language}
            onSelectTree={handleSelectTree}
          />

          {/* SECTION 11: ENQUIRY / CONTACT FORM */}
          <EnquiryForm
            language={language}
          />

          {/* SECTION 12: FUND A TREE */}
          <FundATree
            language={language}
          />

          {/* SECTION 15: TESTIMONIALS */}
          <Testimonials />

          {/* SECTION 16: FOOTER */}
          <Footer
            onSelectPortal={setCurrentPortal}
          />
        </main>
      )}

      {currentPortal === 'surveyor' && (
        <main className="animate-fadeIn">
          <SurveyorPortal />
        </main>
      )}

      {currentPortal === 'admin' && (
        <main className="animate-fadeIn">
          <AdminDashboard
            onOpenCertificate={handleOpenCertificateForSub}
            onSelectTree={handleSelectTree}
          />
        </main>
      )}

      {currentPortal === 'tree' && (
        <main className="animate-fadeIn">
          <TreeProfileView
            treeId={selectedTreeId}
            onBack={() => setCurrentPortal('public')}
          />
        </main>
      )}

      {/* VOLUNTEER IMPACT CERTIFICATE MODAL */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        initialName={certData.name}
        initialTrees={certData.trees}
        initialLocation={certData.location}
        initialDate={certData.date}
      />

      {/* TREE STORY PREMIUM INTRO ANIMATION */}
      {showTreeStory && (
        <TreeStoryAnimation
          language={language}
          onClose={() => setShowTreeStory(false)}
          onStartPlanting={() => handleScrollToSection('#enquiry')}
        />
      )}

    </div>
  );
}
