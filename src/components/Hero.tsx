import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import heroBg from '../assets/img/hero-bg.jpg';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Gold shimmer particles
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; pulse: number; char: string }[] = [];
    const count = Math.min(150, Math.floor(window.innerWidth / 8));
    const chars = ['♪', '♫', '♬', '♩'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 20, // 20–40px
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.2 + 0.1, // Max 0.3 — very subtle as requested
        pulse: Math.random() * Math.PI * 2,
        char: chars[Math.floor(Math.random() * chars.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.textAlign = 'center';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '16px serif';
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.015;
        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.font = `${p.size}px Cormorant Garamond, serif`;
        ctx.fillStyle = `rgba(201, 168, 76, ${currentOpacity})`;
        ctx.fillText(p.char, p.x, p.y);
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const cleanup = initParticles();

    // Parallax background
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        yPercent: 35,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Letter-by-letter title reveal
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll('.hero-letter');
      gsap.fromTo(
        letters,
        { opacity: 0, y: 60, rotationX: 90 },
        {
          opacity: 1, y: 0, rotationX: 0,
          stagger: 0.04, duration: 1.2,
          ease: 'power3.out', delay: 3,
        }
      );
    }

    return cleanup;
  }, [initParticles]);

  const titleText = 'De Emeralds';
  const subtitleText = 'Perfect Expression';

  return (
    <section id="hero" ref={sectionRef} className="relative h-screen overflow-hidden bg-emerald-950">
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-emerald-950/40 to-emerald-950" />

      {/* Gold shimmer particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-10">
        <h1 ref={titleRef} className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white font-light tracking-wider leading-[1.1]" style={{ perspective: '1000px' }}>
          {/* First line */}
          <span className="block mb-4">
            {titleText.split('').map((char, i) => (
              <span
                key={`t1-${i}`}
                className="hero-letter inline-block opacity-0"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
          {/* Second line */}
          <span className="block text-gold-400 text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-4">
            {subtitleText.split('').map((char, i) => (
              <span
                key={`t2-${i}`}
                className="hero-letter inline-block opacity-0"
                style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        </h1>

        {/* Division tags */}
        <motion.p
          className="mt-14 font-body text-white/50 text-sm md:text-lg tracking-[0.4em] uppercase"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.8, duration: 1 }}
        >
          Chorale · Live Band · Charity · Academy
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5.2, duration: 1 }}
        >
          <a
            href="#members"
            className="px-8 py-3.5 border border-gold-500/60 text-gold-400 font-body font-medium hover:bg-gold-500 hover:text-emerald-950 transition-all duration-400 tracking-[0.15em] text-sm uppercase rounded-sm hover:shadow-lg hover:shadow-gold-500/20"
          >
            Meet Our Members
          </a>
          <a
            href="#videos"
            className="px-8 py-3.5 bg-gold-500 text-emerald-950 font-body font-semibold hover:bg-gold-400 transition-all duration-400 tracking-[0.15em] text-sm uppercase rounded-sm hover:shadow-lg hover:shadow-gold-500/30"
          >
            Watch Us Perform
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.5, duration: 1 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="font-body text-white/40 text-xs uppercase tracking-[0.2em]">Scroll</span>
            <motion.div
              className="w-[1px] h-8 bg-gradient-to-b from-gold-500/60 to-transparent"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}