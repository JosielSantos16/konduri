import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 20px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const HeaderTitle = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #2E5A1E;
`;

export const ProductNameBanner = styled.View`
  background-color: #F0EAE1;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
`;

export const ProductNameText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ProductStockText = styled.Text`
  font-size: 12px;
  color: #8C7355;
  margin-top: 2px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #5C4033;
  margin-bottom: 6px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => (props.hasError ? '#C0392B' : '#E6DFD5')};
  padding-horizontal: 14px;
  height: 52px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #3D2C22;
`;

export const Row = styled.View`
  flex-direction: row;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #C0392B;
  margin-top: 4px;
`;

export const PreviewBox = styled.View`
  background-color: #E6F4EA;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
`;

export const PreviewLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #2E5A1E;
  letter-spacing: 0.5px;
`;

export const PreviewValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #2E5A1E;
  margin-top: 4px;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #3D2C22;
  border-radius: 12px;
  height: 54px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 30px;
`;

export const SaveButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 8px;
  letter-spacing: 0.5px;
`;

export const ErrorBox = styled.View`
  background-color: #FDEDEC;
  border-width: 1px;
  border-color: #F5B7B1;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 16px;
`;

export const GeneralErrorText = styled.Text`
  color: #C0392B;
  font-size: 13px;
  text-align: center;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const DeleteButton = styled.TouchableOpacity`
  margin-left: auto;
`;