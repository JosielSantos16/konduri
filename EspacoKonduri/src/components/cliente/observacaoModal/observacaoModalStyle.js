import styled from 'styled-components/native';

export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  padding: 24px;
`;

export const Content = styled.View`
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Input = styled.TextInput`
  background-color: #FAF8F5;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6DFD5;
  padding: 12px 14px;
  font-size: 14px;
  color: #3D2C22;
  min-height: 90px;
  text-align-vertical: top;
  margin-bottom: 16px;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #E67E22;
  border-radius: 12px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

export const SaveButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
`;