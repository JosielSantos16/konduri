import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Calendario from '../../components/painel/calendario/Calendario';
import { useAuth } from '../../hooks/useAuth';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { formatPrice } from '../../utils/formatPrice';
import { formatarDataComDia } from '../../utils/formatDateTime';
import { STATUS_RESERVA, MOTIVOS_RESERVA_RECUSADA, configDaData, vagasRestantes } from '../../utils/entradas';
import {
  subscribeToConfigEntradas,
  subscribeToOcupacao,
  subscribeToReservasDoCliente,
  reservarEntrada,
  cancelarReserva,
  ERROS_ENTRADA,
} from '../../services/queries/entradasQueries';
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
  InputTexto,
  Contador,
  ContadorBotao,
  ContadorValor,
  BotaoPrincipal,
  BotaoPrincipalTexto,
  BotaoSecundario,
  BotaoSecundarioTexto,
  ItemLista,
  ItemInfo,
  ItemTitulo,
  ItemDetalhe,
  Selo,
  SeloTexto,
  AvisoBox,
  AvisoTexto,
} from '../../components/entradas/entradasStyle';

const MAX_PESSOAS = 30;

const SELO_STATUS = {
  [STATUS_RESERVA.RESERVADA]: { texto: 'Reservada', bg: '#FFF7D1', cor: '#6B5300' },
  [STATUS_RESERVA.UTILIZADA]: { texto: 'Utilizada', bg: '#E6F4EA', cor: '#137333' },
  [STATUS_RESERVA.CANCELADA]: { texto: 'Cancelada', bg: '#FDEDEC', cor: '#C0392B' },
};

export default function ReservarEntrada() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const hojeISO = paraDataISOLocal();

  const [config, setConfig] = useState(null);
  const [data, setData] = useState(new Date());
  const [quantidade, setQuantidade] = useState(1);
  const [ocupacao, setOcupacao] = useState({});
  const [reservas, setReservas] = useState([]);
  const [reservando, setReservando] = useState(false);
  const [cancelandoId, setCancelandoId] = useState(null);

  const dataISO = paraDataISOLocal(data);

  useEffect(() => subscribeToConfigEntradas(setConfig), []);
  useEffect(() => subscribeToOcupacao(dataISO, dataISO, setOcupacao), [dataISO]);
  useEffect(() => {
    if (!usuario?.uid) return undefined;
    return subscribeToReservasDoCliente(usuario.uid, setReservas);
  }, [usuario?.uid]);

  if (!config) {
    return (
      <Container style={{ paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </Container>
    );
  }

  const { valor, lotacao } = configDaData(config, dataISO);
  const vagas = vagasRestantes(lotacao, ocupacao[dataISO] || 0);
  const dataPassada = dataISO < hojeISO;
  const lotado = vagas !== null && vagas < quantidade;
  const podeReservar = !dataPassada && !lotado && !reservando;

  const handleReservar = async () => {
    if (!podeReservar || !usuario) return;
    setReservando(true);
    try {
      await reservarEntrada({ cliente: usuario, dataISO, quantidade });
      Alert.alert(
        'Entrada reservada!',
        `${quantidade} ${quantidade === 1 ? 'pessoa' : 'pessoas'} para ${formatarDataComDia(dataISO)}. Pague na portaria: dinheiro, cartão ou Pix.`
      );
      setQuantidade(1);
    } catch (erro) {
      if (erro.message === MOTIVOS_RESERVA_RECUSADA.LOTADO) {
        Alert.alert('Sem vagas suficientes', erro.vagas ? `Restam ${erro.vagas} vagas para esse dia.` : 'Esse dia já está lotado.');
      } else if (erro.message === MOTIVOS_RESERVA_RECUSADA.DATA_PASSADA) {
        Alert.alert('Data inválida', 'Escolha hoje ou uma data futura.');
      } else {
        console.error('Erro ao reservar entrada:', erro);
        Alert.alert('Não foi possível reservar', 'Verifique sua conexão com a internet e tente novamente.');
      }
    } finally {
      setReservando(false);
    }
  };

  const handleCancelar = (reserva) => {
    Alert.alert('Cancelar reserva', `Cancelar a reserva de ${formatarDataComDia(reserva.data)}?`, [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar reserva',
        style: 'destructive',
        onPress: async () => {
          setCancelandoId(reserva.id);
          try {
            await cancelarReserva(reserva.id);
          } catch (erro) {
            if (erro.message === ERROS_ENTRADA.RESERVA_INDISPONIVEL) {
              Alert.alert('Não é mais possível cancelar', 'Essa reserva já foi usada na portaria ou cancelada.');
            } else {
              console.error('Erro ao cancelar reserva:', erro);
              Alert.alert('Não foi possível cancelar', 'Verifique sua conexão com a internet e tente novamente.');
            }
          } finally {
            setCancelandoId(null);
          }
        },
      },
    ]);
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </BackButton>
        <HeaderTextos>
          <HeaderTitle>Entrada no Espaço Konduri</HeaderTitle>
          <HeaderSubtitle>Portaria, restaurante, bar, praias e cachoeira</HeaderSubtitle>
        </HeaderTextos>
      </Header>

      <Scroll showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Card>
          <CardTitulo>RESERVAR ENTRADA</CardTitulo>

          <Campo>
            <Label>Dia da visita</Label>
            <Calendario
              value={data}
              onChange={setData}
              renderTrigger={({ onPress }) => (
                <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                  <InputContainer erro={dataPassada} pointerEvents="none">
                    <InputTexto>{formatarDataComDia(dataISO)}</InputTexto>
                    <Ionicons name="calendar-outline" size={18} color="#8A6A00" />
                  </InputContainer>
                </TouchableOpacity>
              )}
            />
            {dataPassada && <TextoSuave cor="#C0392B">Escolha hoje ou uma data futura.</TextoSuave>}
          </Campo>

          <Campo>
            <Label>Quantas pessoas?</Label>
            <Contador>
              <ContadorBotao disabled={quantidade <= 1} onPress={() => setQuantidade((q) => Math.max(1, q - 1))}>
                <Ionicons name="remove" size={20} color="#1A1A1A" />
              </ContadorBotao>
              <ContadorValor>{quantidade}</ContadorValor>
              <ContadorBotao
                disabled={quantidade >= MAX_PESSOAS}
                onPress={() => setQuantidade((q) => Math.min(MAX_PESSOAS, q + 1))}
              >
                <Ionicons name="add" size={20} color="#1A1A1A" />
              </ContadorBotao>
            </Contador>
          </Campo>

          <Linha>
            <Rotulo>Valor por pessoa</Rotulo>
            <Valor>{formatPrice(valor)}</Valor>
          </Linha>
          <Linha>
            <Rotulo>Total previsto</Rotulo>
            <Valor grande>{formatPrice(valor * quantidade)}</Valor>
          </Linha>
          {vagas !== null && (
            <Linha>
              <Rotulo>Vagas para esse dia</Rotulo>
              <Valor cor={lotado ? '#C0392B' : '#1A1A1A'}>{vagas}</Valor>
            </Linha>
          )}
        </Card>

        <AvisoBox>
          <Ionicons name="cash-outline" size={18} color="#6B5300" />
          <AvisoTexto>
            A reserva garante sua vaga e ajuda a gente a se preparar. O pagamento é feito na portaria, em
            dinheiro, cartão ou Pix, pelo valor do dia.
          </AvisoTexto>
        </AvisoBox>

        <BotaoPrincipal onPress={handleReservar} disabled={!podeReservar}>
          {reservando ? (
            <ActivityIndicator color="#1A1A1A" />
          ) : (
            <>
              <Ionicons name="ticket-outline" size={20} color="#1A1A1A" />
              <BotaoPrincipalTexto>{lotado ? 'Sem vagas para esse dia' : 'Reservar entrada'}</BotaoPrincipalTexto>
            </>
          )}
        </BotaoPrincipal>

        <Card>
          <CardTitulo>MINHAS RESERVAS</CardTitulo>
          {reservas.length === 0 && <TextoSuave>Você ainda não tem reservas.</TextoSuave>}
          {reservas.map((reserva, indice) => {
            const selo = SELO_STATUS[reserva.status] || SELO_STATUS[STATUS_RESERVA.RESERVADA];
            const podeCancelar = reserva.status === STATUS_RESERVA.RESERVADA && reserva.data >= hojeISO;
            return (
              <ItemLista key={reserva.id} primeiro={indice === 0}>
                <ItemInfo>
                  <ItemTitulo>{formatarDataComDia(reserva.data)}</ItemTitulo>
                  <ItemDetalhe>
                    {reserva.quantidade} {reserva.quantidade === 1 ? 'pessoa' : 'pessoas'} · previsto{' '}
                    {formatPrice((reserva.valorPrevistoUnitario || 0) * reserva.quantidade)}
                  </ItemDetalhe>
                </ItemInfo>
                {podeCancelar ? (
                  <BotaoSecundario cor="#C0392B" onPress={() => handleCancelar(reserva)} disabled={cancelandoId === reserva.id}>
                    {cancelandoId === reserva.id ? (
                      <ActivityIndicator size="small" color="#C0392B" />
                    ) : (
                      <BotaoSecundarioTexto cor="#C0392B">Cancelar</BotaoSecundarioTexto>
                    )}
                  </BotaoSecundario>
                ) : (
                  <Selo bg={selo.bg}>
                    <SeloTexto cor={selo.cor}>{selo.texto}</SeloTexto>
                  </Selo>
                )}
              </ItemLista>
            );
          })}
        </Card>
      </Scroll>
    </Container>
  );
}
