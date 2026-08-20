import styled from 'styled-components/native';

export const BellButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #FFFFFF;
  border-width: 1px;
  border-color: #E6DFD5;
  justify-content: center;
  align-items: center;
`;

export const Badge = styled.View`
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #C0392B;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  justify-content: center;
  align-items: center;
  padding-horizontal: 4px;
`;

export const BadgeText = styled.Text`
  font-size: 10px;
  font-weight: bold;
  color: #FFFFFF;
`;