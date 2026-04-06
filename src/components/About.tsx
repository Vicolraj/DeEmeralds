import { useEffect, useRef, useState } from 'react';
import { motion, animate } from 'framer-motion';
import founderImg from '../assets/img/founder.jpg';
import { useMembers, useStats } from '../hooks/useData';
import SubtleNotes from '../components/SubtleNotes';

function Counter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const controls = animate(0, target, {
            duration: 2,
            ease: 'easeOut',
            onUpdate: (v) => setCount(Math.round(v)),
          });
          return () => controls.stop();
        } else {
            setCount(0); // Reset for re-animation
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <h3 className="font-display text-4xl md:text-5xl lg:text-6xl text-gold-400 font-light">{count}+</h3>
      <p className="font-body text-white/50 text-xs md:text-sm uppercase tracking-[0.2em] mt-3">{label}</p>
    </div>
  );
}

export default function About() {
  const { members } = useMembers();
  const { stats } = useStats();

  return (
    <section id="about" className="relative py-12 md:py-16 bg-gradient-section overflow-hidden">
      <SubtleNotes />
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(201, 168, 76, 0.15) 0%, transparent 50%)',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-4xl md:text-7xl text-white font-light mb-6">
            About <span className="text-gold-400">De Emeralds</span>
          </h2>
          <motion.div 
            className="section-divider mt-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5, ease: "circOut" }}
          />
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Founder Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img
                src={founderImg}
                alt="ICON (Dr) Olugbenga Obagbemi — MD/CEO"
                className="w-full h-[600px] object-cover object-top filter grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 border border-gold-500/20 rounded-lg" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 font-display text-white">
                <p className="text-2xl md:text-3xl font-light tracking-wide mb-1">ICON (Dr) Olugbenga Obagbemi</p>
                <span className="block font-body text-gold-500/80 text-sm uppercase tracking-[0.3em] font-medium">MD/CEO</span>
              </div>
            </div>
            {/* Decorative gold corner */}
            <div className="absolute -top-5 -left-5 w-20 h-20 border-t-2 border-l-2 border-gold-500/40 rounded-tl-xl" />
            <div className="absolute -bottom-5 -right-5 w-20 h-20 border-b-2 border-r-2 border-gold-500/40 rounded-br-xl" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="space-y-6">
                <h3 className="font-display text-3xl md:text-4xl text-white font-light">
                Our Story
                </h3>
                <p className="font-body text-white/70 text-lg leading-relaxed">
                De Emeralds is more than just a choir; it is a <span className="text-gold-400 font-semibold italic">MULTI-AWARD WINNING</span> music group. We are a family united by a passion for music and a mission to inspire the world through harmony.
                </p>
                <p className="font-body text-white/70 text-lg leading-relaxed">
                Founded in 2005, we have grown from a small group of singers into a renowned ensemble, celebrated for our vibrant performances and dedication to musical excellence.
                </p>
                <p className="font-body text-white/60 text-lg leading-relaxed italic">
                Our journey is one of faith, friendship, and the relentless pursuit of creating beautiful music that touches hearts and uplifts spirits.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-10 pt-16 border-t border-white/10">
              <Counter target={stats?.songsCount || 25} label="Songs" />
              <Counter target={members.length || 30} label="Members" />
              <Counter target={stats?.eventsCount || 100} label="Events" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}