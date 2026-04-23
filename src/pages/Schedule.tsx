import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import WeddingGlobe from "@/components/WeddingGlobe";
import { Clock } from "lucide-react";

const events = [
    { day: "Thursday", time: "", title: "Welcome Drinks", desc: "At Prince Solms." },
    { day: "Friday", time: "Morning", title: "Sand Volleyball and Swimming", desc: "Join for a relaxed morning by the water." },
    { day: "Saturday", time: "3:30 PM", title: "Mass", desc: "Wedding mass begins at 3:30 PM." },
    { day: "Saturday", time: "5:00 PM", title: "Cocktail Hour", desc: "Begins at 5:00 PM." },
    { day: "Saturday", time: "6:00 PM", title: "Reception", desc: "Reception opens at 6:00 PM." },
    { day: "Saturday", time: "10:30 PM", title: "Late-Night Snacks", desc: "Late-night snacks come out at 10:30 PM." },
    { day: "Saturday", time: "12:00 AM", title: "After Party Ends", desc: "Be ready to party! The celebration closes at 12:00 AM." },
];

// Group events by day
const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.day]) acc[event.day] = [];
    acc[event.day].push(event);
    return acc;
}, {});

const dayOrder = ["Thursday", "Friday", "Saturday"];


const Schedule = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="Schedule" subtitle="A timeline of our wedding weekend" />
      <div className="max-w-2xl mx-auto px-4">
          {dayOrder.filter(day => groupedEvents[day]).map((day, di) => (
              <ScrollReveal key={day} delay={di * 0.1}>
                  <div className="mt-10 mb-2">
                      <h2 className="text-2xl font-serif text-foreground">{day}</h2>
                      <div className="w-16 h-px bg-primary mt-1 mb-4" />
                  </div>
                  {groupedEvents[day].map((e, i) => (
                      <ScrollReveal key={i} delay={di * 0.1 + i * 0.08}>
                          <div className="flex gap-6 py-5 border-b border-border last:border-0">
                              <div className="flex flex-col items-center">
                                  <Clock className="w-4 h-4 text-primary mb-1" />
                                  <div className="w-px flex-1 bg-border" />
                              </div>
                              <div>
                                  {e.time && (
                                      <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">{e.time}</p>
                                  )}
                                  <h3 className="text-xl font-serif mt-1">{e.title}</h3>
                                  <p className="text-muted-foreground text-sm mt-1">{e.desc}</p>
                              </div>
                          </div>
                      </ScrollReveal>
                  ))}
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
