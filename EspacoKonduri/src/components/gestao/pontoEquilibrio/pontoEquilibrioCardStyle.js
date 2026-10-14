import styled from 'styled-components/native';

export const EquilibrioCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  border-width: 1.5px;
  border-color: ${(props) => (props.atingido ? '#A9D5B5' : '#F2DC7C')};
  padding: 18px;
  margin-bottom: 12px;
`;

export const EquilibrioLinha = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 8px;
`;

export const EquilibrioLabel = styled.Text`
  font-size: 13px;
  color: #6B6B6B;
`;

export const EquilibrioValor = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: #1A1A1A;
`;

export const BarraFundo = styled.View`
  height: 14px;
  border-radius: 7px;
  background-color: #F1F1EB;
  margin-top: 14px;
  overflow: hidden;
`;

export const BarraPreenchida = styled.View`
  height: 14px;
  border-radius: 7px;
  background-color: ${(props) => (props.atingido ? '#2E9E5B' : '#FFD000')};
`;

export const BarraLegenda = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #333333;
  text-align: right;
  margin-top: 4px;
`;

export const EquilibrioMensagem = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.cor || '#1A1A1A'};
  margin-top: 12px;
`;

export const EquilibrioSubmensagem = styled.Text`
  font-size: 12px;
  line-height: 17px;
  color: #6B6B6B;
  margin-top: 4px;
`;

export const MetaDiariaBox = styled.View`
  flex-direction: row;
  background-color: #FFF7D1;
  border-radius: 12px;
  padding: 12px;
  margin-top: 12px;
`;

export const MetaDiariaBloco = styled.View`
  flex: 1;
  align-items: center;
`;

export const MetaDiariaLabel = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #6B5300;
  letter-spacing: 0.5px;
`;

export const MetaDiariaValor = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #1A1A1A;
  margin-top: 2px;
`;

export const EquilibrioHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

export const EquilibrioTitulo = styled.Text`
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
  color: #6B6B6B;
  margin-left: 8px;
`;
