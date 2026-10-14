import styled from 'styled-components/native';

export const SectionTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #1A1A1A;
  margin-bottom: 12px;
`;

export const PaymentMethodsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const MethodCard = styled.TouchableOpacity`
  flex: 1;
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px 6px;
  align-items: center;
  margin-horizontal: 4px;
  border-width: 2px;
  border-color: ${props => (props.selected ? '#E0A800' : '#E6E6E0')};
  elevation: ${props => (props.selected ? 3 : 1)};
`;

export const MethodIconContainer = styled.View`
  width: 45px;
  height: 45px;
  border-radius: 22.5px;
  background-color: #F4F1E6;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const MethodTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
  margin-bottom: 4px;
`;

export const MethodSubtitle = styled.Text`
  font-size: 11px;
  color: #6B6B6B;
  text-align: center;
`;