CREATE TABLE IF NOT EXISTS comercios (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  criado_em INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS lancamentos (
  id TEXT PRIMARY KEY,
  comercio_id TEXT NOT NULL REFERENCES comercios(id),
  descricao TEXT NOT NULL,
  valor REAL NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('entrada', 'saida')),
  categoria TEXT,
  data INTEGER NOT NULL,
  criado_em INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  comercio_id TEXT NOT NULL REFERENCES comercios(id),
  nome TEXT NOT NULL,
  telefone TEXT,
  criado_em INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS fiados (
  id TEXT PRIMARY KEY,
  cliente_id TEXT NOT NULL REFERENCES clientes(id),
  comercio_id TEXT NOT NULL REFERENCES comercios(id),
  descricao TEXT,
  valor REAL NOT NULL,
  pago INTEGER NOT NULL DEFAULT 0,
  data_venda INTEGER NOT NULL,
  data_pagamento INTEGER
);
