/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Search, Info, TrendingUp, DollarSign, Calendar, ExternalLink, ArrowRightLeft } from 'lucide-react';
import { FinancialDonation, SupportCategory } from '../types';

interface TrustLedgerViewProps {
  donations: FinancialDonation[];
  metrics: {
    totalFinancialReceived: number;
    mealsDistributed: number;
    studentsSustained: number;
    groceryKitsDistributed: number;
    medicalConsultations: number;
    clothesDistributed: number;
    successfulEmployments: number;
  };
}

export default function TrustLedgerView({ donations, metrics }: TrustLedgerViewProps) {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [activeChartSector, setActiveChartSector] = useState<number | null>(null);

  // Sector allocations for the chart
  const sectors = [
    { name: 'Food Programs', percentage: 45, color: '#10b981', category: 'Food', count: metrics.mealsDistributed, unit: 'Meals served' },
    { name: 'Educational Kits', percentage: 25, color: '#f59e0b', category: 'Education', count: metrics.studentsSustained, unit: 'Students sponsored' },
    { name: 'Grocery Support', percentage: 15, color: '#0ea5e9', category: 'Groceries', count: metrics.groceryKitsDistributed, unit: 'Family packs distributed' },
    { name: 'Medical & Sanjeevani', percentage: 10, color: '#ec4899', category: 'Medical Aid', count: metrics.medicalConsultations, unit: 'Elderly care packs' },
    { name: 'Vastra Uniforms', percentage: 5, color: '#8b5cf6', category: 'Dresses', count: metrics.clothesDistributed, unit: 'Uniforms/dresses gifted' },
  ];

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(search.toLowerCase()) ||
      d.transactionHash.toLowerCase().includes(search.toLowerCase()) ||
      (d.message && d.message.toLowerCase().includes(search.toLowerCase()));

    const matchesSector =
      selectedSector === 'All' ||
      (selectedSector === 'General' && d.category === 'General') ||
      (d.category === selectedSector);

    return matchesSearch && matchesSector;
  });

  // Calculate coordinates for SVG Donut Chart
  let accumulatedAngle = 0;
  const radius = 60;
  const strokeWidth = 14;
  const center = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-6">
      {/* 100% Direct-Aid Guarantee Panel */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-500/30 text-white flex items-start gap-4 shadow-lg shadow-emerald-950/20">
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20 relative shrink-0">
          <ShieldCheck className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div className="space-y-1">
          <h3 className="font-display font-bold text-sm tracking-wide uppercase">100% Direct-Aid Policy</h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            Food For All Chennai Trust guarantees that <span className="font-bold text-emerald-300">100% of your contributions</span> are used directly to purchase meals, kits, and medicines. Board administration and overhead costs are covered entirely by our trustees.
          </p>
        </div>
      </div>

      {/* Trust Ledger Interactive Chart */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
        <div>
          <h4 className="font-display font-bold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Fund Utilization Chart
          </h4>
          <p className="text-[11px] text-slate-500">Hover over slices to review exact direct aid outcomes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* SVG Donut Chart */}
          <div className="flex justify-center relative">
            <svg width="180" height="180" viewBox="0 0 160 160" className="transform -rotate-90">
              <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
              {sectors.map((sector, index) => {
                const strokeDashOffset = circumference - (sector.percentage / 100) * circumference;
                const strokeDashArray = `${circumference} ${circumference}`;
                const rotationAngle = (accumulatedAngle * 360) / 100;
                accumulatedAngle += sector.percentage;

                const isHovered = activeChartSector === index;

                return (
                  <circle
                    key={sector.name}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={sector.color}
                    strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                    strokeDasharray={strokeDashArray}
                    strokeDashoffset={strokeDashOffset}
                    transform={`rotate(${rotationAngle} ${center} ${center})`}
                    className="transition-all duration-300 cursor-pointer origin-center"
                    onMouseEnter={() => setActiveChartSector(index)}
                    onMouseLeave={() => setActiveChartSector(null)}
                  />
                );
              })}
            </svg>

            {/* Inner text inside donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {activeChartSector !== null ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <span className="text-xl font-display font-extrabold text-slate-900">
                    {sectors[activeChartSector].percentage}%
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">
                    {sectors[activeChartSector].category}
                  </p>
                </motion.div>
              ) : (
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Ledger</span>
                  <p className="text-lg font-display font-extrabold text-emerald-600">₹{metrics.totalFinancialReceived.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend Details */}
          <div className="space-y-2.5">
            {sectors.map((sector, index) => (
              <div
                key={sector.name}
                onMouseEnter={() => setActiveChartSector(index)}
                onMouseLeave={() => setActiveChartSector(null)}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  activeChartSector === index
                    ? 'border-slate-200 bg-slate-50/80 translate-x-1 shadow-sm'
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sector.color }} />
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{sector.name}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {sector.count.toLocaleString('en-IN')} {sector.unit}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-display font-extrabold text-slate-900">{sector.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table Feed */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-sm tracking-wide uppercase flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600" /> Live Audited Transaction Log
            </h4>
            <p className="text-[11px] text-slate-400">Search ledger hashes to verify community delivery.</p>
          </div>
          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 w-full sm:w-48 text-xs text-slate-600">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search donor / hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full placeholder:text-slate-400 text-xs"
            />
          </div>
        </div>

        {/* Categories Quick Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {['All', 'Food', 'Education', 'Groceries', 'Medical Aid', 'Dresses', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedSector(cat)}
              className={`px-3 py-1 rounded-full border shrink-0 transition-all cursor-pointer ${
                selectedSector === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? 'View All' : cat}
            </button>
          ))}
        </div>

        {/* Ledger list */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {filteredDonations.length > 0 ? (
            filteredDonations.map((d, idx) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(idx * 0.05, 0.4) }}
                className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-3.5 relative overflow-hidden"
              >
                {/* Visual marker of category color */}
                <span
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{
                    backgroundColor:
                      d.category === 'Food'
                        ? '#10b981'
                        : d.category === 'Education'
                        ? '#f59e0b'
                        : d.category === 'Groceries'
                        ? '#0ea5e9'
                        : d.category === 'Medical Aid'
                        ? '#ec4899'
                        : d.category === 'Dresses'
                        ? '#8b5cf6'
                        : '#64748b',
                  }}
                />

                <div className="pl-2 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-slate-800">{d.donorName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-[9px] font-mono font-medium text-slate-600 uppercase">
                      {d.category}
                    </span>
                    {d.frequency && d.frequency !== 'one-time' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase border border-emerald-300 flex items-center gap-1">
                        🔁 {d.frequency}
                      </span>
                    )}
                  </div>
                  {d.message && <p className="text-[11px] text-slate-500 italic">"{d.message}"</p>}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <span>{d.transactionHash}</span>
                    <span>•</span>
                    <span>{new Date(d.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="text-left md:text-right shrink-0">
                  <span className="font-display font-extrabold text-sm text-slate-900">
                    +₹{d.amount.toLocaleString('en-IN')}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold uppercase mt-0.5">
                    <ShieldCheck className="w-3 h-3" /> Audited Direct Aid
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
              <ArrowRightLeft className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No transactions matching your search criteria found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
