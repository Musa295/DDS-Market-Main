// Минимальный статический сервер для dist/client с SPA-фолбэком.
// Используется как start-команда в Nixpacks (запасной вариант к Dockerfile).
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = join(process.cwd(), "dist", "client");
const port = Number(process.env.PORT || 5173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const candidates = [
    join(root, clean),
    join(root, clean, "index.html"),
    join(root, `${clean}.html`),
  ];
  for (const c of candidates) {
    if (c.startsWith(root) && existsSync(c) && statSync(c).isFile()) return c;
  }
  return join(root, "index.html");
}

createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  const ext = extname(file);
  const isAsset = /^\/(assets|fonts)\//.test(req.url || "");
  res.writeHead(existsSync(file) ? 200 : 404, {
    "Content-Type": MIME[ext] || "application/octet-stream",
    "Cache-Control": isAsset ? "public, max-age=31536000, immutable" : "no-cache",
  });
  createReadStream(file).pipe(res);
}).listen(port, "0.0.0.0", () => {
  console.log(`[serve] dist/client на http://0.0.0.0:${port}`);
});
