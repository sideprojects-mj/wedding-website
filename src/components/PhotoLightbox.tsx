import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface PhotoLightboxProps {
  src: string | null;
  caption?: string;
  onClose: () => void;
}

/**
 * Minimal centered photo lightbox. Click backdrop or X to close.
 * Uses framer-motion AnimatePresence so the photo fades + scales in.
 */
const PhotoLightbox = ({ src, caption, onClose }: PhotoLightboxProps) => {
  useEffect(() => {
    if (!src) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-sepia/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-cream/80 hover:text-cream transition-colors p-2"
            aria-label="Close photo"
          >
            <X className="w-6 h-6" />
          </button>
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-4"
          >
            <img
              src={src}
              alt={caption || "Memory"}
              className="max-w-full max-h-[75vh] object-contain shadow-2xl"
            />
            {caption && (
              <p className="text-cream/90 text-sm md:text-base italic font-serif text-center">
                {caption}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoLightbox;
