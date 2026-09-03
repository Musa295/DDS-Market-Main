# Заявки с сайта: настройка на любом хостинге

Формы заявок («Контакты» и быстрая заявка в карточке товара) отправляют данные
в один и тот же Telegram-бот и, при желании, копию на email. Ничего не зашито в
код — всё определяется переменными окружения, поэтому настройка одинаково
работает в Dokploy, на VPS, в Docker или на чисто статическом хостинге.

## 1. Серверные переменные окружения

Задайте их на том хосте, где выполняется Node-процесс (`node scripts/serve-static.mjs`
или серверная сборка):

| Переменная | Обязательна | Назначение |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | да | токен бота из @BotFather |
| `TELEGRAM_CHAT_ID` | да | ID чата/группы, куда приходят заявки |
| `RESEND_API_KEY` | нет | ключ Resend для email-копии |
| `LEAD_EMAIL_FROM` | нет | адрес отправителя (подтверждённый домен в Resend) |
| `LEAD_EMAIL_TO` | нет | получатель, по умолчанию `ddsmarket@mail.ru` |
| `PORT` | нет | порт статического сервера, по умолчанию `5173` |

Как узнать `TELEGRAM_CHAT_ID`: напишите боту сообщение и откройте
`https://api.telegram.org/bot<TOKEN>/getUpdates` — нужное значение в `result[].message.chat.id`.

## 2. Проверка после деплоя

```bash
curl -sS -X POST https://<ваш-домен>/api/public/lead \
  -H 'content-type: application/json' \
  -d '{"name":"Тест","phone":"+7 999 000-00-00","message":"проверка","source":"curl"}'
```

Ожидаемый ответ: `{"ok":true,"telegram":true,"email":"skipped"}` и сообщение в боте.
Если пришёл HTML вместо JSON — запрос обслуживает статический сервер без обработчика
(см. пункт 3). Если `502` — не заданы `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`.

## 3. Перенос на другой хост

### Вариант A. Node-хост (Dokploy, VPS, Railway, Render)

Собирайте `bun run build:pages` и запускайте `node scripts/serve-static.mjs`.
Этот сервер сам обслуживает `POST /api/public/lead` (логика в `scripts/lead-handler.mjs`),
поэтому достаточно задать переменные из пункта 1.

### Вариант B. Чисто статический хостинг (GitHub Pages, S3, Netlify без функций)

Статика не умеет обрабатывать POST. Поднимите эндпоинт отдельно (например,
маленький Node-сервис или Cloudflare Worker) и укажите его адрес при сборке:

```bash
VITE_LEAD_ENDPOINT="https://leads.example.com/lead" bun run build:pages
```

Минимальный Node-сервис на том же коде:

```js
import { createServer } from "node:http";
import { handleLead, LEAD_CORS_HEADERS } from "./scripts/lead-handler.mjs";

createServer(async (req, res) => {
  if (req.method === "OPTIONS") return res.writeHead(204, LEAD_CORS_HEADERS).end();
  if (req.method !== "POST") return res.writeHead(405).end();
  const chunks = [];
  for await (const c of req) chunks.push(c);
  let raw = {};
  try { raw = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch {}
  const { status, body } = await handleLead(raw);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", ...LEAD_CORS_HEADERS });
  res.end(JSON.stringify(body));
}).listen(process.env.PORT || 8787);
```

Cloudflare Worker: тот же `handleLead(raw, env)` — переменные передаются из `env`.

### Вариант C. Аварийный режим без сервера

Можно отправлять напрямую из браузера, задав при сборке:

```bash
VITE_TG_BOT_TOKEN="..." VITE_TG_CHAT_ID="..." bun run build:pages
```

Внимание: эти значения попадают в публичный JS-бандл и токен становится
общедоступным. Используйте только как временное решение и с отдельным ботом.

### Вариант D. Docker + nginx

`nginx.conf` проксирует `/api/` на Node-процесс `127.0.0.1:8787`. Запустите рядом
сервис из варианта B с теми же переменными окружения, либо используйте
`node scripts/serve-static.mjs` вместо nginx.

## 4. Безопасность

- Токен бота, ранее зашитый в код сайта, скомпрометирован — перевыпустите его
  в @BotFather (`/revoke`) и задайте новый только в переменных окружения.
- Форма защищена honeypot-полем, задержкой отправки и арифметической капчей.
