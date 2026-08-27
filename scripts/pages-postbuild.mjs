// Пост-обработка статической сборки для GitHub Pages.
// 1) 404.html — фолбэк для неизвестных путей (GitHub Pages отдаёт его вместо сервера).
// 2) CNAME — если задан PAGES_CNAME (свой домен).
// 3) .nojekyll — чтобы GitHub Pages не игнорировал файлы, начинающиеся с "_".
import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "dist", "client");

if (!existsSync(join(out, "index.html"))) {
  console.error("[pages] dist/client/index.html не найден — сборка не завершилась корректно");
  process.exit(1);
}

copyFileSync(join(out, "index.html"), join(out, "404.html"));
writeFileSync(join(out, ".nojekyll"), "");

const cname = process.env.PAGES_CNAME?.trim();
if (cname) {
  writeFileSync(join(out, "CNAME"), `${cname}\n`);
  console.log(`[pages] CNAME: ${cname}`);
}

console.log("[pages] статическая сборка готова: dist/client");
