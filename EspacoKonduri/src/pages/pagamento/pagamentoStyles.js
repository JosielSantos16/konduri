import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #FAF8F5;
  padding-horizontal: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 20px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #F0EAE1;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

export const HeaderTitleContainer = styled.View`
  flex-direction: column;
`;

export const HeaderTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3D2C22;
`;

export const HeaderSubtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
`;

export const TotalCard = styled.View`
  background-color: #3D2C22;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  elevation: 2;
`;

export const TotalLabel = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #A99B8F;
  letter-spacing: 0.8px;
  margin-bottom: 5px;
`;

export const TotalValue = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #E67E22;
  margin-bottom: 15px;
`;

export const TotalDivider = styled.View`
  height: 1px;
  background-color: #5C4033;
  margin-bottom: 12px;
`;

export const TotalDetails = styled.Text`
  font-size: 12px;
  color: #D3C5B4;
`;

export const SectionTitle = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
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
  padding: 20px 10px;
  align-items: center;
  margin-horizontal: 5px;
  border-width: 2px;
  border-color: ${props => (props.selected ? '#E67E22' : '#E6DFD5')};
  elevation: ${props => (props.selected ? 3 : 1)};
`;

export const MethodIconContainer = styled.View`
  width: 45px;
  height: 45px;
  border-radius: 22.5px;
  background-color: #FAF0E6;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

export const MethodTitle = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
  margin-bottom: 4px;
`;

export const MethodSubtitle = styled.Text`
  font-size: 11px;
  color: #8C7355;
  text-align: center;
`;

export const ChangeContainer = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  border-width: 1px;
  border-color: #E6DFD5;
  margin-bottom: 25px;
`;

export const ChangeHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const ChangeTitle = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ChangeBadge = styled.View`
  background-color: #E6F4EA;
  padding-horizontal: 8px;
  padding-vertical: 3px;
  border-radius: 10px;
`;

export const ChangeBadgeText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #137333;
`;

export const ChangeInputsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const InputWrapper = styled.View`
  flex: 1;
  margin-right: 10px;
`;

export const InputLabel = styled.Text`
  font-size: 11px;
  color: #8C7355;
  margin-bottom: 5px;
`;

export const StyledInput = styled.TextInput`
  background-color: #FAF8F5;
  border-radius: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
  height: 45px;
  padding-horizontal: 12px;
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ChangeOutputWrapper = styled.View`
  flex: 1;
  margin-left: 10px;
`;

export const ChangeBox = styled.View`
  background-color: #E6F4EA;
  border-radius: 10px;
  height: 45px;
  justify-content: center;
  padding-horizontal: 12px;
`;

export const ChangeValueText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #137333;
`;

export const FinalizeButton = styled.TouchableOpacity`
  background-color: #E67E22;
  border-radius: 14px;
  height: 56px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  elevation: 3;
`;

export const FinalizeButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 0.5px;
  margin-left: 8px;
`;