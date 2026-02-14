import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, ExternalLink } from "lucide-react";

const registries = [
  { name: "Crate & Barrel", url: "#" },
  { name: "Williams Sonoma", url: "#" },
  { name: "Amazon", url: "#" },
];

const Registry = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="Registry" subtitle="Your presence is the greatest gift, but if you wish to honor us..." />
    <div className="max-w-2xl mx-auto px-4 space-y-6">
      <ScrollReveal>
        <Card className="border-border/50 text-center">
          <CardContent className="pt-8 pb-8">
            <Gift className="w-10 h-10 text-primary mx-auto mb-4" />
            <p className="text-muted-foreground max-w-md mx-auto">
              We are registered at the following stores. We're also grateful for contributions to our honeymoon fund!
            </p>
          </CardContent>
        </Card>
      </ScrollReveal>

      <div className="grid gap-4">
        {registries.map((r, i) => (
          <ScrollReveal key={r.name} delay={i * 0.1}>
            <Card className="border-border/50 hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between py-6">
                <span className="font-serif text-lg">{r.name}</span>
                <Button variant="outline" size="sm" className="gap-1">
                  <ExternalLink className="w-3 h-3" /> View Registry
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </main>
);

export default Registry;
