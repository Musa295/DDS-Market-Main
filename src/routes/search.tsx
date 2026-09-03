import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { PRODUCTS } from "@/components/site/data";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Поиск по каталогу — DDS MARKET" },
      { name: "description", content: "Поиск стоматологического оборудования по каталогу DDS MARKET: сканеры, фрезерные станки, 3D-принтеры, печи, расходные материалы." },
      { property: "og:title", content: "Поиск по каталогу — DDS MARKET" },
      { property: "og:description", content: "Найдите оборудование по названию, бренду или категории в каталоге DDS MARKET." },
      { property: "og:url", content: "https://ddsmarket.ru/search" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Поиск по каталогу — DDS MARKET" },
      { name: "twitter:description", content: "Найдите оборудование по названию, бренду или категории в каталоге DDS MARKET." },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ddsmarket.ru/search" }],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) ?? "" }),
  component: SearchPage,
});

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function SearchPage() {
  const { q: qParam } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [q, setQ] = useState(qParam);

  const results = useMemo(() => {
    const query = qParam.trim().toLowerCase();
    if (!query) return [];
    return PRODUCTS.filter((p) => {
      if (p.hidden) return false;
      return (p.name + " " + p.short + " " + p.brand + " " + p.category).toLowerCase().includes(query);
    });
  }, [qParam]);

  return (
    <PageShell title="Поиск по каталогу" subtitle="Введите название, бренд или категорию оборудования." crumbs={[{ label: "Поиск" }]}>
      <div className="container mx-auto px-6 py-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: { q } });
          }}
          className="flex gap-3 max-w-2xl"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Например: XTCERA, фрезерный станок, сканер…"
              aria-label="Поисковый запрос"
              className="w-full h-11 pl-10 pr-3 rounded-lg border border-border bg-card text-sm outline-none focus:border-primary"
            />
          </div>
          <Button type="submit" size="lg">Найти</Button>
        </form>

        {qParam.trim() && (
          <div className="mt-8 text-sm text-muted-foreground">
            По запросу «<span className="font-semibold text-foreground">{qParam}</span>» найдено:{" "}
            <span className="font-semibold text-foreground">{results.length}</span>
          </div>
        )}

        <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {results.map((p) => (
            <article key={p.slug} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all">
              <Link to="/catalog/$slug" params={{ slug: p.slug }} className="block">
                <div className="aspect-[4/3] bg-white relative overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 w-full h-full object-contain p-4" />
                  ) : (
                    <div className="absolute inset-0 bg-mesh opacity-30" />
                  )}
                  <div className="absolute top-3 left-3 text-xs bg-card/90 backdrop-blur px-2.5 py-1 rounded-full font-medium">{p.brand}</div>
                </div>
              </Link>
              <div className="p-5">
                <div className="text-xs text-muted-foreground"><Highlight text={p.category} query={qParam} /></div>
                <Link to="/catalog/$slug" params={{ slug: p.slug }} className="block hover:text-primary transition-colors">
                  <h2 className="mt-1 font-semibold text-lg leading-tight"><Highlight text={p.name} query={qParam} /></h2>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3"><Highlight text={p.short} query={qParam} /></p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-display font-bold text-primary">{p.price}</div>
                  <Button size="sm" asChild><Link to="/catalog/$slug" params={{ slug: p.slug }}>Подробнее</Link></Button>
                </div>
              </div>
            </article>
          ))}
          {qParam.trim() && results.length === 0 && (
            <div className="col-span-full p-10 text-center border border-dashed rounded-2xl text-muted-foreground">
              Ничего не найдено. Попробуйте изменить запрос или{" "}
              <Link to="/catalog" search={{ q: "", cat: "" }} className="text-primary underline-offset-4 hover:underline">откройте каталог</Link>.
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
