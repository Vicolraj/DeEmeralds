import { motion } from 'framer-motion';
import { DIVISIONS } from '../lib/constants';

export default function Divisions() {
  return (
    <section id="divisions" className="relative py-24 md:py-32 bg-gradient-section overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(201, 168, 76, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(19, 92, 50, 0.3) 0%, transparent 50%)`,
      }} />

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
            Our <span className="text-gold-400">Divisions</span>
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/50 mt-6 max-w-xl mx-auto">
            Four pillars of excellence under one extraordinary brand
          </p>
        </motion.div>

        {/* Division Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {DIVISIONS.map((division, index) => (
            <motion.div
              key={division.name}
              className="glass rounded-xl p-8 md:p-10 group hover:border-gold-500/30 transition-all duration-500 relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.7, ease: 'easeOut' }}
              whileHover={{ y: -5 }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />

              {/* Icon */}
              <span className="text-4xl mb-4 block">{division.icon}</span>

              {/* Title */}
              <h3 className="font-display text-2xl md:text-3xl text-white font-light mb-1 group-hover:text-gold-400 transition-colors duration-300">
                {division.name}
              </h3>
              {'subtitle' in division && division.subtitle && (
                <p className="font-body text-gold-500/70 text-sm uppercase tracking-[0.2em] mb-4">
                  {division.subtitle}
                </p>
              )}

              {/* Description */}
              <p className="font-body text-white/60 leading-relaxed mt-3">
                {division.description}
              </p>

              {/* Bottom gold line */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-gold-500 to-gold-600 group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
