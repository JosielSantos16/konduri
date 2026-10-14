import React, { useState, useEffect } from 'react';
import { Modal, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProdutos } from '../../../contexts/ProdutosContext';
import { useCaixa } from '../../../contexts/CaixaContext';
import { useAuth } from '../../../hooks/useAuth';
import { registrarSaidaAjuste } from '../../../services/queries/productsQueries';
import { TIPOS_MOVIMENTO } from '../../../services/queries/estoqueMovimentosQueries';
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
  TipoOptions,
  TipoButton,
  TipoButtonText,
  DescricaoTipo,
} from './registrarAjusteModalStyle';

const OPCOES_TIPO = [
  {
    tipo: TIPOS_MOVIMENTO.PERDA,
    label: 'Perda',
    descricao: 'Produto quebrado, vencido ou estragado.',
  },
  {
    tipo: TIPOS_MOVIMENTO.CORTESIA,
    label: 'Cortesia',
    descricao: 'Produto dado sem cobrança.',
  },
  {
    tipo: TIPOS_MOVIMENTO.AJUSTE_SAIDA,
    label: 'Ajuste',
    descricao: 'Correção de contagem: o estoque real é menor que o do sistema.',
  },
];

export default function RegistrarAjusteModal({ produtoId, onClose, onSalvo }) {
  const { produtos } = useProdutos();
  const { caixaAberto, operacaoId } = useCaixa();
  const { usuario } = useAuth();

  const produto = produtos.find((p) => p.id === produtoId);
  const estoqueAtual = Math.max(0, produto?.estoque ?? 0);

  const [tipo, setTipo] = useState(TIPOS_MOVIMENTO.PERDA);
  const [quantidade, setQuantidade] = useState('1');
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!produtoId) return;
    setTipo(TIPOS_MOVIMENTO.PERDA);
    setQuantidade('1');
    setObservacao('');
    setErro(null);
  }, [produtoId]);

  const quantidadeNumero = parseInt(quantidade, 10) || 0;
  const opcaoSelecionada = OPCOES_TIPO.find((o) => o.tipo === tipo);

  const handleSalvar = async () => {
    if (salvando) return;
    if (quantidadeNumero <= 0) {
      setErro('Informe a quantidade.');
      return;
    }
    if (quantidadeNumero > estoqueAtual) {
      setErro(`Quantidade maior que o estoque atual (${estoqueAtual} un).`);
      return;
    }

    setSalvando(true);
    try {
      await registrarSaidaAjuste(produtoId, {
        quantidade: quantidadeNumero,
        tipo,
        operacaoId: caixaAberto ? operacaoId : null,
        usuarioUid: usuario?.uid,
        usuarioNome: usuario?.nome,
        observacao: observacao.trim(),
      });
      onSalvo?.();
      onClose();
    } catch (erroSalvar) {
      console.error('Erro ao registrar ajuste de estoque:', erroSalvar);
      Alert.alert(
        'Não foi possível registrar a saída',
        erroSalvar.message?.startsWith('Quantidade maior')
          ? erroSalvar.message
          : 'Verifique sua conexão com a internet e tente novamente.'
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
            <Title>Saída de estoque</Title>
            <Ionicons name="close" size={22} color="#1A1A1A" onPress={onClose} />
          </Header>
          <ProdutoNome>{produto?.title}</ProdutoNome>

          <TipoOptions>
            {OPCOES_TIPO.map((opcao) => (
              <TipoButton
                key={opcao.tipo}
                active={tipo === opcao.tipo}
                onPress={() => setTipo(opcao.tipo)}
              >
                <TipoButtonText active={tipo === opcao.tipo}>{opcao.label}</TipoButtonText>
              </TipoButton>
            ))}
          </TipoOptions>
          <DescricaoTipo>{opcaoSelecionada?.descricao}</DescricaoTipo>

          <Campo>
            <Label>Quantidade</Label>
            <Input
              hasError={!!erro}
              value={quantidade}
              onChangeText={(texto) => {
                setQuantidade(texto.replace(/\D/g, ''));
                if (erro) setErro(null);
              }}
              placeholder="0"
              keyboardType="number-pad"
              placeholderTextColor="#9E9E9E"
            />
            {erro && <ErrorText>{erro}</ErrorText>}
          </Campo>

          <Campo>
            <Label>Observação (opcional)</Label>
            <Input
              value={observacao}
              onChangeText={setObservacao}
              placeholder="Ex: garrafa quebrada no transporte"
              placeholderTextColor="#9E9E9E"
            />
          </Campo>

          <PreviewBox>
            <PreviewRow>
              <PreviewLabel>Estoque atual</PreviewLabel>
              <PreviewValue>{estoqueAtual} un</PreviewValue>
            </PreviewRow>
            <PreviewRow>
              <PreviewLabel>Estoque após a saída</PreviewLabel>
              <PreviewValue>{Math.max(0, estoqueAtual - quantidadeNumero)} un</PreviewValue>
            </PreviewRow>
          </PreviewBox>

          <SaveButton onPress={handleSalvar} disabled={salvando}>
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <SaveButtonText>Registrar saída</SaveButtonText>
            )}
          </SaveButton>
        </Content>
      </Overlay>
    </Modal>
  );
}
