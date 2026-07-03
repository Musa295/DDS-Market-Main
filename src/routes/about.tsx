import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Check, Truck, Wrench, ShieldCheck, Layers, Printer, FlaskConical, Boxes, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "О компании — DDS MARKET" },
      { name: "description", content: "DDS MARKET — комплексные поставки оборудования для фрезерных центров и зуботехнических лабораторий: CAD/CAM, 3D-печать, печи, инфраструктура, расходные материалы." },
      { property: "og:title", content: "О компании — DDS MARKET" },
      { property: "og:description", content: "Комплексные поставки оборудования для фрезерных центров и зуботехнических лабораторий." },
      { property: "og:url", content: "https://ddsmarket.ru/about" },
    ],
    links: [{ rel: "canonical", href: "https://ddsmarket.ru/about" }],
  }),
  component: AboutPage,
});

const SUPPLY = [
  {
    icon: Layers,
    title: "CAD/CAM-решения",
    text: "Фрезерные станки (сухие, мокрые, гибридные), интраоральные и лабораторные 3D-сканеры, программное обеспечение.",
  },
  {
    icon: Printer,
    title: "Оборудование для цифровой печати",
    text: "3D-принтеры, в том числе по металлу — SLM.",
  },
  {
    icon: FlaskConical,
    title: "Традиционное зуботехническое оборудование",
    text: "Печи для синтеризации и обжига, литейные установки, полимеризаторы, пескоструйные аппараты, микромоторы.",
  },
  {
    icon: Wrench,
    title: "Инфраструктура лабораторий",
    text: "Компрессоры и осушители, вытяжки и пылесосы, рабочие столы и системы хранения.",
  },
  {
    icon: Boxes,
    title: "Расходные материалы",
    text: "Циркониевые и PMMA-блоки, воски, фотополимеры, фрезы, титановые заготовки.",
  },
];

function AboutPage() {
  return (
    <PageShell
      title="О нас"
      subtitle="Комплексные поставки оборудования для фрезерных центров и зуботехнических лабораторий, частных практик и государственных учреждений."
      crumbs={[{ label: "О нас" }]}
    >
      <div className="container mx-auto px-6 py-14 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-5 text-foreground/90 leading-relaxed">
          <p>
            Мы специализируемся на комплексных поставках оборудования для фрезерных центров и зуботехнических
            лабораторий, частных практик и государственных учреждений. Предлагаем полный цикл услуг: от подбора и
            поставки высокотехнологичного оборудования до его монтажа, настройки и последующего сервисного
            обслуживания.
          </p>
          <p>
            В нашем портфеле — решения для цифровой стоматологии (CAD/CAM-системы, 3D-сканеры, фрезерные станки,
            3D-принтеры), традиционное зуботехническое оборудование (печи для обжига, литейные установки,
            полимеризаторы), а также инфраструктура лабораторий (вытяжные системы, компрессоры, рабочие места).
          </p>
          <p className="font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" /> Поставляем:
          </p>
          <ul className="space-y-3 pl-1">
            {[
              {
                t: "CAD/CAM-решения",
                d: "фрезерные станки (сухие, мокрые, гибридные), интраоральные и лабораторные 3D-сканеры, программное обеспечение;",
              },
              {
                t: "Оборудование для цифровой печати",
                d: "3D-принтеры (в т. ч. по металлу — SLM);",
              },
              {
                t: "Традиционное зуботехническое оборудование",
                d: "печи для синтеризации и обжига керамики, литейные установки, полимеризаторы, пескоструйные аппараты, микромоторы;",
              },
              {
                t: "Инфраструктура лабораторий",
                d: "компрессоры и осушители, вытяжки и пылесосы, рабочие столы и системы хранения;",
              },
              {
                t: "Расходные материалы",
                d: "циркониевые и PMMA-блоки, воски, фотополимеры, фрезы, титановые заготовки.",
              },
            ].map((it) => (
              <li key={it.t} className="flex items-start gap-3">
                <span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  <b className="text-foreground">{it.t}:</b>{" "}
                  <span className="text-muted-foreground">{it.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <p>
            Работаем с частными и корпоративными клиентами, предлагаем гибкие условия сотрудничества и индивидуальный
            подход.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 content-start">
          {[
            { i: ShieldCheck, n: "100%", l: "оригинал" },
            { i: Truck, n: "РФ", l: "доставка" },
            { i: Wrench, n: "24/7", l: "сервис" },
            { i: Check, n: "Под ключ", l: "монтаж и обучение" },
          ].map((s) => (
            <div key={s.l} className="p-5 rounded-2xl border border-border bg-card">
              <s.i className="size-5 text-primary" />
              <div className="mt-3 font-display text-2xl font-bold">{s.n}</div>
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 pb-16">
        <h2 className="font-display text-2xl font-bold mb-6">Поставляем</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUPPLY.map((p) => (
            <div key={p.title} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition">
              <p.icon className="size-6 text-primary" />
              <div className="mt-3 font-semibold text-lg">{p.title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
