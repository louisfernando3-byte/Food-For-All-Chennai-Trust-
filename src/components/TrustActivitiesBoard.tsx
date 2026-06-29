import React, { useState } from 'react';
import { 
  Utensils, 
  ShoppingBag, 
  HeartPulse, 
  GraduationCap, 
  Sparkles, 
  Flame, 
  Users, 
  TrendingUp, 
  Gift, 
  Trophy, 
  Clock, 
  UserCheck, 
  CalendarDays, 
  Award, 
  Briefcase, 
  PartyPopper, 
  Globe, 
  CheckCircle2, 
  ChevronRight, 
  Heart 
} from 'lucide-react';

export default function TrustActivitiesBoard() {
  const [activeTab, setActiveTab] = useState<'services' | 'initiatives' | 'celebrations'>('services');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const services = [
    {
      title: 'Weekly Food Distribution',
      desc: 'Warm nutritious meals prepared & distributed to street dwellers, daily wage earners, and kids.',
      icon: Utensils,
      color: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    {
      title: 'Providing Grocery Supplies',
      desc: 'Supporting single mothers, disabled individuals, and vulnerable elders with monthly dry ration kits.',
      icon: ShoppingBag,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      title: 'Medical Assistance',
      desc: 'Sponsoring essential prescription medications and regular diagnostic aid packages for elderly residents.',
      icon: HeartPulse,
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      title: 'Educational Assistance',
      desc: 'Paying school & term fees directly to institutions for children from under-privileged single-parent families.',
      icon: GraduationCap,
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      title: 'Women\'s Empowerment',
      desc: 'Providing skills training, vocational courses, and self-employment tools like sewing machines.',
      icon: Sparkles,
      color: 'bg-pink-100 text-pink-800 border-pink-300'
    },
    {
      title: 'Assisting During Disasters',
      desc: 'Swift emergency response, hot food distribution, and survival essentials during monsoon floods.',
      icon: Flame,
      color: 'bg-red-100 text-red-800 border-red-300'
    },
    {
      title: 'Promoting Participation',
      desc: 'Interactive awareness campaigns, donation drives, and active student-citizen engagement models.',
      icon: Users,
      color: 'bg-teal-100 text-teal-800 border-teal-300'
    },
    {
      title: 'Income for Single Parents',
      desc: 'Financial capability building, micro-credit support, and domestic craft startup channels.',
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    }
  ];

  const initiatives = [
    {
      title: 'Dhanam',
      desc: 'Direct donation mobilization of food, groceries, books, dresses, children\'s toys, and home articles.',
      icon: Gift,
      color: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      title: 'Weekly Challenge',
      desc: 'Impact milestones pushing citizens to volunteer, distribute food, or sponsor specific colony targets.',
      icon: Trophy,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    {
      title: '6AM Initiative',
      desc: 'Early morning hot tea and healthy breakfast drives for municipal street sweeps and sanitation workers.',
      icon: Clock,
      color: 'bg-sky-100 text-sky-800 border-sky-300'
    },
    {
      title: 'Karpipom Penmagalai',
      desc: 'Sponsor the high-school & college term fees of girl children to promote academic excellence.',
      icon: UserCheck,
      color: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    {
      title: 'Monthly Pledge',
      desc: 'A sustainable commitments channel for regular trust supporters to guarantee baseline grain supply.',
      icon: CalendarDays,
      color: 'bg-teal-100 text-teal-800 border-teal-300'
    },
    {
      title: 'Mission Pink',
      desc: 'Targeted empowerment drives for domestic helpers, tailors, weavers, and unorganized women groups.',
      icon: Sparkles,
      color: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300'
    },
    {
      title: 'FEES Program',
      desc: 'Focused cycle of Food, Education, Employment, and ultimate long-term societal Success.',
      icon: Award,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      title: 'Internships',
      desc: 'Engaging Chennai\'s youth with field-intensive social work, leadership training, and NGO management.',
      icon: Briefcase,
      color: 'bg-violet-100 text-violet-800 border-violet-300'
    }
  ];

  const celebrations = [
    {
      title: 'CASLO Celebration',
      desc: '"Caring, Sharing is Love" - Community celebration and special festive lunch spreads at orphanages.',
      icon: Heart,
      color: 'bg-red-100 text-red-800 border-red-300'
    },
    {
      title: 'Women\'s Day Celebration',
      desc: 'Honoring stellar community leaders, hosting menstrual hygiene programs, and issuing tailoring toolkits.',
      icon: Sparkles,
      color: 'bg-pink-100 text-pink-800 border-pink-300'
    },
    {
      title: 'NGO Anniversary Event',
      desc: 'Annual transparent trust audit townhall, honoring field coordinators and volunteer stars.',
      icon: PartyPopper,
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      title: 'World Food Day Drive',
      desc: 'Massive single-day awareness drives, dry ration donation booths, and serving 5000+ hot meals.',
      icon: Utensils,
      color: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    {
      title: 'International Volunteer Day',
      desc: 'Celebrating our backbone volunteers, campus ambassadors, and vehicle grid coordinators.',
      icon: Users,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    {
      title: 'World NGO Day Forum',
      desc: 'Hosting policy brainstorms, public grievance redressal panels, and collaborative social work desks.',
      icon: Globe,
      color: 'bg-cyan-100 text-cyan-800 border-cyan-300'
    },
    {
      title: 'Anbin Oli (Diwali Light)',
      desc: 'Distributing new festival dresses, sweets, crackers, and grocery kits to families in Vyasarpadi.',
      icon: Flame,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    {
      title: 'Share & Care Fest',
      desc: 'Christmas and New Year celebratory spreads, winter wear distributions, and kids toy boxes.',
      icon: Gift,
      color: 'bg-green-100 text-green-800 border-green-300'
    }
  ];

  const currentList = 
    activeTab === 'services' ? services : 
    activeTab === 'initiatives' ? initiatives : celebrations;

  return (
    <div className="bg-white border-2 border-black rounded-3xl p-5 shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b-2 border-black/5 pb-3">
        <div className="space-y-0.5">
          <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest bg-[#c2410c] text-white border border-black rounded">
            Official Trust Core
          </span>
          <h4 className="font-display font-black text-[#1a1a1a] text-sm uppercase tracking-wide">
            Our Commitment Towards Humanity
          </h4>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 border-2 border-black rounded-2xl">
        {(['services', 'initiatives', 'celebrations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#1a1a1a] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-black'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            {tab === 'services' ? '💼 Services' : tab === 'initiatives' ? '🌟 Initiatives' : '🎉 Celebrations'}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
        {currentList.map((item, idx) => {
          const IconComponent = item.icon;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.title}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="p-3.5 bg-[#fdfcfb] rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-start gap-3"
            >
              <div className={`p-2 rounded-xl border border-black shrink-0 ${item.color}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h5 className="font-display font-black text-xs text-[#1a1a1a] uppercase tracking-wide leading-snug">
                  {item.title}
                </h5>
                <p className="text-[10px] text-gray-600 font-bold leading-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Static Footer Quote */}
      <div className="text-center pt-2 border-t-2 border-dashed border-black/10">
        <p className="text-[9px] text-gray-500 font-black tracking-widest uppercase italic">
          "We serve with compassion. We uplift lives with dignity."
        </p>
      </div>
    </div>
  );
}
