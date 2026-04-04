import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminUsers, createAdminUser, deleteAdminUser } from '../../lib/api';
import { FaTrash, FaTimes, FaUserShield, FaUserPlus } from 'react-icons/fa';

export default function AdminsTab() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAdminUsers();
      setAdmins(data);
    } catch (err) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminUser({ username, password });
      setIsModalOpen(false);
      setUsername('');
      setPassword('');
      fetchAdmins();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create admin.');
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (admins.length <= 1) {
        alert('Cannot delete the last administrator.');
        return;
    }
    if (confirm('Permanently revoke access for this user?')) {
      try {
        await deleteAdminUser(id);
        fetchAdmins();
      } catch (err) {
        alert('Failed to delete admin.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-lg border border-white/5">
        <h2 className="font-display text-2xl text-white font-light tracking-widest leading-normal mb-0">System Administrators</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 text-emerald-950 px-6 py-3 rounded-sm font-body uppercase text-xs tracking-widest font-bold hover:bg-gold-400 transition-colors"
        >
          <FaUserPlus /> New Administrator
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {admins.map((admin) => (
            <div key={admin.id} className="glass p-6 rounded-lg flex items-center justify-between group">
              <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <FaUserShield className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white font-medium leading-normal">{admin.username}</h3>
                    <p className="font-body text-white/30 text-xs uppercase tracking-widest mt-1">Role: {admin.role}</p>
                  </div>
              </div>
              <div className="flex items-center gap-10">
                <p className="font-body text-white/20 text-xs">Joined {new Date(admin.createdAt).toLocaleDateString()}</p>
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
                  title="Revoke Access"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass-strong border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="font-display text-2xl text-white font-light leading-normal mb-0">Create Admin Account</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddAdmin} className="p-8 space-y-6">
                <div>
                  <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Username</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E.g. chief_emerald"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Temporary Password</label>
                  <input
                    type="password"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gold-500 text-emerald-950 py-3 font-body font-bold uppercase tracking-[.2em] text-sm hover:bg-gold-400 transition-all duration-300"
                  >
                    Grant Access
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
