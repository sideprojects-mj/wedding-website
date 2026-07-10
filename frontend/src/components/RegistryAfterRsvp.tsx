import { ExternalLink } from "lucide-react";

export const registryLinks = [
  {
    name: "Bloomingdales",
    href: "https://www.bloomingdales.com/registry/Grace-Bascon-Mark-Josephs/1345321",
  },
  {
    name: "Crate & Barrel",
    href: "https://www.crateandbarrel.com/gift-registry/grace-bascon-and-mark-josephs/r7507079",
  },
];

type RegistryAfterRsvpProps = {
  variant?: "wedding" | "bridalShower";
};

const styles = {
  wedding: {
    shell: "border-sepia/10 bg-background/70",
    eyebrow: "text-gold",
    title: "text-sepia",
    body: "text-sepia/60",
    divider: "bg-sepia/10",
    button: "bg-sepia text-cream hover:bg-gold",
    dot: "bg-gold/55",
  },
  bridalShower: {
    shell: "border-[#0a3475]/14 bg-white/62",
    eyebrow: "text-[#e85d91]",
    title: "text-[#0a3475]",
    body: "text-[#0a3475]/62",
    divider: "bg-[#0a3475]/12",
    button: "bg-[#0a3475] text-white hover:bg-[#e85d91]",
    dot: "bg-[#e85d91]/65",
  },
};

const RegistryAfterRsvp = ({ variant = "wedding" }: RegistryAfterRsvpProps) => {
  const theme = styles[variant];

  return (
    <div className={`mx-auto mt-7 max-w-md border p-5 text-center ${theme.shell}`}>
      <div className="flex items-center justify-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
        <p className={`text-[10px] uppercase tracking-eyebrow ${theme.eyebrow}`}>registry</p>
        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
      </div>
      <h3 className={`mt-3 font-serif text-3xl lowercase leading-none ${theme.title}`}>
        for our home
      </h3>
      <p className={`mx-auto mt-3 max-w-xs text-sm leading-relaxed ${theme.body}`}>
        Thank you for celebrating with us. Our registries are linked here if you would like to take a peek.
      </p>
      <div className={`mx-auto mt-5 h-px w-20 ${theme.divider}`} />
      <div className="mt-5 flex flex-col items-center gap-3">
        {registryLinks.map((registry) => (
          <a
            key={registry.name}
            href={registry.href}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex min-h-11 w-full max-w-[260px] items-center justify-center gap-3 rounded-full px-6 text-xs uppercase tracking-eyebrow transition-transform duration-300 hover:scale-105 ${theme.button}`}
          >
            {registry.name}
            <ExternalLink className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default RegistryAfterRsvp;
