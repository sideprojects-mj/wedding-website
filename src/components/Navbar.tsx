import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import crest from "@/assets/wedding-crest.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/schedule", label: "Schedule" },
  { to: "/wedding-party", label: "Wedding Party" },
  { to: "/attire", label: "Attire" },
  { to: "/things-to-do", label: "Things To Do" },
  { to: "/hotels", label: "Hotels" },
  { to: "/registry", label: "Registry" },
  { to: "/faq", label: "FAQ" },
  { to: "/rsvp", label: "RSVP" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={crest} alt="Crest" className="w-8 h-8" />
          <span className="font-serif text-xl tracking-wide">J & A</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs uppercase tracking-[0.15em] transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="flex flex-col p-4 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`text-sm uppercase tracking-[0.15em] py-2 transition-colors hover:text-primary ${
                    location.pathname === link.to ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
