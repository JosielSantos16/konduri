import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../../utils/formatPrice';
import { formatarMoeda, formatarPercentual } from '../../../utils/formatFinanceiro';
import {
  Card,
  CardHeader,
  CardTitulo,
  DreLinha,
  DreLabel,
  DreValor,
  DrePercentual,
  TextoSuave,
} from '../gestaoCardsStyle';

// Quadro "Resultado financeiro": receita até o resultado operacional, com a
// margem de cada subtotal sobre a receita
export default function ResultadoFinanceiroCard({ indicadores: i }) {
  const corResultado = i.resultado >= 0 ? '#2E5A1E' : '#C0392B';
  const variaveis = i.custosVariaveis;

  const detalheVariaveis = [
    variaveis.despesasEmValor > 0 && `despesas ${formatPrice(variaveis.despesasEmValor)}`,
    variaveis.despesasPercentuais > 0 && `% sobre vendas ${formatPrice(variaveis.despesasPercentuais)}`,
    variaveis.comissoes > 0 && `comissões ${formatPrice(variaveis.comissoes)}`,
  ].filter(Boolean);

  return (
    <Card>
      <CardHeader>
        <Ionicons name="document-text-outline" size={18} color="#8C7355" />
        <CardTitulo>RESULTADO FINANCEIRO</CardTitulo>
      </CardHeader>

      <DreLinha>
        <DreLabel>Receita</DreLabel>
        <DreValor>{formatPrice(i.faturamento)}</DreValor>
        <DrePercentual />
      </DreLinha>
      <DreLinha>
        <DreLabel>(-) CMV</DreLabel>
        <DreValor>{formatPrice(i.cmv)}</DreValor>
        <DrePercentual>{formatarPercentual(i.cmvPercentual)}</DrePercentual>
      </DreLinha>
      <DreLinha total>
        <DreLabel total>= Margem bruta</DreLabel>
        <DreValor total>{formatarMoeda(i.margemBruta)}</DreValor>
        <DrePercentual>{formatarPercentual(i.margemBrutaPercentual)}</DrePercentual>
      </DreLinha>
      <DreLinha>
        <DreLabel>(-) Despesas variáveis</DreLabel>
        <DreValor>{formatPrice(variaveis.total)}</DreValor>
        <DrePercentual />
      </DreLinha>
      {detalheVariaveis.length > 1 && <TextoSuave>{detalheVariaveis.join('  ·  ')}</TextoSuave>}
      <DreLinha total>
        <DreLabel total>= Margem de contribuição</DreLabel>
        <DreValor total>{formatarMoeda(i.margemContribuicao)}</DreValor>
        <DrePercentual>{formatarPercentual(i.margemContribuicaoPercentual)}</DrePercentual>
      </DreLinha>
      <DreLinha>
        <DreLabel>(-) Custos fixos</DreLabel>
        <DreValor>{formatPrice(i.custosFixos)}</DreValor>
        <DrePercentual />
      </DreLinha>
      <DreLinha total>
        <DreLabel total>= Resultado operacional estimado</DreLabel>
        <DreValor total cor={corResultado}>{formatarMoeda(i.resultado)}</DreValor>
        <DrePercentual>{formatarPercentual(i.margemOperacionalPercentual)}</DrePercentual>
      </DreLinha>
    </Card>
  );
}
