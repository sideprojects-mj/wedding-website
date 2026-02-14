import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import heroImage from "@/assets/couple-hero.jpg";
import collage1 from "@/assets/collage-1.jpg";
import collage2 from "@/assets/collage-2.jpg";
import collage3 from "@/assets/collage-3.jpg";
import collage4 from "@/assets/collage-4.jpg";
import collage5 from "@/assets/collage-5.jpg";
import collage6 from "@/assets/collage-6.jpg";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollReveal from "@/components/ScrollReveal";
import CoupleAnimation from "@/components/CoupleAnimation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const WEDDING_DATE = new Date("2025-10-18T16:00:00");

const useCountdown = (target: Date) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
};

const Index = () => {
  const [loading, setLoading] = useState(true);
  const countdown = useCountdown(WEDDING_DATE);
  const collageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start start", "end end"],
  });

  const collageImages = [collage1, collage2, collage3, collage4, collage5, collage6];
  const totalWidth = collageImages.length * 520; // approx width per image + gap
  const x = useTransform(scrollYProgress, [0, 1], [0, -(totalWidth - (typeof window !== "undefined" ? window.innerWidth : 1200))]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={heroImage} alt="Couple" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/40" />
          </div>
          <motion.div
            className="relative z-10 text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: loading ? 0 : 1, y: loading ? 30 : 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-foreground/80 mb-4">We're getting married</p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-light text-foreground">
              Jessica & Andrew
            </h1>
            <div className="mt-8 flex items-center justify-center gap-6 text-foreground/80">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                October 18, 2025
              </span>
              <span className="w-px h-5 bg-foreground/30" />
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                The Grand Estate, Napa Valley
              </span>
            </div>
          </motion.div>
        </section>

        {/* Countdown */}
        <section className="py-20 bg-accent/30">
          <ScrollReveal>
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-8">Counting Down</p>
              <div className="flex justify-center gap-8 md:gap-12">
                {[
                  { val: countdown.days, label: "Days" },
                  { val: countdown.hours, label: "Hours" },
                  { val: countdown.minutes, label: "Minutes" },
                  { val: countdown.seconds, label: "Seconds" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <span className="text-4xl md:text-6xl font-serif text-primary">{item.val}</span>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Horizontal Scroll Collage */}
        <section ref={collageRef} className="relative" style={{ height: `${totalWidth}px` }}>
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
            <motion.div
              style={{ x }}
              className="flex gap-6 px-8"
            >
              {collageImages.map((src, i) => (
                <div
                  key={i}
                  className={`shrink-0 overflow-hidden rounded-sm ${
                    i % 3 === 2 ? "w-[340px] h-[500px]" : "w-[480px] h-[360px]"
                  }`}
                >
                  <img
                    src={src}
                    alt={`Our story ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Couple coming together animation */}
        <section className="bg-background">
          <ScrollReveal>
            <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground pt-16">
              Two hearts, one love
            </p>
          </ScrollReveal>
          <CoupleAnimation />
        </section>

        {/* CTA */}
        <section className="py-24 text-center bg-accent/20">
          <ScrollReveal>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-6">Join Us On Our Special Day</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We would be honored to have you celebrate with us.
            </p>
            <Link to="/rsvp">
              <Button size="lg" className="uppercase tracking-[0.2em] text-sm px-10">
                RSVP Now
              </Button>
            </Link>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
};

export default Index;
