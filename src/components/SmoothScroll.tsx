import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Wraps the app in a Lenis smooth-scroll context.
 * Driven by requestAnimationFrame; integrates with framer-motion's useScroll
 * because Lenis still updates window.scrollY natively.
 */
const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
