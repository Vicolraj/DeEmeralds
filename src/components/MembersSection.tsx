import { motion } from 'framer-motion';
import MemberCard from './MemberCard';
import { useMembers } from '../hooks/useData';

export default function MembersSection() {
  const { members, loading, error } = useMembers();

  return (
    <section id="members" className="relative py-24 md:py-32 bg-gradient-dark overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

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
            Meet Our <span className="text-gold-400">Members</span>
          </h2>
          <div className="section-divider" />
          <p className="font-body text-white/50 mt-6 max-w-xl mx-auto">
            The talented voices and instrumentalists behind De Emeralds Perfect Expression
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="font-body text-white/40">Unable to load members at this time.</p>
          </div>
        )}

        {/* Members Grid — Masonry-style with varied sizes */}
        {!loading && !error && members.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {members.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && members.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body text-white/40">No members to display yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
