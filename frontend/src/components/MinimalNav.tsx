import { type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "Schedule", href: "#schedule", eyebrow: "01" },
  { label: "Hotels Accommodations", href: "#travel", eyebrow: "02" },
  { label: "Travel", href: "#airports", eyebrow: "03" },
  { label: "Registry", href: "#registry", eyebrow: "04" },
  { label: "Wedding Party", href: "#wedding-party", eyebrow: "05" },
  { label: "FAQ", href: "#faq", eyebrow: "06" },
  { label: "Things To Do", href: "#things-to-do", eyebrow: "07" },
];

/**
 * Minimal top nav with RSVP visible and an Apple-style dropdown menu.
 */
const MinimalNav = () => {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const suppressCountdownConfetti = () => {
    window.sessionStorage.setItem("suppress-countdown-confetti-until", String(Date.now() + 2200));
  };

  const navigateHome = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    suppressCountdownConfetti();
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      ref={navRef}
      className={
        "fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] " +
        (solid ? "w-[min(92vw,680px)]" : "w-[min(96vw,760px)]")
      }
    >
      <nav className="relative flex h-12 items-center justify-between rounded-full border border-sepia/10 bg-cream/90 px-4 shadow-[0_18px_60px_-34px_hsl(var(--sepia)/0.55)] backdrop-blur-xl md:px-5">
        <a
          href="#top"
          className="px-2 font-serif text-base tracking-display text-sepia md:text-lg"
          onClick={navigateHome}
        >
          M &amp; G
        </a>

        <div className="flex items-center gap-2">
          <a
            href="/rsvp"
            className="rounded-full border border-sepia/15 bg-background/70 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-sepia transition-colors hover:border-gold/60 hover:text-gold md:px-5 md:text-sm"
            onClick={() => setOpen(false)}
          >
            RSVP
          </a>
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-sepia/10 bg-background/70 text-sepia transition-all duration-300 hover:border-gold/60 hover:text-gold active:scale-95 md:h-10 md:w-10"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        <div
          className={
            "absolute right-0 top-[calc(100%+0.7rem)] w-[min(88vw,390px)] origin-top-right overflow-hidden rounded-[28px] border border-sepia/18 bg-cream shadow-[0_34px_100px_-32px_hsl(var(--sepia)/0.72)] ring-1 ring-background/80 backdrop-blur-2xl transition-all duration-300 " +
            (open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0")
          }
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background via-cream to-background" />
          <div className="relative p-2.5 shadow-[inset_0_1px_0_hsl(var(--cream)),inset_0_-1px_0_hsl(var(--sepia)/0.06)]">
            <div className="flex items-center justify-between border-b border-sepia/10 px-4 pb-3 pt-2">
              <p className="text-[10px] uppercase tracking-eyebrow text-gold">menu</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-sepia/40">09.26.26</p>
            </div>
            <div className="py-2">
              {menuItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    suppressCountdownConfetti();
                    setOpen(false);
                  }}
                  className="group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 hover:bg-background hover:shadow-[inset_0_0_0_1px_hsl(var(--sepia)/0.08)]"
                  style={{ transitionDelay: open ? index * 18 + "ms" : "0ms" }}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="w-5 text-[10px] uppercase tracking-[0.2em] text-gold/70">
                      {item.eyebrow}
                    </span>
                    <span className="font-serif text-2xl leading-none text-sepia transition-colors group-hover:text-gold">
                      {item.label}
                    </span>
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-sepia/35 transition-colors group-hover:bg-gold" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MinimalNav;
