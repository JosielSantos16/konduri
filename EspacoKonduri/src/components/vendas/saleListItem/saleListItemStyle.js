import styled from 'styled-components/native';

export const SaleCard = styled.TouchableOpacity`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 1;
`;

export const SaleLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const SaleRight = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
`;

export const SaleIconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background-color: #F0EAE1;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  overflow: hidden;
`;

export const SaleProductImage = styled.Image`
  width: 44px;
  height: 44px;
`;

export const MetodoBadge = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(props) => (props.type === 'pix' ? '#E8F8F5' : '#E9F7EF')};
  justify-content: center;
  align-items: center;
  margin-right: 6px;
`;

export const SaleInfo = styled.View`
  flex-direction: column;
  flex: 1;
`;

export const SaleTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 2px;
`;

export const SaleDetails = styled.Text`
  font-size: 12px;
  color: #8C7355;
`;

export const SalePrice = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #3D2C22;
  margin-right: 8px;
`;