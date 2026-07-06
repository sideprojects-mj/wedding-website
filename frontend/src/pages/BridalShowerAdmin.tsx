import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileUp, Lock, Plus, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { ADMIN_PASSCODE, API_BASE_URL } from "@/config";

type BridalShowerRsvpRecord = {
  id?: number;
  partyId?: number | null;
  partyName?: string | null;
  guestName: string;
  email?: string | null;
  attending?: boolean | null;
  responded?: boolean | null;
  message?: string | null;
  submittedAt?: string | null;
};

type BridalShowerParty = {
  id: number;
  partyName: string;
  guests: BridalShowerRsvpRecord[];
};

type CsvImportResult = {
  partiesCreated: number;
  guestsCreated: number;
  guestsUpdated: number;
  errors: string[];
};

const PASSCODE_STORAGE_KEY = "bridal-shower-admin-unlocked";
const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

const statusLabel = (rsvp: BridalShowerRsvpRecord) => {
  if (!rsvp.responded) return "No response";
  return rsvp.attending ? "Attending" : "Declined";
};

const BridalShowerAdmin = () => {
  const [enteredCode, setEnteredCode] = useState("");
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(PASSCODE_STORAGE_KEY) === "true");
  const [passcodeError, setPasscodeError] = useState("");
  const [rsvps, setRsvps] = useState<BridalShowerRsvpRecord[]>([]);
  const [parties, setParties] = useState<BridalShowerParty[]>([]);
  const [partyName, setPartyName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPartyId, setSelectedPartyId] = useState("");
  const [partyGuestName, setPartyGuestName] = useState("");
  const [partyGuestEmail, setPartyGuestEmail] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addingGuest, setAddingGuest] = useState(false);
  const [message, setMessage] = useState("");

  const sortedRsvps = useMemo(
    () =>
      [...rsvps].sort((a, b) => {
        const partyCompare = (a.partyName || a.guestName || "").localeCompare(b.partyName || b.guestName || "", undefined, { sensitivity: "base" });
        if (partyCompare !== 0) return partyCompare;
        return (a.guestName || "").localeCompare(b.guestName || "", undefined, { sensitivity: "base" });
      }),
    [rsvps],
  );

  const sortedParties = useMemo(
    () => [...parties].sort((a, b) => (a.partyName || "").localeCompare(b.partyName || "", undefined, { sensitivity: "base" })),
    [parties],
  );

  const totals = useMemo(
    () => ({
      parties: parties.length,
      invited: rsvps.length,
      attending: rsvps.filter((rsvp) => rsvp.responded && rsvp.attending === true).length,
      declined: rsvps.filter((rsvp) => rsvp.responded && rsvp.attending === false).length,
      pending: rsvps.filter((rsvp) => !rsvp.responded).length,
    }),
    [parties.length, rsvps],
  );

  const fetchData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const [rsvpResponse, partyResponse] = await Promise.all([
        fetch(API_BASE_URL + "/api/bridal-shower/rsvps/getAll"),
        fetch(API_BASE_URL + "/api/bridal-shower/rsvps/getParties"),
      ]);
      if (!rsvpResponse.ok || !partyResponse.ok) throw new Error("Failed to load RSVPs");
      setRsvps((await rsvpResponse.json()) as BridalShowerRsvpRecord[]);
      setParties((await partyResponse.json()) as BridalShowerParty[]);
    } catch {
      setMessage("Could not load bridal shower RSVPs. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (unlocked) void fetchData();
  }, [unlocked]);

  const pressKey = (key: string) => {
    if (!key) return;
    setPasscodeError("");

    if (key === "delete") {
      setEnteredCode((current) => current.slice(0, -1));
      return;
    }

    const nextCode = (enteredCode + key).slice(0, ADMIN_PASSCODE.length);
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
      const response = await fetch(API_BASE_URL + "/api/bridal-shower/rsvps/createParty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partyName: trimmedPartyName, guestName: trimmedGuestName, email: email.trim() || null }),
      });

      if (!response.ok) throw new Error("Failed to create party");

      const created = (await response.json()) as BridalShowerParty;
      await fetchData();
      setPartyName("");
      setGuestName("");
      setEmail("");
      setSelectedPartyId(String(created.id));
      setMessage(created.partyName + " was added.");
    } catch {
      setMessage("Could not add this bridal shower party. The backend may be offline.");
    } finally {
      setSaving(false);
    }
  };

  const addGuestToParty = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedGuestName = partyGuestName.trim();

    if (!selectedPartyId || !trimmedGuestName) {
      setMessage("Choose a party and enter a guest name.");
      return;
    }

    setAddingGuest(true);
    setMessage("");

    try {
      const response = await fetch(API_BASE_URL + "/api/bridal-shower/rsvps/parties/" + selectedPartyId + "/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName: trimmedGuestName, email: partyGuestEmail.trim() || null }),
      });

      if (!response.ok) throw new Error("Failed to add guest");

      await fetchData();
      setPartyGuestName("");
      setPartyGuestEmail("");
      setMessage(trimmedGuestName + " was added to the party.");
    } catch {
      setMessage("Could not add this guest. The backend may be offline.");
    } finally {
      setAddingGuest(false);
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

      const response = await fetch(API_BASE_URL + "/api/bridal-shower/rsvps/importCsv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to import CSV");

      const result = (await response.json()) as CsvImportResult;
      await fetchData();
      setCsvFile(null);
      const importedMessage =
        "Imported " +
        result.partiesCreated +
        " new parties, " +
        result.guestsCreated +
        " new guests, and updated " +
        result.guestsUpdated +
        " guests.";
      const errorMessage = result.errors.length > 0 ? " " + result.errors.length + " row issue(s): " + result.errors.join(" ") : "";
      setMessage(importedMessage + errorMessage);
    } catch {
      setMessage("Could not import this CSV. Check the file format and backend connection.");
    } finally {
      setImporting(false);
    }
  };

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-10 text-sepia">
        <section className="w-full max-w-sm text-center">
          <Link to="/" className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-sepia/60 transition-colors hover:text-gold">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sepia/15">
            <Lock className="h-5 w-5 text-sepia/70" />
          </div>
          <h1 className="mt-6 font-serif text-4xl lowercase text-sepia">bridal shower admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-sepia/60">Enter the passcode to manage bridal shower invites and attendance.</p>

          <div className="mt-8 flex justify-center gap-3">
            {Array.from({ length: ADMIN_PASSCODE.length }).map((_, index) => (
              <span key={index} className={index < enteredCode.length ? "h-3 w-3 rounded-full border border-sepia/40 bg-sepia" : "h-3 w-3 rounded-full border border-sepia/40 bg-transparent"} />
            ))}
          </div>
          {passcodeError && <p className="mt-4 text-sm uppercase tracking-[0.18em] text-red-900/70">{passcodeError}</p>}

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
                <span key={"blank-" + index} />
              ),
            )}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-10 text-sepia lg:px-10 xl:px-14">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-eyebrow text-sepia/65 transition-colors hover:text-gold">
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

      <section className="mx-auto w-full max-w-[1400px] py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-eyebrow text-gold">bridal shower admin</p>
            <h1 className="mt-4 font-serif text-5xl lowercase leading-none text-sepia md:text-7xl">shower rsvps</h1>
          </div>
          <button
            type="button"
            onClick={() => void fetchData()}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-sepia/15 px-5 text-xs uppercase tracking-eyebrow text-sepia transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
          >
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            Refresh
          </button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-5">
          {[
            { label: "Parties", value: totals.parties },
            { label: "Guests", value: totals.invited },
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

        <div className="mt-10 grid w-full items-start gap-8 xl:grid-cols-[minmax(380px,0.8fr)_minmax(0,1.6fr)]">
          <div className="w-full min-w-0 space-y-8">
            <form onSubmit={importCsv} className="border border-sepia/10 bg-background p-5 md:p-7">
              <h2 className="font-serif text-3xl text-sepia">Import CSV</h2>
              <p className="mt-3 text-sm leading-relaxed text-sepia/60">Upload one row per guest. Guests with the same partyName will be grouped together.</p>
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
                <a href="/sample-bridal-shower-rsvp-import.csv" download className="inline-flex text-xs uppercase tracking-eyebrow text-sepia/65 underline-offset-4 transition-colors hover:text-gold hover:underline">
                  Download sample CSV
                </a>
              </div>
              <button type="submit" disabled={importing} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-sepia px-5 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold disabled:opacity-60">
                <FileUp className="h-4 w-4" />
                {importing ? "Importing" : "Import CSV"}
              </button>
            </form>

            <form onSubmit={createParty} className="border border-sepia/10 bg-background p-5 md:p-7">
              <h2 className="font-serif text-3xl text-sepia">Add party</h2>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">Party name</span>
                  <input value={partyName} onChange={(event) => setPartyName(event.target.value)} className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold" placeholder="Smith Party" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">First guest</span>
                  <input value={guestName} onChange={(event) => setGuestName(event.target.value)} className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold" placeholder="Jane Smith" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">Email optional</span>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold" placeholder="name@example.com" type="email" />
                </label>
              </div>
              <button type="submit" disabled={saving} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-sepia px-5 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold disabled:opacity-60">
                <Plus className="h-4 w-4" />
                {saving ? "Adding" : "Add party"}
              </button>
            </form>

            <form onSubmit={addGuestToParty} className="border border-sepia/10 bg-background p-5 md:p-7">
              <h2 className="font-serif text-3xl text-sepia">Add guest to party</h2>
              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">Party</span>
                  <select value={selectedPartyId} onChange={(event) => setSelectedPartyId(event.target.value)} className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold">
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
                  <input value={partyGuestName} onChange={(event) => setPartyGuestName(event.target.value)} className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold" placeholder="Mary Smith" />
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-eyebrow text-sepia/50">Email optional</span>
                  <input value={partyGuestEmail} onChange={(event) => setPartyGuestEmail(event.target.value)} className="mt-2 min-h-12 w-full border border-sepia/15 bg-cream px-4 font-serif text-lg outline-none transition-colors focus:border-gold" placeholder="name@example.com" type="email" />
                </label>
              </div>
              <button type="submit" disabled={addingGuest} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-sepia px-5 text-xs uppercase tracking-eyebrow text-cream transition-colors hover:bg-gold disabled:opacity-60">
                <UserPlus className="h-4 w-4" />
                {addingGuest ? "Adding" : "Add guest"}
              </button>
              {message && <p className="mt-4 text-sm leading-relaxed text-sepia/65">{message}</p>}
            </form>
          </div>

          <div className="min-w-0 border border-sepia/10 bg-background">
            <div className="flex items-center justify-between border-b border-sepia/10 p-5">
              <h2 className="font-serif text-3xl text-sepia">Current Bridal Shower RSVPs</h2>
              <p className="text-xs uppercase tracking-eyebrow text-sepia/45">{sortedRsvps.length} guests</p>
            </div>

            <div className="max-h-[780px] overflow-auto">
              {sortedRsvps.length === 0 ? (
                <p className="p-5 text-sm text-sepia/60">{loading ? "Loading RSVPs..." : "No bridal shower RSVPs yet."}</p>
              ) : (
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead className="sticky top-0 bg-cream">
                    <tr className="border-b border-sepia/10 text-xs uppercase tracking-[0.18em] text-sepia/45">
                      <th className="px-5 py-4 font-normal">Party</th>
                      <th className="px-5 py-4 font-normal">Name</th>
                      <th className="px-5 py-4 font-normal">Status</th>
                      <th className="px-5 py-4 font-normal">Email</th>
                      <th className="px-5 py-4 font-normal">Note</th>
                      <th className="px-5 py-4 font-normal">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRsvps.map((rsvp) => (
                      <tr key={rsvp.id ?? rsvp.guestName} className="border-b border-sepia/10">
                        <td className="px-5 py-4 font-serif text-base text-sepia/75">{rsvp.partyName || rsvp.guestName}</td>
                        <td className="px-5 py-4 font-serif text-lg text-sepia">{rsvp.guestName}</td>
                        <td className="px-5 py-4">
                          <span className={rsvp.responded && rsvp.attending === true ? "inline-flex rounded-full bg-gold/15 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-sepia" : rsvp.responded && rsvp.attending === false ? "inline-flex rounded-full bg-red-900/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-red-950/70" : "inline-flex rounded-full bg-sepia/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-sepia/60"}>
                            {statusLabel(rsvp)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-sepia/65">{rsvp.email || "-"}</td>
                        <td className="max-w-xs px-5 py-4 text-sm text-sepia/65">{rsvp.message || "-"}</td>
                        <td className="px-5 py-4 text-sm text-sepia/55">{rsvp.submittedAt ? new Date(rsvp.submittedAt).toLocaleDateString() : "-"}</td>
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

export default BridalShowerAdmin;
