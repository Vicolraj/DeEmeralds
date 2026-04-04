import { motion } from 'framer-motion';
import type { Member } from '../lib/types';

interface MemberCardProps {
  member: Member;
  index: number;
}

export default function MemberCard({ member, index }: MemberCardProps) {
  const fullName = [member.firstName, member.middleName, member.lastName]
    .filter(Boolean)
    .join(' ');

  // Fallback placeholder if no photo
  const hasPhoto = member.photoUrl && member.photoUrl.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -10 }}
      className="relative overflow-hidden rounded-lg group cursor-pointer"
      style={{ aspectRatio: '3 / 4' }}
    >
      {/* Photo */}
      {hasPhoto ? (
        <img
          src={member.photoUrl!}
          alt={fullName}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-emerald-900 flex items-center justify-center">
          <span className="font-display text-5xl text-gold-500/30">
            {member.firstName?.[0]}{member.lastName?.[0]}
          </span>
        </div>
      )}

      {/* Gradient overlay — always at bottom, never on face */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Gold border on hover */}
      <div className="absolute inset-0 border-2 border-gold-500/0 group-hover:border-gold-500/70 transition-all duration-500 rounded-lg" />

      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_-80px_60px_-40px_rgba(201,168,76,0.15)]" />

      {/* Name & role — anchored to bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
        <p className="font-display text-white text-lg font-semibold leading-tight drop-shadow-lg">
          {fullName}
        </p>
        <p className="font-body text-gold-400 text-xs uppercase tracking-[0.2em] mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}
