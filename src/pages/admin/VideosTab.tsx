import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVideos, createVideo, deleteVideo } from '../../lib/api';
import type { YouTubeVideo } from '../../lib/types';
import { FaPlus, FaTrash, FaTimes, FaYoutube } from 'react-icons/fa';

export default function VideosTab() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [videoId, setVideoId] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const data = await getVideos();
      setVideos(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoId) return;

    try {
      await createVideo({ videoId, title: title || undefined });
      setIsModalOpen(false);
      setVideoId('');
      setTitle('');
      fetchVideos();
    } catch (err) {
      alert('Failed to add video.');
    }
  };

  const handleDeleteVideo = async (id: number) => {
    if (confirm('Remove this video?')) {
      try {
        await deleteVideo(id);
        fetchVideos();
      } catch (err) {
        alert('Failed to remove video.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-lg border border-white/5">
        <h2 className="font-display text-2xl text-white font-light tracking-widest leading-normal mb-0">Video Gallery Management</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gold-500 text-emerald-950 px-6 py-3 rounded-sm font-body uppercase text-xs tracking-widest font-bold hover:bg-gold-400 transition-colors"
        >
          <FaPlus /> Add YouTube Video
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="glass p-4 rounded-lg group">
              <div className="relative aspect-video bg-black rounded overflow-hidden mb-4">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <FaYoutube className="text-4xl text-red-600 opacity-80" />
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="font-display text-lg text-white font-medium truncate mb-1 leading-normal">
                    {video.title ?? 'Untitled Performance'}
                  </p>
                  <code className="text-gold-500/40 text-xs truncate block">{video.videoId}</code>
                </div>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
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
                <h3 className="font-display text-2xl text-white font-light leading-normal mb-0">Add YouTube Video</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddVideo} className="p-8 space-y-6">
                <div>
                  <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Video Title</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Hallelujah Chorus Live"
                  />
                </div>
                <div>
                  <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">YouTube Video ID</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    placeholder="E.g. pvmU1eEo140"
                    required
                  />
                  <p className="text-[10px] text-white/30 italic mt-2">Find the ID in the video URL after 'v='</p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gold-500 text-emerald-950 py-3 font-body font-bold uppercase tracking-[.2em] text-sm hover:bg-gold-400 transition-all duration-300"
                  >
                    Add to Gallery
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
