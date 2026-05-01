import { Hono } from "hono";
import type { Bindings } from "../index";

export const whatsappRoutes = new Hono<{ Bindings: Bindings }>();

whatsappRoutes.get("/webhook", async (c) => {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");

  if (mode === "subscribe" && token === c.env.WHATSAPP_WEBHOOK_SECRET) {
    return c.text(challenge ?? "");
  }
  return c.json({ erro: "Token inválido" }, 403);
});

whatsappRoutes.post("/webhook", async (c) => {
  const data = await c.req.json();
  // Processar mensagens recebidas do WhatsApp
  return c.json({ status: "recebido" });
});
