import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NavBarAtendente from '../../components/PDV/navBar/navBarAtendente';
import RegistrarEntradaPortariaModal from '../../components/entradas/RegistrarEntradaPortariaModal';
import { useAuth } from '../../hooks/useAuth';
import { useVendas } from '../../contexts/VendasContext';
import { useCaixa } from '../../contexts/CaixaContext';
import { ehAdmin } from '../../utils/permissoes';
import { paraDataISOLocal } from '../../utils/dataLocal';
import { formatPrice } from '../../utils/formatPrice';
import { formatarDataComDia, formatHora } from '../../utils/formatDateTime';
import { infoMetodo } from '../../utils/metodosPagamento';
import { vendaValida } from '../../utils/financeiro';
import { STATUS_RESERVA, configDaData, ehVendaDeEntrada, resumirEntradasPorDia } from '../../utils/entradas';
import { subscribeToConfigEntradas, subscribeToReservasDaData } from '../../services/queries/entradasQueries';
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
  Grade,
  GradeItem,
  Rotulo,
  Valor,
  TextoSuave,
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

export default function Portaria() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario } = useAuth();
  const { vendasHoje } = useVendas();
  const { operacaoId } = useCaixa();
  const admin = ehAdmin(usuario);
  const hojeISO = paraDataISOLocal();

  const [config, setConfig] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  useEffect(() => subscribeToConfigEntradas(setConfig), []);
  useEffect(() => subscribeToReservasDaData(hojeISO, setReservas), [hojeISO]);

  if (!config) {
    return (
      <Container style={{ paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </Container>
    );
  }

  const { valor, lotacao } = configDaData(config, hojeISO);
  const entradasHoje = vendasHoje.filter((v) => ehVendaDeEntrada(v) && vendaValida(v));
  const { totais } = resumirEntradasPorDia(entradasHoje);
  const reservasAtivas = reservas.filter((r) => r.status !== STATUS_RESERVA.CANCELADA);
  const aguardando = reservasAtivas.filter((r) => r.status === STATUS_RESERVA.RESERVADA);
  const pessoasAguardando = aguardando.reduce((soma, r) => soma + r.quantidade, 0);
  const pessoasPrevistas = reservasAtivas.reduce((soma, r) => soma + r.quantidade, 0);
  // Quem já entrou + quem reservou e ainda não chegou
  const ocupacaoEstimada = totais.pessoas + pessoasAguardando;
  const acimaDaLotacao = lotacao !== null && ocupacaoEstimada >= lotacao;

  const abrirRegistro = (reserva = null) => {
    setReservaSelecionada(reserva);
    setModalVisivel(true);
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        {admin && (
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
          </BackButton>
        )}
        <HeaderTextos>
          <HeaderTitle>Portaria</HeaderTitle>
          <HeaderSubtitle>{formatarDataComDia(hojeISO)} · entradas fecham sozinhas ao virar o dia</HeaderSubtitle>
        </HeaderTextos>
      </Header>

      <Scroll showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <Grade>
          <GradeItem bg="#FFD000">
            <Rotulo cor="#1A1A1A">Valor hoje</Rotulo>
            <Valor>{formatPrice(valor)}</Valor>
          </GradeItem>
          <GradeItem>
            <Rotulo>Entraram</Rotulo>
            <Valor>{totais.pessoas}</Valor>
            {totais.cortesias > 0 && <TextoSuave>{totais.cortesias} cortesia(s)</TextoSuave>}
          </GradeItem>
          <GradeItem>
            <Rotulo>Reservas</Rotulo>
            <Valor>{pessoasPrevistas}</Valor>
            <TextoSuave>{pessoasAguardando} a chegar</TextoSuave>
          </GradeItem>
        </Grade>

        {lotacao !== null && (
          <AvisoBox bg={acimaDaLotacao ? '#FDEDEC' : '#FFF7D1'}>
            <Ionicons name="people-outline" size={18} color={acimaDaLotacao ? '#C0392B' : '#6B5300'} />
            <AvisoTexto cor={acimaDaLotacao ? '#C0392B' : '#6B5300'}>
              Lotação de hoje: {lotacao} pessoas. Entraram {totais.pessoas} e faltam chegar {pessoasAguardando} com
              reserva{acimaDaLotacao ? ' — lotação atingida.' : '.'}
            </AvisoTexto>
          </AvisoBox>
        )}

        <BotaoPrincipal onPress={() => abrirRegistro(null)}>
          <Ionicons name="add-circle-outline" size={20} color="#1A1A1A" />
          <BotaoPrincipalTexto>Registrar entrada</BotaoPrincipalTexto>
        </BotaoPrincipal>

        <Card>
          <CardTitulo>RESERVAS DE HOJE ({reservasAtivas.length})</CardTitulo>
          {reservasAtivas.length === 0 && <TextoSuave>Nenhuma reserva para hoje.</TextoSuave>}
          {reservasAtivas.map((reserva, indice) => (
            <ItemLista key={reserva.id} primeiro={indice === 0}>
              <ItemInfo>
                <ItemTitulo>{reserva.clienteNome || 'Cliente'}</ItemTitulo>
                <ItemDetalhe>
                  {reserva.quantidade} {reserva.quantidade === 1 ? 'pessoa' : 'pessoas'}
                  {reserva.clienteTelefone ? ` · ${reserva.clienteTelefone}` : ''}
                </ItemDetalhe>
              </ItemInfo>
              {reserva.status === STATUS_RESERVA.RESERVADA ? (
                <BotaoSecundario onPress={() => abrirRegistro(reserva)}>
                  <Ionicons name="enter-outline" size={14} color="#1A1A1A" />
                  <BotaoSecundarioTexto>Chegou</BotaoSecundarioTexto>
                </BotaoSecundario>
              ) : (
                <Selo bg="#E6F4EA">
                  <SeloTexto cor="#137333">Entrou</SeloTexto>
                </Selo>
              )}
            </ItemLista>
          ))}
        </Card>

        <Card>
          <CardTitulo>ENTRADAS DE HOJE</CardTitulo>
          {entradasHoje.length === 0 && <TextoSuave>Nenhuma entrada registrada hoje.</TextoSuave>}
          {[...entradasHoje].reverse().map((venda, indice) => {
            const pessoas = (venda.itens || []).reduce((soma, item) => soma + (item.qty || 0), 0);
            return (
              <ItemLista key={venda.id} primeiro={indice === 0}>
                <ItemInfo>
                  <ItemTitulo>
                    {pessoas} {pessoas === 1 ? 'pessoa' : 'pessoas'}
                    {venda.clienteNome ? ` · ${venda.clienteNome}` : ''}
                  </ItemTitulo>
                  <ItemDetalhe>
                    {formatHora(venda.criadoEm)} · {infoMetodo(venda.metodo).label} · por {venda.responsavelNome || '—'}
                  </ItemDetalhe>
                </ItemInfo>
                <Valor>{venda.metodo === 'cortesia' ? 'Cortesia' : formatPrice(venda.total)}</Valor>
              </ItemLista>
            );
          })}
          {totais.total > 0 && (
            <TextoSuave style={{ marginTop: 8 }}>
              Total do dia: {formatPrice(totais.total)} ({totais.pagantes} pagantes)
            </TextoSuave>
          )}
        </Card>

        {admin && (
          <BotaoSecundario onPress={() => router.push('/entradas')} style={{ alignSelf: 'center' }}>
            <Ionicons name="settings-outline" size={14} color="#1A1A1A" />
            <BotaoSecundarioTexto>Valores, lotação e relatório</BotaoSecundarioTexto>
          </BotaoSecundario>
        )}
      </Scroll>

      {!admin && <NavBarAtendente />}

      <RegistrarEntradaPortariaModal
        visivel={modalVisivel}
        reserva={reservaSelecionada}
        valorDoDia={valor}
        podeDarCortesia={admin}
        usuario={usuario}
        operacaoId={operacaoId}
        onFechar={() => setModalVisivel(false)}
      />
    </Container>
  );
}
