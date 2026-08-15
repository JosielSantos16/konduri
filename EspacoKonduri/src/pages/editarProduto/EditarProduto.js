import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  buscarProdutoDaOperacao,
  atualizarProdutoDaOperacao,
} from '../../services/queries/operacoesQueries';
import { useProdutos } from '../../contexts/ProdutosContext';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  ScrollContainer,
  Header,
  BackButton,
  HeaderTitle,
  DeleteButton,
  ProductNameBanner,
  ProductNameText,
  ProductStockText,
  InputGroup,
  Label,
  InputContainer,
  Input,
  Row,
  ErrorText,
  PreviewBox,
  PreviewLabel,
  PreviewValue,
  SaveButton,
  SaveButtonText,
  ErrorBox,
  GeneralErrorText,
  LoadingContainer,
} from './editarProdutoStyle';

export default function EditarProdutoOperacao() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { operacaoId, produtoId } = useLocalSearchParams();
  const { usuario } = useAuth();
  const { excluirProduto } = useProdutos();

  const [produto, setProduto] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const [entradaQtd, setEntradaQtd] = useState('');
  const [valorEntradas, setValorEntradas] = useState('');
  const [saidaQtd, setSaidaQtd] = useState('');
  const [valorSaidas, setValorSaidas] = useState('');

  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const ehAdmin = usuario?.perfil === 'adm';

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarProdutoDaOperacao(operacaoId, produtoId);
        if (dados) {
          setProduto(dados);
          setEntradaQtd(String(dados.entradaQtd || 0));
          setValorEntradas(String(dados.valorEntradas || 0));
          setSaidaQtd(String(dados.saidaQtd || 0));
          setValorSaidas(String(dados.valorSaidas || 0));
        }
      } catch (erro) {
        console.error('Erro ao carregar produto da operação:', erro);
        setErroGeral('Não foi possível carregar os dados do produto.');
      } finally {
        setCarregando(false);
      }
    }

    if (operacaoId && produtoId) carregar();
  }, [operacaoId, produtoId]);

  const saldoPrevisto = produto
    ? produto.estoqueInicial + (Number(entradaQtd) || 0) - (Number(saidaQtd) || 0)
    : 0;

  const validar = () => {
    const novosErros = {};

    if (entradaQtd === '' || isNaN(Number(entradaQtd)) || Number(entradaQtd) < 0) {
      novosErros.entradaQtd = 'Informe uma quantidade válida.';
    }
    if (valorEntradas === '' || isNaN(Number(valorEntradas)) || Number(valorEntradas) < 0) {
      novosErros.valorEntradas = 'Informe um valor válido.';
    }
    if (saidaQtd === '' || isNaN(Number(saidaQtd)) || Number(saidaQtd) < 0) {
      novosErros.saidaQtd = 'Informe uma quantidade válida.';
    }
    if (valorSaidas === '' || isNaN(Number(valorSaidas)) || Number(valorSaidas) < 0) {
      novosErros.valorSaidas = 'Informe um valor válido.';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;

    setSalvando(true);
    setErroGeral(null);

    try {
      await atualizarProdutoDaOperacao(operacaoId, produtoId, {
        entradaQtd: Number(entradaQtd),
        valorEntradas: Number(valorEntradas),
        saidaQtd: Number(saidaQtd),
        valorSaidas: Number(valorSaidas),
      });

      router.back();
    } catch (erro) {
      console.error('Erro ao salvar produto da operação:', erro);
      setErroGeral('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      'Excluir produto',
      `Tem certeza que deseja excluir "${produto?.nome}" permanentemente? Ele será removido do catálogo e não aparecerá mais no PDV.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setExcluindo(true);
            setErroGeral(null);
            try {
              await excluirProduto(produtoId);
              router.back();
            } catch (erro) {
              console.error('Erro ao excluir produto:', erro);
              setErroGeral('Não foi possível excluir o produto. Tente novamente.');
            } finally {
              setExcluindo(false);
            }
          },
        },
      ]
    );
  };

  if (carregando) {
    return (
      <Container style={{ paddingTop: insets.top }}>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#2E5A1E" />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <Header>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#2E5A1E" />
          </BackButton>
          <HeaderTitle>Editar Produto</HeaderTitle>

          {ehAdmin && (
            <DeleteButton onPress={handleExcluir} disabled={excluindo}>
              {excluindo ? (
                <ActivityIndicator size="small" color="#C0392B" />
              ) : (
                <Ionicons name="trash-outline" size={22} color="#C0392B" />
              )}
            </DeleteButton>
          )}
        </Header>

        <ProductNameBanner>
          <ProductNameText>{produto?.nome}</ProductNameText>
          <ProductStockText>
            Estoque inicial: {produto?.estoqueInicial} {produto?.unidade}
          </ProductStockText>
        </ProductNameBanner>

        <Row>
          <InputGroup style={{ flex: 1, marginRight: 10 }}>
            <Label>Entrada (Qtd.)</Label>
            <InputContainer hasError={!!erros.entradaQtd}>
              <Input
                value={entradaQtd}
                onChangeText={setEntradaQtd}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor="#A99B8F"
              />
            </InputContainer>
            {erros.entradaQtd && <ErrorText>{erros.entradaQtd}</ErrorText>}
          </InputGroup>

          <InputGroup style={{ flex: 1 }}>
            <Label>Valor Entradas (R$)</Label>
            <InputContainer hasError={!!erros.valorEntradas}>
              <Input
                value={valorEntradas}
                onChangeText={setValorEntradas}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor="#A99B8F"
              />
            </InputContainer>
            {erros.valorEntradas && <ErrorText>{erros.valorEntradas}</ErrorText>}
          </InputGroup>
        </Row>

        <Row>
          <InputGroup style={{ flex: 1, marginRight: 10 }}>
            <Label>Saída / Venda (Qtd.)</Label>
            <InputContainer hasError={!!erros.saidaQtd}>
              <Input
                value={saidaQtd}
                onChangeText={setSaidaQtd}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor="#A99B8F"
              />
            </InputContainer>
            {erros.saidaQtd && <ErrorText>{erros.saidaQtd}</ErrorText>}
          </InputGroup>

          <InputGroup style={{ flex: 1 }}>
            <Label>Valor Saídas (R$)</Label>
            <InputContainer hasError={!!erros.valorSaidas}>
              <Input
                value={valorSaidas}
                onChangeText={setValorSaidas}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor="#A99B8F"
              />
            </InputContainer>
            {erros.valorSaidas && <ErrorText>{erros.valorSaidas}</ErrorText>}
          </InputGroup>
        </Row>

        <PreviewBox>
          <PreviewLabel>SALDO EM ESTOQUE PREVISTO</PreviewLabel>
          <PreviewValue>{saldoPrevisto} {produto?.unidade}</PreviewValue>
        </PreviewBox>

        {erroGeral && (
          <ErrorBox>
            <GeneralErrorText>{erroGeral}</GeneralErrorText>
          </ErrorBox>
        )}

        <SaveButton onPress={handleSalvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
              <SaveButtonText>Salvar Alterações</SaveButtonText>
            </>
          )}
        </SaveButton>
      </ScrollContainer>
    </Container>
  );
}