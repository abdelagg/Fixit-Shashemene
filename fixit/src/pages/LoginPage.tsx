import React, { useState } from 'react';
import { Wrench, ArrowRight, UserCheck, ShieldCheck, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (view: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, switchDemoUser } = useAuth();
  const [email, setEmail] = useState('customer@test.com');
  const [role, setRole] = useState<'customer' | 'worker' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, role);
      if (role === 'admin') onNavigate('admin-dashboard');
      else if (role === 'worker') onNavigate('worker-dashboard');
      else onNavigate('customer-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (type: 'customer' | 'worker' | 'worker2' | 'admin') => {
    await switchDemoUser(type);
    if (type === 'admin') onNavigate('admin-dashboard');
    else if (type === 'worker' || type === 'worker2') onNavigate('worker-dashboard');
    else onNavigate('customer-dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-[#F5F5F7]">
      <div className="bg-[#141414] rounded-[32px] border border-white/10 p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5C00] text-black flex items-center justify-center mx-auto shadow-lg shadow-[#FF5C00]/20">
            <Wrench className="w-6 h-6 transform -rotate-45" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome to FixIt</h1>
          <p className="text-xs text-white/50">Shashemene Local Service Marketplace</p>
        </div>

        {/* Quick Demo Sign In Box */}
        <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/10 text-xs space-y-3">
          <div className="font-bold text-white flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#FF5C00]" />
            <span>Instant 1-Click Demo Login</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('customer')}
              className="p-2.5 rounded-xl bg-[#141414] hover:bg-white/10 border border-white/5 text-left transition cursor-pointer"
            >
              <div className="font-bold text-white">Abebe (Customer)</div>
              <div className="text-[10px] text-white/40">Arada resident</div>
            </button>

            <button
              onClick={() => handleQuickDemo('worker')}
              className="p-2.5 rounded-xl bg-[#141414] hover:bg-white/10 border border-white/5 text-left transition cursor-pointer"
            >
              <div className="font-bold text-white">Ahmed (Worker)</div>
              <div className="text-[10px] text-white/40">Master Plumber</div>
            </button>

            <button
              onClick={() => handleQuickDemo('worker2')}
              className="p-2.5 rounded-xl bg-[#141414] hover:bg-white/10 border border-white/5 text-left transition cursor-pointer"
            >
              <div className="font-bold text-white">Bekele (Worker)</div>
              <div className="text-[10px] text-white/40">Electrician</div>
            </button>

            <button
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 rounded-xl bg-[#141414] hover:bg-white/10 border border-white/5 text-left transition cursor-pointer"
            >
              <div className="font-bold text-white">Aster (Admin)</div>
              <div className="text-[10px] text-white/40">Verifications</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/40 text-rose-300 rounded-xl text-xs border border-rose-500/30">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-[#1C1C1E] text-white border border-white/10 rounded-xl p-3 outline-hidden focus:border-[#FF5C00]/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-1.5">Account Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['customer', 'worker', 'admin'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition border cursor-pointer ${
                    role === r
                      ? 'bg-white text-black border-white shadow-md'
                      : 'bg-[#1C1C1E] text-white/60 border-white/5 hover:text-white hover:bg-[#242426]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-white hover:bg-white/90 text-black font-extrabold text-xs shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-white/50">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-[#FF5C00] font-bold hover:underline cursor-pointer"
          >
            Register as Customer or Worker
          </button>
        </div>
      </div>
    </div>
  );
};
