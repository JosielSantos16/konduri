import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/fireBaseCondig';

export async function criarPedidoPix({ vendaId, total, itens, clienteNome, clienteEmail }) {
  const fn = httpsCallable(functions, 'criarPedidoPix');
  const resultado = await fn({ vendaId, total, itens, clienteNome, clienteEmail });
  return resultado.data;
}

export async function verificarStatusPix(orderId) {
  const fn = httpsCallable(functions, 'verificarStatusPix');
  const resultado = await fn({ orderId });
  return resultado.data;
}