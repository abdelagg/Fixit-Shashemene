import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Sparkles,
  MapPin,
  Clock,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  User,
  Star
} from 'lucide-react';
import { WorkerProfile, ServiceCategory, AIProblemAnalysis } from '../types';
import { SHASHEMENE_NEIGHBORHOODS } from '../data/shashemeneData';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface NewRequestPageProps {
  workers: (WorkerProfile & { distanceKm?: number })[];
  services: ServiceCategory[];
  prefillData?: {
    category?: string;
    title?: string;
    description?: string;
    neighborhood?: string;
    urgency?: string;
    aiAnalysis?: AIProblemAnalysis;
    selectedWorkerId?: string;
    imageBase64?: string;
  };
  onNavigate: (view: string, data?: any) => void;
}

export const NewRequestPage: React.FC<NewRequestPageProps> = ({
  workers,
  services,
  prefillData,
  onNavigate
}) => {
  const { user } = useAuth();

  const [category, setCategory] = useState(prefillData?.category || 'Plumbing');
  const [title, setTitle] = useState(prefillData?.title || '');
  const [description, setDescription] = useState(prefillData?.description || '');
  const [neighborhood, setNeighborhood] = useState(prefillData?.neighborhood || 'Arada');
  const [urgency, setUrgency] = useState<any>(prefillData?.urgency || 'medium');
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    prefillData?.selectedWorkerId || ''
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    prefillData?.imageBase64 || null
  );
  const [imageBase64, setImageBase64] = useState<string | null>(
    prefillData?.imageBase64 || null
  );
  const [aiAnalysis, setAiAnalysis] = useState<AIProblemAnalysis | null>(
    prefillData?.aiAnalysis || null
  );

  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update when prefillData changes
  useEffect(() => {
    if (prefillData) {
      if (prefillData.category) setCategory(prefillData.category);
      if (prefillData.title) setTitle(prefillData.title);
      if (prefillData.description) setDescription(prefillData.description);
      if (prefillData.neighborhood) setNeighborhood(prefillData.neighborhood);
      if (prefillData.urgency) setUrgency(prefillData.urgency);
      if (prefillData.selectedWorkerId) setSelectedWorkerId(prefillData.selectedWorkerId);
      if (prefillData.imageBase64) {
        setImagePreview(prefillData.imageBase64);
        setImageBase64(prefillData.imageBase64);
      }
      if (prefillData.aiAnalysis) setAiAnalysis(prefillData.aiAnalysis);
    }
  }, [prefillData]);

  // Handle Photo selection
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

  // Run AI diagnosis directly from this form
  const handleRunAiDiagnosis = async () => {
    if (!description.trim() && !imageBase64) {
      setError('Please enter a description or upload a photo before running AI Diagnosis.');
      return;
    }
    try {
      setAnalyzingAi(true);
      setError(null);
      const res = await api.analyzeProblem({
        description: description.trim(),
        imageBase64: imageBase64 || undefined
      });
      setAiAnalysis(res.analysis);
      if (res.analysis.category) setCategory(res.analysis.category);
      if (res.analysis.problem && !title) setTitle(res.analysis.problem);
      if (res.analysis.urgency) setUrgency(res.analysis.urgency);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'AI diagnosis failed.');
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in or select a demo user to post a request.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a description of the problem.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const targetWorker = workers.find((w) => w.id === selectedWorkerId);

      const res = await api.createRequest({
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone || '+251 91 100 2233',
        customerImage: user.profileImage,
        workerId: selectedWorkerId || undefined,
        workerName: targetWorker ? targetWorker.name : undefined,
        workerPhone: targetWorker ? targetWorker.phone : undefined,
        workerImage: targetWorker ? targetWorker.profileImage : undefined,
        serviceCategory: category,
        title: title || `${category} Repair in ${neighborhood}`,
        description: description.trim(),
        location: {
          city: 'Shashemene',
          neighborhood,
          addressDetails: `Near ${neighborhood} main junction`
        },
        urgency,
        images: imageBase64 ? [imageBase64] : [],
        aiAnalysis: aiAnalysis || undefined,
        priceEstimateBirr: targetWorker?.hourlyRateBirr ? targetWorker.hourlyRateBirr * 1.5 : 450
      });

      // Redirect to customer dashboard to track request
      onNavigate('customer-dashboard', { highlightRequestId: res.request.id });
    } catch (err: any) {
      console.error('Request creation error:', err);
      setError(err.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter approved workers matching this category
  const matchingWorkers = workers.filter(
    (w) =>
      w.verificationStatus === 'approved' &&
      (w.serviceCategory.toLowerCase() === category.toLowerCase() ||
        w.services.some((s) => s.toLowerCase().includes(category.toLowerCase())))
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-[#F5F5F7]">
      <div className="bg-[#141414] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#1C1C1E] via-[#18181A] to-[#141414] text-white p-6 sm:p-8 border-b border-white/10 relative overflow-hidden bento-glow-orange">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#FF5C00] text-black font-extrabold flex items-center justify-center shadow-lg shadow-[#FF5C00]/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Post a Service Request</h1>
              <p className="text-xs sm:text-sm text-white/50 mt-0.5">
                Connect with verified local craftsmen in Shashemene
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitRequest} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Service Category */}
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2.5">
              1. What type of service do you need?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {services.map((srv) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => {
                    setCategory(srv.name);
                    setSelectedWorkerId('');
                  }}
                  className={`p-3 rounded-2xl text-xs font-bold border text-left transition flex items-center justify-between cursor-pointer ${
                    category === srv.name
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-[#1C1C1E] border-white/5 text-white/70 hover:text-white hover:bg-[#242426]'
                  }`}
                >
                  <span>{srv.name}</span>
                  {category === srv.name && <CheckCircle2 className="w-4 h-4 text-black" />}
                </button>
              ))}
            </div>
          </div>

          {/* Problem Details & AI Diagnosis */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                2. Describe the problem
              </label>

              <button
                type="button"
                onClick={handleRunAiDiagnosis}
                disabled={analyzingAi}
                className="flex items-center gap-1.5 text-xs font-bold text-black bg-[#FF5C00] hover:bg-[#ff7826] px-3.5 py-1.5 rounded-xl transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{analyzingAi ? 'Diagnosing...' : 'AI Auto-Diagnose'}</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short summary (e.g. Water leaking from kitchen valve)"
                className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden focus:border-[#FF5C00]/50 transition mb-2.5 placeholder:text-white/40"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is broken, what symptoms you see, and any specific requirements..."
                rows={3}
                className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden focus:border-[#FF5C00]/50 transition placeholder:text-white/40"
                required
              />
            </div>

            {/* AI Diagnosis Pill (if analyzed) */}
            {aiAnalysis && (
              <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-[#FF5C00]/30 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-white font-bold">
                  <span className="flex items-center gap-1.5 text-[#FF5C00]">
                    <Sparkles className="w-4 h-4" />
                    <span>System Diagnosis:</span>
                  </span>
                  <span className="text-[10px] bg-[#FF5C00]/20 text-[#FF5C00] px-2.5 py-0.5 rounded-full border border-[#FF5C00]/30 font-extrabold">
                    {Math.round(aiAnalysis.confidence * 100)}% Confidence
                  </span>
                </div>
                <p className="text-white/80">{aiAnalysis.problem}</p>
                {aiAnalysis.recommendedPreparation && (
                  <div className="text-[11px] text-white/50 pt-1">
                    <strong className="text-white/70">Preparation tips: </strong>
                    {aiAnalysis.recommendedPreparation.join(' • ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">
              3. Attach a photo (Optional)
            </label>
            {imagePreview ? (
              <div className="relative inline-block border border-white/20 rounded-2xl overflow-hidden shadow-md">
                <img src={imagePreview} alt="Upload Preview" className="h-32 w-auto object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/80 text-white rounded-full hover:bg-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border border-dashed border-white/15 hover:border-[#FF5C00]/50 bg-[#1C1C1E] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition">
                <UploadCloud className="w-6 h-6 text-white/40 mb-1" />
                <span className="text-xs font-bold text-white/80">Add damage photo</span>
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

          {/* Neighborhood & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                4. Shashemene Neighborhood
              </label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden font-medium cursor-pointer"
              >
                {SHASHEMENE_NEIGHBORHOODS.map((n) => (
                  <option key={n.name} value={n.name} className="bg-[#141414]">
                    {n.name} ({n.description})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">
                5. Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden font-medium cursor-pointer"
              >
                <option value="low" className="bg-[#141414]">Low (Next few days)</option>
                <option value="medium" className="bg-[#141414]">Medium (Today / Tomorrow)</option>
                <option value="high" className="bg-[#141414]">High (Within few hours)</option>
                <option value="emergency" className="bg-[#141414]">Emergency (Immediate attention)</option>
              </select>
            </div>
          </div>

          {/* Select Specific Worker or General Pool */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest">
                6. Assign to a Worker (or broadcast to all in {neighborhood})
              </label>
              <span className="text-[11px] text-white/40">
                {matchingWorkers.length} verified {category} workers available
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setSelectedWorkerId('')}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                  selectedWorkerId === ''
                    ? 'bg-[#1C1C1E] border-[#FF5C00] shadow-md'
                    : 'bg-[#1C1C1E]/50 border-white/5 hover:bg-[#1C1C1E]'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-white">
                    📢 Broadcast to all verified {category} workers in Shashemene
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">
                    Fastest option: First available nearby worker will accept and contact you.
                  </div>
                </div>
                {selectedWorkerId === '' && <CheckCircle2 className="w-5 h-5 text-[#FF5C00]" />}
              </button>

              {matchingWorkers.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWorkerId(w.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    selectedWorkerId === w.id
                      ? 'bg-[#1C1C1E] border-[#FF5C00] shadow-md'
                      : 'bg-[#1C1C1E]/50 border-white/5 hover:bg-[#1C1C1E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={w.profileImage}
                      alt={w.name}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>{w.name}</span>
                        <span className="text-[10px] bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/30 px-1.5 py-0.2 rounded-full font-bold">
                          ✓ Verified
                        </span>
                      </div>
                      <div className="text-[11px] text-white/50 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          {w.ratingAverage.toFixed(1)}
                        </span>
                        <span>({w.reviewCount} reviews)</span>
                        <span>•</span>
                        <span>📍 Shashemene, {w.neighborhood}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {w.hourlyRateBirr && (
                      <span className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                        {w.hourlyRateBirr} ETB/hr
                      </span>
                    )}
                    {selectedWorkerId === w.id && (
                      <CheckCircle2 className="w-5 h-5 text-[#FF5C00]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-xs font-bold text-white/60 hover:text-white cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white hover:bg-white/90 disabled:opacity-50 text-black font-extrabold text-xs sm:text-sm shadow-xl transition cursor-pointer"
            >
              <span>{submitting ? 'Creating Request...' : 'Send Service Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
