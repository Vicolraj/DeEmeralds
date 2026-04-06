import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemberCard from './MemberCard';
import { useMembers } from '../hooks/useData';
import SubtleNotes from './SubtleNotes';
import { FaTimes, FaExpandAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CATEGORIES = ['All', 'Soprano', 'Alto', 'Tenor', 'Bass', 'Band', 'Management'];

export default function MembersSection() {
  const { members, loading, error } = useMembers();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter logic
  const filteredMembers = members.filter((member) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Band') {
      return ['Keyboardist', 'Drummer', 'Guitarist', 'Bassist', 'Choreographer'].includes(member.role);
    }
    if (activeFilter === 'Management') {
      return ['CEO', 'Director', 'Music Director', 'Administrator'].includes(member.role);
    }
    return member.role.includes(activeFilter);
  });

  // Top subset for carousel (limit to 10 for performance)
  const carouselMembers = filteredMembers.slice(0, 10);


  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="members" className="relative py-12 md:py-20 bg-emerald-950 overflow-hidden">
      <SubtleNotes />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-7xl text-white font-light mb-6">
            Meet Our <span className="text-gold-400">Members</span>
          </h2>
          <motion.div
            className="section-divider mx-auto mt-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          />
        </motion.div>

        {/* Filter Bar */}
        <div className="flex justify-center mb-12 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4 px-4 bg-white/5 p-2 rounded-full border border-white/5 backdrop-blur-sm">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap text-xs uppercase tracking-widest font-body transition-all duration-300 ${
                  activeFilter === cat
                    ? 'bg-gold-500 text-emerald-950 font-bold shadow-lg shadow-gold-500/20'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

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

        {/* Carousel View */}
        {!loading && !error && filteredMembers.length > 0 && (
          <div className="relative group">
            {/* Desktop Navigation Arrows */}
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-emerald-900/80 border border-white/10 flex items-center justify-center text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-500 hover:text-emerald-950 hidden md:flex"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-emerald-900/80 border border-white/10 flex items-center justify-center text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-500 hover:text-emerald-950 hidden md:flex"
            >
              <FaChevronRight />
            </button>

            <motion.div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto hide-scrollbar pb-10 px-4"
              initial={false}
            >
              <AnimatePresence mode="popLayout">
                {carouselMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    className="flex-shrink-0 w-[280px] md:w-[320px]"
                  >
                    <MemberCard member={member} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* "See More" Card if more than 10 or just useful */}
              <motion.div 
                className="flex-shrink-0 w-[200px] flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-dashed border-gold-500/30 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-emerald-950 transition-all duration-500">
                    <FaExpandAlt />
                  </div>
                  <span className="font-body text-gold-500/60 text-xs uppercase tracking-[0.3em]">See More</span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredMembers.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
            <p className="font-body text-white/30 text-base uppercase tracking-widest">No members found in this category.</p>
          </div>
        )}

        {/* Full Directory CTA */}
        {!loading && (
          <div className="mt-4 text-center">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="text-gold-500/40 hover:text-gold-400 transition-colors font-body text-xs uppercase tracking-[0.4em] inline-flex items-center gap-3"
            >
              <div className="h-[1px] w-8 bg-current opacity-30" />
              View Full Directory
              <div className="h-[1px] w-8 bg-current opacity-30" />
            </button>
          </div>
        )}
      </div>

      {/* Full Directory Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-950/98 backdrop-blur-xl"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 1, y: 50, scale: 0.95 }}
              className="relative w-full max-w-7xl h-[90vh] bg-emerald-900/20 border border-white/10 rounded-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-emerald-950/50">
                <div>
                  <h3 className="font-display text-3xl text-white font-light tracking-wide mb-2 leading-none">Member <span className="text-gold-400">Directory</span></h3>
                  <p className="font-body text-white/40 text-xs uppercase tracking-widest">{activeFilter} Category ({filteredMembers.length})</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Content - Scrollable Grid */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredMembers.map((member, index) => (
                    <MemberCard key={member.id} member={member} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
