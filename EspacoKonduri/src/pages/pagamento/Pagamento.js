import React, { useState, useEffect } from "react";
import { Alert, BackHandler, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useCaixa } from "../../contexts/CaixaContext";
import { useEstoque } from "../../contexts/EstoqueContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import SafeContainer from "../../styles/SafeContainer";
import { formatPrice } from "../../utils/formatPrice";
import { criarPedidoImpressao } from "../../services/queries/impressaoQueries";
import { usePixPayment } from "../../hooks/usePixPayment";
import {
  Container,
  FinalizeButton,
  FinalizeButtonText,
  ItemsSummaryCard,
  ItemsSummaryTitle,
  ItemRow,
  ItemName,
  ItemQtyPrice,
  QrCodeCard,
  QrCodeLoadingText,
  QrCodeImage,
  QrCodeCopyRow,
  QrCodeCopyText,
  QrCodeStatusRow,
  QrCodeStatusText,
  QrCodePaidBox,
  QrCodePaidText,
  QrCodeErrorBox,
  QrCodeErrorText,
  RetryButton,
  RetryButtonText,
} from "./pagamentoStyles";
import { useTroco } from "../../hooks/useTroco";
import { useVendas } from "../../contexts/VendasContext";
import { registrarVendaNaOperacao } from "../../services/queries/operacoesQueries";
import PagamentoHeader from "../../components/pagamento/header/Header";
import VendaTotalCard from "../../components/pagamento/totalCard/TotalCard";
import PaymentMethodSelector from "../../components/pagamento/formaPagamento/FormaPagamento";
import TrocoCalculator from "../../components/pagamento/trocoCalculo/TrocoCalculo";

const MULTIPLICADOR_VALOR_SUSPEITO = 20;

export default function Pagamento() {
  const router = useRouter();
  const { total, itens } = useLocalSearchParams();
  const totalVenda = Number(total) || 0;
  const itensVenda = itens ? JSON.parse(itens) : [];

  const { registrarVenda } = useVendas();
  const { decreaseByTitle } = useEstoque();
  const { responsavel, operacaoId } = useCaixa();
  const [selectedMethod, setSelectedMethod] = useState("pix");
  const { valorRecebido, setValorRecebido, troco, insuficiente } = useTroco(totalVenda);
  const [finalizando, setFinalizando] = useState(false);

  const { qrCode, gerando, pago, erro, gerarQrCode, reiniciar } = usePixPayment();

  const podeFinalizarDinheiro = selectedMethod === "dinheiro" && !insuficiente && !finalizando;

  // Impede sair da tela com o botão físico de voltar enquanto processa
  useEffect(() => {
    const handler = () => finalizando;
    const subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => subscription.remove();
  }, [finalizando]);

  // Gera o QR Code assim que o método Pix é selecionado (só uma vez)
  useEffect(() => {
    if (selectedMethod === "pix" && !qrCode && !gerando) {
      gerarQrCode({
        vendaId: `pix_${Date.now()}`,
        total: totalVenda,
        itens: itensVenda,
      });
    }
  }, [selectedMethod]);

  // Assim que o Pix é confirmado como pago, finaliza a venda automaticamente
  useEffect(() => {
    if (pago && !finalizando) {
      executarFinalizacao();
    }
  }, [pago]);

  const handleSelecionarMetodo = (metodo) => {
    if (metodo !== selectedMethod) {
      reiniciar();
      setSelectedMethod(metodo);
    }
  };

  const handleCopiarCodigoPix = async () => {
    if (!qrCode?.qrCodeTexto) return;
    await Clipboard.setStringAsync(qrCode.qrCodeTexto);
    Alert.alert("Copiado", "Código Pix Copia e Cola copiado para a área de transferência.");
  };

  const confirmarValorSuspeito = () => {
    return new Promise((resolve) => {
      const valorNumero = Number(valorRecebido) || 0;

      if (selectedMethod === "dinheiro" && valorNumero > totalVenda * MULTIPLICADOR_VALOR_SUSPEITO) {
        Alert.alert(
          "Confirmar valor",
          `O valor recebido (${formatPrice(valorNumero)}) parece bem maior que o total da venda. Confirma que digitou certo?`,
          [
            { text: "Corrigir", style: "cancel", onPress: () => resolve(false) },
            { text: "Confirmar mesmo assim", onPress: () => resolve(true) },
          ]
        );
      } else {
        resolve(true);
      }
    });
  };

  const handleFinalizarDinheiro = async () => {
    if (!podeFinalizarDinheiro) return;

    const valorConfirmado = await confirmarValorSuspeito();
    if (!valorConfirmado) return;

    Alert.alert(
      "Confirmar venda",
      `Confirma a venda de ${formatPrice(totalVenda)} via Dinheiro?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: executarFinalizacao },
      ]
    );
  };

  const executarFinalizacao = async () => {
    if (finalizando) return;
    setFinalizando(true);

    let venda;
    try {
      venda = await registrarVenda({
        total: totalVenda,
        metodo: selectedMethod,
        itens: itensVenda,
      });
    } catch (erro) {
      console.error("Erro ao registrar venda:", erro);
      setFinalizando(false);
      Alert.alert(
        "Não foi possível finalizar a venda",
        "Verifique sua conexão com a internet e tente novamente."
      );
      return;
    }

    let pedidoImpressaoId = null;

    try {
      await Promise.all(
        itensVenda.map((item) => decreaseByTitle(item.title, item.qty, item.id))
      );

      if (operacaoId) {
        await registrarVendaNaOperacao(operacaoId, itensVenda);
      }

      const pedidoImpressao = await criarPedidoImpressao({
        itens: itensVenda,
        total: totalVenda,
        metodo: selectedMethod,
        data: venda.criadoEm,
        responsavel: responsavel || "Operador",
      });
      pedidoImpressaoId = pedidoImpressao.id;
    } catch (erro) {
      console.error("Erro ao atualizar estoque/operação/impressão (venda já registrada):", erro);
    }

    const valorRecebidoNumero = Number(valorRecebido) || 0;

    router.push({
      pathname: "/status",
      params: {
        total: totalVenda.toFixed(2),
        metodo: selectedMethod,
        comprovante: venda.id,
        data: venda.criadoEm,
        itens: JSON.stringify(itensVenda),
        pedidoImpressaoId: pedidoImpressaoId || "",
        ...(selectedMethod === "dinheiro" && {
          valorRecebido: valorRecebidoNumero.toFixed(2),
          troco: troco.toFixed(2),
        }),
      },
    });

    setFinalizando(false);
  };

  return (
    <SafeContainer>
      <Container>
        <PagamentoHeader onBack={() => (finalizando ? null : router.back())} />

        <VendaTotalCard
          total={totalVenda}
          atendente={responsavel || "Operador"}
          caixaId={operacaoId ? operacaoId.slice(-4).toUpperCase() : "—"}
        />

        {itensVenda.length > 0 && (
          <ItemsSummaryCard>
            <ItemsSummaryTitle>ITENS DA VENDA</ItemsSummaryTitle>
            {itensVenda.map((item, index) => (
              <ItemRow key={`${item.id || item.title}-${index}`}>
                <ItemName numberOfLines={1}>
                  {item.qty}x {item.title}
                </ItemName>
                <ItemQtyPrice>{formatPrice(item.qty * item.price)}</ItemQtyPrice>
              </ItemRow>
            ))}
          </ItemsSummaryCard>
        )}

        <PaymentMethodSelector
          selected={selectedMethod}
          onSelect={handleSelecionarMetodo}
          disabled={finalizando}
        />

        {selectedMethod === "pix" && (
          <QrCodeCard>
            {gerando && (
              <>
                <ActivityIndicator size="large" color="#E67E22" />
                <QrCodeLoadingText>Gerando QR Code Pix...</QrCodeLoadingText>
              </>
            )}

            {erro && !gerando && (
              <QrCodeErrorBox>
                <QrCodeErrorText>{erro}</QrCodeErrorText>
                <RetryButton
                  onPress={() =>
                    gerarQrCode({
                      vendaId: `pix_${Date.now()}`,
                      total: totalVenda,
                      itens: itensVenda,
                    })
                  }
                >
                  <RetryButtonText>Tentar novamente</RetryButtonText>
                </RetryButton>
              </QrCodeErrorBox>
            )}

            {qrCode && !gerando && !erro && (
              <>
                <QrCodeImage source={{ uri: qrCode.qrCodeImagemUrl }} resizeMode="contain" />

                <QrCodeCopyRow onPress={handleCopiarCodigoPix}>
                  <Ionicons name="copy-outline" size={14} color="#FFFFFF" />
                  <QrCodeCopyText>Copiar código Pix</QrCodeCopyText>
                </QrCodeCopyRow>

                {!pago ? (
                  <QrCodeStatusRow>
                    <ActivityIndicator size="small" color="#B85D00" />
                    <QrCodeStatusText>Aguardando pagamento...</QrCodeStatusText>
                  </QrCodeStatusRow>
                ) : (
                  <QrCodePaidBox>
                    <Ionicons name="checkmark-circle" size={18} color="#2E5A1E" />
                    <QrCodePaidText>Pagamento confirmado!</QrCodePaidText>
                  </QrCodePaidBox>
                )}
              </>
            )}
          </QrCodeCard>
        )}

        {selectedMethod === "dinheiro" && (
          <TrocoCalculator
            valorRecebido={valorRecebido}
            onChangeValorRecebido={setValorRecebido}
            troco={troco}
            insuficiente={insuficiente}
          />
        )}

        {selectedMethod === "dinheiro" && (
          <FinalizeButton
            disabled={!podeFinalizarDinheiro}
            style={{ opacity: podeFinalizarDinheiro ? 1 : 0.5 }}
            onPress={handleFinalizarDinheiro}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
            <FinalizeButtonText>
              {finalizando ? "Registrando..." : "Finalizar e Emitir Comprovante"}
            </FinalizeButtonText>
          </FinalizeButton>
        )}
      </Container>
    </SafeContainer>
  );
}