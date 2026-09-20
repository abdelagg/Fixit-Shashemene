import React from 'react';
import {
  Clock,
  CheckCircle2,
  Truck,
  Wrench,
  Star,
  XCircle,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { ServiceRequest, JobStatus, UserRole } from '../types';

interface JobTimelineProps {
  request: ServiceRequest;
  currentUserRole: UserRole;
  onUpdateStatus: (newStatus: JobStatus, extra?: any) => Promise<void>;
  onOpenChat: (request: ServiceRequest) => void;
  onOpenReviewModal: (request: ServiceRequest) => void;
  onCancelRequest?: (request: ServiceRequest) => void;
}

export const JobTimeline: React.FC<JobTimelineProps> = ({
  request,
  currentUserRole,
  onUpdateStatus,
  onOpenChat,
  onOpenReviewModal,
  onCancelRequest
}) => {
  const steps = [
    { key: 'requested', label: 'Requested', icon: Clock },
    { key: 'accepted', label: 'Accepted', icon: CheckCircle2 },
    { key: 'on_the_way', label: 'On The Way', icon: Truck },
    { key: 'in_progress', label: 'In Progress', icon: Wrench },
    { key: 'completed', label: 'Completed', icon: Star }
  ];

  const getStepIndex = (status: JobStatus) => {
    switch (status) {
      case 'requested':
      case 'pending':
        return 0;
      case 'accepted':
        return 1;
      case 'on_the_way':
        return 2;
      case 'in_progress':
        return 3;
      case 'completed':
        return 4;
      default:
        return -1;
    }
  };

  const currentIndex = getStepIndex(request.status);
  const isCancelled = request.status === 'cancelled' || request.status === 'rejected';

  return (
    <div id={`job-timeline-${request.id}`} className="bg-[#141414] rounded-[28px] border border-white/10 p-6 shadow-xl space-y-4 text-[#F5F5F7]">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C00] bg-[#FF5C00]/15 px-2.5 py-0.5 rounded-lg border border-[#FF5C00]/30">
              {request.serviceCategory}
            </span>
            <span className="text-xs text-white/40 font-mono">ID: #{request.id.slice(-6)}</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
              request.urgency === 'high' || request.urgency === 'emergency'
                ? 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                : request.urgency === 'medium'
                ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                : 'bg-blue-950/60 text-blue-400 border-blue-500/30'
            }`}>
              {request.urgency.toUpperCase()} Urgency
            </span>
          </div>

          <h3 className="font-bold text-white text-lg mt-2">{request.title}</h3>
          <p className="text-xs text-white/50 mt-0.5">
            📍 Shashemene, {request.location.neighborhood} • {new Date(request.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Counterparty badge */}
        <div className="flex items-center gap-3 bg-[#1C1C1E] p-3 rounded-2xl border border-white/10">
          <img
            src={currentUserRole === 'worker' ? (request.customerImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150') : (request.workerImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150')}
            alt="Party"
            className="w-10 h-10 rounded-xl object-cover border border-white/10"
          />
          <div className="text-xs">
            <div className="text-white/40 text-[10px]">
              {currentUserRole === 'worker' ? 'Customer' : 'Assigned Worker'}
            </div>
            <div className="font-bold text-white">
              {currentUserRole === 'worker' ? request.customerName : (request.workerName || 'Awaiting Worker')}
            </div>
            <div className="text-[11px] text-white/50 font-mono">
              {currentUserRole === 'worker' ? request.customerPhone : (request.workerPhone || 'Shashemene Local')}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Stepper */}
      {!isCancelled ? (
        <div className="py-5">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto px-2">
            {/* Progress line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-[#1C1C1E] z-0">
              <div
                className="h-full bg-[#FF5C00] transition-all duration-500 shadow-sm shadow-[#FF5C00]/50"
                style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={step.key} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all shadow-md ${
                      isPast
                        ? 'bg-white text-black'
                        : isCurrent
                        ? 'bg-[#FF5C00] text-black ring-4 ring-[#FF5C00]/20 animate-pulse'
                        : 'bg-[#1C1C1E] border border-white/10 text-white/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-2 ${
                      isCurrent
                        ? 'text-[#FF5C00]'
                        : isPast
                        ? 'text-white'
                        : 'text-white/30'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="my-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            This job was {request.status}. {request.cancellationReason && `Reason: ${request.cancellationReason}`}
          </span>
        </div>
      )}

      {/* Description & Details */}
      <div className="bg-[#1C1C1E] rounded-2xl p-4 text-xs text-white/80 space-y-2 border border-white/5">
        <div>
          <span className="font-bold text-white">Problem Details: </span>
          <span className="text-white/70">{request.description}</span>
        </div>

        {request.aiAnalysis && (
          <div className="pt-2 border-t border-white/10 text-[11px] text-white/60 flex items-center gap-2">
            <span className="font-bold text-[#FF5C00]">AI Diagnosis:</span>
            <span>{request.aiAnalysis.problem}</span>
            <span className="text-white/40">({Math.round(request.aiAnalysis.confidence * 100)}% match)</span>
          </div>
        )}

        {request.priceEstimateBirr && (
          <div className="text-[11px] font-semibold text-white/90">
            Estimated Cost: <span className="text-[#FF5C00] font-bold">{request.priceEstimateBirr} ETB</span>
          </div>
        )}
      </div>

      {/* Action Controls by Role */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenChat(request)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#1C1C1E] hover:bg-[#242426] border border-white/10 transition cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#FF5C00]" />
            <span>Open Chat</span>
          </button>

          {request.workerPhone && (
            <a
              href={`tel:${request.workerPhone}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white/80 bg-[#1C1C1E] hover:bg-[#242426] border border-white/10 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white/50" />
              <span>Call</span>
            </a>
          )}
        </div>

        {/* Worker Transition Controls */}
        {currentUserRole === 'worker' && !isCancelled && (
          <div className="flex items-center gap-2">
            {(request.status === 'requested' || request.status === 'pending') && (
              <>
                <button
                  onClick={() => onUpdateStatus('accepted')}
                  className="px-4 py-2 bg-white hover:bg-white/90 text-black rounded-xl text-xs font-extrabold shadow-md transition cursor-pointer"
                >
                  Accept Request
                </button>
                <button
                  onClick={() => onUpdateStatus('rejected')}
                  className="px-3.5 py-2 bg-[#1C1C1E] hover:bg-rose-950/40 text-white/70 hover:text-rose-300 rounded-xl text-xs font-bold border border-white/5 transition cursor-pointer"
                >
                  Decline
                </button>
              </>
            )}

            {request.status === 'accepted' && (
              <button
                onClick={() => onUpdateStatus('on_the_way')}
                className="flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-white/90 rounded-xl text-xs font-extrabold transition shadow-md cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-[#FF5C00]" />
                <span>I'm On The Way</span>
              </button>
            )}

            {request.status === 'on_the_way' && (
              <button
                onClick={() => onUpdateStatus('in_progress')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5C00] hover:bg-[#ff7826] text-black rounded-xl text-xs font-extrabold transition shadow-md cursor-pointer"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Start Work (Arrived)</span>
              </button>
            )}

            {request.status === 'in_progress' && (
              <button
                onClick={() => onUpdateStatus('completed')}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-white/90 text-black rounded-xl text-xs font-extrabold transition shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark Job Completed</span>
              </button>
            )}
          </div>
        )}

        {/* Customer Controls */}
        {currentUserRole === 'customer' && !isCancelled && (
          <div className="flex items-center gap-2">
            {request.status === 'completed' && (
              <button
                onClick={() => onOpenReviewModal(request)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5C00] hover:bg-[#ff7826] text-black rounded-xl text-xs font-extrabold shadow-md transition cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-black" />
                <span>Rate & Review Worker</span>
              </button>
            )}

            {request.status !== 'completed' && onCancelRequest && (
              <button
                onClick={() => onCancelRequest(request)}
                className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded-xl transition font-bold border border-rose-500/20 cursor-pointer"
              >
                Cancel Request
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
