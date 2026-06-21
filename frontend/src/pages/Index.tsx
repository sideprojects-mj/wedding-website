import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ChevronDown, ExternalLink, MapPin } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MinimalNav from "@/components/MinimalNav";
import SmoothScroll from "@/components/SmoothScroll";

import crest from "@/assets/wedding-crest.png";
import hero2 from "@/assets/hero2 copimproved.jpg";
import p1 from "@/assets/benchStanding improved.jpg";
import p2 from "@/assets/bridgeLooking improved.jpg";
import p4 from "@/assets/bridgeStanding.JPG";
import p6 from "@/assets/ringChest.JPG";
import churchImage from "@/assets/churchImage.png";
import venueImage from "@/assets/venueImage improved.png";

const WEDDING_DATE = new Date("2026-09-26T16:30:00");
const REGISTRY_URL = "https://www.crateandbarrel.com/gift-registry/";

/* ---------------- Reveal helper ---------------- */
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ---------------- Hero ---------------- */
type HeroCollagePhoto = {
  src: string;
  alt: string;
  left: string;
  top: string;
  width: string;
  height: string;
  from: "left" | "right";
  start: number;
  end: number;
};

const HERO_COLLAGE_PHOTOS: HeroCollagePhoto[] = [
  {
    src: p1,
    alt: "Mark and Grace together",
    left: "5vw",
    top: "12vh",
    width: "24vw",
    height: "32vh",
    from: "left",
    start: 0,
    end: 0.58,
  },
  {
    src: p2,
    alt: "Coastal sunset",
    left: "9vw",
    top: "50vh",
    width: "22vw",
    height: "22vh",
    from: "left",
    start: 0,
    end: 0.72,
  },
  {
    src: p4,
    alt: "Travel memory",
    left: "71vw",
    top: "30vh",
    width: "22vw",
    height: "23vh",
    from: "right",
    start: 0,
    end: 0.64,
  },
  {
    src: p6,
    alt: "Cliffside view",
    left: "68vw",
    top: "58vh",
    width: "25vw",
    height: "32vh",
    from: "right",
    start: 0,
    end: 0.86,
  },
];

const HeroCollagePhotoItem = ({
  photo,
  progress,
}: {
  photo: HeroCollagePhoto;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const fromX = photo.from === "left" ? -36 : 36;
  const x = useTransform(progress, [photo.start, photo.end], [fromX, 0], {
    clamp: true,
  });
  const y = useTransform(progress, [photo.start, photo.end], [18, 0], {
    clamp: true,
  });
  return (
    <motion.figure
      style={{
        left: photo.left,
        top: photo.top,
        width: photo.width,
        height: photo.height,
        x: useTransform(x, (value) => `${value}vw`),
        y,
      }}
      className="absolute z-40 overflow-hidden rounded-[22px] bg-cream shadow-[0_30px_70px_-30px_hsl(25_25%_18%/0.45)] will-change-transform md:rounded-[28px]"
    >
      <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" />
    </motion.figure>
  );
};

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const easedProgress = useSpring(scrollYProgress, {
    stiffness: 34,
    damping: 18,
    mass: 1.15,
    restDelta: 0.0005,
  });
  const heroWidth = useTransform(easedProgress, [0, 0.7], ["100vw", "42vw"]);
  const heroHeight = "100vh";
  const borderRadius = useTransform(easedProgress, [0, 0.58], ["0px", "36px"]);
  const backdropOpacity = useTransform(easedProgress, [0.05, 0.58], [0, 1]);
  const heroShadow = useTransform(
    easedProgress,
    [0, 0.7],
    [
      "0 0 0 0 hsl(25 25% 18% / 0)",
      "0 34px 80px -34px hsl(25 25% 18% / 0.45)",
    ]
  );
  const titleOpacity = useTransform(easedProgress, [0, 0.4], [1, 0]);
  const titleY = useTransform(easedProgress, [0, 0.7], [0, -36]);
  const promptOpacity = useTransform(easedProgress, [0, 0.36], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative w-full bg-cream"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ opacity: backdropOpacity }} className="absolute inset-0 bg-cream" />

        <div className="absolute inset-0 z-10 flex items-start justify-center">
          <motion.div
            style={{
              width: heroWidth,
              height: heroHeight,
              borderRadius,
              boxShadow: heroShadow,
            }}
            className="relative overflow-hidden bg-sepia origin-center will-change-transform"
          >
            <img
              src={hero2}
              alt="Mark and Grace"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-sepia/20" />
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-40">
          {HERO_COLLAGE_PHOTOS.map((photo) => (
            <HeroCollagePhotoItem key={photo.src} photo={photo} progress={easedProgress} />
          ))}
        </div>

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="absolute bottom-[12vh] left-0 right-0 z-30 px-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[14vw] md:text-[12vw] lg:text-[10vw] leading-[0.9] text-cream lowercase tracking-[-0.02em]"
            style={{ textShadow: "0 4px 30px hsl(25 25% 18% / 0.5)" }}
          >
            grace <span className="italic font-serif">&amp;</span> mark
          </motion.h1>
        </motion.div>

        <motion.div
          style={{ opacity: promptOpacity }}
          className="absolute bottom-6 right-8 z-30 flex items-center gap-2 text-cream/85"
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
          <span className="text-[10px] uppercase tracking-eyebrow">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};

const scheduleItems = [
  {
    time: "3:30 PM-4:30 PM",
    title: "Nuptial Mass",
    venue: "Sts. Peter & Paul Catholic Church",
    address: "386 N Castell Avenue, New Braunfels, TX 78130",
    note: "Please arrive 15 minutes before Mass begins"
  },
  {
    time: "5:00 PM-6:00 PM",
    title: "Cocktail Hour",
    venue: "The Gardens of Cranesbury View",
    address: "1470 S Cranes Mill Rd, New Braunfels, TX 78132",
    note: "Attire: Spring Black Tie",
  },
  {
    time: "6:00 PM-12:00 AM",
    title: "Reception",
    venue: "The Gardens of Cranesbury View",
    address: "1470 S Cranes Mill Rd, New Braunfels, TX 78132",
    note: "Dinner, drinks, and dancing",
  },
];

type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  length: number;
  rotation: number;
  spin: number;
  color: string;
  shape: "rect" | "circle" | "heart";
  tick: number;
  ttl: number;
};

const ScheduleConfetti = ({ triggerRef }: { triggerRef: React.RefObject<HTMLElement> }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hasBurstRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const trigger = triggerRef.current;
    if (!canvas || !trigger) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let particles: ConfettiParticle[] = [];
    const colors = ["#8c5f59", "#9b6a5f", "#a98f63", "#b8a779", "#79645a"];

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const holdScroll = () => {
      const lockedY = window.scrollY;
      const stop = (event: Event) => event.preventDefault();
      const stopKeys = (event: KeyboardEvent) => {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
          event.preventDefault();
        }
      };
      let releaseFrame = 0;
      const keepStill = () => {
        window.scrollTo(0, lockedY);
        releaseFrame = requestAnimationFrame(keepStill);
      };

      window.addEventListener("wheel", stop, { passive: false });
      window.addEventListener("touchmove", stop, { passive: false });
      window.addEventListener("keydown", stopKeys);
      keepStill();

      window.setTimeout(() => {
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchmove", stop);
        window.removeEventListener("keydown", stopKeys);
        if (releaseFrame) cancelAnimationFrame(releaseFrame);
      }, 1900);
    };

    const getBurstY = () => {
      const rect = trigger.getBoundingClientRect();
      return Math.min(height * 0.62, Math.max(height * 0.22, rect.top + rect.height * 0.45));
    };

    const addBurst = (originX: number, originY: number, angle: number) => {
      const spread = 58;

      for (let index = 0; index < 54; index += 1) {
        const theta = ((angle + (Math.random() - 0.5) * spread) * Math.PI) / 180;
        const velocity = 16 + Math.random() * 12;

        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(theta) * velocity,
          vy: -Math.sin(theta) * velocity,
          size: 2 + Math.random() * 3.5,
          length: 5 + Math.random() * 7,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.28,
          color: colors[index % colors.length],
          shape: index % 9 === 0 ? "heart" : index % 5 === 0 ? "circle" : "rect",
          tick: 0,
          ttl: 225 + Math.random() * 55,
        });
      }
    };

    const drawHeart = (particle: ConfettiParticle) => {
      ctx.font = `${particle.size * 2.2}px serif`;
      ctx.fillText("♥", -particle.size, particle.size);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles = particles.filter((particle) => {
        particle.tick += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.988;
        particle.vy = particle.vy * 0.988 + 0.18;
        particle.rotation += particle.spin;

        const progress = particle.tick / particle.ttl;
        const opacity = progress < 0.72 ? 0.72 : Math.max(0, 0.72 * (1 - (progress - 0.72) / 0.28));
        if (opacity <= 0 || particle.y > height + 80) return false;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 0;

        if (particle.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size * 0.7, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.shape === "heart") {
          drawHeart(particle);
        } else {
          ctx.fillRect(-particle.length / 2, -particle.size / 2, particle.length, particle.size);
        }

        ctx.restore();
        return true;
      });

      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        animationFrame = 0;
      }
    };

    const pop = () => {
      holdScroll();
      const originY = getBurstY();
      addBurst(0, originY, 24);
      addBurst(width, originY, 156);
      window.setTimeout(() => {
        const followUpY = getBurstY();
        addBurst(0, followUpY, 20);
        addBurst(width, followUpY, 160);
        if (!animationFrame) animationFrame = requestAnimationFrame(draw);
      }, 220);

      if (!animationFrame) animationFrame = requestAnimationFrame(draw);
    };

    const maybePop = () => {
      if (hasBurstRef.current) return;
      const suppressUntil = Number(window.sessionStorage.getItem("suppress-countdown-confetti-until") || 0);
      if (suppressUntil > Date.now()) return;
      const rect = trigger.getBoundingClientRect();
      const triggerCenter = rect.top + rect.height / 2;
      if (triggerCenter <= height * 0.52 && triggerCenter >= height * 0.12) {
        hasBurstRef.current = true;
        pop();
        window.removeEventListener("scroll", maybePop);
      }
    };

    resize();
    maybePop();
    window.addEventListener("scroll", maybePop, { passive: true });
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      window.removeEventListener("scroll", maybePop);
      window.removeEventListener("resize", resize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [triggerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <canvas
        ref={canvasRef}
        className="fixed left-0 top-0 h-dvh w-full pointer-events-none"
      />
    </div>
  );
};

const Schedule = () => {
  return (
    <section id="schedule" className="relative overflow-hidden bg-cream px-6 pb-8 pt-20 md:pb-16 md:pt-48">
      <div className="relative z-30 mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="font-serif text-3xl uppercase tracking-[0.28em] text-sepia md:text-4xl">
            Schedule
          </p>
          <p className="mt-4 font-serif text-lg uppercase tracking-[0.32em] text-sepia/85 md:text-2xl">
            September 26, 2026
          </p>
        </Reveal>

        <div className="relative mx-auto mt-10 w-fit max-w-full pl-10 pr-4 md:mt-20 md:pl-14 md:pr-10">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 left-4 top-8 w-px origin-top bg-sepia/35 md:left-6"
          />
          {scheduleItems.map((item, index) => (
            <div
              key={item.title}
              className="relative"
            >
              <Reveal delay={0.12 * index}>
                <div className="relative py-8 md:py-12">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.65, delay: 0.14 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-[-30px] top-[3.15rem] z-10 h-3 w-3 rounded-full bg-sepia shadow-[0_0_0_7px_hsl(var(--cream))] md:left-[-38px] md:top-[3.65rem]"
                  />
                  <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.9, delay: 0.26 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="text-left"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
                      <h2 className="font-serif text-2xl uppercase tracking-[0.24em] text-sepia md:text-3xl">
                        {item.title}
                      </h2>
                      <p className="font-serif text-base uppercase tracking-[0.22em] text-sepia/65 md:text-lg">
                        {item.time}
                      </p>
                    </div>
                    <div className="mt-5 space-y-2 font-serif text-lg leading-relaxed tracking-[0.04em] text-sepia/80 md:text-xl">
                      <p>{item.venue}</p>
                      <p>{item.address}</p>
                    </div>
                    <p className="mt-5 font-serif text-lg italic tracking-[0.04em] text-sepia/70 md:text-xl">
                      {item.note}
                    </p>
                  </motion.div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------- Countdown ---------------- */
const useCountdown = (target: Date) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
};

/* ---------------- Venue ---------------- */
const Venue = () => {
  const countdownNumbersRef = useRef<HTMLDivElement | null>(null);
  const c = useCountdown(WEDDING_DATE);
  const blocks = [
    { val: c.days, label: "Days" },
    { val: c.hours, label: "Hours" },
    { val: c.minutes, label: "Minutes" },
    { val: c.seconds, label: "Seconds" },
  ];
  return (
    <section
      id="rsvp"
      className="relative overflow-hidden bg-cream px-6 pb-20 pt-10 text-center md:pb-32 md:pt-16"
    >
      <ScheduleConfetti triggerRef={countdownNumbersRef} />

      <div className="relative z-30">
        <Reveal className="relative z-30">
          <p className="font-serif italic text-4xl md:text-6xl text-sepia">counting down...</p>
          <h3 className="mt-8 font-display text-4xl md:text-7xl text-sepia tracking-display lowercase">
            september 26, 2026
          </h3>
        </Reveal>

        <div ref={countdownNumbersRef}>
          <Reveal delay={0.1} className="relative z-30 mt-10 flex justify-center items-center gap-3 md:mt-14 md:gap-8">
            {blocks.map((b, i) => (
              <div key={b.label} className="flex items-center gap-3 md:gap-8">
                <div className="text-center min-w-[60px] md:min-w-[90px]">
                  <div className="font-serif text-4xl md:text-7xl text-sepia tabular-nums">{b.val}</div>
                  <div className="text-[10px] uppercase tracking-eyebrow text-sepia/60 mt-2">
                    {b.label}
                  </div>
                </div>
                {i < blocks.length - 1 && (
                  <span className="font-serif text-3xl md:text-5xl text-gold">:</span>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.2} className="relative z-30 mt-14 mx-auto max-w-6xl md:mt-24">
        <p className="font-serif text-3xl text-sepia md:text-5xl">the places</p>
        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-2 md:gap-8">
          {[
            {
              title: "Mass",
              label: "Sts. Peter & Paul Catholic Church",
              image: churchImage,
              alt: "Church ceremony interior",
              from: -96,
              mapUrl:
                "https://www.google.com/maps/place/Saints+Peter+and+Paul+Catholic+Church/@29.7036657,-98.130954,17z/data=!3m1!4b1!4m6!3m5!1s0x865cbd5dd764fa1b:0x265f59428d234969!8m2!3d29.7036657!4d-98.1283791!16s%2Fg%2F1hf30w23q?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D",
            },
            {
              title: "Reception",
              label: "The Gardens of Cranesbury View",
              image: venueImage,
              alt: "Outdoor wedding venue courtyard",
              from: 96,
              mapUrl:
                "https://www.google.com/maps/place/The+Gardens+of+Cranesbury+View/@29.7803159,-98.2784274,17z/data=!3m1!4b1!4m6!3m5!1s0x865c9b0d875d757d:0x4d85e746cb693e83!8m2!3d29.7803159!4d-98.2758525!16s%2Fg%2F1tdfz467?entry=ttu&g_ep=EgoyMDI2MDYwMS4wIKXMDSoASAFQAw%3D%3D",
            },
          ].map((place, index) => (
            <motion.figure
              key={place.title}
              initial={{ opacity: 0, x: place.from }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.05, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-left"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[8px] shadow-[var(--shadow-soft)] md:aspect-[5/6]">
                <img src={place.image} alt={place.alt} className="h-full w-full object-cover" />
              </div>
              <figcaption className="mt-6">
                <p className="text-xs uppercase tracking-eyebrow text-gold">{place.title}</p>
                <h4 className="mt-2 font-serif text-3xl text-sepia md:text-4xl">{place.label}</h4>
                <a
                  href={place.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm uppercase tracking-eyebrow text-sepia/70 transition-colors hover:text-gold"
                >
                  <MapPin className="h-4 w-4" />
                  New Braunfels, Texas
                </a>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        {/*<p className="mt-12 text-xs uppercase tracking-eyebrow text-sepia/60">*/}
        {/*  RSVP coming soon ;)*/}
        {/*</p>*/}
        {/*<p className="mt-12 max-w-xl mx-auto text-sepia/75 italic font-serif text-lg md:text-2xl leading-relaxed">*/}
        {/*  The vision for the night is simple: all of our most beloved people in one place that happens to have flowing drinks, good music, and an unforgettable dance floor.*/}
        {/*</p>*/}
      </Reveal>
    </section>
  );
};

/* ---------------- Registry ---------------- */
const registryItems = [
  {
    name: "Crate & Barrel",
    image:
      "https://cb.scene7.com/is/image/Crate/OrgTurkishPIvBlStrHndTwlSHF25/$web_plp_card$/260606071332/OrgTurkishPIvBlStrHndTwlSHF25.jpg",
    link: "https://www.crateandbarrel.com/gift-registry/grace-bascon-and-mark-josephs/r7507079",
    detail: "$$"
  },
  {
    name: "Bloomingdales",
    image:
      "https://slimages.macysassets.com/is/image/BLM/products/4/optimized/11916254_fpx.tif?qlt=85,0&resMode=sharp2&op_usm=1.75,0.3,2,0&fmt=webp&wid=422&hei=528",
    link: "https://www.bloomingdales.com/registry/Grace-Bascon-Mark-Josephs/1345321",
    detail: "$$$"
  },
];

const Registry = () => (
  <section id="registry" className="bg-cream px-6 pb-16 pt-8 md:pb-36 md:pt-16">
    <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
      <Reveal className="text-left">
        <p className="text-xs uppercase tracking-eyebrow text-gold">registry</p>
        <h2 className="mt-5 font-serif text-5xl lowercase leading-none text-sepia md:text-7xl">
          for our home
        </h2>
        <div className="mt-9 flex flex-col items-start gap-3">
          <a
            href="https://www.bloomingdales.com/registry/Grace-Bascon-Mark-Josephs/1345321"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-sepia px-7 py-3 text-xs uppercase tracking-eyebrow text-cream transition-transform duration-300 hover:scale-105"
          >
            Bloomingdales
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="https://www.crateandbarrel.com/gift-registry/grace-bascon-and-mark-josephs/r7507079"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-sepia px-7 py-3 text-xs uppercase tracking-eyebrow text-cream transition-transform duration-300 hover:scale-105"
          >
            Crate & Barrel
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </Reveal>

      <motion.div
          initial={{opacity: 0, y: 40}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, amount: 0.25}}
          transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
          className="overflow-hidden rounded-[8px] border border-sepia/10 bg-background shadow-[var(--shadow-soft)]"
      >
        <div className="flex items-center justify-between border-b border-sepia/10 bg-cream/70 px-5 py-4">
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sepia/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-sepia/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-sepia/15" />
          </div>
          {/*<p className="text-[10px] uppercase tracking-[0.24em] text-sepia/55">*/}
          {/*  crate &amp; barrel*/}
          {/*</p>*/}
        </div>

        <div className="p-5 md:p-7">
          <div className="flex items-end justify-between gap-6 border-b border-sepia/10 pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-eyebrow text-gold">Mark &amp; Grace</p>
              <h3 className="mt-2 font-serif text-3xl text-sepia md:text-4xl">Wedding Registry</h3>
            </div>
            <p className="hidden text-right text-xs uppercase tracking-[0.18em] text-sepia/45 sm:block">
              09.26.26
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4">
            {registryItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.75, delay: 0.12 * index, ease: [0.22, 1, 0.36, 1] }}
                className="group border border-sepia/10 bg-cream/50 p-3 text-left transition-colors duration-300 hover:border-gold/50"
              >
                <div className="aspect-square overflow-hidden bg-background">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 inline-flex items-center gap-2 font-serif text-lg text-sepia transition-colors group-hover:text-gold">
                  <span>{item.name}</span>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-sepia/45">
                  {item.detail}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);


/* ---------------- Wedding Party ---------------- */
const groomsmen = [
  { name: "Jack Josephs", relation: "Best Man" },
  { name: "Sharbel Habchy", relation: "Best Man" },
  { name: "Chris Josephs", relation: "Groomsman" },
  { name: "Michael Josephs", relation: "Groomsman" },
  { name: "Patrick Josephs", relation: "Groomsman" },
  { name: "Franciso Rios", relation: "Groomsman" },
  { name: "Nate Dorsey", relation: "Groomsman" },
  { name: "Andrew Kelly", relation: "Groomsman" },
];

const bridalParty = [
  { name: "Lucy Safranek", relation: "Maid of Honor" },
  { name: "Miriam Skinner", relation: "Maid of Honor" },
  { name: "Noemi Hernandez", relation: "Bridesmaid" },
  { name: "Olivia Mihaliak", relation: "Bridesmaid" },
  { name: "Daisy Trujillo", relation: "Bridesmaid" },
  { name: "Sam Ketter", relation: "Bridesmaid" },
  { name: "Abigail Doyle", relation: "Bridesmaid" },
  { name: "Caroline Dodson", relation: "Bridesmaid" },
];

const WeddingParty = () => {
  const maxRows = Math.max(bridalParty.length, groomsmen.length);
  const rows = Array.from({ length: maxRows }, (_, index) => ({
    bridal: bridalParty[index],
    groom: groomsmen[index],
  }));

  return (
    <section id="wedding-party" className="bg-background px-4 py-14 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-cream/40 px-5 py-10 text-center shadow-[0_28px_80px_-60px_hsl(var(--sepia)/0.5)] md:px-12 md:py-20"
        >
          <div className="pointer-events-none absolute inset-4 border border-sepia/25" />
          <div className="pointer-events-none absolute inset-6 border border-sepia/15" />

          <div className="relative mx-auto max-w-3xl">
            <p className="text-[10px] uppercase tracking-eyebrow text-gold">wedding party</p>
            <h2 className="mt-5 font-serif text-5xl lowercase leading-none text-sepia md:text-7xl">
              by our side
            </h2>
          </div>

          <div className="relative mx-auto mt-10 max-w-5xl md:mt-20">
            <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-sepia/20 md:block" />
            <div className="space-y-8 md:space-y-14">
              {rows.map((row, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.55 }}
                  transition={{ duration: 0.8, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-2 items-center gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-14"
                >
                  <WeddingPartyPerson person={row.bridal} align="" />
                  <div className="mx-auto hidden h-16 w-px bg-sepia/25 md:block" />
                  <WeddingPartyPerson person={row.groom} align="" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WeddingPartyPerson = ({
  person,
  align,
}: {
  person?: { name: string; relation: string };
  align: string;
}) => {
  if (!person) return <div className={`min-h-[4.5rem] min-w-0 text-center md:min-h-[5.25rem] ${align}`} />;

  const nameParts = person.name.split(" ");
  const firstLine = nameParts.slice(0, -1).join(" ");
  const lastLine = nameParts[nameParts.length - 1];

  return (
    <div className={`min-h-[4.5rem] min-w-0 text-center md:min-h-[5.25rem] ${align}`}>
      <p className="font-serif text-[clamp(1.3rem,5vw,1.85rem)] leading-[0.95] tracking-[0.01em] text-sepia md:whitespace-nowrap md:text-[clamp(1.7rem,2.65vw,2.65rem)] md:leading-none md:tracking-[0.03em]">
        <span className="block md:inline">{firstLine}</span>
        <span className="hidden md:inline"> </span>
        <span className="block md:inline">{lastLine}</span>
      </p>
      <p className="mt-2 font-serif text-base leading-tight text-sepia/75 md:mt-3 md:text-2xl md:leading-none">
        {person.relation}
      </p>
    </div>
  );
};
/* ---------------- Travel ---------------- */
const hotelBlocks = [
  {
    name: "Hacienda del Rio",
    discountCode: "b580004",
    deadline: "Please book by August 11, 2026",
    address1: "10 minute drive from the Church",
    address2: "18 minute drive from the Venue",
    note: "We recommend active adults or parents with children book here. Checkout their ammenities on the website. This hotel is quintessentially New Braunfels.",
    bookingUrl: "https://hotels.cloudbeds.com/en/reservation/ggRyKI/?allotment_block_code=b580004&currency=usd&checkin=2026-09-25&checkout=2026-09-27",
  },
  {
    name: "Petit Cowboy",
    discountCode: "Coming soon",
    deadline: "Please book by August 11, 2026",
    address1: "8 minute drive from the Church",
    address2: "19 minute drive the from the Venue",
    note: "Coming Soon",
    bookingUrl: "#",
  },
  {
    name: "Courtyard by Marriott",
    discountCode: "FJWFJWA",
    deadline: "Please book by August 11, 2026",
    address1: "8 minute drive from the Church",
    address2: "19 minute drive the from the Venue",
    bookingUrl: "https://www.marriott.com/event-reservations/reservation-link.mi?id=1779807943464&key=GRP&app=resvlink",
    note: "We recommend the Courtyard by Marriott New Braunfels for its convenient location, comfortable accommodations, and trusted service.",
  },
];

const Hotel = () => (
  <section id="travel" className="bg-cream px-6 py-16 md:py-36">
    <div className="mx-auto max-w-6xl">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-eyebrow text-gold">hotels</p>
        <h2 className="mt-5 font-serif text-5xl lowercase leading-none text-sepia md:text-7xl">
          hotel accomodations
        </h2>
        <p className="mx-auto mt-7 max-w-2xl font-serif text-xl italic leading-relaxed text-sepia/70 md:text-2xl">
          We have reserved room blocks nearby for anyone traveling in for the weekend.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {hotelBlocks.map((hotel, index) => (
          <motion.article
            key={hotel.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.85, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col border border-sepia/10 bg-background p-5 text-left shadow-[var(--shadow-soft)] md:p-6"
          >
            <p className="text-[10px] uppercase tracking-eyebrow text-gold">room block</p>
            <h3 className="mt-4 font-serif text-3xl leading-tight text-sepia">
              {hotel.name}
            </h3>
            <div className="mt-6 space-y-4 border-y border-sepia/10 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-sepia/100">Discount Code</p>
                <p className="mt-1 font-serif text-lg leading-snug text-sepia">{hotel.discountCode}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-sepia/100">Deadline</p>
                <p className="mt-1 font-serif text-lg leading-snug text-sepia">{hotel.deadline}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-sepia/90">Location</p>
                <p className="mt-1 font-serif text-lg leading-snug text-sepia">{hotel.address1}</p>
                <p className="mt-1 font-serif text-lg leading-snug text-sepia">{hotel.address2}</p>
              </div>
            </div>
            <div className="mt-auto min-h-[4.75rem] pt-5">
              {hotel.note && (
                <p className="text-sm leading-relaxed text-sepia/65">{hotel.note}</p>
              )}
              {hotel.bookingUrl !== "#" && (
                <a
                  href={hotel.bookingUrl}
                  className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-sepia transition-colors hover:text-gold"
                >
                  Booking details
                </a>
              )}
              {hotel.details && (
                <p className="mt-3 text-sm leading-relaxed text-sepia/65">{hotel.details}</p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);


/* ---------------- Airports ---------------- */
const airportBlocks = [
  {
    name: "Austin-Bergstrom International",
    code: "AUS",
    distance: "About 55 minutes to New Braunfels",
    location: "Austin, Texas",
  },
  {
    name: "San Antonio International",
    code: "SAT",
    distance: "About 40 minutes to New Braunfels",
    location: "San Antonio, Texas",
  },
];

const Airports = () => (
  <section id="airports" className="bg-background px-6 py-16 md:py-32">
    <div className="mx-auto max-w-6xl">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-eyebrow text-gold">airports</p>
        <h2 className="mt-5 font-serif text-5xl lowercase leading-none text-sepia md:text-7xl">
          flying in
        </h2>
        <p className="mx-auto mt-7 max-w-2xl font-serif text-xl italic leading-relaxed text-sepia/70 md:text-2xl">
          New Braunfels sits between Austin and San Antonio, so either airport works.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {airportBlocks.map((airport, index) => (
          <motion.article
            key={airport.code}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.28 }}
            transition={{ duration: 0.85, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="border border-sepia/10 bg-cream p-6 text-left shadow-[var(--shadow-soft)] md:p-8"
          >
            <p className="text-[10px] uppercase tracking-eyebrow text-gold">{airport.code}</p>
            <h3 className="mt-4 font-serif text-3xl leading-tight text-sepia md:text-4xl">
              {airport.name}
            </h3>
            <div className="mt-7 space-y-4 border-t border-sepia/10 pt-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sepia/90">Drive</p>
                <p className="mt-1 font-serif text-xl leading-snug text-sepia">{airport.distance}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sepia/90">Location</p>
                <p className="mt-1 font-serif text-xl leading-snug text-sepia">{airport.location}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- FAQ ---------------- */
const faqs = [
  {
    q: "What time should I arrive at the church?",
    a: "The Mass begins promptly at 3:30 p.m. We kindly ask that you arrive 15 minutes before the Mass to allow yourself plenty of time to find your seat comfortably.",
  },
  {
    q: "Is there a dress code?",
    a: `We kindly ask our guests to wear black-tie optional, with a preference for colorful gowns for the women. While gowns and tuxedos are preferred, formal dresses and suits with ties are also welcome.

Ladies, we warmly invite you to embrace vibrant, colorful attire. We welcome all patterns, textures, and summer hues. Kindly avoid black to reflect the joyful spirit of the occasion.

If you follow Filipino tradition, we invite you to wear a barong.`,
  },
  {
    q: "When should I RSVP by?",
    a: "Please RSVP by August 22nd.",
  },
  {
    q: "How far is the reception venue from the church?",
    a: "The venue is an 18-minute drive from the church. New Braunfels is small!",
  },
  {
    q: "Can I take photos during the Mass?",
    a: "We have hired an amazing photographer whom we trust completely to capture the beauty and glory of the Mass. We kindly ask that you refrain from taking photos until the reception. If you're curious, Isabella Macias is our photographer.",
  },
  {
    q: "Can I bring a guest?",
    a: "Anyone is welcome to attend the Mass. However, due to limited seating at the reception, we are only able to accommodate guests listed on your invitation.",
  },
  {
    q: "Will the reception be outside?",
    a: "The ceremony and reception will be held indoors. Cocktail hour will take place outdoors under an awning. The venue is beautiful and we invite guests to explore the small gardens, which were inspired by those at Versailles.",
  },
  {
    q: "What's the weather like in late September?",
    a: "The Texas Hill Country in late September is typically in the low 90s during the day and the high 70s in the evenings.",
  },
  {
    q: "When will the reception end?",
    a: "The reception will conclude at 12 a.m.",
  },
];

const FAQ = () => (
  <section id="faq" className="px-6 py-20 bg-background md:py-32">
    <Reveal className="text-center mb-12">
      <p className="text-xs uppercase tracking-eyebrow text-gold mb-4">just in case</p>
      <h2 className="font-serif text-5xl md:text-7xl text-sepia lowercase">
        questions &amp; answers
      </h2>
      <p className="mt-6 text-sm text-sepia/60">
        Can't find the answer here?{" "}
        <a
          href="mailto:thejosephswedding26@gmail.com"
          className="underline underline-offset-4 hover:text-gold transition-colors"
        >
          Reach out to Mark or Grace
        </a>
      </p>
    </Reveal>

    <Reveal className="max-w-2xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-b border-sepia/15">
            <AccordionTrigger className="font-serif text-xl md:text-2xl text-sepia text-left hover:no-underline hover:text-gold py-6">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-line text-sepia/75 leading-relaxed text-base">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  </section>
);

/* ---------------- Closing pinned card ----------------
 * Sticky scene mirroring tessakevin.com closing: a rounded photo card with
 * cream margins. The card scales/zooms slightly as the user scrolls past;
 * the quote crossfades in at the apex.
 */
const Closing = () => (
  <section className="relative h-screen w-full overflow-hidden bg-cream">
    <img
      src={hero2}
      alt="Mark and Grace"
      className="absolute inset-0 w-full h-full object-cover grayscale"
    />
    <div className="absolute inset-0 bg-sepia/45" />
    <Reveal className="absolute inset-0 flex items-center justify-center px-6 text-center">
      <p className="font-serif italic text-3xl md:text-6xl lg:text-6xl text-cream leading-tight max-w-4xl">
        Thank You! <br/>
        We are so excited to get everyone we love together to celebrate our union and we hope to see you there.
      </p>
    </Reveal>
  </section>
);

const PrayerNote = () => (
  <section className="bg-cream px-6 py-12 text-center md:py-16">
    <Reveal className="mx-auto max-w-3xl">
      <p className="text-[10px] uppercase tracking-eyebrow text-gold">prayer request</p>
      <p className="mt-5 font-serif text-xl italic leading-relaxed text-sepia/75 md:text-2xl">
        If you are interested in praying for us, we ask you to pray to the patron saints of our marriage: Mary, St. Joseph, Sts. Louis Martin and Marie-Azelie Guerin, parents of St. Therese of Lisieux.
      </p>
    </Reveal>
  </section>
);

/* ---------------- Footer ---------------- */
const Footer = () => (
  <footer className="py-14 text-center bg-cream md:py-20">
    <img src={crest} alt="" className="w-24 mx-auto opacity-70 mb-6" />
    <p className="text-[10px] uppercase tracking-eyebrow text-sepia/50">
      — mark &amp; grace · 09 · 26 · 26 —
    </p>
  </footer>
);

/* ---------------- Page ---------------- */
const Index = () => {
  useEffect(() => {
    document.title = "Mark & Grace · September 26, 2026";
  }, []);

  return (
    <SmoothScroll>
      <MinimalNav />
      <main className="bg-background overflow-x-clip">
        <Hero />
        <Schedule />
        
        <Venue />
        <Hotel />
        <Airports />
        <Registry />
        <WeddingParty />
        <FAQ />
        <Closing />
        <PrayerNote />
        <Footer />
      </main>
    </SmoothScroll>
  );
};

export default Index;
