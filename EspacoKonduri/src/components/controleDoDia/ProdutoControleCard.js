import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Card,
  CardHeader,
  CardHeaderLeft,
  ProductImage,
  ImagePlaceholder,
  ProductName,
  SaldoBadge,
  SaldoBadgeLabel,
  SaldoBadgeValue,
  StatsRow,
  StatBlock,
  StatLabel,
  StatValue,
  EditButton,
  EditButtonText,
  AlertaEstoque,
  AlertaEstoqueText,
} from './produtoControleCardStyle';

export default function ProdutoControleCard({ produto, onEdit }) {
  const saldo = produto.saldoEstoque ?? 0;
  const limiteBaixo = produto.limiteEstoqueBaixo ?? 5;
  const semEstoque = saldo <= 0;
  const estoqueBaixo = !semEstoque && saldo <= limiteBaixo;

  return (
    <Card semEstoque={semEstoque}>
      <CardHeader>
        <CardHeaderLeft>
          {produto.image ? (
            <ProductImage source={{ uri: produto.image }} resizeMode="cover" />
          ) : (
            <ImagePlaceholder>
              <Ionicons name="cube-outline" size={26} color="#C9BBA8" />
            </ImagePlaceholder>
          )}
          <ProductName numberOfLines={1}>{produto.nome}</ProductName>
        </CardHeaderLeft>
        <SaldoBadge semEstoque={semEstoque} estoqueBaixo={estoqueBaixo}>
          <SaldoBadgeLabel semEstoque={semEstoque} estoqueBaixo={estoqueBaixo}>
            SALDO
          </SaldoBadgeLabel>
          <SaldoBadgeValue semEstoque={semEstoque} estoqueBaixo={estoqueBaixo}>
            {saldo} un
          </SaldoBadgeValue>
        </SaldoBadge>
      </CardHeader>

      {semEstoque && (
        <AlertaEstoque>
          <Ionicons name="alert-circle" size={16} color="#C0392B" />
          <AlertaEstoqueText>Estoque esgotado — reabastecer produto</AlertaEstoqueText>
        </AlertaEstoque>
      )}

      {estoqueBaixo && (
        <AlertaEstoque baixo>
          <Ionicons name="warning" size={16} color="#D35400" />
          <AlertaEstoqueText baixo>Estoque baixo — considere reabastecer</AlertaEstoqueText>
        </AlertaEstoque>
      )}

      <StatsRow>
        <StatBlock>
          <StatLabel>ESTOQUE INICIAL</StatLabel>
          <StatValue>{produto.estoqueInicial} un</StatValue>
        </StatBlock>
        <StatBlock>
          <StatLabel>ENTRADA (QTD.)</StatLabel>
          <StatValue>{produto.entradaQtd} un</StatValue>
        </StatBlock>
      </StatsRow>

      <StatsRow>
        <StatBlock>
          <StatLabel>SAÍDA / VENDA</StatLabel>
          <StatValue>{produto.saidaQtd} un</StatValue>
        </StatBlock>
        <StatBlock>
          <StatLabel>VALOR ENTRADAS</StatLabel>
          <StatValue>R$ {produto.valorEntradas.toFixed(2)}</StatValue>
        </StatBlock>
      </StatsRow>

      <StatsRow style={{ marginBottom: 0 }}>
        <StatBlock>
          <StatLabel>VALOR SAÍDAS</StatLabel>
          <StatValue>R$ {produto.valorSaidas.toFixed(2)}</StatValue>
        </StatBlock>
        <EditButton onPress={onEdit} activeOpacity={0.8}>
          <Ionicons name="pencil" size={13} color="#FFFFFF" />
          <EditButtonText>EDITAR</EditButtonText>
        </EditButton>
      </StatsRow>
    </Card>
  );
}