import styled from 'styled-components/native';

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
  background-color: ${props => (props.warning ? '#FDECEA' : '#E6F4EA')};
  padding-horizontal: 8px;
  padding-vertical: 3px;
  border-radius: 10px;
`;

export const ChangeBadgeText = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: ${props => (props.warning ? '#C0392B' : '#137333')};
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
  background-color: ${props => (props.warning ? '#FDECEA' : '#E6F4EA')};
  border-radius: 10px;
  height: 45px;
  justify-content: center;
  padding-horizontal: 12px;
`;

export const ChangeValueText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => (props.warning ? '#C0392B' : '#137333')};
`;