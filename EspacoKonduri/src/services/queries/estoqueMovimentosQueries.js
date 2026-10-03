import { collection, doc } from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';
import { paraDataISOLocal } from '../../utils/dataLocal';

const COLECAO_ESTOQUE_MOVIMENTOS = 'estoque_movimentos';

// A quantidade é sempre positiva: o tipo é que define se o movimento soma ou abate do estoque
export const TIPOS_MOVIMENTO = {
  ENTRADA: 'ENTRADA',
  VENDA: 'VENDA',
  AJUSTE_ENTRADA: 'AJUSTE_ENTRADA',
  AJUSTE_SAIDA: 'AJUSTE_SAIDA',
  PERDA: 'PERDA',
  CORTESIA: 'CORTESIA',
};

// Referência para um novo movimento, para ser gravado dentro de um batch ou transação
export function novoMovimentoRef() {
  return doc(collection(db, COLECAO_ESTOQUE_MOVIMENTOS));
}

export function montarMovimento({
  produtoId,
  produtoNome,
  tipo,
  quantidade,
  custoUnitario,
  usuarioUid,
  usuarioNome,
  vendaId,
  operacaoId,
  observacao,
}) {
  const custo = custoUnitario ?? null;

  return {
    produtoId,
    produtoNome: produtoNome || '',
    tipo,
    quantidade,
    custoUnitario: custo,
    valorTotal: custo !== null ? Math.round(custo * quantidade * 100) / 100 : null,
    vendaId: vendaId || null,
    operacaoId: operacaoId || null,
    usuarioUid: usuarioUid || null,
    usuarioNome: usuarioNome || '',
    observacao: observacao || '',
    data: paraDataISOLocal(),
    criadoEm: new Date().toISOString(),
  };
}
