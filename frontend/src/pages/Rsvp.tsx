import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import { API_BASE_URL } from "@/config";
import RegistryAfterRsvp from "@/components/RegistryAfterRsvp";

type MealChoice = "BEEF" | "CHICKEN" | "VEGETARIAN";

type RsvpRecord = {
  id?: number;
  guestName: string;
  email?: string | null;
  attending?: boolean | null;
  responded?: boolean | null;
  invitedToRehearsalDinner?: boolean | null;
  rehearsalDinnerAttending?: boolean | null;
  rehearsalDinnerResponded?: boolean | null;
  mealChoice?: MealChoice | null;
  message?: string | null;
  submittedAt?: string;
  partyId?: number | null;
  partyName?: string | null;
};

type RsvpParty = {
  id?: number | null;
  partyName: string;
  guests: RsvpRecord[];
};

type RsvpLookupResponse = {
  foundGuest: RsvpRecord | null;
  party: RsvpParty | null;
};

type LookupStatus = "idle" | "loading" | "found" | "missing" | "error" | "submitted";

const mealChoices: { value: MealChoice; label: string }[] = [
  { value: "BEEF", label: "Beef" },
  { value: "CHICKEN", label: "Chicken" },
  { value: "VEGETARIAN", label: "Vegetarian" },
];

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
  const [foundGuest, setFoundGuest] = useState<RsvpRecord | null>(null);
  const [party, setParty] = useState<RsvpParty | null>(null);
  const [status, setStatus] = useState<LookupStatus>("idle");
  const [error, setError] = useState("");
  const [responses, setResponses] = useState<Record<number, boolean | null>>({});
  const [selectedMeals, setSelectedMeals] = useState<Record<number, MealChoice | null>>({});
  const [rehearsalResponses, setRehearsalResponses] = useState<Record<number, boolean | null>>({});

  const displayName = useMemo(
    () => party?.partyName || foundGuest?.guestName || name.trim(),
    [name, foundGuest, party],
  );

  const hasAccepted = useMemo(
    () => Object.values(responses).some((answer) => answer === true),
    [responses],
  );

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
    setFoundGuest(null);
    setParty(null);
    setResponses({});
    setSelectedMeals({});
    setRehearsalResponses({});

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rsvps/getRsvp?name=${encodeURIComponent(trimmedName)}`,
      );

      if (!response.ok) {
        throw new Error("Lookup failed");
      }

      const data = (await response.json()) as RsvpLookupResponse;

      if (!data?.foundGuest || !data.party) {
        setStatus("missing");
        return;
      }

      setFoundGuest(data.foundGuest);
      setParty(data.party);
      setResponses(
        data.party.guests.reduce<Record<number, boolean | null>>((current, guest) => {
          if (guest.id) {
            current[guest.id] =
              guest.responded && typeof guest.attending === "boolean" ? guest.attending : null;
          }
          return current;
        }, {}),
      );
      setSelectedMeals(
        data.party.guests.reduce<Record<number, MealChoice | null>>((current, guest) => {
          if (guest.id) {
            current[guest.id] = guest.mealChoice ?? null;
          }
          return current;
        }, {}),
      );
      setRehearsalResponses(
        data.party.guests.reduce<Record<number, boolean | null>>((current, guest) => {
          if (guest.id && guest.invitedToRehearsalDinner) {
            current[guest.id] =
              guest.rehearsalDinnerResponded && typeof guest.rehearsalDinnerAttending === "boolean"
                ? guest.rehearsalDinnerAttending
                : null;
          }
          return current;
        }, {}),
      );
      setStatus("found");
    } catch {
      setStatus("error");
      setError("Something went wrong while looking up your RSVP. Please try again.");
    }
  };

  const setGuestAnswer = (guestId: number | undefined, answer: boolean) => {
    if (!guestId) return;
    setResponses((current) => ({ ...current, [guestId]: answer }));
    if (!answer) {
      setSelectedMeals((current) => ({ ...current, [guestId]: null }));
    }
  };

  const setGuestMeal = (guestId: number | undefined, mealChoice: MealChoice) => {
    if (!guestId) return;
    setSelectedMeals((current) => ({ ...current, [guestId]: mealChoice }));
  };

  const setRehearsalAnswer = (guestId: number | undefined, answer: boolean) => {
    if (!guestId) return;
    setRehearsalResponses((current) => ({ ...current, [guestId]: answer }));
  };

  const submitAnswers = async () => {
    if (!party || !foundGuest) return;

    const guests = party.guests.filter((guest) => guest.id);
    const hasMissingResponse = guests.some((guest) => responses[guest.id!] === null || responses[guest.id!] === undefined);

    if (hasMissingResponse) {
      setError("Please choose yes or no for each guest in your party.");
      return;
    }

    const hasMissingMeal = guests.some(
      (guest) => responses[guest.id!] === true && !selectedMeals[guest.id!],
    );

    if (hasMissingMeal) {
      setError("Please choose a meal for each guest who is attending.");
      return;
    }

    const hasMissingRehearsalResponse = guests.some(
      (guest) =>
        guest.invitedToRehearsalDinner &&
        (rehearsalResponses[guest.id!] === null || rehearsalResponses[guest.id!] === undefined),
    );

    if (hasMissingRehearsalResponse) {
      setError("Please answer the rehearsal dinner RSVP for each invited guest.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const bodyGuests = guests.map((guest) => ({
        id: guest.id,
        guestName: guest.guestName,
        email: guest.email,
        attending: responses[guest.id!],
        mealChoice: responses[guest.id!] === true ? selectedMeals[guest.id!] : null,
        rehearsalDinnerAttending: guest.invitedToRehearsalDinner
          ? rehearsalResponses[guest.id!]
          : null,
        message: guest.message,
      }));

      const response = party.id
        ? await fetch(`${API_BASE_URL}/api/rsvps/updateParty/${party.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guests: bodyGuests }),
          })
        : await fetch(`${API_BASE_URL}/api/rsvps/updateRsvp/${foundGuest.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              guestName: foundGuest.guestName,
              email: foundGuest.email,
              attending: responses[foundGuest.id!],
              mealChoice:
                responses[foundGuest.id!] === true ? selectedMeals[foundGuest.id!] : null,
              rehearsalDinnerAttending: foundGuest.invitedToRehearsalDinner
                ? rehearsalResponses[foundGuest.id!]
                : null,
              message: foundGuest.message,
            }),
          });

      if (!response.ok) {
        throw new Error("Submit failed");
      }

      const data = (await response.json()) as RsvpParty | RsvpRecord;
      if ("guests" in data) {
        setParty(data);
      } else {
        setFoundGuest(data);
        setParty({ id: null, partyName: data.guestName, guests: [data] });
      }
      setStatus("submitted");
    } catch {
      setStatus("found");
      setError("We could not save your RSVP just yet. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-sepia">
      {status === "submitted" && hasAccepted && <ConfettiRain />}

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
            Enter your name as it appears on your invitation, then let us know who in your party
            will be celebrating with us.
          </p>
        </div>

        <div className="mx-auto mt-12 w-full max-w-2xl border border-sepia/10 bg-background p-5 shadow-[var(--shadow-soft)] md:p-7">
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

          {(status === "found" || status === "submitted") && party && (
            <div className="mt-7 border border-sepia/10 bg-cream p-5 text-center">
              <p className="text-xs uppercase tracking-eyebrow text-gold">Invitation found</p>
              <h2 className="mt-3 font-serif text-3xl text-sepia">{displayName}</h2>

              {status === "submitted" ? (
                <>
                  <p className="mx-auto mt-5 max-w-sm font-serif text-xl italic leading-relaxed text-sepia/75">
                    Thank you. Your party RSVP has been saved.
                  </p>
                  <RegistryAfterRsvp />
                </>
              ) : (
                <>
                  <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-sepia/65">
                    Please respond for each guest in your party.
                  </p>
                  <div className="mt-7 space-y-4 text-left">
                    {party.guests.map((guest) => (
                      <div
                        key={guest.id ?? guest.guestName}
                        className="border border-sepia/10 bg-background p-4"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-serif text-2xl text-sepia">{guest.guestName}</p>
                          <div className="grid grid-cols-2 gap-2 sm:w-[260px]">
                            <button
                              type="button"
                              onClick={() => setGuestAnswer(guest.id, true)}
                              className={`inline-flex min-h-11 items-center justify-center gap-2 border px-4 text-xs uppercase tracking-eyebrow transition-colors ${
                                responses[guest.id!] === true
                                  ? "border-sepia bg-sepia text-cream"
                                  : "border-sepia/20 text-sepia hover:border-gold hover:text-gold"
                              }`}
                            >
                              <Check className="h-4 w-4" />
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setGuestAnswer(guest.id, false)}
                              className={`inline-flex min-h-11 items-center justify-center gap-2 border px-4 text-xs uppercase tracking-eyebrow transition-colors ${
                                responses[guest.id!] === false
                                  ? "border-sepia bg-sepia text-cream"
                                  : "border-sepia/20 text-sepia hover:border-gold hover:text-gold"
                              }`}
                            >
                              <X className="h-4 w-4" />
                              No
                            </button>
                          </div>
                        </div>
                        {responses[guest.id!] === true && (
                          <div className="mt-4 border-t border-sepia/10 pt-4">
                            <p className="text-xs uppercase tracking-eyebrow text-sepia/45">
                              Meal choice
                            </p>
                            <div className="mt-3 grid gap-2 sm:grid-cols-3">
                              {mealChoices.map((meal) => (
                                <button
                                  key={meal.value}
                                  type="button"
                                  onClick={() => setGuestMeal(guest.id, meal.value)}
                                  className={
                                    selectedMeals[guest.id!] === meal.value
                                      ? "min-h-10 border border-gold bg-gold/15 px-3 text-xs uppercase tracking-[0.16em] text-sepia transition-colors"
                                      : "min-h-10 border border-sepia/15 px-3 text-xs uppercase tracking-[0.16em] text-sepia/65 transition-colors hover:border-gold hover:text-gold"
                                  }
                                >
                                  {meal.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {guest.invitedToRehearsalDinner && (
                          <div className="mt-4 border-t border-sepia/10 pt-4">
                            <p className="text-xs uppercase tracking-eyebrow text-gold">
                              Rehearsal dinner
                            </p>
                            <p className="mt-2 text-sm leading-relaxed text-sepia/60">
                              Will this guest attend the rehearsal dinner?
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-2 sm:w-[260px]">
                              <button
                                type="button"
                                onClick={() => setRehearsalAnswer(guest.id, true)}
                                className={
                                  rehearsalResponses[guest.id!] === true
                                    ? "inline-flex min-h-10 items-center justify-center border border-sepia bg-sepia px-4 text-xs uppercase tracking-eyebrow text-cream"
                                    : "inline-flex min-h-10 items-center justify-center border border-sepia/20 px-4 text-xs uppercase tracking-eyebrow text-sepia transition-colors hover:border-gold hover:text-gold"
                                }
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setRehearsalAnswer(guest.id, false)}
                                className={
                                  rehearsalResponses[guest.id!] === false
                                    ? "inline-flex min-h-10 items-center justify-center border border-sepia bg-sepia px-4 text-xs uppercase tracking-eyebrow text-cream"
                                    : "inline-flex min-h-10 items-center justify-center border border-sepia/20 px-4 text-xs uppercase tracking-eyebrow text-sepia transition-colors hover:border-gold hover:text-gold"
                                }
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => void submitAnswers()}
                    className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-sepia px-5 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold"
                  >
                    Save party RSVP
                  </button>
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
