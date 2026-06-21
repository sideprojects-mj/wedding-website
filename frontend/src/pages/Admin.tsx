import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileUp, Lock, Plus, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { ADMIN_PASSCODE, API_BASE_URL } from "@/config";

type MealChoice = "BEEF" | "CHICKEN" | "VEGETARIAN";
type ResponseFilter = "ALL" | "ATTENDING" | "DECLINED" | "PENDING";
type MealFilter = "ALL" | MealChoice | "NO_MEAL";

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
  id: number;
  partyName: string;
  guests: RsvpRecord[];
};

type CsvImportResult = {
  partiesCreated: number;
  guestsCreated: number;
  guestsUpdated: number;
  errors: string[];
};

const PASSCODE_STORAGE_KEY = "wedding-admin-unlocked";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

const mealChoiceLabel = (mealChoice?: MealChoice | null) => {
  if (mealChoice === "BEEF") return "Beef";
  if (mealChoice === "CHICKEN") return "Chicken";
  if (mealChoice === "VEGETARIAN") return "Vegetarian";
  return "-";
};

const rehearsalStatusLabel = (rsvp: RsvpRecord) => {
  if (!rsvp.invitedToRehearsalDinner) return "Not invited";
  if (!rsvp.rehearsalDinnerResponded) return "No response";
  return rsvp.rehearsalDinnerAttending ? "Attending" : "Declined";
};

const Admin = () => {
  const [enteredCode, setEnteredCode] = useState("");
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(PASSCODE_STORAGE_KEY) === "true",
  );
  const [passcodeError, setPasscodeError] = useState("");
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([]);
  const [parties, setParties] = useState<RsvpParty[]>([]);
  const [partyName, setPartyName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [firstGuestRehearsalInvite, setFirstGuestRehearsalInvite] = useState(false);
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberRehearsalInvite, setMemberRehearsalInvite] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [responseFilter, setResponseFilter] = useState<ResponseFilter>("ALL");
  const [mealFilter, setMealFilter] = useState<MealFilter>("ALL");

  const sortedRsvps = useMemo(
    () =>
      [...rsvps].sort((a, b) =>
        (a.guestName || "").localeCompare(b.guestName || "", undefined, { sensitivity: "base" }),
      ),
    [rsvps],
  );

  const sortedParties = useMemo(
    () =>
      [...parties].sort((a, b) =>
        (a.partyName || "").localeCompare(b.partyName || "", undefined, { sensitivity: "base" }),
      ),
    [parties],
  );

  const filteredRsvps = useMemo(
    () =>
      sortedRsvps.filter((rsvp) => {
        const matchesResponse =
          responseFilter === "ALL" ||
          (responseFilter === "ATTENDING" && rsvp.responded && rsvp.attending === true) ||
          (responseFilter === "DECLINED" && rsvp.responded && rsvp.attending === false) ||
          (responseFilter === "PENDING" && !rsvp.responded);

        const matchesMeal =
          mealFilter === "ALL" ||
          (mealFilter === "NO_MEAL" && !rsvp.mealChoice) ||
          rsvp.mealChoice === mealFilter;

        return matchesResponse && matchesMeal;
      }),
    [sortedRsvps, responseFilter, mealFilter],
  );

  const totals = useMemo(
    () => ({
      invited: rsvps.length,
      parties: parties.length,
      attending: rsvps.filter((rsvp) => rsvp.responded && rsvp.attending === true).length,
      declined: rsvps.filter((rsvp) => rsvp.responded && rsvp.attending === false).length,
      pending: rsvps.filter((rsvp) => !rsvp.responded).length,
    }),
    [rsvps, parties],
  );

  const fetchData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const [rsvpResponse, partyResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/rsvps/getAll`),
        fetch(`${API_BASE_URL}/api/rsvps/getParties`),
      ]);
      if (!rsvpResponse.ok || !partyResponse.ok) throw new Error("Failed to load RSVPs");

      const rsvpData = (await rsvpResponse.json()) as RsvpRecord[];
      const partyData = (await partyResponse.json()) as RsvpParty[];
      setRsvps(rsvpData);
      setParties(partyData);
      if (!selectedPartyId && partyData[0]?.id) {
        setSelectedPartyId(String(partyData[0].id));
      }
    } catch {
      setMessage("Could not load RSVPs. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unlocked) {
      void fetchData();
    }
  }, [unlocked]);

  const pressKey = (key: string) => {
    if (!key) return;
    setPasscodeError("");

    if (key === "delete") {
      setEnteredCode((current) => current.slice(0, -1));
      return;
    }

    const nextCode = `${enteredCode}${key}`.slice(0, ADMIN_PASSCODE.length);
    setEnteredCode(nextCode);

    if (nextCode.length === ADMIN_PASSCODE.length) {
      if (nextCode === ADMIN_PASSCODE) {
        sessionStorage.setItem(PASSCODE_STORAGE_KEY, "true");
        setUnlocked(true);
      } else {
        setPasscodeError("Incorrect passcode");
        window.setTimeout(() => setEnteredCode(""), 250);
      }
    }
  };

  const createParty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedPartyName = partyName.trim();
    const trimmedGuestName = guestName.trim();

    if (!trimmedPartyName || !trimmedGuestName) {
      setMessage("Enter a party name and at least one guest name.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/rsvps/createParty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partyName: trimmedPartyName,
          guestName: trimmedGuestName,
          email: email.trim() || null,
          invitedToRehearsalDinner: firstGuestRehearsalInvite,
        }),
      });

      if (!response.ok) throw new Error("Failed to create party");

      const created = (await response.json()) as RsvpParty;
      setParties((current) => [...current, created]);
      setRsvps((current) => [...current, ...created.guests]);
      setSelectedPartyId(String(created.id));
      setPartyName("");
      setGuestName("");
      setEmail("");
      setFirstGuestRehearsalInvite(false);
      setMessage(`${created.partyName} was added.`);
    } catch {
      setMessage("Could not add this party. The backend may be offline.");
    } finally {
      setSaving(false);
    }
  };

  const importCsv = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!csvFile) {
      setMessage("Choose a CSV file before importing.");
      return;
    }

    setImporting(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const response = await fetch(API_BASE_URL + "/api/rsvps/importCsv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to import CSV");

      const result = (await response.json()) as CsvImportResult;
      await fetchData();
      setCsvFile(null);
      const importedMessage = "Imported " + result.guestsCreated + " new guests, updated " + result.guestsUpdated + " guests, and created " + result.partiesCreated + " parties.";
      const errorMessage = result.errors.length > 0 ? " " + result.errors.length + " row issue(s): " + result.errors.join(" ") : "";
      setMessage(importedMessage + errorMessage);
    } catch {
      setMessage("Could not import this CSV. Check the file format and backend connection.");
    } finally {
      setImporting(false);
    }
  };

  const addPartyMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = memberName.trim();

    if (!selectedPartyId || !trimmedName) {
      setMessage("Choose a party and enter a guest name.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/rsvps/parties/${selectedPartyId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: trimmedName,
          email: memberEmail.trim() || null,
          invitedToRehearsalDinner: memberRehearsalInvite,
        }),
      });

      if (!response.ok) throw new Error("Failed to add guest");

      const created = (await response.json()) as RsvpRecord;
      setRsvps((current) => [...current, created]);
      setParties((current) =>
        current.map((party) =>
          party.id === Number(selectedPartyId)
            ? { ...party, guests: [...party.guests, created] }
            : party,
        ),
      );
      setMemberName("");
      setMemberEmail("");
      setMemberRehearsalInvite(false);
      setMessage(`${created.guestName} was added to ${created.partyName}.`);
    } catch {
      setMessage("Could not add this guest. The backend may be offline.");
    } finally {
      setSaving(false);
    }
  };

  const toggleRehearsalInvite = async (rsvp: RsvpRecord) => {
    if (!rsvp.id) return;

    const nextInvited = !rsvp.invitedToRehearsalDinner;
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/rsvps/guests/${rsvp.id}/config`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invitedToRehearsalDinner: nextInvited }),
        },
      );

      if (!response.ok) throw new Error("Failed to update rehearsal invite");

      const updated = (await response.json()) as RsvpRecord;
      setRsvps((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setParties((current) =>
        current.map((party) => ({
          ...party,
          guests: party.guests.map((guest) => (guest.id === updated.id ? updated : guest)),
        })),
      );
    } catch {
      setMessage("Could not update rehearsal dinner invite.");
    }
  };

  const getStatusLabel = (rsvp: RsvpRecord) => {
    if (!rsvp.responded) return "No response";
    if (rsvp.attending === true) return "Attending";
    if (rsvp.attending === false) return "Declined";
    return "No response";
  };

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-10 text-sepia">
        <section className="w-full max-w-sm text-center">
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-sepia/60 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sepia/15">
            <Lock className="h-5 w-5 text-sepia/70" />
          </div>
          <h1 className="mt-6 font-serif text-4xl lowercase text-sepia">admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-sepia/60">
            Enter the passcode to manage invites and RSVPs.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            {Array.from({ length: ADMIN_PASSCODE.length }).map((_, index) => (
              <span
                key={index}
                className={`h-3 w-3 rounded-full border border-sepia/40 ${
                  index < enteredCode.length ? "bg-sepia" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          {passcodeError && (
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-red-900/70">
              {passcodeError}
            </p>
          )}

          <div className="mx-auto mt-8 grid max-w-[260px] grid-cols-3 gap-4">
            {keypad.map((key, index) =>
              key ? (
                <button
                  key={key}
                  type="button"
                  onClick={() => pressKey(key)}
                  className="flex aspect-square items-center justify-center rounded-full border border-sepia/10 bg-background font-serif text-2xl text-sepia shadow-sm transition-colors hover:border-gold hover:text-gold"
                  aria-label={key === "delete" ? "Delete" : key}
                >
                  {key === "delete" ? <Trash2 className="h-5 w-5" /> : key}
                </button>
              ) : (
                <span key={`blank-${index}`} />
              ),
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-sepia lg:px-10 xl:px-14">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-sepia/65 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(PASSCODE_STORAGE_KEY);
            setUnlocked(false);
            setEnteredCode("");
          }}
          className="text-xs uppercase tracking-eyebrow text-sepia/60 transition-colors hover:text-gold"
        >
          Lock
        </button>
      </div>

      <section className="mx-auto w-full max-w-[1500px] py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-eyebrow text-gold">admin</p>
            <h1 className="mt-4 font-serif text-5xl lowercase leading-none text-sepia md:text-7xl">
              rsvp manager
            </h1>
          </div>
          <button
            type="button"
            onClick={() => void fetchData()}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-sepia/15 px-5 text-xs uppercase tracking-eyebrow text-sepia transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-5">
          {[
            { label: "Invites", value: totals.invited },
            { label: "Parties", value: totals.parties },
            { label: "Attending", value: totals.attending },
            { label: "Declined", value: totals.declined },
            { label: "Pending", value: totals.pending },
          ].map((total) => (
            <div key={total.label} className="border border-sepia/10 bg-background p-5">
              <p className="text-xs uppercase tracking-eyebrow text-sepia/45">{total.label}</p>
              <p className="mt-3 font-serif text-4xl text-sepia">{total.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid w-full items-start gap-8 xl:grid-cols-[minmax(360px,0.85fr)_minmax(0,1.65fr)] 2xl:grid-cols-[minmax(420px,0.8fr)_minmax(0,1.8fr)]">
          <div className="w-full min-w-0 space-y-8 xl:min-w-[360px] 2xl:min-w-[420px]">
            <form onSubmit={importCsv} className="border border-sepia/10 bg-background p-5 md:p-7">
              <h2 className="font-serif text-3xl text-sepia">Import CSV</h2>
              <p className="mt-3 text-sm leading-relaxed text-sepia/60">
                Upload one row per guest. Guests with the same party name will be grouped together.
              </p>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">CSV file</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)}
                    className="mt-2 w-full border border-sepia/15 bg-cream px-4 py-3 text-sm text-sepia file:mr-4 file:border-0 file:bg-sepia file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.16em] file:text-cream"
                  />
                </label>
                <a
                  href="/sample-rsvp-import.csv"
                  download
                  className="inline-flex text-xs uppercase tracking-eyebrow text-sepia/65 underline-offset-4 transition-colors hover:text-gold hover:underline"
                >
                  Download sample CSV
                </a>
              </div>
              <button
                type="submit"
                disabled={importing}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-sepia px-5 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold disabled:opacity-60"
              >
                <FileUp className="h-4 w-4" />
                {importing ? "Importing" : "Import CSV"}
              </button>
            </form>

            <form onSubmit={createParty} className="border border-sepia/10 bg-background p-5 md:p-7">
              <h2 className="font-serif text-3xl text-sepia">Add party</h2>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">Party name</span>
                  <input
                    value={partyName}
                    onChange={(event) => setPartyName(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold"
                    placeholder="The Smith Party"
                  />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">First guest</span>
                  <input
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold"
                    placeholder="Mr Smith"
                  />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">
                    Email optional
                  </span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold"
                    placeholder="name@example.com"
                    type="email"
                  />
                </label>
                <label className="flex items-center gap-3 border border-sepia/10 bg-cream px-4 py-3 text-sm text-sepia/70">
                  <input
                    type="checkbox"
                    checked={firstGuestRehearsalInvite}
                    onChange={(event) => setFirstGuestRehearsalInvite(event.target.checked)}
                    className="h-4 w-4 accent-sepia"
                  />
                  Invite first guest to rehearsal dinner
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-sepia px-5 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {saving ? "Adding" : "Add party"}
              </button>
            </form>

            <form onSubmit={addPartyMember} className="border border-sepia/10 bg-background p-5 md:p-7">
              <h2 className="font-serif text-3xl text-sepia">Add guest to party</h2>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">Party</span>
                  <select
                    value={selectedPartyId}
                    onChange={(event) => setSelectedPartyId(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold"
                  >
                    <option value="">Choose a party</option>
                    {sortedParties.map((party) => (
                      <option key={party.id} value={party.id}>
                        {party.partyName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">Guest name</span>
                  <input
                    value={memberName}
                    onChange={(event) => setMemberName(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold"
                    placeholder="Mrs Smith"
                  />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">
                    Email optional
                  </span>
                  <input
                    value={memberEmail}
                    onChange={(event) => setMemberEmail(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold"
                    placeholder="name@example.com"
                    type="email"
                  />
                </label>
                <label className="flex items-center gap-3 border border-sepia/10 bg-cream px-4 py-3 text-sm text-sepia/70">
                  <input
                    type="checkbox"
                    checked={memberRehearsalInvite}
                    onChange={(event) => setMemberRehearsalInvite(event.target.checked)}
                    className="h-4 w-4 accent-sepia"
                  />
                  Invite guest to rehearsal dinner
                </label>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-sepia px-5 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />
                {saving ? "Adding" : "Add guest"}
              </button>
              {message && <p className="mt-4 text-sm leading-relaxed text-sepia/65">{message}</p>}
            </form>
          </div>

          <div className="min-w-0 border border-sepia/10 bg-background">
            <div className="flex flex-col gap-5 border-b border-sepia/10 p-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="font-serif text-3xl text-sepia">Current RSVPs</h2>
                <p className="mt-1 text-xs uppercase tracking-eyebrow text-sepia/45">
                  {filteredRsvps.length} shown / {sortedRsvps.length} total
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-sepia/45">Response</span>
                  <select
                    value={responseFilter}
                    onChange={(event) => setResponseFilter(event.target.value as ResponseFilter)}
                    className="mt-2 min-h-10 w-full border border-sepia/15 bg-cream px-3 text-sm text-sepia outline-none transition-colors focus:border-gold"
                  >
                    <option value="ALL">All responses</option>
                    <option value="ATTENDING">Attending</option>
                    <option value="DECLINED">Not attending</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-sepia/45">Meal</span>
                  <select
                    value={mealFilter}
                    onChange={(event) => setMealFilter(event.target.value as MealFilter)}
                    className="mt-2 min-h-10 w-full border border-sepia/15 bg-cream px-3 text-sm text-sepia outline-none transition-colors focus:border-gold"
                  >
                    <option value="ALL">All meals</option>
                    <option value="BEEF">Beef</option>
                    <option value="CHICKEN">Chicken</option>
                    <option value="VEGETARIAN">Vegetarian</option>
                    <option value="NO_MEAL">No meal</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResponseFilter("ALL");
                    setMealFilter("ALL");
                  }}
                  className="mt-auto min-h-10 border border-sepia/15 px-4 text-xs uppercase tracking-[0.18em] text-sepia transition-colors hover:border-gold hover:text-gold"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="max-h-[780px] overflow-auto">
              {sortedRsvps.length === 0 ? (
                <p className="p-5 text-sm text-sepia/60">
                  {loading ? "Loading RSVPs..." : "No RSVPs yet."}
                </p>
              ) : filteredRsvps.length === 0 ? (
                <p className="p-5 text-sm text-sepia/60">No RSVPs match those filters.</p>
              ) : (
                <table className="w-full min-w-[840px] border-collapse text-left">
                  <thead className="sticky top-0 bg-cream">
                    <tr className="border-b border-sepia/10 text-xs uppercase tracking-[0.18em] text-sepia/45">
                      <th className="px-5 py-4 font-normal">Name</th>
                      <th className="px-5 py-4 font-normal">Party</th>
                      <th className="px-5 py-4 font-normal">Status</th>
                      <th className="px-5 py-4 font-normal">Meal</th>
                      <th className="px-5 py-4 font-normal">Rehearsal</th>
                      <th className="px-5 py-4 font-normal">Email</th>
                      <th className="px-5 py-4 font-normal">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRsvps.map((rsvp) => (
                      <tr key={rsvp.id ?? rsvp.guestName} className="border-b border-sepia/10">
                        <td className="px-5 py-4 font-serif text-lg text-sepia">{rsvp.guestName}</td>
                        <td className="px-5 py-4 text-sm text-sepia/65">{rsvp.partyName || "-"}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${
                              rsvp.responded && rsvp.attending === true
                                ? "bg-gold/15 text-sepia"
                                : rsvp.responded && rsvp.attending === false
                                  ? "bg-red-900/10 text-red-950/70"
                                  : "bg-sepia/10 text-sepia/60"
                            }`}
                          >
                            {getStatusLabel(rsvp)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-sepia/65">{mealChoiceLabel(rsvp.mealChoice)}</td>
                        <td className="px-5 py-4 text-sm text-sepia/65">
                          <button
                            type="button"
                            onClick={() => void toggleRehearsalInvite(rsvp)}
                            className={
                              rsvp.invitedToRehearsalDinner
                                ? "rounded-full bg-gold/15 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-sepia transition-colors hover:bg-gold/25"
                                : "rounded-full bg-sepia/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-sepia/55 transition-colors hover:bg-sepia/15"
                            }
                          >
                            {rehearsalStatusLabel(rsvp)}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-sm text-sepia/65">{rsvp.email || "-"}</td>
                        <td className="px-5 py-4 text-sm text-sepia/55">
                          {rsvp.submittedAt ? new Date(rsvp.submittedAt).toLocaleDateString() : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Admin;
