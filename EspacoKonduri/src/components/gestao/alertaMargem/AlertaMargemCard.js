import React, { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../../utils/formatPrice';
import { formatarPercentual } from '../../../utils/formatFinanceiro';
import { margemDoProduto } from '../../../utils/financeiro';
import {
  Card,
  CardHeader,
  CardTitulo,
  CardAcao,
  CardAcaoTexto,
  TextoSuave,
  ProdutoLinha,
  ProdutoTopo,
  ProdutoNome,
  MargemBadge,
  MargemBadgeTexto,
  ProdutoNumeros,
  ProdutoNumero,
  ProdutoNumeroLabel,
  ProdutoNumeroValor,
} from '../gestaoCardsStyle';

// Produtos cuja margem atual (preço de venda x custo médio) está abaixo da
// margem mínima definida pelo admin
export default function AlertaMargemCard({ produtos, margemMinima, onEditarMargem, onAbrirProduto }) {
  const { abaixoDoMinimo, semCusto } = useMemo(() => {
    const avaliados = produtos.map((produto) => ({
      produto,
      custo: produto.custoMedio ?? produto.custoUnitario ?? 0,
      margem: margemDoProduto(produto.price, produto.custoMedio ?? produto.custoUnitario ?? 0),
    }));
    return {
      abaixoDoMinimo: avaliados
        .filter((a) => a.margem !== null && a.margem < margemMinima)
        .sort((a, b) => a.margem - b.margem),
      semCusto: avaliados.filter((a) => a.margem === null && a.produto.category === 'produtos').length,
    };
  }, [produtos, margemMinima]);

  return (
    <Card borda={abaixoDoMinimo.length > 0 ? '#F5B7B1' : undefined}>
      <CardHeader>
        <Ionicons name="warning-outline" size={18} color={abaixoDoMinimo.length > 0 ? '#C0392B' : '#6B6B6B'} />
        <CardTitulo>MARGEM DOS PRODUTOS</CardTitulo>
        <CardAcao onPress={onEditarMargem}>
          <Ionicons name="options-outline" size={14} color="#8A6A00" />
          <CardAcaoTexto>Mínima: {formatarPercentual(margemMinima)}</CardAcaoTexto>
        </CardAcao>
      </CardHeader>

      {abaixoDoMinimo.length === 0 ? (
        <TextoSuave>Todos os produtos com custo cadastrado estão acima da margem mínima.</TextoSuave>
      ) : (
        <TextoSuave>
          {abaixoDoMinimo.length === 1
            ? '1 produto está abaixo da margem mínima definida.'
            : `${abaixoDoMinimo.length} produtos estão abaixo da margem mínima definida.`}{' '}
          Toque para revisar o preço ou o custo.
        </TextoSuave>
      )}

      {abaixoDoMinimo.map(({ produto, custo, margem }, indice) => (
        <ProdutoLinha key={produto.id} primeira={indice === 0} onPress={() => onAbrirProduto(produto.id)} activeOpacity={0.7}>
          <ProdutoTopo>
            <ProdutoNome numberOfLines={1}>{produto.title}</ProdutoNome>
            <MargemBadge baixa>
              <Ionicons name="warning" size={11} color="#C0392B" />
              <MargemBadgeTexto baixa>Margem baixa</MargemBadgeTexto>
            </MargemBadge>
          </ProdutoTopo>
          <ProdutoNumeros style={{ paddingLeft: 0 }}>
            <ProdutoNumero>
              <ProdutoNumeroLabel>PREÇO</ProdutoNumeroLabel>
              <ProdutoNumeroValor>{formatPrice(produto.price)}</ProdutoNumeroValor>
            </ProdutoNumero>
            <ProdutoNumero>
              <ProdutoNumeroLabel>CUSTO</ProdutoNumeroLabel>
              <ProdutoNumeroValor>{formatPrice(custo)}</ProdutoNumeroValor>
            </ProdutoNumero>
            <ProdutoNumero>
              <ProdutoNumeroLabel>MARGEM</ProdutoNumeroLabel>
              <ProdutoNumeroValor style={{ color: '#C0392B' }}>{formatarPercentual(margem)}</ProdutoNumeroValor>
            </ProdutoNumero>
          </ProdutoNumeros>
        </ProdutoLinha>
      ))}

      {semCusto > 0 && (
        <TextoSuave style={{ marginTop: 8 }}>
          {semCusto === 1 ? '1 produto não tem' : `${semCusto} produtos não têm`} custo cadastrado e não
          entram nesta análise.
        </TextoSuave>
      )}
    </Card>
  );
}
