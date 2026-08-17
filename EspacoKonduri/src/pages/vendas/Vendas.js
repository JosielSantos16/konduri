import React, { useState, useEffect } from "react";
import { Alert, ActivityIndicator, Modal, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatPrice } from "../../utils/formatPrice";
import { formatHora, formatDataFiltro } from "../../utils/formatDateTime";
import {
  subscribeToVendasPorData,
  buscarDiasComVendasNoMes,
} from "../../services/queries/vendasQueries";
import { useAuth } from "../../hooks/useAuth";
import {
  salvarComissao,
  subscribeToComissao,
  buscarDiasComComissaoNoMes,
} from "../../services/queries/comissaoQueries";
import Calendario from "../../components/painel/calendario/Calendario";
import {
  Container,
  Header,
  Title,
  Subtitle,
  FilterRow,
  DateFilterButton,
  DateFilterText,
  TotalRecordsText,
  SalesList,
  SaleCard,
  SaleLeft,
  SaleIconContainer,
  SaleProductImage,
  MetodoBadge,
  SaleInfo,
  SaleTitle,
  SaleDetails,
  SaleRight,
  SalePrice,
  SummaryBar,
  SummaryLabel,
  SummaryValue,
  EmptyState,
  EmptyStateText,
  BottomNavBar,
  NavItem,
  NavText,
  ComissaoSection,
  ComissaoSectionTitle,
  ComissaoCard,
  ComissaoHeader,
  ComissaoNome,
  ComissaoBase,
  ComissaoInputRow,
  ComissaoInputContainer,
  ComissaoInput,
  ComissaoPercentSymbol,
  ComissaoSaveButton,
  ComissaoSaveButtonText,
  ComissaoSavedBox,
  ComissaoSavedText,
  ComissaoSavedValue,
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
} from "./vendasStyles";

function paraDataISO(data) {
  return data.toISOString().split("T")[0];
}

function ComissaoAtendenteCard({
  dataISO,
  responsavelUid,
  responsavelNome,
  baseCalculo,
  adminUid,
}) {
  const [comissaoSalva, setComissaoSalva] = useState(null);
  const [percentualInput, setPercentualInput] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToComissao(
      dataISO,
      responsavelUid,
      (comissao) => {
        setComissaoSalva(comissao);
        if (comissao) setPercentualInput(String(comissao.percentual));
      }
    );
    return unsubscribe;
  }, [dataISO, responsavelUid]);

  const handleChangePercentual = (texto) => {
    setPercentualInput(texto.replace(/[^0-9,.]/g, ""));
  };

  const handleSalvar = async () => {
    const percentualNumero = Number(percentualInput.replace(",", "."));

    if (!percentualInput || isNaN(percentualNumero) || percentualNumero < 0) {
      Alert.alert("Percentual inválido", "Informe um percentual válido.");
      return;
    }

    setSalvando(true);
    try {
      await salvarComissao({
        dataISO,
        responsavelUid,
        responsavelNome,
        percentual: percentualNumero,
        baseCalculo,
        definidoPorUid: adminUid,
      });
    } catch (erro) {
      console.error("Erro ao salvar comissão:", erro);
      Alert.alert(
        "Erro",
        "Não foi possível salvar a comissão. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ComissaoCard>
      <ComissaoHeader>
        <ComissaoNome>{responsavelNome}</ComissaoNome>
        <ComissaoBase>Base: {formatPrice(baseCalculo)}</ComissaoBase>
      </ComissaoHeader>

      <ComissaoInputRow>
        <ComissaoInputContainer>
          <ComissaoInput
            value={percentualInput}
            onChangeText={handleChangePercentual}
            placeholder="Percentual"
            placeholderTextColor="#A99B8F"
            keyboardType="decimal-pad"
          />
          <ComissaoPercentSymbol>%</ComissaoPercentSymbol>
        </ComissaoInputContainer>

        <ComissaoSaveButton onPress={handleSalvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <ComissaoSaveButtonText>SALVAR</ComissaoSaveButtonText>
          )}
        </ComissaoSaveButton>
      </ComissaoInputRow>

      {comissaoSalva && (
        <ComissaoSavedBox>
          <ComissaoSavedText>
            Comissão definida ({comissaoSalva.percentual}%)
          </ComissaoSavedText>
          <ComissaoSavedValue>
            {formatPrice(comissaoSalva.valorComissao)}
          </ComissaoSavedValue>
        </ComissaoSavedBox>
      )}
    </ComissaoCard>
  );
}

// Modal com o detalhe completo da venda tocada
function DetalheVendaModal({ venda, onClose }) {
  if (!venda) return null;

  const itens = venda.itens || [];
  const totalUnidades = itens.reduce((soma, item) => soma + item.qty, 0);

  return (
    <Modal visible={!!venda} transparent animationType="slide" onRequestClose={onClose}>
      <DetalheOverlay>
        <DetalheContent>
          <DetalheHeader>
            <DetalheTitle>Detalhes da Venda</DetalheTitle>
            <DetalheCloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color="#3D2C22" />
            </DetalheCloseButton>
          </DetalheHeader>

          <DetalheInfoRow>
            <DetalheInfoLabel>Horário</DetalheInfoLabel>
            <DetalheInfoValue>{formatHora(venda.data)}</DetalheInfoValue>
          </DetalheInfoRow>
          <DetalheInfoRow>
            <DetalheInfoLabel>Atendente</DetalheInfoLabel>
            <DetalheInfoValue>{venda.responsavelNome || "Desconhecido"}</DetalheInfoValue>
          </DetalheInfoRow>
          <DetalheInfoRow>
            <DetalheInfoLabel>Forma de pagamento</DetalheInfoLabel>
            <DetalheInfoValue>{venda.metodo === "pix" ? "Pix" : "Dinheiro"}</DetalheInfoValue>
          </DetalheInfoRow>
          <DetalheInfoRow>
            <DetalheInfoLabel>Total de unidades</DetalheInfoLabel>
            <DetalheInfoValue>{totalUnidades}</DetalheInfoValue>
          </DetalheInfoRow>

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
              <DetalheItemSubtotal>
                {formatPrice(produto.qty * produto.price)}
              </DetalheItemSubtotal>
            </DetalheItemRow>
          ))}

          <DetalheTotalRow>
            <DetalheTotalLabel>Total</DetalheTotalLabel>
            <DetalheTotalValue>{formatPrice(venda.total)}</DetalheTotalValue>
          </DetalheTotalRow>
        </DetalheContent>
      </DetalheOverlay>
    </Modal>
  );
}

export default function Vendas() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const [filtroData, setFiltroData] = useState(new Date());
  const [vendasFiltradas, setVendasFiltradas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [diasComVenda, setDiasComVenda] = useState([]);
  const [diasComComissao, setDiasComComissao] = useState([]);
  const [vendaSelecionada, setVendaSelecionada] = useState(null);

  const dataISO = paraDataISO(filtroData);

  const carregarDadosDoMes = async (anoMes) => {
    try {
      const [dias, diasComissao] = await Promise.all([
        buscarDiasComVendasNoMes(anoMes),
        buscarDiasComComissaoNoMes(anoMes),
      ]);
      setDiasComVenda(dias);
      setDiasComComissao(diasComissao);
    } catch (erro) {
      console.error("Erro ao buscar dados do mês:", erro);
    }
  };

  useEffect(() => {
    const anoMesAtual = dataISO.slice(0, 7);
    carregarDadosDoMes(anoMesAtual);
  }, []);

  useEffect(() => {
    setCarregando(true);
    const unsubscribe = subscribeToVendasPorData(dataISO, (lista) => {
      setVendasFiltradas(lista);
      setCarregando(false);
    });
    return unsubscribe;
  }, [dataISO]);

  const vendasOrdenadas = [...vendasFiltradas].reverse();
  const totalPeriodo = vendasFiltradas.reduce((sum, v) => sum + v.total, 0);

  const atendentesDoDia = {};
  vendasFiltradas.forEach((venda) => {
    const uid = venda.responsavelUid;
    if (!uid) return;

    if (!atendentesDoDia[uid]) {
      atendentesDoDia[uid] = {
        responsavelUid: uid,
        responsavelNome: venda.responsavelNome || "Sem nome",
        baseCalculo: 0,
      };
    }

    const subtotalProdutos = (venda.itens || [])
      .filter((item) => item.category === "produtos")
      .reduce((s, item) => s + item.qty * item.price, 0);

    atendentesDoDia[uid].baseCalculo += subtotalProdutos;
  });

  const listaAtendentes = Object.values(atendentesDoDia);

  const numeroDaVenda = (venda) => {
    const idx = vendasFiltradas.findIndex((v) => v.id === venda.id);
    return String(idx + 1).padStart(4, "0");
  };

  // Puxa a tela pra baixo para forçar reconferência dos dados —
  // os dados já são tempo real (onSnapshot), então isso serve
  // principalmente como feedback visual e reconexão em caso de instabilidade
  const handleRefresh = async () => {
    setAtualizando(true);
    const anoMesAtual = dataISO.slice(0, 7);
    await carregarDadosDoMes(anoMesAtual);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setAtualizando(false);
  };

  const renderItem = ({ item }) => {
    const itens = item.itens || [];
    const primeiroItem = itens[0];
    const outrosItensCount = itens.length - 1;
    const totalUnidades = itens.reduce((soma, i) => soma + i.qty, 0);

    const nomeExibido = primeiroItem
      ? outrosItensCount > 0
        ? `${primeiroItem.title} +${outrosItensCount} ${outrosItensCount === 1 ? "item" : "itens"}`
        : primeiroItem.title
      : "Venda sem itens";

    return (
      <SaleCard onPress={() => setVendaSelecionada(item)}>
        <SaleLeft>
          <SaleIconContainer>
            {primeiroItem?.image ? (
              <SaleProductImage source={{ uri: primeiroItem.image }} resizeMode="cover" />
            ) : (
              <Ionicons name="cube-outline" size={20} color="#C9BBA8" />
            )}
          </SaleIconContainer>
          <SaleInfo>
            <SaleTitle numberOfLines={1}>{nomeExibido}</SaleTitle>
            <SaleDetails>
              Venda #{numeroDaVenda(item)} • {formatHora(item.data)} • {totalUnidades}{" "}
              {totalUnidades === 1 ? "unidade" : "unidades"}
            </SaleDetails>
          </SaleInfo>
        </SaleLeft>

        <SaleRight>
          <MetodoBadge type={item.metodo}>
            <Ionicons
              name={item.metodo === "pix" ? "qr-code-outline" : "cash-outline"}
              size={11}
              color={item.metodo === "pix" ? "#16A085" : "#27AE60"}
            />
          </MetodoBadge>
          <SalePrice>{formatPrice(item.total)}</SalePrice>
        </SaleRight>
      </SaleCard>
    );
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <Title>Vendas do Dia</Title>
        <Subtitle>Histórico de transações</Subtitle>

        <FilterRow>
          <Calendario
            value={filtroData}
            onChange={setFiltroData}
            diasComVenda={diasComVenda}
            diasComComissao={diasComComissao}
            onMonthChange={carregarDadosDoMes}
            renderTrigger={({ onPress }) => (
              <DateFilterButton onPress={onPress}>
                <Ionicons name="calendar-outline" size={16} color="#3D2C22" />
                <DateFilterText>{formatDataFiltro(filtroData)}</DateFilterText>
                <Ionicons name="chevron-down" size={14} color="#3D2C22" />
              </DateFilterButton>
            )}
          />

          <TotalRecordsText>
            {vendasFiltradas.length} Vendas registradas
          </TotalRecordsText>
        </FilterRow>
      </Header>

      {carregando ? (
        <EmptyState>
          <ActivityIndicator size="large" color="#2E5A1E" />
        </EmptyState>
      ) : vendasFiltradas.length === 0 ? (
        <EmptyState>
          <Ionicons name="receipt-outline" size={40} color="#C9BBAC" />
          <EmptyStateText>Nenhuma venda registrada nessa data.</EmptyStateText>
        </EmptyState>
      ) : (
        <>
          <SalesList
            data={vendasOrdenadas}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={handleRefresh}
                colors={["#2E5A1E"]}
                tintColor="#2E5A1E"
              />
            }
          />

          {listaAtendentes.length > 0 && (
            <ComissaoSection>
              <ComissaoSectionTitle>
                COMISSÃO DO DIA (SOMENTE PRODUTOS)
              </ComissaoSectionTitle>
              {listaAtendentes.map((atendente) => (
                <ComissaoAtendenteCard
                  key={atendente.responsavelUid}
                  dataISO={dataISO}
                  responsavelUid={atendente.responsavelUid}
                  responsavelNome={atendente.responsavelNome}
                  baseCalculo={atendente.baseCalculo}
                  adminUid={usuario?.uid}
                />
              ))}
            </ComissaoSection>
          )}
        </>
      )}

      {vendasFiltradas.length > 0 && (
        <SummaryBar>
          <SummaryLabel>SOMA TOTAL PERÍODO:</SummaryLabel>
          <SummaryValue>
            {vendasFiltradas.length} Vendas — {formatPrice(totalPeriodo)}
          </SummaryValue>
        </SummaryBar>
      )}

      <BottomNavBar style={{ paddingBottom: 10 + insets.bottom }}>
        <NavItem active={false} onPress={() => router.push("/painel")}>
          <Ionicons name="grid-outline" size={22} color="#8C7355" />
          <NavText active={false}>Painel</NavText>
        </NavItem>

        <NavItem active={true}>
          <Ionicons name="receipt-outline" size={22} color="#E67E22" />
          <NavText active={true}>Vendas</NavText>
        </NavItem>

        <NavItem active={false} onPress={() => router.push("/estoque")}>
          <Ionicons name="cube-outline" size={22} color="#8C7355" />
          <NavText active={false}>Estoque</NavText>
        </NavItem>

        <NavItem
          active={false}
          onPress={() => alert("Indo para aba Perfil...")}
        >
          <Ionicons name="person-outline" size={22} color="#8C7355" />
          <NavText active={false}>Perfil</NavText>
        </NavItem>
      </BottomNavBar>

      <DetalheVendaModal venda={vendaSelecionada} onClose={() => setVendaSelecionada(null)} />
    </Container>
  );
}