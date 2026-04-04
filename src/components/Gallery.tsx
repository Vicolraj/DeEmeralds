import { motion } from 'framer-motion';

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 md:py-32 bg-emerald-950 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
           className="text-center mb-16"
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
         >
           <h2 className="font-display text-4xl md:text-6xl text-white font-light mb-4">
             Our <span className="text-gold-400">Gallery</span>
           </h2>
           <div className="section-divider" />
           <p className="font-body text-white/50 mt-6 max-w-xl mx-auto uppercase tracking-widest text-sm">
             Capturing moments of inspiration and harmony
           </p>
         </motion.div>

        {/* Gallery Content Holder */}
        {/* For the initial version, we will have a placeholder or a simple list */}
        <div className="flex flex-col items-center justify-center py-20 bg-emerald-900/10 rounded-xl border border-white/5">
             <span className="text-6xl mb-6">📸</span>
             <p className="font-display text-2xl text-white/40 mb-4 italic">Moments captured in song</p>
             <p className="font-body text-white/20 text-sm italic">Gallery management is available in the admin panel.</p>
        </div>
      </div>
    </section>
  );
}