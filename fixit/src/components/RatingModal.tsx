import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { ServiceRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface RatingModalProps {
  request: ServiceRequest;
  onClose: () => void;
  onSuccess: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ request, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !request.workerId) return;

    try {
      setLoading(true);
      setError(null);
      await api.createReview({
        customerId: user.id,
        customerName: user.name,
        customerImage: user.profileImage,
        workerId: request.workerId,
        requestId: request.id,
        serviceCategory: request.serviceCategory,
        rating,
        comment: comment || 'Work completed satisfactorily.'
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const ratingPhrases: Record<number, string> = {
    1: 'Poor service',
    2: 'Below expectations',
    3: 'Average work',
    4: 'Very good service',
    5: 'Excellent & highly recommended!'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-[#F5F5F7]">
      <div
        id="rating-modal-container"
        className="bg-[#141414] w-full max-w-md rounded-[32px] shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-5 bg-[#1C1C1E] border-b border-white/10 text-white flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base">Rate Your Experience</h3>
            <p className="text-xs text-white/50 mt-0.5">
              Service: {request.title} with {request.workerName || 'Worker'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 text-rose-300 text-xs border border-rose-500/30">
              {error}
            </div>
          )}

          {/* Stars */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition transform hover:scale-110 focus:outline-hidden cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-[#FF5C00] fill-[#FF5C00]'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-[#FF5C00]">
              {ratingPhrases[hoverRating || rating]}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
              Write a Review for the Shashemene Community
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.g., Arrived on time in Arada, diagnosed the leak fast, very honest pricing in Birr..."
              rows={4}
              className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 focus:border-[#FF5C00]/50 rounded-xl p-3 outline-hidden transition"
              required
            />
          </div>

          {/* Preset compliments */}
          <div className="flex flex-wrap gap-1.5">
            {[
              '⚡ Arrived quickly',
              '🔧 High quality tools',
              '🤝 Honest pricing',
              '🧼 Clean work area',
              '📱 Great communication'
            ].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setComment((prev) => (prev ? `${prev} • ${tag}` : tag))}
                className="text-[11px] bg-[#1C1C1E] hover:bg-white/10 text-white/70 hover:text-white px-2.5 py-1 rounded-full border border-white/5 transition cursor-pointer"
              >
                {tag}
              </button>
            ))}
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
              className="px-6 py-2.5 rounded-2xl bg-white hover:bg-white/90 text-black font-extrabold text-xs shadow-xl transition cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
