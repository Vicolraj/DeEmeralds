import React from 'react';
import { motion } from 'framer-motion';
import { DIVISIONS } from '../lib/constants';
import {
  FaMusic, FaGuitar, FaHeart, FaGraduationCap
} from 'react-icons/fa';
import SubtleNotes from './SubtleNotes';

const DIVISION_ICONS: Record<string, React.ReactElement> = {
  'De Emeralds Chorale':       <FaMusic className="text-3xl text-gold-500" />,
  'De Emeralds Entertainment': <FaGuitar className="text-3xl text-gold-500" />,
  'De Emeralds Charity':       <FaHeart className="text-3xl text-gold-500" />,
  'De Emeralds Academy':       <FaGraduationCap className="text-3xl text-gold-500" />,
};

export default function Divisions() {
  return (
    <section id="divisions" className="relative py-12 md:py-20 bg-gradient-section overflow-hidden">
      <SubtleNotes />
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(201, 168, 76, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(19, 92, 50, 0.3) 0%, transparent 50%)`,
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-7xl text-white font-light mb-6">
            Our <span className="text-gold-400">Divisions</span>
          </h2>
          <motion.div
            className="section-divider mt-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          />
          <p className="font-body text-white/50 mt-8 max-w-xl mx-auto text-lg tracking-wide">
            Four pillars of excellence under one extraordinary brand
          </p>
        </motion.div>

        {/* Division Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {DIVISIONS.map((division, index) => (
            <motion.div
              key={division.name}
              className="glass rounded-xl p-8 md:p-12 group hover:border-gold-500/30 transition-all duration-500 relative overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ delay: index * 0.1, duration: 0.7, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-gold-500/5 to-transparent pointer-events-none" />

              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-gold-500/10 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 transition-colors duration-500">
                {DIVISION_ICONS[division.name]}
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl md:text-3xl text-white font-light mb-2 group-hover:text-gold-400 transition-colors duration-300">
                {division.name}
              </h3>
              {'subtitle' in division && division.subtitle && (
                <p className="font-body text-gold-500/70 text-xs uppercase tracking-[0.25em] mb-5">
                  {division.subtitle}
                </p>
              )}

              {/* Description */}
              <p className="font-body text-white/60 leading-loose mt-4 text-base">
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
