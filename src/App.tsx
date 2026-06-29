/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Home,
  CheckCircle,
  Menu,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  PlusCircle,
  Layers,
  Sparkle
} from 'lucide-react';

import { NeedRequest, VolunteerDrive, FinancialDonation, SupportCategory, ImpactStory } from './types';
import KarunaChat from './components/KarunaChat';
import TrustLedgerView from './components/TrustLedgerView';
import KindnessBridge from './components/KindnessBridge';
import VolunteerHubView from './components/VolunteerHubView';
import DonationDrawer from './components/DonationDrawer';
import ShareQRCodeCard from './components/ShareQRCodeCard';
import TrustActivitiesBoard from './components/TrustActivitiesBoard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'bridge' | 'volunteer' | 'ledger' | 'chat' | 'donate'>('home');
  const [needs, setNeeds] = useState<NeedRequest[]>([]);
  const [drives, setDrives] = useState<VolunteerDrive[]>([]);
  const [donations, setDonations] = useState<FinancialDonation[]>([]);
  const [stories, setStories] = useState<ImpactStory[]>([]);
  const [metrics, setMetrics] = useState({
    totalFinancialReceived: 0,
    mealsDistributed: 0,
    studentsSustained: 0,
    groceryKitsDistributed: 0,
    medicalConsultations: 0,
    clothesDistributed: 0,
    successfulEmployments: 0,
  });

  // State linked between Karuna AI & specific views
  const [aiDraftNeed, setAiDraftNeed] = useState<any | null>(null);
  const [preselectCategory, setPreselectCategory] = useState<string | null>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);

  // Load backend data
  const loadAllData = async () => {
    try {
      const [mRes, nRes, dRes, tRes, sRes] = await Promise.all([
        fetch('/api/metrics'),
        fetch('/api/needs'),
        fetch('/api/drives'),
        fetch('/api/donations'),
        fetch('/api/stories'),
      ]);

      if (mRes.ok) setMetrics(await mRes.json());
      if (nRes.ok) setNeeds(await nRes.json());
      if (dRes.ok) setDrives(await dRes.json());
      if (tRes.ok) setDonations(await tRes.json());
      if (sRes.ok) setStories(await sRes.json());
    } catch (err) {
      console.error("Error loading mock data from server:", err);
    }
  };

  useEffect(() => {
    loadAllData();
    // Auto carousel for impact stories
    const timer = setInterval(() => {
      setActiveStoryIdx((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // API Call Handlers
  const handleAddNeed = async (formData: any) => {
    try {
      const res = await fetch('/api/needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePledgeNeed = async (id: string, donorName: string) => {
    try {
      const res = await fetch(`/api/needs/${id}/pledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName }),
      });
      if (res.ok) {
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFulfillNeed = async (id: string, details: string) => {
    try {
      const res = await fetch(`/api/needs/${id}/fulfill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details }),
      });
      if (res.ok) {
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignupVolunteer = async (driveId: string, signup: any) => {
    try {
      const res = await fetch(`/api/drives/${driveId}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signup),
      });
      if (res.ok) {
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteDonation = async (donation: any) => {
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donation),
      });
      if (res.ok) {
        await loadAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Karuna AI integration router
  const handleSuggestCampaign = (campaignId: string, category: string) => {
    setPreselectCategory(category);
    setActiveTab('donate');
  };

  const handleSuggestNeedDraft = (draft: any) => {
    setAiDraftNeed(draft);
    setActiveTab('bridge');
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a] font-sans flex items-center justify-center py-6 md:py-10 px-4 md:px-6 overflow-x-hidden select-none">
      {/* Dynamic Master Frame Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-full">
        
        {/* Left Desktop Panel: Branding, Live Tickers, Story Carousel */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 flex-col justify-start space-y-6 pr-4 py-4 overflow-y-auto max-h-[92vh] scrollbar-thin">
          
          {/* Header Branding */}
          <div className="space-y-5 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 bg-[#c2410c] rounded-2xl flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] relative">
                <Heart className="w-7 h-7 text-white fill-white/10" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 border-2 border-black rounded-full flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-[#c2410c] rounded-full animate-ping" />
                </span>
              </div>
              <div>
                <h1 className="font-display font-black text-3xl tracking-tight text-[#c2410c] uppercase leading-none">
                  Food For All <br /><span className="text-[#1a1a1a] opacity-40">Chennai</span>
                </h1>
                <p className="text-[10px] font-mono tracking-widest text-[#71717a] uppercase font-bold mt-1">Chennai Trust • Regd 2018</p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-display font-black text-4xl leading-tight text-[#1a1a1a] tracking-tight uppercase">
                Reach the Unreached. <br />
                <span className="text-[#c2410c]">Together We Create Hope, Together We Transform Lives.</span>
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed max-w-md font-medium">
                We are Chennai's first fully audited, zero-overhead community aid platform. Every single rupee donated directly sponsors food, education starter kits, elder medicine cycles, clothes, or employment courses.
              </p>
            </div>
          </div>

          {/* Aggregate Live Audited Ticker Panel (Peach Bento Card) */}
          <div className="space-y-4 bg-[#fff1e6] border-2 border-black p-6 rounded-3xl relative overflow-hidden shadow-[6px_6px_0px_0px_rgba(26,26,26,1)]">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-[#c2410c] font-black uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" /> Live Verified Impact
            </div>

            <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#1a1a1a]">Trust Progress Milestones</h3>

            <div className="grid grid-cols-2 gap-4 text-[#1a1a1a]">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">Meals Served</span>
                <p className="text-2xl font-display font-black text-[#c2410c]">
                  {metrics.mealsDistributed.toLocaleString('en-IN')}+
                </p>
                <div className="w-full bg-white border border-black h-2 rounded-full overflow-hidden">
                  <motion.div className="bg-[#c2410c] h-full rounded-full" initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5 }} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">Students Sponsored</span>
                <p className="text-2xl font-display font-black text-[#1a1a1a]">
                  {metrics.studentsSustained.toLocaleString('en-IN')}+
                </p>
                <div className="w-full bg-white border border-black h-2 rounded-full overflow-hidden">
                  <motion.div className="bg-[#1a1a1a] h-full rounded-full" initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.5 }} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">Grocery Kits</span>
                <p className="text-2xl font-display font-black text-[#c2410c]">
                  {metrics.groceryKitsDistributed.toLocaleString('en-IN')}+
                </p>
                <div className="w-full bg-white border border-black h-2 rounded-full overflow-hidden">
                  <motion.div className="bg-[#c2410c] h-full rounded-full" initial={{ width: 0 }} animate={{ width: '74%' }} transition={{ duration: 1.5 }} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">Elder Care Cycles</span>
                <p className="text-2xl font-display font-black text-[#1a1a1a]">
                  {metrics.medicalConsultations.toLocaleString('en-IN')}+
                </p>
                <div className="w-full bg-white border border-black h-2 rounded-full overflow-hidden">
                  <motion.div className="bg-[#1a1a1a] h-full rounded-full" initial={{ width: 0 }} animate={{ width: '61%' }} transition={{ duration: 1.5 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Core Support Services, Initiatives, & Celebrations Board from the Official Flyer */}
          <TrustActivitiesBoard />

          {/* Rotating Impact Stories Carousel (Dark Bento Card) */}
          <div className="relative h-44 bg-[#1a1a1a] text-white p-5 rounded-3xl border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between text-[10px] font-mono text-yellow-400 font-bold uppercase tracking-wider">
              <span>Beneficiary Success Stories</span>
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            <AnimatePresence mode="wait">
              {stories.length > 0 && (
                <motion.div
                  key={stories[activeStoryIdx].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-1 my-2"
                >
                  <h4 className="font-display font-black text-sm text-white uppercase italic">{stories[activeStoryIdx].title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">{stories[activeStoryIdx].description}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Carousel navigation nodes */}
            <div className="flex gap-1.5 items-center">
              {stories.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveStoryIdx(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${activeStoryIdx === idx ? 'w-5 bg-yellow-400' : 'w-2 bg-gray-600'}`}
                />
              ))}
            </div>
          </div>

          {/* Footer details */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold font-mono uppercase tracking-[0.15em]">
            <span>© 2026 Food For All Chennai • 80G Tax Exempted</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c2410c]" /> SECURE AUDITED LEDGER
            </span>
          </div>

        </div>

        {/* Right Panel: Interactive Mobile Device Emulator Wrapper */}
        <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex justify-center items-center h-full">
          <div className="w-full max-w-md h-[95vh] min-h-[600px] md:h-[780px] bg-[#1a1a1a] rounded-none md:rounded-[44px] p-0 md:p-3 shadow-[12px_12px_0px_0px_rgba(26,26,26,1)] border-0 md:border-8 border-[#1a1a1a] relative flex flex-col overflow-hidden">
            
            {/* Emulator Status Bar (Top Notch) */}
            <div className="hidden md:flex justify-between items-center px-8 py-2 text-slate-400 font-mono text-[10px] select-none shrink-0">
              <span>Chennai Trust App</span>
              <div className="w-20 h-4 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 border border-slate-700" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Feed
              </div>
            </div>

            {/* Main Inside Emulator Viewport */}
            <div className="flex-1 bg-[#fdfcfb] text-[#1a1a1a] flex flex-col justify-between overflow-hidden relative rounded-none md:rounded-[32px]">
              
              {/* App bar inside emulator */}
              <div className="px-5 py-4 bg-white border-b-2 border-black flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#c2410c] fill-[#c2410c]/10" />
                  <span className="font-display font-black text-xs tracking-tight text-[#1a1a1a] uppercase">Chennai Trust</span>
                </div>
                
                {/* Micro CTA */}
                <button
                  onClick={() => setActiveTab('donate')}
                  className="px-3 py-1.5 bg-[#c2410c] text-white font-bold text-[10px] uppercase tracking-wider border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] transition-all cursor-pointer"
                >
                  Sponsor Meal
                </button>
              </div>

              {/* Viewport Core scrollable container */}
              <div className="flex-1 overflow-y-auto px-4 py-5 bg-[#fdfcfb] space-y-6">
                
                {/* Conditionally render screens/tabs */}
                <AnimatePresence mode="wait">
                  
                  {/* HOME TAB SCREEN */}
                  {activeTab === 'home' && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-6"
                    >
                      {/* Greeting Hero card */}
                      <div className="p-5 rounded-3xl bg-[#1a1a1a] text-white relative overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
                        {/* Soft visual glow patterns */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#c2410c]/10 blur-xl pointer-events-none" />
                        
                        <div className="space-y-3 relative z-10">
                          <span className="px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-[9px] font-mono tracking-widest text-yellow-300 font-bold uppercase border border-yellow-400/30">
                            Direct Aid Platform
                          </span>
                          <h3 className="font-display font-black text-base leading-tight tracking-tight uppercase">
                            "Together We Create Hope, <br />Together We Transform Lives."
                          </h3>
                          <p className="text-[10px] text-gray-300 leading-relaxed font-medium">
                            Support daily food security, tuition scholarships, medicine provisioning, or clothes for kids in Chennai.
                          </p>
                          <div className="pt-2 flex gap-2">
                            <button
                              onClick={() => setActiveTab('donate')}
                              className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-[#1a1a1a] font-black text-[10px] uppercase tracking-wide border-2 border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] transition-all cursor-pointer"
                            >
                              Support Initiatives
                            </button>
                            <button
                              onClick={() => setActiveTab('chat')}
                              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-[10px] uppercase tracking-wide border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" /> Ask Karuna AI
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Core Support Initiatives Quick Navigation grids */}
                      <div className="space-y-3">
                        <h4 className="font-display font-black text-[#1a1a1a] text-xs tracking-wider uppercase">Quick Sponsorship</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: 'Food Security', desc: 'Meals at ₹40 each', icon: '🍱', category: 'Food' },
                            { name: 'Vidya Deepam', desc: 'Kits at ₹1500 each', icon: '🎓', category: 'Education' },
                            { name: 'Grocery Packs', desc: 'Family pack ₹800', icon: '🌾', category: 'Groceries' },
                            { name: 'Sanjeevani Aid', desc: 'Medicines ₹1200', icon: '🩺', category: 'Medical Aid' },
                            { name: 'Vastra Clothes', desc: 'Uniform sets ₹500', icon: '👕', category: 'Dresses' },
                            { name: 'Livelihoods', desc: 'Job development', icon: '💼', category: 'Employment' },
                          ].map((pillar) => (
                            <button
                              key={pillar.name}
                              onClick={() => {
                                if (pillar.category === 'Employment') {
                                  setActiveTab('bridge');
                                } else {
                                  setPreselectCategory(pillar.category);
                                  setActiveTab('donate');
                                }
                              }}
                              className="p-3 bg-white rounded-2xl border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-left cursor-pointer flex flex-col justify-between h-24"
                            >
                              <span className="text-xl bg-slate-50 p-1.5 rounded-xl self-start border border-black/10">{pillar.icon}</span>
                              <div>
                                <h5 className="font-display font-black text-slate-900 text-[11px] truncate uppercase">{pillar.name}</h5>
                                <p className="text-[9px] text-[#c2410c] font-black mt-0.5">{pillar.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Official Activities, Services, and Celebrations Board */}
                      <div className="space-y-3">
                        <h4 className="font-display font-black text-[#1a1a1a] text-xs tracking-wider uppercase">Trust Action Profile</h4>
                        <TrustActivitiesBoard />
                      </div>

                      {/* Live Ticker Metric for Mobile Emulator View */}
                      <div className="p-4 bg-[#fff1e6] border-2 border-black rounded-3xl shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-3.5 text-[#1a1a1a]">
                        <div className="flex justify-between items-center text-xs font-bold uppercase">
                          <span>Live Impact Milestones</span>
                          <span className="text-[10px] font-mono text-[#c2410c] uppercase flex items-center gap-1 font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" /> Audited
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex justify-between items-center text-[11px] border-b border-black/5 pb-1">
                            <span className="text-gray-600 font-medium">🍱 Meals Prepared</span>
                            <span className="font-mono font-black text-[#1a1a1a]">{metrics.mealsDistributed.toLocaleString('en-IN')}+</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] border-b border-black/5 pb-1">
                            <span className="text-gray-600 font-medium">🎓 Students Sponsored</span>
                            <span className="font-mono font-black text-[#1a1a1a]">{metrics.studentsSustained.toLocaleString('en-IN')}+</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-600 font-medium">🩺 Medical Care Kits</span>
                            <span className="font-mono font-black text-[#1a1a1a]">{metrics.medicalConsultations.toLocaleString('en-IN')}+</span>
                          </div>
                        </div>
                      </div>

                      {/* QR Code sharing & bank details card */}
                      <ShareQRCodeCard />

                      {/* Support Contacts Card */}
                      <div className="p-4 rounded-3xl bg-[#ecfdf5] border-2 border-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] space-y-3.5 text-[#1a1a1a]">
                        <h4 className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-wider">Need Urgent Coordination?</h4>
                        <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                          For bulk food pick-ups, festival sponsorship, or reporting street emergencies directly, contact our coordinators:
                        </p>
                        <div className="space-y-1.5 border-t border-dashed border-[#a7f3d0] pt-2">
                          <div className="flex flex-col gap-1 text-[11px] font-black text-[#065f46]">
                            <span className="text-[9px] text-emerald-800/60 uppercase font-bold tracking-wider block">📞 Mobile Helplines</span>
                            <span className="flex items-center gap-1.5">📱 +91 95514 12420</span>
                            <span className="flex items-center gap-1.5">📱 +91 73055 41420</span>
                          </div>
                          <div className="flex flex-col gap-1 text-[11px] font-black text-[#065f46] pt-1">
                            <span className="text-[9px] text-emerald-800/60 uppercase font-bold tracking-wider block">✉️ Email Contacts</span>
                            <span className="flex items-center gap-1.5" title="Official Trust Email">🏢 Foodforallchennai2018@gmail.com</span>
                            <span className="flex items-center gap-1.5" title="Founder's Mail">👤 louis.fernando3@gmail.com</span>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* KINDNESS BRIDGE TAB SCREEN */}
                  {activeTab === 'bridge' && (
                    <motion.div
                      key="bridge"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                    >
                      <KindnessBridge
                        needs={needs}
                        onAddNeed={handleAddNeed}
                        onPledgeNeed={handlePledgeNeed}
                        onFulfillNeed={handleFulfillNeed}
                        draftFromAI={aiDraftNeed}
                        clearAIDraft={() => setAiDraftNeed(null)}
                      />
                    </motion.div>
                  )}

                  {/* VOLUNTEER TAB SCREEN */}
                  {activeTab === 'volunteer' && (
                    <motion.div
                      key="volunteer"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                    >
                      <VolunteerHubView drives={drives} onSignup={handleSignupVolunteer} />
                    </motion.div>
                  )}

                  {/* TRUST LEDGER TAB SCREEN */}
                  {activeTab === 'ledger' && (
                    <motion.div
                      key="ledger"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                    >
                      <TrustLedgerView donations={donations} metrics={metrics} />
                    </motion.div>
                  )}

                  {/* KARUNA AI CHAT TAB SCREEN */}
                  {activeTab === 'chat' && (
                    <motion.div
                      key="chat"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="h-[600px] md:h-[680px]"
                    >
                      <KarunaChat
                        onSuggestCampaign={handleSuggestCampaign}
                        onSuggestNeedDraft={handleSuggestNeedDraft}
                      />
                    </motion.div>
                  )}

                  {/* DONATE INITIATIVES TAB SCREEN */}
                  {activeTab === 'donate' && (
                    <motion.div
                      key="donate"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                    >
                      <DonationDrawer
                        onCompleteDonation={handleCompleteDonation}
                        preselectedCategory={preselectCategory}
                        onClearPreselect={() => setPreselectCategory(null)}
                      />
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom Sticky Tab Navigation bar (Emulator view) */}
              <div className="px-3 py-2 bg-white border-t-2 border-black flex items-center justify-around shrink-0 select-none">
                {[
                  { id: 'home', label: 'Home', icon: Home },
                  { id: 'bridge', label: 'Bridge', icon: Heart },
                  { id: 'volunteer', label: 'Volunteers', icon: Users },
                  { id: 'ledger', label: 'Transparency', icon: Layers },
                  { id: 'chat', label: 'Karuna AI', icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 text-[9px] font-bold cursor-pointer transition-all relative ${
                        isActive ? 'text-[#c2410c] font-extrabold' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-all ${isActive ? 'scale-110 text-[#c2410c] fill-[#c2410c]/5' : ''}`} />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.span
                          layoutId="activeTabMarker"
                          className="absolute bottom-0 w-8 h-0.5 bg-[#c2410c] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
