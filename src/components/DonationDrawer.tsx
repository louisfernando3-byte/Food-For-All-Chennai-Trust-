/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Heart, Sparkles, AlertCircle, ShoppingBag, Check, User, Gift } from 'lucide-react';
import { SupportCategory } from '../types';

interface DonationDrawerProps {
  onCompleteDonation: (donation: {
    donorName: string;
    amount: number;
    category: SupportCategory | 'General';
    message?: string;
    frequency?: 'one-time' | 'monthly' | 'quarterly';
  }) => void;
  preselectedCategory: string | null;
  onClearPreselect: () => void;
}

export default function DonationDrawer({
  onCompleteDonation,
  preselectedCategory,
  onClearPreselect,
}: DonationDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | 'General'>('General');
  const [mealCount, setMealCount] = useState<number>(10); // for Food: default sponsor 10 meals
  const [studentCount, setStudentCount] = useState<number>(1); // for Education: default 1 student
  const [groceryCount, setGroceryCount] = useState<number>(2); // for Groceries: default 2 kits
  const [medicalCount, setMedicalCount] = useState<number>(1); // for Medical: default 1 pack
  const [dressCount, setDressCount] = useState<number>(2); // for Dresses: default 2 kits
  const [customAmount, setCustomAmount] = useState<string>('2000');

  const [donorName, setDonorName] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'quarterly'>('one-time');
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync preselected categories from Karuna AI
  useEffect(() => {
    if (preselectedCategory) {
      if (['Food', 'Education', 'Groceries', 'Medical Aid', 'Dresses', 'Employment', 'Financial'].includes(preselectedCategory)) {
        setSelectedCategory(preselectedCategory as any);
      } else {
        setSelectedCategory('General');
      }
      setIsCheckout(false);
      onClearPreselect();
    }
  }, [preselectedCategory]);

  const pricingMap = {
    Food: 40,        // ₹40 per meal
    Education: 1500, // ₹1,500 per school kit
    Groceries: 800,  // ₹800 per dry groceries pack
    'Medical Aid': 1200, // ₹1,200 per elderly package
    Dresses: 500,    // ₹500 per uniform/dress kit
    Employment: 1000,
    General: 1,
  };

  const getSponsorshipDetails = () => {
    switch (selectedCategory) {
      case 'Food':
        return {
          amount: mealCount * pricingMap.Food,
          headline: `Sponsor ${mealCount} Hot Nutritious Meals`,
          description: `Just ₹40 per meal prepares and delivers freshly cooked Sambar Rice or Curd Rice directly to impoverished seniors and pavement laborers in Chennai.`,
          impact: `Feeds approximately ${mealCount} people for a full day.`,
        };
      case 'Education':
        return {
          amount: studentCount * pricingMap.Education,
          headline: `Sponsor ${studentCount} Vidya Deepam kits`,
          description: `₹1,500 equips one orphan or underprivileged student in Chennai with school uniforms, learning notebooks, textbook sets, customized stationeries, and backpacks.`,
          impact: `Provides full school-starter sets for ${studentCount} students.`,
        };
      case 'Groceries':
        return {
          amount: groceryCount * pricingMap.Groceries,
          headline: `Sponsor ${groceryCount} Dry Grocery Provisions`,
          description: `₹800 supplies a comprehensive dry provision kit containing 10kg premium ponni rice, 2kg toor dal, cooking oil, tea powder, salt, wheat, and spices for impoverished families.`,
          impact: `Sustains ${groceryCount} vulnerable families for an entire month.`,
        };
      case 'Medical Aid':
        return {
          amount: medicalCount * pricingMap['Medical Aid'],
          headline: `Sponsor ${medicalCount} Elder Medical Packets`,
          description: `₹1,200 funds basic medical checkups, medicines for chronic ailments (such as diabetes/hypertension), or a nebulizer machine stock at our Vyasarpadi clinic.`,
          impact: `Provides essential medical consultation and 1 month medicines for ${medicalCount} seniors.`,
        };
      case 'Dresses':
        return {
          amount: dressCount * pricingMap.Dresses,
          headline: `Sponsor ${dressCount} Uniform or Festival Dresses`,
          description: `₹500 purchases and gifts a complete set of brand new school uniforms or traditional garments for homeless children living in shelters.`,
          impact: `Sponsors ${dressCount} children with a set of dignified garments.`,
        };
      default:
        const amt = Number(customAmount) || 0;
        return {
          amount: amt,
          headline: `General Support Contribution`,
          description: `Sponsor where it is needed the most. General funds enable our Trust to respond rapidly to critical local demands, slum health emergencies, and sudden food shortages.`,
          impact: `Directly funds local relief operations across our core support initiatives.`,
        };
    }
  };

  const details = getSponsorshipDetails();

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.amount <= 0) {
      alert("Please select or enter an amount to support.");
      return;
    }

    onCompleteDonation({
      donorName: donorName.trim() || 'Anonymous Donor',
      amount: details.amount,
      category: selectedCategory,
      message: donorMessage.trim() || undefined,
      frequency,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsCheckout(false);
      setDonorName('');
      setDonorMessage('');
      setFrequency('one-time');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Visual Tab Selection */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {(['General', 'Food', 'Education', 'Groceries', 'Medical Aid', 'Dresses'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setIsCheckout(false);
            }}
            className={`py-3.5 px-1 rounded-2xl border-2 border-black text-[10px] font-black uppercase transition-all flex flex-col items-center gap-1.5 cursor-pointer hover:bg-slate-50 ${
              selectedCategory === cat
                ? 'bg-[#1a1a1a] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-slate-600'
            }`}
          >
            <span className="text-base">
              {cat === 'Food' ? '🍱' : cat === 'Education' ? '🎓' : cat === 'Groceries' ? '🌾' : cat === 'Medical Aid' ? '🩺' : cat === 'Dresses' ? '👕' : '💖'}
            </span>
            <span className="truncate w-full text-center px-1">
              {cat === 'Medical Aid' ? 'Medical' : cat === 'Education' ? 'School' : cat}
            </span>
          </button>
        ))}
      </div>

      {/* Main interactive configuration block */}
      <div className="p-6 bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] space-y-6">
        <AnimatePresence mode="wait">
          {!isCheckout ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              {/* Category-specific Slider / Inputs */}
              <div>
                <h4 className="font-display font-black text-[#1a1a1a] text-sm uppercase">{details.headline}</h4>
                <p className="text-[11px] text-gray-600 font-medium leading-relaxed mt-1">{details.description}</p>
              </div>

              {/* Live Configurator controls */}
              {selectedCategory === 'Food' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-xs text-slate-500 font-black uppercase">Meals Count</span>
                    <span className="text-xl font-display font-black text-[#1a1a1a]">{mealCount} Meals</span>
                  </div>
                  <div className="space-y-1">
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={mealCount}
                      onChange={(e) => setMealCount(Number(e.target.value))}
                      className="w-full accent-[#c2410c] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-black font-mono">
                      <span>5 MEALS</span>
                      <span>100 MEALS</span>
                      <span>200 MEALS</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === 'Education' && (
                <div className="flex justify-between items-center bg-slate-50 border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xs text-slate-500 font-black uppercase">Student Starter Kits</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStudentCount(Math.max(1, studentCount - 1))}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[#1a1a1a] hover:bg-slate-100 cursor-pointer text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      -
                    </button>
                    <span className="text-lg font-display font-black text-[#1a1a1a] w-10 text-center">{studentCount}</span>
                    <button
                      onClick={() => setStudentCount(studentCount + 1)}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[#1a1a1a] hover:bg-slate-100 cursor-pointer text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {selectedCategory === 'Groceries' && (
                <div className="flex justify-between items-center bg-slate-50 border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xs text-slate-500 font-black uppercase">Monthly Grocery Kits</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGroceryCount(Math.max(1, groceryCount - 1))}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[#1a1a1a] hover:bg-slate-100 cursor-pointer text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      -
                    </button>
                    <span className="text-lg font-display font-black text-[#1a1a1a] w-10 text-center">{groceryCount}</span>
                    <button
                      onClick={() => setGroceryCount(groceryCount + 1)}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[#1a1a1a] hover:bg-slate-100 cursor-pointer text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {selectedCategory === 'Medical Aid' && (
                <div className="flex justify-between items-center bg-slate-50 border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xs text-slate-500 font-black uppercase">Care Cycles Sponsoring</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setMedicalCount(Math.max(1, medicalCount - 1))}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[#1a1a1a] hover:bg-slate-100 cursor-pointer text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      -
                    </button>
                    <span className="text-lg font-display font-black text-[#1a1a1a] w-10 text-center">{medicalCount}</span>
                    <button
                      onClick={() => setMedicalCount(medicalCount + 1)}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[#1a1a1a] hover:bg-slate-100 cursor-pointer text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {selectedCategory === 'Dresses' && (
                <div className="flex justify-between items-center bg-slate-50 border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <span className="text-xs text-slate-500 font-black uppercase">Uniform Sets Sponsoring</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDressCount(Math.max(1, dressCount - 1))}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[#1a1a1a] hover:bg-slate-100 cursor-pointer text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      -
                    </button>
                    <span className="text-lg font-display font-black text-[#1a1a1a] w-10 text-center">{dressCount}</span>
                    <button
                      onClick={() => setDressCount(dressCount + 1)}
                      className="w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center font-black text-[#1a1a1a] hover:bg-slate-100 cursor-pointer text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {selectedCategory === 'General' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {['1000', '2000', '5000', '10000'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCustomAmount(val)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-black border-2 border-black cursor-pointer transition-all ${
                          customAmount === val
                            ? 'bg-[#1a1a1a] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        ₹{Number(val).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-wider">Enter Custom Amount (INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-900 font-black text-xs">₹</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Other amount"
                        className="w-full bg-slate-50 border-2 border-black rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-[#1a1a1a] focus:outline-none font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Support Schedule Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-wider block">
                  🗓️ Support Schedule
                </label>
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-2xl border-2 border-black">
                  {(['one-time', 'monthly', 'quarterly'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer ${
                        frequency === freq
                          ? 'bg-[#1a1a1a] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                      }`}
                    >
                      {freq === 'one-time' ? 'One-time' : freq === 'monthly' ? '🔁 Monthly' : '⏳ Quarterly'}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-gray-500 font-bold leading-normal">
                  {frequency === 'one-time'
                    ? 'A single direct contribution written instantly to the transparent Trust Ledger.'
                    : frequency === 'monthly'
                    ? 'Help sustain our core supplies. Recommended to provide predictable daily security.'
                    : 'Provides consistent quarterly funding for school kits, medicine stocks, or apparel.'}
                </p>
              </div>

              {/* Total Summary Row & Action */}
              <div className="p-4 bg-emerald-100/50 rounded-2xl border-2 border-black space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-700 font-bold">
                  <span className="uppercase text-[9px] bg-white border border-black px-1.5 py-0.5 rounded-md font-black">Impact</span>
                  <span className="text-[#065f46] font-black">{details.impact}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t-2 border-black/5">
                  <span className="text-slate-800 font-black text-xs uppercase">
                    {frequency === 'one-time' ? 'Sponsorship Total' : `${frequency} Commitment`}
                  </span>
                  <span className="text-xl font-display font-black text-slate-900">
                    ₹{details.amount.toLocaleString('en-IN')}
                    {frequency === 'monthly' && <span className="text-xs font-bold text-gray-500"> / month</span>}
                    {frequency === 'quarterly' && <span className="text-xs font-bold text-gray-500"> / quarter</span>}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckout(true)}
                disabled={details.amount <= 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#c2410c] hover:bg-[#ea580c] text-white font-black text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" /> Initialize Transparent Sponsorship
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              {isSuccess ? (
                <div className="py-8 text-center space-y-3 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-100 border-2 border-emerald-600 text-emerald-800 rounded-full flex items-center justify-center text-xl animate-bounce">
                    <Check className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-slate-900 text-sm uppercase">Sponsorship Confirmed!</h4>
                    <p className="text-xs text-gray-600 font-medium mt-1">Transaction written to trust transparency log. Thank you for your kindness!</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCompleteCheckout} className="space-y-4">
                  <div className="flex justify-between items-baseline pb-3 border-b-2 border-black/5">
                    <div>
                      <h4 className="font-display font-black text-slate-900 text-sm uppercase">Fulfill Sponsorship</h4>
                      <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                        {frequency === 'one-time' ? 'Your contribution' : `Your ${frequency} sponsorship`} will be immediately accounted for.
                      </p>
                    </div>
                    <span className="font-display font-black text-sm text-slate-900">
                      ₹{details.amount.toLocaleString('en-IN')}
                      {frequency === 'monthly' && <span className="text-[10px] font-bold text-gray-500"> / mo</span>}
                      {frequency === 'quarterly' && <span className="text-[10px] font-bold text-gray-500"> / qtr</span>}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wide">Donor Name (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                        <User className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        placeholder="Leave blank to donate anonymously"
                        className="w-full bg-slate-50 border-2 border-black rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1a1a1a] font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-wide">Message / Dedication (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-slate-500">
                        <Gift className="w-3.5 h-3.5" />
                      </span>
                      <textarea
                        value={donorMessage}
                        onChange={(e) => setDonorMessage(e.target.value)}
                        rows={2}
                        placeholder="e.g. For food drive in memory of grandfather, or a message of hope."
                        className="w-full bg-slate-50 border-2 border-black rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#1a1a1a] font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Audit disclaimer */}
                  <div className="p-3 bg-slate-50 border-2 border-black rounded-2xl flex items-start gap-2 text-[10px] text-gray-500 leading-relaxed font-bold">
                    <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>
                      Completing sponsors writes an entry onto our live ledger. A unique cryptographic reference hash will be issued representing delivery verification.
                    </span>
                  </div>

                  <div className="flex gap-2 text-xs pt-1.5">
                    <button
                      type="button"
                      onClick={() => setIsCheckout(false)}
                      className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 cursor-pointer transition-all"
                    >
                      Change Amount
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] cursor-pointer transition-all"
                    >
                      Sponsor Now
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
