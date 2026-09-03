// Отправка заявок, не привязанная к хостингу.
// Каналы пробуются по порядку: свой серверный эндпоинт → внешний эндпоинт
// (VITE_LEAD_ENDPOINT) → напрямую Telegram (VITE_TG_BOT_TOKEN/VITE_TG_CHAT_ID).

export type Lead = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
};

export function buildLeadText(lead: Lead) {
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

const env = import.meta.env as Record<string, string | undefined>;

async function postJson(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  // Статический хостинг отдаёт HTML (SPA-фолбэк) со статусом 200 —
  // это НЕ успех, поэтому проверяем тип и тело ответа.
  const type = res.headers.get("content-type") || "";
  if (!res.ok || !type.includes("application/json")) return false;
  try {
    const data = (await res.json()) as { ok?: boolean };
    return data?.ok === true;
  } catch {
    return false;
  }
}

/** Пытается доставить заявку. Возвращает true только при подтверждённой доставке. */
export async function submitLead(lead: Lead): Promise<boolean> {
  const endpoints = ["/api/public/lead"];
  const external = env["VITE_LEAD_ENDPOINT"];
  if (external) endpoints.push(external);

  for (const url of endpoints) {
    try {
      if (await postJson(url, lead)) return true;
    } catch {
      /* пробуем следующий канал */
    }
  }

  const token = env["VITE_TG_BOT_TOKEN"];
  const chatId = env["VITE_TG_CHAT_ID"];
  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: buildLeadText(lead) }),
      });
      if (res.ok) return true;
    } catch {
      /* ignore */
    }
  }

  return false;
}
