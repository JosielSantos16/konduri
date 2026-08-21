import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAF8F5;
  justify-content: center;
  padding: 24px;
`;

export const Title = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3D2C22;
  text-align: center;
  margin-bottom: 6px;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #8C7355;
  text-align: center;
  margin-bottom: 30px;
`;

export const PhotoPicker = styled.TouchableOpacity`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: #F0EAE1;
  justify-content: center;
  align-items: center;
  align-self: center;
  margin-bottom: 24px;
  border-width: 1.5px;
  border-color: #E6DFD5;
  border-style: dashed;
  overflow: hidden;
`;

export const PhotoPreview = styled.Image`
  width: 120px;
  height: 120px;
`;

export const PhotoPickerText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #8C7355;
  margin-top: 6px;
  text-align: center;
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
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props) => (props.hasError ? '#C0392B' : '#E6DFD5')};
  padding-horizontal: 14px;
  height: 52px;
  justify-content: center;
`;

export const Input = styled.TextInput`
  font-size: 15px;
  color: #3D2C22;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #C0392B;
  margin-top: 4px;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #E67E22;
  border-radius: 12px;
  height: 52px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;

export const SaveButtonText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 8px;
  letter-spacing: 0.5px;
`;