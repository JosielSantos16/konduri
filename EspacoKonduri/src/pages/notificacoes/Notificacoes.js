import React, { useState, useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import {
  subscribeToNotificacoes,
  marcarNotificacaoComoLida,
} from '../../services/queries/notificacoesQueries';
import { formatPrice } from '../../utils/formatPrice';
import { formatDataHoraComprovante } from '../../utils/formatDateTime';
import {
  Container,
  Header,
  BackButton,
  Title,
  List,
  NotifItem,
  NotifRow,
  NotifImagePlaceholder,
  StackedImagesContainer,
  StackedImage,
  NotifTextGroup,
  NotifTitulo,
  NotifMensagem,
  NotifValorBadge,
  NotifValorText,
  NotifHora,
  NotifChevron,
  EmptyState,
  EmptyText,
} from './notificacoesStyle';

export default function Notificacoes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    const unsubscribe = subscribeToNotificacoes(usuario, setNotificacoes);
    return unsubscribe;
  }, [usuario?.uid, usuario?.perfil]);

  const handleAbrir = (notif) => {
    if (!(notif.lidaPor || []).includes(usuario.uid)) {
      marcarNotificacaoComoLida(notif.id, usuario.uid);
    }

    if (notif.rota) {
      router.push(notif.rota);
    }
  };

  const handleRefresh = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAtualizando(false);
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#3D2C22" />
        </BackButton>
        <Title>Notificações</Title>
      </Header>

      {notificacoes.length === 0 ? (
        <EmptyState>
          <Ionicons name="notifications-outline" size={40} color="#C9BBA8" />
          <EmptyText>Nenhuma notificação ainda.</EmptyText>
        </EmptyState>
      ) : (
        <List
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={handleRefresh}
              colors={['#E67E22']}
              tintColor="#E67E22"
            />
          }
        >
          {notificacoes.map((notif) => {
            const lida = (notif.lidaPor || []).includes(usuario.uid);

            return (
              <NotifItem key={notif.id} lida={lida} tipo={notif.tipo} onPress={() => handleAbrir(notif)}>
                <NotifRow>
                  {notif.imagens && notif.imagens.length > 0 ? (
                    <StackedImagesContainer>
                      {notif.imagens.slice(0, 3).map((uri, index) => (
                        <StackedImage
                          key={index}
                          source={{ uri }}
                          resizeMode="cover"
                          style={{ left: index * 8, zIndex: notif.imagens.length - index }}
                        />
                      ))}
                    </StackedImagesContainer>
                  ) : (
                    <NotifImagePlaceholder>
                      <Ionicons name="notifications" size={20} color="#E67E22" />
                    </NotifImagePlaceholder>
                  )}

                  <NotifTextGroup>
                    <NotifTitulo>{notif.titulo}</NotifTitulo>
                    <NotifMensagem>{notif.mensagem}</NotifMensagem>

                    {notif.total != null && (
                      <NotifValorBadge>
                        <NotifValorText>{formatPrice(notif.total)}</NotifValorText>
                      </NotifValorBadge>
                    )}

                    <NotifHora>{formatDataHoraComprovante(notif.criadoEm)}</NotifHora>
                  </NotifTextGroup>

                  {notif.rota && (
                    <NotifChevron>
                      <Ionicons name="chevron-forward" size={18} color="#A99B8F" />
                    </NotifChevron>
                  )}
                </NotifRow>
              </NotifItem>
            );
          })}
        </List>
      )}
    </Container>
  );
}