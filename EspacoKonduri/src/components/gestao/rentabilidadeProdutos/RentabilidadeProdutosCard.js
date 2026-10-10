import React, { useState, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../../utils/formatPrice';
import { formatarMoeda, formatarPercentual } from '../../../utils/formatFinanceiro';
import {
  ORDENACOES_RENTABILIDADE,
  ordenarRentabilidade,
  rentabilidadePorProduto,
} from '../../../utils/financeiro';
import {
  Card,
  CardHeader,
  CardTitulo,
  TextoSuave,
  Abas,
  Aba,
  AbaTexto,
  ProdutoLinha,
  ProdutoTopo,
  ProdutoPosicao,
  ProdutoNome,
  MargemBadge,
  MargemBadgeTexto,
  ProdutoNumeros,
  ProdutoNumero,
  ProdutoNumeroLabel,
  ProdutoNumeroValor,
  VerTodos,
  VerTodosTexto,
} from '../gestaoCardsStyle';

const ABAS = [
  { key: ORDENACOES_RENTABILIDADE.MAIS_RENTAVEIS, label: 'Mais rentáveis' },
  { key: ORDENACOES_RENTABILIDADE.MENOR_MARGEM, label: 'Menor margem' },
  { key: ORDENACOES_RENTABILIDADE.MAIS_VENDIDOS, label: 'Mais vendidos' },
];

const LIMITE_INICIAL = 5;

const MENSAGEM_VAZIA = {
  [ORDENACOES_RENTABILIDADE.MAIS_RENTAVEIS]: 'Nenhum produto com custo registrado vendido no período.',
  [ORDENACOES_RENTABILIDADE.MENOR_MARGEM]: 'Nenhum produto com custo registrado vendido no período.',
  [ORDENACOES_RENTABILIDADE.MAIS_VENDIDOS]: 'Nenhuma venda no período.',
};

export default function RentabilidadeProdutosCard({ vendas, margemMinima }) {
  const [aba, setAba] = useState(ORDENACOES_RENTABILIDADE.MAIS_RENTAVEIS);
  const [verTodos, setVerTodos] = useState(false);

  const produtos = useMemo(() => rentabilidadePorProduto(vendas), [vendas]);
  const ordenados = useMemo(() => ordenarRentabilidade(produtos, aba), [produtos, aba]);
  const exibidos = verTodos ? ordenados : ordenados.slice(0, LIMITE_INICIAL);

  return (
    <Card>
      <CardHeader>
        <Ionicons name="podium-outline" size={18} color="#8C7355" />
        <CardTitulo>RENTABILIDADE DOS PRODUTOS</CardTitulo>
      </CardHeader>

      <Abas>
        {ABAS.map((opcao) => (
          <Aba
            key={opcao.key}
            ativa={aba === opcao.key}
            onPress={() => {
              setAba(opcao.key);
              setVerTodos(false);
            }}
          >
            <AbaTexto ativa={aba === opcao.key}>{opcao.label}</AbaTexto>
          </Aba>
        ))}
      </Abas>

      {ordenados.length === 0 && <TextoSuave>{MENSAGEM_VAZIA[aba]}</TextoSuave>}

      {exibidos.map((produto, indice) => {
        const margemBaixa = produto.margem !== null && produto.margem < margemMinima;
        return (
          <ProdutoLinha key={produto.produtoId || produto.nome} primeira={indice === 0} disabled activeOpacity={1}>
            <ProdutoTopo>
              <ProdutoPosicao>{indice + 1}º</ProdutoPosicao>
              <ProdutoNome numberOfLines={1}>{produto.nome}</ProdutoNome>
              <MargemBadge baixa={margemBaixa} semCusto={!produto.custoCompleto}>
                {margemBaixa && <Ionicons name="warning" size={11} color="#C0392B" />}
                <MargemBadgeTexto baixa={margemBaixa} semCusto={!produto.custoCompleto}>
                  {produto.custoCompleto ? formatarPercentual(produto.margem) : 'sem custo'}
                </MargemBadgeTexto>
              </MargemBadge>
            </ProdutoTopo>
            <ProdutoNumeros>
              <ProdutoNumero>
                <ProdutoNumeroLabel>QTD.</ProdutoNumeroLabel>
                <ProdutoNumeroValor>{produto.quantidade}</ProdutoNumeroValor>
              </ProdutoNumero>
              <ProdutoNumero>
                <ProdutoNumeroLabel>RECEITA</ProdutoNumeroLabel>
                <ProdutoNumeroValor>{formatPrice(produto.receita)}</ProdutoNumeroValor>
              </ProdutoNumero>
              <ProdutoNumero>
                <ProdutoNumeroLabel>CMV</ProdutoNumeroLabel>
                <ProdutoNumeroValor>{produto.cmv !== null ? formatPrice(produto.cmv) : '—'}</ProdutoNumeroValor>
              </ProdutoNumero>
              <ProdutoNumero>
                <ProdutoNumeroLabel>LUCRO BRUTO</ProdutoNumeroLabel>
                <ProdutoNumeroValor>
                  {produto.lucroBruto !== null ? formatarMoeda(produto.lucroBruto) : '—'}
                </ProdutoNumeroValor>
              </ProdutoNumero>
            </ProdutoNumeros>
          </ProdutoLinha>
        );
      })}

      {ordenados.length > LIMITE_INICIAL && (
        <VerTodos onPress={() => setVerTodos(!verTodos)}>
          <VerTodosTexto>{verTodos ? 'Ver menos' : `Ver todos (${ordenados.length})`}</VerTodosTexto>
        </VerTodos>
      )}
    </Card>
  );
}
