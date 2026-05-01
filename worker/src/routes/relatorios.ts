import { Hono } from "hono";
import { createDb, lancamentos, fiados, clientes } from "../db";
import { eq, and, gte, sum } from "drizzle-orm";
import type { Bindings } from "../index";

export const relatoriosRoutes = new Hono<{ Bindings: Bindings }>();

relatoriosRoutes.get("/mensal", async (c) => {
  const db = createDb(c.env.DB);
  const comercioId = c.req.query("comercio_id") ?? "";
  const inicioMes = new Date();
  inicioMes.setDate(1);
  inicioMes.setHours(0, 0, 0, 0);

  const [entradas] = await db
    .select({ total: sum(lancamentos.valor) })
    .from(lancamentos)
    .where(
      and(
        eq(lancamentos.comercioId, comercioId),
        eq(lancamentos.tipo, "entrada"),
        gte(lancamentos.data, inicioMes.getTime())
      )
    );

  const [saidas] = await db
    .select({ total: sum(lancamentos.valor) })
    .from(lancamentos)
    .where(
      and(
        eq(lancamentos.comercioId, comercioId),
        eq(lancamentos.tipo, "saida"),
        gte(lancamentos.data, inicioMes.getTime())
      )
    );

  const e = Number(entradas?.total ?? 0);
  const s = Number(saidas?.total ?? 0);
  return c.json({ periodo: "mes_atual", entradas: e, saidas: s, saldo: e - s });
});

relatoriosRoutes.get("/fiado-pendente", async (c) => {
  const db = createDb(c.env.DB);
  const comercioId = c.req.query("comercio_id") ?? "";

  const pendentes = await db
    .select({
      clienteId: fiados.clienteId,
      total: sum(fiados.valor),
      nomeCliente: clientes.nome,
      telefone: clientes.telefone,
    })
    .from(fiados)
    .innerJoin(clientes, eq(fiados.clienteId, clientes.id))
    .where(and(eq(fiados.comercioId, comercioId), eq(fiados.pago, false)))
    .groupBy(fiados.clienteId, clientes.nome, clientes.telefone);

  const totalGeral = pendentes.reduce((acc, p) => acc + Number(p.total ?? 0), 0);
  return c.json({ total_pendente: totalGeral, clientes: pendentes });
});
