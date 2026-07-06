## Что происходит

Vercel собирает ветку `vercel/install-vercel-speed-insights-sammzv` (авто‑PR от Vercel‑бота с добавлением Speed Insights). Билд падает:

```
[vite]: Rollup failed to resolve import "@tanstack/query-core"
from ".../@tanstack/react-query/build/modern/index.js"
```

Две причины сразу:

1. На этой ветке `package.json` не содержит явной зависимости `@tanstack/query-core` (в логах установленных пакетов её нет). У нас в `main` она добавлена — ветка Vercel её не подхватила.
2. Vercel переключился с `bun` на `pnpm`, а pnpm по умолчанию не «плоско» раскладывает зависимости. Rollup при SSR‑сборке TanStack Start не находит транзитивный `@tanstack/query-core`.

Плюс проект настроен под Cloudflare Workers (`wrangler.jsonc`, `@cloudflare/vite-plugin`, `src/server.ts` как SSR‑entry). На Vercel Nitro поднимает `nodejs24.x` — это работает, но нужно закрепить конфигурацию, иначе будущие сборки снова сломаются.

## План правок (в `main`)

1. **`package.json`** — оставить `@tanstack/query-core` в `dependencies` (уже есть) и добавить `@vercel/speed-insights` (Vercel‑бот всё равно его подставит; лучше держать явно в main, чтобы не создавались параллельные ветки).

2. **`.npmrc`** (новый файл) — заставить pnpm поднимать вложенные зависимости, чтобы Rollup их видел:
   ```
   shamefully-hoist=true
   node-linker=hoisted
   ```
   Это чинит `@tanstack/query-core` и подобные транзитивные импорты без правок кода.

3. **`vercel.json`** (новый файл) — зафиксировать команды и менеджер пакетов, чтобы Vercel не переключался туда‑сюда:
   ```json
   {
     "installCommand": "pnpm install --no-frozen-lockfile",
     "buildCommand": "pnpm run build",
     "framework": null
   }
   ```

4. **Speed Insights** — подключить один раз в `src/routes/__root.tsx` (компонент `<SpeedInsights />` из `@vercel/speed-insights/react`), чтобы Vercel‑бот больше не открывал авто‑PR.

5. **Лог‑чек после мержа** — попросить пользователя в Vercel Dashboard:
   - выбрать Production Branch = `main`,
   - удалить старую ветку `vercel/install-vercel-speed-insights-sammzv` или сделать Redeploy последнего коммита `main`,
   - в Settings → Build & Development оставить пустые команды (возьмутся из `vercel.json`).

## Что НЕ меняем

- `wrangler.jsonc`, `src/server.ts`, `@cloudflare/vite-plugin` — оставляем, сайт продолжит работать и на Lovable (Cloudflare), и на Vercel параллельно.
- Никаких правок в `routeTree.gen.ts`, роутах, контент/SEO — эта задача только про деплой.

## Проверка

После пуша в `main` Vercel запустит новый билд. Ожидаем: `vite build` проходит, Nitro собирает `nodejs24.x` бандл, сайт открывается на `dds-market-*.vercel.app`. Если снова падение — прислать первые 40 строк ошибки из Build Logs.
