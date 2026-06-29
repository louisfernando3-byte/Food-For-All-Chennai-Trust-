/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MapPin, AlertCircle, PlusCircle, CheckCircle, HandHelping, ClipboardCheck, Sparkles } from 'lucide-react';
import { NeedRequest, SupportCategory } from '../types';

interface KindnessBridgeProps {
  needs: NeedRequest[];
  onAddNeed: (need: Omit<NeedRequest, 'id' | 'requestedAt' | 'status'>) => void;
  onPledgeNeed: (id: string, donorName: string) => void;
  onFulfillNeed: (id: string, details: string, photo?: string) => void;
  draftFromAI: {
    category: string;
    title: string;
    description: string;
    location: string;
    beneficiaryName: string;
    urgency: 'Low' | 'Medium' | 'High';
  } | null;
  clearAIDraft: () => void;
}

export default function KindnessBridge({
  needs,
  onAddNeed,
  onPledgeNeed,
  onFulfillNeed,
  draftFromAI,
  clearAIDraft,
}: KindnessBridgeProps) {
  const [activeTab, setActiveTab] = useState<'view' | 'post'>('view');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');

  // Pledge dialog state
  const [selectedPledgeNeed, setSelectedPledgeNeed] = useState<NeedRequest | null>(null);
  const [donorName, setDonorName] = useState('');

  // Fulfillment dialog state
  const [selectedFulfillNeed, setSelectedFulfillNeed] = useState<NeedRequest | null>(null);
  const [fulfillmentDetails, setFulfillmentDetails] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    category: 'Food' as SupportCategory,
    title: '',
    description: '',
    location: '',
    beneficiaryName: '',
    urgency: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  // Pre-fill form if draft from AI is supplied
  useEffect(() => {
    if (draftFromAI) {
      setFormData({
        category: (draftFromAI.category as SupportCategory) || 'Food',
        title: draftFromAI.title || '',
        description: draftFromAI.description || '',
        location: draftFromAI.location || '',
        beneficiaryName: draftFromAI.beneficiaryName || '',
        urgency: draftFromAI.urgency || 'Medium',
      });
      setActiveTab('post');
    }
  }, [draftFromAI]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.location || !formData.beneficiaryName) {
      alert("Please fill in all details to submit this need.");
      return;
    }
    onAddNeed(formData);
    setFormData({
      category: 'Food',
      title: '',
      description: '',
      location: '',
      beneficiaryName: '',
      urgency: 'Medium',
    });
    clearAIDraft();
    setActiveTab('view');
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) return;
    if (selectedPledgeNeed) {
      onPledgeNeed(selectedPledgeNeed.id, donorName);
      setSelectedPledgeNeed(null);
      setDonorName('');
    }
  };

  const handleFulfillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fulfillmentDetails.trim()) return;
    if (selectedFulfillNeed) {
      onFulfillNeed(selectedFulfillNeed.id, fulfillmentDetails);
      setSelectedFulfillNeed(null);
      setFulfillmentDetails('');
    }
  };

  const filteredNeeds = needs.filter((n) => {
    const matchesCategory = categoryFilter === 'All' || n.category === categoryFilter;
    const matchesUrgency = urgencyFilter === 'All' || n.urgency === urgencyFilter;
    return matchesCategory && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl border-2 border-black">
        <button
          onClick={() => setActiveTab('view')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
            activeTab === 'view' ? 'bg-[#1a1a1a] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-slate-600 hover:text-slate-900 font-bold'
          }`}
        >
          <HandHelping className="w-4 h-4" /> Help Requests ({filteredNeeds.length})
        </button>
        <button
          onClick={() => setActiveTab('post')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
            activeTab === 'post' ? 'bg-[#1a1a1a] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'text-slate-600 hover:text-slate-900 font-bold'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Report a Need
        </button>
      </div>

      {activeTab === 'view' ? (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)]">
            <div className="flex items-center gap-2 text-xs font-black text-[#1a1a1a] uppercase tracking-wide">
              Filters:
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 border-2 border-black rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Food">Food</option>
                <option value="Education">Education</option>
                <option value="Employment">Employment</option>
                <option value="Groceries">Groceries</option>
                <option value="Medical Aid">Medical Aid</option>
                <option value="Dresses">Dresses</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="bg-slate-50 border-2 border-black rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none"
              >
                <option value="All">All Urgency</option>
                <option value="High">🔴 High Urgency</option>
                <option value="Medium">🟡 Medium Urgency</option>
                <option value="Low">🟢 Low Urgency</option>
              </select>
            </div>
          </div>

          {/* Need Cards List */}
          <div className="grid grid-cols-1 gap-5">
            {filteredNeeds.length > 0 ? (
              filteredNeeds.map((need) => (
                <motion.div
                  key={need.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-3xl transition-all relative overflow-hidden ${
                    need.status === 'Fulfilled'
                      ? 'bento-card-mint'
                      : need.status === 'Pledged'
                      ? 'bento-card-peach'
                      : 'bento-card'
                  }`}
                >
                  {/* Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="px-3 py-1 rounded-full bg-[#1a1a1a] text-[9px] font-black text-white uppercase tracking-wider">
                      {need.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border-2 border-black ${
                          need.urgency === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : need.urgency === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {need.urgency} Urgency
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border-2 border-black ${
                          need.status === 'Fulfilled'
                            ? 'bg-[#ecfdf5] text-[#065f46]'
                            : need.status === 'Pledged'
                            ? 'bg-[#fff1e6] text-[#c2410c]'
                            : 'bg-white text-[#1a1a1a]'
                        }`}
                      >
                        {need.status}
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <h4 className="font-display font-black text-slate-900 text-sm mb-1 uppercase">{need.title}</h4>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mb-4">{need.description}</p>

                  <div className="space-y-2 border-t-2 border-black/5 pt-3.5 mb-4 text-[11px] text-gray-500 font-bold">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{need.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClipboardCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Case Reference: {need.beneficiaryName}</span>
                    </div>
                  </div>

                  {/* Pledge and Fulfillment States */}
                  {need.status === 'Pledged' && (
                    <div className="mb-4 p-3 bg-amber-100/50 border-2 border-amber-600 rounded-2xl text-[11px] text-amber-900 leading-relaxed font-bold">
                      🤝 Support Pledged by <span className="font-black text-amber-950">{need.pledgedBy}</span>. They are currently organizing the items for distribution.
                    </div>
                  )}

                  {need.status === 'Fulfilled' && (
                    <div className="mb-4 p-3.5 bg-emerald-100/50 border-2 border-emerald-600 rounded-2xl space-y-2">
                      <div className="text-[11px] text-emerald-950 font-bold leading-relaxed">
                        <span className="font-black">✨ Fulfillment Report:</span> {need.fulfillmentDetails}
                      </div>
                      {need.verificationPhoto && (
                        <img
                          src={need.verificationPhoto}
                          alt="Fulfillment proof"
                          referrerPolicy="no-referrer"
                          className="w-24 h-18 rounded-lg object-cover border-2 border-black"
                        />
                      )}
                    </div>
                  )}

                  {/* Actions Tray */}
                  <div className="flex gap-2.5">
                    {need.status === 'Pending' && (
                      <button
                        onClick={() => setSelectedPledgeNeed(need)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#c2410c] hover:bg-[#ea580c] text-white text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] transition-all cursor-pointer"
                      >
                        <HandHelping className="w-3.5 h-3.5" /> Pledge to Support
                      </button>
                    )}

                    {need.status === 'Pledged' && (
                      <button
                        onClick={() => setSelectedFulfillNeed(need)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] transition-all cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Verify & Complete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-white border-2 border-dashed border-black rounded-3xl">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h5 className="font-display font-black text-slate-700 text-sm uppercase">No Active Demands found</h5>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1 font-semibold">
                  Try adjusting filters or submit a new neighborhood aid request!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-3xl bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] space-y-4">
          {/* Pre-fill toast from Karuna AI */}
          {draftFromAI && (
            <div className="p-4 rounded-2xl bg-[#ecfdf5] border-2 border-black shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] flex items-start gap-3">
              <Sparkles className="w-4.5 h-4.5 text-[#065f46] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-[11px] font-black text-[#065f46] tracking-wide uppercase">Pre-filled by Karuna AI</h5>
                <p className="text-xs text-gray-700 font-medium">
                  Review the conversation draft below and edit before submitting live to Chennai's kindness bridge.
                </p>
                <button
                  type="button"
                  onClick={clearAIDraft}
                  className="text-[10px] text-[#c2410c] hover:text-[#ea580c] underline font-black mt-1 cursor-pointer"
                >
                  Clear Draft and Reset Form
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Category of Support</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SupportCategory })}
                className="w-full bg-slate-50 border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-slate-700 font-bold focus:outline-none"
              >
                <option value="Food">🍱 Food Distribution / Supplies</option>
                <option value="Education">🎓 Vidya Deepam (Education)</option>
                <option value="Employment">💼 Empower Chennai (Livelihood & Jobs)</option>
                <option value="Groceries">🌾 Amudham Provision Kits</option>
                <option value="Medical Aid">🩺 Sanjeevani Medical Support</option>
                <option value="Dresses">👕 Vastra Garments / Uniforms</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Urgency Rating</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map((urg) => (
                  <button
                    key={urg}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: urg })}
                    className={`flex-1 py-2 text-xs font-black rounded-xl border-2 cursor-pointer transition-all ${
                      formData.urgency === urg
                        ? urg === 'High'
                          ? 'bg-rose-100 border-rose-600 text-rose-800'
                          : urg === 'Medium'
                          ? 'bg-amber-100 border-amber-600 text-amber-800'
                          : 'bg-emerald-100 border-emerald-600 text-emerald-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {urg}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Compelling Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Rice kits for Vyasarpadi daily wage families"
                className="w-full bg-slate-50 border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a1a] font-bold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Detailed Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe the situation, item quantity, and what exactly is needed..."
                className="w-full bg-slate-50 border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a1a] font-bold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Neighborhood Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Mylapore Temple Area, Chennai"
                  className="w-full bg-slate-50 border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a1a] font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wider">Beneficiary Name</label>
                <input
                  type="text"
                  value={formData.beneficiaryName}
                  onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                  placeholder="e.g. Royapettah Blind Shelter"
                  className="w-full bg-slate-50 border-2 border-black rounded-xl px-3.5 py-2.5 text-xs text-[#1a1a1a] font-bold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#c2410c] hover:bg-[#ea580c] text-white font-black text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all cursor-pointer"
            >
              🚀 Publish Aid Request to Kindness Bridge
            </button>
          </form>
        </div>
      )}

      {/* Pledge Dialog Overlay */}
      <AnimatePresence>
        {selectedPledgeNeed && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4"
            >
              <div>
                <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">Pledge to Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">Please coordinate to deliver these provisions directly.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">{selectedPledgeNeed.title}</div>
                <div>📍 {selectedPledgeNeed.location}</div>
              </div>

              <form onSubmit={handlePledgeSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Lakshmi Narayanan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-2 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedPledgeNeed(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
                  >
                    Confirm Pledge
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fulfillment Dialog Overlay */}
      <AnimatePresence>
        {selectedFulfillNeed && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4"
            >
              <div>
                <h4 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide">Fulfillment Report</h4>
                <p className="text-xs text-slate-500 mt-0.5">Log verification comments to finalize this community action.</p>
              </div>

              <form onSubmit={handleFulfillSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Delivery Details</label>
                  <textarea
                    required
                    rows={3}
                    value={fulfillmentDetails}
                    onChange={(e) => setFulfillmentDetails(e.target.value)}
                    placeholder="Describe how the delivery was made (e.g., '10 grocery bags hand-delivered to caretakers, video files sent to Chennai Trust offices.')"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-2 text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedFulfillNeed(null)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Submit Verification
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
