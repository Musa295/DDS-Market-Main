# Что видно на скриншотах Dokploy

На вкладке **Advanced** порта нет — и его там быть не должно. Зато видно главную причину обрывов сборки:

- **Memory Limit = 1073741824 (1 GB)** — этого мало. Сборка Vite/TanStack Start на 1 ГБ падает по памяти, а Dokploy показывает деплой как **Cancelled**, а не Failed.
- **Build Server = None**, **Build Registry = None** — это нормально, сборка идёт прямо на сервере приложения, то есть с тем же лимитом 1 ГБ.
- **Run Command = /bin/sh** без аргументов — если это сохранено, оно может перебить старт из `nixpacks.toml` и контейнер поднимется «пустым» (отсюда Bad Gateway).

## Где находится Port

Порт в Dokploy задаётся не в Advanced, а в двух местах:

```text
Domains  -> ddsmarket.ru -> Container Port: 5173
Environment -> PORT=5173
```

Вкладка Advanced нужна только для ресурсов/Run Command.

# Что сделать в Dokploy (по шагам)

1. **Advanced → Resources**
   - Memory Limit: `4294967296` (4 GB) — или минимум `2147483648` (2 GB)
   - Memory Reservation: `536870912` (512 MB)
   - CPU Limit оставить как есть → **Save**
2. **Advanced → Run Command**
   - Очистить поле Command (убрать `/bin/sh`), аргументов не добавлять → **Save**
3. **Domains** — у домена `ddsmarket.ru` контейнерный порт `5173`.
4. **Environment** — `PORT=5173`.
5. **Deployments → Cancel Queues**, затем **Deploy** с галочкой **Clean Cache**.

Если у самого VPS меньше 4 ГБ RAM — лимит поднять не поможет, тогда нужен либо сервер побольше, либо сборка на стороне (вариант «Б» ниже).

# Изменения в коде (по желанию)

Опционально, чтобы сборка гарантированно влезала в память:

- В `nixpacks.toml` добавить переменную `NODE_OPTIONS = "--max-old-space-size=3072"` — Node не будет пытаться занять больше, чем даёт контейнер.

Вариант «Б» (если сервер слабый): собирать сайт в GitHub Actions и в Dokploy деплоить уже готовый `dist/client` — тогда серверу нужно всего ~256 МБ. Это отдельная настройка, скажи, если идём этим путём.

# Технические детали

Текущая конфигурация корректна и менять её не требуется:

- `nixpacks.toml`: провайдер node, `bun install --frozen-lockfile`, `bun run build:pages`, старт `node scripts/serve-static.mjs`.
- `scripts/serve-static.mjs` читает `process.env.PORT` и отдаёт `dist/client` с SPA-фолбэком, поэтому `PORT=5173` подхватывается автоматически.
- `package-lock.json` удалён, чтобы Nixpacks не переключался на npm.
