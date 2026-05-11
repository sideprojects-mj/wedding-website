import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import { API_BASE_URL } from "@/config";

type RsvpRecord = {
  id?: number;
  guestName: string;
  email?: string | null;
  attending?: boolean;
  mealChoice?: string | null;
  message?: string | null;
  submittedAt?: string;
};

type LookupStatus = "idle" | "loading" | "found" | "missing" | "error" | "submitted";

const confettiPieces = Array.from({ length: 90 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  delay: (index % 18) * 0.08,
  duration: 2.6 + (index % 7) * 0.16,
  size: 5 + (index % 4) * 2,
  rotate: (index * 47) % 180,
  color:
    index % 5 === 0
      ? "hsl(var(--gold))"
      : index % 5 === 1
        ? "hsl(var(--sepia) / 0.65)"
        : index % 5 === 2
          ? "hsl(352 40% 62%)"
          : index % 5 === 3
            ? "hsl(38 56% 74%)"
            : "hsl(var(--cream))",
}));

const ConfettiRain = () => (
  <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
    {confettiPieces.map((piece, index) => (
      <motion.span
        key={index}
        initial={{ y: "-12vh", x: 0, rotate: piece.rotate, opacity: 0 }}
        animate={{
          y: "112vh",
          x: [0, index % 2 === 0 ? 28 : -28, index % 3 === 0 ? -16 : 16],
          rotate: piece.rotate + 540,
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: piece.duration,
          delay: piece.delay,
          ease: "linear",
        }}
        className="absolute rounded-[2px]"
        style={{
          left: piece.left,
          width: piece.size,
          height: index % 3 === 0 ? piece.size : piece.size * 1.8,
          backgroundColor: piece.color,
        }}
      />
    ))}
  </div>
);

const Rsvp = () => {
  const [name, setName] = useState("");
  const [record, setRecord] = useState<RsvpRecord | null>(null);
  const [status, setStatus] = useState<LookupStatus>("idle");
  const [error, setError] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);

  const displayName = useMemo(() => record?.guestName || name.trim(), [name, record]);

  const lookupRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setStatus("error");
      setError("Please enter the name from your invitation.");
      return;
    }

    setStatus("loading");
    setError("");
    setRecord(null);
    setAttending(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rsvps/getRsvp?name=${encodeURIComponent(trimmedName)}`,
      );

      if (!response.ok) {
        throw new Error("Lookup failed");
      }

      const data = (await response.json()) as RsvpRecord | null;

      if (!data || !data.guestName) {
        setStatus("missing");
        return;
      }

      setRecord(data);
      setAttending(typeof data.attending === "boolean" ? data.attending : null);
      setStatus("found");
    } catch {
      setStatus("error");
      setError("Something went wrong while looking up your RSVP. Please try again.");
    }
  };

  const submitAnswer = async (answer: boolean) => {
    if (!displayName) return;

    setStatus("loading");
    setError("");
    setAttending(answer);

    try {
      const endpoint = record?.id
        ? `${API_BASE_URL}/api/rsvps/updateRsvp/${record.id}`
        : `${API_BASE_URL}/api/rsvps/createRsvp`;

      const response = await fetch(endpoint, {
        method: record?.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: displayName,
          email: record?.email,
          attending: answer,
          mealChoice: record?.mealChoice,
          message: record?.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Submit failed");
      }

      const data = (await response.json()) as RsvpRecord;
      setRecord(data);
      setStatus("submitted");
      if (answer) {
        window.setTimeout(() => setAttending(true), 0);
      }
    } catch {
      setStatus("found");
      setError("We could not save your RSVP just yet. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-sepia">
      {status === "submitted" && attending && <ConfettiRain />}

      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-sepia/65 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
        <p className="font-serif text-lg tracking-display">M &amp; G</p>
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl flex-col justify-center py-16">
        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="text-xs uppercase tracking-eyebrow text-gold">RSVP</p>
          <h1 className="mt-5 font-serif text-5xl lowercase leading-none md:text-7xl">
            find your invitation
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-sepia/70 md:text-2xl">
            Enter your name as it appears on your invitation, then let us know if you will be
            celebrating with us.
          </p>
        </div>

        <div className="mx-auto mt-12 w-full max-w-xl border border-sepia/10 bg-background p-5 shadow-[var(--shadow-soft)] md:p-7">
          <form onSubmit={lookupRsvp} className="flex flex-col gap-4 sm:flex-row">
            <label className="sr-only" htmlFor="guest-name">
              Guest name
            </label>
            <input
              id="guest-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your full name"
              className="min-h-12 flex-1 border border-sepia/15 bg-cream px-4 font-serif text-lg text-sepia outline-none transition-colors placeholder:text-sepia/35 focus:border-gold"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-sepia px-6 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {status === "loading" ? "Looking" : "Find"}
            </button>
          </form>

          {status === "missing" && (
            <div className="mt-6 border border-sepia/10 bg-cream p-5 text-left">
              <p className="font-serif text-2xl text-sepia">We could not find that name.</p>
              <p className="mt-2 text-sm leading-relaxed text-sepia/65">
                Try the full name from your invitation. If it still does not show up, reach out to
                Mark or Grace and we will help.
              </p>
            </div>
          )}

          {error && (
            <p className="mt-4 text-left text-sm leading-relaxed text-red-900/75">{error}</p>
          )}

          {(status === "found" || status === "submitted") && record && (
            <div className="mt-7 border border-sepia/10 bg-cream p-5 text-center">
              <p className="text-xs uppercase tracking-eyebrow text-gold">Invitation found</p>
              <h2 className="mt-3 font-serif text-3xl text-sepia">{record.guestName}</h2>

              {status === "submitted" ? (
                <p className="mx-auto mt-5 max-w-sm font-serif text-xl italic leading-relaxed text-sepia/75">
                  Thank you. Your RSVP has been saved as{" "}
                  {attending ? "joyfully attending" : "unable to attend"}.
                </p>
              ) : (
                <>
                  <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-sepia/65">
                    Will you be joining us on September 26, 2026?
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => submitAnswer(true)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 bg-sepia px-5 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold"
                    >
                      <Check className="h-4 w-4" />
                      Yes, attending
                    </button>
                    <button
                      type="button"
                      onClick={() => submitAnswer(false)}
                      className="inline-flex min-h-12 items-center justify-center gap-2 border border-sepia/20 px-5 text-xs uppercase tracking-eyebrow text-sepia transition-colors hover:border-gold hover:text-gold"
                    >
                      <X className="h-4 w-4" />
                      No, regrets
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Rsvp;
