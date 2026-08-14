import styled from 'styled-components/native';

export const TabContainer = styled.View`
  flex-direction: row;
  padding-horizontal: 20px;
  margin-bottom: 15px;
`;

export const TabButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${props => (props.active ? '#E67E22' : '#FFFFFF')};
  padding-vertical: 10px;
  padding-horizontal: 18px;
  border-radius: 20px;
  margin-right: 10px;
  border-width: ${props => (props.active ? '0px' : '1px')};
  border-color: #E6DFD5;
  elevation: ${props => (props.active ? 2 : 0)};
`;

export const TabText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${props => (props.active ? '#FFFFFF' : '#8C7355')};
  margin-left: 6px;
`;