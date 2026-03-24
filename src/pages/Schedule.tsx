import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import WeddingGlobe from "@/components/WeddingGlobe";
import { Clock } from "lucide-react";

const events = [
  { time: "3:30 PM", title: "Guest Arrival", desc: "Welcome drinks and light refreshments on the terrace." },
];

const Schedule = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="Schedule" subtitle="A timeline of our wedding day" />
    <div className="max-w-2xl mx-auto px-4">
      {events.map((e, i) => (
        <ScrollReveal key={i} delay={i * 0.08}>
          <div className="flex gap-6 py-6 border-b border-border last:border-0">
            <div className="flex flex-col items-center">
              <Clock className="w-4 h-4 text-primary mb-1" />
              <div className="w-px flex-1 bg-border" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{e.time}</p>
              <h3 className="text-xl font-serif mt-1">{e.title}</h3>
              <p className="text-muted-foreground text-sm mt-1">{e.desc}</p>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>

    {/* Globe Section */}
    <ScrollReveal>
      <div className="max-w-4xl mx-auto px-4 mt-16">
        <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">Wedding Location</p>
        <h2 className="text-center text-3xl font-serif text-foreground mb-8">The Grand Estate, Napa Valley</h2>
        <div className="rounded-2xl overflow-hidden bg-[#0a0a1a]">
          <WeddingGlobe />
        </div>
      </div>
    </ScrollReveal>
  </main>
);

export default Schedule;
