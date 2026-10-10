import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useComparacaoMensal } from '../../../hooks/useComparacaoMensal';
import { formatarMoeda, formatarPercentual } from '../../../utils/formatFinanceiro';
import { competenciaDe } from '../../../utils/despesas';
import {
  Card,
  CardHeader,
  CardTitulo,
  TextoSuave,
  TabelaCabecalho,
  TabelaLinha,
  ColunaIndicador,
  ColunaValor,
} from '../gestaoCardsStyle';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function mesCurto(competencia) {
  return MESES[Number(competencia.slice(5, 7)) - 1];
}

function mesLongo(competencia) {
  return NOMES_MESES[Number(competencia.slice(5, 7)) - 1];
}

function formatarValor(linha, valor) {
  return linha.tipo === 'percentual' ? formatarPercentual(valor) : formatarMoeda(valor);
}

function formatarVariacao(linha) {
  if (linha.variacao === null) return '—';
  const sinal = linha.variacao > 0 ? '+' : '';
  const numero = linha.variacao.toFixed(1).replace('.', ',');
  return linha.tipo === 'percentual' ? `${sinal}${numero} p.p.` : `${sinal}${numero}%`;
}

// CMV subir junto com as vendas é esperado, então ele não ganha cor de bom/ruim
function corVariacao(linha) {
  if (linha.variacao === null || linha.variacao === 0 || linha.chave === 'cmv') return '#5C4033';
  return linha.variacao > 0 ? '#2E5A1E' : '#C0392B';
}

export default function ComparacaoMensalCard({ competencia }) {
  const { competenciaAnterior, linhas, carregando } = useComparacaoMensal(competencia);
  const mesEmAndamento = competencia === competenciaDe();

  return (
    <Card>
      <CardHeader>
        <Ionicons name="git-compare-outline" size={18} color="#8C7355" />
        <CardTitulo>
          {mesLongo(competencia).toUpperCase()} x {mesLongo(competenciaAnterior).toUpperCase()}
        </CardTitulo>
      </CardHeader>

      {carregando || !linhas ? (
        <ActivityIndicator color="#E67E22" style={{ marginVertical: 16 }} />
      ) : (
        <>
          <TabelaCabecalho>
            <ColunaIndicador cabecalho>INDICADOR</ColunaIndicador>
            <ColunaValor cabecalho>{mesCurto(competenciaAnterior).toUpperCase()}</ColunaValor>
            <ColunaValor cabecalho>{mesCurto(competencia).toUpperCase()}</ColunaValor>
            <ColunaValor cabecalho>VARIAÇÃO</ColunaValor>
          </TabelaCabecalho>

          {linhas.map((linha, indice) => (
            <TabelaLinha key={linha.chave} primeira={indice === 0}>
              <ColunaIndicador>{linha.label}</ColunaIndicador>
              <ColunaValor numberOfLines={1} adjustsFontSizeToFit>{formatarValor(linha, linha.anterior)}</ColunaValor>
              <ColunaValor numberOfLines={1} adjustsFontSizeToFit>{formatarValor(linha, linha.atual)}</ColunaValor>
              <ColunaValor cor={corVariacao(linha)}>{formatarVariacao(linha)}</ColunaValor>
            </TabelaLinha>
          ))}

          {mesEmAndamento && (
            <TextoSuave style={{ marginTop: 8 }}>
              {mesLongo(competencia)} ainda está em andamento: o faturamento é até hoje, mas os custos
              fixos já contam o mês inteiro.
            </TextoSuave>
          )}
        </>
      )}
    </Card>
  );
}
