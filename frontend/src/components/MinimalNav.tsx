import { useEffect, useState } from "react";

/**
 * Minimal top nav — initials on the left, FAQ + RSVP on the right.
 * Becomes opaque after the user scrolls past the hero.
 */
const MinimalNav = () => {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        solid
          ? "w-[min(86vw,640px)] bg-cream/90 backdrop-blur-md shadow-[0_8px_30px_-10px_hsl(25_25%_18%/0.15)]"
          : "w-[min(96vw,1100px)] bg-cream/20 backdrop-blur-sm"
      } rounded-full`}
    >
      <nav className="flex items-center justify-between px-6 md:px-8 h-12">
        <a
          href="#top"
          className="font-serif text-base md:text-lg tracking-display text-sepia"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          M & G
        </a>
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="#faq"
            className="text-xs md:text-sm uppercase tracking-eyebrow text-sepia/80 hover:text-sepia transition-colors px-2 py-1"
          >
            FAQ
          </a>
          <a
            href="#rsvp"
            className="text-xs md:text-sm uppercase tracking-eyebrow text-sepia bg-cream hover:bg-background transition-colors px-4 py-1.5 rounded-full border border-sepia/15"
          >
            RSVP
          </a>
        </div>
      </nav>
    </header>
  );
};

export default MinimalNav;
