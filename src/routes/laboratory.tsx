import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/laboratory")({
  head: () => ({ meta: [
    { title: "Зуботехническая лаборатория — Digital Dentistry Solutions" },
    { name: "description", content: "Цифровая зуботехническая лаборатория в Москве: коронки, виниры, импланты, бюгели, элайнеры." },
    { property: "og:title", content: "Зуботехническая лаборатория — DDS MARKET" },
    { property: "og:description", content: "Цифровая зуботехническая лаборатория в Москве: коронки, виниры, импланты, бюгели, элайнеры." },
    { property: "og:url", content: "https://ddsmarket.ru/laboratory" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Зуботехническая лаборатория — DDS MARKET" },
      { name: "twitter:description", content: "Цифровая зуботехническая лаборатория в Москве: коронки, виниры, импланты, бюгели, элайнеры." },
  ], links: [{ rel: "canonical", href: "https://ddsmarket.ru/laboratory" }]}),
  component: () => (
    <PageShell title="Зуботехническая лаборатория" subtitle="Полный цикл цифрового и классического зубопротезирования. Работаем по защищённым каналам с клиниками по всей России." crumbs={[{ label: "Лаборатория" }]}>
      <div className="container mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { t: "Коронки и мостовидные", d: "Цирконий multilayer, e.max, металлокерамика. От 1 дня." },
            { t: "Виниры и вкладки", d: "Эстетические работы из дисиликата лития. Подбор цвета в студии." },
            { t: "Имплантация", d: "Индивидуальные абатменты, мостовидные на имплантах, All-on-4/6." },
            { t: "Бюгельные протезы", d: "Каркасы из CoCr и титана на CAD/CAM. Скрытая аттачменная фиксация." },
            { t: "Элайнеры", d: "Печать 3D-моделей, термоформование, наборы до финального результата." },
            { t: "Хирургические шаблоны", d: "Навигационная хирургия по DICOM + STL планированию." },
          ].map((s) => (
            <div key={s.t} className="p-7 rounded-2xl border border-border bg-card">
              <h3 className="font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-2 text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl font-bold">Цифровой workflow от сканера до примерки</h2>
            <p className="mt-4 text-muted-foreground">
              Принимаем сканы из любых интраоральных систем: 3Shape, Medit, iTero, Primescan, Cerec. Моделирование в exocad и 3Shape Dental System. Контроль качества на каждом этапе.
            </p>
            <Button asChild className="mt-6"><Link to="/contacts">Стать партнёром</Link></Button>
          </div>
          <ol className="space-y-3">
            {["Получение скана / оттиска","Цифровое моделирование","Фрезерование / печать","Спекание / полимеризация","Финишная обработка","Доставка в клинику"].map((step, i) => (
              <li key={step} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground font-bold shrink-0">{i+1}</div>
                <div className="font-medium pt-1.5">{step}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </PageShell>
  ),
});
