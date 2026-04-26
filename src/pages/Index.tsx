import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import crest from "@/assets/wedding-crest.png";
import heroImg from "@/assets/couple-hero.jpg";
import p1 from "@/assets/collage-1.jpg";
import p2 from "@/assets/collage-2.jpg";
import p3 from "@/assets/collage-3.jpg";
import p4 from "@/assets/collage-4.jpg";
import p5 from "@/assets/collage-5.jpg";
import p6 from "@/assets/collage-6.jpg";

const WEDDING_DATE = new Date("2026-09-26T15:00:00");

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

/* ---------- Reusable reveal wrapper ---------- */
const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ---------- Hero ---------- */
const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <img src={heroImg} alt="Mark and Grace" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-cream/10 to-cream/60" />
      </motion.div>

      <motion.div style={{ y, opacity }} className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.img
          src={crest}
          alt="Mark & Grace wedding crest"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="w-56 md:w-72 lg:w-80 drop-shadow-[0_8px_30px_hsl(25_25%_18%/0.25)]"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl text-sepia tracking-display lowercase"
        >
          mark <span className="italic font-serif font-light normal-case">&amp;</span> grace
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-4 text-[10px] md:text-xs uppercase tracking-eyebrow text-sepia/70"
        >
          September 26, 2026 · New Braunfels, Texas
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-sepia/60"
      >
        <span className="text-[10px] uppercase tracking-eyebrow">Scroll to explore</span>
        <ChevronDown className="w-4 h-4 animate-float" />
      </motion.div>
    </section>
  );
};

/* ---------- Photo strip (marquee) ---------- */
const PhotoStrip = () => {
  const photos = [p1, p2, p3, p4, p5, p6];
  const doubled = [...photos, ...photos];
  return (
    <section className="py-20 overflow-hidden bg-background">
      <div className="flex gap-6 w-max animate-marquee">
        {doubled.map((src, i) => (
          <div key={i} className="w-[260px] md:w-[340px] aspect-[3/4] overflow-hidden">
            <img src={src} alt={`Memory ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ---------- Invitation banner ---------- */
const Invitation = () => (
  <section className="py-32 px-6 text-center bg-cream">
    <Reveal>
      <p className="font-serif italic text-3xl md:text-5xl text-sepia leading-relaxed">
        you're <span className="text-gold">cordially</span> invited
      </p>
      <p className="mt-6 text-xs md:text-sm uppercase tracking-eyebrow text-sepia/60">
        to the adventure that is...
      </p>
    </Reveal>
  </section>
);

/* ---------- Love story timeline ---------- */
const stages = [
  {
    title: "stage 1: where it began",
    text: "we met as kids running around the same Texas town — neighbors, classmates, friends long before anything else.",
    img: p1,
    caption: "young, dumb & in love (eventually)",
  },
  {
    title: "stage 2: growing up together",
    text: "high school formals, summer road trips, late-night drives down the same back roads. somewhere in there it stopped being friendship.",
    img: p2,
    caption: "the year it all clicked",
  },
  {
    title: "stage 3: the proposal",
    text: "a sunset, a ring, a yes that wasn't really a question. and a whole lot of happy tears.",
    img: p3,
    caption: "she said yes 💍",
  },
  {
    title: "stage 4: forever",
    text: "and now we're throwing the biggest party we know how to throw, surrounded by all of you.",
    img: p4,
    caption: "to forever, with our favorite people",
  },
];

const LoveStory = () => (
  <section className="py-24 px-6 bg-background">
    <Reveal className="text-center mb-20">
      <p className="text-xs uppercase tracking-eyebrow text-gold mb-4">the chapters</p>
      <h2 className="font-serif text-5xl md:text-6xl text-sepia">our love story</h2>
    </Reveal>

    <div className="max-w-5xl mx-auto space-y-32">
      {stages.map((stage, i) => (
        <Reveal key={i}>
          <div className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
            <div className="md:[direction:ltr]">
              <div className="aspect-[4/5] overflow-hidden shadow-[var(--shadow-soft)]">
                <img src={stage.img} alt={stage.title} className="w-full h-full object-cover" />
              </div>
              <p className="mt-3 text-xs uppercase tracking-eyebrow text-sepia/60 italic lowercase">
                {stage.caption}
              </p>
            </div>
            <div className="md:[direction:ltr]">
              <p className="text-xs uppercase tracking-eyebrow text-gold mb-3">chapter {String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-serif text-3xl md:text-4xl text-sepia mb-5 lowercase">{stage.title}</h3>
              <p className="text-sepia/75 leading-relaxed text-base md:text-lg">{stage.text}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ---------- So please join us — countdown + venue ---------- */
const Venue = () => {
  const c = useCountdown(WEDDING_DATE);
  const blocks = [
    { val: c.days, label: "Days" },
    { val: c.hours, label: "Hours" },
    { val: c.minutes, label: "Minutes" },
    { val: c.seconds, label: "Seconds" },
  ];
  return (
    <section className="py-32 px-6 bg-cream text-center">
      <Reveal>
        <p className="font-serif italic text-3xl md:text-5xl text-sepia">so please join us...</p>
        <h3 className="mt-6 font-display text-4xl md:text-6xl text-sepia tracking-display lowercase">
          september 26, 2026
        </h3>
      </Reveal>

      <Reveal delay={0.1} className="mt-12 flex justify-center items-center gap-4 md:gap-10">
        {blocks.map((b, i) => (
          <div key={b.label} className="flex items-center gap-4 md:gap-10">
            <div className="text-center min-w-[60px]">
              <div className="font-serif text-4xl md:text-6xl text-sepia tabular-nums">{b.val}</div>
              <div className="text-[10px] uppercase tracking-eyebrow text-sepia/60 mt-1">{b.label}</div>
            </div>
            {i < blocks.length - 1 && <span className="font-serif text-3xl text-gold">:</span>}
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.2} className="mt-24 max-w-3xl mx-auto">
        <div className="aspect-[16/9] overflow-hidden shadow-[var(--shadow-soft)]">
          <img src={p5} alt="Venue" className="w-full h-full object-cover" />
        </div>
        <h4 className="mt-8 font-serif text-3xl md:text-4xl text-sepia">The Veranda</h4>
        <a
          href="https://maps.google.com/?q=New+Braunfels+Texas"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm text-sepia/70 hover:text-gold transition-colors"
        >
          <MapPin className="w-4 h-4" />
          New Braunfels, Texas
        </a>
        <p className="mt-10 text-xs uppercase tracking-eyebrow text-sepia/60">RSVP coming soon ;)</p>
        <p className="mt-12 max-w-xl mx-auto text-sepia/75 italic font-serif text-lg md:text-xl leading-relaxed">
          The vision for the night is simple: all of our most beloved people in one place that happens to have flowing drinks, good music, and an unforgettable dance floor.
        </p>
      </Reveal>
    </section>
  );
};

/* ---------- FAQ ---------- */
const faqs = [
  { q: "How do I RSVP?", a: "RSVP will be available closer to the wedding — we'll send a note when it's ready." },
  { q: "Is the wedding outdoors?", a: "The ceremony will be outdoors weather permitting; the reception is under cover." },
  { q: "What should I wear?", a: "Cocktail attire. Think garden-party elegant — soft colors, comfortable shoes for grass." },
  { q: "What's the weather like in late September?", a: "Texas hill country in late September is warm in the day (mid-80s°F) and cools off in the evening — bring a light layer." },
  { q: "Help! I have other questions!", a: "Reach out to Mark or Grace directly anytime — we'd love to hear from you." },
];

const FAQ = () => (
  <section className="py-32 px-6 bg-background">
    <Reveal className="text-center mb-12">
      <p className="text-xs uppercase tracking-eyebrow text-gold mb-4">just in case</p>
      <h2 className="font-serif text-5xl md:text-6xl text-sepia">questions &amp; answers</h2>
      <p className="mt-4 text-sm text-sepia/60">
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

/* ---------- Closing ---------- */
const Closing = () => (
  <section className="relative py-32 px-6 bg-cream text-center overflow-hidden">
    <Reveal>
      <img src={crest} alt="" className="w-32 mx-auto opacity-80 mb-10" />
      <p className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-sepia leading-tight max-w-3xl mx-auto">
        you're my favorite person <br className="hidden md:block" />
        to do anything with <br className="hidden md:block" />
        for the rest of my life.
      </p>
    </Reveal>
    <Reveal delay={0.2} className="mt-16">
      <p className="text-[10px] uppercase tracking-eyebrow text-sepia/50">— mark &amp; grace —</p>
    </Reveal>
  </section>
);

/* ---------- Page ---------- */
const Index = () => {
  useEffect(() => {
    document.title = "Mark & Grace · September 26, 2026";
  }, []);

  return (
    <main className="bg-background overflow-x-hidden">
      <Hero />
      <PhotoStrip />
      <Invitation />
      <LoveStory />
      <Venue />
      <FAQ />
      <Closing />
    </main>
  );
};

export default Index;
