import styled from 'styled-components/native';

export const DetalheOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

export const DetalheContent = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  max-height: 80%;
`;

export const DetalheHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const DetalheTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #3D2C22;
`;

export const DetalheCloseButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const DetalheInfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const DetalheInfoLabel = styled.Text`
  font-size: 13px;
  color: #8C7355;
`;

export const DetalheInfoValue = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
`;

export const DetalheDivider = styled.View`
  height: 1px;
  background-color: #E6DFD5;
  margin-vertical: 14px;
`;

export const DetalheItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #F0EAE1;
`;

export const DetalheItemImage = styled.Image`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #F0EAE1;
  margin-right: 12px;
`;

export const DetalheItemImagePlaceholder = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background-color: #F0EAE1;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

export const DetalheItemInfo = styled.View`
  flex: 1;
`;

export const DetalheItemNome = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
`;

export const DetalheItemQty = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-top: 2px;
`;

export const DetalheItemSubtotal = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #D35400;
`;

export const DetalheTotalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
`;

export const DetalheTotalLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const DetalheTotalValue = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #D35400;
`;