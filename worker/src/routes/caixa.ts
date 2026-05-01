import { Hono } from "hono";
import { createDb, lancamentos } from "../db";
import { eq, and, gte, lte, sum } from "drizzle-orm";
import type { Bindings } from "../index";
import { randomUUID } from "crypto";

export const caixaRoutes = new Hono<{ Bindings: Bindings }>();

caixaRoutes.get("/", async (c) => {
  const db = createDb(c.env.DB);
  const comercioId = c.req.query("comercio_id") ?? "";
  const itens = await db
    .select()
    .from(lancamentos)
    .where(eq(lancamentos.comercioId, comercioId))
    .orderBy(lancamentos.data);
  return c.json(itens);
});

caixaRoutes.post("/", async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const novo = {
    id: randomUUID(),
    comercioId: body.comercio_id,
    descricao: body.descricao,
    valor: body.valor,
    tipo: body.tipo,
    categoria: body.categoria ?? null,
    data: body.data ? new Date(body.data).getTime() : Date.now(),
    criadoEm: Date.now(),
  };
  await db.insert(lancamentos).values(novo);
  return c.json(novo, 201);
});

caixaRoutes.get("/resumo", async (c) => {
  const db = createDb(c.env.DB);
  const comercioId = c.req.query("comercio_id") ?? "";
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [entradas] = await db
    .select({ total: sum(lancamentos.valor) })
    .from(lancamentos)
    .where(
      and(
        eq(lancamentos.comercioId, comercioId),
        eq(lancamentos.tipo, "entrada"),
        gte(lancamentos.data, hoje.getTime())
      )
    );

  const [saidas] = await db
    .select({ total: sum(lancamentos.valor) })
    .from(lancamentos)
    .where(
      and(
        eq(lancamentos.comercioId, comercioId),
        eq(lancamentos.tipo, "saida"),
        gte(lancamentos.data, hoje.getTime())
      )
    );

  const e = Number(entradas?.total ?? 0);
  const s = Number(saidas?.total ?? 0);
  return c.json({ entradas: e, saidas: s, saldo: e - s });
});
