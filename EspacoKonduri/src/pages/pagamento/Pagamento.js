import React, { useState, useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useCaixa } from "../../contexts/CaixaContext";
import { useEstoque } from "../../contexts/EstoqueContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import SafeContainer from "../../styles/SafeContainer";
import { formatPrice } from "../../utils/formatPrice";
import { criarPedidoImpressao } from "../../services/queries/impressaoQueries";
import {
  Container,
  FinalizeButton,
  FinalizeButtonText,
  ItemsSummaryCard,
  ItemsSummaryTitle,
  ItemRow,
  ItemName,
  ItemQtyPrice,
  PixKeyCard,
  PixKeyLabel,
  PixKeyRow,
  PixKeyValue,
  CopyButton,
  CopyButtonText,
  PixNoticeText,
} from "./pagamentoStyles";
import { useTroco } from "../../hooks/useTroco";
import { useVendas } from "../../contexts/VendasContext";
import { registrarVendaNaOperacao } from "../../services/queries/operacoesQueries";
import PagamentoHeader from "../../components/pagamento/header/Header";
import VendaTotalCard from "../../components/pagamento/totalCard/TotalCard";
import PaymentMethodSelector from "../../components/pagamento/formaPagamento/FormaPagamento";
import TrocoCalculator from "../../components/pagamento/trocoCalculo/TrocoCalculo";

const CHAVE_PIX = process.env.EXPO_PUBLIC_PIX_KEY || "chave-pix-nao-configurada";

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

  const podeFinalizar = (selectedMethod === "pix" || !insuficiente) && !finalizando;

  // Impede sair da tela com o botão físico de voltar enquanto a venda
  // está sendo processada, evitando comportamento inesperado
  useEffect(() => {
    const handler = () => finalizando;
    const subscription = BackHandler.addEventListener("hardwareBackPress", handler);
    return () => subscription.remove();
  }, [finalizando]);

  const handleCopiarChavePix = async () => {
    await Clipboard.setStringAsync(CHAVE_PIX);
    Alert.alert("Copiado", "Chave Pix copiada para a área de transferência.");
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

  const handleFinalizar = async () => {
    if (!podeFinalizar) return;

    const valorConfirmado = await confirmarValorSuspeito();
    if (!valorConfirmado) return;

    Alert.alert(
      "Confirmar venda",
      `Confirma a venda de ${formatPrice(totalVenda)} via ${
        selectedMethod === "pix" ? "Pix" : "Dinheiro"
      }?`,
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
          onSelect={setSelectedMethod}
          disabled={finalizando}
        />

        {selectedMethod === "pix" && (
          <PixKeyCard>
            <PixKeyLabel>CHAVE PIX DO ESTABELECIMENTO</PixKeyLabel>
            <PixKeyRow>
              <PixKeyValue numberOfLines={1}>{CHAVE_PIX}</PixKeyValue>
              <CopyButton onPress={handleCopiarChavePix}>
                <Ionicons name="copy-outline" size={14} color="#FFFFFF" />
                <CopyButtonText>Copiar</CopyButtonText>
              </CopyButton>
            </PixKeyRow>
            <PixNoticeText>
              Pagamento confirmado manualmente pela atendente, fora do app.
            </PixNoticeText>
          </PixKeyCard>
        )}

        {selectedMethod === "dinheiro" && (
          <TrocoCalculator
            valorRecebido={valorRecebido}
            onChangeValorRecebido={setValorRecebido}
            troco={troco}
            insuficiente={insuficiente}
          />
        )}

        <FinalizeButton
          disabled={!podeFinalizar}
          style={{ opacity: podeFinalizar ? 1 : 0.5 }}
          onPress={handleFinalizar}
        >
          <Ionicons name="checkmark-circle-outline" size={22} color="#FFFFFF" />
          <FinalizeButtonText>
            {finalizando ? "Registrando..." : "Finalizar e Emitir Comprovante"}
          </FinalizeButtonText>
        </FinalizeButton>
      </Container>
    </SafeContainer>
  );
}