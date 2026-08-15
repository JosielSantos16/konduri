import styled from 'styled-components/native';

export const Card = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 14px;
  border-width: 1px;
  border-color: #E6DFD5;
  elevation: 1;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #F0EAE1;
`;

export const CardHeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Dot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #E67E22;
  margin-right: 8px;
`;

export const ProductName = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const EditButton = styled.TouchableOpacity`
  background-color: #E6F4EA;
  padding-horizontal: 12px;
  padding-vertical: 5px;
  border-radius: 10px;
`;

export const EditButtonText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #2E5A1E;
`;

export const StatsRow = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`;

export const StatBlock = styled.View`
  flex: 1;
`;

export const StatLabel = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #A99B8F;
  margin-bottom: 3px;
  letter-spacing: 0.3px;
`;

export const StatValue = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const SaldoBlock = styled.View`
  flex: 1;
  background-color: #E6F4EA;
  border-radius: 10px;
  padding: 6px 10px;
`;

export const SaldoLabel = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #2E5A1E;
  margin-bottom: 3px;
  letter-spacing: 0.3px;
`;

export const SaldoValue = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #2E5A1E;
`;