import React, { useState } from 'react';
import {
  Sparkles,
  X,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Star,
  Wrench,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { AIProblemAnalysis, WorkerProfile } from '../types';
import { SHASHEMENE_NEIGHBORHOODS } from '../data/shashemeneData';

interface AiProblemModalProps {
  onClose: () => void;
  onProceedToRequest: (data: {
    category: string;
    title: string;
    description: string;
    neighborhood: string;
    urgency: string;
    aiAnalysis: AIProblemAnalysis;
    selectedWorkerId?: string;
    imageBase64?: string;
  }) => void;
}

export const AiProblemModal: React.FC<AiProblemModalProps> = ({ onClose, onProceedToRequest }) => {
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState('Arada');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIProblemAnalysis | null>(null);
  const [recommendedWorkers, setRecommendedWorkers] = useState<
    (WorkerProfile & { distanceKm: number; matchScore: number; whyRecommended: string })[]
  >([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [error, setError] = useState<string | null>(null);

  // File upload handler
  const handleImageFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!description.trim() && !imageBase64) {
      setError('Please type a description of the problem or upload a photo.');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      // 1. Analyze Problem (server-side diagnostic engine)
      const res = await api.analyzeProblem({
        description: description.trim(),
        imageBase64: imageBase64 || undefined
      });

      const aiResult = res.analysis;
      setAnalysis(aiResult);

      // 2. Run Hybrid Worker Matching
      const matchRes = await api.matchWorkersWithAI({
        category: aiResult.category,
        problem: aiResult.problem,
        neighborhood,
        urgency: aiResult.urgency
      });

      setRecommendedWorkers(matchRes.recommendedWorkers || []);
      if (matchRes.recommendedWorkers && matchRes.recommendedWorkers.length > 0) {
        setSelectedWorkerId(matchRes.recommendedWorkers[0].id);
      }

      setStep('results');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error diagnosing problem. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const sampleProblems = [
    'Water is coming from under my kitchen sink and wetting the floor in Arada.',
    'My Samsung Galaxy phone dropped and screen has black ink lines.',
    'Whenever I switch on the electric stove, the main power breaker trips.',
    'My Toyota engine makes squealing sound when braking near Kuyera road.'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        id="ai-problem-modal"
        className="bg-[#141414] w-full max-w-2xl rounded-[32px] shadow-2xl border border-white/10 overflow-hidden my-6 text-[#F5F5F7]"
      >
        {/* Header */}
        <div className="bg-[#1C1C1E] border-b border-white/10 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FF5C00] text-black flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">FixIt Diagnostic Engine</h2>
              <p className="text-xs text-white/50">
                Automated Problem Assessment & Worker Matching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'input' ? (
          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Neighborhood selection */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                Where is the problem located in Shashemene?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SHASHEMENE_NEIGHBORHOODS.map((n) => (
                  <button
                    key={n.name}
                    type="button"
                    onClick={() => setNeighborhood(n.name)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition cursor-pointer ${
                      neighborhood === n.name
                        ? 'bg-white text-black border-white font-bold shadow-md'
                        : 'bg-[#1C1C1E] border-white/5 text-white/70 hover:text-white hover:bg-[#242426]'
                    }`}
                  >
                    <div className="font-bold">{n.name}</div>
                    <div className={`text-[10px] truncate ${neighborhood === n.name ? 'text-black/60' : 'text-white/40'}`}>
                      {n.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Text description */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                Describe the problem in your own words
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Water is dripping from pipe under bathroom sink, or laptop screen flickering..."
                rows={3}
                className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 focus:border-[#FF5C00]/50 rounded-xl p-3 outline-hidden transition"
              />

              {/* Sample quick prompts */}
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Examples:</span>
                {sampleProblems.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDescription(ex)}
                    className="text-[10px] bg-[#1C1C1E] hover:bg-white/10 text-white/70 hover:text-white px-2.5 py-1 rounded-full border border-white/5 transition text-left cursor-pointer"
                  >
                    {ex.length > 35 ? ex.substring(0, 32) + '...' : ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                Upload a photo of the damage (optional)
              </label>

              {imagePreview ? (
                <div className="relative inline-block border border-white/20 rounded-2xl overflow-hidden shadow-lg">
                  <img src={imagePreview} alt="Preview" className="h-36 w-auto object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageBase64(null);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/80 text-white rounded-full hover:bg-black transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-white/10 hover:border-[#FF5C00]/50 bg-[#1C1C1E] hover:bg-[#242426] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition">
                  <UploadCloud className="w-6 h-6 text-[#FF5C00] mb-1" />
                  <span className="text-xs font-bold text-white">Click or drag photo here</span>
                  <span className="text-[10px] text-white/40">JPG, PNG (max 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleImageFile(e.target.files[0]);
                    }}
                  />
                </label>
              )}
            </div>

            {/* Submit Diagnose */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white/50 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white hover:bg-white/90 disabled:opacity-50 text-black font-extrabold text-xs shadow-xl transition cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF5C00]" />
                    <span>Running Diagnostic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FF5C00]" />
                    <span>Diagnose & Find Workers</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Diagnosis Results & Recommended Workers */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Diagnosis Summary Card */}
            {analysis && (
              <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider bg-[#FF5C00] text-black px-2.5 py-0.5 rounded-md">
                      {analysis.category}
                    </span>
                    <span className="text-xs font-bold text-white">
                      Recommended: {analysis.suggestedWorkerType}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                    analysis.urgency === 'high' || analysis.urgency === 'emergency'
                      ? 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                      : analysis.urgency === 'medium'
                      ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {analysis.urgency.toUpperCase()} Urgency
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">Likely Issue:</h4>
                  <p className="text-xs text-white/70 mt-0.5 leading-relaxed">{analysis.problem}</p>
                </div>

                {analysis.recommendedPreparation && analysis.recommendedPreparation.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#141414] border border-white/5 text-xs text-white/80 space-y-1">
                    <div className="font-bold text-[#FF5C00] flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Recommended Preparation & Safety:</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-white/60 space-y-0.5 pl-1">
                      {analysis.recommendedPreparation.map((prep, i) => (
                        <li key={i}>{prep}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Workers in Shashemene */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Recommended Workers in Shashemene
                  </h3>
                  <p className="text-xs text-white/40">
                    Ranked by specialty match (40%), distance (25%), availability (15%), rating & experience
                  </p>
                </div>
                <button
                  onClick={() => setStep('input')}
                  className="text-xs text-[#FF5C00] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Re-diagnose
                </button>
              </div>

              <div className="space-y-2.5">
                {recommendedWorkers.length === 0 ? (
                  <div className="text-xs text-white/40 p-4 text-center border border-dashed border-white/10 rounded-2xl">
                    No approved workers found for this exact category. You can post a general request to the Shashemene pool.
                  </div>
                ) : (
                  recommendedWorkers.map((w) => {
                    const isSelected = selectedWorkerId === w.id;
                    return (
                      <div
                        key={w.id}
                        onClick={() => setSelectedWorkerId(w.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#1C1C1E] border-[#FF5C00] ring-1 ring-[#FF5C00]/30 shadow-lg'
                            : 'bg-[#141414] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={w.profileImage}
                            alt={w.name}
                            className="w-12 h-12 rounded-xl object-cover border border-white/10"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-white">{w.name}</span>
                              <span className="text-[10px] bg-[#FF5C00]/15 text-[#FF5C00] border border-[#FF5C00]/30 px-1.5 py-0.2 rounded font-bold">
                                ✓ Verified
                              </span>
                            </div>

                            <p className="text-xs text-[#FF5C00] font-medium">{w.serviceCategory}</p>

                            <div className="flex items-center gap-2 mt-0.5 text-xs text-white/50">
                              <span className="flex items-center gap-0.5 text-white font-bold">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                {w.ratingAverage.toFixed(1)}
                              </span>
                              <span>({w.reviewCount} reviews)</span>
                              <span>•</span>
                              <span>📍 {w.distanceKm} km away ({w.neighborhood})</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                          <span className="text-xs font-extrabold text-[#FF5C00] bg-[#FF5C00]/10 border border-[#FF5C00]/20 px-2 py-0.5 rounded-md">
                            {w.matchScore}% Match
                          </span>
                          <span className="text-[11px] text-white/60 font-medium">
                            {w.hourlyRateBirr} ETB/hr
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-4 py-2 text-xs font-bold text-white/50 hover:text-white cursor-pointer"
              >
                Back to Details
              </button>

              <button
                type="button"
                onClick={() => {
                  if (analysis) {
                    onProceedToRequest({
                      category: analysis.category,
                      title: analysis.problem,
                      description: description || analysis.problem,
                      neighborhood,
                      urgency: analysis.urgency,
                      aiAnalysis: analysis,
                      selectedWorkerId: selectedWorkerId || undefined,
                      imageBase64: imageBase64 || undefined
                    });
                  }
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white hover:bg-white/90 text-black font-extrabold text-xs shadow-xl transition cursor-pointer"
              >
                <span>Confirm & Send Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
