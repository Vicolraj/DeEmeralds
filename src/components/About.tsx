import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { animate } from 'framer-motion';
import founderImg from '../assets/img/founder.jpg';
import { useMembers } from '../hooks/useData';

function Counter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const controls = animate(0, target, {
            duration: 2,
            ease: 'easeOut',
            onUpdate: (v) => setCount(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <h3 className="font-display text-4xl md:text-5xl text-gold-400 font-light">{count}+</h3>
      <p className="font-body text-white/50 text-sm uppercase tracking-[0.15em] mt-2">{label}</p>
    </div>
  );
}

export default function About() {
  const { members } = useMembers();

  return (
    <section id="about" className="relative py-24 md:py-32 bg-gradient-section overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(201, 168, 76, 0.15) 0%, transparent 50%)',
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
            About <span className="text-gold-400">De Emeralds</span>
          </h2>
          <div className="section-divider" />
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Founder Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={founderImg}
                alt="ICON (Dr) Olugbenga Obagbemi — Founder"
                className="w-full h-[500px] object-cover object-top"
              />
              <div className="absolute inset-0 border border-gold-500/20 rounded-lg" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 font-display text-white text-lg">
                ICON (Dr) Olugbenga Obagbemi
                <span className="block font-body text-gold-400/80 text-sm uppercase tracking-wider mt-1">Founder</span>
              </p>
            </div>
            {/* Decorative gold corner */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-gold-500/40 rounded-tl-lg" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-gold-500/40 rounded-br-lg" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          >
            <h3 className="font-display text-2xl md:text-3xl text-white font-light mb-6">
              Our Story
            </h3>
            <p className="font-body text-white/70 leading-relaxed mb-4">
              De Emeralds is more than just a choir; it is a <span className="text-gold-400 font-semibold">MULTI-AWARD WINNING</span> music group. We are a family united by a passion for music and a mission to inspire the world through harmony.
            </p>
            <p className="font-body text-white/70 leading-relaxed mb-4">
              Founded in 2005, we have grown from a small group of singers into a renowned ensemble, celebrated for our vibrant performances and dedication to musical excellence.
            </p>
            <p className="font-body text-white/60 leading-relaxed mb-10">
              Our journey is one of faith, friendship, and the relentless pursuit of creating beautiful music that touches hearts and uplifts spirits.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <Counter target={25} label="Songs" />
              <Counter target={members.length || 30} label="Members" />
              <Counter target={100} label="Events" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}