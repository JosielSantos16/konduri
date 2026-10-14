import styled from 'styled-components/native';

export const SheetContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #1A1A1A;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  elevation: 12;
`;

export const SheetHandle = styled.View`
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(255,255,255,0.3);
  align-self: center;
  margin-top: 8px;
  margin-bottom: 6px;
`;

export const SheetCollapsedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 6px 20px 16px 20px;
`;

export const SheetExpandedContent = styled.View`
  padding: 0px 20px 20px 20px;
`;

export const SheetDivider = styled.View`
  height: 1px;
  background-color: rgba(255,255,255,0.15);
  margin-vertical: 12px;
`;

export const SheetRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const SheetRowLabel = styled.Text`
  font-size: 13px;
  color: #C4C4BE;
`;

export const SheetRowValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
`;

export const SheetSectionTitle = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #9E9E9E;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
`;