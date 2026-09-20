import React, { useState, useEffect } from 'react';
import {
  Star,
  MapPin,
  CheckCircle2,
  Clock,
  Briefcase,
  ShieldCheck,
  PhoneCall,
  Calendar,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Award,
  ThumbsUp
} from 'lucide-react';
import { WorkerProfile, Review } from '../types';
import { api } from '../services/api';
import { ReportModal } from '../components/ReportModal';

interface WorkerProfilePageProps {
  workerId: string;
  onNavigate: (view: string, data?: any) => void;
  onSelectWorker: (worker: WorkerProfile) => void;
}

export const WorkerProfilePage: React.FC<WorkerProfilePageProps> = ({
  workerId,
  onNavigate,
  onSelectWorker
}) => {
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        setLoading(true);
        const [wRes, rRes] = await Promise.all([
          api.getWorkerById(workerId),
          api.getWorkerReviews(workerId)
        ]);
        setWorker(wRes.worker);
        setReviews(rRes.reviews || []);
      } catch (err) {
        console.error('Error fetching worker profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerData();
  }, [workerId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-white/40 text-sm">
        Loading worker profile from Shashemene database...
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 text-white">
        <h2 className="text-xl font-bold">Worker profile not found</h2>
        <button
          onClick={() => onNavigate('workers')}
          className="px-4 py-2 bg-white text-black font-bold rounded-xl text-xs"
        >
          Back to Workers
        </button>
      </div>
    );
  }

  const isAvailable = worker.availability.isAvailable;
  const isApproved = worker.verificationStatus === 'approved';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-[#F5F5F7]">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('workers')}
        className="flex items-center gap-1.5 text-xs font-bold text-white/60 hover:text-white transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all Shashemene workers</span>
      </button>

      {/* Main Profile Header Bento Card */}
      <div className="bg-[#141414] rounded-[32px] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={worker.profileImage}
                alt={worker.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-[22px] object-cover border border-white/10 shadow-md"
              />
              <span
                className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-white/10 ${
                  isAvailable ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/50' : 'bg-amber-500 text-black shadow-sm shadow-amber-500/50'
                }`}
              >
                {isAvailable ? 'Available' : 'Busy'}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-white">{worker.name}</h1>
                {isApproved && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5C00]" />
                    <span>FixIt Verified</span>
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-white/80 mt-1 flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-[#FF5C00]" />
                <span>{worker.serviceCategory}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/50">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {worker.ratingAverage > 0 ? worker.ratingAverage.toFixed(1) : 'New'}
                </span>
                <span>({worker.reviewCount} reviews)</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5C00]" />
                  Shashemene, {worker.neighborhood}
                </span>
                <span>•</span>
                <span>{worker.experienceYears} Yrs Exp</span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
            {worker.hourlyRateBirr && (
              <div className="text-left sm:text-right bg-[#1C1C1E] px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-xl font-extrabold text-white">{worker.hourlyRateBirr} ETB</span>
                <span className="text-[10px] text-white/40 block">approx / hour</span>
              </div>
            )}

            <button
              onClick={() => onSelectWorker(worker)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white text-black hover:bg-white/90 font-extrabold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Request Service From {worker.name.split(' ')[0]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Biography & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-5">
            <div>
              <h3 className="font-bold text-xs text-white/50 uppercase tracking-widest mb-2">
                About the Craftsman
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed whitespace-pre-line">
                {worker.description}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xs text-white/50 uppercase tracking-widest mb-2">
                Services Offered in Shashemene
              </h3>
              <div className="flex flex-wrap gap-2">
                {worker.services.map((srv, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-[#1C1C1E] text-white/90 text-xs font-semibold border border-white/10"
                  >
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>

            {worker.skills && worker.skills.length > 0 && (
              <div>
                <h3 className="font-bold text-xs text-white/50 uppercase tracking-widest mb-2">
                  Specialized Skills & Tools
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {worker.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#1C1C1E] text-white/70 text-xs font-medium border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar specs: Schedule, Phone, Trust Badge */}
          <div className="space-y-4 bg-[#1C1C1E] p-5 rounded-2xl border border-white/10 text-xs text-white/70">
            <div className="space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF5C00]" />
                <span>Working Hours in Shashemene</span>
              </div>
              <p className="text-white/60 font-mono text-[11px]">
                {worker.availability.workingHours || 'Mon - Sat: 8:00 AM - 6:30 PM'}
              </p>
              <p className="text-[11px] text-white/40">
                {worker.availability.isAvailable
                  ? '🟢 Currently accepting jobs in this area'
                  : '🟡 Currently engaged in another job'}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Track Record</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Completed Jobs:</span>
                <span className="font-bold text-white">{worker.completedJobs} verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Experience:</span>
                <span className="font-bold text-white">{worker.experienceYears} Years</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-[11px] text-rose-400 hover:text-rose-300 transition flex items-center gap-1 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Report profile or safety concern</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-[#141414] rounded-[32px] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">
              Verified Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-white/50">
              Reviews left by Shashemene residents after completed jobs
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#1C1C1E] px-3 py-1.5 rounded-xl border border-white/10 text-amber-400 font-bold text-sm">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{worker.ratingAverage > 0 ? worker.ratingAverage.toFixed(1) : 'New'} / 5.0</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-xs text-white/40">
            No reviews yet for this worker. Be the first to request and leave a review!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/5 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.customerImage}
                      alt={rev.customerName}
                      className="w-9 h-9 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-bold text-xs text-white">{rev.customerName}</div>
                      <div className="text-[10px] text-white/40">
                        {new Date(rev.createdAt).toLocaleDateString([], {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          rev.rating >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety Report Modal */}
      {reportModalOpen && (
        <ReportModal
          reportedUserId={worker.userId}
          reportedUserName={worker.name}
          onClose={() => setReportModalOpen(false)}
        />
      )}
    </div>
  );
};
