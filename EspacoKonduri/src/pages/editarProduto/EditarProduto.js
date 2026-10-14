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
import { calcularSaldoOperacao } from "../../utils/saldoOperacao";
import { ehAdmin as usuarioEhAdmin } from "../../utils/permissoes";
import { CATEGORIAS_PRODUTO } from "../../utils/categoriasProduto";
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
  ChipsWrap,
  Chip,
  ChipText,
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
  HelperText,
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
  const { produtos, excluirProduto } = useProdutos();
  const { caixaAberto, operacaoId } = useCaixa();

  const [carregando, setCarregando] = useState(true);
  const [fotoAtualUrl, setFotoAtualUrl] = useState(null);
  const [novaFotoLocal, setNovaFotoLocal] = useState(null);
  const [existeNaOperacaoAtual, setExisteNaOperacaoAtual] = useState(false);

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("produtos");
  const [categoriaProduto, setCategoriaProduto] = useState(null);
  const [preco, setPreco] = useState("");
  const [estoqueInicial, setEstoqueInicial] = useState("");
  const [entradaQtd, setEntradaQtd] = useState("");
  const [valorEntradas, setValorEntradas] = useState("");
  const [saidaQtd, setSaidaQtd] = useState("");
  const [valorSaidas, setValorSaidas] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [ajusteSaidaQtd, setAjusteSaidaQtd] = useState(0);
  // Valores de estoque como vieram do banco, para só regravar o que o usuário mudou
  const [estoqueOriginal, setEstoqueOriginal] = useState(null);
  const [custoUnitario, setCustoUnitario] = useState('');
  const [limiteEstoqueBaixo, setLimiteEstoqueBaixo] = useState("5");

  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);

  const ehAdmin = usuarioEhAdmin(usuario);

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
        setCustoUnitario((produtoMaster.custoMedio ?? produtoMaster.custoUnitario ?? 0).toFixed(2).replace(".", ","));
        setCategoria(produtoMaster.category || "produtos");
        setCategoriaProduto(produtoMaster.categoriaProduto || null);
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
        setAjusteSaidaQtd(dadosNumericos.ajusteSaidaQtd || 0);
        setEstoqueOriginal({
          estoqueInicial: dadosNumericos.estoqueInicial ?? 0,
        });
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

  const handleChangeCustoUnitario = (texto) => {
  setCustoUnitario(aplicarMascaraMoeda(texto));
  if (erros.custoUnitario) setErros((prev) => ({ ...prev, custoUnitario: null }));
};

  const parseNumero = (valor) => Number((valor || "0").replace(",", ".")) || 0;

  const estoqueInicialNumero = parseNumero(estoqueInicial);
  const entradaQtdNumero = parseNumero(entradaQtd);
  const saidaQtdNumero = parseNumero(saidaQtd);
  const saldoPrevisto = calcularSaldoOperacao({
    estoqueInicial: estoqueInicialNumero,
    entradaQtd: entradaQtdNumero,
    saidaQtd: saidaQtdNumero,
    ajusteSaidaQtd,
  });

  // Só os campos de estoque que o usuário alterou. Os demais ficam como estão no
  // banco, para não desfazer vendas, entradas ou perdas registradas enquanto a
  // tela estava aberta.
  const camposEstoqueAlterados = () => {
    const alterados = {};
    if (!estoqueOriginal) return alterados;
    if (estoqueInicialNumero !== estoqueOriginal.estoqueInicial) alterados.estoqueInicial = estoqueInicialNumero;
    return alterados;
  };

  const validarNumero = (valor) => {
    const numero = parseNumero(valor);
    return valor && (isNaN(numero) || numero < 0);
  };

  const validar = () => {
    const novosErros = {};

    if (!nome.trim()) novosErros.nome = "Informe o nome do produto.";

    const precoNumero = parseNumero(preco);
    if (!preco || precoNumero <= 0) novosErros.preco = "Informe um preço válido.";

    if (validarNumero(custoUnitario)) {
      novosErros.custoUnitario = "Informe um custo válido.";
    } else if (parseNumero(custoUnitario) > precoNumero) {
      novosErros.custoUnitario = "O custo não pode ser maior que o preço de venda.";
    }

    if (validarNumero(estoqueInicial)) novosErros.estoqueInicial = "Informe uma quantidade válida.";
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
        categoriaProduto,
        unidade: UNIDADE_PADRAO,
        image: urlFoto,
        observacoes: observacoes.trim(),
        limiteEstoqueBaixo: Number(limiteEstoqueBaixo) || 5,
        // Edição manual do custo corrige o custo médio usado nas próximas vendas
        custoUnitario: parseNumero(custoUnitario),
        custoMedio: parseNumero(custoUnitario),
      });

      const alterados = camposEstoqueAlterados();

      if (caixaAberto && operacaoId) {
        if (existeNaOperacaoAtual) {
          // Entradas não são editadas aqui: vão pelo botão ENTRADA, com custo
          await atualizarProdutoDaOperacao(operacaoId, produtoId, {
            ...alterados,
            nome: nome.trim(),
            image: urlFoto,
          });
        } else {
          // Produto que ficou fora do caixa aberto entra com o estoque atual,
          // como na abertura do caixa
          const produtoAtual = produtos.find((p) => p.id === produtoId);
          await adicionarProdutoAOperacao(operacaoId, {
            id: produtoId,
            title: nome.trim(),
            unidade: UNIDADE_PADRAO,
            image: urlFoto,
            estoque: produtoAtual?.estoque ?? 0,
          });
        }
      } else if (Object.keys(alterados).length > 0) {
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
          <ActivityIndicator size="large" color="#1A1A1A" />
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
            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
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
              <Ionicons name="camera-outline" size={28} color="#6B6B6B" />
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
              placeholderTextColor="#9E9E9E"
            />
          </InputContainer>
          {erros.nome && <ErrorText>{erros.nome}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Vender como</Label>
          <CategoryOptions>
            <CategoryButton selected={categoria === "produtos"} onPress={() => setCategoria("produtos")}>
              <CategoryButtonText selected={categoria === "produtos"}>Produto</CategoryButtonText>
            </CategoryButton>
            <CategoryButton selected={categoria === "ingressos"} onPress={() => setCategoria("ingressos")}>
              <CategoryButtonText selected={categoria === "ingressos"}>Ingresso</CategoryButtonText>
            </CategoryButton>
          </CategoryOptions>
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

        <Row>
          <InputGroup style={{ flex: 1, marginRight: 10 }}>
            <Label>Preço (R$)</Label>
            <InputContainer hasError={!!erros.preco}>
              <Input
                value={preco}
                onChangeText={handleChangePreco}
                placeholder="0,00"
                keyboardType="numeric"
                placeholderTextColor="#9E9E9E"
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
                placeholderTextColor="#9E9E9E"
              />
            </InputContainer>
            {erros.estoqueInicial && <ErrorText>{erros.estoqueInicial}</ErrorText>}
          </InputGroup>
        </Row>

        <Row>
          <InputGroup style={{ flex: 1, marginRight: 10 }}>
            <Label>Entrada (Qtd.)</Label>
            <InputContainer style={{ backgroundColor: "#F1F1EB" }}>
              <Input value={entradaQtd} editable={false} style={{ color: "#6B6B6B" }} />
            </InputContainer>
          </InputGroup>

          <InputGroup style={{ flex: 1 }}>
            <Label>Valor Entradas (R$)</Label>
            <InputContainer style={{ backgroundColor: "#F1F1EB" }}>
              <Input value={valorEntradas} editable={false} style={{ color: "#6B6B6B" }} />
            </InputContainer>
          </InputGroup>
        </Row>
        <HelperText>
          Entradas de mercadoria agora são registradas só pelo botão ENTRADA (no Controle do
          Dia ou no + do Estoque), que pede o custo da compra e atualiza o custo médio.
        </HelperText>

        <Row>
          <InputGroup style={{ flex: 1, marginRight: 10 }}>
            <Label>Saída / Venda (Qtd.)</Label>
            <InputContainer style={{ backgroundColor: "#F1F1EB" }}>
              <Input value={saidaQtd} editable={false} style={{ color: "#6B6B6B" }} />
            </InputContainer>
          </InputGroup>

          <InputGroup style={{ flex: 1 }}>
            <Label>Valor Saídas (R$)</Label>
            <InputContainer style={{ backgroundColor: "#F1F1EB" }}>
              <Input value={valorSaidas} editable={false} style={{ color: "#6B6B6B" }} />
            </InputContainer>
          </InputGroup>
        </Row>

        <Row>
          <InputGroup style={{ flex: 1 }}>
            <Label>Custo Unitário (R$)</Label>
            <InputContainer hasError={!!erros.custoUnitario}>
              <Input
                value={custoUnitario}
                onChangeText={handleChangeCustoUnitario}
                placeholder="0,00"
                keyboardType="numeric"
                placeholderTextColor="#9E9E9E"
              />
            </InputContainer>
            {erros.custoUnitario && <ErrorText>{erros.custoUnitario}</ErrorText>}
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
              placeholderTextColor="#9E9E9E"
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
              placeholderTextColor="#9E9E9E"
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