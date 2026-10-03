import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { auth } from '../../firebase/fireBaseCondig';
import { useAuth } from '../../hooks/useAuth';
import { ehAdmin } from '../../utils/permissoes';
import { getRotaPosLogin } from '../../utils/rotaPosLogin';

// Envolve as telas exclusivas do admin. Quem não é admin (ex.: atendente que
// chegou por link direto) é mandado para a tela inicial do próprio perfil.
export default function RotaAdmin({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF8F5' }}>
        <ActivityIndicator size="large" color="#2E5A1E" />
      </View>
    );
  }

  if (!usuario) return <Redirect href="/login" />;
  if (!ehAdmin(usuario)) return <Redirect href={getRotaPosLogin(usuario, auth.currentUser)} />;

  return children;
}
