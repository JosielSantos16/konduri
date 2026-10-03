import React, { useState, useEffect } from 'react';
import { Modal, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProdutos } from '../../../contexts/ProdutosContext';
import { useCaixa } from '../../../contexts/CaixaContext';
import { useAuth } from '../../../hooks/useAuth';
import { registrarEntradaComCusto } from '../../../services/queries/productsQueries';
import { formatPrice } from '../../../utils/formatPrice';
import {
  Overlay,
  Content,
  Header,
  Title,
  ProdutoNome,
  Campo,
  Label,
  Input,
  ErrorText,
  PreviewBox,
  PreviewRow,
  PreviewLabel,
  PreviewValue,
  SaveButton,
  SaveButtonText,
} from './registrarEntradaModalStyle';

function aplicarMascaraMoeda(textoDigitado) {
  const apenasNumeros = textoDigitado.replace(/\D/g, '');
  const centavos = parseInt(apenasNumeros || '0', 10);
  return (centavos / 100).toFixed(2).replace('.', ',');
}

const parseNumero = (valor) => Number((valor || '0').replace(',', '.')) || 0;

export default function RegistrarEntradaModal({ produtoId, onClose, onSalvo }) {
  const { produtos } = useProdutos();
  const { caixaAberto, operacaoId } = useCaixa();
  const { usuario } = useAuth();

  const produto = produtos.find((p) => p.id === produtoId);
  const custoMedioAtual = produto?.custoMedio ?? produto?.custoUnitario ?? 0;
  const estoqueAtual = Math.max(0, produto?.estoque ?? 0);

  const [quantidade, setQuantidade] = useState('');
  const [custoUnitario, setCustoUnitario] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  // Ao abrir para um produto, sugere o custo médio atual como custo da compra
  useEffect(() => {
    if (!produtoId) return;
    setQuantidade('');
    setCustoUnitario(custoMedioAtual > 0 ? custoMedioAtual.toFixed(2).replace('.', ',') : '');
    setObservacao('');
    setErros({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produtoId]);

  const quantidadeNumero = parseInt(quantidade, 10) || 0;
  const custoNumero = parseNumero(custoUnitario);

  // Prévia do custo médio ponderado (a conta definitiva é feita na transação)
  const novoCustoMedio =
    quantidadeNumero > 0 && custoNumero > 0
      ? custoMedioAtual > 0
        ? (estoqueAtual * custoMedioAtual + quantidadeNumero * custoNumero) / (estoqueAtual + quantidadeNumero)
        : custoNumero
      : null;

  const validar = () => {
    const novosErros = {};
    if (quantidadeNumero <= 0) novosErros.quantidade = 'Informe a quantidade comprada.';
    if (custoNumero <= 0) novosErros.custoUnitario = 'Informe o custo unitário da compra.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar() || salvando) return;

    setSalvando(true);
    try {
      await registrarEntradaComCusto(produtoId, {
        quantidade: quantidadeNumero,
        custoUnitario: custoNumero,
        operacaoId: caixaAberto ? operacaoId : null,
        usuarioUid: usuario?.uid,
        usuarioNome: usuario?.nome,
        observacao: observacao.trim(),
      });
      onSalvo?.();
      onClose();
    } catch (erro) {
      console.error('Erro ao registrar entrada:', erro);
      Alert.alert(
        'Não foi possível registrar a entrada',
        'Verifique sua conexão com a internet e tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal visible={!!produtoId} transparent animationType="fade" onRequestClose={onClose}>
      <Overlay behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Content>
          <Header>
            <Title>Registrar entrada</Title>
            <Ionicons name="close" size={22} color="#3D2C22" onPress={onClose} />
          </Header>
          <ProdutoNome>{produto?.title}</ProdutoNome>

          <Campo>
            <Label>Quantidade comprada</Label>
            <Input
              hasError={!!erros.quantidade}
              value={quantidade}
              onChangeText={(texto) => {
                setQuantidade(texto.replace(/\D/g, ''));
                if (erros.quantidade) setErros((prev) => ({ ...prev, quantidade: null }));
              }}
              placeholder="0"
              keyboardType="number-pad"
              placeholderTextColor="#A99B8F"
              autoFocus
            />
            {erros.quantidade && <ErrorText>{erros.quantidade}</ErrorText>}
          </Campo>

          <Campo>
            <Label>Custo unitário da compra (R$)</Label>
            <Input
              hasError={!!erros.custoUnitario}
              value={custoUnitario}
              onChangeText={(texto) => {
                setCustoUnitario(aplicarMascaraMoeda(texto));
                if (erros.custoUnitario) setErros((prev) => ({ ...prev, custoUnitario: null }));
              }}
              placeholder="0,00"
              keyboardType="numeric"
              placeholderTextColor="#A99B8F"
            />
            {erros.custoUnitario && <ErrorText>{erros.custoUnitario}</ErrorText>}
          </Campo>

          <Campo>
            <Label>Observação (opcional)</Label>
            <Input
              value={observacao}
              onChangeText={setObservacao}
              placeholder="Ex: fornecedor, nota fiscal..."
              placeholderTextColor="#A99B8F"
            />
          </Campo>

          <PreviewBox>
            <PreviewRow>
              <PreviewLabel>Estoque atual</PreviewLabel>
              <PreviewValue>{estoqueAtual} un</PreviewValue>
            </PreviewRow>
            <PreviewRow>
              <PreviewLabel>Custo médio atual</PreviewLabel>
              <PreviewValue>{custoMedioAtual > 0 ? formatPrice(custoMedioAtual) : 'sem custo'}</PreviewValue>
            </PreviewRow>
            <PreviewRow>
              <PreviewLabel>Novo custo médio</PreviewLabel>
              <PreviewValue>{novoCustoMedio !== null ? formatPrice(novoCustoMedio) : '—'}</PreviewValue>
            </PreviewRow>
          </PreviewBox>

          <SaveButton onPress={handleSalvar} disabled={salvando}>
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <SaveButtonText>Registrar entrada</SaveButtonText>
            )}
          </SaveButton>
        </Content>
      </Overlay>
    </Modal>
  );
}
