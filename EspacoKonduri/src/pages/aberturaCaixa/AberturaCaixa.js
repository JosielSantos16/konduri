import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function AberturaCaixa() {
  const router = useRouter();
  const [responsavel, setResponsavel] = useState('');

  const handleStartOperation = () => {
    router.push('/pdv');
  };

  return (
    <Container>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <Header>
          <LogoRow>
            <LogoCircle>
              <Ionicons name="leaf" size={18} color="#FFFFFF" />
            </LogoCircle>
            <BrandTitle>Espaço Konduri</BrandTitle>
          </LogoRow>

          <NotificationButton onPress={() => alert('Notificações do sistema')}>
            <Ionicons name="notifications-outline" size={18} color="#0A3A2A" />
          </NotificationButton>
        </Header>

        <MainTitle>Abertura de Caixa & Estoque</MainTitle>
        <Subtitle>
          Registre a identificação do dia para iniciar o controle e fluxo de produtos no Espaço Konduri.
        </Subtitle>

        <Card>
          <CardHeaderRow>
            <Ionicons name="options-outline" size={18} color="#0A3A2A" />
            <CardSectionTitle>DADOS DA OPERAÇÃO</CardSectionTitle>
          </CardHeaderRow>

          <InputGroup>
            <Label>DATA</Label>
            <InputContainer>
              <InputText>12 de Outubro de 2024</InputText>
              <Ionicons name="calendar-outline" size={18} color="#C0392B" />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label>RESPONSÁVEL</Label>
            <InputContainer>
              <StyledTextInput
                placeholder="Nome do operador de caixa"
                placeholderTextColor="#95A5A6"
                value={responsavel}
                onChangeText={setResponsavel}
              />
              <Ionicons name="person-outline" size={18} color="#95A5A6" />
            </InputContainer>
          </InputGroup>

          <InputGroup style={{ marginBottom: 0 }}>
            <Label>LOCAL / COMUNIDADE</Label>
            <InputContainer>
              <InputText>Sede Central - Espaço Konduri</InputText>
              <Ionicons name="chevron-down" size={16} color="#6B7C73" />
            </InputContainer>
          </InputGroup>
        </Card>

        <AlertBox>
          <Ionicons name="information-circle-outline" size={20} color="#C0392B" />
          <AlertText>
            Os dados de ontem foram consolidados com sucesso.
          </AlertText>
        </AlertBox>

        <StartButton onPress={handleStartOperation}>
          <StartButtonText>Iniciar Operação</StartButtonText>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </StartButton>
      </ScrollContainer>
    </Container>
  );
}