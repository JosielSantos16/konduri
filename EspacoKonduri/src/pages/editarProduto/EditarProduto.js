import React, { useState, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  buscarProdutoPorId,
  atualizarProduto,
} from "../../services/queries/productsQueries";
import { uploadProductImage } from "../../services/queries/storageQueries";
import { useProdutos } from "../../contexts/ProdutosContext";
import { useCaixa } from "../../contexts/CaixaContext";
import { useAuth } from "../../hooks/useAuth";
import {
  buscarProdutoDaOperacao,
  atualizarProdutoDaOperacao,
  adicionarProdutoAOperacao,
  removerProdutoDaOperacao,
} from "../../services/queries/operacoesQueries";
import {
  Container,
  ScrollContainer,
  Header,
  BackButton,
  HeaderTitle,
  DeleteButton,
  PhotoPicker,
  PhotoPreview,
  PhotoPickerText,
  InputGroup,
  Label,
  InputContainer,
  Input,
  Row,
  ErrorText,
  CategoryOptions,
  CategoryButton,
  CategoryButtonText,
  PreviewBox,
  PreviewLabel,
  PreviewValue,
  SaveButton,
  SaveButtonText,
  ErrorBox,
  GeneralErrorText,
  LoadingContainer,
  TextArea,
  TextAreaContainer,
  QtyAdjustButton,
} from "./editarProdutoStyle";

function aplicarMascaraMoeda(textoDigitado) {
  const apenasNumeros = textoDigitado.replace(/\D/g, "");
  const centavos = parseInt(apenasNumeros || "0", 10);
  return (centavos / 100).toFixed(2).replace(".", ",");
}

const UNIDADE_PADRAO = "un";

export default function EditarProduto() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { produtoId } = useLocalSearchParams();
  const { usuario } = useAuth();
  const { excluirProduto } = useProdutos();
  const { caixaAberto, operacaoId } = useCaixa();

  const [carregando, setCarregando] = useState(true);
  const [fotoAtualUrl, setFotoAtualUrl] = useState(null);
  const [novaFotoLocal, setNovaFotoLocal] = useState(null);
  const [existeNaOperacaoAtual, setExisteNaOperacaoAtual] = useState(false);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("produtos");
  const [preco, setPreco] = useState("");
  const [estoqueInicial, setEstoqueInicial] = useState("");
  const [entradaQtd, setEntradaQtd] = useState("");
  const [valorEntradas, setValorEntradas] = useState("");
  const [saidaQtd, setSaidaQtd] = useState("");
  const [valorSaidas, setValorSaidas] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [limiteEstoqueBaixo, setLimiteEstoqueBaixo] = useState("5");

  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);

  const ehAdmin = usuario?.perfil === "adm";

  useEffect(() => {
    async function carregar() {
      try {
        const produtoMaster = await buscarProdutoPorId(produtoId);
        if (!produtoMaster) {
          setErroGeral("Produto não encontrado.");
          setCarregando(false);
          return;
        }

        setNome(produtoMaster.title || "");
        setCategoria(produtoMaster.category || "produtos");
        setPreco((produtoMaster.price || 0).toFixed(2).replace(".", ","));
        setObservacoes(produtoMaster.observacoes || "");
        setFotoAtualUrl(produtoMaster.image || null);
        setLimiteEstoqueBaixo(String(produtoMaster.limiteEstoqueBaixo ?? 5));

        let dadosNumericos = produtoMaster;

        if (caixaAberto && operacaoId) {
          const produtoNaOperacao = await buscarProdutoDaOperacao(operacaoId, produtoId);
          if (produtoNaOperacao) {
            dadosNumericos = produtoNaOperacao;
            setExisteNaOperacaoAtual(true);
          }
        }

        setEstoqueInicial(String(dadosNumericos.estoqueInicial ?? 0));
        setEntradaQtd(String(dadosNumericos.entradaQtd ?? 0));
        setValorEntradas((dadosNumericos.valorEntradas || 0).toFixed(2).replace(".", ","));
        setSaidaQtd(String(dadosNumericos.saidaQtd ?? 0));
        setValorSaidas((dadosNumericos.valorSaidas || 0).toFixed(2).replace(".", ","));
      } catch (erro) {
        console.error("Erro ao carregar produto:", erro);
        setErroGeral("Não foi possível carregar o produto.");
      } finally {
        setCarregando(false);
      }
    }

    if (produtoId) carregar();
  }, [produtoId, caixaAberto, operacaoId]);

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso às fotos para escolher uma imagem.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!resultado.canceled) {
      setNovaFotoLocal(resultado.assets[0].uri);
    }
  };

  const handleChangePreco = (texto) => {
    setPreco(aplicarMascaraMoeda(texto));
    if (erros.preco) setErros((prev) => ({ ...prev, preco: null }));
  };

  const handleChangeValorEntradas = (texto) => {
    setValorEntradas(aplicarMascaraMoeda(texto));
    if (erros.valorEntradas) setErros((prev) => ({ ...prev, valorEntradas: null }));
  };

  const handleChangeValorSaidas = (texto) => {
    setValorSaidas(aplicarMascaraMoeda(texto));
    if (erros.valorSaidas) setErros((prev) => ({ ...prev, valorSaidas: null }));
  };

  const parseNumero = (valor) => Number((valor || "0").replace(",", ".")) || 0;

  const estoqueInicialNumero = parseNumero(estoqueInicial);
  const entradaQtdNumero = parseNumero(entradaQtd);
  const saidaQtdNumero = parseNumero(saidaQtd);
  const saldoPrevisto = estoqueInicialNumero + entradaQtdNumero - saidaQtdNumero;

  const validarNumero = (valor) => {
    const numero = parseNumero(valor);
    return valor && (isNaN(numero) || numero < 0);
  };

  const validar = () => {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "Informe o nome do produto.";

    const precoNumero = parseNumero(preco);
    if (!preco || precoNumero <= 0) novosErros.preco = "Informe um preço válido.";

    if (validarNumero(estoqueInicial)) novosErros.estoqueInicial = "Informe uma quantidade válida.";
    if (validarNumero(entradaQtd)) novosErros.entradaQtd = "Informe uma quantidade válida.";
    if (validarNumero(saidaQtd)) novosErros.saidaQtd = "Informe uma quantidade válida.";
    if (validarNumero(limiteEstoqueBaixo)) novosErros.limiteEstoqueBaixo = "Informe um número válido.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;

    setSalvando(true);
    setErroGeral(null);

    try {
      let urlFoto = fotoAtualUrl;
      if (novaFotoLocal) {
        urlFoto = await uploadProductImage(novaFotoLocal);
      }

      await atualizarProduto(produtoId, {
        title: nome.trim(),
        price: parseNumero(preco),
        category: categoria,
        unidade: UNIDADE_PADRAO,
        image: urlFoto,
        observacoes: observacoes.trim(),
        limiteEstoqueBaixo: Number(limiteEstoqueBaixo) || 5,
      });

      if (caixaAberto && operacaoId) {
        const camposOperacao = {
          estoqueInicial: estoqueInicialNumero,
          entradaQtd: entradaQtdNumero,
          valorEntradas: parseNumero(valorEntradas),
          saidaQtd: saidaQtdNumero,
          valorSaidas: parseNumero(valorSaidas),
          nome: nome.trim(),
          image: urlFoto,
        };

        if (existeNaOperacaoAtual) {
          await atualizarProdutoDaOperacao(operacaoId, produtoId, camposOperacao);
        } else {
          await adicionarProdutoAOperacao(operacaoId, { ...camposOperacao, id: produtoId });
        }
      } else {
        await atualizarProduto(produtoId, { estoque: saldoPrevisto });
      }

      router.back();
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro);
      setErroGeral("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      "Excluir produto",
      `Tem certeza que deseja excluir "${nome}" permanentemente? Ele será removido do catálogo e não aparecerá mais no PDV.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            setExcluindo(true);
            setErroGeral(null);
            try {
              await excluirProduto(produtoId);

              if (caixaAberto && operacaoId) {
                await removerProdutoDaOperacao(operacaoId, produtoId);
              }

              router.back();
            } catch (erro) {
              console.error("Erro ao excluir produto:", erro);
              setErroGeral("Não foi possível excluir o produto. Tente novamente.");
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

  const fotoExibida = novaFotoLocal || fotoAtualUrl;

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

        <PhotoPicker onPress={escolherFoto}>
          {fotoExibida ? (
            <PhotoPreview source={{ uri: fotoExibida }} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={28} color="#8C7355" />
              <PhotoPickerText>Adicionar{"\n"}foto</PhotoPickerText>
            </>
          )}
        </PhotoPicker>

        <InputGroup>
          <Label>Nome do produto</Label>
          <InputContainer hasError={!!erros.nome}>
            <Input
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Cerveja Gelada"
              placeholderTextColor="#A99B8F"
            />
          </InputContainer>
          {erros.nome && <ErrorText>{erros.nome}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Categoria</Label>
          <CategoryOptions>
            <CategoryButton selected={categoria === "produtos"} onPress={() => setCategoria("produtos")}>
              <CategoryButtonText selected={categoria === "produtos"}>Produtos</CategoryButtonText>
            </CategoryButton>
            <CategoryButton selected={categoria === "ingressos"} onPress={() => setCategoria("ingressos")}>
              <CategoryButtonText selected={categoria === "ingressos"}>Ingressos</CategoryButtonText>
            </CategoryButton>
          </CategoryOptions>
        </InputGroup>

        <Row>
          <InputGroup style={{ flex: 1, marginRight: 10 }}>
            <Label>Preço (R$)</Label>
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

          <InputGroup style={{ flex: 1 }}>
            <Label>Estoque Inicial</Label>
            <InputContainer hasError={!!erros.estoqueInicial}>
              <Input
                value={estoqueInicial}
                onChangeText={setEstoqueInicial}
                placeholder="0"
                keyboardType="decimal-pad"
                placeholderTextColor="#A99B8F"
              />
            </InputContainer>
            {erros.estoqueInicial && <ErrorText>{erros.estoqueInicial}</ErrorText>}
          </InputGroup>
        </Row>

        <Row>
          <InputGroup style={{ flex: 1, marginRight: 10 }}>
            <Label>Entrada (Qtd.)</Label>
            <InputContainer hasError={!!erros.entradaQtd} style={{ paddingHorizontal: 0 }}>
              <QtyAdjustButton
                onPress={() => setEntradaQtd(String(Math.max(0, parseNumero(entradaQtd) - 1)))}
              >
                <Ionicons name="remove" size={18} color="#5C4033" />
              </QtyAdjustButton>
              <Input
                style={{ textAlign: "center" }}
                value={entradaQtd}
                onChangeText={setEntradaQtd}
                placeholder="0"
                keyboardType="decimal-pad"
                placeholderTextColor="#A99B8F"
              />
              <QtyAdjustButton onPress={() => setEntradaQtd(String(parseNumero(entradaQtd) + 1))}>
                <Ionicons name="add" size={18} color="#5C4033" />
              </QtyAdjustButton>
            </InputContainer>
            {erros.entradaQtd && <ErrorText>{erros.entradaQtd}</ErrorText>}
          </InputGroup>

          <InputGroup style={{ flex: 1 }}>
            <Label>Valor Entradas (R$)</Label>
            <InputContainer hasError={!!erros.valorEntradas}>
              <Input
                value={valorEntradas}
                onChangeText={handleChangeValorEntradas}
                placeholder="0,00"
                keyboardType="numeric"
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
                placeholder="0"
                keyboardType="decimal-pad"
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
                onChangeText={handleChangeValorSaidas}
                placeholder="0,00"
                keyboardType="numeric"
                placeholderTextColor="#A99B8F"
              />
            </InputContainer>
            {erros.valorSaidas && <ErrorText>{erros.valorSaidas}</ErrorText>}
          </InputGroup>
        </Row>

        <PreviewBox>
          <PreviewLabel>SALDO EM ESTOQUE</PreviewLabel>
          <PreviewValue>{saldoPrevisto}</PreviewValue>
        </PreviewBox>

        <InputGroup>
          <Label>Avisar quando o estoque for menor que</Label>
          <InputContainer hasError={!!erros.limiteEstoqueBaixo}>
            <Input
              value={limiteEstoqueBaixo}
              onChangeText={setLimiteEstoqueBaixo}
              placeholder="5"
              keyboardType="decimal-pad"
              placeholderTextColor="#A99B8F"
            />
          </InputContainer>
          {erros.limiteEstoqueBaixo && <ErrorText>{erros.limiteEstoqueBaixo}</ErrorText>}
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
              <SaveButtonText>Salvar Alterações</SaveButtonText>
            </>
          )}
        </SaveButton>
      </ScrollContainer>
    </Container>
  );
}