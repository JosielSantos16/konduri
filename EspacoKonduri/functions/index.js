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

  const resposta = await fetch(`${PAGBANK_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAGBANK_TOKEN.value()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reference_id: vendaId,
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
      qr_codes: [{ amount: { value: valorEmCentavos } }],
      notification_urls: [
        `https://us-central1-konduri-23eb1.cloudfunctions.net/webhookPagBank`,
      ],
    }),
  });

  const pedido = await resposta.json();

  if (!resposta.ok) {
    console.error("Erro do PagBank:", pedido);
    throw new Error("Não foi possível criar o pedido Pix.");
  }

  const qrCode = pedido.qr_codes[0];

  await db.collection("pagamentosPix").doc(pedido.id).set({
    vendaId,
    orderId: pedido.id,
    status: "aguardando",
    total,
    qrCodeTexto: qrCode.text,
    qrCodeImagemUrl: qrCode.links.find((l) => l.rel === "QRCODE.PNG")?.href,
    criadoEm: new Date().toISOString(),
  });

  return {
    orderId: pedido.id,
    qrCodeTexto: qrCode.text,
    qrCodeImagemUrl: qrCode.links.find((l) => l.rel === "QRCODE.PNG")?.href,
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

  // Log detalhado pra investigar o que o PagBank realmente devolveu
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