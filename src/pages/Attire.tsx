import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shirt } from "lucide-react";

const Attire = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="Attire" subtitle="What to wear to our celebration" />
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      <ScrollReveal>
        <Card className="border-border/50">
          <CardHeader className="text-center">
            <Shirt className="w-8 h-8 text-primary mx-auto mb-2" />
            <CardTitle className="font-serif text-2xl">Black Tie Optional</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 text-muted-foreground">
            <p>We kindly ask our guests to dress in formal attire for our celebration.</p>
          </CardContent>
        </Card>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-6">
        <ScrollReveal delay={0.1} direction="left">
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Ladies</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Floor-length gowns or elegant cocktail dresses</p>
              <p>• Soft, romantic colors welcome</p>
              <p>• Please avoid white, ivory, or cream</p>
              <p>• Comfortable shoes recommended for garden terrain</p>
            </CardContent>
          </Card>
        </ScrollReveal>

        <ScrollReveal delay={0.2} direction="right">
          <Card className="border-border/50 h-full">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Gentlemen</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Tuxedo or dark suit</p>
              <p>• Dress shirt and tie</p>
              <p>• Dark dress shoes</p>
              <p>• Optional: pocket square in blush or navy</p>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </div>
  </main>
);

export default Attire;
