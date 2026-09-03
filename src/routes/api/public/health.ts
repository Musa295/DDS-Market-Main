import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/health")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          JSON.stringify({ status: "ok", service: "dds-market", time: new Date().toISOString() }),
          { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } },
        ),
      HEAD: () => new Response(null, { status: 200 }),
    },
  },
});
