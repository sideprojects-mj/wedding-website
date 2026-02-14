import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const hotels = [
  { name: "The Meritage Resort & Spa", distance: "5 min from venue", stars: 5, price: "$$$", note: "Room block available — mention 'Grace & Mark Wedding' for a discounted rate." },
  { name: "Napa Valley Marriott", distance: "10 min from venue", stars: 4, price: "$$", note: "Great value with complimentary breakfast." },
  { name: "The Westin Verasa", distance: "12 min from venue", stars: 4, price: "$$", note: "Walking distance to downtown Napa restaurants." },
  { name: "Carneros Resort and Spa", distance: "15 min from venue", stars: 5, price: "$$$$", note: "Luxury cottages with stunning vineyard views." },
];

const Hotels = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="Hotels" subtitle="Where to stay during our wedding weekend" />
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {hotels.map((h, i) => (
        <ScrollReveal key={h.name} delay={i * 0.1}>
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="font-serif text-xl">{h.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">{h.distance}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <div className="flex">
                      {Array.from({ length: h.stars }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 text-primary fill-primary" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{h.price}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1 text-xs">
                  <ExternalLink className="w-3 h-3" /> Book
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{h.note}</p>
            </CardContent>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  </main>
);

export default Hotels;
