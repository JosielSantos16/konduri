import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const router = useRouter();
  const { usuario, carregando } = useAuth();

  useEffect(() => {
    if (carregando) return;

    if (!usuario) {
      router.replace('/login');
      return;
    }

    if (usuario.perfil === 'adm') {
      router.replace('/painel');
    } else if (usuario.perfil === 'atendente') {
      router.replace('/pdv');
    } else {
      router.replace('/cliente-home');
    }
  }, [usuario, carregando]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF8F5' }}>
      <ActivityIndicator size="large" color="#2E5A1E" />
    </View>
  );
}