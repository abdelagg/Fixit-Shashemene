import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { WorkerProfile, ServiceCategory } from '../types';
import { WorkerCard } from '../components/WorkerCard';
import { SHASHEMENE_NEIGHBORHOODS } from '../data/shashemeneData';

interface WorkersPageProps {
  workers: (WorkerProfile & { distanceKm?: number })[];
  services: ServiceCategory[];
  initialFilters?: {
    category?: string;
    neighborhood?: string;
    search?: string;
  };
  onNavigate: (view: string, data?: any) => void;
  onSelectWorker: (worker: WorkerProfile) => void;
  onOpenAiAssistant: () => void;
}

export const WorkersPage: React.FC<WorkersPageProps> = ({
  workers,
  services,
  initialFilters,
  onNavigate,
  onSelectWorker,
  onOpenAiAssistant
}) => {
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [category, setCategory] = useState(initialFilters?.category || 'All');
  const [neighborhood, setNeighborhood] = useState(initialFilters?.neighborhood || 'All');
  const [minRating, setMinRating] = useState<number>(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'experience' | 'jobs'>('distance');

  // Filter approved workers only for public search
  const approvedWorkers = useMemo(() => {
    return workers.filter((w) => w.verificationStatus === 'approved');
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    return approvedWorkers.filter((worker) => {
      // 1. Search Query
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        worker.name.toLowerCase().includes(q) ||
        worker.serviceCategory.toLowerCase().includes(q) ||
        worker.description.toLowerCase().includes(q) ||
        worker.neighborhood.toLowerCase().includes(q) ||
        worker.services.some((s) => s.toLowerCase().includes(q)) ||
        worker.skills.some((sk) => sk.toLowerCase().includes(q));

      // 2. Category
      const matchCategory =
        category === 'All' ||
        worker.serviceCategory.toLowerCase().includes(category.toLowerCase()) ||
        worker.services.some((s) => s.toLowerCase().includes(category.toLowerCase()));

      // 3. Neighborhood
      const matchNeighborhood =
        neighborhood === 'All' ||
        worker.neighborhood.toLowerCase() === neighborhood.toLowerCase();

      // 4. Rating
      const matchRating = minRating === 0 || worker.ratingAverage >= minRating;

      // 5. Availability
      const matchAvailability = !availableOnly || worker.availability.isAvailable;

      return matchSearch && matchCategory && matchNeighborhood && matchRating && matchAvailability;
    });
  }, [approvedWorkers, search, category, neighborhood, minRating, availableOnly]);

  const sortedWorkers = useMemo(() => {
    return [...filteredWorkers].sort((a, b) => {
      if (sortBy === 'distance') {
        const distA = typeof a.distanceKm === 'number' ? a.distanceKm : 99;
        const distB = typeof b.distanceKm === 'number' ? b.distanceKm : 99;
        return distA - distB;
      }
      if (sortBy === 'rating') {
        return b.ratingAverage - a.ratingAverage;
      }
      if (sortBy === 'experience') {
        return b.experienceYears - a.experienceYears;
      }
      if (sortBy === 'jobs') {
        return b.completedJobs - a.completedJobs;
      }
      return 0;
    });
  }, [filteredWorkers, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setNeighborhood('All');
    setMinRating(0);
    setAvailableOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-[#F5F5F7]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Find Verified Workers in Shashemene
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Browse and filter trusted local plumbers, electricians, mechanics, and technicians nearby
          </p>
        </div>

        <button
          onClick={onOpenAiAssistant}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1C1E] text-[#FF5C00] hover:bg-[#242426] border border-white/10 hover:border-[#FF5C00]/40 font-bold text-xs transition shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FF5C00]" />
          <span>Need help choosing? Try AI Diagnosis</span>
        </button>
      </div>

      {/* Filter & Search Bento Bar */}
      <div className="bg-[#141414] rounded-[28px] border border-white/10 p-5 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill, problem..."
              className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl pl-9 pr-3 py-2.5 outline-hidden placeholder:text-white/40 focus:border-[#FF5C00]/50 transition"
            />
          </div>

          {/* Category dropdown */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl px-3 py-2.5 outline-hidden focus:border-[#FF5C00]/50 font-medium cursor-pointer"
            >
              <option value="All" className="bg-[#141414]">All Service Categories</option>
              {services.map((s) => (
                <option key={s.id} value={s.name} className="bg-[#141414]">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Neighborhood dropdown */}
          <div>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl px-3 py-2.5 outline-hidden focus:border-[#FF5C00]/50 font-medium cursor-pointer"
            >
              <option value="All" className="bg-[#141414]">All Neighborhoods in Shashemene</option>
              {SHASHEMENE_NEIGHBORHOODS.map((n) => (
                <option key={n.name} value={n.name} className="bg-[#141414]">
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl px-3 py-2.5 outline-hidden focus:border-[#FF5C00]/50 font-medium cursor-pointer"
            >
              <option value="distance" className="bg-[#141414]">Sort by: Nearest Distance</option>
              <option value="rating" className="bg-[#141414]">Sort by: Highest Rating</option>
              <option value="experience" className="bg-[#141414]">Sort by: Most Experience</option>
              <option value="jobs" className="bg-[#141414]">Sort by: Most Completed Jobs</option>
            </select>
          </div>
        </div>

        {/* Second row: Rating filter & Available Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-white/50">Min Rating:</span>
            {[
              { label: 'Any', value: 0 },
              { label: '4.5+ ⭐', value: 4.5 },
              { label: '4.8+ ⭐', value: 4.8 }
            ].map((r) => (
              <button
                key={r.label}
                type="button"
                onClick={() => setMinRating(r.value)}
                className={`px-3 py-1 rounded-xl transition font-bold cursor-pointer ${
                  minRating === r.value
                    ? 'bg-white text-black'
                    : 'bg-[#1C1C1E] hover:bg-[#242426] text-white/70 hover:text-white border border-white/5'
                }`}
              >
                {r.label}
              </button>
            ))}

            <label className="flex items-center gap-2 cursor-pointer ml-2 bg-[#1C1C1E] px-3 py-1 rounded-xl border border-white/5">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-[#FF5C00] rounded-sm border-white/20 bg-black focus:ring-[#FF5C00]"
              />
              <span className="font-bold text-white/80">🟢 Available Now Only</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/40 font-medium">
              Showing {sortedWorkers.length} verified worker{sortedWorkers.length === 1 ? '' : 's'}
            </span>

            {(search || category !== 'All' || neighborhood !== 'All' || minRating > 0 || availableOnly) && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workers Grid */}
      {sortedWorkers.length === 0 ? (
        <div className="p-12 text-center bg-[#141414] rounded-[28px] border border-dashed border-white/10 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] text-white/40 flex items-center justify-center mx-auto border border-white/5">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">No matching workers found</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto">
            Try adjusting your search criteria, selecting a different neighborhood, or submit a general request to notify all Shashemene tradespeople.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#1C1C1E] hover:bg-[#242426] text-white/80 rounded-xl text-xs font-bold border border-white/10"
            >
              Clear Filters
            </button>
            <button
              onClick={() => onNavigate('new-request')}
              className="px-4 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-extrabold flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post General Service Request</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onSelectWorker={onSelectWorker}
              onViewProfile={(id) => onNavigate('worker-profile', { workerId: id })}
              onQuickMessage={(w) => onNavigate('new-request', { preselectedWorkerId: w.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
};
