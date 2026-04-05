import { useEffect, useRef } from 'react';

export default function SubtleNotes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    setCanvasSize();

    const particles: { 
      x: number; 
      y: number; 
      size: number; 
      speedX: number; 
      speedY: number; 
      opacity: number; 
      pulse: number; 
      char: string;
      color: string;
    }[] = [];
    
    const count = 40;
    const chars = ['♪', '♫', '♬', '♩'];
    const colors = [
      '201, 168, 76',  // Gold
      '110, 180, 140', // Emerald-ish Light
      '180, 160, 100', // Muted Gold
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 14, // 14-22px
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.08 + 0.04, // Very subtle: 0.04 - 0.12
        pulse: Math.random() * Math.PI * 2,
        char: chars[Math.floor(Math.random() * chars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.01;
        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.font = `${p.size}px Cormorant Garamond, serif`;
        ctx.fillStyle = `rgba(${p.color}, ${currentOpacity})`;
        ctx.fillText(p.char, p.x, p.y);
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-0 opacity-60"
    />
  );
}
