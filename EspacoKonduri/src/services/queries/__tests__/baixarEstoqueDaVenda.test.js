// Baixa de estoque da venda numa transação, com Firestore simulado em memória

const mockBanco = {};
const mockGravacoes = [];
const mockNotificacoes = [];

jest.mock('../../../firebase/fireBaseCondig', () => ({ db: {} }));
jest.mock('../notificacoesQueries', () => ({
  criarNotificacaoPorPerfil: jest.fn(async (dados) => mockNotificacoes.push(dados)),
}));
jest.mock('../productsQueries', () => ({ atualizarProduto: jest.fn() }));
jest.mock('firebase/firestore', () => ({
  doc: (_db, ...caminho) => caminho.join('/'),
  collection: () => null,
  runTransaction: async (_db, funcao) =>
    funcao({
      get: async (ref) => ({ exists: () => ref in mockBanco, data: () => mockBanco[ref] }),
      update: (ref, dados) => mockGravacoes.push({ ref, dados }),
      set: jest.fn(),
    }),
  setDoc: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

const { baixarEstoqueDaVenda } = require('../operacoesQueries');

function prepararBanco(dados) {
  Object.keys(mockBanco).forEach((k) => delete mockBanco[k]);
  Object.assign(mockBanco, dados);
  mockGravacoes.length = 0;
  mockNotificacoes.length = 0;
}

const itens = [
  { id: 'imp', title: 'Império', qty: 2, price: 6 },
  { id: 'imp', title: 'Império', qty: 1, price: 6 }, // mesmo produto em duas linhas
  { id: 'agua', title: 'Água', qty: 1, price: 3 },
];

test('caixa aberto: baixa no caixa e no produto, um produto por vez, e avisa estoque baixo pelo limite do produto', async () => {
  prepararBanco({
    'operacoes/op1': { status: 'aberta' },
    'products/imp': { title: 'Império', estoque: 10, limiteEstoqueBaixo: 8 },
    'products/agua': { title: 'Água', estoque: 50 },
    'operacoes/op1/produtos/imp': { estoqueInicial: 10, saidaQtd: 0, valorSaidas: 0 },
  });

  await baixarEstoqueDaVenda('op1', itens);

  expect(mockGravacoes).toEqual([
    { ref: 'products/imp', dados: { estoque: 7 } },
    { ref: 'operacoes/op1/produtos/imp', dados: { saidaQtd: 3, valorSaidas: 18, saldoEstoque: 7 } },
    // Água não está no caixa: abate direto do produto
    { ref: 'products/agua', dados: { estoque: 49 } },
  ]);
  expect(mockNotificacoes).toHaveLength(1);
  expect(mockNotificacoes[0]).toMatchObject({ tipo: 'estoque_baixo', mensagem: 'Império está com apenas 7 unidades.' });
});

test('caixa fechado em outro aparelho: não mexe mais nele, só no estoque do produto', async () => {
  prepararBanco({
    'operacoes/op1': { status: 'fechada' },
    'products/imp': { title: 'Império', estoque: 3 },
    'operacoes/op1/produtos/imp': { estoqueInicial: 10, saidaQtd: 7, valorSaidas: 42 },
  });

  await baixarEstoqueDaVenda('op1', [{ id: 'imp', title: 'Império', qty: 3, price: 6 }]);

  expect(mockGravacoes).toEqual([{ ref: 'products/imp', dados: { estoque: 0 } }]);
  expect(mockNotificacoes[0]).toMatchObject({ tipo: 'estoque_esgotado' });
});
