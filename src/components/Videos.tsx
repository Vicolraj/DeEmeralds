import { motion } from 'framer-motion';
import { useVideos } from '../hooks/useData';
import SubtleNotes from './SubtleNotes';

export default function Videos() {
  const { videos, loading, error } = useVideos();

  return (
    <section id="videos" className="relative py-20 md:py-32 bg-emerald-950 overflow-hidden">
      <SubtleNotes />
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-7xl text-white font-light mb-6">
            Watch Us <span className="text-gold-400">Perform</span>
          </h2>
          <motion.div
            className="section-divider mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          />
          <p className="font-body text-white/50 mt-10 max-w-xl mx-auto uppercase tracking-[0.3em] text-sm">
            Experience the energy and harmony of De Emeralds
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-24">
            <p className="font-body text-white/40 text-lg">Unable to load videos at this time.</p>
          </div>
        )}

        {/* Videos Grid */}
        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                className="group relative"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div 
                  className="relative aspect-video overflow-hidden rounded-xl shadow-2xl glass transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-gold-500/10"
                  data-lenis-prevent
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title || 'De Emeralds Performance'}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="mt-5 px-1">
                  <h3 className="font-display text-xl text-white/90 font-medium group-hover:text-gold-400 transition-colors duration-300">
                    {video.title}
                  </h3>
                  <div className="w-0 h-[1px] bg-gold-500/50 group-hover:w-full transition-all duration-500 mt-3" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-24">
            <p className="font-body text-white/40 text-lg">No videos to display yet.</p>
          </div>
        )}

        {/* View More Button */}
        <div className="mt-20 text-center">
          <motion.a
            href="https://youtube.com/@DeEmeraldsPerfectExpression"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-4 border border-gold-500 text-gold-500 font-body text-sm uppercase tracking-[.2em] hover:bg-gold-500 hover:text-emerald-950 transition-all duration-300 rounded-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View More on YouTube
          </motion.a>
        </div>
      </div>
    </section>
  );
}
