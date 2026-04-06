import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import logo from '../assets/img/logo_nobg.webp';

export default function MemberLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/api/member-auth/login', { username, password });
      localStorage.setItem('memberToken', data.token);
      localStorage.setItem('memberRole', 'member');
      
      if (data.mustChangePassword) {
        navigate('/member/change-password');
      } else {
        navigate('/member/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <Link to="/">
            <img src={logo} alt="De Emeralds" className="w-20 h-20 mx-auto mb-6" />
          </Link>
          <h1 className="font-display text-3xl text-white font-light tracking-widest leading-normal">
            Member <span className="text-gold-400">Portal</span>
          </h1>
          <p className="font-body text-white/40 text-sm mt-4 uppercase tracking-[0.2em]">Welcome back, Emerald</p>
        </div>

        <div className="glass-strong p-10 rounded-2xl border border-white/5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/40" />
                <input
                  type="text"
                  placeholder="Username / Email"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-white focus:border-gold-500/50 outline-none transition-all rounded-lg placeholder-white/20"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-500/40" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 text-white focus:border-gold-500/50 outline-none transition-all rounded-lg placeholder-white/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 text-emerald-950 p-4 rounded-lg font-body font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-gold-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-gold-500/10"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-emerald-950/30 border-t-emerald-950 rounded-full animate-spin" />
              ) : (
                <>
                  Enter Portal <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="font-body text-white/30 text-sm">
              Don't have an account?{' '}
              <Link to="/member/register" className="text-gold-400 hover:text-gold-300 transition-colors font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="font-body text-white/20 text-xs uppercase tracking-widest hover:text-white transition-colors">
            Back to Website
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
