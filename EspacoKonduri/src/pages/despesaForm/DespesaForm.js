import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Calendario from '../../components/painel/calendario/Calendario';
import { useAuth } from '../../hooks/useAuth';
import { paraDataISOLocal } from '../../utils/dataLocal';
import {
  buscarDespesaPorId,
  criarDespesa,
  atualizarDespesa,
  excluirDespesa,
  marcarPagamento,
  encerrarRecorrencia,
  alterarRecorrenteAPartirDe,
} from '../../services/queries/despesasQueries';
import {
  TIPOS_DESPESA,
  FORMAS_CALCULO,
  PERIODICIDADES,
  ROTULOS_PERIODICIDADE,
  CATEGORIAS_DESPESA,
  competenciaDe,
  deslocarCompetencia,
  formatarCompetencia,
  pagaNaCompetencia,
} from '../../utils/despesas';
import {
  Container,
  ScrollContainer,
  Header,
  HeaderLeft,
  BackButton,
  HeaderTitle,
  DeleteButton,
  InputGroup,
  Label,
  InputContainer,
  Input,
  InputPrefix,
  InputText,
  ErrorText,
  HelperText,
  SegmentOptions,
  SegmentButton,
  SegmentButtonText,
  ChipsWrap,
  Chip,
  ChipText,
  MonthSelector,
  MonthArrow,
  MonthLabel,
  SwitchRow,
  SwitchLabel,
  TextAreaContainer,
  TextArea,
  SaveButton,
  SaveButtonText,
  ErrorBox,
  GeneralErrorText,
  LoadingContainer,
} from './despesaFormStyle';

function aplicarMascaraMoeda(textoDigitado) {
  const apenasNumeros = textoDigitado.replace(/\D/g, '');
  const centavos = parseInt(apenasNumeros || '0', 10);
  return (centavos / 100).toFixed(2).replace('.', ',');
}

// Aceita até duas casas decimais com vírgula, ex: "2,5"
function aplicarMascaraPercentual(textoDigitado) {
  const limpo = textoDigitado.replace('.', ',').replace(/[^\d,]/g, '');
  const [inteiro, ...resto] = limpo.split(',');
  return resto.length ? `${inteiro},${resto.join('').slice(0, 2)}` : inteiro;
}

const parseNumero = (valor) => Number((valor || '0').replace(',', '.')) || 0;

function dataDeISO(dataISO) {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

function formatarDataCurta(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}

const PERIODICIDADES_VALOR = Object.values(PERIODICIDADES);
const PERIODICIDADES_PERCENTUAL = [PERIODICIDADES.UNICA, PERIODICIDADES.MENSAL];

export default function DespesaForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id: despesaId, competencia: competenciaParam } = useLocalSearchParams();
  const { usuario } = useAuth();

  // Mês em que a tela foi aberta: base para "pago neste mês" e "alterar a partir de"
  const competenciaContexto = competenciaParam || competenciaDe();
  const editando = !!despesaId;

  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [original, setOriginal] = useState(null);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);

  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState(TIPOS_DESPESA.FIXO);
  const [forma, setForma] = useState(FORMAS_CALCULO.VALOR);
  const [categoria, setCategoria] = useState(null);
  const [valor, setValor] = useState('');
  const [percentual, setPercentual] = useState('');
  const [periodicidade, setPeriodicidade] = useState(PERIODICIDADES.MENSAL);
  const [competencia, setCompetencia] = useState(competenciaContexto);
  const [dataVencimento, setDataVencimento] = useState(null);
  const [pago, setPago] = useState(false);
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    if (!editando) return;

    async function carregar() {
      try {
        const despesa = await buscarDespesaPorId(despesaId);
        if (!despesa) {
          setErroGeral('Despesa não encontrada.');
          return;
        }
        setOriginal(despesa);
        setDescricao(despesa.descricao || '');
        setTipo(despesa.tipo);
        setForma(despesa.forma);
        setCategoria(despesa.categoria);
        setValor(despesa.valor != null ? despesa.valor.toFixed(2).replace('.', ',') : '');
        setPercentual(despesa.percentual != null ? String(despesa.percentual).replace('.', ',') : '');
        setPeriodicidade(despesa.periodicidade);
        setCompetencia(despesa.competencia);
        setDataVencimento(despesa.dataVencimento ? dataDeISO(despesa.dataVencimento) : null);
        setPago(pagaNaCompetencia(despesa, competenciaContexto));
        setObservacao(despesa.observacao || '');
      } catch (erro) {
        console.error('Erro ao carregar despesa:', erro);
        setErroGeral('Não foi possível carregar a despesa.');
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [despesaId]);

  const formaEfetiva = tipo === TIPOS_DESPESA.FIXO ? FORMAS_CALCULO.VALOR : forma;
  const ehPercentual = formaEfetiva === FORMAS_CALCULO.PERCENTUAL;
  const recorrente = periodicidade !== PERIODICIDADES.UNICA;
  const opcoesPeriodicidade = ehPercentual ? PERIODICIDADES_PERCENTUAL : PERIODICIDADES_VALOR;
  const originalRecorrente = original && original.periodicidade !== PERIODICIDADES.UNICA;

  const selecionarTipo = (novoTipo) => {
    setTipo(novoTipo);
    if (novoTipo === TIPOS_DESPESA.FIXO) setForma(FORMAS_CALCULO.VALOR);
  };

  const selecionarForma = (novaForma) => {
    setForma(novaForma);
    if (novaForma === FORMAS_CALCULO.PERCENTUAL && !PERIODICIDADES_PERCENTUAL.includes(periodicidade)) {
      setPeriodicidade(PERIODICIDADES.MENSAL);
    }
  };

  const limparErro = (campo) => {
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: null }));
  };

  const validar = () => {
    const novosErros = {};
    if (!descricao.trim()) novosErros.descricao = 'Informe a descrição.';
    if (!categoria) novosErros.categoria = 'Escolha uma categoria.';
    if (ehPercentual) {
      const p = parseNumero(percentual);
      if (p <= 0 || p > 100) novosErros.percentual = 'Informe um percentual entre 0 e 100.';
    } else if (parseNumero(valor) <= 0) {
      novosErros.valor = 'Informe um valor maior que zero.';
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const montarDados = () => ({
    descricao: descricao.trim(),
    tipo,
    forma: formaEfetiva,
    categoria,
    valor: ehPercentual ? null : parseNumero(valor),
    percentual: ehPercentual ? parseNumero(percentual) : null,
    periodicidade,
    competencia,
    dataVencimento: dataVencimento ? paraDataISOLocal(dataVencimento) : null,
    observacao: observacao.trim(),
  });

  // Despesa única guarda pago/dataPagamento no próprio documento
  const camposPagamentoUnica = () => ({
    pago,
    dataPagamento: pago ? original?.dataPagamento || paraDataISOLocal() : null,
  });

  const salvarNovo = async () => {
    const dados = montarDados();
    const pagamento = recorrente
      ? { pagamentos: pago ? { [competencia]: paraDataISOLocal() } : {} }
      : camposPagamentoUnica();

    await criarDespesa({ ...dados, ...pagamento }, { usuarioUid: usuario?.uid, usuarioNome: usuario?.nome });
  };

  const salvarEdicao = async (aPartirDoContexto) => {
    const dados = montarDados();

    if (aPartirDoContexto) {
      const { id: novoId } = await alterarRecorrenteAPartirDe(original, dados, competenciaContexto);
      if (pago !== pagaNaCompetencia(original, competenciaContexto)) {
        await marcarPagamento({ id: novoId, periodicidade }, competenciaContexto, pago);
      }
      return;
    }

    if (!recorrente) {
      await atualizarDespesa(original.id, { ...dados, ...camposPagamentoUnica() });
      return;
    }

    await atualizarDespesa(original.id, dados);
    // Se era única e virou recorrente, o pagamento passa a ser controlado por mês
    const pagoAntes = originalRecorrente ? pagaNaCompetencia(original, competenciaContexto) : false;
    if (pago !== pagoAntes) {
      await marcarPagamento({ id: original.id, periodicidade }, competenciaContexto, pago);
    }
  };

  const executarSalvar = async (aPartirDoContexto = false) => {
    setSalvando(true);
    setErroGeral(null);
    try {
      if (editando) await salvarEdicao(aPartirDoContexto);
      else await salvarNovo();
      router.back();
    } catch (erro) {
      console.error('Erro ao salvar despesa:', erro);
      setErroGeral('Não foi possível salvar a despesa. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvar = () => {
    if (!validar() || salvando) return;

    // Mudança de valor numa recorrente que já valia em meses anteriores:
    // pergunta se altera o histórico ou só daqui para frente
    const dados = montarDados();
    const mudouValor =
      editando &&
      originalRecorrente &&
      recorrente &&
      (dados.tipo !== original.tipo ||
        dados.forma !== original.forma ||
        dados.valor !== (original.valor ?? null) ||
        dados.percentual !== (original.percentual ?? null) ||
        dados.periodicidade !== original.periodicidade);

    if (mudouValor && competenciaContexto > original.competencia) {
      Alert.alert(
        'Aplicar alteração',
        `Esta despesa vale desde ${formatarCompetencia(original.competencia)}. Onde aplicar a mudança?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Todos os meses', onPress: () => executarSalvar(false) },
          {
            text: `A partir de ${formatarCompetencia(competenciaContexto)}`,
            onPress: () => executarSalvar(true),
          },
        ]
      );
      return;
    }

    executarSalvar(false);
  };

  const executarExclusao = async (acao) => {
    setSalvando(true);
    try {
      await acao();
      router.back();
    } catch (erro) {
      console.error('Erro ao excluir despesa:', erro);
      setErroGeral('Não foi possível excluir a despesa. Tente novamente.');
      setSalvando(false);
    }
  };

  const handleExcluir = () => {
    if (!originalRecorrente) {
      Alert.alert('Excluir despesa', `Excluir "${original.descricao}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => executarExclusao(() => excluirDespesa(original.id)) },
      ]);
      return;
    }

    Alert.alert(
      'Excluir despesa recorrente',
      `"${original.descricao}" se repete todo mês. O que deseja fazer?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir de todos os meses',
          style: 'destructive',
          onPress: () => executarExclusao(() => excluirDespesa(original.id)),
        },
        {
          text: `Encerrar a partir de ${formatarCompetencia(competenciaContexto)}`,
          onPress: () => executarExclusao(() => encerrarRecorrencia(original, competenciaContexto)),
        },
      ]
    );
  };

  if (carregando) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#2E5A1E" />
      </LoadingContainer>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Header>
          <HeaderLeft>
            <BackButton onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#2E5A1E" />
            </BackButton>
            <HeaderTitle>{editando ? 'Editar despesa' : 'Nova despesa'}</HeaderTitle>
          </HeaderLeft>
          {editando && original && (
            <DeleteButton onPress={handleExcluir} disabled={salvando}>
              <Ionicons name="trash-outline" size={22} color="#C0392B" />
            </DeleteButton>
          )}
        </Header>

        {erroGeral && (
          <ErrorBox>
            <GeneralErrorText>{erroGeral}</GeneralErrorText>
          </ErrorBox>
        )}

        <InputGroup>
          <Label>Descrição</Label>
          <InputContainer hasError={!!erros.descricao}>
            <Input
              value={descricao}
              onChangeText={(texto) => {
                setDescricao(texto);
                limparErro('descricao');
              }}
              placeholder="Ex: Energia elétrica"
              placeholderTextColor="#A99B8F"
            />
          </InputContainer>
          {erros.descricao && <ErrorText>{erros.descricao}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label>Tipo</Label>
          <SegmentOptions>
            <SegmentButton selected={tipo === TIPOS_DESPESA.FIXO} onPress={() => selecionarTipo(TIPOS_DESPESA.FIXO)}>
              <SegmentButtonText selected={tipo === TIPOS_DESPESA.FIXO}>Fixo</SegmentButtonText>
            </SegmentButton>
            <SegmentButton
              selected={tipo === TIPOS_DESPESA.VARIAVEL}
              onPress={() => selecionarTipo(TIPOS_DESPESA.VARIAVEL)}
            >
              <SegmentButtonText selected={tipo === TIPOS_DESPESA.VARIAVEL}>Variável</SegmentButtonText>
            </SegmentButton>
          </SegmentOptions>
          <HelperText>
            {tipo === TIPOS_DESPESA.FIXO
              ? 'Não muda com as vendas: aluguel, salário, internet, contador.'
              : 'Acompanha o movimento: gelo, combustível, taxas, comissões.'}
          </HelperText>
        </InputGroup>

        {tipo === TIPOS_DESPESA.VARIAVEL && (
          <InputGroup>
            <Label>Forma do custo</Label>
            <SegmentOptions>
              <SegmentButton
                selected={forma === FORMAS_CALCULO.VALOR}
                onPress={() => selecionarForma(FORMAS_CALCULO.VALOR)}
              >
                <SegmentButtonText selected={forma === FORMAS_CALCULO.VALOR}>Valor em R$</SegmentButtonText>
              </SegmentButton>
              <SegmentButton
                selected={forma === FORMAS_CALCULO.PERCENTUAL}
                onPress={() => selecionarForma(FORMAS_CALCULO.PERCENTUAL)}
              >
                <SegmentButtonText selected={forma === FORMAS_CALCULO.PERCENTUAL}>
                  % sobre venda
                </SegmentButtonText>
              </SegmentButton>
            </SegmentOptions>
          </InputGroup>
        )}

        <InputGroup>
          <Label>Categoria</Label>
          <ChipsWrap>
            {CATEGORIAS_DESPESA.map((nome) => (
              <Chip
                key={nome}
                selected={categoria === nome}
                onPress={() => {
                  setCategoria(nome);
                  limparErro('categoria');
                }}
              >
                <ChipText selected={categoria === nome}>{nome}</ChipText>
              </Chip>
            ))}
          </ChipsWrap>
          {erros.categoria && <ErrorText>{erros.categoria}</ErrorText>}
        </InputGroup>

        {ehPercentual ? (
          <InputGroup>
            <Label>Percentual sobre as vendas</Label>
            <InputContainer hasError={!!erros.percentual}>
              <Input
                value={percentual}
                onChangeText={(texto) => {
                  setPercentual(aplicarMascaraPercentual(texto));
                  limparErro('percentual');
                }}
                placeholder="Ex: 2,5"
                keyboardType="decimal-pad"
                placeholderTextColor="#A99B8F"
              />
              <InputPrefix>%</InputPrefix>
            </InputContainer>
            {erros.percentual && <ErrorText>{erros.percentual}</ErrorText>}
          </InputGroup>
        ) : (
          <InputGroup>
            <Label>Valor</Label>
            <InputContainer hasError={!!erros.valor}>
              <InputPrefix>R$</InputPrefix>
              <Input
                value={valor}
                onChangeText={(texto) => {
                  setValor(aplicarMascaraMoeda(texto));
                  limparErro('valor');
                }}
                placeholder="0,00"
                keyboardType="numeric"
                placeholderTextColor="#A99B8F"
              />
            </InputContainer>
            {erros.valor && <ErrorText>{erros.valor}</ErrorText>}
          </InputGroup>
        )}

        <InputGroup>
          <Label>Periodicidade</Label>
          <ChipsWrap>
            {opcoesPeriodicidade.map((opcao) => (
              <Chip key={opcao} selected={periodicidade === opcao} onPress={() => setPeriodicidade(opcao)}>
                <ChipText selected={periodicidade === opcao}>{ROTULOS_PERIODICIDADE[opcao]}</ChipText>
              </Chip>
            ))}
          </ChipsWrap>
          <HelperText>
            {periodicidade === PERIODICIDADES.UNICA && 'Conta só no mês da competência.'}
            {periodicidade === PERIODICIDADES.MENSAL && 'Repete todo mês automaticamente, sem recadastrar.'}
            {periodicidade === PERIODICIDADES.DIARIA && 'Valor por dia: multiplicado pelos dias de cada mês.'}
            {periodicidade === PERIODICIDADES.SEMANAL && 'Valor por semana: proporcional às semanas de cada mês.'}
            {periodicidade === PERIODICIDADES.ANUAL && 'Valor por ano: rateado em 12 meses (1/12 por mês).'}
          </HelperText>
        </InputGroup>

        <InputGroup>
          <Label>{recorrente ? 'Começa na competência' : 'Competência'}</Label>
          {editando && originalRecorrente ? (
            <InputContainer>
              <InputText>{formatarCompetencia(competencia)}</InputText>
            </InputContainer>
          ) : (
            <MonthSelector>
              <MonthArrow onPress={() => setCompetencia(deslocarCompetencia(competencia, -1))}>
                <Ionicons name="chevron-back" size={18} color="#3D2C22" />
              </MonthArrow>
              <MonthLabel>{formatarCompetencia(competencia)}</MonthLabel>
              <MonthArrow onPress={() => setCompetencia(deslocarCompetencia(competencia, 1))}>
                <Ionicons name="chevron-forward" size={18} color="#3D2C22" />
              </MonthArrow>
            </MonthSelector>
          )}
        </InputGroup>

        <InputGroup>
          <Label>Data de vencimento (opcional)</Label>
          <Calendario
            value={dataVencimento || new Date()}
            onChange={setDataVencimento}
            renderTrigger={({ onPress }) => (
              <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <InputContainer pointerEvents="box-none">
                  <InputText placeholder={!dataVencimento}>
                    {dataVencimento ? formatarDataCurta(dataVencimento) : 'Sem vencimento'}
                  </InputText>
                  {dataVencimento ? (
                    <Ionicons name="close-circle" size={20} color="#A99B8F" onPress={() => setDataVencimento(null)} />
                  ) : (
                    <Ionicons name="calendar-outline" size={18} color="#D35400" />
                  )}
                </InputContainer>
              </TouchableOpacity>
            )}
          />
          {recorrente && periodicidade !== PERIODICIDADES.ANUAL && dataVencimento && (
            <HelperText>Vence todo mês no dia {dataVencimento.getDate()}.</HelperText>
          )}
        </InputGroup>

        {!ehPercentual && (
          <InputGroup>
            <SwitchRow>
              <SwitchLabel>
                {recorrente
                  ? `Pago em ${formatarCompetencia(editando ? competenciaContexto : competencia)}?`
                  : 'Pago?'}
              </SwitchLabel>
              <Switch
                value={pago}
                onValueChange={setPago}
                trackColor={{ false: '#E6DFD5', true: '#A9D5B5' }}
                thumbColor={pago ? '#2E5A1E' : '#FFFFFF'}
              />
            </SwitchRow>
          </InputGroup>
        )}

        <InputGroup>
          <Label>Observação</Label>
          <TextAreaContainer>
            <TextArea
              value={observacao}
              onChangeText={setObservacao}
              placeholder="Opcional"
              placeholderTextColor="#A99B8F"
              multiline
            />
          </TextAreaContainer>
        </InputGroup>

        <SaveButton onPress={handleSalvar} disabled={salvando}>
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <SaveButtonText>{editando ? 'Salvar alterações' : 'Cadastrar despesa'}</SaveButtonText>
            </>
          )}
        </SaveButton>
      </ScrollContainer>
    </Container>
  );
}
