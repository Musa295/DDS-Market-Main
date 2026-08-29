# Деплой на Dokploy через Nixpacks

Да, Nixpacks можно оставить — Dockerfile не обязателен. Нужно только убрать то, из-за чего Nixpacks выбирает npm вместо Bun.

## Что подтверждено в проекте

- В корне лежат **два** lockfile: `bun.lock` и `package-lock.json`. Nixpacks по умолчанию видит `package-lock.json` и уходит на `npm ci` — именно это было в твоём логе, хотя в `nixpacks.toml` прописан Bun.
- `nixpacks.toml` уже настроен правильно: setup `nodejs_20` + `bun`, install `bun install --frozen-lockfile`, build `bun run build:pages`, start `node scripts/serve-static.mjs`.
- `scripts/serve-static.mjs` слушает `process.env.PORT` (fallback 5173), раздаёт `dist/client` с SPA-фолбэком, правильными MIME (webp, mp4, woff2) и кэшем для `/assets/`, `/fonts/`.
- GitHub Actions (`deploy-pages.yml`) использует `bun install --frozen-lockfile` — то есть `package-lock.json` там не нужен.

## План изменений

1. Удалить `package-lock.json` из репозитория, чтобы Nixpacks однозначно выбирал Bun (никакой сборочный процесс проекта его не использует).
2. Явно закрепить провайдер в `nixpacks.toml`: `providers = ["node"]` и переменные `NIXPACKS_NO_CACHE`-независимые настройки не нужны, но добавлю `[variables] NODE_ENV = "production"` и явный `PORT` fallback не трогаю — порт приходит из Dokploy.
3. Оставить `Dockerfile`, `nginx.conf` и `.dockerignore` в репозитории как запасной вариант — они не мешают Nixpacks.
4. Проверить локально: `bun install --frozen-lockfile`, `bun run build:pages`, запуск `PORT=5173 node scripts/serve-static.mjs` и проверка `/`, `/catalog`, карточки товара, `robots.txt`, `sitemap.xml`, картинок и видео.

## Настройки в Dokploy (после синхронизации)

- Build Type: **Nixpacks**
- Publish Directory: **оставить пустым** (иначе Dokploy подменит запуск на свой NGINX)
- Install / Build / Start command overrides: **пустые** (используется `nixpacks.toml`)
- Environment: `PORT=5173` (уже стоит)
- Domain `ddsmarket.ru`: Port **5173**, HTTPS, letsencrypt — уже верно
- Deployments → **Cancel Queues**, затем **Deploy** с включённым **Clean Cache**

## Важное ограничение

Статусы «Cancelled» в твоём списке деплоев — это не ошибка кода. Такое даёт либо ручная отмена, либо нехватка ресурсов билдера: Dokploy сам предупреждает про 4+ ГБ RAM и 2+ CPU. Если после этих правок сборка снова оборвётся на этапе `bun run build:pages`, причина в памяти сервера, и тогда вариант — собирать образ вне сервера (Dockerfile + registry) или увеличить VPS.
