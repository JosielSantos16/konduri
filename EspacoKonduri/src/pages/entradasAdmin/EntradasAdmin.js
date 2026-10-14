import React, { useState, useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Calendario from '../../components/painel/calendario/Calendario';
import { auth } from '../../firebase/fireBaseCondig';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { formatPrice } from '../../utils/formatPrice';
import { formatarDataComDia } from '../../utils/formatDateTime';
import { METODOS_PAGAMENTO } from '../../utils/metodosPagamento';
import { configDaData, resumirEntradasPorDia, vagasRestantes } from '../../utils/entradas';
import {
  subscribeToConfigEntradas,
  subscribeToOcupacao,
  salvarPadroesEntradas,
  salvarDataEspecial,
  removerDataEspecial,
} from '../../services/queries/entradasQueries';
import { subscribeToVendasPorPeriodo } from '../../services/queries/vendasQueries';
import {
  Container,
  Scroll,
  Header,
  BackButton,
  HeaderTextos,
  HeaderTitle,
  HeaderSubtitle,
  Card,
  CardTitulo,
  Linha,
  Rotulo,
  Valor,
  TextoSuave,
  Label,
  Campo,
  InputContainer,
  Input,
  InputTexto,
  Prefixo,
  BotaoPrincipal,
  BotaoPrincipalTexto,
  BotaoSecundario,
  BotaoSecundarioTexto,
  ItemLista,
  ItemInfo,
  ItemTitulo,
  ItemDetalhe,
  TabelaLinha,
  Coluna,
} from '../../components/entradas/entradasStyle';

const DIAS_PREVISAO = 14;

function aplicarMascaraMoeda(texto) {
  const centavos = parseInt(texto.replace(/\D/g, '') || '0', 10);
  return (centavos / 100).toFixed(2).replace('.', ',');
}
const paraNumero = (texto) => Number((texto || '').replace(',', '.')) || 0;
const moedaParaTexto = (valor) => (valor ?? 0).toFixed(2).replace('.', ',');
const somarDias = (data, dias) => new Date(data.getFullYear(), data.getMonth(), data.getDate() + dias);

function SeletorData({ valor, onChange }) {
  return (
    <Calendario
      value={valor}
      onChange={onChange}
      renderTrigger={({ onPress }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flex: 1 }}>
          <InputContainer pointerEvents="none">
            <InputTexto>{formatarDataComDia(paraDataISOLocal(valor))}</InputTexto>
            <Ionicons name="calendar-outline" size={16} color="#8A6A00" />
          </InputContainer>
        </TouchableOpacity>
      )}
    />
  );
}

export default function EntradasAdmin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const hoje = new Date();
  const hojeISO = paraDataISOLocal(hoje);
  const fimPrevisaoISO = paraDataISOLocal(somarDias(hoje, DIAS_PREVISAO - 1));

  const [config, setConfig] = useState(null);
  const [ocupacao, setOcupacao] = useState({});

  // Padrões
  const [valorPadrao, setValorPadrao] = useState('');
  const [lotacaoPadrao, setLotacaoPadrao] = useState('');
  const [salvandoPadroes, setSalvandoPadroes] = useState(false);

  // Data especial
  const [dataEspecial, setDataEspecial] = useState(hoje);
  const [valorEspecial, setValorEspecial] = useState('');
  const [lotacaoEspecial, setLotacaoEspecial] = useState('');
  const [semLimiteEspecial, setSemLimiteEspecial] = useState(false);

  // Relatório
  const [relatorioInicio, setRelatorioInicio] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [relatorioFim, setRelatorioFim] = useState(hoje);
  const [vendasRelatorio, setVendasRelatorio] = useState(null);

  useEffect(
    () =>
      subscribeToConfigEntradas((dados) => {
        setConfig(dados);
        setValorPadrao(moedaParaTexto(dados.valorPadrao));
        setLotacaoPadrao(dados.lotacaoPadrao === null ? '' : String(dados.lotacaoPadrao));
      }),
    []
  );
  useEffect(() => subscribeToOcupacao(hojeISO, fimPrevisaoISO, setOcupacao), [hojeISO, fimPrevisaoISO]);

  const inicioISO = paraDataISOLocal(relatorioInicio <= relatorioFim ? relatorioInicio : relatorioFim);
  const fimISO = paraDataISOLocal(relatorioInicio <= relatorioFim ? relatorioFim : relatorioInicio);
  useEffect(() => {
    setVendasRelatorio(null);
    return subscribeToVendasPorPeriodo(inicioISO, fimISO, setVendasRelatorio);
  }, [inicioISO, fimISO]);

  const relatorio = useMemo(() => (vendasRelatorio ? resumirEntradasPorDia(vendasRelatorio) : null), [vendasRelatorio]);

  if (!config) {
    return (
      <Container style={{ paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </Container>
    );
  }

  const handleSalvarPadroes = async () => {
    const valor = paraNumero(valorPadrao);
    const lotacaoTexto = lotacaoPadrao.trim();
    const lotacao = lotacaoTexto === '' ? null : parseInt(lotacaoTexto, 10);
    if (valor < 0 || (lotacao !== null && (isNaN(lotacao) || lotacao < 1))) {
      Alert.alert('Valores inválidos', 'Informe um valor válido e uma lotação maior que zero (ou deixe em branco para sem limite).');
      return;
    }
    setSalvandoPadroes(true);
    try {
      await salvarPadroesEntradas({ valorPadrao: valor, lotacaoPadrao: lotacao }, { usuarioUid: auth.currentUser?.uid });
      Alert.alert('Salvo', 'Valor e lotação padrão atualizados.');
    } catch (erro) {
      console.error('Erro ao salvar padrões de entrada:', erro);
      Alert.alert('Não foi possível salvar', 'Verifique a internet e tente novamente.');
    } finally {
      setSalvandoPadroes(false);
    }
  };

  const handleSalvarDataEspecial = async () => {
    const dataISO = paraDataISOLocal(dataEspecial);
    const valor = valorEspecial.trim() === '' ? null : paraNumero(valorEspecial);
    let lotacao;
    if (semLimiteEspecial) lotacao = null;
    else if (lotacaoEspecial.trim() !== '') lotacao = parseInt(lotacaoEspecial, 10);

    if (valor === null && lotacao === undefined) {
      Alert.alert('Nada para salvar', 'Informe um valor, uma lotação, ou marque "sem limite" para essa data.');
      return;
    }
    if (lotacao !== undefined && lotacao !== null && (isNaN(lotacao) || lotacao < 1)) {
      Alert.alert('Lotação inválida', 'Informe um número maior que zero.');
      return;
    }
    try {
      await salvarDataEspecial(dataISO, { valor, lotacao });
      setValorEspecial('');
      setLotacaoEspecial('');
      setSemLimiteEspecial(false);
    } catch (erro) {
      console.error('Erro ao salvar data especial:', erro);
      Alert.alert('Não foi possível salvar', 'Verifique a internet e tente novamente.');
    }
  };

  const handleRemoverDataEspecial = (dataISO) => {
    Alert.alert('Remover data especial', `${formatarDataComDia(dataISO)} volta a usar o valor e a lotação padrão.`, [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removerDataEspecial(dataISO).catch((e) => console.error(e)) },
    ]);
  };

  const datasEspeciais = Object.entries(config.datas || {})
    .filter(([dataISO]) => dataISO >= hojeISO)
    .sort(([a], [b]) => a.localeCompare(b));

  const diasPrevisao = Array.from({ length: DIAS_PREVISAO }, (_, i) => paraDataISOLocal(somarDias(hoje, i)));

  const descreverLotacao = (lotacao) => (lotacao === null ? 'sem limite' : `${lotacao} pessoas`);

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </BackButton>
        <HeaderTextos>
          <HeaderTitle>Entradas</HeaderTitle>
          <HeaderSubtitle>Valores, lotação, previsão e relatório</HeaderSubtitle>
        </HeaderTextos>
        <BotaoSecundario onPress={() => router.push('/portaria')}>
          <Ionicons name="ticket-outline" size={14} color="#1A1A1A" />
          <BotaoSecundarioTexto>Portaria</BotaoSecundarioTexto>
        </BotaoSecundario>
      </Header>

      <Scroll showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Padrões */}
        <Card>
          <CardTitulo>VALOR E LOTAÇÃO PADRÃO</CardTitulo>
          <Campo>
            <Label>Valor da entrada por pessoa</Label>
            <InputContainer>
              <Prefixo>R$</Prefixo>
              <Input value={valorPadrao} onChangeText={(t) => setValorPadrao(aplicarMascaraMoeda(t))} keyboardType="numeric" />
            </InputContainer>
          </Campo>
          <Campo>
            <Label>Lotação por dia</Label>
            <InputContainer>
              <Input
                value={lotacaoPadrao}
                onChangeText={(t) => setLotacaoPadrao(t.replace(/\D/g, ''))}
                keyboardType="number-pad"
                placeholder="Em branco = sem limite"
                placeholderTextColor="#9E9E9E"
              />
              <Prefixo>pessoas</Prefixo>
            </InputContainer>
          </Campo>
          <TextoSuave>
            O valor vale para as próximas entradas registradas. As que já foram registradas mantêm o valor da hora.
          </TextoSuave>
          <BotaoPrincipal onPress={handleSalvarPadroes} disabled={salvandoPadroes} style={{ marginTop: 12, marginBottom: 0 }}>
            {salvandoPadroes ? <ActivityIndicator color="#1A1A1A" /> : <BotaoPrincipalTexto>Salvar padrão</BotaoPrincipalTexto>}
          </BotaoPrincipal>
        </Card>

        {/* Datas especiais */}
        <Card>
          <CardTitulo>DATAS ESPECIAIS (FERIADOS, EVENTOS)</CardTitulo>
          <Campo>
            <Label>Data</Label>
            <SeletorData valor={dataEspecial} onChange={setDataEspecial} />
          </Campo>
          <Campo>
            <Label>Valor nesse dia (em branco = padrão)</Label>
            <InputContainer>
              <Prefixo>R$</Prefixo>
              <Input
                value={valorEspecial}
                onChangeText={(t) => setValorEspecial(t.trim() === '' ? '' : aplicarMascaraMoeda(t))}
                keyboardType="numeric"
                placeholder="padrão"
                placeholderTextColor="#9E9E9E"
              />
            </InputContainer>
          </Campo>
          <Campo>
            <Label>Lotação nesse dia (em branco = padrão)</Label>
            <InputContainer style={{ opacity: semLimiteEspecial ? 0.4 : 1 }}>
              <Input
                value={lotacaoEspecial}
                onChangeText={(t) => setLotacaoEspecial(t.replace(/\D/g, ''))}
                keyboardType="number-pad"
                editable={!semLimiteEspecial}
                placeholder="padrão"
                placeholderTextColor="#9E9E9E"
              />
              <Prefixo>pessoas</Prefixo>
            </InputContainer>
            <Linha>
              <Rotulo>Sem limite nesse dia</Rotulo>
              <Switch
                value={semLimiteEspecial}
                onValueChange={setSemLimiteEspecial}
                trackColor={{ false: '#E6E6E0', true: '#F2DC7C' }}
                thumbColor={semLimiteEspecial ? '#1A1A1A' : '#FFFFFF'}
              />
            </Linha>
          </Campo>
          <BotaoPrincipal onPress={handleSalvarDataEspecial} style={{ marginBottom: 8 }}>
            <Ionicons name="add" size={18} color="#1A1A1A" />
            <BotaoPrincipalTexto>Salvar data especial</BotaoPrincipalTexto>
          </BotaoPrincipal>

          {datasEspeciais.length === 0 && <TextoSuave>Nenhuma data especial cadastrada.</TextoSuave>}
          {datasEspeciais.map(([dataISO], indice) => {
            const { valor, lotacao } = configDaData(config, dataISO);
            return (
              <ItemLista key={dataISO} primeiro={indice === 0}>
                <ItemInfo>
                  <ItemTitulo>{formatarDataComDia(dataISO)}</ItemTitulo>
                  <ItemDetalhe>
                    {formatPrice(valor)} · {descreverLotacao(lotacao)}
                  </ItemDetalhe>
                </ItemInfo>
                <BotaoSecundario cor="#C0392B" onPress={() => handleRemoverDataEspecial(dataISO)}>
                  <Ionicons name="trash-outline" size={14} color="#C0392B" />
                </BotaoSecundario>
              </ItemLista>
            );
          })}
        </Card>

        {/* Previsão */}
        <Card>
          <CardTitulo>PREVISÃO — PRÓXIMOS {DIAS_PREVISAO} DIAS</CardTitulo>
          <TabelaLinha primeira>
            <Coluna cabecalho flex={1.6} alinhar="left">DIA</Coluna>
            <Coluna cabecalho>VALOR</Coluna>
            <Coluna cabecalho>RESERVAS</Coluna>
            <Coluna cabecalho>VAGAS</Coluna>
          </TabelaLinha>
          {diasPrevisao.map((dataISO) => {
            const { valor, lotacao } = configDaData(config, dataISO);
            const reservadas = ocupacao[dataISO] || 0;
            const vagas = vagasRestantes(lotacao, reservadas);
            return (
              <TabelaLinha key={dataISO}>
                <Coluna flex={1.6} alinhar="left">{formatarDataComDia(dataISO)}</Coluna>
                <Coluna>{formatPrice(valor)}</Coluna>
                <Coluna cor={reservadas > 0 ? '#1A1A1A' : '#9E9E9E'}>{reservadas}</Coluna>
                <Coluna cor={vagas === 0 ? '#C0392B' : undefined}>{vagas === null ? '—' : vagas}</Coluna>
              </TabelaLinha>
            );
          })}
        </Card>

        {/* Relatório */}
        <Card>
          <CardTitulo>RELATÓRIO DE ENTRADAS</CardTitulo>
          <Linha>
            <SeletorData valor={relatorioInicio} onChange={setRelatorioInicio} />
            <Rotulo style={{ marginHorizontal: 8 }}>até</Rotulo>
            <SeletorData valor={relatorioFim} onChange={setRelatorioFim} />
          </Linha>

          {!relatorio ? (
            <ActivityIndicator color="#1A1A1A" style={{ marginVertical: 16 }} />
          ) : (
            <>
              <TabelaLinha primeira style={{ marginTop: 8 }}>
                <Coluna cabecalho flex={1.6} alinhar="left">DIA</Coluna>
                <Coluna cabecalho>PAGANTES</Coluna>
                <Coluna cabecalho>CORTESIAS</Coluna>
                <Coluna cabecalho>TOTAL</Coluna>
              </TabelaLinha>
              {relatorio.dias.length === 0 && <TextoSuave style={{ marginTop: 6 }}>Nenhuma entrada no período.</TextoSuave>}
              {relatorio.dias.map((dia) => (
                <TabelaLinha key={dia.data}>
                  <Coluna flex={1.6} alinhar="left">{formatarDataComDia(dia.data)}</Coluna>
                  <Coluna>{dia.pagantes}</Coluna>
                  <Coluna>{dia.cortesias}</Coluna>
                  <Coluna>{formatPrice(dia.total)}</Coluna>
                </TabelaLinha>
              ))}
              {relatorio.dias.length > 0 && (
                <>
                  <TabelaLinha>
                    <Coluna flex={1.6} alinhar="left" cor="#1A1A1A">TOTAL</Coluna>
                    <Coluna cor="#1A1A1A">{relatorio.totais.pagantes}</Coluna>
                    <Coluna cor="#1A1A1A">{relatorio.totais.cortesias}</Coluna>
                    <Coluna cor="#1A1A1A">{formatPrice(relatorio.totais.total)}</Coluna>
                  </TabelaLinha>
                  {Object.entries(METODOS_PAGAMENTO).map(([metodo, info]) => (
                    <Linha key={metodo}>
                      <Rotulo>{info.label}</Rotulo>
                      <Valor>{formatPrice(relatorio.totais.porMetodo[metodo] || 0)}</Valor>
                    </Linha>
                  ))}
                </>
              )}
            </>
          )}
        </Card>
      </Scroll>
    </Container>
  );
}
