## 1. Favicon — только логотип, без надписей

Сейчас в `public/favicon.*` лежит полный логотип с текстом «DDS MARKET» — на 16–48 px это превращается в кашу, и Google показывает дефолтный «глобус».

- Сгенерирую квадратный фавикон-марку **только из символа/значка логотипа** (без текста), на белом фоне с небольшим отступом.
- Размеры: `favicon.ico` (32×32), `favicon-32.png`, `favicon-16.png`, `favicon.png` 96×96 (то, что предпочитает Google), `apple-touch-icon.png` 180×180.
- В `src/routes/__root.tsx` оставлю чистый набор без `?v=` и дубликатов:
  ```
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  ```
- Google обновит иконку в выдаче через 1–4 недели после переобхода. Ускорить можно только через Search Console → «Проверка URL → Запросить индексирование».

Уточнение: если у логотипа нет отдельного «значка без текста», я вырежу центральный графический элемент из `src/assets/logo.png`. Если хочешь — могу сгенерировать новую монограмму (например, «DDS» в круге фирменного цвета) — скажи, если этот вариант предпочтительнее.

## 2. Sitemap.xml и robots.txt

Оба файла уже существуют (`public/sitemap.xml`, `public/robots.txt`) — не буду мигрировать на server-route, только обновлю содержимое:
- **sitemap.xml**: пересоберу список URL точно по актуальным маршрутам и товарам из `data.ts` (уберу скрытые `hidden: true`, добавлю недостающие), обновлю `lastmod` на сегодня, добавлю `changefreq`.
- **robots.txt**: оставлю `Allow: /`, `Disallow: /api/`, ссылку на `sitemap.xml`, добавлю блок `User-agent: Googlebot-Image Allow: /` и уберу возможные лишние.

## 3. Open Graph / Twitter Card / canonical на всех страницах

Пройду по всем маршрутам (`about`, `contacts`, `delivery`, `laboratory`, `milling`, `promo`, `services`, `catalog.index`, `catalog.$slug`, `index`) и приведу `head()` к единому шаблону:
- `title`, `description`
- `og:title`, `og:description`, `og:type`, `og:url`, `og:locale=ru_RU`
- `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`
- `<link rel="canonical" href="https://ddsmarket.ru/...">` — только на leaf-роуте, не в `__root`.
- Для карточек товара — динамический canonical/og:url со slug'ом и JSON-LD `Product`.

`og:image` пока не ставлю (нет качественной обложки под share-preview) — можно добавить позже, если сгенерируем 1200×630.

## 4. Оптимизация изображений и скорости

- Подключу `vite-imagetools` в `vite.config.ts`. Для тяжёлых `.jpg/.png` в `src/assets/products/*` буду импортировать как `?format=webp;avif;jpg&as=picture` и рендерить через `<picture>` в карточке товара и галерее.
- Ко всем `<img>` в каталоге, карточке товара, категориях и главной добавлю явные `width`/`height` (или `aspect-ratio` через контейнер уже есть) + `loading="lazy"` (у первого экрана — `loading="eager" fetchpriority="high"`).
- Hero-видео: добавлю `poster` (лёгкий webp), уже стоит `preload="metadata"`.
- Preload LCP-изображения главной страницы через `head().links` роута `/`.
- Уберу неиспользуемые импорты, где найду.

## 5. Правки контента (data.ts)

**5.1. `xtcera-x-mill-500-se`** — заменю поле `description` (и `short` при необходимости) на новый уникальный текст, который ты прислал, с маркированным списком «Особенности».

**5.2. `xtcera-x-mill-500-plus`** — вычищу все упоминания «cadcamgo» из `description`/`short`/`features`; выставлю `price: "1 390 000 ₽"`.

**5.3. `dust-collector-srefo-r407`** — `price: "92 000 ₽"` (уточни: 92 000 ₽ или именно «92»? Предполагаю 92 000 ₽ по аналогии с R-412).

**5.4. `dust-collector-srefo-r412`** — `price: "77 000 ₽"`.

**5.5. Категория «Печи спекания и обжига керамики» → «Печи для синтеризации и обжига»**
- Переименую в массиве `CATEGORIES` и во всех товарах (`category: "..."`), а также в `CATEGORY_ICONS` на главной.

**5.6. `zetin-ztcf-30b-sic`** — заменю `description` на новый текст с блоками «Особенности» и «Ключевые преимущества», категорию — на новую.

## 6. Что попрошу сделать вручную

- В DNS/хостинге настроить 301-редирект `www.ddsmarket.ru → ddsmarket.ru` (в выдаче Google сейчас `www.` — сигналы делятся между двумя хостами).
- В Google Search Console: добавить оба свойства, отправить главную на переобход.

## Файлы, которые изменю

- `public/favicon.ico`, `public/favicon.png`, `public/favicon-16.png`, `public/favicon-32.png`, `public/apple-touch-icon.png`
- `public/sitemap.xml`, `public/robots.txt`
- `src/routes/__root.tsx` (head links)
- `src/routes/index.tsx`, `about.tsx`, `contacts.tsx`, `delivery.tsx`, `laboratory.tsx`, `milling.tsx`, `promo.tsx`, `services.tsx`, `catalog.index.tsx`, `catalog.$slug.tsx` (OG/Twitter/canonical/JSON-LD)
- `src/components/site/data.ts` (тексты, цены, категория)
- `vite.config.ts` (+ `vite-imagetools`)
- Карточка товара и галерея в `catalog.index.tsx` / `catalog.$slug.tsx` (переход на `<picture>` + width/height/lazy)

## Один вопрос перед стартом

Насчёт favicon: у тебя `logo.png` — это лого с текстом «DDS MARKET». Что вырезать в квадратную иконку?
— **A)** Центральный графический значок из существующего лого (если он есть).
— **B)** Сгенерировать новую монограмму «DDS» в фирменном цвете на белом фоне.
— **C)** Использовать просто «D» в круге.

Скажи букву — и я запускаю всё выше одним заходом.
