import React from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { deslogarUsuario } from '../../services/queries/usuariosQueries';
import NavBarAtendente from '../../components/PDV/navBar/navBarAtendente';
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
} from './perfilStyle';

export default function Perfil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();

  const cargoExibido = usuario?.perfil === 'adm' ? 'Administrador' : 'PDV Operacional';

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
          <Avatar source={{ uri: 'https://via.placeholder.com/90' }} />
          <Nome>{usuario?.nome || 'Usuário'}</Nome>
          <Cargo>{cargoExibido}</Cargo>
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
              <InfoLabel>CADASTRADO EM</InfoLabel>
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

      <NavBarAtendente />
    </Container>
  );
}