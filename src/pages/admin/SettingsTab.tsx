import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaFacebookF, FaTiktok, FaTwitter, FaInstagram,
  FaYoutube, FaSpotify, FaApple,
  FaPlus, FaTrash, FaSave, FaLink
} from 'react-icons/fa';
import { getStats, updateStats, getAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } from '../../lib/api';

const ALL_PLATFORMS = [
  { key: 'facebook',    label: 'Facebook',    icon: <FaFacebookF /> },
  { key: 'instagram',   label: 'Instagram',   icon: <FaInstagram /> },
  { key: 'twitter',     label: 'Twitter / X', icon: <FaTwitter /> },
  { key: 'youtube',     label: 'YouTube',     icon: <FaYoutube /> },
  { key: 'tiktok',      label: 'TikTok',      icon: <FaTiktok /> },
  { key: 'spotify',     label: 'Spotify',     icon: <FaSpotify /> },
  { key: 'apple-music', label: 'Apple Music', icon: <FaApple /> },
];

export default function SettingsTab() {
  // Stats
  const [songsCount, setSongsCount] = useState(25);
  const [eventsCount, setEventsCount] = useState(100);
  const [statsSaving, setStatsSaving] = useState(false);

  // Socials
  const [socials, setSocials] = useState<any[]>([]);
  const [socialsLoading, setSocialsLoading] = useState(true);
  const [newPlatformKey, setNewPlatformKey] = useState('facebook');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    getStats().then(s => {
      if (s) {
        setSongsCount(s.songsCount || 25);
        setEventsCount(s.eventsCount || 100);
      }
    });
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    try {
      const data = await getAllSocialLinks();
      setSocials(data);
    } finally {
      setSocialsLoading(false);
    }
  };

  const handleStatsSave = async () => {
    setStatsSaving(true);
    try {
      await updateStats({ songsCount, eventsCount });
      alert('Stats updated!');
    } catch {
      alert('Failed to update stats.');
    } finally {
      setStatsSaving(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const platform = ALL_PLATFORMS.find(p => p.key === newPlatformKey);
    if (!platform || !newUrl) return;
    try {
      await createSocialLink({
        platform: platform.label,
        url: newUrl,
        iconKey: newPlatformKey,
        displayOrder: socials.length,
      });
      setNewUrl('');
      fetchSocials();
    } catch {
      alert('Failed to add link.');
    }
  };

  const handleUpdateUrl = async (id: number, url: string) => {
    try {
      await updateSocialLink(id, { url });
      fetchSocials();
    } catch {
      alert('Failed to update link.');
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm('Delete this social link?')) return;
    try {
      await deleteSocialLink(id);
      fetchSocials();
    } catch {
      alert('Failed to delete link.');
    }
  };

  return (
    <div className="space-y-12">

      {/* ── Stats Section ─────────────────────── */}
      <div className="bg-white/5 p-8 rounded-xl border border-white/5 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <h2 className="font-display text-2xl text-white font-light tracking-widest">Site Statistics</h2>
        </div>
        <p className="font-body text-white/40 text-sm">These numbers animate in the About section and update live from here.</p>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-3">Songs Released</label>
            <input
              type="number"
              value={songsCount}
              onChange={e => setSongsCount(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 p-4 text-white text-2xl font-display focus:border-gold-500/50 outline-none transition-colors rounded-sm"
            />
          </div>
          <div>
            <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-3">Events Performed</label>
            <input
              type="number"
              value={eventsCount}
              onChange={e => setEventsCount(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 p-4 text-white text-2xl font-display focus:border-gold-500/50 outline-none transition-colors rounded-sm"
            />
          </div>
        </div>

        <motion.button
          onClick={handleStatsSave}
          disabled={statsSaving}
          className="flex items-center gap-3 bg-gold-500 text-emerald-950 px-8 py-3 font-body uppercase text-xs tracking-widest font-bold hover:bg-gold-400 transition-colors rounded-sm disabled:opacity-50"
          whileTap={{ scale: 0.97 }}
        >
          <FaSave /> {statsSaving ? 'Saving…' : 'Save Statistics'}
        </motion.button>
      </div>

      {/* ── Social Links Section ──────────────── */}
      <div className="bg-white/5 p-8 rounded-xl border border-white/5 space-y-8">
        <div>
          <h2 className="font-display text-2xl text-white font-light tracking-widest mb-2">Social Media Links</h2>
          <p className="font-body text-white/40 text-sm">Icons appear on the site <span className="text-gold-400">only when a URL is set</span>. Leave blank or delete to hide.</p>
        </div>

        {/* Existing links */}
        {socialsLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {socials.map(s => {
              const platform = ALL_PLATFORMS.find(p => p.key === s.iconKey);
              return (
                <div key={s.id} className="flex items-center gap-4 glass p-4 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 flex-shrink-0">
                    {platform?.icon || <FaLink />}
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-white/50 text-xs uppercase tracking-widest mb-2">{s.platform}</p>
                    <input
                      type="url"
                      defaultValue={s.url || ''}
                      onBlur={e => handleUpdateUrl(s.id, e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-3 py-2 text-white text-sm focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteLink(s.id)}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new link */}
        <form onSubmit={handleAddLink} className="flex gap-4 pt-4 border-t border-white/5">
          <select
            value={newPlatformKey}
            onChange={e => setNewPlatformKey(e.target.value)}
            className="bg-white/5 border border-white/10 px-4 py-3 text-white font-body text-sm focus:border-gold-500/50 outline-none transition-colors rounded-sm"
          >
            {ALL_PLATFORMS.map(p => (
              <option key={p.key} value={p.key} className="bg-emerald-950">{p.label}</option>
            ))}
          </select>
          <input
            type="url"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-gold-500/50 outline-none transition-colors rounded-sm"
            placeholder="https://your-profile-url.com"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-gold-500 text-emerald-950 px-6 py-3 font-body uppercase text-xs tracking-widest font-bold hover:bg-gold-400 transition-colors rounded-sm"
          >
            <FaPlus /> Add
          </button>
        </form>
      </div>
    </div>
  );
}
