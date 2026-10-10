import React, { useState, useEffect } from 'react';
import { Modal, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CardHeader,
  TextoSuave,
  ModalOverlay,
  ModalConteudo,
  ModalTitulo,
  ModalInputContainer,
  ModalInput,
  ModalSufixo,
  ModalErro,
  ModalBotao,
  ModalBotaoTexto,
} from '../gestaoCardsStyle';

// Aceita até uma casa decimal com vírgula, ex: "27,5"
function aplicarMascaraPercentual(textoDigitado) {
  const limpo = textoDigitado.replace('.', ',').replace(/[^\d,]/g, '');
  const [inteiro, ...resto] = limpo.split(',');
  return resto.length ? `${inteiro},${resto.join('').slice(0, 1)}` : inteiro;
}

export default function MargemMinimaModal({ visivel, margemAtual, onFechar, onSalvar }) {
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!visivel) return;
    setValor(String(margemAtual).replace('.', ','));
    setErro(null);
  }, [visivel, margemAtual]);

  const handleSalvar = async () => {
    const numero = Number(valor.replace(',', '.'));
    if (!valor || isNaN(numero) || numero <= 0 || numero >= 100) {
      setErro('Informe uma margem entre 0 e 100%.');
      return;
    }

    setSalvando(true);
    try {
      await onSalvar(numero);
      onFechar();
    } catch (erroSalvar) {
      console.error('Erro ao salvar margem mínima:', erroSalvar);
      Alert.alert('Não foi possível salvar', 'Verifique sua conexão com a internet e tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={onFechar}>
      <ModalOverlay behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ModalConteudo>
          <CardHeader>
            <ModalTitulo>Margem mínima desejada</ModalTitulo>
            <Ionicons name="close" size={22} color="#3D2C22" onPress={onFechar} />
          </CardHeader>
          <TextoSuave>
            Produtos com margem abaixo deste valor aparecem com o aviso ⚠ Margem baixa.
          </TextoSuave>

          <ModalInputContainer erro={!!erro}>
            <ModalInput
              value={valor}
              onChangeText={(texto) => {
                setValor(aplicarMascaraPercentual(texto));
                if (erro) setErro(null);
              }}
              keyboardType="decimal-pad"
              autoFocus
            />
            <ModalSufixo>%</ModalSufixo>
          </ModalInputContainer>
          {erro && <ModalErro>{erro}</ModalErro>}

          <ModalBotao onPress={handleSalvar} disabled={salvando}>
            {salvando ? <ActivityIndicator color="#FFFFFF" /> : <ModalBotaoTexto>Salvar</ModalBotaoTexto>}
          </ModalBotao>
        </ModalConteudo>
      </ModalOverlay>
    </Modal>
  );
}
