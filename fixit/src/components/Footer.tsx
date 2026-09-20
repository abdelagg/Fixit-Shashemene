import React from 'react';
import { Wrench, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { SHASHEMENE_NEIGHBORHOODS } from '../data/shashemeneData';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAiAssistant: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAiAssistant }) => {
  return (
    <footer id="main-footer" className="bg-[#0A0A0A] text-white/70 border-t border-white/10 mt-16">
      {/* Local Coverage Bar */}
      <div className="border-b border-white/5 py-6 px-4 sm:px-6 bg-[#141414]/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 text-[#FF5C00] shrink-0" />
            <span className="font-bold text-xs uppercase tracking-wider text-white/90">Active Neighborhoods in Shashemene:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {SHASHEMENE_NEIGHBORHOODS.map((n) => (
              <button
                key={n.name}
                onClick={() => onNavigate('workers')}
                className="px-3 py-1 rounded-xl bg-[#1C1C1E] hover:bg-[#242426] text-white/70 hover:text-white text-xs transition border border-white/5 hover:border-white/20 cursor-pointer"
              >
                {n.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Purpose */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF5C00] flex items-center justify-center text-black font-extrabold shadow-md">
                <Wrench className="w-4 h-4 transform -rotate-45" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">FixIt Shashemene</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Connecting Shashemene households and businesses with verified, nearby tradespeople. From leaking pipes in Arada to car troubleshooting near Kuyera Road.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#FF5C00] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Verified Profiles & Real Reviews</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-3">Popular Services</h3>
            <ul className="space-y-2.5 text-xs text-white/50">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  🚰 Plumbing & Water Tanks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  ⚡ House Wiring & Solar
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  🚗 Toyota & Auto Mechanics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  📱 Phone Screen & Battery Fix
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  💻 Laptop & Windows Setup
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition cursor-pointer">
                  ❄️ Refrigerator & Washer Repair
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-3">Platform</h3>
            <ul className="space-y-2.5 text-xs text-white/50">
              <li>
                <button onClick={() => onNavigate('workers')} className="hover:text-white transition cursor-pointer">
                  Browse All Workers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('new-request')} className="hover:text-white transition cursor-pointer">
                  Post a Service Request
                </button>
              </li>
              <li>
                <button onClick={onOpenAiAssistant} className="text-[#FF5C00] hover:text-[#ff7826] font-semibold transition flex items-center gap-1 cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5" /> AI Problem Diagnosis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('register')} className="hover:text-white transition cursor-pointer">
                  Join as a Worker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition cursor-pointer">
                  How FixIt Works
                </button>
              </li>
            </ul>
          </div>

          {/* Shashemene Local Trust Card */}
          <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5C00]" />
              <span>Community Grounded</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Designed specifically for Shashemene's neighborhoods, local pricing norms, and direct mobile contact.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="w-full py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition text-center"
              >
                Learn More About FixIt
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <div>© {new Date().getFullYear()} FixIt Shashemene. All local rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Arada • Awasho • Bole • Abosto • Kuyera</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
