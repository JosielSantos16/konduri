import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import {
  subscribeToPedidosDoCliente,
  atualizarStatusPedido,
  criarPedido,
} from '../../services/queries/pedidosQueries';
import { criarNotificacaoPorPerfil } from '../../services/queries/notificacoesQueries';
import { useRouter } from 'expo-router';
import { formatPrice } from '../../utils/formatPrice';
import { formatDataHoraComprovante } from '../../utils/formatDateTime';
import NavBarCliente from '../../components/cliente/navBar/NavBarCliente';
import {
  Container,
  Header,
  Title,
  Subtitle,
  List,
  PedidoCard,
  PedidoHeader,
  PedidoData,
  StatusBadge,
  StatusBadgeText,
  ItemRow,
  ItemName,
  ItemQtyPrice,
  TotalRow,
  TotalLabel,
  TotalValue,
  EmptyState,
  EmptyStateText,
  CancelButton,
  CancelButtonText,
  PagamentoBadge,
  PagamentoBadgeText,
  ItemImage,
  ItemImagePlaceholder,
  RefazerButton,
  RefazerButtonText,
} from './meuPedidoStyle';

const STATUS_LABEL = {
  pendente: 'Aguardando confirmação',
  aceito: 'Pedido aceito',
  preparando: 'Preparando',
  pronto: 'Pronto para retirar',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const STATUS_CANCELAVEIS = ['pendente', 'aceito'];

export default function MeuPedido() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [refazendoId, setRefazendoId] = useState(null);

  useEffect(() => {
    if (!usuario?.uid) return;

    const unsubscribe = subscribeToPedidosDoCliente(usuario.uid, (lista) => {
      setPedidos(lista);
      setCarregando(false);
    });

    return unsubscribe;
  }, [usuario?.uid]);

  const handleCancelar = (pedido) => {
    Alert.alert(
      'Cancelar pedido',
      'Tem certeza que deseja cancelar esse pedido?',
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Cancelar pedido',
          style: 'destructive',
          onPress: async () => {
            setCancelandoId(pedido.id);
            try {
              await atualizarStatusPedido(pedido.id, 'cancelado');

              const resumoItens = (pedido.itens || [])
                .map((item) => `${item.qty}x ${item.title}`)
                .join(', ');

              await criarNotificacaoPorPerfil({
                paraPerfis: ['atendente', 'adm'],
                tipo: 'pedido_cancelado',
                titulo: 'Pedido cancelado pelo cliente',
                mensagem: `${usuario.nome}: ${resumoItens}`,
                pedidoId: pedido.id,
                imagens: (pedido.itens || []).slice(0, 3).map((i) => i.image).filter(Boolean),
                total: pedido.total,
                clienteNome: usuario.nome,
                rota: '/pedido',
              });
            } catch (erro) {
              console.error('Erro ao cancelar pedido:', erro);
              Alert.alert('Erro', 'Não foi possível cancelar o pedido. Tente novamente.');
            } finally {
              setCancelandoId(null);
            }
          },
        },
      ]
    );
  };

  // Cria um pedido NOVO, com os mesmos itens de um pedido cancelado —
  // evita a pessoa ter que montar o carrinho de novo do zero
  const handleRefazerPedido = (pedido) => {
    Alert.alert(
      'Refazer pedido',
      'Deseja enviar um novo pedido com os mesmos itens?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Refazer Pedido',
          onPress: async () => {
            setRefazendoId(pedido.id);
            try {
              await criarPedido({
                clienteUid: usuario.uid,
                clienteNome: usuario.nome,
                itens: pedido.itens,
                total: pedido.total,
                observacoes: pedido.observacoes || '',
              });

              Alert.alert('Pedido reenviado!', 'Seu pedido foi enviado novamente.');
            } catch (erro) {
              console.error('Erro ao refazer pedido:', erro);
              Alert.alert('Erro', 'Não foi possível refazer o pedido. Tente novamente.');
            } finally {
              setRefazendoId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <Title>Meus Pedidos</Title>
        <Subtitle>Acompanhe o status em tempo real</Subtitle>
      </Header>

      {!carregando && pedidos.length === 0 ? (
        <EmptyState>
          <Ionicons name="receipt-outline" size={40} color="#C9BBA8" />
          <EmptyStateText>Você ainda não fez nenhum pedido.</EmptyStateText>
        </EmptyState>
      ) : (
        <List showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {pedidos.map((pedido) => {
            const podeCancel = STATUS_CANCELAVEIS.includes(pedido.status);
            const foiCancelado = pedido.status === 'cancelado';

            return (
              <PedidoCard key={pedido.id}>
                <PedidoHeader>
                  <PedidoData>{formatDataHoraComprovante(pedido.criadoEm)}</PedidoData>
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

                <TotalRow>
                  <TotalLabel>Total</TotalLabel>
                  <TotalValue>{formatPrice(pedido.total)}</TotalValue>
                </TotalRow>

                {!foiCancelado && (
                  <PagamentoBadge pago={pedido.pago}>
                    <Ionicons
                      name={pedido.pago ? 'checkmark-circle' : 'time-outline'}
                      size={12}
                      color={pedido.pago ? '#2E5A1E' : '#C0392B'}
                    />
                    <PagamentoBadgeText pago={pedido.pago}>
                      {pedido.pago ? 'Pago' : 'Aguardando pagamento'}
                    </PagamentoBadgeText>
                  </PagamentoBadge>
                )}

                {podeCancel && (
                  <>
                    <CancelButton
                      onPress={() =>
                        router.push({
                          pathname: '/editar-pedido',
                          params: { pedidoId: pedido.id },
                        })
                      }
                      style={{ borderColor: '#E67E22', marginBottom: 8 }}
                    >
                      <Ionicons name="create-outline" size={16} color="#E67E22" />
                      <CancelButtonText style={{ color: '#E67E22' }}>Editar Pedido</CancelButtonText>
                    </CancelButton>

                    <CancelButton onPress={() => handleCancelar(pedido)} disabled={cancelandoId === pedido.id}>
                      <Ionicons name="close-circle-outline" size={16} color="#C0392B" />
                      <CancelButtonText>
                        {cancelandoId === pedido.id ? 'Cancelando...' : 'Cancelar Pedido'}
                      </CancelButtonText>
                    </CancelButton>
                  </>
                )}

                {foiCancelado && (
                  <RefazerButton
                    onPress={() => handleRefazerPedido(pedido)}
                    disabled={refazendoId === pedido.id}
                  >
                    <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
                    <RefazerButtonText>
                      {refazendoId === pedido.id ? 'Enviando...' : 'Refazer Pedido'}
                    </RefazerButtonText>
                  </RefazerButton>
                )}
              </PedidoCard>
            );
          })}
        </List>
      )}

      <NavBarCliente />
    </Container>
  );
}