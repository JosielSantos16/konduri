import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../utils/formatPrice';
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

export default function ProdutoControleCard({ produto, onEdit, onEntrada }) {
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
              <Ionicons name="cube-outline" size={26} color="#C4C4BE" />
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
          <Ionicons name="warning" size={16} color="#6B5300" />
          <AlertaEstoqueText baixo>Estoque baixo — considere reabastecer</AlertaEstoqueText>
        </AlertaEstoque>
      )}

      <StatsRow>
        <StatBlock>
          <StatLabel>ESTOQUE INICIAL</StatLabel>
          <StatValue>{produto.estoqueInicial ?? 0} un</StatValue>
        </StatBlock>
        <StatBlock>
          <StatLabel>ENTRADA (QTD.)</StatLabel>
          <StatValue>{produto.entradaQtd ?? 0} un</StatValue>
        </StatBlock>
      </StatsRow>

      <StatsRow>
        <StatBlock>
          <StatLabel>SAÍDA / VENDA</StatLabel>
          <StatValue>{produto.saidaQtd ?? 0} un</StatValue>
        </StatBlock>
        <StatBlock>
          <StatLabel>VALOR ENTRADAS</StatLabel>
          <StatValue>{formatPrice(produto.valorEntradas || 0)}</StatValue>
        </StatBlock>
      </StatsRow>

      {produto.ajusteSaidaQtd > 0 && (
        <StatsRow>
          <StatBlock>
            <StatLabel>PERDAS / AJUSTES</StatLabel>
            <StatValue>{produto.ajusteSaidaQtd} un</StatValue>
          </StatBlock>
        </StatsRow>
      )}

      <StatsRow style={{ marginBottom: 0 }}>
        <StatBlock>
          <StatLabel>VALOR SAÍDAS</StatLabel>
          <StatValue>{formatPrice(produto.valorSaidas || 0)}</StatValue>
        </StatBlock>
        <EditButton onPress={onEntrada} activeOpacity={0.8} style={{ marginRight: 8 }}>
          <Ionicons name="add" size={14} color="#1A1A1A" />
          <EditButtonText>ENTRADA</EditButtonText>
        </EditButton>
        <EditButton onPress={onEdit} activeOpacity={0.8}>
          <Ionicons name="pencil" size={13} color="#1A1A1A" />
          <EditButtonText>EDITAR</EditButtonText>
        </EditButton>
      </StatsRow>
    </Card>
  );
}