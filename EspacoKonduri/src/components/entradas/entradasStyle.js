import styled from 'styled-components/native';

// Estilos das telas de entradas (reserva do cliente, portaria e admin),
// na paleta da logo: amarelo-ouro e preto sobre fundo claro

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
`;

export const Scroll = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 20px 12px 20px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const HeaderTextos = styled.View`
  flex: 1;
`;

export const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
  margin-top: 2px;
`;

export const Card = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 16px;
  margin-bottom: 12px;
`;

export const CardDestaque = styled.View`
  background-color: #1A1A1A;
  border-radius: 18px;
  padding: 18px;
  margin-bottom: 12px;
`;

export const CardTitulo = styled.Text`
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: ${(props) => props.cor || '#6B6B6B'};
  margin-bottom: 8px;
`;

export const Linha = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 6px;
`;

export const Rotulo = styled.Text`
  font-size: 13px;
  color: ${(props) => props.cor || '#6B6B6B'};
`;

export const Valor = styled.Text`
  font-size: ${(props) => (props.grande ? '24px' : '15px')};
  font-weight: bold;
  color: ${(props) => props.cor || '#1A1A1A'};
`;

export const TextoSuave = styled.Text`
  font-size: 12px;
  line-height: 17px;
  color: ${(props) => props.cor || '#6B6B6B'};
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 6px;
`;

export const Campo = styled.View`
  margin-bottom: 14px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props) => (props.erro ? '#C0392B' : '#E6E6E0')};
  padding-horizontal: 14px;
  height: 50px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #1A1A1A;
`;

export const InputTexto = styled.Text`
  flex: 1;
  font-size: 15px;
  color: #1A1A1A;
`;

export const Prefixo = styled.Text`
  font-size: 15px;
  color: #6B6B6B;
  margin-right: 6px;
`;

export const ErroTexto = styled.Text`
  font-size: 12px;
  color: #C0392B;
  margin-top: 4px;
`;

export const Contador = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
`;

export const ContadorBotao = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.35 : 1)};
`;

export const ContadorValor = styled.Text`
  min-width: 44px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const Opcoes = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Opcao = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-width: 1.5px;
  border-color: ${(props) => (props.selecionada ? '#E0A800' : '#E6E6E0')};
  background-color: ${(props) => (props.selecionada ? '#FFD000' : '#FFFFFF')};
`;

export const OpcaoTexto = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #1A1A1A;
  margin-left: 6px;
`;

export const BotaoPrincipal = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #FFD000;
  border-radius: 12px;
  height: 52px;
  margin-top: 6px;
  margin-bottom: 16px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const BotaoPrincipalTexto = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
  margin-left: 6px;
`;

export const BotaoSecundario = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-width: 1.5px;
  border-color: ${(props) => props.cor || '#1A1A1A'};
  border-radius: 10px;
  padding: 8px 12px;
`;

export const BotaoSecundarioTexto = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${(props) => props.cor || '#1A1A1A'};
  margin-left: 4px;
`;

export const ItemLista = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  border-top-width: ${(props) => (props.primeiro ? '0px' : '1px')};
  border-top-color: #F1F1EB;
`;

export const ItemInfo = styled.View`
  flex: 1;
  margin-right: 10px;
`;

export const ItemTitulo = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const ItemDetalhe = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
  margin-top: 2px;
`;

export const Selo = styled.View`
  padding: 3px 8px;
  border-radius: 10px;
  background-color: ${(props) => props.bg || '#F1F1EB'};
`;

export const SeloTexto = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${(props) => props.cor || '#6B6B6B'};
`;

export const AvisoBox = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.bg || '#FFF7D1'};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
`;

export const AvisoTexto = styled.Text`
  flex: 1;
  font-size: 12px;
  line-height: 17px;
  color: ${(props) => props.cor || '#6B5300'};
  margin-left: 8px;
`;

export const Grade = styled.View`
  flex-direction: row;
  margin-horizontal: -5px;
  margin-bottom: 12px;
`;

export const GradeItem = styled.View`
  flex: 1;
  background-color: ${(props) => props.bg || '#FFFFFF'};
  border-radius: 14px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 12px;
  margin-horizontal: 5px;
`;

export const TabelaLinha = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 8px;
  border-top-width: ${(props) => (props.primeira ? '0px' : '1px')};
  border-top-color: #F1F1EB;
`;

export const Coluna = styled.Text`
  flex: ${(props) => props.flex || 1};
  text-align: ${(props) => props.alinhar || 'right'};
  font-size: ${(props) => (props.cabecalho ? '11px' : '12px')};
  font-weight: bold;
  color: ${(props) => (props.cabecalho ? '#9E9E9E' : props.cor || '#333333')};
`;

/* Modal */

export const ModalOverlay = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.45);
  justify-content: flex-end;
`;

export const ModalConteudo = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  max-height: 90%;
`;

export const ModalCabecalho = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

export const ModalTitulo = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1A1A1A;
`;

/* Banner da tela inicial do cliente */

export const Banner = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #1A1A1A;
  border-radius: 16px;
  padding: 14px 16px;
  margin-top: 4px;
  margin-bottom: 12px;
`;

export const BannerIcone = styled.View`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background-color: #FFD000;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const BannerTitulo = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const BannerTexto = styled.Text`
  font-size: 12px;
  color: #FFD000;
  margin-top: 2px;
`;
