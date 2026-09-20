import React from 'react';
import {
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  Briefcase,
  MessageSquare,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { WorkerProfile } from '../types';

interface WorkerCardProps {
  worker: WorkerProfile & { distanceKm?: number };
  onSelectWorker?: (worker: WorkerProfile) => void;
  onViewProfile?: (workerId: string) => void;
  onQuickMessage?: (worker: WorkerProfile) => void;
  compact?: boolean;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  onSelectWorker,
  onViewProfile,
  onQuickMessage,
  compact = false
}) => {
  const isAvailable = worker.availability.isAvailable;
  const isApproved = worker.verificationStatus === 'approved';

  return (
    <div
      id={`worker-card-${worker.id}`}
      className="bg-[#141414] hover:bg-[#18181A] rounded-[24px] border border-white/10 hover:border-white/20 transition-all duration-200 flex flex-col justify-between overflow-hidden group shadow-lg text-[#F5F5F7]"
    >
      <div className="p-5">
        {/* Header: Photo + Name + Availability */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={worker.profileImage}
                alt={worker.name}
                className="w-13 h-13 rounded-2xl object-cover border border-white/10 shadow-sm"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#141414] ${
                  isAvailable ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-amber-500 shadow-xs shadow-amber-500/50'
                }`}
                title={isAvailable ? 'Available Now' : 'Currently Busy'}
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-[#F5F5F7] text-sm sm:text-base group-hover:text-white transition">
                  {worker.name}
                </h3>
                {isApproved && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/30">
                    <CheckCircle2 className="w-3 h-3 text-[#FF5C00]" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-white/70 flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3 h-3 text-[#FF5C00]" />
                {worker.serviceCategory}
              </p>

              <div className="flex items-center gap-2 mt-1 text-xs text-white/50">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {worker.ratingAverage > 0 ? worker.ratingAverage.toFixed(1) : 'New'}
                </span>
                <span>({worker.reviewCount} reviews)</span>
                <span>•</span>
                <span>{worker.experienceYears} yrs exp</span>
              </div>
            </div>
          </div>

          {worker.hourlyRateBirr && (
            <div className="text-right bg-[#1C1C1E] px-2.5 py-1.5 rounded-xl border border-white/5">
              <div className="text-xs font-bold text-[#F5F5F7]">{worker.hourlyRateBirr} ETB</div>
              <div className="text-[9px] text-white/40">approx / hr</div>
            </div>
          )}
        </div>

        {/* Location and Distance */}
        <div className="mt-3.5 flex items-center justify-between text-xs bg-[#1C1C1E] px-3 py-2 rounded-xl text-white/70 border border-white/5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF5C00] shrink-0" />
            <span className="font-medium text-white/80">Shashemene, {worker.neighborhood}</span>
          </div>
          {typeof worker.distanceKm === 'number' && (
            <span className="text-[#FF5C00] font-bold text-[10px] bg-[#FF5C00]/10 px-2 py-0.5 rounded-md border border-[#FF5C00]/20">
              {worker.distanceKm} km away
            </span>
          )}
        </div>

        {/* Short Bio */}
        {!compact && (
          <p className="mt-3 text-xs text-white/60 line-clamp-2 leading-relaxed">
            {worker.description}
          </p>
        )}

        {/* Service tags */}
        {!compact && worker.services && worker.services.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {worker.services.slice(0, 3).map((srv, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-[#1C1C1E] text-white/70 font-medium px-2 py-0.5 rounded-lg border border-white/5"
              >
                {srv}
              </span>
            ))}
            {worker.services.length > 3 && (
              <span className="text-[10px] text-white/30 self-center">
                +{worker.services.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="px-5 py-3 bg-[#1C1C1E]/50 border-t border-white/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onViewProfile && (
            <button
              onClick={() => onViewProfile(worker.id)}
              className="text-xs font-bold text-white/70 hover:text-white transition cursor-pointer"
            >
              View Profile
            </button>
          )}

          {onQuickMessage && (
            <button
              onClick={() => onQuickMessage(worker)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Send Message"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
        </div>

        {onSelectWorker && (
          <button
            onClick={() => onSelectWorker(worker)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-white/90 shadow-sm transition cursor-pointer"
          >
            <span>Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
