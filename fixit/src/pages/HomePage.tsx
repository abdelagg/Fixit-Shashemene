import React, { useState } from 'react';
import {
  Search,
  Wrench,
  Zap,
  Hammer,
  Car,
  Smartphone,
  Laptop,
  Paintbrush,
  Sparkles,
  ShieldCheck,
  MapPin,
  Star,
  CheckCircle2,
  ArrowRight,
  Clock,
  ThumbsUp,
  Users,
  ChevronRight
} from 'lucide-react';
import { WorkerProfile, ServiceCategory } from '../types';
import { WorkerCard } from '../components/WorkerCard';
import { SHASHEMENE_NEIGHBORHOODS } from '../data/shashemeneData';

interface HomePageProps {
  workers: (WorkerProfile & { distanceKm?: number })[];
  services: ServiceCategory[];
  onNavigate: (view: string, data?: any) => void;
  onOpenAiAssistant: () => void;
  onSelectWorker: (worker: WorkerProfile) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  workers,
  services,
  onNavigate,
  onOpenAiAssistant,
  onSelectWorker
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('workers', { search: searchQuery, neighborhood: selectedNeighborhood });
  };

  const popularServices = [
    { name: 'Plumbing', icon: Wrench, count: '14 plumbers' },
    { name: 'Electrical', icon: Zap, count: '11 electricians' },
    { name: 'Car Mechanic', icon: Car, count: '9 mechanics' },
    { name: 'Phone Repair', icon: Smartphone, count: '16 technicians' },
    { name: 'Computer Repair', icon: Laptop, count: '8 technicians' },
    { name: 'Carpentry', icon: Hammer, count: '7 carpenters' },
    { name: 'Painting', icon: Paintbrush, count: '6 painters' }
  ];

  const approvedWorkers = workers.filter((w) => w.verificationStatus === 'approved').slice(0, 4);

  return (
    <div className="space-y-16 pb-16 text-[#F5F5F7]">
      {/* Hero Bento Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#FF5C00]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1C1E] border border-white/10 text-white/80 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
            <span>Serving All Shashemene Neighborhoods</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Need a trusted worker in <span className="text-[#FF5C00]">Shashemene</span>?
          </h1>

          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
            Find verified plumbers, electricians, mechanics, and technicians nearby. Describe your problem, get instant AI recommendations, and track job progress in real-time.
          </p>

          {/* Large Bento Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-[#141414] p-2 rounded-[24px] shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/10"
          >
            <div className="flex items-center gap-2 flex-1 px-3 w-full">
              <Search className="w-4 h-4 text-white/40 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you need help with? (e.g., Leaking pipe, Toyota won't start)"
                className="w-full text-xs sm:text-sm text-white placeholder:text-white/40 outline-hidden py-2 bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="text-xs bg-[#1C1C1E] text-white/80 font-medium px-3 py-2.5 rounded-xl outline-hidden border border-white/10 w-full sm:w-auto cursor-pointer"
              >
                <option value="All">All Neighborhoods</option>
                {SHASHEMENE_NEIGHBORHOODS.map((n) => (
                  <option key={n.name} value={n.name} className="bg-[#141414] text-white">
                    {n.name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 font-bold text-xs sm:text-sm text-black transition shrink-0 shadow-md cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Search suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/60">
            <span className="text-white/40 text-[11px]">Popular:</span>
            {['Fix leaking pipe', "Toyota won't start", 'Phone screen cracked', 'Breaker tripping', 'Laptop slow'].map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate('workers', { search: tag })}
                className="px-3 py-1 rounded-full bg-[#141414] hover:bg-[#1C1C1E] border border-white/10 text-white/70 hover:text-white transition text-[11px] cursor-pointer"
              >
                "{tag}"
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('workers')}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-white/90 text-black font-extrabold text-sm shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <span>Find a Worker</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="px-5 py-3 rounded-2xl bg-[#1C1C1E] hover:bg-[#242426] text-[#FF5C00] font-bold text-sm border border-white/10 hover:border-[#FF5C00]/40 shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FF5C00]" />
              <span>AI Problem Diagnosis</span>
            </button>

            <button
              onClick={() => onNavigate('register')}
              className="px-5 py-3 rounded-2xl bg-[#141414] hover:bg-[#1C1C1E] text-white/80 hover:text-white font-semibold text-sm border border-white/10 transition cursor-pointer"
            >
              I'm a Worker in Shashemene
            </button>
          </div>
        </div>
      </section>

      {/* Popular Service Categories Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Popular Local Services
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-1">
              Experienced tradespeople available across Shashemene
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs sm:text-sm font-bold text-[#FF5C00] hover:text-[#ff7826] flex items-center gap-1 cursor-pointer"
          >
            <span>View all 15+ services</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {popularServices.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onNavigate('workers', { category: cat.name })}
                className="p-4 rounded-[22px] bg-[#141414] border border-white/10 hover:border-white/20 hover:bg-[#18181A] transition text-center flex flex-col items-center justify-center gap-2.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] text-[#FF5C00] flex items-center justify-center group-hover:scale-105 group-hover:bg-[#FF5C00] group-hover:text-black transition border border-white/5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#F5F5F7] group-hover:text-white transition">
                    {cat.name}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">{cat.count}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* AI Instant Helper Bento Feature Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-[32px] bg-[#141414] text-white p-6 sm:p-10 relative overflow-hidden border border-white/10 shadow-2xl bento-glow-orange">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1E] text-[#FF5C00] text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic Engine</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Not sure what tradesperson you need?
            </h3>

            <p className="text-sm text-white/60 leading-relaxed">
              Describe your problem in plain words (e.g. <em>"Water leaking from wall"</em> or <em>"Car squeaking when braking"</em>) or upload a photo. FixIt will diagnose the issue and match you with the best nearby specialist.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAiAssistant}
                className="px-6 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#ff7826] text-black font-extrabold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Try AI Problem Diagnosis</span>
              </button>

              <button
                onClick={() => onNavigate('new-request')}
                className="px-5 py-2.5 rounded-xl bg-[#1C1C1E] hover:bg-[#242426] text-white font-semibold text-xs sm:text-sm transition border border-white/10 cursor-pointer"
              >
                Create Request Manually
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How FixIt Shashemene Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How FixIt Works
          </h2>
          <p className="text-xs sm:text-sm text-white/50">
            Simple 5-step local service matching built specifically for Shashemene
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            {
              step: '01',
              title: 'Describe Problem',
              desc: 'Explain the issue in plain words or upload a photo.'
            },
            {
              step: '02',
              title: 'Find Workers',
              desc: 'AI matches verified workers nearby with real reviews.'
            },
            {
              step: '03',
              title: 'Send Request',
              desc: 'Choose your preferred worker and submit details.'
            },
            {
              step: '04',
              title: 'Get It Fixed',
              desc: 'Worker accepts, chats, arrives, and solves the problem.'
            },
            {
              step: '05',
              title: 'Rate & Review',
              desc: 'Leave honest ratings to keep Shashemene trusted.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-[24px] bg-[#141414] border border-white/10 shadow-lg relative flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#1C1C1E] border border-white/10 text-[#FF5C00] font-mono font-bold text-xs flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <h4 className="font-bold text-sm text-white">{item.title}</h4>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verified Workers in Shashemene */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Featured Verified Workers
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-1">
              Top-rated local tradespeople in Arada, Awasho, Bole, and Kuyera Road
            </p>
          </div>
          <button
            onClick={() => onNavigate('workers')}
            className="text-xs sm:text-sm font-bold text-[#FF5C00] hover:text-[#ff7826] flex items-center gap-1 cursor-pointer"
          >
            <span>See all workers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {approvedWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onSelectWorker={onSelectWorker}
              onViewProfile={(id) => onNavigate('worker-profile', { workerId: id })}
            />
          ))}
        </div>
      </section>

      {/* Trust & Community Guarantee Bento Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#141414] rounded-[32px] p-8 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1C1C1E]/60 border border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 text-[#FF5C00] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Admin Verified Profiles</h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Every worker profile is reviewed by FixIt admin before appearing in public searches.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1C1C1E]/60 border border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 text-[#FF5C00] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Real Completed Job Reviews</h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Only verified customers who completed a job can leave reviews, preventing fake ratings.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#1C1C1E]/60 border border-white/5">
            <div className="w-10 h-10 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 text-[#FF5C00] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Local Neighborhood Matching</h4>
              <p className="text-xs text-white/50 mt-1 leading-relaxed">
                Matches by real distance in Shashemene so workers reach your house or shop quickly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
