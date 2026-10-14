import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: #FAFAF7;
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
  padding-horizontal: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: 15px;
  padding-bottom: 20px;
`;

export const HeaderLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const BackButton = styled.TouchableOpacity`
  margin-right: 12px;
`;

export const HeaderTitle = styled.Text`
  font-size: 19px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const DeleteButton = styled.TouchableOpacity`
  padding: 6px;
`;

export const InputGroup = styled.View`
  margin-bottom: 16px;
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 6px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props) => (props.hasError ? '#C0392B' : '#E6E6E0')};
  padding-horizontal: 14px;
  height: 52px;
`;

export const Input = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #1A1A1A;
`;

export const InputPrefix = styled.Text`
  font-size: 15px;
  color: #6B6B6B;
  margin-right: 6px;
`;

export const InputText = styled.Text`
  flex: 1;
  font-size: 15px;
  color: ${(props) => (props.placeholder ? '#9E9E9E' : '#1A1A1A')};
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #C0392B;
  margin-top: 4px;
`;

export const HelperText = styled.Text`
  font-size: 12px;
  color: #6B6B6B;
  margin-top: 4px;
`;

export const SegmentOptions = styled.View`
  flex-direction: row;
  background-color: #F1F1EB;
  border-radius: 12px;
  padding: 4px;
`;

export const SegmentButton = styled.TouchableOpacity`
  flex: 1;
  padding-vertical: 10px;
  align-items: center;
  border-radius: 10px;
  background-color: ${(props) => (props.selected ? '#FFFFFF' : 'transparent')};
  elevation: ${(props) => (props.selected ? 2 : 0)};
`;

export const SegmentButtonText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: ${(props) => (props.selected ? '#6B5300' : '#6B6B6B')};
`;

export const ChipsWrap = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

export const Chip = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
  border-width: 1px;
  border-color: ${(props) => (props.selected ? '#E0A800' : '#E6E6E0')};
  background-color: ${(props) => (props.selected ? '#FFF7D1' : '#FFFFFF')};
`;

export const ChipText = styled.Text`
  font-size: 13px;
  font-weight: ${(props) => (props.selected ? 'bold' : 'normal')};
  color: ${(props) => (props.selected ? '#6B5300' : '#333333')};
`;

export const MonthSelector = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 6px;
`;

export const MonthArrow = styled.TouchableOpacity`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  background-color: #F1F1EB;
`;

export const MonthLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const SwitchRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
  padding: 10px 14px;
`;

export const SwitchLabel = styled.Text`
  font-size: 15px;
  color: #1A1A1A;
`;

export const TextAreaContainer = styled.View`
  background-color: #FFFFFF;
  border-radius: 12px;
  border-width: 1px;
  border-color: #E6E6E0;
`;

export const TextArea = styled.TextInput`
  font-size: 15px;
  color: #1A1A1A;
  padding: 14px;
  min-height: 80px;
  text-align-vertical: top;
`;

export const SaveButton = styled.TouchableOpacity`
  background-color: #1A1A1A;
  border-radius: 12px;
  height: 54px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 30px;
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};
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
  background-color: #FAFAF7;
`;
