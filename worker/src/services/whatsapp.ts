import type { Bindings } from "../index";

const API_URL = "https://graph.facebook.com/v19.0";

export async function enviarMensagem(
  env: Bindings,
  telefone: string,
  mensagem: string
): Promise<void> {
  const res = await fetch(`${API_URL}/${env.WHATSAPP_PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: telefone,
      type: "text",
      text: { body: mensagem },
    }),
  });

  if (!res.ok) throw new Error(`WhatsApp API erro: ${res.status}`);
}

export async function enviarResumoCaixa(
  env: Bindings,
  telefone: string,
  resumo: { entradas: number; saidas: number; saldo: number; fiadoPendente: number }
): Promise<void> {
  const { entradas, saidas, saldo, fiadoPendente } = resumo;
  const mensagem =
    `*Aurélio - Resumo do Dia* 📊\n\n` +
    `✅ Entradas: R$ ${entradas.toFixed(2)}\n` +
    `❌ Saídas: R$ ${saidas.toFixed(2)}\n` +
    `💰 Saldo do dia: R$ ${saldo.toFixed(2)}\n` +
    `📋 Fiado pendente: R$ ${fiadoPendente.toFixed(2)}\n\n` +
    `Acesse o dashboard para mais detalhes.`;

  await enviarMensagem(env, telefone, mensagem);
}

export async function enviarAlertaFiado(
  env: Bindings,
  telefoneComercio: string,
  nomeCliente: string,
  valor: number
): Promise<void> {
  const mensagem =
    `*Aurélio - Alerta de Fiado* ⚠️\n\n` +
    `O cliente *${nomeCliente}* tem R$ ${valor.toFixed(2)} em aberto.\n\n` +
    `Quer que eu envie um lembrete para ele?`;

  await enviarMensagem(env, telefoneComercio, mensagem);
}
