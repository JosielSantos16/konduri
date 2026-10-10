import React, { useState, useEffect, useRef } from "react";
import { Modal, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../../../utils/formatPrice";
import { infoMetodo } from "../../../utils/metodosPagamento";
import { formatHora, formatDataHoraComprovante } from "../../../utils/formatDateTime";
import { vendaCancelada } from "../../../utils/estornoVenda";
import { useCaixa } from "../../../contexts/CaixaContext";
import { cancelarVenda, ERRO_VENDA_JA_CANCELADA } from "../../../services/queries/vendasQueries";
import {
  DetalheOverlay,
  DetalheContent,
  DetalheHeader,
  DetalheTitle,
  DetalheCloseButton,
  DetalheInfoRow,
  DetalheInfoLabel,
  DetalheInfoValue,
  DetalheDivider,
  DetalheItemRow,
  DetalheItemImage,
  DetalheItemImagePlaceholder,
  DetalheItemInfo,
  DetalheItemNome,
  DetalheItemQty,
  DetalheItemSubtotal,
  DetalheTotalRow,
  DetalheTotalLabel,
  DetalheTotalValue,
  CanceladaBadge,
  CanceladaBadgeText,
  CancelarButton,
  CancelarButtonText,
  CancelamentoTitulo,
  MotivoInput,
  MotivoContador,
  AvisoBox,
  AvisoTexto,
  AcoesRow,
  BotaoSecundario,
  BotaoSecundarioTexto,
  BotaoPerigo,
  BotaoPerigoTexto,
} from "./detalheVendaModalStyle"; // ← antes vinha de "../../pages/vendas/vendasStyles"

const LIMITE_MOTIVO = 120;
const AVISO_DEVOLUCAO = "O app não devolve o dinheiro. Devolva o valor ao cliente na maquininha ou em dinheiro.";

// podeCancelar: só o admin (a tela de Vendas é exclusiva do admin; o atendente não vê o botão)
export default function DetalheVendaModal({ venda, onClose, podeCancelar, usuario }) {
  const { operacaoId: operacaoAbertaId } = useCaixa();

  const [formularioAberto, setFormularioAberto] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [cancelando, setCancelando] = useState(false);
  const [resultado, setResultado] = useState(null);
  // Trava síncrona contra toque duplo (o estado do React só muda no próximo render)
  const cancelamentoEmAndamento = useRef(false);

  // Cada venda aberta começa sem formulário nem resultado de outra venda
  useEffect(() => {
    setFormularioAberto(false);
    setMotivo("");
    setCancelando(false);
    setResultado(null);
  }, [venda?.id]);

  if (!venda) return null;

  const itens = venda.itens || [];
  const totalUnidades = itens.reduce((soma, item) => soma + item.qty, 0);
  const cancelada = vendaCancelada(venda);
  const motivoValido = motivo.trim().length >= 3;

  const executarCancelamento = async () => {
    if (cancelamentoEmAndamento.current) return;
    cancelamentoEmAndamento.current = true;
    setCancelando(true);
    try {
      const retorno = await cancelarVenda({
        vendaId: venda.id,
        motivo: motivo.trim(),
        usuarioUid: usuario?.uid,
        usuarioNome: usuario?.nome,
        operacaoAbertaId,
      });
      setResultado(retorno);
      setFormularioAberto(false);
    } catch (erro) {
      if (erro.message === ERRO_VENDA_JA_CANCELADA) {
        Alert.alert("Venda já cancelada", "Esta venda já foi cancelada, possivelmente em outro aparelho.");
        setFormularioAberto(false);
      } else {
        console.error("Erro ao cancelar venda:", erro);
        Alert.alert(
          "Não foi possível cancelar",
          "Nada foi alterado. Verifique sua conexão com a internet e tente novamente."
        );
      }
    } finally {
      cancelamentoEmAndamento.current = false;
      setCancelando(false);
    }
  };

  const confirmarCancelamento = () => {
    if (!motivoValido || cancelamentoEmAndamento.current) return;
    const pergunta = `Cancelar a venda de ${formatPrice(venda.total)}? O estoque será devolvido e a venda sairá dos totais.`;

    // No navegador, Alert.alert com botões não aparece
    if (Platform.OS === "web") {
      if (window.confirm(pergunta)) executarCancelamento();
      return;
    }

    Alert.alert(
      "Cancelar venda",
      pergunta,
      [
        { text: "Voltar", style: "cancel" },
        { text: "Cancelar venda", style: "destructive", onPress: executarCancelamento },
      ]
    );
  };

  const fechar = () => {
    if (cancelando) return;
    onClose();
  };

  return (
    <Modal visible={!!venda} transparent animationType="slide" onRequestClose={fechar}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <DetalheOverlay>
          <DetalheContent>
            <DetalheHeader>
              <DetalheTitle>Detalhes da Venda</DetalheTitle>
              <DetalheCloseButton onPress={fechar}>
                <Ionicons name="close" size={24} color="#3D2C22" />
              </DetalheCloseButton>
            </DetalheHeader>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              {cancelada && (
                <CanceladaBadge>
                  <Ionicons name="close-circle" size={14} color="#C0392B" />
                  <CanceladaBadgeText>VENDA CANCELADA</CanceladaBadgeText>
                </CanceladaBadge>
              )}

              <DetalheInfoRow>
                <DetalheInfoLabel>Horário</DetalheInfoLabel>
                <DetalheInfoValue>{formatHora(venda.criadoEm || venda.data)}</DetalheInfoValue>
              </DetalheInfoRow>
              <DetalheInfoRow>
                <DetalheInfoLabel>Atendente</DetalheInfoLabel>
                <DetalheInfoValue>{venda.responsavelNome || "Desconhecido"}</DetalheInfoValue>
              </DetalheInfoRow>
              <DetalheInfoRow>
                <DetalheInfoLabel>Forma de pagamento</DetalheInfoLabel>
                <DetalheInfoValue>{infoMetodo(venda.metodo).label}</DetalheInfoValue>
              </DetalheInfoRow>
              <DetalheInfoRow>
                <DetalheInfoLabel>Total de unidades</DetalheInfoLabel>
                <DetalheInfoValue>{totalUnidades}</DetalheInfoValue>
              </DetalheInfoRow>

              {cancelada && (
                <>
                  <DetalheInfoRow>
                    <DetalheInfoLabel>Cancelada em</DetalheInfoLabel>
                    <DetalheInfoValue>{formatDataHoraComprovante(venda.canceladaEm)}</DetalheInfoValue>
                  </DetalheInfoRow>
                  <DetalheInfoRow>
                    <DetalheInfoLabel>Cancelada por</DetalheInfoLabel>
                    <DetalheInfoValue>{venda.canceladaPorNome || "—"}</DetalheInfoValue>
                  </DetalheInfoRow>
                  <DetalheInfoRow>
                    <DetalheInfoLabel>Motivo</DetalheInfoLabel>
                    <DetalheInfoValue style={{ flex: 1, textAlign: "right", marginLeft: 12 }}>
                      {venda.motivoCancelamento || "—"}
                    </DetalheInfoValue>
                  </DetalheInfoRow>
                </>
              )}

              <DetalheDivider />

              {itens.map((produto, index) => (
                <DetalheItemRow key={`${produto.id || produto.title}-${index}`}>
                  {produto.image ? (
                    <DetalheItemImage source={{ uri: produto.image }} resizeMode="cover" />
                  ) : (
                    <DetalheItemImagePlaceholder>
                      <Ionicons name="cube-outline" size={20} color="#C9BBA8" />
                    </DetalheItemImagePlaceholder>
                  )}
                  <DetalheItemInfo>
                    <DetalheItemNome numberOfLines={1}>{produto.title}</DetalheItemNome>
                    <DetalheItemQty>
                      {produto.qty} un × {formatPrice(produto.price)}
                    </DetalheItemQty>
                  </DetalheItemInfo>
                  <DetalheItemSubtotal>{formatPrice(produto.qty * produto.price)}</DetalheItemSubtotal>
                </DetalheItemRow>
              ))}

              <DetalheTotalRow>
                <DetalheTotalLabel>Total</DetalheTotalLabel>
                <DetalheTotalValue cancelada={cancelada}>{formatPrice(venda.total)}</DetalheTotalValue>
              </DetalheTotalRow>

              {resultado && (
                <>
                  <AvisoBox bg="#E6F4EA">
                    <Ionicons name="checkmark-circle" size={18} color="#2E5A1E" />
                    <AvisoTexto cor="#2E5A1E">
                      Venda cancelada. O estoque foi devolvido e a venda saiu dos totais.
                    </AvisoTexto>
                  </AvisoBox>
                  <AvisoBox>
                    <Ionicons name="cash-outline" size={18} color="#8C5A2E" />
                    <AvisoTexto>{AVISO_DEVOLUCAO}</AvisoTexto>
                  </AvisoBox>
                  {resultado.caixaDaVendaFechado && (
                    <AvisoBox>
                      <Ionicons name="lock-closed-outline" size={18} color="#8C5A2E" />
                      <AvisoTexto>
                        O caixa desta venda já foi fechado. O estoque foi devolvido, mas o fechamento
                        daquele dia não foi alterado.
                      </AvisoTexto>
                    </AvisoBox>
                  )}
                  {resultado.comissaoAjustada && (
                    <AvisoBox>
                      <Ionicons name="people-outline" size={18} color="#8C5A2E" />
                      <AvisoTexto>
                        Comissão de {resultado.comissaoAjustada.atendente} ajustada de{" "}
                        {formatPrice(resultado.comissaoAjustada.de)} para{" "}
                        {formatPrice(resultado.comissaoAjustada.para)}.
                      </AvisoTexto>
                    </AvisoBox>
                  )}
                  {(resultado.itensSemProduto.length > 0 || resultado.produtosNaoEncontrados.length > 0) && (
                    <AvisoBox bg="#FDEDEC">
                      <Ionicons name="alert-circle-outline" size={18} color="#C0392B" />
                      <AvisoTexto cor="#C0392B">
                        Estoque não devolvido (produto não encontrado no catálogo):{" "}
                        {[...resultado.itensSemProduto, ...resultado.produtosNaoEncontrados].join(", ")}.
                      </AvisoTexto>
                    </AvisoBox>
                  )}
                </>
              )}

              {podeCancelar && !cancelada && !formularioAberto && (
                <CancelarButton onPress={() => setFormularioAberto(true)}>
                  <Ionicons name="close-circle-outline" size={18} color="#C0392B" />
                  <CancelarButtonText>Cancelar venda</CancelarButtonText>
                </CancelarButton>
              )}

              {podeCancelar && !cancelada && formularioAberto && (
                <>
                  <CancelamentoTitulo>Motivo do cancelamento</CancelamentoTitulo>
                  <MotivoInput
                    value={motivo}
                    onChangeText={setMotivo}
                    placeholder="Ex: registrada em duplicidade"
                    placeholderTextColor="#A99B8F"
                    maxLength={LIMITE_MOTIVO}
                    multiline
                    autoFocus
                    editable={!cancelando}
                  />
                  <MotivoContador>
                    {motivo.length}/{LIMITE_MOTIVO}
                  </MotivoContador>

                  <AvisoBox>
                    <Ionicons name="cash-outline" size={18} color="#8C5A2E" />
                    <AvisoTexto>{AVISO_DEVOLUCAO}</AvisoTexto>
                  </AvisoBox>

                  <AcoesRow>
                    <BotaoSecundario onPress={() => setFormularioAberto(false)} disabled={cancelando}>
                      <BotaoSecundarioTexto>Voltar</BotaoSecundarioTexto>
                    </BotaoSecundario>
                    <BotaoPerigo onPress={confirmarCancelamento} disabled={!motivoValido || cancelando}>
                      {cancelando ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <BotaoPerigoTexto>Confirmar cancelamento</BotaoPerigoTexto>
                      )}
                    </BotaoPerigo>
                  </AcoesRow>
                </>
              )}
            </ScrollView>
          </DetalheContent>
        </DetalheOverlay>
      </KeyboardAvoidingView>
    </Modal>
  );
}
