import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface CounterProps {
  target: number;
  label: string;
}

const Counter = ({ target, label }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (inView) {
      // animate from 0 to target and update local state on each frame
      controlsRef.current = animate(0, target, {
        duration: 2,
        ease: 'easeOut',
        onUpdate: (v) => setCount(Math.round(v)),
      });
    }

    return () => {
      // stop the animation if component unmounts
      controlsRef.current?.stop?.();
    };
  }, [inView, target]);

  return (
    <div ref={ref} className="counter-item">
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  );
};

export default Counter;