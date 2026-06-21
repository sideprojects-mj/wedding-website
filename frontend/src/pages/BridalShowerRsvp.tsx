import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import { API_BASE_URL } from "@/config";
import bridalShowerInvite from "@/assets/bridal-shower-invite.png";

type BridalShowerRsvpRecord = {
  id?: number;
  guestName: string;
  email?: string | null;
  attending?: boolean | null;
  responded?: boolean | null;
  message?: string | null;
  submittedAt?: string | null;
};

type LookupResponse = {
  rsvp: BridalShowerRsvpRecord | null;
};

type LookupStatus = "idle" | "loading" | "found" | "missing" | "error" | "submitted";

const BridalShowerRsvp = () => {
  const [name, setName] = useState("");
  const [foundGuest, setFoundGuest] = useState<BridalShowerRsvpRecord | null>(null);
  const [status, setStatus] = useState<LookupStatus>("idle");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const lookupRsvp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setStatus("error");
      setError("Please enter the name from your bridal shower invitation.");
      return;
    }

    setStatus("loading");
    setError("");
    setFoundGuest(null);
    setAttending(null);
    setMessage("");

    try {
      const response = await fetch(API_BASE_URL + "/api/bridal-shower/rsvps/getRsvp?name=" + encodeURIComponent(trimmedName));
      if (!response.ok) throw new Error("Lookup failed");

      const data = (await response.json()) as LookupResponse;
      if (!data.rsvp) {
        setStatus("missing");
        return;
      }

      setFoundGuest(data.rsvp);
      setAttending(data.rsvp.responded && typeof data.rsvp.attending === "boolean" ? data.rsvp.attending : null);
      setMessage(data.rsvp.message || "");
      setStatus("found");
    } catch {
      setStatus("error");
      setError("Something went wrong while looking up your RSVP. Please try again.");
    }
  };

  const submitAnswer = async () => {
    if (!foundGuest?.id) return;

    if (attending === null) {
      setError("Please choose yes or no before submitting.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const response = await fetch(API_BASE_URL + "/api/bridal-shower/rsvps/updateRsvp/" + foundGuest.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: foundGuest.guestName,
          email: foundGuest.email,
          attending,
          message,
        }),
      });

      if (!response.ok) throw new Error("Submit failed");

      const data = (await response.json()) as BridalShowerRsvpRecord;
      setFoundGuest(data);
      setStatus("submitted");
    } catch {
      setStatus("found");
      setError("We could not save your bridal shower RSVP just yet. Please try again.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#d9eaf7] px-4 py-6 text-[#0a3475] sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(255,120,157,0.34),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(255,255,255,0.7),transparent_24%),linear-gradient(135deg,rgba(216,235,249,0.95),rgba(255,250,238,0.94)_48%,rgba(183,219,243,0.85))]" />
      <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-[#ee6c98]/25 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#f0c95f]/25 blur-3xl" />

      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[#0a3475]/15 bg-white/55 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[#0a3475] shadow-sm backdrop-blur-md transition-colors hover:border-[#e46f97]/50 hover:text-[#e46f97]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
        <p className="font-serif text-lg tracking-[0.22em] text-[#0a3475]">Bridal Shower</p>
      </div>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative hidden lg:block"
        >
          {/*<div className="absolute -left-8 -top-8 z-10 max-w-[260px] rotate-[-8deg] rounded-full border border-white/40 bg-[#e85d91]/85 px-8 py-5 text-center shadow-[0_24px_70px_-35px_rgba(10,52,117,0.55)]">*/}
          {/*  <p className="font-serif text-2xl italic leading-none text-white">rsvp</p>*/}
          {/*  <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-white/80">august 16</p>*/}
          {/*</div>*/}
          <div className="overflow-hidden rounded-t-[14rem] rounded-b-[2rem] border-[10px] border-white/65 bg-white shadow-[0_34px_100px_-45px_rgba(10,52,117,0.72)]">
            <img
              src={bridalShowerInvite}
              alt="Bridal shower invitation artwork"
              className="h-[680px] w-full object-cover object-center"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-2xl"
        >
          {/*<div className="absolute -right-3 -top-5 z-20 rotate-6 rounded-full bg-[#f6d56c] px-5 py-3 text-center shadow-[0_18px_40px_-26px_rgba(10,52,117,0.7)] sm:-right-6">*/}
            {/*<p className="font-serif text-xl italic leading-none text-[#0a3475]">Grace</p>*/}
          {/*</div>*/}
          <div className="relative overflow-hidden rounded-t-[13rem] rounded-b-[2rem] border border-[#0a3475]/45 bg-[#fffaf0]/95 px-5 pb-7 pt-14 shadow-[0_34px_90px_-42px_rgba(10,52,117,0.85)] sm:px-8 md:px-10 md:pb-10 md:pt-16">
            <div className="pointer-events-none absolute inset-3 rounded-t-[12rem] rounded-b-[1.5rem] border border-[#0a3475]/55" />
            <div className="pointer-events-none absolute inset-5 rounded-t-[11rem] rounded-b-[1.2rem] border border-[#0a3475]/25" />
            <div className="pointer-events-none absolute -left-10 -top-8 h-36 w-36 rounded-full bg-[#e85d91]/18 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-[#f6d56c]/24 blur-2xl" />

            <div className="relative text-center">
              {/*<p className="text-[11px] uppercase tracking-[0.36em] text-[#0a3475]">please respond</p>*/}
              <h1 className="mt-5 font-serif text-5xl uppercase leading-[0.9] tracking-[0.18em] text-[#0a3475] md:text-6xl">
                Couples<br />Shower
              </h1>
              <div className="mx-auto mt-5 flex max-w-xs items-center gap-4 text-[#0a3475]">
                <span className="h-px flex-1 bg-[#0a3475]/45" />
                <span className="text-[10px] uppercase tracking-[0.28em]">RSVP</span>
                <span className="h-px flex-1 bg-[#0a3475]/45" />
              </div>
              <p className="mx-auto mt-5 max-w-md font-serif text-xl italic leading-relaxed text-[#0a3475]/72 md:text-2xl">
                Enter your name as it appears on your invitation, then let us know if you can celebrate with us.
              </p>
            </div>

            <div className="relative mt-9 border border-[#0a3475]/18 bg-white/62 p-4 shadow-[0_20px_55px_-40px_rgba(10,52,117,0.85)] backdrop-blur-sm md:p-5">
              <form onSubmit={lookupRsvp} className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="bridal-shower-guest-name">Guest name</label>
                <input
                  id="bridal-shower-guest-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className="min-h-12 flex-1 border border-[#0a3475]/18 bg-[#fffaf0] px-4 font-serif text-lg text-[#0a3475] outline-none transition-colors placeholder:text-[#0a3475]/35 focus:border-[#e85d91]"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#0a3475] px-6 text-xs uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#e85d91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Search className="h-4 w-4" />
                  {status === "loading" ? "Looking" : "Find"}
                </button>
              </form>

              {status === "missing" && (
                <div className="mt-5 border border-[#0a3475]/14 bg-[#fffaf0] p-5 text-left">
                  <p className="font-serif text-2xl text-[#0a3475]">We could not find that name.</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#0a3475]/62">Try the full name from your invitation. If it still does not show up, reach out and we will help.</p>
                </div>
              )}

              {error && <p className="mt-4 text-left text-sm leading-relaxed text-[#9b264d]">{error}</p>}

              {(status === "found" || status === "submitted") && foundGuest && (
                <div className="mt-6 border border-[#0a3475]/14 bg-[#fffaf0] p-5 text-center">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#e85d91]">Invitation found</p>
                  <h2 className="mt-3 font-serif text-3xl text-[#0a3475]">{foundGuest.guestName}</h2>

                  {status === "submitted" ? (
                    <p className="mx-auto mt-5 max-w-sm font-serif text-xl italic leading-relaxed text-[#0a3475]/72">Thank you. Your bridal shower RSVP has been saved.</p>
                  ) : (
                    <>
                      <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-[#0a3475]/62">Will you be attending the bridal shower?</p>
                      <div className="mx-auto mt-7 grid max-w-sm grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAttending(true)}
                          className={attending === true ? "inline-flex min-h-12 items-center justify-center gap-2 border border-[#0a3475] bg-[#0a3475] px-4 text-xs uppercase tracking-[0.24em] text-white" : "inline-flex min-h-12 items-center justify-center gap-2 border border-[#0a3475]/20 px-4 text-xs uppercase tracking-[0.24em] text-[#0a3475] transition-colors hover:border-[#e85d91] hover:text-[#e85d91]"}
                        >
                          <Check className="h-4 w-4" />
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttending(false)}
                          className={attending === false ? "inline-flex min-h-12 items-center justify-center gap-2 border border-[#0a3475] bg-[#0a3475] px-4 text-xs uppercase tracking-[0.24em] text-white" : "inline-flex min-h-12 items-center justify-center gap-2 border border-[#0a3475]/20 px-4 text-xs uppercase tracking-[0.24em] text-[#0a3475] transition-colors hover:border-[#e85d91] hover:text-[#e85d91]"}
                        >
                          <X className="h-4 w-4" />
                          No
                        </button>
                      </div>
                      <label className="mt-6 block text-left">
                        <span className="text-[10px] uppercase tracking-[0.28em] text-[#0a3475]/55">Note optional</span>
                        <textarea
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                          className="mt-2 min-h-28 w-full border border-[#0a3475]/15 bg-white/70 px-4 py-3 text-sm leading-relaxed text-[#0a3475] outline-none transition-colors placeholder:text-[#0a3475]/35 focus:border-[#e85d91]"
                          placeholder="Dietary notes, questions, or anything else."
                        />
                      </label>
                      <button type="button" onClick={() => void submitAnswer()} className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-[#0a3475] px-5 text-xs uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#e85d91]">
                        Save RSVP
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default BridalShowerRsvp;
