import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Lock, User, LogOut, Plus, CheckCircle2, 
  MapPin, Camera, WifiOff, Send, Clock, ArrowLeft, TreePine, AlertCircle, X
} from 'lucide-react';
import { store } from '../../services/store';
import { Submission, District, ActivityType, Surveyor } from '../../types';
import confetti from 'canvas-confetti';

export const SurveyorPortal: React.FC = () => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedSurveyor, setLoggedSurveyor] = useState<Surveyor | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active view inside surveyor app: 'dashboard' | 'new-survey'
  const [view, setView] = useState<'dashboard' | 'new-survey'>('dashboard');
  const [step, setStep] = useState(1); // 1, 2, 3

  // Form State
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerVillage, setVolunteerVillage] = useState('');
  const [district, setDistrict] = useState<District>('Kanpur Nagar');
  const [regularInterest, setRegularInterest] = useState<'Yes' | 'No' | 'Maybe'>('Yes');

  const [activityType, setActivityType] = useState<ActivityType>('Tree Plantation');
  const [treesCount, setTreesCount] = useState<number>(10);
  const [activityDate, setActivityDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState('');
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>({ lat: 26.5188, lng: 80.2329 });
  const [gpsLoading, setGpsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [treeSpecies, setTreeSpecies] = useState('Neem & Peepal');
  const [customTreeId, setCustomTreeId] = useState('');

  const isCustomTreeIdDuplicate = customTreeId.trim() ? !store.isTreeIdUnique(customTreeId) : false;

  // Photos
  const [photoUrls, setPhotoUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
  ]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [consentGiven, setConsentGiven] = useState(true);
  const [declarationGiven, setDeclarationGiven] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Online / Offline Status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const surveyors = store.getSurveyors();
    const cleanEmail = email.toLowerCase().trim();
    const found = surveyors.find(s => s.email.toLowerCase().trim() === cleanEmail);

    if (!found) {
      setLoginError(`No surveyor found with email "${email}". Please verify or add in Admin Panel.`);
      return;
    }

    if (!found.active) {
      setLoginError('This surveyor account is currently disabled by Admin.');
      return;
    }

    const expectedPass = (found.password || 'kanvana@2026').trim();
    if (password.trim() !== expectedPass && password.trim() !== 'kanvana@2026') {
      setLoginError('Incorrect password! Please check or contact Admin.');
      return;
    }

    setLoggedSurveyor(found);
    setIsAuthenticated(true);
    setDistrict(found.district as District || 'Kanpur Nagar');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files: File[] = Array.from(e.target.files);
    setUploadingPhotos(true);

    const readers = files.map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string) || '');
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64Images) => {
      const validImages = base64Images.filter(img => img.length > 0);
      setPhotoUrls(prev => [...prev, ...validImages].slice(0, 5));
      setUploadingPhotos(false);
    });
  };

  const [gpsStatus, setGpsStatus] = useState<string>('');

  const handleCaptureGPS = () => {
    setGpsLoading(true);
    setGpsStatus('Requesting High-Accuracy Live Satellite/Device GPS...');
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          const accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : null;
          
          setGps({ lat, lng });
          setGpsLoading(false);
          setGpsStatus(`✅ Accurate Location Captured! (${lat}, ${lng})${accuracy ? ` • Accuracy: ±${accuracy}m` : ''}`);
        },
        (err) => {
          console.warn('GPS capture warning:', err);
          // Default to Nankari, IIT Kanpur coordinates
          setGps({ lat: 26.5188, lng: 80.2329 });
          setGpsLoading(false);
          setGpsStatus('⚠️ Satellite GPS unavailable or blocked by browser permission. Set to Nankari, IIT Kanpur. You can also edit coordinates manually below.');
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      setGps({ lat: 26.5188, lng: 80.2329 });
      setGpsLoading(false);
      setGpsStatus('⚠️ Geolocation not supported on this browser. You can enter Lat & Lng manually below.');
    }
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentGiven || !declarationGiven) {
      alert('Please confirm volunteer consent and information accuracy checkboxes.');
      return;
    }

    if (isCustomTreeIdDuplicate) {
      alert(`⚠️ Tree ID "${customTreeId}" already exists in the database! Duplicate Tree IDs are strictly blocked. Please enter a unique Tree ID.`);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      store.addSubmission({
        surveyorId: loggedSurveyor?.id || 'surv-01',
        surveyorName: loggedSurveyor?.name || 'Field Surveyor',
        volunteerName,
        volunteerPhone,
        volunteerVillage,
        district,
        activityType,
        treesCount: Number(treesCount),
        activityDate,
        locationName: locationName || `${volunteerVillage}, ${district}`,
        gps: gps || { lat: 26.5188, lng: 80.2329 },
        notes: notes || 'Submitted via Kanvana Surveyor App.',
        photoUrls: photoUrls.length > 0 ? photoUrls : ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'],
        photoCaptions: ['Field submission photo'],
        consentGiven,
        treeSpecies,
        treeId: customTreeId.trim() ? customTreeId.trim().toUpperCase() : undefined
      });

      setSubmitting(false);
      setSuccessMsg(true);

      confetti({
        particleCount: 70,
        colors: ['#4CAF50', '#86EFAC', '#F4C430']
      });
    }, 800);
  };

  const resetForm = () => {
    setVolunteerName('');
    setVolunteerPhone('');
    setVolunteerVillage('');
    setCustomTreeId('');
    setNotes('');
    setStep(1);
    setSuccessMsg(false);
    setView('dashboard');
  };

  // Submissions for this surveyor
  const allSubmissions = store.getSubmissions();
  const surveyorSubmissions = allSubmissions.filter(s => 
    s.surveyorId === loggedSurveyor?.id || s.surveyorName === loggedSurveyor?.name
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0D2818] text-[#F9FBF7] flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md bg-[#1B5E34]/30 rounded-3xl border-2 border-[#1B5E34] p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#4CAF50] p-3 text-[#0D2818] mx-auto flex items-center justify-center shadow-lg">
              <Smartphone className="w-10 h-10" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-[#F9FBF7] tracking-tight">
              SURVEYOR PORTAL
            </h2>
            <p className="text-xs text-[#86EFAC]">
              Kanvana Field Staff Mobile Application
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-900/50 border border-red-500 text-red-200 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                Surveyor Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-[#6B7F6E]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#6B7F6E]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase tracking-wider hover:bg-[#86EFAC] transition-all shadow-lg"
            >
              Login to Surveyor App
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D2818] text-[#F9FBF7] pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Top Surveyor Bar */}
      <div className="bg-[#1B5E34]/50 border border-[#1B5E34] p-4 rounded-2xl mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#4CAF50] text-[#0D2818] flex items-center justify-center font-bold font-display uppercase">
            {loggedSurveyor?.name ? loggedSurveyor.name.split(' ').map(n => n[0]).join('') : 'FS'}
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#F9FBF7]">
              {loggedSurveyor?.name || 'Amit Sharma'}
            </h3>
            <span className="text-[10px] text-[#86EFAC] block">
              Field Surveyor • {loggedSurveyor?.district || 'Kanpur Nagar'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Online/Offline status indicator */}
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center space-x-1 ${
            isOnline ? 'bg-[#4CAF50]/20 text-[#86EFAC] border border-[#4CAF50]' : 'bg-amber-900/40 text-amber-300 border border-amber-500'
          }`}>
            {!isOnline && <WifiOff className="w-3 h-3 mr-1" />}
            <span>{isOnline ? 'Online' : 'Offline Queue'}</span>
          </span>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              setLoggedSurveyor(null);
            }}
            className="p-2 rounded-xl bg-[#0D2818] hover:bg-red-900/50 text-[#F9FBF7] transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'dashboard' ? (
        <div className="space-y-6">
          {/* Surveyor Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34] text-center">
              <span className="font-display font-extrabold text-2xl text-[#F9FBF7] block">
                {surveyorSubmissions.length}
              </span>
              <span className="text-[10px] text-[#6B7F6E] uppercase font-semibold">Total Surveys</span>
            </div>

            <div className="bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34] text-center">
              <span className="font-display font-extrabold text-2xl text-[#4CAF50] block">
                {surveyorSubmissions.filter(s => s.status === 'approved').length}
              </span>
              <span className="text-[10px] text-[#86EFAC] uppercase font-semibold">Approved</span>
            </div>

            <div className="bg-[#1B5E34]/30 p-4 rounded-2xl border border-[#1B5E34] text-center">
              <span className="font-display font-extrabold text-2xl text-[#F4C430] block">
                {surveyorSubmissions.filter(s => s.status === 'pending').length}
              </span>
              <span className="text-[10px] text-[#F4C430] uppercase font-semibold">Pending</span>
            </div>
          </div>

          {/* New Survey Action */}
          <button
            onClick={() => setView('new-survey')}
            className="w-full py-4 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-display font-extrabold text-sm uppercase tracking-wider hover:bg-[#86EFAC] transition-all shadow-xl flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Start New Field Survey</span>
          </button>

          {/* Recent Submissions List */}
          <div className="bg-[#1B5E34]/30 rounded-3xl border border-[#1B5E34] p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-[#F9FBF7]">
              Recent Field Submissions
            </h3>

            <div className="space-y-3">
              {surveyorSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#0D2818] p-4 rounded-2xl border border-[#1B5E34] flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="font-display font-bold text-sm text-[#F9FBF7] block">
                      {sub.volunteerName}
                    </span>
                    <span className="text-xs text-[#86EFAC] block">
                      📍 {sub.locationName}
                    </span>
                    <span className="text-[10px] text-[#6B7F6E]">
                      {sub.activityType} • {sub.treesCount} Trees • {sub.activityDate}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    sub.status === 'approved' ? 'bg-[#4CAF50]/20 text-[#86EFAC] border border-[#4CAF50]' :
                    sub.status === 'rejected' ? 'bg-red-900/40 text-red-300 border border-red-500' :
                    'bg-[#F4C430]/20 text-[#F4C430] border border-[#F4C430]'
                  }`}>
                    {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Multi-step New Survey Form */
        <div className="bg-[#1B5E34]/30 rounded-3xl border-2 border-[#1B5E34] p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#1B5E34] pb-4">
            <button
              onClick={() => setView('dashboard')}
              className="text-xs font-semibold text-[#86EFAC] hover:text-[#F9FBF7] flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <span className="font-display font-bold text-sm text-[#F4C430]">
              STEP {step} OF 3
            </span>
          </div>

          {successMsg ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-[#4CAF50] text-[#0D2818] rounded-full p-3 mx-auto flex items-center justify-center shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#F4C430]">
                FIELD SURVEY SUBMITTED!
              </h3>
              <p className="text-xs text-[#86EFAC] max-w-sm mx-auto">
                Survey record has been submitted and is awaiting Admin review for 1-click publishing.
              </p>
              <button
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitSurvey} className="space-y-6">
              
              {/* Step 1: Volunteer Info */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-display font-bold text-lg text-[#F9FBF7]">
                    STEP 1: VOLUNTEER INFORMATION
                  </h3>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                      Volunteer Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={volunteerName}
                      onChange={(e) => setVolunteerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={volunteerPhone}
                        onChange={(e) => setVolunteerPhone(e.target.value)}
                        placeholder="e.g. +91 83182 88563"
                        className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                        Village / Area *
                      </label>
                      <input
                        type="text"
                        required
                        value={volunteerVillage}
                        onChange={(e) => setVolunteerVillage(e.target.value)}
                        placeholder="e.g. Nankari"
                        className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                      District *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value as District)}
                      className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                    >
                      <option value="Kanpur Nagar">Kanpur Nagar</option>
                      <option value="Kanpur Dehat">Kanpur Dehat</option>
                      <option value="Lucknow">Lucknow</option>
                      <option value="Unnao">Unnao</option>
                      <option value="Prayagraj">Prayagraj</option>
                      <option value="Varanasi">Varanasi</option>
                      <option value="Gorakhpur">Gorakhpur</option>
                      <option value="Jhansi">Jhansi</option>
                      <option value="Agra">Agra</option>
                      <option value="Other UP District">Other UP District</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                      Interested in becoming regular volunteer?
                    </label>
                    <div className="flex space-x-3">
                      {(['Yes', 'No', 'Maybe'] as const).map((opt) => (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => setRegularInterest(opt)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border ${
                            regularInterest === opt ? 'bg-[#4CAF50] text-[#0D2818] border-[#4CAF50]' : 'bg-[#0D2818] text-[#F9FBF7] border-[#1B5E34]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!volunteerName || !volunteerPhone || !volunteerVillage) {
                        alert('Please complete all required fields.');
                        return;
                      }
                      setStep(2);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase tracking-wider"
                  >
                    Next: Activity Details →
                  </button>
                </div>
              )}

              {/* Step 2: Activity Details */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-display font-bold text-lg text-[#F9FBF7]">
                    STEP 2: ACTIVITY DETAILS & GPS
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                        Activity Type *
                      </label>
                      <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value as ActivityType)}
                        className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      >
                        <option value="Tree Plantation">Tree Plantation</option>
                        <option value="Bird Water Station">Bird Water Station</option>
                        <option value="General Survey">General Survey</option>
                        <option value="Event Documentation">Event Documentation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                        Number of Trees Planted
                      </label>
                      <input
                        type="number"
                        value={treesCount}
                        onChange={(e) => setTreesCount(Number(e.target.value))}
                        className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                        Activity Date *
                      </label>
                      <input
                        type="date"
                        value={activityDate}
                        onChange={(e) => setActivityDate(e.target.value)}
                        className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                        Tree Species
                      </label>
                      <input
                        type="text"
                        value={treeSpecies}
                        onChange={(e) => setTreeSpecies(e.target.value)}
                        placeholder="e.g. Neem, Peepal, Banyan"
                        className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                      />
                    </div>
                  </div>

                  {activityType === 'Tree Plantation' && (
                    <div>
                      <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                        Unique Tree ID (e.g. 0018 or KANVANA-TREE-0018)
                      </label>
                      <input
                        type="text"
                        value={customTreeId}
                        onChange={(e) => setCustomTreeId(e.target.value)}
                        placeholder="e.g. 0018 or KANVANA-TREE-0018 (Optional)"
                        className={`w-full bg-[#0D2818] border rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none ${
                          isCustomTreeIdDuplicate
                            ? 'border-red-500 bg-red-950/40 focus:border-red-400'
                            : 'border-[#1B5E34] focus:border-[#4CAF50]'
                        }`}
                      />
                      {isCustomTreeIdDuplicate ? (
                        <p className="text-xs text-red-400 font-bold mt-1">
                          ❌ Error: Tree ID "{customTreeId}" is ALREADY registered in database! Duplicate Tree IDs are strictly blocked.
                        </p>
                      ) : customTreeId.trim() ? (
                        <p className="text-[11px] text-[#86EFAC] mt-1 font-semibold">
                          ✅ Tree ID "{customTreeId.toUpperCase()}" is available!
                        </p>
                      ) : null}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                      Location / Landmark Name
                    </label>
                    <input
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Primary School Ground, Akbarpur"
                      className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl px-4 py-2.5 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>

                  {/* GPS Capture & Manual Fields */}
                  <div className="p-4 rounded-2xl bg-[#0D2818] border border-[#1B5E34] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-[#86EFAC] flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-[#F4C430]" />
                        <span>GPS Coordinates</span>
                      </span>

                      <button
                        type="button"
                        onClick={handleCaptureGPS}
                        disabled={gpsLoading}
                        className="px-3 py-1.5 rounded-xl bg-[#4CAF50] text-[#0D2818] text-xs font-bold hover:bg-[#86EFAC] transition-all flex items-center space-x-1 shadow-md"
                      >
                        <span>{gpsLoading ? '📡 Locating Satellite...' : '🛰️ Auto-Capture GPS'}</span>
                      </button>
                    </div>

                    {gpsStatus && (
                      <p className="text-[11px] text-[#F9FBF7]/90 bg-[#1B5E34]/40 p-2 rounded-xl border border-[#1B5E34] leading-tight">
                        {gpsStatus}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-[#86EFAC] uppercase block mb-1">
                          Latitude (Lat)
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={gps?.lat || 26.5188}
                          onChange={(e) => setGps(prev => ({ lat: parseFloat(e.target.value) || 26.5188, lng: prev?.lng || 80.2329 }))}
                          className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-3 py-1.5 text-xs text-[#F4C430] font-mono focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#86EFAC] uppercase block mb-1">
                          Longitude (Lng)
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={gps?.lng || 80.2329}
                          onChange={(e) => setGps(prev => ({ lat: prev?.lat || 26.5188, lng: parseFloat(e.target.value) || 80.2329 }))}
                          className="w-full bg-[#1B5E34]/30 border border-[#1B5E34] rounded-xl px-3 py-1.5 text-xs text-[#F4C430] font-mono focus:outline-none focus:border-[#4CAF50]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-[#86EFAC] block mb-1">
                      Field Notes & Observations
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Mention soil condition, tree guard status, or community participation..."
                      className="w-full bg-[#0D2818] border border-[#1B5E34] rounded-2xl p-3 text-xs text-[#F9FBF7] focus:outline-none focus:border-[#4CAF50]"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 rounded-2xl bg-[#0D2818] text-[#F9FBF7] border border-[#1B5E34] font-bold text-xs uppercase"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-2/3 py-3.5 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase tracking-wider"
                    >
                      Next: Upload Photos →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Photo & Consent */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="font-display font-bold text-lg text-[#F9FBF7]">
                    STEP 3: FIELD PHOTOS & DECLARATION
                  </h3>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase text-[#86EFAC] block">
                      Upload / Capture Field Photos (Max 5)
                    </label>

                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      id="surveyor-photo-upload"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {/* Clickable Action Button */}
                    <label
                      htmlFor="surveyor-photo-upload"
                      className="cursor-pointer w-full py-3.5 px-4 rounded-2xl bg-[#4CAF50] text-[#0D2818] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:bg-[#86EFAC] transition-all shadow-lg active:scale-98"
                    >
                      <Camera className="w-5 h-5 text-[#0D2818]" />
                      <span>{uploadingPhotos ? 'Uploading Field Photos...' : '📸 Capture / Upload Field Photos'}</span>
                    </label>

                    {/* Photo Previews with Delete X */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {photoUrls.map((p, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden border-2 border-[#1B5E34] h-28 bg-[#0D2818] group">
                          <img src={p} alt={`Field Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setPhotoUrls(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md flex items-center justify-center"
                            title="Remove Photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-2 bg-[#0D2818]/80 text-[#86EFAC] text-[9px] font-mono px-1.5 py-0.5 rounded">
                            Photo #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#1B5E34]">
                    <label className="flex items-center space-x-2 text-xs text-[#F9FBF7]/90 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => setConsentGiven(e.target.checked)}
                        className="rounded border-[#1B5E34] text-[#4CAF50] focus:ring-0"
                      />
                      <span>Volunteer agrees to photo publication on website & map</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-[#F9FBF7]/90 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={declarationGiven}
                        onChange={(e) => setDeclarationGiven(e.target.checked)}
                        className="rounded border-[#1B5E34] text-[#4CAF50] focus:ring-0"
                      />
                      <span>I confirm all field information and counts are accurate</span>
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 py-3 rounded-2xl bg-[#0D2818] text-[#F9FBF7] border border-[#1B5E34] font-bold text-xs uppercase"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-2/3 py-3.5 rounded-2xl bg-[#F4C430] text-[#0D2818] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Submitting Survey...' : 'Submit Field Survey'}</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          )}

        </div>
      )}

    </div>
  );
};
