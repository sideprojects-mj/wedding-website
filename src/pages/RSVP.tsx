import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const RSVP = () => {
  const [submitted, setSubmitted] = useState(false);
  const [attending, setAttending] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thank you for your RSVP!");
  };

  if (submitted) {
    return (
      <main className="min-h-screen pb-20">
        <PageHeader title="Thank You!" subtitle="We can't wait to celebrate with you" />
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Heart className="w-16 h-16 text-primary fill-primary mx-auto" />
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <PageHeader title="RSVP" subtitle="Kindly respond by September 1, 2025" />
      <div className="max-w-lg mx-auto px-4">
        <ScrollReveal>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" required />
                </div>

                <div className="space-y-3">
                  <Label>Will you be attending?</Label>
                  <RadioGroup value={attending} onValueChange={setAttending}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes" className="font-normal">Joyfully accepts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no" className="font-normal">Regretfully declines</Label>
                    </div>
                  </RadioGroup>
                </div>

                {attending === "yes" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label>Number of Guests</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Meal Preference</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beef">Beef</SelectItem>
                          <SelectItem value="chicken">Chicken</SelectItem>
                          <SelectItem value="fish">Fish</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="dietary">Dietary Restrictions or Notes</Label>
                  <Textarea id="dietary" placeholder="Any allergies or special requests..." />
                </div>

                <Button type="submit" className="w-full uppercase tracking-[0.2em]">
                  Send RSVP
                </Button>
              </form>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </main>
  );
};

export default RSVP;
