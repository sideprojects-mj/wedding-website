import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MinimalNav from "@/components/MinimalNav";
import SmoothScroll from "@/components/SmoothScroll";
import PhotoLightbox from "@/components/PhotoLightbox";

import crest from "@/assets/wedding-crest.png";
import heroImg from "@/assets/couple-hero.jpg";
import p1 from "@/assets/collage-1.jpg";
import p2 from "@/assets/collage-2.jpg";
import p3 from "@/assets/collage-3.jpg";
import p4 from "@/assets/collage-4.jpg";
import p5 from "@/assets/collage-5.jpg";
import p6 from "@/assets/collage-6.jpg";

const WEDDING_DATE = new Date("2026-09-26T15:00:00");

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

/* ---------------- Hero with letterbox-on-scroll ----------------
 * Sticky 200vh section. As user scrolls, the photo crops in from
 * the cream background (top + bottom letterbox bars grow), the
 * names fade out, and the next section flows underneath.
 */
const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Letterbox bars 0 → 18vh
  const barHeight = useTransform(scrollYProgress, [0, 1], ["0vh", "22vh"]);
  // Names fade & rise
  const namesY = useTransform(scrollYProgress, [0, 0.6], [0, -120]);
  const namesOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  // Image gentle scale
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  // Side bars too — full letterbox crop effect like tessakevin.com
  const sideWidth = useTransform(scrollYProgress, [0, 1], ["0vw", "6vw"]);

  return (
    <section ref={ref} id="top" className="relative h-[180vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-cream">
        {/* Cropped image */}
        <motion.div style={{ scale: imgScale }} className="absolute inset-0">
          <img src={heroImg} alt="Mark and Grace" className="w-full h-full object-cover" />
        </motion.div>

        {/* Top letterbox bar (cream) */}
        <motion.div
          style={{ height: barHeight }}
          className="absolute top-0 left-0 right-0 bg-cream z-20 pointer-events-none"
        />
        {/* Bottom letterbox bar */}
        <motion.div
          style={{ height: barHeight }}
          className="absolute bottom-0 left-0 right-0 bg-cream z-20 pointer-events-none"
        />
        {/* Side bars */}
        <motion.div
          style={{ width: sideWidth }}
          className="absolute top-0 bottom-0 left-0 bg-cream z-20 pointer-events-none"
        />
        <motion.div
          style={{ width: sideWidth }}
          className="absolute top-0 bottom-0 right-0 bg-cream z-20 pointer-events-none"
        />

        {/* Crest centered, above the photo */}
        <motion.div
          style={{ y: namesY, opacity: namesOpacity }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
        >
          <motion.img
            src={crest}
            alt="Mark & Grace crest"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="w-44 md:w-60 lg:w-72 drop-shadow-[0_8px_30px_hsl(25_25%_18%/0.3)]"
          />
        </motion.div>

        {/* Massive script names — bottom of hero */}
        <motion.div
          style={{ y: namesY, opacity: namesOpacity }}
          className="absolute bottom-[12vh] left-0 right-0 z-10 px-6 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[14vw] md:text-[12vw] lg:text-[10vw] leading-[0.9] text-cream lowercase tracking-[-0.02em]"
            style={{ textShadow: "0 4px 30px hsl(25 25% 18% / 0.5)" }}
          >
            mark <span className="italic font-serif">&amp;</span> grace
          </motion.h1>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          style={{ opacity: namesOpacity }}
          className="absolute bottom-6 right-8 z-10 flex items-center gap-2 text-cream/80"
        >
          <ChevronDown className="w-4 h-4 animate-bounce" />
          <span className="text-[10px] uppercase tracking-eyebrow">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------------- Horizontal photo scroll-pin ----------------
 * Pins for ~250vh and translates a horizontal track of "moments"
 * across the screen. Each card has a label like Greece Sunset, etc.
 */
const moments = [
  { src: p1, label: "Hill Country" },
  { src: p2, label: "Coffee, always" },
  { src: p3, label: "Road trips" },
  { src: p4, label: "Sunday mornings" },
  { src: p5, label: "Late nights" },
  { src: p6, label: "& everything in between" },
];

const HorizontalPhotos = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Translate track from 0 to -75% (so the last card lands on the right)
  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-75%"]);
  const smoothX = useSpring(x, { damping: 30, stiffness: 80, mass: 0.5 });

  return (
    <section ref={ref} className="relative h-[260vh] bg-background">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x: smoothX }} className="flex gap-8 md:gap-14 will-change-transform">
          {moments.map((m, i) => (
            <div key={i} className="shrink-0 flex flex-col">
              <div className="w-[60vw] md:w-[42vw] lg:w-[32vw] aspect-[4/5] overflow-hidden bg-muted">
                <img src={m.src} alt={m.label} className="w-full h-full object-cover" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-eyebrow text-sepia/60 font-serif italic lowercase">
                {m.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ---------------- Cordially invited ---------------- */
const Invitation = () => (
  <section className="py-32 md:py-44 px-6 text-center bg-cream">
    <Reveal>
      <p className="font-serif italic text-4xl md:text-6xl lg:text-7xl text-sepia leading-tight">
        you're <span className="text-gold">cordially</span> invited
      </p>
    </Reveal>
    <Reveal delay={0.2}>
      <p className="mt-8 text-xs md:text-sm uppercase tracking-[0.5em] text-sepia/60">
        to the adventure that is...
      </p>
    </Reveal>
  </section>
);

/* ---------------- Love story ---------------- */
const stages = [
  {
    title: "stage 1: where it began",
    text: "we met as kids running around the same Texas town — neighbors, classmates, friends long before anything else.",
    photos: [
      { src: p1, caption: "the very beginning ❤" },
      { src: p2, caption: "small town summers" },
    ],
  },
  {
    title: "stage 2: growing up together",
    text: "high school formals, summer road trips, late-night drives down the same back roads. somewhere in there it stopped being friendship.",
    photos: [
      { src: p3, caption: "the year it all clicked" },
      { src: p4, caption: "first apartment vibes" },
    ],
  },
  {
    title: "stage 3: the proposal",
    text: "a sunset, a ring, a yes that wasn't really a question. and a whole lot of happy tears.",
    photos: [
      { src: p5, caption: "she said yes 💍" },
      { src: p6, caption: "the rest was a blur" },
    ],
  },
];

const LoveStory = ({
  onPhotoClick,
}: {
  onPhotoClick: (src: string, caption: string) => void;
}) => (
  <section className="py-24 md:py-32 px-6 bg-background">
    <Reveal className="text-center mb-20">
      <p className="text-xs uppercase tracking-eyebrow text-gold mb-4">the chapters</p>
      <h2 className="font-serif text-5xl md:text-7xl text-sepia lowercase">our love story</h2>
    </Reveal>

    <div className="max-w-6xl mx-auto space-y-32 md:space-y-40">
      {stages.map((stage, i) => (
        <div key={i}>
          <Reveal>
            <div className="max-w-2xl mb-12">
              <p className="text-xs uppercase tracking-eyebrow text-gold mb-3">
                chapter {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-serif text-3xl md:text-5xl text-sepia mb-5 lowercase italic">
                {stage.title}
              </h3>
              <p className="text-sepia/75 leading-relaxed text-base md:text-lg">{stage.text}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {stage.photos.map((photo, j) => (
              <Reveal key={j} delay={0.1 * j}>
                <button
                  onClick={() => onPhotoClick(photo.src, photo.caption)}
                  className="group block w-full text-left cursor-zoom-in"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-eyebrow text-sepia/60 italic font-serif lowercase">
                    {photo.caption}
                  </p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

/* ---------------- Countdown helpers ---------------- */
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
  const c = useCountdown(WEDDING_DATE);
  const blocks = [
    { val: c.days, label: "Days" },
    { val: c.hours, label: "Hours" },
    { val: c.minutes, label: "Minutes" },
    { val: c.seconds, label: "Seconds" },
  ];
  return (
    <section id="rsvp" className="py-32 px-6 bg-cream text-center">
      <Reveal>
        <p className="font-serif italic text-4xl md:text-6xl text-sepia">so please join us...</p>
        <h3 className="mt-8 font-display text-4xl md:text-7xl text-sepia tracking-display lowercase">
          september 26, 2026
        </h3>
      </Reveal>

      <Reveal delay={0.1} className="mt-14 flex justify-center items-center gap-3 md:gap-8">
        {blocks.map((b, i) => (
          <div key={b.label} className="flex items-center gap-3 md:gap-8">
            <div className="text-center min-w-[60px] md:min-w-[90px]">
              <div className="font-serif text-4xl md:text-7xl text-sepia tabular-nums">{b.val}</div>
              <div className="text-[10px] uppercase tracking-eyebrow text-sepia/60 mt-2">{b.label}</div>
            </div>
            {i < blocks.length - 1 && (
              <span className="font-serif text-3xl md:text-5xl text-gold">:</span>
            )}
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.2} className="mt-24 max-w-3xl mx-auto">
        <div className="aspect-[16/10] overflow-hidden shadow-[var(--shadow-soft)]">
          <img src={p5} alt="The Veranda" className="w-full h-full object-cover" />
        </div>
        <h4 className="mt-8 font-serif text-3xl md:text-5xl text-sepia">The Veranda</h4>
        <a
          href="https://maps.google.com/?q=New+Braunfels+Texas"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm text-sepia/70 hover:text-gold transition-colors uppercase tracking-eyebrow"
        >
          <MapPin className="w-4 h-4" />
          New Braunfels, Texas
        </a>
        <p className="mt-12 text-xs uppercase tracking-eyebrow text-sepia/60">
          RSVP coming soon ;)
        </p>
        <p className="mt-12 max-w-xl mx-auto text-sepia/75 italic font-serif text-lg md:text-2xl leading-relaxed">
          The vision for the night is simple: all of our most beloved people in one place that happens to have flowing drinks, good music, and an unforgettable dance floor.
        </p>
      </Reveal>
    </section>
  );
};

/* ---------------- FAQ ---------------- */
const faqs = [
  { q: "How do I RSVP?", a: "RSVP will be available closer to the wedding — we'll send a note when it's ready." },
  { q: "Is the wedding outdoors?", a: "The ceremony will be outdoors weather permitting; the reception is under cover." },
  { q: "What should I wear?", a: "Cocktail attire. Think garden-party elegant — soft colors, comfortable shoes for grass." },
  { q: "What's the weather like in late September?", a: "Texas hill country in late September is warm in the day (mid-80s°F) and cools off in the evening — bring a light layer." },
  { q: "Help! I have other questions!", a: "Reach out to Mark or Grace directly anytime — we'd love to hear from you." },
];

const FAQ = () => (
  <section id="faq" className="py-32 px-6 bg-background">
    <Reveal className="text-center mb-12">
      <p className="text-xs uppercase tracking-eyebrow text-gold mb-4">just in case</p>
      <h2 className="font-serif text-5xl md:text-7xl text-sepia lowercase">questions &amp; answers</h2>
      <p className="mt-6 text-sm text-sepia/60">
        Can't find the answer here?{" "}
        <a href="mailto:hello@markandgrace.com" className="underline underline-offset-4 hover:text-gold transition-colors">
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
            <AccordionContent className="text-sepia/75 leading-relaxed text-base">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  </section>
);

/* ---------------- Closing pinned photo ----------------
 * Sticky pinned photo with overlaid quote and a cream letterbox crop
 * that grows as user scrolls — mirrors tessakevin.com's closing scene.
 */
const Closing = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const barH = useTransform(scrollYProgress, [0, 0.5, 1], ["18vh", "0vh", "18vh"]);
  const sideW = useTransform(scrollYProgress, [0, 0.5, 1], ["8vw", "0vw", "8vw"]);
  const quoteOpacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);
  const quoteY = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [40, 0, -40]);

  return (
    <section ref={ref} className="relative h-[200vh] bg-cream">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-cream">
        <img
          src={heroImg}
          alt="Mark and Grace"
          className="absolute inset-0 w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-sepia/30" />

        {/* Letterbox bars */}
        <motion.div style={{ height: barH }} className="absolute top-0 left-0 right-0 bg-cream z-20" />
        <motion.div style={{ height: barH }} className="absolute bottom-0 left-0 right-0 bg-cream z-20" />
        <motion.div style={{ width: sideW }} className="absolute top-0 bottom-0 left-0 bg-cream z-20" />
        <motion.div style={{ width: sideW }} className="absolute top-0 bottom-0 right-0 bg-cream z-20" />

        <motion.div
          style={{ opacity: quoteOpacity, y: quoteY }}
          className="relative z-10 h-full flex items-center justify-center px-6 text-center"
        >
          <p className="font-serif italic text-3xl md:text-6xl lg:text-7xl text-cream leading-tight max-w-4xl">
            you're my <span className="text-gold">favorite</span> person <br />
            to do anything with <br />
            for the rest of my life.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------------- Footer signature ---------------- */
const Footer = () => (
  <footer className="py-20 text-center bg-cream">
    <img src={crest} alt="" className="w-24 mx-auto opacity-70 mb-6" />
    <p className="text-[10px] uppercase tracking-eyebrow text-sepia/50">— mark &amp; grace · 09 · 26 · 26 —</p>
  </footer>
);

/* ---------------- Page ---------------- */
const Index = () => {
  const [lightbox, setLightbox] = useState<{ src: string | null; caption: string }>({
    src: null,
    caption: "",
  });

  useEffect(() => {
    document.title = "Mark & Grace · September 26, 2026";
  }, []);

  return (
    <SmoothScroll>
      <MinimalNav />
      <main className="bg-background overflow-x-hidden">
        <Hero />
        <HorizontalPhotos />
        <Invitation />
        <LoveStory onPhotoClick={(src, caption) => setLightbox({ src, caption })} />
        <Venue />
        <FAQ />
        <Closing />
        <Footer />
      </main>
      <PhotoLightbox
        src={lightbox.src}
        caption={lightbox.caption}
        onClose={() => setLightbox({ src: null, caption: "" })}
      />
    </SmoothScroll>
  );
};

export default Index;
