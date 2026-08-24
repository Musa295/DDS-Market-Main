import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cog, Printer, Layers, Wind, FlaskConical, Zap, ShieldCheck, Sparkles, ScanLine, Package, Flame } from "lucide-react";
import { PRODUCTS, CATEGORIES, SERVICES, SITE } from "@/components/site/data";
const heroVideo = { url: "/hero-video.mp4" };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DDS MARKET — Цифровое стоматологическое оборудование | CAD/CAM, интраоральные сканеры, фрезерные станки" },
      { name: "description", content: "DDS MARKET — поставщик цифрового стоматологического оборудования. Интраоральные сканеры, CAD/CAM системы, фрезерные станки, печи синтеризации, 3D-принтеры, обучение и сервис по всей России." },
      { property: "og:title", content: "DDS MARKET — Цифровое стоматологическое оборудование | CAD/CAM, интраоральные сканеры, фрезерные станки" },
      { property: "og:description", content: "DDS MARKET — поставщик цифрового стоматологического оборудования. Интраоральные сканеры, CAD/CAM системы, фрезерные станки, печи синтеризации, 3D-принтеры, обучение и сервис по всей России." },
      { property: "og:url", content: "https://www.ddsmarket.ru/" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ru_RU" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DDS MARKET — Цифровое стоматологическое оборудование" },
      { name: "twitter:description", content: "Интраоральные сканеры, CAD/CAM системы, фрезерные станки, печи синтеризации, 3D-принтеры, обучение и сервис по всей России." },
    ],
    links: [{ rel: "canonical", href: "https://www.ddsmarket.ru/" }],
  }),
  component: Index,
});

const CATEGORY_ICONS: Record<string, typeof Cog> = {
  "Фрезерные станки": Cog,
  "3D-принтеры по металлу (SLM)": Layers,
  "3D-принтеры": Printer,
  "3D-сканеры": ScanLine,
  "Вытяжки для станков": Wind,
  "Печи для синтеризации и обжига": Flame,
  "Фотополимерные смолы": FlaskConical,
  "Аппараты для анодирования": Zap,
  "Расходные материалы": Package,
};

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO with video */}
      <section className="relative overflow-hidden bg-[#0b1220] dark:bg-[#0a1118]">
        <video
          src={heroVideo.url}
          aria-label="DDS Market — цифровое стоматологическое оборудование"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover opacity-90 dark:opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1220]/60 via-[#0b1220]/35 to-primary/25 dark:from-[#06090f]/55 dark:via-[#06090f]/25 dark:to-transparent" />
        <div className="absolute inset-0 bg-mesh opacity-10 mix-blend-overlay" />
        <div className="container relative mx-auto px-6 py-16 md:py-20 max-w-4xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-background/20 bg-background/10 backdrop-blur text-background text-xs font-medium">
            <Sparkles className="size-3.5" /> Цифровая стоматология · Москва
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-6xl font-bold leading-[1.05] text-balance">
            Оборудование для современной <span className="text-accent">стоматологии</span> и зуботехнических лабораторий
          </h1>
          <p className="mt-6 text-lg text-white/90 max-w-2xl">
            Сканеры, фрезерные станки, 3D-принтеры, печи и ПО от ведущих мировых производителей. Полный цикл — от подбора до сервиса.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/catalog" search={{ q: "", cat: "" }}>Перейти в каталог <ArrowRight className="size-4" /></Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/40 text-white hover:bg-white hover:text-foreground"><Link to="/contacts">Получить консультацию</Link></Button>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-white/70 text-xs">
          <ShieldCheck className="size-3.5" /> ISO 13485 · Гарантия до 3 лет
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="text-sm font-medium text-primary uppercase tracking-wider">Каталог</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Категории оборудования</h2>
          </div>
          <Link to="/catalog" search={{ q: "", cat: "" }} className="text-primary font-medium hover:underline inline-flex items-center gap-1">Весь каталог <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] ?? Cog;
            return (
              <Link key={cat} to="/catalog" search={{ q: "", cat }} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all">
                <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/20 text-primary mb-4 group-hover:scale-110 transition">
                  <Icon className="size-6" />
                </div>
                <div className="font-semibold text-lg">{cat}</div>
                <div className="mt-3 text-sm text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">Смотреть <ArrowRight className="size-3" /></div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-surface py-20 border-y border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold">Популярное оборудование</h2>
            <Link to="/catalog" search={{ q: "", cat: "" }} className="text-primary font-medium hover:underline">Все товары →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.filter((p) => !p.hidden).slice(0, 6).map((p) => (
              <article key={p.slug} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                <Link to="/catalog/$slug" params={{ slug: p.slug }} className="block aspect-[4/3] bg-white relative overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 bg-mesh opacity-30" />
                  )}
                  <div className="absolute top-3 left-3 text-xs bg-card/90 backdrop-blur px-2.5 py-1 rounded-full font-medium z-10">{p.brand}</div>
                  <div className="absolute bottom-3 right-3 text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-medium z-10">{p.category}</div>
                </Link>
                <div className="p-5">
                  <Link to="/catalog/$slug" params={{ slug: p.slug }} className="block hover:text-primary transition-colors">
                    <h3 className="font-semibold text-lg leading-tight">{p.name}</h3>
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.short}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="font-display text-lg font-bold text-primary">{p.price}</div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to="/catalog/$slug" params={{ slug: p.slug }}>Узнать <ArrowRight className="size-3" /></Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-medium text-primary uppercase tracking-wider">Услуги</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-2">Полный цикл сопровождения</h2>
          <p className="mt-4 text-muted-foreground">От подбора и поставки до монтажа, обучения персонала и сервисного сопровождения.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <div key={s.title} className="p-6 rounded-2xl border border-border bg-card">
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MILLING + LAB blocks */}
      <section className="container mx-auto px-6 pb-20 grid md:grid-cols-2 gap-6">
        {[
          { to: "/milling", title: "Фрезерный центр", desc: "Изготовление каркасов и реставраций на 5-осевом оборудовании.", grad: "from-primary to-accent" },
          { to: "/laboratory", title: "Зуботехническая лаборатория", desc: "Полный цикл цифрового и классического протезирования.", grad: "from-accent to-primary" },
        ].map((b) => (
          <Link key={b.to} to={b.to} className={`group relative overflow-hidden rounded-3xl p-10 md:p-14 bg-gradient-to-br ${b.grad} text-primary-foreground min-h-[260px] flex flex-col justify-end`}>
            <div className="absolute inset-0 bg-mesh opacity-20" />
            <h3 className="relative font-display text-3xl md:text-4xl font-bold">{b.title}</h3>
            <p className="relative mt-3 opacity-90 max-w-md">{b.desc}</p>
            <div className="relative mt-6 inline-flex items-center gap-2 font-medium">Подробнее <ArrowRight className="size-4 group-hover:translate-x-1 transition" /></div>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-primary text-primary-foreground p-10 md:p-14 grid md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold">Нужна консультация инженера?</h2>
            <p className="mt-2 opacity-80">Подберём комплект под задачи вашей клиники или лаборатории.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="lg"><a href={SITE.phoneHref}>{SITE.phone}</a></Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contacts">Написать нам</Link></Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
