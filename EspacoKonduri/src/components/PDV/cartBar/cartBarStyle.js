import styled from 'styled-components/native';

export const CartBar = styled.View`
  background-color: #FFFFFF;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 16px 20px 40px 20px;
  margin-bottom: -20px;
  border-width: 1px;
  border-color: #E6E6E0;
  elevation: 10;
`;

export const CartBarTouchable = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const CartBarInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CartItemsText = styled.Text`
  font-size: 14px;
  color: #5E5E5E;
`;

export const CartTotalRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const CartTotalText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #6B5300;
  margin-right: 6px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ClearButton = styled.TouchableOpacity`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: #E6E6E0;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export const FinalizeButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #1A1A1A;
  border-radius: 12px;
  height: 52px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const FinalizeButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.5px;
`;

export const ObservacaoRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: 8px;
  margin-bottom: 8px;
`;

export const ObservacaoText = styled.Text`
  flex: 1;
  font-size: 12px;
  color: ${(props) => (props.temTexto ? '#1A1A1A' : '#9E9E9E')};
  font-weight: ${(props) => (props.temTexto ? 'bold' : 'normal')};
  margin-left: 6px;
`;