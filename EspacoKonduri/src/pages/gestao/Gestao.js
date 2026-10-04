import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBar from '../../components/painel/navBar/NavBar';
import Calendario from '../../components/painel/calendario/Calendario';
import PontoEquilibrioCard from '../../components/gestao/pontoEquilibrio/PontoEquilibrioCard';
import { useGestaoFinanceira } from '../../hooks/useGestaoFinanceira';
import { PERIODOS, intervaloDoPeriodo } from '../../utils/financeiro';
import { formatarCompetencia } from '../../utils/despesas';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { formatPrice } from '../../utils/formatPrice';
import { formatarMoeda, formatarPercentual } from '../../utils/formatFinanceiro';
import { METODOS_PAGAMENTO } from '../../utils/metodosPagamento';
import {
  Container,
  ScrollContainer,
  Header,
  Title,
  Subtitle,
  PeriodoChips,
  PeriodoChip,
  PeriodoChipText,
  PeriodoLabel,
  PersonalizadoRow,
  DataBotao,
  DataBotaoTexto,
  DataSeparador,
  Conteudo,
  AvisoBox,
  AvisoTexto,
  FaturamentoCard,
  CardHeader,
  CardTitle,
  FaturamentoValor,
  FaturamentoDetalhe,
  CardsRow,
  IndicadorCard,
  IndicadorValor,
  IndicadorDetalhe,
  ResultadoCard,
  ResultadoValor,
  LinhaDetalhe,
  LinhaDetalheLabel,
  LinhaDetalheValor,
  LinkLinha,
  LinkTexto,
  LoadingBox,
} from './gestaoStyle';

const OPCOES_PERIODO = [
  { key: PERIODOS.HOJE, label: 'Hoje' },
  { key: PERIODOS.SETE_DIAS, label: '7 dias' },
  { key: PERIODOS.MES_ATUAL, label: 'Mês atual' },
  { key: PERIODOS.MES_ANTERIOR, label: 'Mês anterior' },
  { key: PERIODOS.PERSONALIZADO, label: 'Personalizado' },
];

function formatarDataCurta(dataISO) {
  return `${dataISO.slice(8, 10)}/${dataISO.slice(5, 7)}/${dataISO.slice(0, 4)}`;
}

function descreverIntervalo(periodo, { inicio, fim }) {
  if (periodo === PERIODOS.MES_ATUAL || periodo === PERIODOS.MES_ANTERIOR) {
    return formatarCompetencia(inicio.slice(0, 7));
  }
  if (inicio === fim) return formatarDataCurta(inicio);
  return `${formatarDataCurta(inicio)} a ${formatarDataCurta(fim)}`;
}

// Explica de onde vêm os custos fixos do período, para o resultado negativo
// do começo do mês não assustar
function notaCustosFixos(periodo, dias) {
  if (periodo === PERIODOS.MES_ATUAL) {
    return 'Os custos fixos já contam o mês inteiro desde o dia 1. Por isso, no começo do mês, o resultado aparece negativo e vai melhorando a cada venda: ele fica positivo quando o faturamento passa do ponto de equilíbrio.';
  }
  if (periodo === PERIODOS.MES_ANTERIOR) {
    return 'Mês fechado: custos fixos e meta do mês inteiro.';
  }
  const quantosDias = dias === 1 ? '1 dia' : `${dias} dias`;
  return `Custos fixos e meta proporcionais a ${quantosDias} (ex.: aluguel ÷ dias do mês × ${quantosDias}).`;
}

export default function Gestao() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [periodo, setPeriodo] = useState(PERIODOS.MES_ATUAL);
  const [inicioPersonalizado, setInicioPersonalizado] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [fimPersonalizado, setFimPersonalizado] = useState(() => new Date());

  const intervalo =
    periodo === PERIODOS.PERSONALIZADO
      ? {
          // Se o usuário inverter as datas, usa a menor como início
          inicio: paraDataISOLocal(inicioPersonalizado <= fimPersonalizado ? inicioPersonalizado : fimPersonalizado),
          fim: paraDataISOLocal(inicioPersonalizado <= fimPersonalizado ? fimPersonalizado : inicioPersonalizado),
        }
      : intervaloDoPeriodo(periodo);

  const { indicadores, carregando } = useGestaoFinanceira(intervalo);

  const renderSeletorData = (valor, onChange) => (
    <Calendario
      value={valor}
      onChange={onChange}
      renderTrigger={({ onPress }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flex: 1 }}>
          <DataBotao pointerEvents="none">
            <DataBotaoTexto>{formatarDataCurta(paraDataISOLocal(valor))}</DataBotaoTexto>
            <Ionicons name="calendar-outline" size={16} color="#D35400" />
          </DataBotao>
        </TouchableOpacity>
      )}
    />
  );

  const renderIndicadores = () => {
    const i = indicadores;
    const detalheMetodos = Object.entries(METODOS_PAGAMENTO)
      .filter(([metodo]) => i.porMetodo[metodo])
      .map(([metodo, info]) => `${info.label}: ${formatPrice(i.porMetodo[metodo])}`)
      .join('  |  ');

    return (
      <>
        {!i.cobertura.completa && (
          <AvisoBox>
            <Ionicons name="warning-outline" size={18} color="#8C5A2E" />
            <AvisoTexto>
              {i.cobertura.vendasSemCusto} {i.cobertura.vendasSemCusto === 1 ? 'venda tem' : 'vendas têm'} itens
              sem custo registrado ({formatPrice(i.cobertura.faturamentoSemCusto)}). Esses itens ficam fora do
              CMV, então o CMV aparece menor e as margens maiores do que realmente são.
            </AvisoTexto>
          </AvisoBox>
        )}

        <FaturamentoCard>
          <CardHeader>
            <Ionicons name="wallet-outline" size={18} color="#FFFFFF" />
            <CardTitle cor="#FFFFFF">FATURAMENTO DO PERÍODO</CardTitle>
          </CardHeader>
          <FaturamentoValor>{formatPrice(i.faturamento)}</FaturamentoValor>
          {!!detalheMetodos && <FaturamentoDetalhe>{detalheMetodos}</FaturamentoDetalhe>}
          <FaturamentoDetalhe>
            {i.quantidadeVendas} {i.quantidadeVendas === 1 ? 'venda' : 'vendas'}
            {i.ticketMedio !== null ? `  ·  ticket médio ${formatPrice(i.ticketMedio)}` : ''}
          </FaturamentoDetalhe>
        </FaturamentoCard>

        <CardsRow>
          <IndicadorCard bg="#EAF2FB">
            <CardHeader>
              <Ionicons name="cube-outline" size={16} color="#1A73C0" />
              <CardTitle cor="#1A73C0">CMV</CardTitle>
            </CardHeader>
            <IndicadorValor numberOfLines={1} adjustsFontSizeToFit>{formatPrice(i.cmv)}</IndicadorValor>
            <IndicadorDetalhe>{formatarPercentual(i.cmvPercentual)} do faturamento</IndicadorDetalhe>
          </IndicadorCard>

          <IndicadorCard bg="#E6F4EA">
            <CardHeader>
              <Ionicons name="trending-up-outline" size={16} color="#2E5A1E" />
              <CardTitle cor="#2E5A1E">MARGEM BRUTA</CardTitle>
            </CardHeader>
            <IndicadorValor cor="#2E5A1E" numberOfLines={1} adjustsFontSizeToFit>
              {formatarMoeda(i.margemBruta)}
            </IndicadorValor>
            <IndicadorDetalhe cor="#2E5A1E">{formatarPercentual(i.margemBrutaPercentual)}</IndicadorDetalhe>
          </IndicadorCard>
        </CardsRow>

        <ResultadoCard>
          <CardHeader>
            <Ionicons name="analytics-outline" size={18} color="#8C7355" />
            <CardTitle>RESULTADO DO PERÍODO</CardTitle>
          </CardHeader>
          <ResultadoValor cor={i.resultado >= 0 ? '#2E5A1E' : '#C0392B'}>{formatarMoeda(i.resultado)}</ResultadoValor>
          <IndicadorDetalhe>
            Margem líquida estimada: {formatarPercentual(i.margemOperacionalPercentual)}
          </IndicadorDetalhe>

          <LinhaDetalhe>
            <LinhaDetalheLabel>Margem de contribuição</LinhaDetalheLabel>
            <LinhaDetalheValor>{formatarMoeda(i.margemContribuicao)}</LinhaDetalheValor>
          </LinhaDetalhe>
          <LinhaDetalhe>
            <LinhaDetalheLabel>(-) Custos fixos</LinhaDetalheLabel>
            <LinhaDetalheValor>{formatPrice(i.custosFixos)}</LinhaDetalheValor>
          </LinhaDetalhe>
        </ResultadoCard>

        <AvisoBox bg="#F4F1EC" borda="#E6DFD5">
          <Ionicons name="information-circle-outline" size={18} color="#8C7355" />
          <AvisoTexto cor="#5C4033">{notaCustosFixos(periodo, i.periodo.dias)}</AvisoTexto>
        </AvisoBox>

        <PontoEquilibrioCard
          pontoEquilibrio={i.pontoEquilibrio}
          faturamento={i.faturamento}
          custosFixos={i.custosFixos}
        />

        <LinkLinha activeOpacity={0.8} onPress={() => router.push('/despesas')}>
          <Ionicons name="wallet-outline" size={20} color="#D35400" />
          <LinkTexto>Custos e Despesas</LinkTexto>
          <Ionicons name="chevron-forward" size={20} color="#A99B8F" />
        </LinkLinha>
      </>
    );
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Header>
          <Title>Gestão Financeira</Title>
          <Subtitle>Indicadores de rentabilidade e desempenho</Subtitle>
        </Header>

        <PeriodoChips horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 28 }}>
          {OPCOES_PERIODO.map((opcao) => (
            <PeriodoChip key={opcao.key} selected={periodo === opcao.key} onPress={() => setPeriodo(opcao.key)}>
              <PeriodoChipText selected={periodo === opcao.key}>{opcao.label}</PeriodoChipText>
            </PeriodoChip>
          ))}
        </PeriodoChips>

        {periodo === PERIODOS.PERSONALIZADO ? (
          <PersonalizadoRow>
            {renderSeletorData(inicioPersonalizado, setInicioPersonalizado)}
            <DataSeparador>até</DataSeparador>
            {renderSeletorData(fimPersonalizado, setFimPersonalizado)}
          </PersonalizadoRow>
        ) : (
          <PeriodoLabel>{descreverIntervalo(periodo, intervalo)}</PeriodoLabel>
        )}

        <Conteudo>
          {carregando || !indicadores ? (
            <LoadingBox>
              <ActivityIndicator size="large" color="#E67E22" />
            </LoadingBox>
          ) : (
            renderIndicadores()
          )}
        </Conteudo>
      </ScrollContainer>

      <NavBar />
    </Container>
  );
}
