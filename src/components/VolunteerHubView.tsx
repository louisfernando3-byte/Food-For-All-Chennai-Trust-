/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Users, Award, ShieldAlert, Sparkles, Smile, CheckCircle } from 'lucide-react';
import { VolunteerDrive } from '../types';

interface VolunteerHubViewProps {
  drives: VolunteerDrive[];
  onSignup: (driveId: string, signup: { name: string; email: string; phone: string }) => void;
}

export default function VolunteerHubView({ drives, onSignup }: VolunteerHubViewProps) {
  const [selectedDrive, setSelectedDrive] = useState<VolunteerDrive | null>(null);
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.phone) return;
    if (selectedDrive) {
      onSignup(selectedDrive.id, signupForm);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
        setSelectedDrive(null);
        setSignupForm({ name: '', email: '', phone: '' });
      }, 2500);
    }
  };

  const volunteerBadges = [
    {
      title: 'Mylapore Captain',
      desc: 'Completed 5 pavement morning food distributions around Mylapore.',
      color: '#10b981',
      icon: '🍱',
    },
    {
      title: 'Golden Heart Mentor',
      desc: 'Sustained 10 mentorship hours teaching marginalized kids.',
      color: '#f59e0b',
      icon: '🎓',
    },
    {
      title: 'Guardian Angel',
      desc: 'Participated in a sanitation, clothing, or medical camp drive.',
      color: '#ec4899',
      icon: '🩺',
    },
    {
      title: 'Trust Hero',
      desc: 'Pledged or facilitated the closing of a Kindness Bridge aid ticket.',
      color: '#8b5cf6',
      icon: '✨',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Leaderboard/Impact banner (Mint Bento Card) */}
      <div className="p-4 rounded-3xl bg-[#ecfdf5] border-2 border-black flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-[#1a1a1a]">
        <div className="p-2.5 bg-white border-2 border-black rounded-2xl text-[#065f46] shrink-0 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
          <Award className="w-5 h-5 fill-yellow-500/10" />
        </div>
        <div>
          <h4 className="text-xs font-black text-[#1a1a1a] uppercase tracking-wider">Join our Chennai Volunteer Army</h4>
          <p className="text-[11px] text-gray-700 font-medium">Over 1,200 hours of active field service delivered this quarter alone.</p>
        </div>
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        <h4 className="font-display font-black text-[#1a1a1a] text-sm tracking-wide uppercase">Upcoming Volunteering Drives</h4>

        <div className="space-y-4">
          {drives.map((drive) => {
            const isFull = drive.spotsRegistered >= drive.spotsMax;
            return (
              <div
                key={drive.id}
                className="p-5 rounded-3xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(26,26,26,1)] transition-all space-y-4"
              >
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1a1a1a] text-[9px] font-black text-white uppercase tracking-wider">
                      {drive.category} Drive
                    </span>
                    <h5 className="font-display font-black text-slate-900 text-sm mt-1.5 uppercase leading-tight">{drive.title}</h5>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-[#1a1a1a] bg-white border-2 border-black px-2.5 py-1 rounded-xl font-bold">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {drive.spotsRegistered} / {drive.spotsMax} Slots
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-medium leading-relaxed">{drive.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-500 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c2410c]" />
                    <span>{new Date(drive.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c2410c]" />
                    <span>{drive.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-[#c2410c]" />
                    <span>{drive.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t-2 border-black/5 pt-4">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    Leader: <span className="font-black text-[#c2410c]">{drive.coordinatorName}</span>
                  </div>
                  <button
                    disabled={isFull}
                    onClick={() => setSelectedDrive(drive)}
                    className={`py-2 px-5 rounded-xl font-black text-xs cursor-pointer border-2 border-black transition-all ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 border-2 border-slate-300 cursor-not-allowed shadow-none'
                        : 'bg-[#c2410c] text-white shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(26,26,26,1)]'
                    }`}
                  >
                    {isFull ? 'Fully Booked' : 'Book a Slot'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Volunteer Badges Showcase (Peach Bento Card) */}
      <div className="p-5 rounded-3xl bg-[#fff1e6] border-2 border-black shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] space-y-4 text-[#1a1a1a]">
        <div>
          <h4 className="font-display font-black text-[#1a1a1a] text-sm tracking-wide uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-[#c2410c]" /> Volunteer Badges & Honors
          </h4>
          <p className="text-[11px] text-gray-700 font-medium">Join drive campaigns, gain points, and unlock unique trust badges.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {volunteerBadges.map((badge) => (
            <div key={badge.title} className="p-3 bg-white rounded-2xl border-2 border-black flex items-start gap-3 transition-all shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border-2 border-black shadow-[1px_1px_0px_0px_rgba(26,26,26,1)]"
                style={{ backgroundColor: badge.color }}
              >
                {badge.icon}
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-black text-[#1a1a1a] uppercase">{badge.title}</h5>
                <p className="text-[10px] text-gray-500 leading-relaxed font-bold">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Modal Dialog */}
      <AnimatePresence>
        {selectedDrive && (
          <div className="fixed inset-0 bg-[#1a1a1a]/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] space-y-4 relative overflow-hidden"
            >
              {showConfirmation ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center space-y-3 flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 bg-emerald-105 border-2 border-emerald-600 text-emerald-800 rounded-full flex items-center justify-center text-xl animate-bounce">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-slate-900 text-sm uppercase">Slot Secured Successfully!</h4>
                    <p className="text-xs text-gray-600 font-medium mt-1">See you in the field, {signupForm.name}. Hope shines brightest together.</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div>
                    <h4 className="font-display font-black text-slate-900 text-sm uppercase tracking-wide">Register for Drive</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Please secure your slot and confirm attendance.</p>
                  </div>

                  <div className="p-3 bg-slate-50 border-2 border-black rounded-2xl text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800">{selectedDrive.title}</div>
                    <div className="text-[10px] text-slate-400">📅 {selectedDrive.date} at {selectedDrive.time}</div>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Your Name</label>
                      <input
                        type="text"
                        required
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        placeholder="e.g. Anand Kumar"
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs text-[#1a1a1a] font-bold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Email Address</label>
                      <input
                        type="email"
                        required
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        placeholder="anand@gmail.com"
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs text-[#1a1a1a] font-bold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        placeholder="+91 98841 23456"
                        className="w-full bg-slate-50 border-2 border-black rounded-xl px-3 py-2 text-xs text-[#1a1a1a] font-bold focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedDrive(null)}
                        className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] cursor-pointer"
                      >
                        Confirm Slot
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
