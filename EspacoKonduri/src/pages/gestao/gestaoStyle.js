import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

export const Header = styled.View`
  padding: 20px 20px 12px 20px;
`;

export const Title = styled.Text`
  font-size: 23px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-top: 2px;
`;

export const PeriodoChips = styled.ScrollView`
  flex-grow: 0;
  padding-left: 20px;
  margin-bottom: 8px;
`;

export const PeriodoChip = styled.TouchableOpacity`
  padding: 8px 14px;
  border-radius: 18px;
  margin-right: 8px;
  border-width: 1px;
  border-color: ${(props) => (props.selected ? '#E0A800' : '#E6E6E0')};
  background-color: ${(props) => (props.selected ? '#FFD000' : '#FFFFFF')};
`;

export const PeriodoChipText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${(props) => (props.selected ? '#1A1A1A' : '#6B6B6B')};
`;

export const PeriodoLabel = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #333333;
  padding-horizontal: 20px;
  margin-bottom: 14px;
`;

export const PersonalizadoRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 20px;
  margin-bottom: 14px;
`;

export const DataBotao = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 10px 12px;
`;

export const DataBotaoTexto = styled.Text`
  font-size: 14px;
  color: #1A1A1A;
`;

export const DataSeparador = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
  margin-horizontal: 8px;
`;

export const Conteudo = styled.View`
  padding-horizontal: 20px;
`;

export const AvisoBox = styled.View`
  flex-direction: row;
  background-color: ${(props) => props.bg || '#FFF7D1'};
  border-width: 1px;
  border-color: ${(props) => props.borda || '#F2DC7C'};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 14px;
`;

export const AvisoTexto = styled.Text`
  flex: 1;
  font-size: 12px;
  line-height: 17px;
  color: ${(props) => props.cor || '#6B5300'};
  margin-left: 8px;
`;

export const FaturamentoCard = styled.View`
  background-color: #FFD000;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 12px;
  elevation: 3;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 6px;
`;

export const CardTitle = styled.Text`
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
  margin-left: 8px;
  color: ${(props) => props.cor || '#6B6B6B'};
`;

export const FaturamentoValor = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const FaturamentoDetalhe = styled.Text`
  font-size: 12px;
  color: #1A1A1A;
  opacity: 0.95;
  margin-top: 6px;
`;

export const CardsRow = styled.View`
  flex-direction: row;
  margin-horizontal: -5px;
  margin-bottom: 12px;
`;

export const IndicadorCard = styled.View`
  flex: 1;
  background-color: ${(props) => props.bg || '#FFFFFF'};
  border-radius: 16px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 16px;
  margin-horizontal: 5px;
`;

export const IndicadorValor = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: ${(props) => props.cor || '#1A1A1A'};
`;

export const IndicadorDetalhe = styled.Text`
  font-size: 12px;
  color: ${(props) => props.cor || '#6B6B6B'};
  margin-top: 4px;
`;

export const ResultadoCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 18px;
  margin-bottom: 12px;
`;

export const ResultadoValor = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: ${(props) => props.cor};
`;

export const LinhaDetalhe = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 6px;
`;

export const LinhaDetalheLabel = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
`;

export const LinhaDetalheValor = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #333333;
`;

export const LinkLinha = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 14px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 14px;
  margin-bottom: 12px;
`;

export const LinkTexto = styled.Text`
  flex: 1;
  font-size: 14px;
  font-weight: bold;
  color: #1A1A1A;
  margin-left: 10px;
`;

export const LoadingBox = styled.View`
  padding: 60px 0;
  align-items: center;
`;
