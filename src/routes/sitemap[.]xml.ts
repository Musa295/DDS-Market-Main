import { createFileRoute } from "@tanstack/react-router";
import { PRODUCTS } from "@/components/site/data";

const ORIGIN = "https://ddsmarket.ru";

const STATIC_PAGES: { path: string; priority: string }[] = [
  { path: "/", priority: "1.0" },
  { path: "/catalog", priority: "0.9" },
  { path: "/services", priority: "0.8" },
  { path: "/milling", priority: "0.8" },
  { path: "/laboratory", priority: "0.8" },
  { path: "/delivery", priority: "0.6" },
  { path: "/about", priority: "0.6" },
  { path: "/contacts", priority: "0.7" },
  { path: "/promo", priority: "0.5" },
];

function buildSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = [
    ...STATIC_PAGES.map((p) => ({ loc: ORIGIN + p.path, priority: p.priority })),
    ...PRODUCTS.filter((p) => !p.hidden).map((p) => ({
      loc: `${ORIGIN}/catalog/${p.slug}`,
      priority: "0.7",
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><lastmod>${lastmod}</lastmod><priority>${u.priority}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        }),
    },
  },
});
