import type { Bindings } from "../index";
import { createDb } from "../db";
import { comercios, lancamentos, fiados } from "../db/schema";
import { eq, and, gte, sum } from "drizzle-orm";
import { enviarResumoCaixa } from "../services/whatsapp";

export async function enviarResumoDiario(env: Bindings): Promise<void> {
  const db = createDb(env.DB);
  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);

  const todosComércios = await db.select().from(comercios);

  for (const comercio of todosComércios) {
    const [resultado] = await db
      .select({
        entradas: sum(lancamentos.valor).as("entradas"),
      })
      .from(lancamentos)
      .where(
        and(
          eq(lancamentos.comercioId, comercio.id),
          eq(lancamentos.tipo, "entrada"),
          gte(lancamentos.data, inicioDia.getTime())
        )
      );

    const [resultadoSaidas] = await db
      .select({ saidas: sum(lancamentos.valor).as("saidas") })
      .from(lancamentos)
      .where(
        and(
          eq(lancamentos.comercioId, comercio.id),
          eq(lancamentos.tipo, "saida"),
          gte(lancamentos.data, inicioDia.getTime())
        )
      );

    const [fiadoPendente] = await db
      .select({ total: sum(fiados.valor).as("total") })
      .from(fiados)
      .where(and(eq(fiados.comercioId, comercio.id), eq(fiados.pago, false)));

    const entradas = Number(resultado?.entradas ?? 0);
    const saidas = Number(resultadoSaidas?.saidas ?? 0);

    await enviarResumoCaixa(env, comercio.whatsapp, {
      entradas,
      saidas,
      saldo: entradas - saidas,
      fiadoPendente: Number(fiadoPendente?.total ?? 0),
    });
  }
}
