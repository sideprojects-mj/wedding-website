import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wine, Mountain, Utensils, Camera } from "lucide-react";

const activities = [
  { icon: Wine, title: "Wine Tasting", desc: "Explore world-renowned wineries in Napa Valley. We recommend Robert Mondavi, Opus One, and Domaine Carneros." },
  { icon: Mountain, title: "Hiking", desc: "Take in the stunning views at Skyline Wilderness Park or the Oat Hill Mine Trail." },
  { icon: Utensils, title: "Fine Dining", desc: "The French Laundry, Bottega, and Bistro Don Giovanni are all within a short drive." },
  { icon: Camera, title: "Hot Air Balloon Rides", desc: "See Napa Valley from above! Book a sunrise balloon ride for an unforgettable experience." },
];

const ThingsToDo = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="Things To Do" subtitle="Make the most of your trip to Napa Valley" />
    <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-6">
      {activities.map((a, i) => (
        <ScrollReveal key={a.title} delay={i * 0.1}>
          <Card className="border-border/50 h-full hover:shadow-md transition-shadow">
            <CardHeader>
              <a.icon className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="font-serif text-xl">{a.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{a.desc}</p>
            </CardContent>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  </main>
);

export default ThingsToDo;
