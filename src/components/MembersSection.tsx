import { motion } from 'framer-motion';
import MemberCard from './MemberCard';
import { useMembers } from '../hooks/useData';
import SubtleNotes from './SubtleNotes';

export default function MembersSection() {
  const { members, loading, error } = useMembers();

  return (
    <section id="members" className="relative py-20 md:py-32 bg-emerald-950 overflow-hidden">
      <SubtleNotes />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

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
            Meet Our <span className="text-gold-400">Members</span>
          </h2>
          <motion.div
            className="section-divider mt-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          />
          <p className="font-body text-white/50 mt-10 max-w-xl mx-auto text-lg tracking-wide">
            The talented voices and instrumentalists behind De Emeralds Perfect Expression
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
            <p className="font-body text-white/40 text-lg">Unable to load members at this time.</p>
          </div>
        )}

        {/* Members Grid */}
        {!loading && !error && members.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {members.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && members.length === 0 && (
          <div className="text-center py-24">
            <p className="font-body text-white/40 text-lg">No members to display yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}
