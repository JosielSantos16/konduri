import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 15px 20px 10px 20px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const HeaderTitles = styled.View``;

export const HeaderTitle = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #3D2C22;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-top: 2px;
`;

export const MonthSelector = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border-radius: 14px;
  border-width: 1px;
  border-color: #E6DFD5;
  margin: 6px 20px 14px 20px;
  padding: 6px;
`;

export const MonthArrow = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  background-color: #F0EAE1;
`;

export const MonthLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Lista = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

export const ResumoCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  border-width: 1px;
  border-color: #E6DFD5;
  padding: 16px;
  margin-bottom: 18px;
`;

export const ResumoRow = styled.View`
  flex-direction: row;
`;

export const ResumoBloco = styled.View`
  flex: 1;
`;

export const ResumoLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #8C7355;
  letter-spacing: 0.5px;
`;

export const ResumoValor = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.cor || '#3D2C22'};
  margin-top: 4px;
`;

export const ResumoExtra = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-top: 2px;
`;

export const ResumoRodape = styled.View`
  flex-direction: row;
  align-items: center;
  border-top-width: 1px;
  border-top-color: #F0EAE1;
  margin-top: 14px;
  padding-top: 10px;
`;

export const ResumoRodapeTexto = styled.Text`
  font-size: 13px;
  color: #8C5A2E;
  margin-left: 6px;
`;

export const SectionTitle = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #8C7355;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
`;

export const Secao = styled.View`
  margin-bottom: 16px;
`;

export const DespesaCard = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 14px;
  border-width: 1px;
  border-color: #E6DFD5;
  padding: 14px;
  margin-bottom: 10px;
`;

export const DespesaInfo = styled.View`
  flex: 1;
  margin-right: 10px;
`;

export const DespesaDescricao = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const DespesaDetalhe = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-top: 3px;
`;

export const DespesaLado = styled.View`
  align-items: flex-end;
`;

export const DespesaValor = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const PagoChip = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 10px;
  background-color: ${(props) => (props.pago ? '#E6F4EA' : '#FEF5E7')};
`;

export const PagoChipText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  margin-left: 4px;
  color: ${(props) => (props.pago ? '#2E5A1E' : '#D35400')};
`;

export const AutomaticoChip = styled.View`
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 10px;
  background-color: #F0EAE1;
`;

export const AutomaticoChipText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #8C7355;
`;

export const EmptyText = styled.Text`
  font-size: 13px;
  color: #A99B8F;
  margin-bottom: 10px;
`;

export const FAB = styled.TouchableOpacity`
  position: absolute;
  right: 20px;
  flex-direction: row;
  align-items: center;
  height: 52px;
  padding-horizontal: 20px;
  border-radius: 26px;
  background-color: #3D2C22;
  elevation: 6;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
`;

export const FABText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 6px;
`;
