import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import WeddingGlobe from "@/components/WeddingGlobe";
import { Clock } from "lucide-react";

const events = [
  { time: "3:30 PM", title: "Guest Arrival", desc: "Welcome drinks and light refreshments on the terrace." },
  { time: "4:00 PM", title: "Ceremony", desc: "Join us in the garden for the ceremony." },
  { time: "5:00 PM", title: "Cocktail Hour", desc: "Enjoy cocktails and hors d'oeuvres by the fountain." },
  { time: "6:30 PM", title: "Reception & Dinner", desc: "Dinner, toasts, and celebration in the grand ballroom." },
  { time: "8:00 PM", title: "First Dance", desc: "The couple takes the floor." },
  { time: "8:30 PM", title: "Dancing & Festivities", desc: "Dance the night away!" },
  { time: "11:00 PM", title: "Sparkler Send-Off", desc: "Send off the newlyweds in style." },
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
