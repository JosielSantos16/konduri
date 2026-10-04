import styled from 'styled-components/native';

export const EquilibrioCard = styled.View`
  background-color: #FFFFFF;
  border-radius: 16px;
  border-width: 1.5px;
  border-color: ${(props) => (props.atingido ? '#A9D5B5' : '#F8D7A9')};
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
  color: #8C7355;
`;

export const EquilibrioValor = styled.Text`
  font-size: 17px;
  font-weight: bold;
  color: #3D2C22;
`;

export const BarraFundo = styled.View`
  height: 14px;
  border-radius: 7px;
  background-color: #F0EAE1;
  margin-top: 14px;
  overflow: hidden;
`;

export const BarraPreenchida = styled.View`
  height: 14px;
  border-radius: 7px;
  background-color: ${(props) => (props.atingido ? '#2E9E5B' : '#E67E22')};
`;

export const BarraLegenda = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #5C4033;
  text-align: right;
  margin-top: 4px;
`;

export const EquilibrioMensagem = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.cor || '#3D2C22'};
  margin-top: 12px;
`;

export const EquilibrioSubmensagem = styled.Text`
  font-size: 12px;
  line-height: 17px;
  color: #8C7355;
  margin-top: 4px;
`;

export const MetaDiariaBox = styled.View`
  flex-direction: row;
  background-color: #FEF5E7;
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
  color: #8C5A2E;
  letter-spacing: 0.5px;
`;

export const MetaDiariaValor = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
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
  color: #8C7355;
  margin-left: 8px;
`;
