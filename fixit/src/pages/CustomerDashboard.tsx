import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PlusCircle,
  Search,
  MessageSquare,
  Star,
  RefreshCw,
  MapPin,
  Wrench,
  UserCheck
} from 'lucide-react';
import { ServiceRequest, JobStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { JobTimeline } from '../components/JobTimeline';
import { ChatModal } from '../components/ChatModal';
import { RatingModal } from '../components/RatingModal';

interface CustomerDashboardProps {
  onNavigate: (view: string, data?: any) => void;
  onOpenAiAssistant: () => void;
  highlightRequestId?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigate,
  onOpenAiAssistant,
  highlightRequestId
}) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [selectedChatRequest, setSelectedChatRequest] = useState<ServiceRequest | null>(null);
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<ServiceRequest | null>(null);

  const fetchCustomerRequests = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.getCustomerRequests(user.id);
      setRequests(res.requests || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerRequests();
  }, [user?.id]);

  const handleUpdateStatus = async (requestId: string, newStatus: JobStatus) => {
    try {
      await api.updateRequestStatus(requestId, { status: newStatus });
      await fetchCustomerRequests();
    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  const handleCancelRequest = async (request: ServiceRequest) => {
    const reason = prompt('Please enter cancellation reason:') || 'Customer cancelled';
    try {
      await api.updateRequestStatus(request.id, {
        status: 'cancelled',
        cancellationReason: reason
      });
      await fetchCustomerRequests();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'active') {
      return ['requested', 'pending', 'accepted', 'on_the_way', 'in_progress'].includes(r.status);
    }
    if (activeTab === 'completed') {
      return r.status === 'completed';
    }
    return true;
  });

  const activeCount = requests.filter((r) =>
    ['requested', 'pending', 'accepted', 'on_the_way', 'in_progress'].includes(r.status)
  ).length;

  const completedCount = requests.filter((r) => r.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-[#F5F5F7]">
      {/* Header Bento Box */}
      <div className="bg-[#141414] rounded-[32px] border border-white/10 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt="Customer Profile"
            className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {user?.name || 'Customer Portal'}
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30">
                Customer
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1 flex items-center gap-2">
              <span>📍 Shashemene, {user?.neighborhood || 'Arada'}</span>
              <span>•</span>
              <span className="font-mono">{user?.phone || '+251 91 100 2233'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1C1C1E] text-[#FF5C00] hover:bg-[#242426] border border-white/10 font-bold text-xs transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FF5C00]" />
            <span>AI Problem Diagnosis</span>
          </button>

          <button
            onClick={() => onNavigate('new-request')}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-extrabold text-xs shadow-xl transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Request</span>
          </button>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-[#141414] border border-white/10 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'active'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Active Jobs</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${activeTab === 'active' ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>
              {activeCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Completed</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${activeTab === 'completed' ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            All History ({requests.length})
          </button>
        </div>

        <button
          onClick={fetchCustomerRequests}
          className="text-xs text-white/60 hover:text-white font-bold flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-16 text-xs text-white/40">
          Loading your service requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-[#141414] rounded-[32px] border border-dashed border-white/10 p-12 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#1C1C1E] text-[#FF5C00] flex items-center justify-center mx-auto border border-white/5">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white">
            {activeTab === 'active' ? 'No active service requests' : 'No service history found'}
          </h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            Need something fixed around your home, shop, or vehicle in Shashemene?
          </p>
          <button
            onClick={() => onNavigate('new-request')}
            className="px-5 py-2.5 bg-white hover:bg-white/90 text-black rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shadow-xl transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Request</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className={highlightRequestId === req.id ? 'ring-2 ring-[#FF5C00] rounded-[28px]' : ''}
            >
              <JobTimeline
                request={req}
                currentUserRole="customer"
                onUpdateStatus={(newStatus) => handleUpdateStatus(req.id, newStatus)}
                onOpenChat={(r) => setSelectedChatRequest(r)}
                onOpenReviewModal={(r) => setSelectedReviewRequest(r)}
                onCancelRequest={(r) => handleCancelRequest(r)}
              />
            </div>
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

      {/* Review Modal */}
      {selectedReviewRequest && (
        <RatingModal
          request={selectedReviewRequest}
          onClose={() => setSelectedReviewRequest(null)}
          onSuccess={() => {
            setSelectedReviewRequest(null);
            fetchCustomerRequests();
          }}
        />
      )}
    </div>
  );
};
