import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToVendasPorData } from '../../services/queries/vendasQueries';
import { deslogarUsuario } from '../../services/queries/usuariosQueries';
import { subscribeToComissao } from '../../services/queries/comissaoQueries';
import { formatPrice } from '../../utils/formatPrice';
import { formatDataFiltro, isMesmoDia } from '../../utils/formatDateTime';
import Calendario from '../../components/painel/calendario/Calendario';
import NavBarAtendente from '../../components/PDV/navBar/navBarAtendente';
import {
  Container,
  ScrollContainer,
  Header,
  BackButton,
  HeaderTitles,
  HeaderTitle,
  HeaderSubtitle,
  TotalCard,
  TotalCardHeader,
  TotalLabel,
  TotalValue,
  StatsRow,
  StatCard,
  StatLabel,
  StatValue,
  EmptyState,
  EmptyStateText,
  CommissionCard,
  CommissionTitle,
  CommissionSubtitle,
  DateSelectorButton,
  DateSelectorText,
  StatusBox,
  StatusText,
  CommissionResultBox,
  CommissionResultLabel,
  CommissionResultValue,
  LogoutButton,
  LogoutButtonText,
} from './resumoDiaStyle';

import { paraDataISOLocal } from "../../utils/dataLocal";

function paraDataISO(data) {
  return paraDataISOLocal(data);
}

export default function ResumoDia() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();

  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [comissao, setComissao] = useState(null);
  const [carregandoComissao, setCarregandoComissao] = useState(true);

  const dataISO = paraDataISO(dataSelecionada);

  useEffect(() => {
    if (!usuario?.uid) return;

    setCarregandoComissao(true);
    const unsubscribe = subscribeToComissao(dataISO, usuario.uid, (dados) => {
      setComissao(dados);
      setCarregandoComissao(false);
    });

    return unsubscribe;
  }, [dataISO, usuario?.uid]);

const [vendasDoDia, setVendasDoDia] = useState([]);

useEffect(() => {
  const unsubscribe = subscribeToVendasPorData(dataISO, (lista) => {
    setVendasDoDia(lista);
  });
  return unsubscribe;
}, [dataISO]);

const minhasVendas = vendasDoDia.filter((v) => v.responsavelUid === usuario?.uid);


  const totalDia = minhasVendas.reduce((soma, v) => soma + v.total, 0);
  const totalPix = minhasVendas.filter((v) => v.metodo === 'pix').reduce((s, v) => s + v.total, 0);
  const totalDinheiro = minhasVendas.filter((v) => v.metodo === 'dinheiro').reduce((s, v) => s + v.total, 0);
  const qtdVendas = minhasVendas.length;

  const primeiroNome = usuario?.nome ? usuario.nome.split(' ')[0] : 'Atendente';

  const handleSair = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await deslogarUsuario();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <Header>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#2E5A1E" />
          </BackButton>
          <HeaderTitles>
            <HeaderTitle>Meu Resumo</HeaderTitle>
            <HeaderSubtitle>{primeiroNome}</HeaderSubtitle>
          </HeaderTitles>
        </Header>

        <Calendario
          value={dataSelecionada}
          onChange={setDataSelecionada}
          renderTrigger={({ onPress }) => (
            <DateSelectorButton onPress={onPress}>
              <Ionicons name="calendar-outline" size={16} color="#3D2C22" />
              <DateSelectorText>{formatDataFiltro(dataSelecionada)}</DateSelectorText>
              <Ionicons name="chevron-down" size={14} color="#3D2C22" />
            </DateSelectorButton>
          )}
        />

        <TotalCard>
          <TotalCardHeader>
            <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
            <TotalLabel>TOTAL VENDIDO NESSE DIA</TotalLabel>
          </TotalCardHeader>
          <TotalValue>{formatPrice(totalDia)}</TotalValue>
        </TotalCard>

        <StatsRow>
          <StatCard bg="#E8F8F5">
            <StatLabel color="#16A085">PIX</StatLabel>
            <StatValue valueColor="#16A085">{formatPrice(totalPix)}</StatValue>
          </StatCard>
          <StatCard bg="#E9F7EF">
            <StatLabel color="#27AE60">DINHEIRO</StatLabel>
            <StatValue valueColor="#27AE60">{formatPrice(totalDinheiro)}</StatValue>
          </StatCard>
          <StatCard>
            <StatLabel>VENDAS</StatLabel>
            <StatValue>{qtdVendas}</StatValue>
          </StatCard>
        </StatsRow>

        {qtdVendas === 0 && (
          <EmptyState>
            <Ionicons name="receipt-outline" size={32} color="#C9BBA8" />
            <EmptyStateText>Nenhuma venda registrada nesse dia.</EmptyStateText>
          </EmptyState>
        )}

        <CommissionCard>
          <CommissionTitle>Minha Comissão</CommissionTitle>
          <CommissionSubtitle>
            Definida pelo administrador, com base apenas nas vendas de produtos
          </CommissionSubtitle>

          {carregandoComissao ? (
            <StatusBox definida={false}>
              <Ionicons name="time-outline" size={18} color="#8C7355" />
              <StatusText definida={false}>Carregando...</StatusText>
            </StatusBox>
          ) : comissao ? (
            <CommissionResultBox>
              <CommissionResultLabel>
                COMISSÃO ({comissao.percentual}% SOBRE {formatPrice(comissao.baseCalculo)})
              </CommissionResultLabel>
              <CommissionResultValue>{formatPrice(comissao.valorComissao)}</CommissionResultValue>
            </CommissionResultBox>
          ) : (
            <StatusBox definida={false}>
              <Ionicons name="information-circle-outline" size={18} color="#8C7355" />
              <StatusText definida={false}>
                O administrador ainda não definiu a comissão desse dia.
              </StatusText>
            </StatusBox>
          )}
        </CommissionCard>

        <LogoutButton onPress={handleSair}>
          <Ionicons name="log-out-outline" size={20} color="#C0392B" />
          <LogoutButtonText>Sair da Conta</LogoutButtonText>
        </LogoutButton>
      </ScrollContainer>

      <NavBarAtendente />
    </Container>
  );
}