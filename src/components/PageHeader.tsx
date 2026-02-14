import ScrollReveal from "./ScrollReveal";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <section className="pt-28 pb-12 text-center">
    <ScrollReveal>
      <h1 className="text-4xl md:text-6xl font-serif font-light text-foreground">{title}</h1>
      {subtitle && (
        <p className="mt-4 text-muted-foreground tracking-wide max-w-xl mx-auto">{subtitle}</p>
      )}
      <div className="mt-6 mx-auto w-16 h-px bg-primary" />
    </ScrollReveal>
  </section>
);

export default PageHeader;
