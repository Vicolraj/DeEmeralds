import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MembersTab from './admin/MembersTab.tsx';
import VideosTab from './admin/VideosTab.tsx';
import RehearsalsTab from './admin/RehearsalsTab.tsx';
import MemberAccountsTab from './admin/MemberAccountsTab.tsx';
import AdminsTab from './admin/AdminsTab.tsx';
import SettingsTab from './admin/SettingsTab.tsx';
import logo from '../assets/img/logo_nobg.webp';

type Tab = 'members' | 'videos' | 'rehearsals' | 'accounts' | 'admins' | 'settings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('members');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('de_emeralds_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('de_emeralds_token');
    navigate('/admin/login');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'members', label: 'Members' },
    { id: 'videos', label: 'Videos' },
    { id: 'rehearsals', label: 'Rehearsals' },
    { id: 'admins', label: 'Admins' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-emerald-950 text-white flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 h-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo} alt="De Emeralds" className="w-10 h-10" />
          <h1 className="font-display text-2xl tracking-wide hidden sm:block">
            De Emeralds <span className="text-gold-500">Admin</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
            <button
                onClick={() => navigate('/')}
                className="text-white/50 hover:text-white text-sm font-body uppercase tracking-widest transition-colors"
            >
                Public Site
            </button>
            <button
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-sm text-xs font-body uppercase tracking-widest border border-red-500/20 transition-all"
            >
                Log Out
            </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {/* Tabs Grid */}
        <div className="grid grid-cols-3 gap-2 mb-10 overflow-x-auto">
            {tabs.map(tab => (
                 <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`py-4 px-6 text-center border-b-2 transition-all font-body uppercase tracking-[.2em] text-xs whitespace-nowrap ${
                   activeTab === tab.id
                     ? 'border-gold-500 text-gold-500 bg-gold-500/5'
                     : 'border-transparent text-white/40 hover:text-white/60'
                 }`}
               >
                 {tab.label}
               </button>
            ))}
        </div>

        {/* Tab Content */}
        <main className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'members' && <MembersTab />}
              {activeTab === 'videos' && <VideosTab />}
              {activeTab === 'rehearsals' && <RehearsalsTab />}
              {activeTab === 'accounts' && <MemberAccountsTab />}
              {activeTab === 'admins' && <AdminsTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center">
            <p className="font-body text-white/20 text-xs uppercase tracking-widest italic">
                Portal securely managed by Vicolraj.
            </p>
      </footer>
    </div>
  );
}
