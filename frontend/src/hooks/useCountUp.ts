'use client';

import { useState, useEffect, useRef } from 'react';

export function useCountUp(endValue: number, durationMs: number = 1000) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const animated = useRef(false);

  useEffect(() => {
    let animationFrameId: number;

    if (endValue === 0) {
      setCount(0);
      return;
    }

    if (animated.current) {
      setCount(endValue);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
            // easeOutExpo
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeOut * endValue));
            if (progress < 1) {
              animationFrameId = window.requestAnimationFrame(step);
            } else {
              setCount(endValue);
            }
          };
          animationFrameId = window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [endValue, durationMs]);

  return { count, elementRef };
}
