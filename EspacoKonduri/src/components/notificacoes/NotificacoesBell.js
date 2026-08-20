import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToNotificacoes } from '../../services/queries/notificacoesQueries';
import { BellButton, Badge, BadgeText } from './notificacoesBellStyle';

export default function NotificacoesBell() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    if (!usuario) return;
    const unsubscribe = subscribeToNotificacoes(usuario, setNotificacoes);
    return unsubscribe;
  }, [usuario?.uid, usuario?.perfil]);

  const naoLidas = notificacoes.filter((n) => !(n.lidaPor || []).includes(usuario?.uid));

  return (
    <BellButton onPress={() => router.push('/notificacoes')}>
      <Ionicons name="notifications-outline" size={20} color="#3D2C22" />
      {naoLidas.length > 0 && (
        <Badge>
          <BadgeText>{naoLidas.length > 9 ? '9+' : naoLidas.length}</BadgeText>
        </Badge>
      )}
    </BellButton>
  );
}