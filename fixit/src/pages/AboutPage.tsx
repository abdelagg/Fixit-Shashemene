import React from 'react';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Heart,
  ArrowRight
} from 'lucide-react';
import { SHASHEMENE_NEIGHBORHOODS } from '../data/shashemeneData';

interface AboutPageProps {
  onNavigate: (view: string) => void;
  onOpenAiAssistant: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenAiAssistant }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 text-[#F5F5F7]">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30 text-xs font-bold">
          <Wrench className="w-3.5 h-3.5" />
          <span>FixIt Shashemene Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Empowering Local Trades & Skilled Youth in Shashemene
        </h1>
        <p className="text-sm sm:text-base text-white/60 leading-relaxed">
          FixIt Shashemene was designed as an authentic community-first service marketplace connecting households and small business owners in Shashemene with verified local plumbers, electricians, mechanics, and technicians.
        </p>
      </div>

      {/* Pillars Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[32px] bg-[#141414] border border-white/10 shadow-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">Admin Verified Credibility</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Eliminates the uncertainty of random roadside contractors. Every tradesperson is manually verified by FixIt administrators before being published in public directory searches.
          </p>
        </div>

        <div className="p-6 rounded-[32px] bg-[#141414] border border-white/10 shadow-2xl space-y-3 bento-glow-orange">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">Automated Problem Diagnostics</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Users don't need technical jargon. Describe symptoms in your own words or upload a photo, and the system categorizes the problem, estimates urgency, and ranks matching specialists.
          </p>
        </div>

        <div className="p-6 rounded-[32px] bg-[#141414] border border-white/10 shadow-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-950/60 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">Hyperlocal Proximity</h3>
          <p className="text-xs text-white/60 leading-relaxed">
            Covers Arada, Awasho, Bole, Dida, Melka Oda, Furi, Abosto, and Kuyera Road. Calculate realistic transit distance so workers reach you promptly.
          </p>
        </div>
      </div>

      {/* Neighborhoods coverage banner */}
      <div className="bg-[#141414] border border-white/10 rounded-[32px] p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FF5C00] flex items-center justify-center text-black">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Full Shashemene Coverage</h2>
            <p className="text-xs text-white/50">Available across all sub-cities and residential sectors</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {SHASHEMENE_NEIGHBORHOODS.map((n) => (
            <div key={n.name} className="p-3.5 rounded-2xl bg-[#1C1C1E] border border-white/5 space-y-0.5">
              <div className="font-bold text-[#FF5C00]">{n.name}</div>
              <div className="text-[11px] text-white/40">{n.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-6 space-y-4">
        <h3 className="text-2xl font-extrabold text-white">Ready to try FixIt Shashemene?</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('workers')}
            className="px-6 py-3 rounded-2xl bg-white hover:bg-white/90 text-black font-extrabold text-xs sm:text-sm shadow-xl transition flex items-center gap-2 cursor-pointer"
          >
            <span>Browse Local Workers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenAiAssistant}
            className="px-6 py-3 rounded-2xl bg-[#1C1C1E] hover:bg-[#242426] text-[#FF5C00] font-bold text-xs sm:text-sm transition flex items-center gap-2 border border-[#FF5C00]/30 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Problem Diagnosis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
