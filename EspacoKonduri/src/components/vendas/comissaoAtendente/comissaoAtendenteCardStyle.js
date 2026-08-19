import styled from 'styled-components/native';

export const ComissaoCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 10px;
  border-width: 1px;
  border-color: #E6DFD5;
`;

export const ComissaoHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const ComissaoNome = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ComissaoBase = styled.Text`
  font-size: 12px;
  color: #8C7355;
`;

export const ComissaoInputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ComissaoInputContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: #F0EAE1;
  border-radius: 10px;
  padding-horizontal: 12px;
  height: 44px;
  margin-right: 8px;
`;

export const ComissaoInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const ComissaoPercentSymbol = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #8C7355;
`;

export const ComissaoSaveButton = styled.TouchableOpacity`
  background-color: #2E5A1E;
  border-radius: 10px;
  height: 44px;
  padding-horizontal: 16px;
  justify-content: center;
  align-items: center;
`;

export const ComissaoSaveButtonText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const ComissaoSavedBox = styled.View`
  background-color: #E6F4EA;
  border-radius: 10px;
  padding: 10px 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

export const ComissaoSavedText = styled.Text`
  font-size: 12px;
  color: #2E5A1E;
`;

export const ComissaoSavedValue = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #2E5A1E;
`;