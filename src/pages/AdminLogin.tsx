import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminLogin } from '../lib/api';
import logo from '../assets/img/logo_nobg.webp';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token } = await adminLogin('admin', password);
      localStorage.setItem('de_emeralds_token', token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-xl border border-gold-500/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <img src={logo} alt="De Emeralds" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display text-3xl text-white font-light uppercase tracking-widest leading-normal">
            Admin <span className="text-gold-400">Portal</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">
              Secret Passkey
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-body text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 text-emerald-950 py-3 font-body font-bold uppercase tracking-[.2em] text-sm hover:bg-gold-400 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Sanctuary'}
          </button>
        </form>

        <div className="mt-8 text-center">
            <button
                onClick={() => navigate('/')}
                className="text-white/30 hover:text-white/60 font-body text-xs uppercase tracking-widest transition-colors"
            >
                &larr; Back to Public Site
            </button>
        </div>
      </motion.div>
    </div>
  );
}
