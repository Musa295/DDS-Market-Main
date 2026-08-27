import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { SERVICES } from "@/components/site/data";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Услуги — DDS MARKET" },
    { name: "description", content: "Подбор оборудования, поставка, монтаж, обучение и сервисное обслуживание." },
    { property: "og:title", content: "Услуги — DDS MARKET" },
    { property: "og:description", content: "Подбор оборудования, поставка, монтаж, обучение и сервисное обслуживание." },
    { property: "og:url", content: "https://ddsmarket.ru/services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Услуги — DDS MARKET" },
      { name: "twitter:description", content: "Подбор оборудования, поставка, монтаж, обучение и сервисное обслуживание." },
  ], links: [{ rel: "canonical", href: "https://ddsmarket.ru/services" }]}),
  component: () => (
    <PageShell title="Услуги" subtitle="Полный спектр услуг по оснащению и сопровождению стоматологических клиник и лабораторий." crumbs={[{ label: "Услуги" }]}>
      <div className="container mx-auto px-6 py-14 grid md:grid-cols-2 gap-5">
        {SERVICES.map((s, i) => (
          <div key={s.title} className="p-7 rounded-2xl border border-border bg-card">
            <div className="text-sm font-mono text-primary">0{i+1}</div>
            <h3 className="mt-2 font-display text-2xl font-bold">{s.title}</h3>
            <p className="mt-3 text-muted-foreground">{s.desc}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Договор и официальные документы", "Прозрачная стоимость", "Сроки фиксируются заранее"].map((f) => (
                <li key={f} className="flex gap-2"><CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" /> {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container mx-auto px-6 pb-16">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 text-center">
          <h2 className="font-display text-3xl font-bold">Обсудим вашу задачу</h2>
          <p className="mt-2 opacity-80">Инженер свяжется в течение 30 минут.</p>
          <Button asChild variant="secondary" size="lg" className="mt-6"><Link to="/contacts">Оставить заявку</Link></Button>
        </div>
      </div>
    </PageShell>
  ),
});
