import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { PRODUCTS, CATEGORIES, type Product } from "@/components/site/data";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

function ProductGallery({ product }: { product: Product }) {
  const raw = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : [];
  const imgs = Array.from(new Set(raw));
  const [idx, setIdx] = useState(0);
  const hasMany = imgs.length > 1;
  const prev = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx((i) => (i - 1 + imgs.length) % imgs.length); };
  const next = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIdx((i) => (i + 1) % imgs.length); };
  return (
    <div className="aspect-[4/3] bg-white relative overflow-hidden">
      {imgs.length > 0 ? (
        <img src={imgs[idx]} alt={product.name} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-300" />
      ) : (
        <div className="absolute inset-0 bg-mesh opacity-30" />
      )}
      <div className="absolute top-3 left-3 text-xs bg-card/90 backdrop-blur px-2.5 py-1 rounded-full font-medium z-10">{product.brand}</div>
      {hasMany && (
        <>
          <button type="button" onClick={prev} aria-label="Предыдущее фото" className="absolute left-2 top-1/2 -translate-y-1/2 size-8 grid place-items-center rounded-full bg-card/90 backdrop-blur border border-border shadow-sm hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={next} aria-label="Следующее фото" className="absolute right-2 top-1/2 -translate-y-1/2 size-8 grid place-items-center rounded-full bg-card/90 backdrop-blur border border-border shadow-sm hover:bg-card opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {imgs.map((_, i) => (
              <button key={i} type="button" aria-label={`Фото ${i + 1}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-1.5 bg-card/80"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export const Route = createFileRoute("/catalog/")({
  head: () => ({ meta: [
    { title: "Каталог оборудования — DDS MARKET" },
    { name: "description", content: "Каталог стоматологического оборудования: сканеры, фрезерные станки, 3D-принтеры, печи, ПО, расходные материалы." },
    { property: "og:title", content: "Каталог стоматологического оборудования — DDS MARKET" },
    { property: "og:description", content: "Сканеры, фрезерные станки, 3D-принтеры, печи, ПО и расходные материалы. Цены ниже конкурентов." },
    { property: "og:url", content: "https://ddsmarket.ru/catalog" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Каталог стоматологического оборудования — DDS MARKET" },
      { name: "twitter:description", content: "Сканеры, фрезерные станки, 3D-принтеры, печи, ПО и расходные материалы. Цены ниже конкурентов." },
  ], links: [{ rel: "canonical", href: "https://ddsmarket.ru/catalog" }]}),
  component: CatalogPage,
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) ?? "", cat: (s.cat as string) ?? "" }),
});

function CatalogPage() {
  const { q: qParam, cat: catParam } = Route.useSearch();
  const [q, setQ] = useState(qParam);
  const [cat, setCat] = useState(catParam);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (p.hidden) return false;
      const matchQ = !q || (p.name + p.short + p.brand + p.category).toLowerCase().includes(q.toLowerCase());
      const matchC = !cat || p.category === cat;
      return matchQ && matchC;
    });
  }, [q, cat]);

  return (
    <PageShell
      title="Каталог оборудования"
      subtitle="Оборудование от ведущих мировых производителей. Прямые поставки, гарантия, сервис."
      crumbs={[{ label: "Каталог" }]}
    >
      <div className="container mx-auto px-6 py-12 grid lg:grid-cols-[260px_1fr] gap-10">
        <aside className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Поиск</label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Название, бренд…" className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-card text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Категории</div>
            <div className="space-y-1">
              <button onClick={() => setCat("")} className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${cat === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Все категории</button>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${cat === c ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{c}</button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200">
            ⚠️ Цены могут изменяться в зависимости от курса валют. Актуальную стоимость уточняйте у менеджера.
          </div>
          <div className="mb-6 text-sm text-muted-foreground">Найдено: <span className="font-semibold text-foreground">{filtered.length}</span></div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <article key={p.slug} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
                <Link to="/catalog/$slug" params={{ slug: p.slug }} className="block">
                  <ProductGallery product={p} />
                </Link>
                <div className="p-5">
                  <div className="text-xs text-muted-foreground">{p.category}</div>
                  <Link to="/catalog/$slug" params={{ slug: p.slug }} className="block hover:text-primary transition-colors">
                    <h3 className="mt-1 font-semibold text-lg leading-tight">{p.name}</h3>
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.short}</p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {p.features.slice(0,3).map((f) => <li key={f}>• {f}</li>)}
                  </ul>
                  <div className="mt-4 flex items-center justify-between">
                    {/^\s*оставьте\s+заявку/i.test(p.price) ? (
                      <Link to="/contacts" className="font-display font-bold text-primary text-sm underline-offset-4 hover:underline">{p.price}</Link>
                    ) : (
                      <div className="font-display font-bold text-primary">{p.price}</div>
                    )}
                    <Button size="sm" asChild><Link to="/catalog/$slug" params={{ slug: p.slug }}>Подробнее</Link></Button>
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full p-10 text-center border border-dashed rounded-2xl text-muted-foreground">Ничего не найдено. Попробуйте изменить запрос.</div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
