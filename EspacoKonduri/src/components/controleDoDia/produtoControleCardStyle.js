import styled from 'styled-components/native';

export const Card = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 14px;
  border-width: ${props => (props.semEstoque ? 2 : 1)}px;
  border-color: ${props => (props.semEstoque ? '#C0392B' : '#E6DFD5')};
  elevation: 1;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #F0EAE1;
`;

export const CardHeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const ProductImage = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: #F0EAE1;
  margin-right: 12px;
`;

export const ImagePlaceholder = styled.View`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: #F0EAE1;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

export const ProductName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #3D2C22;
  flex-shrink: 1;
  margin-right: 8px;
`;

export const SaldoBadge = styled.View`
  background-color: ${props =>
    props.semEstoque ? '#FDEDEC' : props.estoqueBaixo ? '#FEF5E7' : '#F0F7F1'};
  border-width: 1px;
  border-color: ${props =>
    props.semEstoque ? '#C0392B' : props.estoqueBaixo ? '#E67E22' : '#2E5A1E'};
  border-radius: 8px;
  padding: 8px 16px;
  min-width: 90px;
  align-items: center;
`;

export const SaldoBadgeLabel = styled.Text`
  font-size: 9px;
  font-weight: bold;
  color: ${props =>
    props.semEstoque ? '#C0392B' : props.estoqueBaixo ? '#D35400' : '#2E5A1E'};
  letter-spacing: 0.3px;
  margin-bottom: 2px;
`;

export const SaldoBadgeValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props =>
    props.semEstoque ? '#C0392B' : props.estoqueBaixo ? '#D35400' : '#2E5A1E'};
`;

export const StatsRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

export const StatBlock = styled.View`
  flex: 1;
`;

export const StatLabel = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #A99B8F;
  margin-bottom: 3px;
  letter-spacing: 0.3px;
`;

export const StatValue = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const EditButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #E67E22;
  border-radius: 8px;
  padding-vertical: 9px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 3px;
`;

export const EditButtonText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 5px;
`;

export const AlertaEstoque = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => (props.baixo ? '#FEF5E7' : '#FDEDEC')};
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 10px;
`;

export const AlertaEstoqueText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${props => (props.baixo ? '#D35400' : '#C0392B')};
  margin-left: 6px;
  flex-shrink: 1;
`;