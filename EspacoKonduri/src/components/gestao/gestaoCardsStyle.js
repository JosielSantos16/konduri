import styled from 'styled-components/native';

// Estilos comuns aos cards da Gestão (resultado, rentabilidade, margem, comparação)

export const Card = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${(props) => props.borda || '#E6DFD5'};
  padding: 16px;
  margin-bottom: 12px;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const CardTitulo = styled.Text`
  flex: 1;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: #8C7355;
  margin-left: 8px;
`;

export const CardAcao = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 0 4px 8px;
`;

export const CardAcaoTexto = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #E67E22;
  margin-left: 4px;
`;

export const TextoSuave = styled.Text`
  font-size: 12px;
  line-height: 17px;
  color: #8C7355;
`;

/* Quadro de resultado (DRE) */

export const DreLinha = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 7px;
  border-top-width: ${(props) => (props.total ? '1px' : '0px')};
  border-top-color: #F0EAE1;
`;

export const DreLabel = styled.Text`
  flex: 1;
  font-size: ${(props) => (props.total ? '14px' : '13px')};
  font-weight: ${(props) => (props.total ? 'bold' : 'normal')};
  color: ${(props) => (props.total ? '#3D2C22' : '#5C4033')};
`;

export const DreValor = styled.Text`
  font-size: ${(props) => (props.total ? '14px' : '13px')};
  font-weight: bold;
  color: ${(props) => props.cor || '#3D2C22'};
`;

export const DrePercentual = styled.Text`
  width: 62px;
  text-align: right;
  font-size: 12px;
  color: #8C7355;
`;

/* Abas */

export const Abas = styled.View`
  flex-direction: row;
  background-color: #F0EAE1;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 12px;
`;

export const Aba = styled.TouchableOpacity`
  flex: 1;
  padding-vertical: 8px;
  align-items: center;
  border-radius: 9px;
  background-color: ${(props) => (props.ativa ? '#FFFFFF' : 'transparent')};
`;

export const AbaTexto = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => (props.ativa ? '#B85D00' : '#8C7355')};
`;

/* Linha de produto (rentabilidade e alertas) */

export const ProdutoLinha = styled.TouchableOpacity`
  padding-vertical: 10px;
  border-top-width: ${(props) => (props.primeira ? '0px' : '1px')};
  border-top-color: #F0EAE1;
`;

export const ProdutoTopo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ProdutoPosicao = styled.Text`
  width: 22px;
  font-size: 12px;
  font-weight: bold;
  color: #A99B8F;
`;

export const ProdutoNome = styled.Text`
  flex: 1;
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
`;

export const MargemBadge = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 3px 8px;
  border-radius: 10px;
  background-color: ${(props) => (props.baixa ? '#FDEDEC' : props.semCusto ? '#F0EAE1' : '#E6F4EA')};
`;

export const MargemBadgeTexto = styled.Text`
  font-size: 12px;
  font-weight: bold;
  margin-left: 2px;
  color: ${(props) => (props.baixa ? '#C0392B' : props.semCusto ? '#8C7355' : '#2E5A1E')};
`;

export const ProdutoNumeros = styled.View`
  flex-direction: row;
  margin-top: 6px;
  padding-left: 22px;
`;

export const ProdutoNumero = styled.View`
  flex: 1;
`;

export const ProdutoNumeroLabel = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #A99B8F;
  letter-spacing: 0.4px;
`;

export const ProdutoNumeroValor = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #5C4033;
  margin-top: 1px;
`;

export const VerTodos = styled.TouchableOpacity`
  align-items: center;
  padding-top: 10px;
`;

export const VerTodosTexto = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #E67E22;
`;

/* Comparação mensal */

export const TabelaCabecalho = styled.View`
  flex-direction: row;
  padding-bottom: 6px;
  border-bottom-width: 1px;
  border-bottom-color: #F0EAE1;
`;

export const TabelaLinha = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 8px;
  border-top-width: ${(props) => (props.primeira ? '0px' : '1px')};
  border-top-color: #F0EAE1;
`;

export const ColunaIndicador = styled.Text`
  flex: 1.3;
  font-size: ${(props) => (props.cabecalho ? '11px' : '13px')};
  font-weight: bold;
  color: ${(props) => (props.cabecalho ? '#A99B8F' : '#3D2C22')};
`;

export const ColunaValor = styled.Text`
  flex: 1;
  text-align: right;
  font-size: ${(props) => (props.cabecalho ? '11px' : '12px')};
  font-weight: bold;
  color: ${(props) => props.cor || (props.cabecalho ? '#A99B8F' : '#5C4033')};
`;

/* Modal da margem mínima */

export const ModalOverlay = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  padding: 24px;
`;

export const ModalConteudo = styled.View`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
`;

export const ModalTitulo = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ModalInputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FAF8F5;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props) => (props.erro ? '#C0392B' : '#E6DFD5')};
  padding-horizontal: 14px;
  height: 52px;
  margin-top: 14px;
`;

export const ModalInput = styled.TextInput`
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ModalSufixo = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #8C7355;
`;

export const ModalErro = styled.Text`
  font-size: 12px;
  color: #C0392B;
  margin-top: 4px;
`;

export const ModalBotao = styled.TouchableOpacity`
  background-color: #E67E22;
  border-radius: 12px;
  height: 48px;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
`;

export const ModalBotaoTexto = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
`;
