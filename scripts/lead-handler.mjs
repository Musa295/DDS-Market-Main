// Единая логика обработки заявок. Используется статическим сервером
// (scripts/serve-static.mjs) и может быть переиспользована в любом Node-хосте
// или воркере на другом хостинге. Все настройки — только из переменных окружения.

const LEAD_EMAIL_DEFAULT = "ddsmarket@mail.ru";

function clean(v, max = 500) {
  return String(v ?? "").trim().slice(0, max);
}

export function buildLeadText(lead) {
  return [
    "🦷 Новая заявка с сайта DDS MARKET",
    "",
    `👤 Имя: ${lead.name || "—"}`,
    `📞 Телефон: ${lead.phone || "—"}`,
    `✉️ Email: ${lead.email || "—"}`,
    `💬 Сообщение: ${lead.message || "—"}`,
    `🔗 Источник: ${lead.source || "сайт"}`,
  ].join("\n");
}

async function sendTelegram(text, env) {
  const token = env["TELEGRAM_BOT_TOKEN"];
  const chatId = env["TELEGRAM_CHAT_ID"];
  if (!token || !chatId) {
    return { ok: false, error: "telegram not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)" };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) return { ok: false, error: `telegram ${res.status}: ${(await res.text()).slice(0, 300)}` };
  return { ok: true };
}

async function sendEmailCopy(text, env) {
  const apiKey = env["RESEND_API_KEY"];
  const from = env["LEAD_EMAIL_FROM"];
  const to = env["LEAD_EMAIL_TO"] || LEAD_EMAIL_DEFAULT;
  if (!apiKey || !from) return "skipped";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ from, to, subject: "Новая заявка с сайта DDS MARKET", text }),
    });
    return res.ok ? "sent" : `error ${res.status}`;
  } catch {
    return "error";
  }
}

/**
 * Обрабатывает заявку. Возвращает { status, body } для любого HTTP-сервера.
 * @param {unknown} raw разобранное JSON-тело запроса
 * @param {Record<string,string|undefined>} env переменные окружения
 */
export async function handleLead(raw, env = process.env) {
  const body = (raw ?? {});
  if (typeof body !== "object") return { status: 400, body: { ok: false, error: "invalid body" } };
  // honeypot — тихо принимаем и ничего не отправляем
  if (clean(body.website)) return { status: 200, body: { ok: true, spam: true } };

  const lead = {
    name: clean(body.name, 100),
    phone: clean(body.phone, 40),
    email: clean(body.email, 120),
    message: clean(body.message, 2000),
    source: clean(body.source, 200),
  };
  if (!lead.name || !lead.phone) {
    return { status: 400, body: { ok: false, error: "name and phone are required" } };
  }

  const text = buildLeadText(lead);
  const tg = await sendTelegram(text, env).catch((e) => ({ ok: false, error: String(e) }));
  const email = await sendEmailCopy(text, env);

  if (!tg.ok && email !== "sent") {
    console.error("[lead] delivery failed:", tg.error, "email:", email);
    return { status: 502, body: { ok: false, error: tg.error || "delivery failed", email } };
  }
  return { status: 200, body: { ok: true, telegram: tg.ok, email } };
}

export const LEAD_CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
};
