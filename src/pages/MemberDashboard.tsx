import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaLock, FaCamera, FaSave, FaSignOutAlt, 
  FaChevronRight, FaInfoCircle, FaShieldAlt
} from 'react-icons/fa';
import imageCompression from 'browser-image-compression';
import { uploadToCloudinary } from '../lib/cloudinary';
import { VOICE_ROLES } from '../lib/constants';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MemberDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Profile Form state
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    role: '' as string,
    customRole: '',
    photoUrl: '',
    photoPublicId: '',
  });

  // Password state
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/member/login');
      return;
    }

    try {
      const { data } = await axios.get('/api/member-auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data);
      
      const m = data.member;
      const knownRoles = VOICE_ROLES as readonly string[];
      const isKnown = knownRoles.includes(m.role);
      
      setFormData({
        firstName: m.firstName,
        middleName: m.middleName || '',
        lastName: m.lastName,
        role: isKnown ? m.role : 'Other',
        customRole: isKnown ? '' : m.role,
        photoUrl: m.photoUrl || '',
        photoPublicId: m.photoPublicId || '',
      });
    } catch (err) {
      localStorage.removeItem('memberToken');
      navigate('/member/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberRole');
    navigate('/member/login');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadPercent(0);
    setError('');

    try {
      const options = { maxSizeMB: 0.09, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const result = await uploadToCloudinary(compressedFile, (p) => setUploadPercent(p));
      setFormData(prev => ({ ...prev, photoUrl: result.url, photoPublicId: result.publicId }));
    } catch (err: any) {
      setError(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMsg('');

    const token = localStorage.getItem('memberToken');
    const finalRole = formData.role === 'Other' ? (formData.customRole.trim() || 'Other') : formData.role;

    try {
      await axios.put('/api/member-auth/me', {
        ...formData,
        role: finalRole,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);
    setError('');
    setSuccessMsg('');

    const token = localStorage.getItem('memberToken');
    try {
      await axios.put('/api/member-auth/me/password', passData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Password changed successfully!');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Password update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-950 text-white font-body selection:bg-gold-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-light mb-2">
              Member <span className="text-gold-400">Dashboard</span>
            </h1>
            <p className="text-white/40 uppercase tracking-[0.3em] text-xs">Manage your emerald identity</p>
          </motion.div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors uppercase tracking-widest text-[10px] bg-white/5 px-4 py-2 rounded-full border border-white/10"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>

        {/* Messaging Area */}
        <AnimatePresence>
          {(error || successMsg) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mb-10 p-5 rounded-lg border flex items-center gap-4 ${
                error ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}
            >
              <FaInfoCircle />
              <span className="text-sm font-medium">{error || successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left: Profile Photo Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-8"
          >
            <div className="glass-strong p-8 rounded-2xl border border-white/5 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative inline-block mb-8">
                <div className="w-48 h-60 rounded-xl bg-emerald-900/50 border border-white/10 overflow-hidden shadow-2xl relative">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-gold-500/20 font-display">
                      {formData.firstName[0]}
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center p-4">
                      <div className="w-12 h-12 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-4" />
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gold-500 transition-all duration-300" style={{ width: `${uploadPercent}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                
                <label className="absolute -bottom-4 -right-4 w-12 h-12 bg-gold-500 text-emerald-950 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-gold-400 transition-all transform hover:scale-110">
                  <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  <FaCamera />
                </label>
              </div>

              <h2 className="font-display text-2xl text-white font-medium mb-1 truncate leading-normal">
                {formData.firstName} {formData.lastName}
              </h2>
              <p className="text-gold-500/60 uppercase tracking-[0.2em] text-xs font-medium">
                {formData.role === 'Other' ? formData.customRole : formData.role}
              </p>
              
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-8">
                <div>
                   <p className="text-white/20 uppercase text-[9px] tracking-widest mb-1">Status</p>
                   <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Active</span>
                </div>
                <div>
                  <p className="text-white/20 uppercase text-[9px] tracking-widest mb-1">Joined</p>
                  <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
                    {new Date(profile.account.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border border-white/5">
               <div className="flex items-center gap-3 text-gold-500/60 mb-4">
                  <FaShieldAlt className="text-sm" />
                  <span className="uppercase text-[10px] tracking-[0.3em] font-bold">Privacy Note</span>
               </div>
               <p className="text-white/30 text-xs leading-loose">
                 Your password is encrypted and never shown to anyone, including administrators. 
                 Only your public profile info (name, role, and photo) is shared on the directory.
               </p>
            </div>
          </motion.div>

          {/* Right: Main Content (Tabs/Forms) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Profile Info Form */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-strong p-10 rounded-2xl border border-white/5"
            >
               <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                 <div className="w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center text-gold-500">
                   <FaUser />
                 </div>
                 <h3 className="font-display text-2xl text-white font-light mb-0">Public <span className="text-gold-400">Profile</span></h3>
               </div>

               <form onSubmit={handleProfileSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-gold-500/40">First Name</label>
                     <input
                       type="text"
                       className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded-sm"
                       value={formData.firstName}
                       onChange={e => setFormData({...formData, firstName: e.target.value})}
                       required
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-gold-500/40">Middle Name</label>
                     <input
                       type="text"
                       className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded-sm"
                       value={formData.middleName}
                       onChange={e => setFormData({...formData, middleName: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-gold-500/40">Last Name</label>
                     <input
                       type="text"
                       className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded-sm"
                       value={formData.lastName}
                       onChange={e => setFormData({...formData, lastName: e.target.value})}
                       required
                     />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-[10px] uppercase tracking-widest text-gold-500/40">Voice Role / Position</label>
                     <select
                       className="w-full bg-emerald-900 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded-sm"
                       value={formData.role}
                       onChange={e => setFormData({...formData, role: e.target.value})}
                       required
                     >
                       {VOICE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                     </select>
                   </div>
                   {formData.role === 'Other' && (
                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gold-500/40">Custom Role</label>
                        <input
                          type="text"
                          className="w-full bg-white/5 border border-gold-500/20 p-3 text-white focus:border-gold-500/50 outline-none rounded-sm"
                          value={formData.customRole}
                          placeholder="e.g. Lead Keyboardist"
                          onChange={e => setFormData({...formData, customRole: e.target.value})}
                          required
                        />
                     </div>
                   )}
                 </div>

                 <button
                   type="submit"
                   disabled={saving}
                   className="bg-gold-500 text-emerald-950 px-8 py-3 rounded-sm font-body font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-gold-400 transition-all disabled:opacity-50"
                 >
                   {saving ? <div className="w-3 h-3 border border-emerald-950/30 border-t-emerald-950 animate-spin rounded-full" /> : <FaSave />}
                   Save Profile Info
                 </button>
               </form>
            </motion.section>

            {/* Password Security Form */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-10 rounded-2xl border border-white/5"
            >
               <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
                 <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/40">
                   <FaLock />
                 </div>
                 <h3 className="font-display text-2xl text-white font-light tracking-wide mb-0">Security <span className="text-gold-400">& Privacy</span></h3>
               </div>

               <form onSubmit={handlePasswordSubmit} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 md:col-span-2">
                       <p className="text-white/40 text-xs tracking-widest uppercase mb-2">Change Account Password</p>
                       <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full bg-emerald-900/30 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded-sm transition-all"
                          value={passData.currentPassword}
                          onChange={e => setPassData({...passData, currentPassword: e.target.value})}
                          required
                       />
                    </div>
                    <input
                       type="password"
                       placeholder="New Password"
                       className="w-full bg-emerald-900/30 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded-sm transition-all"
                       value={passData.newPassword}
                       onChange={e => setPassData({...passData, newPassword: e.target.value})}
                       required
                    />
                    <input
                       type="password"
                       placeholder="Confirm New Password"
                       className="w-full bg-emerald-900/30 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none rounded-sm transition-all"
                       value={passData.confirmPassword}
                       onChange={e => setPassData({...passData, confirmPassword: e.target.value})}
                       required
                    />
                 </div>

                 <button
                   type="submit"
                   disabled={saving}
                   className="bg-transparent border border-white/10 text-white/40 px-8 py-3 rounded-sm font-body font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white hover:text-emerald-950 transition-all disabled:opacity-50"
                 >
                   Update Password
                 </button>
               </form>
            </motion.section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
