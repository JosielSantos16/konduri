import React from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { deslogarUsuario } from '../../services/queries/usuariosQueries';
import NavBarCliente from '../../components/cliente/navBar/NavBarCliente';
import {
  Container,
  ScrollContainer,
  Header,
  Avatar,
  Nome,
  Cargo,
  InfoCard,
  InfoRow,
  InfoRowLast,
  InfoTextGroup,
  InfoLabel,
  InfoValue,
  LogoutButton,
  LogoutButtonText,
} from './clientePerfilStyle';

export default function ClientePerfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();

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
          <Avatar>
            <Ionicons name="person" size={40} color="#E67E22" />
          </Avatar>
          <Nome>{usuario?.nome || 'Cliente'}</Nome>
          <Cargo>Cliente Espaço Konduri</Cargo>
        </Header>

        <InfoCard>
          <InfoRow>
            <Ionicons name="mail-outline" size={20} color="#8C7355" />
            <InfoTextGroup>
              <InfoLabel>E-MAIL</InfoLabel>
              <InfoValue>{usuario?.email || '—'}</InfoValue>
            </InfoTextGroup>
          </InfoRow>

          <InfoRowLast>
            <Ionicons name="calendar-outline" size={20} color="#8C7355" />
            <InfoTextGroup>
              <InfoLabel>CLIENTE DESDE</InfoLabel>
              <InfoValue>
                {usuario?.criadoEm
                  ? new Date(usuario.criadoEm).toLocaleDateString('pt-BR')
                  : '—'}
              </InfoValue>
            </InfoTextGroup>
          </InfoRowLast>
        </InfoCard>

        <LogoutButton onPress={handleSair}>
          <Ionicons name="log-out-outline" size={20} color="#C0392B" />
          <LogoutButtonText>Sair da Conta</LogoutButtonText>
        </LogoutButton>
      </ScrollContainer>

      <NavBarCliente />
    </Container>
  );
}