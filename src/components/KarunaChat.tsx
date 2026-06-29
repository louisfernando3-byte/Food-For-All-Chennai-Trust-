/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, MessageSquare, Heart, FileText, ArrowRight, User } from 'lucide-react';
import { ChatMessage } from '../types';

interface KarunaChatProps {
  onSuggestCampaign: (campaignId: string, category: string) => void;
  onSuggestNeedDraft: (draft: {
    category: string;
    title: string;
    description: string;
    location: string;
    beneficiaryName: string;
    urgency: 'Low' | 'Medium' | 'High';
  }) => void;
}

export default function KarunaChat({ onSuggestCampaign, onSuggestNeedDraft }: KarunaChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Vanakkam! 🙏 I am **Karuna AI** (Compassion Assistant), your guide to Food For All Chennai. \n\nI can help you: \n1. **Donate item collections** (e.g., clothes, rice, books)\n2. **Identify where aid goes** and transparent funding \n3. **Draft a need request** for someone in need in Chennai\n\nHow can I help you create hope today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedAction, setSuggestedAction] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsgText = input;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: userMsgText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setSuggestedAction(null);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!res.ok) throw new Error('API server error');

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: data.text || "I appreciate your response. How else can I assist you with Chennai Trust?",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.actionItem) {
        setSuggestedAction(data.actionItem);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'model',
          text: "Vanakkam! I hit a temporary network hiccup, but my passion to serve remains. Could you please repeat that, or tell me how you would like to help today?",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = () => {
    if (!suggestedAction) return;

    if (suggestedAction.type === 'suggest_campaign') {
      onSuggestCampaign(suggestedAction.campaignId, suggestedAction.category);
    } else if (suggestedAction.type === 'suggest_need_draft') {
      // Draft can come as SuggestedNeed or draftNeed
      const draft = suggestedAction.draftNeed || {
        category: suggestedAction.category || 'Food',
        title: suggestedAction.suggestedTitle || 'Help Needed',
        description: 'Need formulated by helper.',
        location: 'Chennai, TN',
        beneficiaryName: 'Local Resident',
        urgency: 'Medium',
      };
      onSuggestNeedDraft(draft);
    }
    setSuggestedAction(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Head */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center relative">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-display font-bold text-sm tracking-wide text-white">KARUNA AI</h3>
            <p className="text-xs text-slate-400">Compassion Advisor • Live</p>
          </div>
        </div>
        <div className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono font-medium text-emerald-400 uppercase tracking-widest">
          Gemini Supported
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                m.role === 'user'
                  ? 'bg-slate-800 border-slate-700 text-emerald-400'
                  : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Heart className="w-4 h-4 fill-emerald-500/20" />}
            </div>
            <div
              className={`rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center shrink-0 text-emerald-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-1 font-mono text-[10px]">Karuna is matching needs...</span>
            </div>
          </div>
        )}

        <AnimatePresence>
          {suggestedAction && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-900/40 space-y-3 shadow-xl"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  {suggestedAction.type === 'suggest_campaign' ? <Heart className="w-4 h-4 fill-emerald-500/10" /> : <FileText className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {suggestedAction.type === 'suggest_campaign' ? 'Sponsorship Recommendation' : 'Suggested Aid Request Draft'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {suggestedAction.type === 'suggest_campaign'
                      ? `Support our live ${suggestedAction.category} campaign instantly.`
                      : `Karuna drafted a community need card for ${suggestedAction.draftNeed?.location || 'Chennai'}.`}
                  </p>
                </div>
              </div>

              {suggestedAction.type === 'suggest_need_draft' && suggestedAction.draftNeed && (
                <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 text-[11px] text-slate-300 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">CATEGORY:</span>
                    <span className="text-emerald-400 font-bold">{suggestedAction.draftNeed.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">TITLE:</span> {suggestedAction.draftNeed.title}
                  </div>
                  <div>
                    <span className="text-slate-500">WHERE:</span> {suggestedAction.draftNeed.location}
                  </div>
                  <div>
                    <span className="text-slate-500">FOR:</span> {suggestedAction.draftNeed.beneficiaryName}
                  </div>
                </div>
              )}

              <button
                onClick={handleActionClick}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/20"
              >
                {suggestedAction.type === 'suggest_campaign' ? 'Open Sponsorship Form' : 'Load and Review Draft Request'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Tray */}
      <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Karuna: 'How do I sponsor lunch?' or 'An old age home needs rice bags'..."
          className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-slate-200 placeholder:text-slate-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all cursor-pointer flex items-center justify-center shrink-0"
          disabled={isLoading || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
