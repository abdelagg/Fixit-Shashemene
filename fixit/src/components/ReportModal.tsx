import React, { useState } from 'react';
import { ShieldAlert, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ReportModalProps {
  reportedUserId: string;
  reportedUserName: string;
  requestId?: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  reportedUserId,
  reportedUserName,
  requestId,
  onClose
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('Poor or inappropriate behavior');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      await api.createReport({
        reporterId: user.id,
        reporterName: user.name,
        reportedUserId,
        reportedUserName,
        requestId,
        reason,
        description: description.trim()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Report error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-[#F5F5F7]">
      <div className="bg-[#141414] w-full max-w-md rounded-[32px] shadow-2xl border border-white/10 overflow-hidden">
        <div className="p-5 bg-[#1C1C1E] border-b border-white/10 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-extrabold text-sm">Submit Safety Report</h3>
          </div>
          <button onClick={onClose} className="p-1 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-base text-white">Report Submitted</h4>
            <p className="text-xs text-white/60">
              Thank you for keeping FixIt Shashemene safe and trustworthy. Our admin team will investigate this user profile immediately.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-white text-black font-extrabold rounded-2xl text-xs cursor-pointer hover:bg-white/90 transition shadow-xl"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1">
                Reporting User: <span className="text-rose-400 font-bold">{reportedUserName}</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden cursor-pointer"
              >
                <option value="Worker behaved badly or unprofessionally" className="bg-[#141414]">Worker behaved badly or unprofessionally</option>
                <option value="Fake profile or misleading qualifications" className="bg-[#141414]">Fake profile or misleading qualifications</option>
                <option value="Fraud, overcharging or scam attempt" className="bg-[#141414]">Fraud, overcharging or scam attempt</option>
                <option value="No-show without notification" className="bg-[#141414]">No-show without notification</option>
                <option value="Other security or safety concern" className="bg-[#141414]">Other security or safety concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                Additional Details
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened so FixIt admin can review..."
                rows={3}
                className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden focus:border-rose-500/50"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white/50 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-2xl text-xs font-extrabold transition shadow-xl cursor-pointer"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
