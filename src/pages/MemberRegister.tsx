import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaUserTag, FaChevronRight } from 'react-icons/fa';
import logo from '../assets/img/logo_nobg.webp';
import { VOICE_ROLES } from '../lib/constants';

export default function MemberRegister() {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    username: '',
    password: '',
    role: VOICE_ROLES[0] as string,
    customRole: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      role: formData.role === 'Other' ? (formData.customRole.trim() || 'Other') : formData.role,
    };

    try {
      await axios.post('/api/member-auth/register', payload);
      setSuccess(true);
      setTimeout(() => navigate('/member/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-strong p-16 rounded-3xl border border-white/5 max-w-lg">
          <div className="w-20 h-20 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-950 text-4xl">✓</div>
          <h2 className="font-display text-3xl text-white font-light mb-4">Registration Successful!</h2>
          <p className="font-body text-white/50 mb-8 leading-loose">Welcome to the Emerald family. You are being redirected to log in...</p>
          <Link to="/member/login" className="text-gold-400 font-medium hover:underline tracking-widest uppercase text-xs">Login Now</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col items-center justify-center p-6 relative overflow-hidden py-24">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-500/20 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl relative z-10">
        <div className="text-center mb-12">
          <Link to="/">
            <img src={logo} alt="De Emeralds" className="w-16 h-16 mx-auto mb-6" />
          </Link>
          <h1 className="font-display text-2xl md:text-3xl text-white font-light tracking-[0.3em] leading-normal uppercase">Join the <span className="text-gold-400">Emeralds</span></h1>
          <p className="font-body text-white/30 text-xs mt-4 uppercase tracking-[0.4em]">Create your self-service account</p>
        </div>

        <div className="glass-strong p-10 rounded-2xl border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded text-red-400 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold-500/40 mb-2 block">First Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded text-sm transition-all"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
               </div>
               <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold-500/40 mb-2 block">Middle Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded text-sm transition-all"
                    value={formData.middleName}
                    onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                  />
               </div>
               <div>
                  <label className="text-[10px] uppercase tracking-widest text-gold-500/40 mb-2 block">Last Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded text-sm transition-all"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
               </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-gold-500/40 mb-2 block">Username / Email (Login ID)</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500/20 text-xs" />
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 p-3 pl-10 text-white focus:border-gold-500/50 outline-none rounded text-sm transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-gold-500/40 mb-2 block">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500/20 text-xs" />
                <input
                  type="password"
                  className="w-full bg-white/5 border border-white/10 p-3 pl-10 text-white focus:border-gold-500/50 outline-none rounded text-sm transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-gold-500/40 mb-2 block">Voice Role / Position</label>
              <div className="relative">
                <FaUserTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-500/20 text-xs" />
                <select
                  className="w-full bg-emerald-900 border border-white/10 p-3 pl-10 text-white focus:border-gold-500/50 outline-none rounded text-sm appearance-none transition-all"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  {VOICE_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              {formData.role === 'Other' && (
                <input
                  type="text"
                  placeholder="Type custom role..."
                  className="w-full mt-3 bg-white/5 border border-gold-500/30 p-3 text-white focus:border-gold-500/50 outline-none rounded text-sm transition-all"
                  value={formData.customRole}
                  onChange={(e) => setFormData({...formData, customRole: e.target.value})}
                  required
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-transparent border border-gold-500/40 text-gold-400 p-4 rounded-lg font-body font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gold-500 hover:text-emerald-950 transition-all disabled:opacity-50 group mt-4 shadow-xl"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
              ) : (
                <>
                  Register Account <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="font-body text-white/20 text-xs uppercase tracking-widest">
            Already have an account?{' '}
            <Link to="/member/login" className="text-gold-500/60 hover:text-gold-400 transition-colors ml-2">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
