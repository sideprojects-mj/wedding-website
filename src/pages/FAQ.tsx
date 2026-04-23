import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Can I bring a plus one?", a: "If your invitation includes a plus one, their name will appear on your RSVP." },
  { q: "Are children welcome?", a: "Our wedding will be an adults-only celebration." },
  { q: "Is there parking at the venue?", a: "Yes! Complimentary valet parking will be available for all guests." },
  { q: "What time should I arrive?", a: "We recommend arriving by 3:30 PM to be seated before the ceremony begins at 4:00 PM." },
  { q: "Will there be an open bar?", a: "Yes! We'll have a full open bar with wine, beer, cocktails, and non-alcoholic options." },
  { q: "Can I take photos during the ceremony?", a: "We kindly ask for an unplugged ceremony. Our photographer will capture every moment, and we'll share the photos with you!" },
  { q: "What if I have dietary restrictions?", a: "Please note any dietary restrictions on your RSVP card and we'll make sure to accommodate you." },
];

const FAQ = () => (
  <main className="min-h-screen pb-20">
    <PageHeader title="FAQ" subtitle="Answers to your most common questions" />
    <div className="max-w-2xl mx-auto px-4">
      <ScrollReveal>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="font-serif text-lg text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollReveal>
    </div>
  </main>
);

export default FAQ;
