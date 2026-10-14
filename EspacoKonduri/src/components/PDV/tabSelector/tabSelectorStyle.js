import styled from 'styled-components/native';

export const TabContainer = styled.View`
  flex-direction: row;
  padding-horizontal: 20px;
  margin-bottom: 15px;
`;

export const TabButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => (props.active ? '#FFD000' : '#FFFFFF')};
  padding-vertical: 10px;
  padding-horizontal: 18px;
  border-radius: 20px;
  margin-right: 10px;
  border-width: ${props => (props.active ? '0px' : '1px')};
  border-color: #E6E6E0;
  elevation: ${props => (props.active ? 2 : 0)};
`;

export const TabText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${props => (props.active ? '#1A1A1A' : '#6B6B6B')};
  margin-left: 6px;
`;

export const TabCount = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: ${props => (props.active ? 'rgba(255,255,255,0.8)' : '#9E9E9E')};
  margin-left: 4px;
`;