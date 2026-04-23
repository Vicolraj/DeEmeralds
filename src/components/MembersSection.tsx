import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemberCard from './MemberCard';
import { useMembers } from '../hooks/useData';
import SubtleNotes from './SubtleNotes';
import { FaTimes, FaExpandAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function MembersSection() {
  const { members, loading, error } = useMembers();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Dynamic Categories from Data
  const categories = useMemo(() => {
    const roles = members.map(m => (m.role || '').toLowerCase());
    
    const cats = ['All'];
    
    // Vocal Roles (Case-insensitive check)
    if (roles.some(r => r.includes('soprano'))) cats.push('Soprano');
    if (roles.some(r => r.includes('alto'))) cats.push('Alto');
    if (roles.some(r => r.includes('tenor'))) cats.push('Tenor');
    if (roles.some(r => r.includes('bass'))) cats.push('Bass');

    // Band Group Keywords
    const bandKeywords = ['keyboardist', 'drummer', 'guitarist', 'bassist', 'choreographer', 'band', 'instrumental'];
    if (roles.some(r => bandKeywords.some(kw => r.includes(kw)))) cats.push('Band');

    // Management Group Keywords
    const mgmtKeywords = ['ceo', 'director', 'administrator', 'management', 'coordinator'];
    if (roles.some(r => mgmtKeywords.some(kw => r.includes(kw)))) cats.push('Management');

    // Add any other unique role that isn't already grouped
    members.forEach(m => {
      const r = (m.role || '').trim();
      const lr = r.toLowerCase();
      // If it doesn't fit in standard groups, add its literal name as a category
      const isVoice = ['soprano', 'alto', 'tenor', 'bass'].some(v => lr.includes(v));
      const isBand = bandKeywords.some(kw => lr.includes(kw));
      const isMgmt = mgmtKeywords.some(kw => lr.includes(kw));

      if (!isVoice && !isBand && !isMgmt && !cats.includes(r) && r !== '') {
        cats.push(r);
      }
    });

    return cats;
  }, [members]);

  // Filter logic
  const filteredMembers = useMemo(() => {
    return [...members]
      .filter((member) => {
        const role = (member.role || '').toLowerCase();
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Band') {
          const bandKeywords = ['keyboardist', 'drummer', 'guitarist', 'bassist', 'choreographer', 'band', 'instrumental'];
          return bandKeywords.some(kw => role.includes(kw));
        }
        if (activeFilter === 'Management') {
          const mgmtKeywords = ['ceo', 'director', 'administrator', 'management', 'coordinator'];
          return mgmtKeywords.some(kw => role.includes(kw));
        }
        return role.includes(activeFilter.toLowerCase());
      })
      .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
  }, [members, activeFilter]);

  // Top subset for carousel
  const carouselMembers = filteredMembers.slice(0, 12);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const FilterBar = ({ className = "" }: { className?: string }) => (
    <div className={`flex justify-start md:justify-center mb-8 overflow-x-auto pb-4 hide-scrollbar ${className}`}>
      <div className="flex gap-3 px-6 bg-white/5 p-2 rounded-full border border-white/5 backdrop-blur-sm mx-auto md:mx-0 min-w-max">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-[10px] uppercase tracking-widest font-body transition-all duration-300 ${
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
  );

  return (
    <section id="members" className="relative py-12 md:py-24 bg-emerald-950 overflow-hidden">
      <SubtleNotes />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-700/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-7xl text-white font-light mb-6">
            Meet Our <span className="text-gold-400">Members</span>
          </h2>
          <div className="section-divider mx-auto mt-6" />
        </motion.div>

        {/* Filter Bar */}
        <FilterBar />

        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="font-body text-white/40">Unable to load members.</p>
          </div>
        )}

        {!loading && !error && filteredMembers.length > 0 && (
          <div className="relative group">
            {/* Nav Arrows */}
            <button 
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 rounded-full bg-emerald-900/90 border border-white/10 flex items-center justify-center text-gold-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-gold-500 hover:text-emerald-950 hidden md:flex shadow-xl"
            >
              <FaChevronLeft />
            </button>
            <button 
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 rounded-full bg-emerald-900/90 border border-white/10 flex items-center justify-center text-gold-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-gold-500 hover:text-emerald-950 hidden md:flex shadow-xl"
            >
              <FaChevronRight />
            </button>

            <motion.div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto hide-scrollbar pb-12 px-2 snap-x snap-mandatory"
            >
              <AnimatePresence mode="popLayout">
                {carouselMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 260, 
                      damping: 20,
                      delay: Math.min(index * 0.01, 0.1) 
                    }}
                    className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
                  >
                    <MemberCard member={member} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* See More Card */}
              <motion.div 
                className="flex-shrink-0 w-[200px] flex items-center justify-center snap-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-full bg-white/5 border border-dashed border-gold-500/30 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-emerald-950 transition-all duration-500">
                    <FaExpandAlt className="text-sm" />
                  </div>
                  <span className="font-body text-gold-500/40 text-[9px] uppercase tracking-[0.3em]">See More</span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}

        {!loading && !error && filteredMembers.length === 0 && (
          <div className="text-center py-20 bg-white/3 rounded-xl border border-dashed border-white/5">
            <p className="font-body text-white/20 text-xs uppercase tracking-widest">No members in this category.</p>
          </div>
        )}

        {!loading && (
          <div className="text-center">
             <button 
              onClick={() => setIsModalOpen(true)}
              className="text-gold-500/40 hover:text-gold-400 transition-colors font-body text-[10px] uppercase tracking-[0.4em] inline-flex items-center gap-4"
            >
              <div className="h-[1px] w-8 bg-current opacity-20" />
              Full Directory
              <div className="h-[1px] w-8 bg-current opacity-20" />
            </button>
          </div>
        )}
      </div>

      {/* Directory Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-emerald-950/98 backdrop-blur-2xl"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0 }}
              className="relative w-full max-w-7xl h-full bg-emerald-900/10 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-950/40">
                <div className="flex-1">
                  <h3 className="font-display text-4xl text-white font-light tracking-wide mb-2 leading-none">Member <span className="text-gold-400">Directory</span></h3>
                  <p className="font-body text-white/30 text-[10px] uppercase tracking-widest">Discover our full roster of talent</p>
                </div>
                
                {/* Embedded Filter in Modal */}
                <FilterBar className="!mb-0 md:scale-90 md:origin-right" />

                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-8 right-8 md:relative md:top-0 md:right-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:bg-white/10 hover:text-white transition-all border border-white/5"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
                <motion.div 
                  layout
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredMembers.map((member, index) => (
                      <motion.div
                        key={member.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <MemberCard member={member} index={index} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
