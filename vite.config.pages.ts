// Статическая сборка для GitHub Pages: без серверного рантайма,
// все страницы пререндерятся в HTML + SPA-фолбэк для клиентской навигации.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
      failOnError: false,
    },
    pages: [
      { path: "/", prerender: { enabled: true } },
      { path: "/sitemap.xml", prerender: { enabled: true } },
    ],
  },
  vite: {
    // Подкаталог для <user>.github.io/<repo>: PAGES_BASE=/<repo>/
    base: process.env.PAGES_BASE || "/",
    build: { chunkSizeWarningLimit: 2000 },
  },
});
