'use client';

import { useEffect, useState } from 'react';
import { useSpring } from 'framer-motion';

interface CountUpProps {
  value: number;
  active?: boolean;
  duration?: number;
  formatter?: (n: number) => string;
}

export function CountUp({ value, active = true, duration = 1.8, formatter }: CountUpProps) {
  const spring = useSpring(0, { stiffness: 40, damping: 18, duration });
  const [display, setDisplay] = useState(formatter ? formatter(0) : '0');

  useEffect(() => {
    spring.set(active ? value : 0);
  }, [value, active, spring]);

  useEffect(() => {
    return spring.on('change', (v) => {
      const n = Math.round(v);
      setDisplay(formatter ? formatter(n) : n.toLocaleString());
    });
  }, [spring, formatter]);

  return <>{display}</>;
}
