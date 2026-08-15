import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useCaixa } from '../../contexts/CaixaContext';
import { listarProdutosDaOperacao } from '../../services/queries/operacoesQueries';
import {
  Container,
  ScrollContainer,
  Header,
  BackButton,
  HeaderTitles,
  HeaderTitle,
  HeaderDate,
  TotaisCard,
  TotaisHeaderRow,
  TotaisHeaderLeft,
  TotaisTitle,
  TotaisBadge,
  TotaisRow,
  TotaisLabel,
  TotaisValue,
  Card,
  CardTitle,
  InputGroup,
  Label,
  InputContainer,
  InputText,
  FinalizeButton,
  FinalizeButtonText,
  ErrorBox,
  ErrorText,
  LoadingContainer,
} from './fechamentoCaixaStyle';

// Formata número para o padrão de moeda BR (R$ 0,00)
function formatPrice(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// Formata "2026-08-14" para "14 de Agosto de 2026"
function formatDataCompleta(dataISO) {
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = meses[data.getMonth()];
  const ano = data.getFullYear();
  return `${dia} de ${mes} de ${ano}`;
}

export default function FechamentoCaixa() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { operacaoId, data } = useLocalSearchParams();
  const { usuario } = useAuth();
  const { fecharCaixa } = useCaixa();

  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const lista = await listarProdutosDaOperacao(operacaoId);
        setProdutos(lista);
      } catch (err) {
        console.error('Erro ao carregar produtos da operação:', err);
        setErro('Não foi possível carregar os dados da operação.');
      } finally {
        setCarregando(false);
      }
    }

    if (operacaoId) carregarProdutos();
  }, [operacaoId]);

  const totalEntradas = produtos.reduce((soma, p) => soma + (p.valorEntradas || 0), 0);
  const totalSaidas = produtos.reduce((soma, p) => soma + (p.valorSaidas || 0), 0);
  const balancoVolume = produtos.reduce(
    (soma, p) => soma + (p.entradaQtd || 0) - (p.saidaQtd || 0),
    0
  );

  const handleFinalizar = async () => {
    setSalvando(true);
    setErro(null);

    try {
      await fecharCaixa();
      router.replace('/abertura');
    } catch (err) {
      setErro('Não foi possível finalizar o fechamento. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <Container style={{ paddingTop: insets.top }}>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#2E5A1E" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <Header>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#2E5A1E" />
          </BackButton>
          <HeaderTitles>
            <HeaderTitle>Fechamento de Caixa</HeaderTitle>
            <HeaderDate>{data}</HeaderDate>
          </HeaderTitles>
        </Header>

        <TotaisCard>
          <TotaisHeaderRow>
            <TotaisHeaderLeft>
              <Ionicons name="calculator-outline" size={18} color="#FFFFFF" />
              <TotaisTitle>TOTAIS DO DIA</TotaisTitle>
            </TotaisHeaderLeft>
            <TotaisBadge>Consolidado</TotaisBadge>
          </TotaisHeaderRow>

          <TotaisRow>
            <TotaisLabel>Total Entradas:</TotaisLabel>
            <TotaisValue>{formatPrice(totalEntradas)}</TotaisValue>
          </TotaisRow>

          <TotaisRow>
            <TotaisLabel>Total Saídas / Vendas:</TotaisLabel>
            <TotaisValue>{formatPrice(totalSaidas)}</TotaisValue>
          </TotaisRow>

          <TotaisRow>
            <TotaisLabel>Balanço Geral de Volume:</TotaisLabel>
            <TotaisValue>
              {balancoVolume >= 0 ? '+ ' : ''}{balancoVolume} Unid/Kg
            </TotaisValue>
          </TotaisRow>
        </TotaisCard>

        <Card>
          <CardTitle>CONTROLE DE FECHAMENTO</CardTitle>

          <InputGroup>
            <Label>CONFERIDO POR</Label>
            <InputContainer>
              <InputText>{usuario?.nome || 'Carregando...'}</InputText>
              <Ionicons name="person-outline" size={18} color="#A99B8F" />
            </InputContainer>
          </InputGroup>

          <InputGroup style={{ marginBottom: 0 }}>
            <Label>DATA DA DIGITAÇÃO</Label>
            <InputContainer>
              <InputText>{formatDataCompleta()}</InputText>
              <Ionicons name="calendar-outline" size={18} color="#D35400" />
            </InputContainer>
          </InputGroup>
        </Card>

        {erro && (
          <ErrorBox>
            <ErrorText>{erro}</ErrorText>
          </ErrorBox>
        )}

        <FinalizeButton onPress={handleFinalizar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color="#FFFFFF" />
              <FinalizeButtonText>Finalizar e Salvar</FinalizeButtonText>
            </>
          )}
        </FinalizeButton>
      </ScrollContainer>
    </Container>
  );
}