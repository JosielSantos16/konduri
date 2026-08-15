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

    router.replace(usuario.perfil === 'adm' ? '/painel' : '/pdv');
  }, [usuario, carregando]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF8F5' }}>
      <ActivityIndicator size="large" color="#2E5A1E" />
    </View>
  );
}