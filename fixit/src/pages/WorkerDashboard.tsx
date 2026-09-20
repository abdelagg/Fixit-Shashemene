import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Truck,
  Wrench,
  MessageSquare,
  Power,
  RefreshCw,
  Award,
  DollarSign,
  AlertCircle,
  PhoneCall,
  User
} from 'lucide-react';
import { ServiceRequest, WorkerProfile, JobStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { JobTimeline } from '../components/JobTimeline';
import { ChatModal } from '../components/ChatModal';

interface WorkerDashboardProps {
  onNavigate: (view: string, data?: any) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('in_progress');
  const [selectedChatRequest, setSelectedChatRequest] = useState<ServiceRequest | null>(null);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  const fetchWorkerDashboard = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // 1. Get worker profile
      const workersRes = await api.getWorkers();
      const myWorker = workersRes.workers.find((w: WorkerProfile) => w.userId === user.id);
      if (myWorker) {
        setWorkerProfile(myWorker);
        // 2. Get assigned requests
        const reqRes = await api.getWorkerRequests(myWorker.id);
        setRequests(reqRes.requests || []);
      }
    } catch (err) {
      console.error('Failed to load worker dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerDashboard();
  }, [user?.id]);

  const handleToggleAvailability = async () => {
    if (!workerProfile) return;
    try {
      setTogglingAvailability(true);
      const newStatus = !workerProfile.availability.isAvailable;
      const res = await api.updateWorkerAvailability(workerProfile.id, newStatus);
      setWorkerProfile((prev) => (prev ? { ...prev, availability: res.availability } : null));
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: JobStatus) => {
    try {
      await api.updateRequestStatus(requestId, {
        status: newStatus,
        workerId: workerProfile?.id,
        workerName: workerProfile?.name,
        workerPhone: workerProfile?.phone,
        workerImage: workerProfile?.profileImage
      });
      await fetchWorkerDashboard();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Category counts
  const pendingRequests = requests.filter((r) => r.status === 'requested' || r.status === 'pending');
  const activeJobs = requests.filter((r) => ['accepted', 'on_the_way', 'in_progress'].includes(r.status));
  const completedJobs = requests.filter((r) => r.status === 'completed');

  const displayedRequests =
    activeTab === 'pending'
      ? pendingRequests
      : activeTab === 'in_progress'
      ? activeJobs
      : completedJobs;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-[#F5F5F7]">
      {/* Worker Profile Header Bento Box */}
      <div className="bg-[#141414] rounded-[32px] border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={workerProfile?.profileImage || user?.profileImage}
              alt="Worker Profile"
              className="w-18 h-18 rounded-2xl object-cover border border-white/10 shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#141414] ${
                workerProfile?.availability.isAvailable ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-amber-500 shadow-sm shadow-amber-500/50'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {workerProfile?.name || user?.name}
              </h1>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30">
                ✓ {workerProfile?.serviceCategory || 'Worker Hub'}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF5C00]" />
              <span>Shashemene, {workerProfile?.neighborhood || 'Arada'}</span>
              <span>•</span>
              <span className="font-mono text-white/70">{workerProfile?.phone || user?.phone}</span>
            </p>
          </div>
        </div>

        {/* Quick Stats & Availability Toggle */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
          <div className="text-left md:text-right bg-[#1C1C1E] p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-1 font-bold text-white text-base">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{workerProfile?.ratingAverage.toFixed(1) || '5.0'}</span>
              <span className="text-xs text-white/40 font-normal">
                ({workerProfile?.reviewCount || 0} reviews)
              </span>
            </div>
            <div className="text-[10px] text-white/50">
              {workerProfile?.completedJobs || 0} completed jobs
            </div>
          </div>

          <button
            onClick={handleToggleAvailability}
            disabled={togglingAvailability}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-extrabold text-xs transition border cursor-pointer ${
              workerProfile?.availability.isAvailable
                ? 'bg-white text-black border-white shadow-xl hover:bg-white/90'
                : 'bg-[#1C1C1E] text-amber-400 border-amber-500/30 hover:bg-[#242426]'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>
              {workerProfile?.availability.isAvailable ? '🟢 Accepting Jobs' : '🟡 Currently Busy'}
            </span>
          </button>
        </div>
      </div>

      {/* Verification Notice */}
      {workerProfile?.verificationStatus === 'pending' && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong className="text-amber-200">Account Verification Pending: </strong>
            Your profile is under review by FixIt Shashemene Admin. You can test incoming demo requests right now!
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-[#141414] border border-white/10 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Incoming Requests</span>
            {pendingRequests.length > 0 && (
              <span className="bg-[#FF5C00] text-black px-1.5 py-0.2 rounded-full text-[10px] font-extrabold animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'in_progress'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>In Progress ({activeJobs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Completed Work ({completedJobs.length})
          </button>
        </div>

        <button
          onClick={fetchWorkerDashboard}
          className="text-xs text-white/60 hover:text-white font-bold flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Jobs</span>
        </button>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="text-center py-16 text-xs text-white/40">Loading worker jobs...</div>
      ) : displayedRequests.length === 0 ? (
        <div className="bg-[#141414] rounded-[32px] border border-dashed border-white/10 p-12 text-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] text-white/40 flex items-center justify-center mx-auto border border-white/5">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">
            {activeTab === 'pending'
              ? 'No new incoming requests'
              : activeTab === 'in_progress'
              ? 'No active jobs in progress'
              : 'No completed jobs yet'}
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Keep your availability status active to receive instant customer repair alerts in Shashemene.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayedRequests.map((req) => (
            <JobTimeline
              key={req.id}
              request={req}
              currentUserRole="worker"
              onUpdateStatus={(newStatus) => handleUpdateStatus(req.id, newStatus)}
              onOpenChat={(r) => setSelectedChatRequest(r)}
              onOpenReviewModal={() => {}}
            />
          ))}
        </div>
      )}

      {/* Live Chat Modal */}
      {selectedChatRequest && (
        <ChatModal
          request={selectedChatRequest}
          onClose={() => setSelectedChatRequest(null)}
        />
      )}
    </div>
  );
};
