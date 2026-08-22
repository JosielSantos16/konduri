import React, { useState, useEffect } from "react";
import { RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import {
  subscribeToNotificacoes,
  marcarNotificacaoComoLida,
  ocultarNotificacao,
  ocultarTodasNotificacoes,
} from "../../services/queries/notificacoesQueries";
import { formatPrice } from "../../utils/formatPrice";
import { formatDataHoraComprovante } from "../../utils/formatDateTime";
import {
  Container,
  HeaderRow,
  HeaderLeftGroup,
  BackButton,
  Title,
  ClearAllButton,
  ClearAllButtonText,
  List,
  NotifItem,
  NotifAccentBar,
  NotifContent,
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
  UnreadDot,
  EmptyState,
  EmptyText,
} from "./notificacoesStyle";

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
    const jaLida = (notif.lidaPor || []).includes(usuario.uid);
    if (!jaLida) {
      marcarNotificacaoComoLida(notif.id, usuario.uid);
    }

    if (notif.rota) {
      router.push(notif.rota);
    }
  };

  const handleApagar = (notif) => {
    Alert.alert(
      "Apagar notificação",
      "Deseja remover essa notificação da sua lista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => ocultarNotificacao(notif.id, usuario.uid),
        },
      ],
    );
  };

  const handleLimparTudo = () => {
    if (notificacoes.length === 0) return;

    Alert.alert(
      "Limpar todas as notificações",
      "Deseja remover todas as notificações da sua lista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar tudo",
          style: "destructive",
          onPress: () => {
            const ids = notificacoes.map((n) => n.id);
            ocultarTodasNotificacoes(ids, usuario.uid);
          },
        },
      ],
    );
  };

  const handleRefresh = async () => {
    setAtualizando(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAtualizando(false);
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <HeaderRow>
        <HeaderLeftGroup>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#3D2C22" />
          </BackButton>
          <Title>Notificações</Title>
        </HeaderLeftGroup>

        {notificacoes.length > 0 && (
          <ClearAllButton onPress={handleLimparTudo}>
            <ClearAllButtonText>Limpar tudo</ClearAllButtonText>
          </ClearAllButton>
        )}
      </HeaderRow>

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
              colors={["#E67E22"]}
              tintColor="#E67E22"
            />
          }
        >
          {notificacoes.map((notif) => {
            const lida = (notif.lidaPor || []).includes(usuario.uid);

            return (
              <NotifItem
                key={notif.id}
                lida={lida}
                onPress={() => handleAbrir(notif)}
                onLongPress={() => handleApagar(notif)}
                delayLongPress={400}
              >
                <NotifAccentBar tipo={notif.tipo} lida={lida} />

                <NotifContent>
                  <NotifRow>
                    {notif.imagens && notif.imagens.length > 0 ? (
                      <StackedImagesContainer>
                        {notif.imagens.slice(0, 3).map((uri, index) => (
                          <StackedImage
                            key={index}
                            source={{ uri }}
                            resizeMode="cover"
                            style={{
                              left: index * 8,
                              zIndex: notif.imagens.length - index,
                            }}
                          />
                        ))}
                      </StackedImagesContainer>
                    ) : (
                      <NotifImagePlaceholder>
                        <Ionicons
                          name="notifications"
                          size={20}
                          color="#B0A08F"
                        />
                      </NotifImagePlaceholder>
                    )}

                    <NotifTextGroup>
                      <NotifTitulo lida={lida} numberOfLines={1}>
                        {notif.titulo}
                      </NotifTitulo>

                      <NotifMensagem>{notif.mensagem}</NotifMensagem>

                      {notif.total != null && (
                        <NotifValorBadge>
                          <NotifValorText>
                            {formatPrice(notif.total)}
                          </NotifValorText>
                        </NotifValorBadge>
                      )}

                      <NotifHora>
                        {formatDataHoraComprovante(notif.criadoEm)}
                      </NotifHora>
                    </NotifTextGroup>

                    {notif.rota && (
                      <NotifChevron>
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="#A99B8F"
                        />
                      </NotifChevron>
                    )}
                  </NotifRow>
                </NotifContent>
              </NotifItem>
            );
          })}
        </List>
      )}
    </Container>
  );
}
