import React, { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { subscribeToDespesas, marcarPagamento } from '../../services/queries/despesasQueries';
import { subscribeToComissoesDoMes } from '../../services/queries/comissaoQueries';
import { formatPrice } from '../../utils/formatPrice';
import {
  TIPOS_DESPESA,
  ROTULOS_PERIODICIDADE,
  competenciaDe,
  deslocarCompetencia,
  formatarCompetencia,
  ocorrenciasDaCompetencia,
  resumirCompetencia,
} from '../../utils/despesas';
import {
  Container,
  Header,
  BackButton,
  HeaderTitles,
  HeaderTitle,
  HeaderSubtitle,
  MonthSelector,
  MonthArrow,
  MonthLabel,
  Lista,
  ResumoCard,
  ResumoRow,
  ResumoBloco,
  ResumoLabel,
  ResumoValor,
  ResumoExtra,
  ResumoRodape,
  ResumoRodapeTexto,
  Secao,
  SectionTitle,
  DespesaCard,
  DespesaInfo,
  DespesaDescricao,
  DespesaDetalhe,
  DespesaLado,
  DespesaValor,
  PagoChip,
  PagoChipText,
  AutomaticoChip,
  AutomaticoChipText,
  EmptyText,
  FAB,
  FABText,
} from './despesasStyle';

function formatarPercentual(valor) {
  return `${String(valor).replace('.', ',')}%`;
}

function formatarDiaMes(dataISO) {
  return `${dataISO.slice(8, 10)}/${dataISO.slice(5, 7)}`;
}

export default function Despesas() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [competencia, setCompetencia] = useState(params.competencia || competenciaDe());
  const [despesas, setDespesas] = useState([]);
  const [comissoes, setComissoes] = useState([]);

  useEffect(() => subscribeToDespesas(setDespesas), []);
  useEffect(() => subscribeToComissoesDoMes(competencia, setComissoes), [competencia]);

  const ocorrencias = useMemo(
    () => ocorrenciasDaCompetencia(despesas, competencia),
    [despesas, competencia]
  );
  const totalComissoes = comissoes.reduce((soma, c) => soma + (c.valorComissao || 0), 0);
  const resumo = resumirCompetencia(ocorrencias, totalComissoes);

  const fixas = ocorrencias.filter((o) => o.despesa.tipo === TIPOS_DESPESA.FIXO);
  const variaveis = ocorrencias.filter((o) => o.despesa.tipo === TIPOS_DESPESA.VARIAVEL);

  const abrirFormulario = (despesaId) => {
    router.push({
      pathname: '/despesa-form',
      params: despesaId ? { id: despesaId, competencia } : { competencia },
    });
  };

  const alternarPagamento = async (ocorrencia) => {
    try {
      await marcarPagamento(ocorrencia.despesa, competencia, !ocorrencia.pago);
    } catch (erro) {
      console.error('Erro ao atualizar pagamento:', erro);
      Alert.alert('Não foi possível atualizar', 'Verifique sua conexão com a internet e tente novamente.');
    }
  };

  const renderOcorrencia = (ocorrencia) => {
    const { despesa, valor, percentual, pago, vencimento } = ocorrencia;
    const detalhes = [despesa.categoria, ROTULOS_PERIODICIDADE[despesa.periodicidade]];
    if (vencimento) detalhes.push(`vence ${formatarDiaMes(vencimento)}`);

    return (
      <DespesaCard key={despesa.id} activeOpacity={0.8} onPress={() => abrirFormulario(despesa.id)}>
        <DespesaInfo>
          <DespesaDescricao numberOfLines={1}>{despesa.descricao}</DespesaDescricao>
          <DespesaDetalhe>{detalhes.join(' · ')}</DespesaDetalhe>
        </DespesaInfo>
        <DespesaLado>
          <DespesaValor>
            {percentual !== null ? `${formatarPercentual(percentual)} das vendas` : formatPrice(valor)}
          </DespesaValor>
          {percentual === null && (
            <PagoChip pago={pago} onPress={() => alternarPagamento(ocorrencia)}>
              <Ionicons
                name={pago ? 'checkmark-circle' : 'time-outline'}
                size={13}
                color={pago ? '#2E5A1E' : '#D35400'}
              />
              <PagoChipText pago={pago}>{pago ? 'Pago' : 'Em aberto'}</PagoChipText>
            </PagoChip>
          )}
        </DespesaLado>
      </DespesaCard>
    );
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#3D2C22" />
        </BackButton>
        <HeaderTitles>
          <HeaderTitle>Custos e Despesas</HeaderTitle>
          <HeaderSubtitle>Despesas operacionais (não inclui compra de mercadoria)</HeaderSubtitle>
        </HeaderTitles>
      </Header>

      <MonthSelector>
        <MonthArrow onPress={() => setCompetencia(deslocarCompetencia(competencia, -1))}>
          <Ionicons name="chevron-back" size={20} color="#3D2C22" />
        </MonthArrow>
        <MonthLabel>{formatarCompetencia(competencia)}</MonthLabel>
        <MonthArrow onPress={() => setCompetencia(deslocarCompetencia(competencia, 1))}>
          <Ionicons name="chevron-forward" size={20} color="#3D2C22" />
        </MonthArrow>
      </MonthSelector>

      <Lista showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <ResumoCard>
          <ResumoRow>
            <ResumoBloco>
              <ResumoLabel>CUSTOS FIXOS</ResumoLabel>
              <ResumoValor>{formatPrice(resumo.fixos)}</ResumoValor>
            </ResumoBloco>
            <ResumoBloco>
              <ResumoLabel>CUSTOS VARIÁVEIS</ResumoLabel>
              <ResumoValor>{formatPrice(resumo.variaveisValor)}</ResumoValor>
              {resumo.variaveisPercentual > 0 && (
                <ResumoExtra>+ {formatarPercentual(resumo.variaveisPercentual)} das vendas</ResumoExtra>
              )}
            </ResumoBloco>
          </ResumoRow>
          {resumo.emAberto > 0 && (
            <ResumoRodape>
              <Ionicons name="time-outline" size={15} color="#8C5A2E" />
              <ResumoRodapeTexto>Em aberto neste mês: {formatPrice(resumo.emAberto)}</ResumoRodapeTexto>
            </ResumoRodape>
          )}
        </ResumoCard>

        <Secao>
          <SectionTitle>CUSTOS FIXOS ({fixas.length})</SectionTitle>
          {fixas.length === 0 && <EmptyText>Nenhum custo fixo neste mês.</EmptyText>}
          {fixas.map(renderOcorrencia)}
        </Secao>

        <Secao>
          <SectionTitle>CUSTOS VARIÁVEIS ({variaveis.length + (totalComissoes > 0 ? 1 : 0)})</SectionTitle>
          {variaveis.length === 0 && totalComissoes === 0 && (
            <EmptyText>Nenhum custo variável neste mês.</EmptyText>
          )}
          {variaveis.map(renderOcorrencia)}

          {totalComissoes > 0 && (
            <DespesaCard disabled activeOpacity={1}>
              <DespesaInfo>
                <DespesaDescricao>Comissões de atendentes</DespesaDescricao>
                <DespesaDetalhe>
                  Pessoal · {comissoes.length} {comissoes.length === 1 ? 'lançamento' : 'lançamentos'} no mês
                </DespesaDetalhe>
              </DespesaInfo>
              <DespesaLado>
                <DespesaValor>{formatPrice(resumo.comissoes)}</DespesaValor>
                <AutomaticoChip>
                  <AutomaticoChipText>Automático</AutomaticoChipText>
                </AutomaticoChip>
              </DespesaLado>
            </DespesaCard>
          )}
        </Secao>
      </Lista>

      <FAB style={{ bottom: 24 + insets.bottom }} onPress={() => abrirFormulario(null)} activeOpacity={0.8}>
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <FABText>Nova despesa</FABText>
      </FAB>
    </Container>
  );
}
