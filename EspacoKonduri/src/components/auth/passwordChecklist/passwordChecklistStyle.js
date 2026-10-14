import styled from "styled-components/native";

export const ChecklistContainer = styled.View`
  margin-top: -8px;
  margin-bottom: 16px;
  padding-horizontal: 4px;
`;

export const ChecklistRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

export const ChecklistText = styled.Text`
  font-size: 12px;
  color: ${(props) => (props.ok ? "#2E5A1E" : "#9E9E9E")};
  margin-left: 6px;
`;