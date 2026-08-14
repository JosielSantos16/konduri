import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDataExtenso, formatDataHoraComprovante } from '../../utils/formatDateTime';
import { useCaixa } from '../../contexts/CaixaContext';
import Calendario from '../../components/painel/calendario/Calendario';
import {
  Container,
  ScrollContainer,
  Header,
  LogoRow,
  LogoCircle,
  BrandTitle,
  NotificationButton,
  MainTitle,
  Subtitle,
  Card,
  CardHeaderRow,
  CardSectionTitle,
  InputGroup,
  Label,
  InputContainer,
  InputText,
  StyledTextInput,
  AlertBox,
  AlertText,
  StartButton,
  StartButtonText,
} from './aberturaStyles';
import NavBar from '../../components/painel/navBar/NavBar';

export default function AberturaCaixa() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    dataOperacao,
    setDataOperacao,
    responsavel,
    setResponsavel,
    local,
    setLocal,
    ultimoFechamento,
    abrirCaixa,
  } = useCaixa();

  const podeIniciar = responsavel.trim().length > 0 && local.trim().length > 0;

  const handleStartOperation = () => {
    if (!podeIniciar) return;
    abrirCaixa();
    router.push('/pdv'); // troque pra rota da nova tela quando ela existir
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Header>
          <LogoRow>
            <LogoCircle>
              <Ionicons name="leaf" size={18} color="#FFFFFF" />
            </LogoCircle>
            <BrandTitle>Espaço Konduri</BrandTitle>
          </LogoRow>

          <NotificationButton onPress={() => alert('Notificações do sistema')}>
            <Ionicons name="notifications-outline" size={18} color="#3D2C22" />
          </NotificationButton>
        </Header>

        <MainTitle>Abertura de Caixa & Estoque</MainTitle>
        <Subtitle>
          Registre a identificação do dia para iniciar o controle e fluxo de produtos no Espaço Konduri.
        </Subtitle>

        <Card>
          <CardHeaderRow>
            <Ionicons name="options-outline" size={18} color="#3D2C22" />
            <CardSectionTitle>DADOS DA OPERAÇÃO</CardSectionTitle>
          </CardHeaderRow>

          <InputGroup>
            <Label>DATA</Label>
            <Calendario
              value={dataOperacao}
              onChange={setDataOperacao}
              renderTrigger={({ onPress }) => (
                <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                  <InputContainer pointerEvents="none">
                    <InputText>{formatDataExtenso(dataOperacao)}</InputText>
                    <Ionicons name="calendar-outline" size={18} color="#D35400" />
                  </InputContainer>
                </TouchableOpacity>
              )}
            />
          </InputGroup>

          <InputGroup>
            <Label>RESPONSÁVEL</Label>
            <InputContainer>
              <StyledTextInput
                placeholder="Nome do operador de caixa"
                placeholderTextColor="#A99B8F"
                value={responsavel}
                onChangeText={setResponsavel}
              />
              <Ionicons name="person-outline" size={18} color="#A99B8F" />
            </InputContainer>
          </InputGroup>

          <InputGroup style={{ marginBottom: 0 }}>
            <Label>LOCAL / COMUNIDADE</Label>
            <InputContainer>
              <StyledTextInput
                placeholder="Nome do local ou comunidade"
                placeholderTextColor="#A99B8F"
                value={local}
                onChangeText={setLocal}
              />
              <Ionicons name="location-outline" size={18} color="#A99B8F" />
            </InputContainer>
          </InputGroup>
        </Card>

        {ultimoFechamento && (
          <AlertBox>
            <Ionicons name="information-circle-outline" size={20} color="#8C5A2E" />
            <AlertText>
              Os dados de {formatDataHoraComprovante(ultimoFechamento)} foram consolidados com sucesso.
            </AlertText>
          </AlertBox>
        )}

        <StartButton
          disabled={!podeIniciar}
          style={{ opacity: podeIniciar ? 1 : 0.5 }}
          onPress={handleStartOperation}
        >
          <StartButtonText>Iniciar Operação</StartButtonText>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </StartButton>
      </ScrollContainer>

      <NavBar />
    </Container>
  );
}