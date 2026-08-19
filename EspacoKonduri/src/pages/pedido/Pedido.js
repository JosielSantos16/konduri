import React, { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  subscribeToPedidosAtivos,
  atualizarStatusPedido,
  atualizarPagamentoPedido,
} from '../../services/queries/pedidosQueries';
import { formatPrice } from '../../utils/formatPrice';
import { formatHora } from '../../utils/formatDateTime';
import NavBarAtendente from '../../components/PDV/navBar/navBarAtendente';
import {
  Container,
  Header,
  Title,
  Subtitle,
  List,
  PedidoCard,
  PedidoHeader,
  ClienteNome,
  PedidoHora,
  StatusBadge,
  StatusBadgeText,
  ItemRow,
  ItemImage,
  ItemImagePlaceholder,
  ItemName,
  ItemQtyPrice,
  ObservacaoBox,
  ObservacaoText,
  TotalRow,
  TotalLabel,
  TotalValue,
  PagamentoRow,
  PagamentoText,
  ActionsRow,
  ActionButton,
  ActionButtonText,
  Content,
  EmptyTitle,
  EmptySubtitle,
} from './pedidoStyle';

const STATUS_LABEL = {
  pendente: 'Novo pedido',
  aceito: 'Aceito',
  preparando: 'Preparando',
  pronto: 'Pronto',
};

// Define qual é o próximo status e o texto do botão principal,
// dependendo de onde o pedido está agora
const PROXIMO_STATUS = {
  pendente: { status: 'aceito', label: 'Aceitar Pedido', icon: 'checkmark-circle-outline' },
  aceito: { status: 'preparando', label: 'Iniciar Preparo', icon: 'flame-outline' },
  preparando: { status: 'pronto', label: 'Marcar como Pronto', icon: 'checkmark-done-outline' },
  pronto: { status: 'entregue', label: 'Marcar como Entregue', icon: 'bag-check-outline' },
};

export default function Pedido() {
  const insets = useSafeAreaInsets();
  const [pedidos, setPedidos] = useState([]);
  const [processandoId, setProcessandoId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToPedidosAtivos(setPedidos);
    return unsubscribe;
  }, []);

  const handleAvancarStatus = async (pedido) => {
    const proximo = PROXIMO_STATUS[pedido.status];
    if (!proximo) return;

    setProcessandoId(pedido.id);
    try {
      await atualizarStatusPedido(pedido.id, proximo.status);
    } catch (erro) {
      console.error('Erro ao avançar status do pedido:', erro);
      Alert.alert('Erro', 'Não foi possível atualizar o pedido. Tente novamente.');
    } finally {
      setProcessandoId(null);
    }
  };


  const handleTogglePagamento = async (pedido) => {
    try {
      await atualizarPagamentoPedido(pedido.id, !pedido.pago);
    } catch (erro) {
      console.error('Erro ao atualizar pagamento:', erro);
      Alert.alert('Erro', 'Não foi possível atualizar o status de pagamento.');
    }
  };

  const pedidosOrdenados = [...pedidos].sort((a, b) => {
    // Pendentes primeiro (precisam de ação urgente), depois por horário
    if (a.status === 'pendente' && b.status !== 'pendente') return -1;
    if (b.status === 'pendente' && a.status !== 'pendente') return 1;
    return new Date(a.criadoEm) - new Date(b.criadoEm);
  });

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <Title>Pedidos</Title>
        <Subtitle>{pedidos.length} {pedidos.length === 1 ? 'pedido ativo' : 'pedidos ativos'}</Subtitle>
      </Header>

      {pedidos.length === 0 ? (
        <Content>
          <Ionicons name="receipt-outline" size={48} color="#C9BBA8" />
          <EmptyTitle>Nenhum pedido no momento</EmptyTitle>
          <EmptySubtitle>Assim que um cliente enviar um pedido, ele aparece aqui automaticamente.</EmptySubtitle>
        </Content>
      ) : (
        <List showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {pedidosOrdenados.map((pedido) => {
            const proximo = PROXIMO_STATUS[pedido.status];
            const processando = processandoId === pedido.id;

            return (
              <PedidoCard key={pedido.id} status={pedido.status}>
                <PedidoHeader>
                  <View>
                    <ClienteNome>{pedido.clienteNome || 'Cliente'}</ClienteNome>
                    <PedidoHora>{formatHora(pedido.criadoEm)}</PedidoHora>
                  </View>
                  <StatusBadge status={pedido.status}>
                    <StatusBadgeText status={pedido.status}>
                      {STATUS_LABEL[pedido.status] || pedido.status}
                    </StatusBadgeText>
                  </StatusBadge>
                </PedidoHeader>

                {(pedido.itens || []).map((item, index) => (
                  <ItemRow key={`${item.id || item.title}-${index}`}>
                    {item.image ? (
                      <ItemImage source={{ uri: item.image }} resizeMode="cover" />
                    ) : (
                      <ItemImagePlaceholder>
                        <Ionicons name="cube-outline" size={16} color="#C9BBA8" />
                      </ItemImagePlaceholder>
                    )}
                    <ItemName numberOfLines={1}>
                      {item.qty}x {item.title}
                    </ItemName>
                    <ItemQtyPrice>{formatPrice(item.qty * item.price)}</ItemQtyPrice>
                  </ItemRow>
                ))}

                {!!pedido.observacoes && (
                  <ObservacaoBox>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#8C5A2E" />
                    <ObservacaoText>{pedido.observacoes}</ObservacaoText>
                  </ObservacaoBox>
                )}

                <TotalRow>
                  <TotalLabel>Total</TotalLabel>
                  <TotalValue>{formatPrice(pedido.total)}</TotalValue>
                </TotalRow>

                <PagamentoRow pago={pedido.pago} onPress={() => handleTogglePagamento(pedido)}>
                  <Ionicons
                    name={pedido.pago ? 'checkmark-circle' : 'time-outline'}
                    size={16}
                    color={pedido.pago ? '#2E5A1E' : '#C0392B'}
                  />
                  <PagamentoText pago={pedido.pago}>
                    {pedido.pago ? 'Pago — toque para desmarcar' : 'Aguardando pagamento — toque para marcar como pago'}
                  </PagamentoText>
                </PagamentoRow>

                <ActionsRow>

                  {proximo && (
                    <ActionButton onPress={() => handleAvancarStatus(pedido)} disabled={processando}>
                      <Ionicons name={proximo.icon} size={16} color="#FFFFFF" />
                      <ActionButtonText>
                        {processando ? 'Atualizando...' : proximo.label}
                      </ActionButtonText>
                    </ActionButton>
                  )}
                </ActionsRow>
              </PedidoCard>
            );
          })}
        </List>
      )}

      <NavBarAtendente />
    </Container>
  );
}