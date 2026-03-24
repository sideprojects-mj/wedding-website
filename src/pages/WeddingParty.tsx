import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";

const brideParty = [
  { name: "Lucy Safranek", role: "Maid of Honor", relation: "Friend of the Bride" },
  { name: "Miriam Skinner", role: "Maid of Honor", relation: "Friend of the Bride" },
];

const groomParty = [
  { name: "Jack Josephs", role: "Best Man", relation: "Brother of the Groom" },
  { name: "Sharbel Habchy", role: "Best Man", relation: "Friend of the Groom" },
  { name: "Michael Josephs", role: "Groomsman", relation: "Brother of the Groom" },
  { name: "Christopher Josephs", role: "Groomsman", relation: "Brother of the Groom" },
  { name: "Patrick Josephs", role: "Groomsman", relation: "Brother of the Groom" },
  { name: "Andrew Kelly", role: "Groomsman", relation: "Friend of the Groom" },
  { name: "Nathaniel ...", role: "Groomsman", relation: "Friend of the Groom" },
];

const PartyCard = ({ person, delay }: { person: typeof brideParty[0]; delay: number }) => (
  <ScrollReveal delay={delay}>
    <div className="text-center ">
      <CardContent className="pt-8 pb-6">
        {/*<div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">*/}
        {/*  <span className="text-2xl font-serif text-accent-foreground">{person.name[0]}</span>*/}
        {/*</div>*/}
        <h3 className="text-3xl font-serif">{person.name}</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-primary mt-1 font-semibold">{person.role}</p>
        <p className="text-sm text-muted-foreground mt-2">{person.relation}</p>
      </CardContent>
    </div>
  </ScrollReveal>
);

const WeddingParty = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="Wedding Party" />
    <div className="max-w-5xl mx-auto px-4 flex flex-rows">
      <div className="gap-6 mb-16 w-1/2">
        {brideParty.map((p, i) => <PartyCard key={p.name} person={p} delay={i * 0.1} />)}
      </div>
      <div className="gap-6 w-1/2">
        {groomParty.map((p, i) => <PartyCard key={p.name} person={p} delay={i * 0.1} />)}
      </div>
    </div>
  </main>
);

export default WeddingParty;
