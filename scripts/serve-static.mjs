// Минимальный статический сервер для dist/client с SPA-фолбэком.
// Используется как start-команда в Nixpacks (запасной вариант к Dockerfile).
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { handleLead, LEAD_CORS_HEADERS } from "./lead-handler.mjs";

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

function json(res, status, body, extra = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extra,
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const path = (req.url || "/").split("?")[0];

  // Обработка заявок работает и на статической раздаче (любой хост).
  if (path === "/api/public/lead") {
    if (req.method === "OPTIONS") {
      res.writeHead(204, LEAD_CORS_HEADERS);
      res.end();
      return;
    }
    if (req.method !== "POST") {
      json(res, 405, { ok: false, error: "method not allowed" }, LEAD_CORS_HEADERS);
      return;
    }
    const raw = await readJson(req);
    if (raw === null) {
      json(res, 400, { ok: false, error: "invalid json" }, LEAD_CORS_HEADERS);
      return;
    }
    const { status, body } = await handleLead(raw);
    json(res, status, body, LEAD_CORS_HEADERS);
    return;
  }
  if (path === "/health" || path === "/healthz") {
    const body = JSON.stringify({ status: "ok", service: "dds-market", time: new Date().toISOString() });
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(body);
    return;
  }
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
