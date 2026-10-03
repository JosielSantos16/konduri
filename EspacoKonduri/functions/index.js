const { onCall, onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const PAGBANK_TOKEN = defineSecret("PAGBANK_TOKEN");
const PAGBANK_URL = "https://sandbox.api.pagseguro.com";

exports.criarPedidoPix = onCall({ secrets: [PAGBANK_TOKEN] }, async (request) => {
  const { vendaId, total, itens, clienteNome, clienteEmail } = request.data;

  if (!vendaId || !total) {
    throw new Error("Dados insuficientes para criar o pedido.");
  }

  const valorEmCentavos = Math.round(total * 100);

  const expiracao = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const resposta = await fetch(`${PAGBANK_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAGBANK_TOKEN.value()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer: {
        name: clienteNome || "Cliente Espaço Konduri",
        email: clienteEmail || "cliente@espacokonduri.com",
        tax_id: "12345678909",
      },
      items: (itens || []).map((item, index) => ({
        reference_id: `item${index}`,
        name: item.title,
        quantity: item.qty,
        unit_amount: Math.round(item.price * 100),
      })),
      shipping: {
        address: {
          street: "Endereço do evento",
          number: "S/N",
          locality: "Oriximina",
          city: "Oriximina",
          region_code: "PA",
          country: "BRA",
          postal_code: "69270000",
        },
      },
      charges: [
        {
          reference_id: vendaId,
          description: "Venda Espaço Konduri",
          amount: {
            value: valorEmCentavos,
            currency: "BRL",
          },
          payment_method: {
            type: "PIX",
            pix: {
              expiration_date: expiracao,
            },
          },
        },
      ],
      notification_urls: [
        `https://us-central1-konduri-23eb1.cloudfunctions.net/webhookPagBank`,
      ],
    }),
  });

  const pedido = await resposta.json();

  if (!resposta.ok) {
    console.error("Erro do PagBank:", JSON.stringify(pedido));
    throw new Error("Não foi possível criar o pedido Pix.");
  }

  const cobranca = pedido.charges?.[0];

  if (!cobranca) {
    console.error("Pedido criado sem charges:", JSON.stringify(pedido));
    throw new Error("Resposta inesperada do PagBank.");
  }

  const qrCodeTexto = cobranca.qr_code?.text;
  const qrCodeImagemUrl = cobranca.links?.find((l) => l.rel === "QRCODE.PNG")?.href;

  await db.collection("pagamentosPix").doc(pedido.id).set({
    vendaId,
    orderId: pedido.id,
    chargeId: cobranca.id,
    status: cobranca.status === "PAID" ? "pago" : "aguardando",
    total,
    qrCodeTexto,
    qrCodeImagemUrl,
    criadoEm: new Date().toISOString(),
  });

  return {
    orderId: pedido.id,
    qrCodeTexto,
    qrCodeImagemUrl,
  };
});

exports.webhookPagBank = onRequest(async (req, res) => {
  const pedido = req.body;

  console.log("Webhook recebido do PagBank:", JSON.stringify(pedido));

  if (!pedido?.id) {
    res.status(400).send("Payload inválido");
    return;
  }

  console.log("Campo charges no webhook:", JSON.stringify(pedido.charges));

  const foiPago = (pedido.charges || []).some(
    (charge) => charge.payment_method?.type === "PIX" && charge.status === "PAID"
  );

  console.log("Webhook calculou foiPago:", foiPago);

  if (foiPago) {
    await db.collection("pagamentosPix").doc(pedido.id).update({
      status: "pago",
      pagoEm: new Date().toISOString(),
    });
  }

  res.status(200).send("OK");
});

exports.verificarStatusPix = onCall({ secrets: [PAGBANK_TOKEN] }, async (request) => {
  const { orderId } = request.data;

  const resposta = await fetch(`${PAGBANK_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${PAGBANK_TOKEN.value()}` },
  });

  const pedido = await resposta.json();

  console.log("Resposta completa do PagBank:", JSON.stringify(pedido));
  console.log("Campo charges recebido:", JSON.stringify(pedido.charges));

  const foiPago = (pedido.charges || []).some(
    (charge) => charge.payment_method?.type === "PIX" && charge.status === "PAID"
  );

  console.log("Resultado calculado (foiPago):", foiPago);

  if (foiPago) {
    await db.collection("pagamentosPix").doc(orderId).update({
      status: "pago",
      pagoEm: new Date().toISOString(),
    });
  }

  return { status: foiPago ? "pago" : "aguardando" };
});