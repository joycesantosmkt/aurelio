import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";

export const comercios = sqliteTable("comercios", {
  id: text("id").primaryKey(),
  nome: text("nome").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull().unique(),
  senhaHash: text("senha_hash").notNull(),
  criadoEm: integer("criado_em").notNull(),
});

export const lancamentos = sqliteTable("lancamentos", {
  id: text("id").primaryKey(),
  comercioId: text("comercio_id")
    .notNull()
    .references(() => comercios.id),
  descricao: text("descricao").notNull(),
  valor: real("valor").notNull(),
  tipo: text("tipo", { enum: ["entrada", "saida"] }).notNull(),
  categoria: text("categoria"),
  data: integer("data").notNull(),
  criadoEm: integer("criado_em").notNull(),
});

export const clientes = sqliteTable("clientes", {
  id: text("id").primaryKey(),
  comercioId: text("comercio_id")
    .notNull()
    .references(() => comercios.id),
  nome: text("nome").notNull(),
  telefone: text("telefone"),
  criadoEm: integer("criado_em").notNull(),
});

export const fiados = sqliteTable("fiados", {
  id: text("id").primaryKey(),
  clienteId: text("cliente_id")
    .notNull()
    .references(() => clientes.id),
  comercioId: text("comercio_id")
    .notNull()
    .references(() => comercios.id),
  descricao: text("descricao"),
  valor: real("valor").notNull(),
  pago: integer("pago", { mode: "boolean" }).notNull().default(false),
  dataVenda: integer("data_venda").notNull(),
  dataPagamento: integer("data_pagamento"),
});
