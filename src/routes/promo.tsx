import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { Tag, Clock } from "lucide-react";

const PROMOS = [
  { title: "−15% на интраоральные сканеры Medit", desc: "Расширенная гарантия 3 года и комплект калибровочных насадок в подарок.", end: "до 30 июня", tag: "Хит" },
  { title: "Скидка 10% на расходные материалы", desc: "При заказе циркониевых дисков XTCERA или Aidite от 10 шт. — скидка 10%.", end: "постоянно", tag: "Выгодно" },
  { title: "Бесплатный аудит клиники", desc: "Инженер оценит существующее оборудование и даст рекомендации.", end: "постоянно", tag: "Бесплатно" },
];

export const Route = createFileRoute("/promo")({
  head: () => ({ meta: [
    { title: "Акции — DDS MARKET" },
    { name: "description", content: "Актуальные акции и спецпредложения на стоматологическое оборудование и расходные материалы." },
    { property: "og:title", content: "Акции и спецпредложения — DDS MARKET" },
    { property: "og:description", content: "Актуальные акции и спецпредложения на стоматологическое оборудование и расходные материалы." },
    { property: "og:url", content: "https://ddsmarket.ru/promo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Акции и спецпредложения — DDS MARKET" },
      { name: "twitter:description", content: "Актуальные акции и спецпредложения на стоматологическое оборудование и расходные материалы." },
  ], links: [{ rel: "canonical", href: "https://ddsmarket.ru/promo" }]}),
  component: () => (
    <PageShell title="Акции и спецпредложения" subtitle="Скидки и бонусы для постоянных клиентов." crumbs={[{ label: "Акции" }]}>
      <div className="container mx-auto px-6 py-14 grid md:grid-cols-2 gap-5">
        {PROMOS.map((p) => (
          <div key={p.title} className="group relative overflow-hidden p-8 rounded-3xl border border-border bg-card hover:shadow-xl transition">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-gradient-to-br from-primary/10 to-accent/20" />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/20 text-primary text-xs font-medium"><Tag className="size-3" /> {p.tag}</div>
              <h3 className="mt-4 font-display text-2xl font-bold">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-muted-foreground inline-flex items-center gap-1.5"><Clock className="size-4" /> {p.end}</span>
                <Button asChild size="sm"><Link to="/contacts">Получить</Link></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  ),
});
