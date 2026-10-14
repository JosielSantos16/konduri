import React, { useState, useEffect, useRef } from 'react';
import { Modal, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registrarEntrada, ERROS_ENTRADA } from '../../services/queries/entradasQueries';
import { METODO_CORTESIA } from '../../utils/entradas';
import { formatPrice } from '../../utils/formatPrice';
import {
  ModalOverlay,
  ModalConteudo,
  ModalCabecalho,
  ModalTitulo,
  Campo,
  Label,
  InputContainer,
  Input,
  Prefixo,
  ErroTexto,
  Contador,
  ContadorBotao,
  ContadorValor,
  Opcoes,
  Opcao,
  OpcaoTexto,
  Linha,
  Rotulo,
  Valor,
  AvisoBox,
  AvisoTexto,
  BotaoPrincipal,
  BotaoPrincipalTexto,
} from './entradasStyle';

const FORMAS = [
  { key: 'pix', label: 'Pix', icone: 'qr-code-outline' },
  { key: 'cartao', label: 'Cartão', icone: 'card-outline' },
  { key: 'dinheiro', label: 'Dinheiro', icone: 'cash-outline' },
];
const CORTESIA = { key: METODO_CORTESIA, label: 'Cortesia', icone: 'gift-outline' };

function aplicarMascaraMoeda(texto) {
  const centavos = parseInt(texto.replace(/\D/g, '') || '0', 10);
  return (centavos / 100).toFixed(2).replace('.', ',');
}

// reserva: quando a pessoa chegou com reserva (preenche nome e quantidade)
// podeDarCortesia: só o admin
export default function RegistrarEntradaPortariaModal({
  visivel,
  reserva,
  valorDoDia,
  podeDarCortesia,
  usuario,
  operacaoId,
  onFechar,
}) {
  const [quantidade, setQuantidade] = useState(1);
  const [nome, setNome] = useState('');
  const [forma, setForma] = useState('pix');
  const [motivoCortesia, setMotivoCortesia] = useState('');
  const [valorRecebido, setValorRecebido] = useState('');
  const [salvando, setSalvando] = useState(false);
  const emAndamento = useRef(false);

  useEffect(() => {
    if (!visivel) return;
    setQuantidade(reserva?.quantidade || 1);
    setNome(reserva?.clienteNome || '');
    setForma('pix');
    setMotivoCortesia('');
    setValorRecebido('');
    // Só ao abrir o modal ou trocar de reserva; não reinicia enquanto a pessoa preenche
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visivel, reserva?.id]);

  const cortesia = forma === METODO_CORTESIA;
  const total = cortesia ? 0 : valorDoDia * quantidade;
  const recebido = Number(valorRecebido.replace(',', '.')) || 0;
  const troco = recebido - total;
  const motivoValido = !cortesia || motivoCortesia.trim().length >= 3;
  const formas = podeDarCortesia ? [...FORMAS, CORTESIA] : FORMAS;

  const executar = async () => {
    if (emAndamento.current) return;
    emAndamento.current = true;
    setSalvando(true);
    try {
      const venda = await registrarEntrada({
        quantidade,
        metodo: forma,
        motivoCortesia: motivoCortesia.trim(),
        reservaId: reserva?.id || null,
        clienteNome: nome.trim(),
        usuario,
        operacaoId,
      });
      Alert.alert(
        'Entrada registrada',
        `${quantidade} ${quantidade === 1 ? 'pessoa' : 'pessoas'} · ${cortesia ? 'cortesia' : formatPrice(venda.total)}`
      );
      onFechar();
    } catch (erro) {
      if (erro.message === ERROS_ENTRADA.RESERVA_INDISPONIVEL) {
        Alert.alert('Reserva já usada', 'Essa reserva já teve a entrada registrada em outro aparelho, ou foi cancelada.');
        onFechar();
      } else {
        console.error('Erro ao registrar entrada:', erro);
        Alert.alert('Não foi possível registrar', 'Nada foi gravado. Verifique a internet e tente novamente.');
      }
    } finally {
      emAndamento.current = false;
      setSalvando(false);
    }
  };

  const confirmar = () => {
    if (!motivoValido || emAndamento.current) return;
    const pergunta = cortesia
      ? `Registrar ${quantidade} ${quantidade === 1 ? 'entrada' : 'entradas'} como cortesia?`
      : `Registrar ${quantidade} ${quantidade === 1 ? 'entrada' : 'entradas'} de ${formatPrice(total)} no ${
          FORMAS.find((f) => f.key === forma)?.label
        }?`;

    // No navegador, Alert.alert com botões não aparece
    if (Platform.OS === 'web') {
      if (window.confirm(pergunta)) executar();
      return;
    }
    Alert.alert('Confirmar entrada', pergunta, [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Confirmar', onPress: executar },
    ]);
  };

  return (
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
      <ModalOverlay behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ModalConteudo>
          <ModalCabecalho>
            <ModalTitulo>{reserva ? 'Entrada com reserva' : 'Registrar entrada'}</ModalTitulo>
            <Ionicons name="close" size={24} color="#1A1A1A" onPress={salvando ? undefined : onFechar} />
          </ModalCabecalho>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Campo>
              <Label>Nome (opcional)</Label>
              <InputContainer>
                <Input value={nome} onChangeText={setNome} placeholder="Ex: Família Souza" placeholderTextColor="#9E9E9E" />
              </InputContainer>
            </Campo>

            <Campo>
              <Label>Pessoas</Label>
              <Contador>
                <ContadorBotao disabled={quantidade <= 1} onPress={() => setQuantidade((q) => Math.max(1, q - 1))}>
                  <Ionicons name="remove" size={20} color="#1A1A1A" />
                </ContadorBotao>
                <ContadorValor>{quantidade}</ContadorValor>
                <ContadorBotao onPress={() => setQuantidade((q) => q + 1)}>
                  <Ionicons name="add" size={20} color="#1A1A1A" />
                </ContadorBotao>
              </Contador>
            </Campo>

            <Campo>
              <Label>Forma de pagamento</Label>
              <Opcoes>
                {formas.map((opcao) => (
                  <Opcao key={opcao.key} selecionada={forma === opcao.key} onPress={() => setForma(opcao.key)}>
                    <Ionicons name={opcao.icone} size={16} color="#1A1A1A" />
                    <OpcaoTexto>{opcao.label}</OpcaoTexto>
                  </Opcao>
                ))}
              </Opcoes>
            </Campo>

            {cortesia && (
              <Campo>
                <Label>Motivo da cortesia</Label>
                <InputContainer erro={!motivoValido && motivoCortesia.length > 0}>
                  <Input
                    value={motivoCortesia}
                    onChangeText={setMotivoCortesia}
                    placeholder="Ex: banda, fornecedor, aniversariante"
                    placeholderTextColor="#9E9E9E"
                    maxLength={80}
                  />
                </InputContainer>
                {!motivoValido && <ErroTexto>Informe o motivo da cortesia.</ErroTexto>}
              </Campo>
            )}

            {forma === 'dinheiro' && (
              <Campo>
                <Label>Valor recebido (opcional, para o troco)</Label>
                <InputContainer>
                  <Prefixo>R$</Prefixo>
                  <Input
                    value={valorRecebido}
                    onChangeText={(t) => setValorRecebido(aplicarMascaraMoeda(t))}
                    placeholder="0,00"
                    keyboardType="numeric"
                    placeholderTextColor="#9E9E9E"
                  />
                </InputContainer>
              </Campo>
            )}

            <Linha>
              <Rotulo>Valor por pessoa hoje</Rotulo>
              <Valor>{cortesia ? '—' : formatPrice(valorDoDia)}</Valor>
            </Linha>
            <Linha>
              <Rotulo>Total</Rotulo>
              <Valor grande>{cortesia ? 'Cortesia' : formatPrice(total)}</Valor>
            </Linha>
            {forma === 'dinheiro' && recebido > 0 && (
              <Linha>
                <Rotulo>{troco >= 0 ? 'Troco' : 'Falta'}</Rotulo>
                <Valor cor={troco >= 0 ? '#137333' : '#C0392B'}>{formatPrice(Math.abs(troco))}</Valor>
              </Linha>
            )}

            {cortesia && (
              <AvisoBox>
                <Ionicons name="gift-outline" size={18} color="#6B5300" />
                <AvisoTexto>
                  Cortesia conta como acesso, mas não entra no faturamento. Fica registrada com o seu nome e o motivo.
                </AvisoTexto>
              </AvisoBox>
            )}

            <BotaoPrincipal onPress={confirmar} disabled={!motivoValido || salvando}>
              {salvando ? (
                <ActivityIndicator color="#1A1A1A" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#1A1A1A" />
                  <BotaoPrincipalTexto>Registrar entrada</BotaoPrincipalTexto>
                </>
              )}
            </BotaoPrincipal>
          </ScrollView>
        </ModalConteudo>
      </ModalOverlay>
    </Modal>
  );
}
