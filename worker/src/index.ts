import { Hono } from "hono";
import { cors } from "hono/cors";
import { caixaRoutes } from "./routes/caixa";
import { fiadoRoutes } from "./routes/fiado";
import { relatoriosRoutes } from "./routes/relatorios";
import { whatsappRoutes } from "./routes/whatsapp";
import { enviarResumoDiario } from "./cron/resumo-diario";

export type Bindings = {
  DB: D1Database;
  WHATSAPP_TOKEN: string;
  WHATSAPP_PHONE_ID: string;
  WHATSAPP_WEBHOOK_SECRET: string;
  SECRET_KEY: string;
  FRONTEND_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  const handler = cors({ origin: c.env.FRONTEND_URL });
  return handler(c, next);
});

app.route("/caixa", caixaRoutes);
app.route("/fiado", fiadoRoutes);
app.route("/relatorios", relatoriosRoutes);
app.route("/whatsapp", whatsappRoutes);

app.get("/", (c) => c.json({ status: "ok", sistema: "Aurélio" }));

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(enviarResumoDiario(env));
  },
};
