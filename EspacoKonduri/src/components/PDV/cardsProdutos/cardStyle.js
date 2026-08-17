import styled from 'styled-components/native';

export const ProductCard = styled.TouchableOpacity`
  width: 48%;
  background-color: #FFFFFF;
  border-radius: 16px;
  margin-bottom: 12px;
  border-width: ${props =>
    props.semEstoque || props.selecionado || props.estoqueBaixo ? 2 : 1}px;
  border-color: ${props =>
    props.semEstoque
      ? '#C0392B'
      : props.selecionado
      ? '#5C4033'
      : props.estoqueBaixo
      ? '#E67E22'
      : '#E6DFD5'};
  elevation: 1;
  overflow: hidden;
  opacity: ${props => (props.semEstoque ? 0.6 : 1)};
`;

export const ProductImage = styled.Image`
  width: 100%;
  height: 110px;
  background-color: #F0EAE1;
`;

export const CardContent = styled.View`
  padding: 10px;
`;

export const ProductTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 2px;
`;

export const StockText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${props => (props.semEstoque ? '#C0392B' : props.estoqueBaixo ? '#D35400' : '#8C7355')};
  margin-bottom: 6px;
`;

export const ProductFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ProductPrice = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #D35400;
`;

export const AddButton = styled.TouchableOpacity`
  background-color: ${props => (props.disabled ? '#E6DFD5' : '#FAF0E6')};
  width: 28px;
  height: 28px;
  border-radius: 14px;
  justify-content: center;
  align-items: center;
`;

export const QtyControls = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FAF0E6;
  border-radius: 14px;
  padding: 2px;
`;

export const QtyButton = styled.TouchableOpacity`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
`;

export const QtyText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
  margin-horizontal: 6px;
  min-width: 14px;
  text-align: center;
`;

export const EsgotadoBadge = styled.View`
  background-color: #C0392B;
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 8px;
`;

export const EsgotadoText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const DestaqueBadge = styled.View`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #2E5A1E;
  padding-horizontal: 8px;
  padding-vertical: 3px;
  border-radius: 8px;
  flex-direction: row;
  align-items: center;
  z-index: 1;
`;

export const DestaqueText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 3px;
`;