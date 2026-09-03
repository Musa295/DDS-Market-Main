import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { SITE } from "@/components/site/data";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, Zap } from "lucide-react";

const TG_TOKEN = "8604500241:AAGp-nHeaFuf84cCA2bHrfhabulDFkVbBgg";
const TG_CHAT_ID = "8947129651";

export const Route = createFileRoute("/contacts")({
  head: () => ({ meta: [
    { title: "Контакты — DDS MARKET" },
    { name: "description", content: "Адрес офиса в Москве, телефон, email, Telegram, WhatsApp, MAX." },
    { property: "og:title", content: "Контакты — DDS MARKET" },
    { property: "og:description", content: "Адрес офиса в Москве, телефон, email, Telegram, WhatsApp, MAX." },
    { property: "og:url", content: "https://ddsmarket.ru/contacts" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Контакты — DDS MARKET" },
      { name: "twitter:description", content: "Адрес офиса в Москве, телефон, email, Telegram, WhatsApp, MAX." },
  ], links: [{ rel: "canonical", href: "https://ddsmarket.ru/contacts" }]}),
  component: ContactsPage,
});

function genCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  return { a, b, answer: a + b };
}

function ContactsPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err" | "captcha">("idle");
  const [captcha, setCaptcha] = useState(genCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [startTime] = useState(() => Date.now());
  return (
    <PageShell title="Контакты" subtitle="Свяжитесь с нами удобным способом — ответим в течение 30 минут в рабочее время." crumbs={[{ label: "Контакты" }]}>
      <div className="container mx-auto px-6 py-14 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          {[
            { i: Phone, l: "Телефон", v: SITE.phone, href: SITE.phoneHref },
            { i: Mail, l: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
            { i: MapPin, l: "Адрес", v: SITE.address },
            { i: Send, l: "Telegram", v: "@ddsmarketru", href: SITE.telegram },
            { i: MessageCircle, l: "WhatsApp", v: SITE.phone, href: SITE.whatsapp },
            { i: Zap, l: "MAX", v: SITE.phone, href: SITE.max },
            { i: Clock, l: "Часы работы", v: "Пн–Пт 9:00–19:00, Сб 10:00–16:00" },
          ].map((c) => (
            <div key={c.l} className="p-5 rounded-2xl border border-border bg-card flex items-start gap-4">
              <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><c.i className="size-5" /></div>
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{c.l}</div>
                {c.href ? <a href={c.href} className="font-semibold hover:text-primary">{c.v}</a> : <div className="font-semibold">{c.v}</div>}
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            // honeypot
            if (String(fd.get("website") || "")) return;
            // time trap - bots submit too fast
            if (Date.now() - startTime < 2000) { setStatus("captcha"); return; }
            // captcha check
            if (Number(captchaInput) !== captcha.answer) {
              setStatus("captcha");
              setCaptcha(genCaptcha());
              setCaptchaInput("");
              return;
            }
            const name = String(fd.get("name") || "");
            const phone = String(fd.get("phone") || "");
            const email = String(fd.get("email") || "");
            const message = String(fd.get("message") || "");
            const text = `🦷 Новая заявка с сайта DDS MARKET\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n✉️ Email: ${email || "—"}\n💬 Сообщение: ${message || "—"}`;
            setStatus("sending");
            setWaText(text);
            // 1) серверный обработчик (работает на любом хостинге: Dokploy, VPS, Lovable)
            let sent = false;
            try {
              const res = await fetch("/api/public/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, email, message, source: "Форма на странице «Контакты»" }),
              });
              sent = res.ok;
            } catch {
              sent = false;
            }
            // 2) резервная отправка напрямую в Telegram (если сервер недоступен, напр. статический хостинг)
            if (!sent) {
              try {
                const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ chat_id: TG_CHAT_ID, text }),
                });
                sent = res.ok;
              } catch {
                sent = false;
              }
            }
            if (sent) {
              setStatus("ok");
              form.reset();
              setCaptcha(genCaptcha());
              setCaptchaInput("");
            } else {
              setStatus("err");
            }
          }}
          className="p-8 rounded-3xl border border-border bg-card space-y-4 h-fit"
        >
          <h2 className="font-display text-2xl font-bold">Оставить заявку</h2>
          <input name="name" required placeholder="Ваше имя" className="w-full h-11 px-4 rounded-lg border border-border bg-background outline-none focus:border-primary" />
          <input name="phone" required type="tel" placeholder="Телефон" className="w-full h-11 px-4 rounded-lg border border-border bg-background outline-none focus:border-primary" />
          <input name="email" type="email" placeholder="Email" className="w-full h-11 px-4 rounded-lg border border-border bg-background outline-none focus:border-primary" />
          <textarea name="message" rows={4} placeholder="Сообщение" className="w-full p-4 rounded-lg border border-border bg-background outline-none focus:border-primary" />
          {/* honeypot */}
          <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
          <div className="flex items-center gap-3">
            <div className="flex-1 px-4 h-11 rounded-lg bg-muted flex items-center font-mono text-sm select-none">
              Проверка: <span className="ml-2 font-bold">{captcha.a} + {captcha.b} = ?</span>
            </div>
            <input
              required
              type="number"
              inputMode="numeric"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              placeholder="Ответ"
              className="w-24 h-11 px-3 rounded-lg border border-border bg-background outline-none focus:border-primary text-center"
              aria-label="Ответ на проверку"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={status === "sending"}>
            {status === "sending" ? "Отправка…" : "Отправить"}
          </Button>
          {status === "ok" && <p className="text-sm text-green-600 text-center">✓ Заявка отправлена! Мы свяжемся с вами в ближайшее время.</p>}
          {status === "captcha" && <p className="text-sm text-destructive text-center">Неверный ответ на проверку. Попробуйте ещё раз.</p>}
          {status === "err" && <p className="text-sm text-destructive text-center">Не удалось отправить. Позвоните нам: {SITE.phone}</p>}
          <p className="text-xs text-muted-foreground text-center">Нажимая на кнопку, вы соглашаетесь с обработкой персональных данных.</p>
        </form>
      </div>
    </PageShell>
  );
}
