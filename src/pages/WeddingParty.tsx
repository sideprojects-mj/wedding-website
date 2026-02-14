import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";

const brideParty = [
  { name: "Sarah Mitchell", role: "Maid of Honor", relation: "Sister of the Bride" },
  { name: "Emily Chen", role: "Bridesmaid", relation: "College Roommate" },
  { name: "Olivia Martinez", role: "Bridesmaid", relation: "Childhood Friend" },
  { name: "Grace Kim", role: "Bridesmaid", relation: "Work Bestie" },
];

const groomParty = [
  { name: "Michael Reeves", role: "Best Man", relation: "Brother of the Groom" },
  { name: "James Cooper", role: "Groomsman", relation: "College Friend" },
  { name: "Daniel Park", role: "Groomsman", relation: "Childhood Friend" },
  { name: "Ryan Thompson", role: "Groomsman", relation: "Fraternity Brother" },
];

const PartyCard = ({ person, delay }: { person: typeof brideParty[0]; delay: number }) => (
  <ScrollReveal delay={delay}>
    <Card className="text-center border-border/50 bg-card hover:shadow-md transition-shadow">
      <CardContent className="pt-8 pb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
          <span className="text-2xl font-serif text-accent-foreground">{person.name[0]}</span>
        </div>
        <h3 className="text-lg font-serif">{person.name}</h3>
        <p className="text-xs uppercase tracking-[0.2em] text-primary mt-1 font-semibold">{person.role}</p>
        <p className="text-sm text-muted-foreground mt-2">{person.relation}</p>
      </CardContent>
    </Card>
  </ScrollReveal>
);

const WeddingParty = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="Wedding Party" subtitle="The people standing by our side" />
    <div className="max-w-5xl mx-auto px-4">
      <ScrollReveal>
        <h2 className="text-2xl font-serif text-center mb-8">Bride's Side</h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {brideParty.map((p, i) => <PartyCard key={p.name} person={p} delay={i * 0.1} />)}
      </div>
      <ScrollReveal>
        <h2 className="text-2xl font-serif text-center mb-8">Groom's Side</h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {groomParty.map((p, i) => <PartyCard key={p.name} person={p} delay={i * 0.1} />)}
      </div>
    </div>
  </main>
);

export default WeddingParty;
