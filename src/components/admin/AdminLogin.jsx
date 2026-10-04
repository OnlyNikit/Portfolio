import { useState } from 'react';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export function AdminLogin({ onBackToSite, onLoginSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060b] flex flex-col justify-center items-center px-4 relative overflow-hidden text-white">
      {/* Background glow */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Return button */}
      <button
        onClick={onBackToSite}
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-cyan-400" />
        <span>Return to Portfolio</span>
      </button>

      {/* Card */}
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0a0e19] border border-cyan-500/30 shadow-2xl shadow-black relative z-10 space-y-6 box-glow">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2 box-glow">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-heading">Admin Portal</h2>
          <p className="text-xs text-slate-400 font-mono">
            Authenticated Content Management System
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/[0.1] focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/[0.1] focus:border-cyan-400 text-white text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-slate-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50 box-glow"
          >
            {loading ? 'Authenticating...' : 'Sign In To Console'}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] font-mono text-slate-500">
          Single Admin Account · JWT Session Protected
        </div>
      </div>
    </div>
  );
}
