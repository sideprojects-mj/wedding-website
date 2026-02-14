import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Heart } from "lucide-react";

const CoupleAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.5, 1], [-120, -20, 0]);
  const rightX = useTransform(scrollYProgress, [0, 0.5, 1], [120, 20, 0]);
  const heartScale = useTransform(scrollYProgress, [0.4, 0.7, 1], [0, 0.5, 1]);
  const heartOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);

  return (
    <div ref={ref} className="relative flex items-center justify-center py-24 overflow-hidden">
      <motion.div
        style={{ x: leftX }}
        className="text-6xl md:text-8xl font-serif italic text-primary"
      >
        G
      </motion.div>
      <motion.div
        style={{ scale: heartScale, opacity: heartOpacity }}
        className="mx-4"
      >
        <Heart className="w-10 h-10 md:w-14 md:h-14 text-primary fill-primary" />
      </motion.div>
      <motion.div
        style={{ x: rightX }}
        className="text-6xl md:text-8xl font-serif italic text-primary"
      >
        M
      </motion.div>
    </div>
  );
};

export default CoupleAnimation;
