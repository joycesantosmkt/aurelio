import { Hono } from "hono";
import { createDb, clientes, fiados } from "../db";
import { eq, and, sum } from "drizzle-orm";
import type { Bindings } from "../index";
import { randomUUID } from "crypto";

export const fiadoRoutes = new Hono<{ Bindings: Bindings }>();

fiadoRoutes.get("/clientes", async (c) => {
  const db = createDb(c.env.DB);
  const comercioId = c.req.query("comercio_id") ?? "";
  const lista = await db
    .select()
    .from(clientes)
    .where(eq(clientes.comercioId, comercioId));
  return c.json(lista);
});

fiadoRoutes.post("/clientes", async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const novo = {
    id: randomUUID(),
    comercioId: body.comercio_id,
    nome: body.nome,
    telefone: body.telefone ?? null,
    criadoEm: Date.now(),
  };
  await db.insert(clientes).values(novo);
  return c.json(novo, 201);
});

fiadoRoutes.get("/clientes/:clienteId/fiados", async (c) => {
  const db = createDb(c.env.DB);
  const lista = await db
    .select()
    .from(fiados)
    .where(eq(fiados.clienteId, c.req.param("clienteId")));
  return c.json(lista);
});

fiadoRoutes.post("/", async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json();
  const novo = {
    id: randomUUID(),
    clienteId: body.cliente_id,
    comercioId: body.comercio_id,
    descricao: body.descricao ?? null,
    valor: body.valor,
    pago: false,
    dataVenda: Date.now(),
    dataPagamento: null,
  };
  await db.insert(fiados).values(novo);
  return c.json(novo, 201);
});

fiadoRoutes.patch("/:fiadoId/pagar", async (c) => {
  const db = createDb(c.env.DB);
  await db
    .update(fiados)
    .set({ pago: true, dataPagamento: Date.now() })
    .where(eq(fiados.id, c.req.param("fiadoId")));
  return c.json({ mensagem: "Fiado marcado como pago" });
});
