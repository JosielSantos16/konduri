import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProdutos } from '../../contexts/ProdutosContext';
import { useCaixa } from '../../contexts/CaixaContext';
import { adicionarProdutoAOperacao } from '../../services/queries/operacoesQueries';
import { CATEGORIAS_PRODUTO } from '../../utils/categoriasProduto';
import {
  Container,
  ScrollContainer,
  Header,
  BackButton,
  HeaderTitle,
  PhotoPicker,
  PhotoPreview,
  PhotoPickerText,
  InputGroup,
  Label,
  InputContainer,
  Input,
  ErrorText,
  HelperText,
  CategoryOptions,
  CategoryButton,
  CategoryButtonText,
  ChipsWrap,
  Chip,
  ChipText,
  SaveButton,
  SaveButtonText,
  ErrorBox,
  GeneralErrorText,
  TextArea,
  TextAreaContainer,
} from './novoProdutoStyle';

function aplicarMascaraMoeda(textoDigitado) {
  const apenasNumeros = textoDigitado.replace(/\D/g, '');
  const centavos = parseInt(apenasNumeros || '0', 10);
  return (centavos / 100).toFixed(2).replace('.', ',');
}

const UNIDADE_PADRAO = 'un';

export default function NovoProduto() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { criarProduto } = useProdutos();
  const { caixaAberto, operacaoId } = useCaixa();

  const [foto, setFoto] = useState(null);
  const [nome, setNome] = useState('');
  // "Vender como": 'produtos' | 'ingressos' (separa as abas do PDV)
  const [categoria, setCategoria] = useState('produtos');
  const [preco, setPreco] = useState('');
  const [custoUnitario, setCustoUnitario] = useState('');
  const [estoqueAtual, setEstoqueAtual] = useState('');
  const [limiteEstoqueBaixo, setLimiteEstoqueBaixo] = useState('5');
  const [categoriaProduto, setCategoriaProduto] = useState(null);
  const [observacoes, setObservacoes] = useState('');

  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às fotos para escolher uma imagem.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const handleChangePreco = (texto) => {
    setPreco(aplicarMascaraMoeda(texto));
    if (erros.preco) setErros((prev) => ({ ...prev, preco: null }));
  };

  const handleChangeCustoUnitario = (texto) => {
    setCustoUnitario(aplicarMascaraMoeda(texto));
    if (erros.custoUnitario) setErros((prev) => ({ ...prev, custoUnitario: null }));
  };

  const parseNumero = (valor) => Number((valor || '0').replace(',', '.')) || 0;

  const validarNumero = (valor) => {
    const numero = parseNumero(valor);
    return valor && (isNaN(numero) || numero < 0);
  };

  const validar = () => {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = 'Informe o nome do produto.';

    const precoNumero = parseNumero(preco);
    if (!preco || precoNumero <= 0) novosErros.preco = 'Informe um preço válido.';

    if (custoUnitario && parseNumero(custoUnitario) > precoNumero) {
      novosErros.custoUnitario = 'O custo não pode ser maior que o preço de venda.';
    }

    if (validarNumero(estoqueAtual)) novosErros.estoqueAtual = 'Informe uma quantidade válida.';
    if (validarNumero(limiteEstoqueBaixo)) novosErros.limiteEstoqueBaixo = 'Informe um número válido.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;

    setSalvando(true);
    setErroGeral(null);

    const estoqueNumero = parseNumero(estoqueAtual);

    try {
      // Entradas e saídas começam zeradas: no cadastro, o estoque atual é o estoque inicial
      const { id, image } = await criarProduto(
        {
          title: nome.trim(),
          price: parseNumero(preco),
          category: categoria,
          categoriaProduto,
          unidade: UNIDADE_PADRAO,
          estoqueInicial: estoqueNumero,
          entradaQtd: 0,
          saidaQtd: 0,
          valorEntradas: 0,
          valorSaidas: 0,
          custoUnitario: parseNumero(custoUnitario),
          observacoes: observacoes.trim(),
          limiteEstoqueBaixo: Number(limiteEstoqueBaixo) || 5,
        },
        foto
      );

      // Com o caixa aberto, o produto já entra no Controle do Dia
      if (caixaAberto && operacaoId) {
        await adicionarProdutoAOperacao(operacaoId, {
          id,
          title: nome.trim(),
          unidade: UNIDADE_PADRAO,
          image,
          estoque: estoqueNumero,
        });
      }

      router.back();
    } catch (erro) {
      console.error('Erro ao criar produto:', erro);
      setErroGeral('Não foi possível salvar o produto. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <Header>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#2E5A1E" />
          </BackButton>
          <HeaderTitle>Novo Produto</HeaderTitle>
        </Header>

        <InputGroup>
          <Label>Nome do produto</Label>
          <InputContainer hasError={!!erros.nome}>
            <Input
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Cerveja Império lata 269 ml"
              placeholderTextColor="#A99B8F"
            />
          </InputContainer>
          {erros.nome && <ErrorText>{erros.nome}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Vender como</Label>
          <CategoryOptions>
            <CategoryButton selected={categoria === 'produtos'} onPress={() => setCategoria('produtos')}>
              <CategoryButtonText selected={categoria === 'produtos'}>Produto</CategoryButtonText>
            </CategoryButton>
            <CategoryButton selected={categoria === 'ingressos'} onPress={() => setCategoria('ingressos')}>
              <CategoryButtonText selected={categoria === 'ingressos'}>Ingresso</CategoryButtonText>
            </CategoryButton>
          </CategoryOptions>
        </InputGroup>

        <InputGroup>
          <Label>Preço de venda (R$)</Label>
          <InputContainer hasError={!!erros.preco}>
            <Input
              value={preco}
              onChangeText={handleChangePreco}
              placeholder="0,00"
              keyboardType="numeric"
              placeholderTextColor="#A99B8F"
            />
          </InputContainer>
          {erros.preco && <ErrorText>{erros.preco}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Custo unitário (R$)</Label>
          <InputContainer hasError={!!erros.custoUnitario}>
            <Input
              value={custoUnitario}
              onChangeText={handleChangeCustoUnitario}
              placeholder="0,00"
              keyboardType="numeric"
              placeholderTextColor="#A99B8F"
            />
          </InputContainer>
          {erros.custoUnitario && <ErrorText>{erros.custoUnitario}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Estoque atual</Label>
          <InputContainer hasError={!!erros.estoqueAtual}>
            <Input
              value={estoqueAtual}
              onChangeText={setEstoqueAtual}
              placeholder="0"
              keyboardType="decimal-pad"
              placeholderTextColor="#A99B8F"
            />
          </InputContainer>
          {erros.estoqueAtual && <ErrorText>{erros.estoqueAtual}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Estoque mínimo</Label>
          <InputContainer hasError={!!erros.limiteEstoqueBaixo}>
            <Input
              value={limiteEstoqueBaixo}
              onChangeText={setLimiteEstoqueBaixo}
              placeholder="5"
              keyboardType="decimal-pad"
              placeholderTextColor="#A99B8F"
            />
          </InputContainer>
          {erros.limiteEstoqueBaixo ? (
            <ErrorText>{erros.limiteEstoqueBaixo}</ErrorText>
          ) : (
            <HelperText>Avisa quando o estoque chegar a este número.</HelperText>
          )}
        </InputGroup>

        <InputGroup>
          <Label>Categoria (opcional)</Label>
          <ChipsWrap>
            {CATEGORIAS_PRODUTO.map((nomeCategoria) => (
              <Chip
                key={nomeCategoria}
                selected={categoriaProduto === nomeCategoria}
                onPress={() =>
                  setCategoriaProduto(categoriaProduto === nomeCategoria ? null : nomeCategoria)
                }
              >
                <ChipText selected={categoriaProduto === nomeCategoria}>{nomeCategoria}</ChipText>
              </Chip>
            ))}
          </ChipsWrap>
        </InputGroup>

        <InputGroup>
          <Label>Foto</Label>
          <PhotoPicker onPress={escolherFoto} style={{ marginBottom: 0 }}>
            {foto ? (
              <PhotoPreview source={{ uri: foto }} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={28} color="#8C7355" />
                <PhotoPickerText>Adicionar{'\n'}foto</PhotoPickerText>
              </>
            )}
          </PhotoPicker>
        </InputGroup>

        <InputGroup>
          <Label>Observações</Label>
          <TextAreaContainer>
            <TextArea
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Ex: 2 unidades amassadas na entrega"
              placeholderTextColor="#A99B8F"
              multiline
              numberOfLines={3}
            />
          </TextAreaContainer>
        </InputGroup>

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
              <SaveButtonText>Salvar Produto</SaveButtonText>
            </>
          )}
        </SaveButton>
      </ScrollContainer>
    </Container>
  );
}
