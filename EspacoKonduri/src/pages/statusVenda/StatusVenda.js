import React, { useState, useEffect, useRef } from 'react';
import { Animated, BackHandler, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { formatPrice } from '../../utils/formatPrice';
import { formatDataHoraComprovante } from '../../utils/formatDateTime';
import {
  criarPedidoImpressao,
  subscribeToStatusImpressao,
} from '../../services/queries/impressaoQueries';
import {
  Container,
  SuccessIconContainer,
  Title,
  Subtitle,
  ItemsCard,
  ItemsCardTitle,
  ItemRow,
  ItemName,
  ItemQtyPrice,
  DetailsCard,
  DetailRow,
  DetailLabel,
  DetailValue,
  Divider,
  PrintStatusBox,
  PrintStatusText,
  ActionButtonPrimary,
  ActionButtonPrimaryText,
  ActionButtonSecondary,
  ActionButtonSecondaryText,
  ShareButton,
  ShareButtonText,
} from './statusStyles';

export default function StatusVenda() {
  const router = useRouter();
  const {
    total,
    metodo,
    comprovante,
    data,
    itens,
    pedidoImpressaoId,
    valorRecebido,
    troco,
  } = useLocalSearchParams();

  const valorPago = Number(total) || 0;
  const metodoLabel = metodo === 'pix' ? 'PIX' : 'Dinheiro';
  const dataFormatada = data ? formatDataHoraComprovante(data) : '';
  const numeroComprovante = comprovante ? comprovante.slice(-4) : '0000';
  const itensVenda = itens ? JSON.parse(itens) : [];

  const [pedidoIdAtual, setPedidoIdAtual] = useState(pedidoImpressaoId || null);
  const [statusImpressao, setStatusImpressao] = useState(null);
  const [reenviando, setReenviando] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, []);

  // Escuta em tempo real o status do pedido de impressão, se existir
  useEffect(() => {
    if (!pedidoIdAtual) return;

    const unsubscribe = subscribeToStatusImpressao(pedidoIdAtual, (pedido) => {
      setStatusImpressao(pedido?.status || null);
    });

    return unsubscribe;
  }, [pedidoIdAtual]);

  // Sempre volta pro PDV com o botão físico de voltar, nunca pra tela
  // de pagamento (que não faz mais sentido depois da venda concluída)
  useEffect(() => {
    const handler = () => {
      router.replace('/pdv');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', handler);
    return () => subscription.remove();
  }, []);

  const handleNewSale = () => router.replace('/pdv');

  const handleReenviarImpressao = async () => {
    setReenviando(true);
    try {
      const novoPedido = await criarPedidoImpressao({
        itens: itensVenda,
        total: valorPago,
        metodo,
        data,
        responsavel: '',
      });
      setPedidoIdAtual(novoPedido.id);
      setStatusImpressao('pendente');
    } catch (erro) {
      console.error('Erro ao reenviar pedido de impressão:', erro);
    } finally {
      setReenviando(false);
    }
  };

  const handleShare = async () => {
    const linhasItens = itensVenda
      .map((item) => `${item.qty}x ${item.title} — ${formatPrice(item.qty * item.price)}`)
      .join('\n');

    const mensagem = [
      'Espaço Konduri — Comprovante de Venda',
      `Comprovante #${numeroComprovante}`,
      dataFormatada,
      '',
      linhasItens,
      '',
      `Total: ${formatPrice(valorPago)}`,
      `Forma de pagamento: ${metodoLabel}`,
    ].join('\n');

    try {
      await Share.share({ message: mensagem });
    } catch (erro) {
      console.error('Erro ao compartilhar comprovante:', erro);
    }
  };

  const renderStatusImpressao = () => {
    if (!pedidoIdAtual) return null;

    if (statusImpressao === 'impresso') {
      return (
        <PrintStatusBox status="impresso">
          <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
          <PrintStatusText status="impresso">Comprovante impresso com sucesso</PrintStatusText>
        </PrintStatusBox>
      );
    }

    if (statusImpressao === 'erro') {
      return (
        <PrintStatusBox status="erro">
          <Ionicons name="alert-circle" size={18} color="#E74C3C" />
          <PrintStatusText status="erro">Falha ao imprimir</PrintStatusText>
        </PrintStatusBox>
      );
    }

    return (
      <PrintStatusBox status="pendente">
        <Ionicons name="time-outline" size={18} color="#D3C5B4" />
        <PrintStatusText status="pendente">Aguardando impressora conectada...</PrintStatusText>
      </PrintStatusBox>
    );
  };

  return (
    <Container>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <SuccessIconContainer>
          <Ionicons name="checkmark" size={50} color="#FFFFFF" />
        </SuccessIconContainer>
      </Animated.View>

      <Title>Venda Realizada com Sucesso!</Title>
      <Subtitle>Comprovante #{numeroComprovante} — {dataFormatada}</Subtitle>

      {itensVenda.length > 0 && (
        <ItemsCard>
          <ItemsCardTitle>ITENS DA VENDA</ItemsCardTitle>
          {itensVenda.map((item, index) => (
            <ItemRow key={`${item.id || item.title}-${index}`}>
              <ItemName numberOfLines={1}>
                {item.qty}x {item.title}
              </ItemName>
              <ItemQtyPrice>{formatPrice(item.qty * item.price)}</ItemQtyPrice>
            </ItemRow>
          ))}
        </ItemsCard>
      )}

      <DetailsCard>
        <DetailRow>
          <DetailLabel>MÉTODO DE PAGAMENTO</DetailLabel>
          <DetailValue>{metodoLabel}</DetailValue>
        </DetailRow>

        {metodo === 'dinheiro' && valorRecebido && (
          <>
            <DetailRow>
              <DetailLabel>Valor Recebido</DetailLabel>
              <DetailValue>{formatPrice(Number(valorRecebido))}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Troco</DetailLabel>
              <DetailValue>{formatPrice(Number(troco))}</DetailValue>
            </DetailRow>
          </>
        )}

        <Divider />

        <DetailRow>
          <DetailLabel>Valor Pago:</DetailLabel>
          <DetailValue style={{ color: '#E67E22', fontSize: 18 }}>{formatPrice(valorPago)}</DetailValue>
        </DetailRow>
      </DetailsCard>

      {renderStatusImpressao()}

      <ActionButtonPrimary onPress={handleNewSale}>
        <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
        <ActionButtonPrimaryText>Nova Venda</ActionButtonPrimaryText>
      </ActionButtonPrimary>

      {statusImpressao === 'erro' && (
        <ActionButtonSecondary onPress={handleReenviarImpressao} disabled={reenviando}>
          <Ionicons name="print-outline" size={20} color="#E67E22" />
          <ActionButtonSecondaryText>
            {reenviando ? 'Reenviando...' : 'Tentar Imprimir Novamente'}
          </ActionButtonSecondaryText>
        </ActionButtonSecondary>
      )}

      <ShareButton onPress={handleShare}>
        <Ionicons name="share-outline" size={18} color="#D3C5B4" />
        <ShareButtonText>Compartilhar comprovante</ShareButtonText>
      </ShareButton>
    </Container>
  );
}