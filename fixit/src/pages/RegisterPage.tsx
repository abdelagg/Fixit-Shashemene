import React, { useState } from 'react';
import { Wrench, ArrowRight, User, Briefcase, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SHASHEMENE_NEIGHBORHOODS } from '../data/shashemeneData';

interface RegisterPageProps {
  onNavigate: (view: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [neighborhood, setNeighborhood] = useState('Arada');

  // Worker specific fields
  const [serviceCategory, setServiceCategory] = useState('Plumbing');
  const [experienceYears, setExperienceYears] = useState(3);
  const [hourlyRateBirr, setHourlyRateBirr] = useState(250);
  const [description, setDescription] = useState('');
  const [services, setServices] = useState('Pipe repair, Water tank installation, Leak fixing');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const servicesArray = services
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await register({
        name: name.trim(),
        email: email.trim(),
        role,
        phone: phone.trim(),
        neighborhood,
        serviceCategory: role === 'worker' ? serviceCategory : undefined,
        experienceYears: role === 'worker' ? Number(experienceYears) : undefined,
        hourlyRateBirr: role === 'worker' ? Number(hourlyRateBirr) : undefined,
        description: role === 'worker' ? description.trim() : undefined,
        services: role === 'worker' ? servicesArray : undefined
      });

      if (role === 'worker') {
        onNavigate('worker-dashboard');
      } else {
        onNavigate('customer-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-[#F5F5F7]">
      <div className="bg-[#141414] rounded-[32px] border border-white/10 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5C00] text-black flex items-center justify-center mx-auto shadow-lg shadow-[#FF5C00]/20">
            <Wrench className="w-6 h-6 transform -rotate-45" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Create FixIt Account</h1>
          <p className="text-xs text-white/50">Join the trusted local community in Shashemene</p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#1C1C1E] border border-white/10 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-[#FF5C00]" />
            <span>I need services (Customer)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              role === 'worker'
                ? 'bg-white text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 text-[#FF5C00]" />
            <span>I offer trade work (Worker)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-950/40 text-rose-300 rounded-xl text-xs border border-rose-500/30">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Dawit Bekele"
                className="w-full bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden focus:border-[#FF5C00]/50"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dawit@example.com"
                className="w-full bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden focus:border-[#FF5C00]/50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">Phone Number (Shashemene)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 91 123 4567"
                className="w-full bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden font-mono focus:border-[#FF5C00]/50"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">Neighborhood in Shashemene</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden font-medium cursor-pointer"
              >
                {SHASHEMENE_NEIGHBORHOODS.map((n) => (
                  <option key={n.name} value={n.name} className="bg-[#141414]">
                    {n.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Extra Worker Details */}
          {role === 'worker' && (
            <div className="pt-4 border-t border-white/10 space-y-4 bg-[#1C1C1E] p-5 rounded-2xl border border-white/5">
              <h3 className="font-bold text-[#FF5C00] uppercase tracking-wider text-[11px]">
                Tradesperson Qualifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">Trade Specialty</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden cursor-pointer"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Car Mechanic">Car Mechanic</option>
                    <option value="Phone Repair">Phone Repair</option>
                    <option value="Computer Repair">Computer Repair</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Painting">Painting</option>
                    <option value="Home Appliances">Home Appliances</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">Years Experience</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    min={1}
                    className="w-full bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">Hourly Rate (ETB)</label>
                  <input
                    type="number"
                    value={hourlyRateBirr}
                    onChange={(e) => setHourlyRateBirr(Number(e.target.value))}
                    min={50}
                    className="w-full bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">
                  Services Offered (comma-separated)
                </label>
                <input
                  type="text"
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  className="w-full bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white/60 uppercase tracking-widest mb-1.5">Bio & Experience</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your apprenticeship, previous workshop experience, tools you own..."
                  rows={2}
                  className="w-full bg-[#141414] text-white border border-white/10 rounded-xl p-2.5 outline-hidden"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-white hover:bg-white/90 text-black font-extrabold text-xs shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Registering Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-white/50">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-[#FF5C00] font-bold hover:underline cursor-pointer"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};
