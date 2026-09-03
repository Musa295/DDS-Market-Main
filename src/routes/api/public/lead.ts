import { createFileRoute } from "@tanstack/react-router";

// Обработка заявок на любом хостинге: Dokploy, VPS, Lovable.
// Токены берутся из переменных окружения, если они заданы на сервере.
const FALLBACK_TG_TOKEN = "8604500241:AAGp-nHeaFuf84cCA2bHrfhabulDFkVbBgg";
const FALLBACK_TG_CHAT_ID = "8947129651";
const LEAD_EMAIL = "ddsmarket@mail.ru";

type Lead = { name?: string; phone?: string; email?: string; message?: string; source?: string };

function clean(v: unknown, max = 500) {
  return String(v ?? "").trim().slice(0, max);
}

function buildText(lead: Lead) {
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

async function sendTelegram(text: string) {
  const token = process.env["TELEGRAM_BOT_TOKEN"] || FALLBACK_TG_TOKEN;
  const chatId = process.env["TELEGRAM_CHAT_ID"] || FALLBACK_TG_CHAT_ID;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) throw new Error(`telegram ${res.status}: ${await res.text()}`);
}

async function sendEmailCopy(text: string) {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["LEAD_EMAIL_FROM"];
  const to = process.env["LEAD_EMAIL_TO"] || LEAD_EMAIL;
  if (!apiKey || !from) return "skipped";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to, subject: "Новая заявка с сайта DDS MARKET", text }),
  });
  return res.ok ? "sent" : `error ${res.status}`;
}

export const Route = createFileRoute("/api/public/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
        }
        const body = (raw ?? {}) as Record<string, unknown>;
        if (clean(body.website)) return Response.json({ ok: true });

        const lead: Lead = {
          name: clean(body.name, 100),
          phone: clean(body.phone, 40),
          email: clean(body.email, 120),
          message: clean(body.message, 2000),
          source: clean(body.source, 120),
        };
        if (!lead.name || !lead.phone) {
          return Response.json({ ok: false, error: "name and phone are required" }, { status: 400 });
        }

        const text = buildText(lead);
        try {
          await sendTelegram(text);
        } catch (e) {
          console.error("lead telegram failed", e);
          return Response.json({ ok: false, error: "telegram failed" }, { status: 502 });
        }
        const email = await sendEmailCopy(text).catch(() => "error");
        return Response.json({ ok: true, email });
      },
    },
  },
});
