import React from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { deslogarUsuario } from '../../../services/queries/usuariosQueries';
import {
  Header,
  UserInfo,
  UserName,
  UserRole,
  HeaderRight,
  StatusBadge,
  StatusDot,
  StatusText,
  UserAvatar,
  LogoutButton,
  AvatarRow,
} from './pdvHeaderStyle';

export default function PdvHeader({ name, role, statusLabel, aberto, avatarUri }) {
  const router = useRouter();

  const handleSair = () => {
    Alert.alert(
      'Sair da conta',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await deslogarUsuario();
            router.replace('/login');
          },
        },
      ]
    );
  };

  return (
    <Header>
      <UserInfo>
        <UserName>{name}</UserName>
        <UserRole>{role}</UserRole>
      </UserInfo>
      <HeaderRight>
        <StatusBadge aberto={aberto}>
          <StatusDot aberto={aberto} />
          <StatusText aberto={aberto}>{statusLabel}</StatusText>
        </StatusBadge>
        <AvatarRow>
          <UserAvatar source={{ uri: avatarUri }} />
          <LogoutButton onPress={handleSair}>
            <Ionicons name="log-out-outline" size={24} color="#C0392B" />
          </LogoutButton>
        </AvatarRow>
      </HeaderRight>
    </Header>
  );
}