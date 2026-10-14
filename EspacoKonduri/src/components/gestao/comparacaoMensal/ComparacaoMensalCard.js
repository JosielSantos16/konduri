import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useComparacaoMensal } from '../../../hooks/useComparacaoMensal';
import { formatarMoeda, formatarPercentual } from '../../../utils/formatFinanceiro';
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

function diaDe(dataISO) {
  return Number(dataISO.slice(8, 10));
}

// Texto do recorte usado com o mês em andamento: "1 a 10" quando os dois lados
// têm os mesmos dias; senão, cada lado com o seu (ex.: 31/03 x 28/02)
function descreverRecorte(intervaloAtual, intervaloAnterior) {
  const diaAtual = diaDe(intervaloAtual.fim);
  const diaAnterior = diaDe(intervaloAnterior.fim);
  if (diaAtual === diaAnterior) {
    return diaAtual === 1 ? 'o dia 1 dos dois meses' : `os dias 1 a ${diaAtual} dos dois meses`;
  }
  return `os dias 1 a ${diaAtual} de ${mesLongo(intervaloAtual.inicio.slice(0, 7)).toLowerCase()} e o mês inteiro de ${mesLongo(intervaloAnterior.inicio.slice(0, 7)).toLowerCase()} (1 a ${diaAnterior})`;
}

// CMV subir junto com as vendas é esperado, então ele não ganha cor de bom/ruim
function corVariacao(linha) {
  if (linha.variacao === null || linha.variacao === 0 || linha.chave === 'cmv') return '#333333';
  return linha.variacao > 0 ? '#2E5A1E' : '#C0392B';
}

export default function ComparacaoMensalCard({ competencia }) {
  const { competenciaAnterior, emAndamento, intervaloAtual, intervaloAnterior, linhas, carregando } =
    useComparacaoMensal(competencia);

  return (
    <Card>
      <CardHeader>
        <Ionicons name="git-compare-outline" size={18} color="#6B6B6B" />
        <CardTitulo>
          {mesLongo(competencia).toUpperCase()} x {mesLongo(competenciaAnterior).toUpperCase()}
        </CardTitulo>
      </CardHeader>

      {carregando || !linhas ? (
        <ActivityIndicator color="#8A6A00" style={{ marginVertical: 16 }} />
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

          {emAndamento && (
            <TextoSuave style={{ marginTop: 8 }}>
              {mesLongo(competencia)} ainda está em andamento, então a comparação usa{' '}
              {descreverRecorte(intervaloAtual, intervaloAnterior)}. Os custos fixos entram proporcionais a
              esses dias nos dois lados (ex.: aluguel ÷ dias do mês × dias do recorte), para o resultado
              também ser comparável.
            </TextoSuave>
          )}
        </>
      )}
    </Card>
  );
}
