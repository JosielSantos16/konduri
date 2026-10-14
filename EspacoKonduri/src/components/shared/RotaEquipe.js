import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { auth } from '../../firebase/fireBaseCondig';
import { useAuth } from '../../hooks/useAuth';
import { getRotaPosLogin } from '../../utils/rotaPosLogin';

const PERFIS_EQUIPE = ['adm', 'atendente'];

// Telas da equipe (admin e atendente), como a portaria. Cliente que chegar
// por link direto volta para a tela inicial dele.
export default function RotaEquipe({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAF7' }}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    );
  }

  if (!usuario) return <Redirect href="/login" />;
  if (!PERFIS_EQUIPE.includes(usuario.perfil)) return <Redirect href={getRotaPosLogin(usuario, auth.currentUser)} />;

  return children;
}
