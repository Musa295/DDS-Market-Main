import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Cog } from "lucide-react";

export const Route = createFileRoute("/milling")({
  head: () => ({ meta: [
    { title: "Фрезерный центр — Digital Dentistry Solutions" },
    { name: "description", content: "Собственный фрезерный центр в Москве: каркасы из циркония, диоксида кремния, PMMA, титана." },
    { property: "og:title", content: "Фрезерный центр — DDS MARKET Москва" },
    { property: "og:description", content: "Собственный фрезерный центр в Москве: каркасы из циркония, диоксида кремния, PMMA, титана." },
    { property: "og:url", content: "https://ddsmarket.ru/milling" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Фрезерный центр — DDS MARKET Москва" },
      { name: "twitter:description", content: "Собственный фрезерный центр в Москве: каркасы из циркония, диоксида кремния, PMMA, титана." },
  ], links: [{ rel: "canonical", href: "https://ddsmarket.ru/milling" }]}),
  component: () => (
    <PageShell title="Фрезерный центр" subtitle="Изготовление каркасов и реставраций на 5-осевом оборудовании VHF и Roland. Приём STL по защищённым каналам." crumbs={[{ label: "Фрезерный центр" }]}>
      <div className="container mx-auto px-6 py-14 grid lg:grid-cols-[1fr_400px] gap-10">
        <div>
          <h2 className="font-display text-3xl font-bold">Что фрезеруем</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              { t: "Цирконий", d: "Каркасы и монолитные коронки, 1200 МПа." },
              { t: "Диоксид кремния", d: "Эстетические реставрации, виниры, вкладки." },
              { t: "PMMA / воск", d: "Временные конструкции, прототипы." },
              { t: "Титан", d: "Индивидуальные абатменты, балки All-on-4/6." },
              { t: "CoCr", d: "Каркасы бюгельных протезов." },
              { t: "Композит", d: "Постоянные коронки на боковую группу." },
            ].map((m) => (
              <div key={m.t} className="p-5 rounded-2xl border border-border bg-card">
                <div className="font-semibold flex items-center gap-2"><Cog className="size-4 text-primary" /> {m.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-12 font-display text-3xl font-bold">Преимущества</h2>
          <ul className="mt-5 space-y-3">
            {[
              "Срок изготовления каркаса из циркония — от 24 часов",
              "Контроль качества на каждом этапе, замеры под микроскопом",
              "Бесплатная доставка готовых работ по Москве в день готовности",
              "Приём заказов 24/7 через защищённый веб-портал",
              "Гибкая система скидок для лабораторий-партнёров",
            ].map((f) => (
              <li key={f} className="flex gap-3"><CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" /> <span>{f}</span></li>
            ))}
          </ul>
        </div>

        <aside className="h-fit p-7 rounded-3xl bg-primary text-primary-foreground sticky top-32">
          <div className="text-sm opacity-80">Прайс от</div>
          <div className="font-display text-4xl font-bold mt-1">990 ₽</div>
          <div className="text-sm opacity-80">за единицу циркониевого каркаса</div>
          <Button asChild variant="secondary" size="lg" className="w-full mt-6"><Link to="/contacts">Отправить STL</Link></Button>
          <div className="mt-4 text-xs opacity-70">Расчёт стоимости — в течение часа в рабочее время.</div>
        </aside>
      </div>
    </PageShell>
  ),
});
