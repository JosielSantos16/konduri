import React from 'react';
import {
  Card,
  CardHeader,
  CardHeaderLeft,
  Dot,
  ProductName,
  EditButton,
  EditButtonText,
  StatsRow,
  StatBlock,
  StatLabel,
  StatValue,
  SaldoBlock,
  SaldoLabel,
  SaldoValue,
} from './produtoControleCardStyle';

export default function ProdutoControleCard({ produto, onEdit }) {
  return (
    <Card>
      <CardHeader>
        <CardHeaderLeft>
          <Dot />
          <ProductName>{produto.nome}</ProductName>
        </CardHeaderLeft>
        <EditButton onPress={onEdit}>
          <EditButtonText>EDITAR</EditButtonText>
        </EditButton>
      </CardHeader>

      <StatsRow>
        <StatBlock>
          <StatLabel>ESTOQUE INICIAL</StatLabel>
          <StatValue>{produto.estoqueInicial} {produto.unidade}</StatValue>
        </StatBlock>
        <StatBlock>
          <StatLabel>ENTRADA (QTD.)</StatLabel>
          <StatValue>{produto.entradaQtd} {produto.unidade}</StatValue>
        </StatBlock>
      </StatsRow>

      <StatsRow>
        <StatBlock>
          <StatLabel>SAÍDA / VENDA</StatLabel>
          <StatValue>{produto.saidaQtd} {produto.unidade}</StatValue>
        </StatBlock>
        <StatBlock>
          <StatLabel>VALOR ENTRADAS</StatLabel>
          <StatValue>R$ {produto.valorEntradas.toFixed(2)}</StatValue>
        </StatBlock>
      </StatsRow>

      <StatsRow>
        <StatBlock>
          <StatLabel>VALOR SAÍDAS</StatLabel>
          <StatValue>R$ {produto.valorSaidas.toFixed(2)}</StatValue>
        </StatBlock>
        <SaldoBlock>
          <SaldoLabel>SALDO EM ESTOQUE</SaldoLabel>
          <SaldoValue>{produto.saldoEstoque} {produto.unidade}</SaldoValue>
        </SaldoBlock>
      </StatsRow>
    </Card>
  );
}