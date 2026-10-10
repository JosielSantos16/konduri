// Testa a transação de cancelamento com um Firestore simulado em memória:
// o que é lido, o que é gravado e em quais documentos.

const mockBanco = {};
const mockGravacoes = [];
const mockNotificacoes = [];

jest.mock('../../../firebase/fireBaseCondig', () => ({ db: {} }));
jest.mock('../notificacoesQueries', () => ({
  criarNotificacaoPorPerfil: jest.fn(async (dados) => mockNotificacoes.push(dados)),
}));
jest.mock('firebase/firestore', () => {
  let contadorMovimentos = 0;
  return {
    doc: (_db, ...caminho) =>
      caminho.length ? caminho.join('/') : `estoque_movimentos/novo-${++contadorMovimentos}`,
    collection: () => null,
    runTransaction: async (_db, funcao) =>
      funcao({
        get: async (ref) => ({ id: ref.split('/').pop(), exists: () => ref in mockBanco, data: () => mockBanco[ref] }),
        update: (ref, dados) => mockGravacoes.push({ tipo: 'update', ref, dados }),
        set: (ref, dados) => mockGravacoes.push({ tipo: 'set', ref, dados }),
      }),
    writeBatch: jest.fn(),
    onSnapshot: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
  };
});

const { cancelarVenda, ERRO_VENDA_JA_CANCELADA } = require('../vendasQueries');

const gravacoesEm = (prefixo) => mockGravacoes.filter((g) => g.ref.startsWith(prefixo));

function prepararBanco(dados) {
  Object.keys(mockBanco).forEach((k) => delete mockBanco[k]);
  Object.assign(mockBanco, dados);
  mockGravacoes.length = 0;
  mockNotificacoes.length = 0;
}

const VENDA = {
  data: '2026-10-10',
  criadoEm: '2026-10-10T15:00:00.000Z',
  operacaoId: 'op-hoje',
  responsavelUid: 'joao',
  responsavelNome: 'João',
  total: 30,
  metodo: 'pix',
  itens: [{ id: 'imp', title: 'Império', qty: 5, price: 6, category: 'produtos', custoUnitario: 3.2, custoTotal: 16 }],
};

const ADMIN = { motivo: 'Registrada em duplicidade', usuarioUid: 'adm1', usuarioNome: 'Bosco' };

describe('cancelarVenda (transação)', () => {
  test('caixa da venda aberto: grava só os 5 campos na venda, desfaz a saída e ajusta a comissão', async () => {
    prepararBanco({
      'vendas/v1': { ...VENDA },
      'operacoes/op-hoje': { status: 'aberta' },
      'products/imp': { estoque: 14 },
      'operacoes/op-hoje/produtos/imp': { estoqueInicial: 20, saidaQtd: 6, valorSaidas: 36 },
      'comissoes/2026-10-10_joao': { baseCalculo: 120, percentual: 10, valorComissao: 12, atualizadoEm: '2026-10-10T23:00:00.000Z' },
    });

    const r = await cancelarVenda({ vendaId: 'v1', operacaoAbertaId: 'op-hoje', ...ADMIN });

    const [vendaGravada] = gravacoesEm('vendas/');
    expect(Object.keys(vendaGravada.dados).sort()).toEqual(
      ['canceladaEm', 'canceladaPorNome', 'canceladaPorUid', 'motivoCancelamento', 'status'].sort()
    );
    expect(vendaGravada.dados).toMatchObject({ status: 'cancelada', canceladaPorUid: 'adm1', motivoCancelamento: ADMIN.motivo });

    expect(gravacoesEm('products/imp')[0].dados).toEqual({ estoque: 19 });
    expect(gravacoesEm('operacoes/op-hoje/produtos/imp')[0].dados).toEqual({ saidaQtd: 1, valorSaidas: 6, saldoEstoque: 19 });

    const [movimento] = gravacoesEm('estoque_movimentos/');
    expect(movimento.dados).toMatchObject({ tipo: 'ESTORNO_VENDA', vendaId: 'v1', quantidade: 5, custoUnitario: 3.2, operacaoId: 'op-hoje' });

    expect(gravacoesEm('comissoes/')[0].dados).toMatchObject({ baseCalculo: 90, valorComissao: 9 });
    expect(r).toMatchObject({ caixaDaVendaFechado: false, comissaoAjustada: { atendente: 'João', de: 12, para: 9 } });

    expect(mockNotificacoes[0]).toMatchObject({ tipo: 'venda_cancelada', paraPerfis: ['adm'] });
  });

  test('caixa da venda fechado e outro aberto: estornoQtd no caixa de hoje, caixa fechado intocado', async () => {
    prepararBanco({
      'vendas/v1': { ...VENDA, operacaoId: 'op-ontem' },
      'operacoes/op-ontem': { status: 'fechada' },
      'operacoes/op-hoje': { status: 'aberta' },
      'products/imp': { estoque: 6 },
      'operacoes/op-ontem/produtos/imp': { estoqueInicial: 20, saidaQtd: 9, valorSaidas: 54 },
      'operacoes/op-hoje/produtos/imp': { estoqueInicial: 10, saidaQtd: 4 },
    });

    const r = await cancelarVenda({ vendaId: 'v1', operacaoAbertaId: 'op-hoje', ...ADMIN });

    expect(gravacoesEm('operacoes/op-ontem')).toEqual([]);
    expect(gravacoesEm('operacoes/op-hoje/produtos/imp')[0].dados).toEqual({ estornoQtd: 5, saldoEstoque: 11 });
    expect(gravacoesEm('products/imp')[0].dados).toEqual({ estoque: 11 });
    expect(r.caixaDaVendaFechado).toBe(true);
    expect(r.comissaoAjustada).toBeNull(); // sem comissão definida
  });

  test('sem caixa aberto: devolve direto no estoque do produto', async () => {
    prepararBanco({
      'vendas/v1': { ...VENDA, operacaoId: 'op-ontem' },
      'operacoes/op-ontem': { status: 'fechada' },
      'products/imp': { estoque: 2 },
    });

    const r = await cancelarVenda({ vendaId: 'v1', operacaoAbertaId: null, ...ADMIN });

    expect(gravacoesEm('products/imp')[0].dados).toEqual({ estoque: 7 });
    expect(gravacoesEm('operacoes/')).toEqual([]);
    expect(r.caixaDaVendaFechado).toBe(true);
  });

  test('venda já cancelada (outro aparelho): não grava nada', async () => {
    prepararBanco({
      'vendas/v1': { ...VENDA, status: 'cancelada' },
      'products/imp': { estoque: 2 },
    });

    await expect(cancelarVenda({ vendaId: 'v1', operacaoAbertaId: null, ...ADMIN })).rejects.toThrow(
      ERRO_VENDA_JA_CANCELADA
    );
    expect(mockGravacoes).toEqual([]);
    expect(mockNotificacoes).toEqual([]);
  });

  test('produto excluído do catálogo: cancela a venda e avisa que o estoque não voltou', async () => {
    prepararBanco({ 'vendas/v1': { ...VENDA, operacaoId: null } });

    const r = await cancelarVenda({ vendaId: 'v1', operacaoAbertaId: null, ...ADMIN });

    expect(gravacoesEm('vendas/v1')).toHaveLength(1);
    expect(gravacoesEm('products/')).toEqual([]);
    expect(r.produtosNaoEncontrados).toEqual(['Império']);
  });
});
