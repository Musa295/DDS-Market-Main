import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Truck, Package, ShieldCheck, Wallet, Building2, CreditCard } from "lucide-react";
import { SITE } from "@/components/site/data";

export const Route = createFileRoute("/delivery")({
  head: () => ({ meta: [
    { title: "Доставка и оплата — DDS MARKET" },
    { name: "description", content: "Самовывоз и доставка транспортными компаниями: MagicTrans, ПЭК, Деловые линии, СДЭК. Оплата наличными в офисе, переводом, лизинг через партнёров." },
    { property: "og:title", content: "Доставка и оплата — DDS MARKET" },
    { property: "og:description", content: "Самовывоз со склада в Москве и доставка по всей России. Оплата наличными, переводом, лизинг." },
    { property: "og:url", content: "https://ddsmarket.ru/delivery" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Доставка и оплата — DDS MARKET" },
      { name: "twitter:description", content: "Самовывоз со склада в Москве и доставка по всей России. Оплата наличными, переводом, лизинг." },
  ], links: [{ rel: "canonical", href: "https://ddsmarket.ru/delivery" }]}),
  component: () => (
    <PageShell title="Доставка и оплата" subtitle="Самовывоз со склада в Москве или доставка транспортными компаниями по всей России." crumbs={[{ label: "Доставка" }]}>
      <div className="container mx-auto px-6 py-14">
        <h2 className="font-display text-2xl font-bold mb-6">Способы получения</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <Building2 className="size-6 text-primary" />
            <div className="mt-4 font-semibold text-lg">Самовывоз со склада</div>
            <p className="mt-2 text-sm text-muted-foreground">{SITE.address}. Режим работы: {SITE.hours}.</p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card">
            <Truck className="size-6 text-primary" />
            <div className="mt-4 font-semibold text-lg">Транспортные компании</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-start gap-2"><Package className="size-4 text-accent shrink-0 mt-0.5" /><span><b>MagicTrans</b> — сроки 1–7 дней</span></li>
              <li className="flex items-start gap-2"><Package className="size-4 text-accent shrink-0 mt-0.5" /><span><b>ПЭК</b> — сроки 1–7 дней</span></li>
              <li className="flex items-start gap-2"><Package className="size-4 text-accent shrink-0 mt-0.5" /><span><b>Деловые линии</b> — сроки 1–7 дней</span></li>
              <li className="flex items-start gap-2"><Package className="size-4 text-accent shrink-0 mt-0.5" /><span><b>СДЭК</b> — сроки 1–7 дней</span></li>
            </ul>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold mt-14 mb-6">Способы оплаты</h2>
        <div className="grid md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <Wallet className="size-6 text-primary" />
            <div className="mt-4 font-semibold text-lg">Наличными в офисе</div>
            <p className="mt-2 text-sm text-muted-foreground">Оплата при получении заказа в нашем офисе в Москве.</p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card">
            <CreditCard className="size-6 text-primary" />
            <div className="mt-4 font-semibold text-lg">Переводом</div>
            <p className="mt-2 text-sm text-muted-foreground">Безналичный перевод по реквизитам для физических и юридических лиц.</p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card">
            <ShieldCheck className="size-6 text-primary" />
            <div className="mt-4 font-semibold text-lg">Лизинг через партнёров</div>
            <p className="mt-2 text-sm text-muted-foreground">Оформление лизинга на оборудование через наших партнёрских лизинговых компаний.</p>
          </div>
        </div>

        <div className="mt-14 p-8 md:p-12 rounded-3xl bg-surface border border-border">
          <h2 className="font-display text-3xl font-bold">Монтаж и пусконаладка</h2>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            Инженеры производителей выполнят установку, калибровку и первичное обучение персонала. Гарантия на работы — 12 месяцев.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-4 text-sm">
            {[
              "Подключение к инженерным сетям клиники",
              "Калибровка и тестовые работы",
              "Передача документации",
              "Обучение врача и ассистента",
              "Настройка интеграций с CAD/CAM ПО",
              "Подключение к удалённой поддержке",
            ].map((s) => <div key={s} className="flex gap-2"><span className="text-accent">✓</span> {s}</div>)}
          </div>
        </div>
      </div>
    </PageShell>
  ),
});
