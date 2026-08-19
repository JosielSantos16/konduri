import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #3D2C22;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

export const SuccessIconContainer = styled.View`
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: #2ECC71;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  elevation: 4;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #E67E22;
  text-align: center;
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text`
  font-size: 13px;
  color: #D3C5B4;
  text-align: center;
  margin-bottom: 20px;
`;

export const ItemsCard = styled.View`
  background-color: rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 14px 16px;
  width: 100%;
  margin-bottom: 16px;
`;

export const ItemsCardTitle = styled.Text`
  font-size: 11px;
  font-weight: bold;
  color: #D3C5B4;
  letter-spacing: 0.3px;
  margin-bottom: 10px;
`;

export const ItemRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 4px;
`;

export const ItemName = styled.Text`
  font-size: 13px;
  color: #FAF8F5;
  flex: 1;
`;

export const ItemQtyPrice = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #D3C5B4;
`;

export const DetailsCard = styled.View`
  background-color: #FAF8F5;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  margin-bottom: 16px;
  elevation: 3;
`;

export const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const DetailLabel = styled.Text`
  font-size: 13px;
  font-weight: bold;
  color: #8C7355;
  letter-spacing: 0.5px;
`;

export const DetailValue = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #3D2C22;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #E6DFD5;
  margin-bottom: 12px;
  border-style: dashed;
`;

export const PrintStatusBox = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) =>
    props.status === 'impresso' ? 'rgba(46,204,113,0.15)' :
    props.status === 'erro' ? 'rgba(192,57,43,0.15)' :
    'rgba(255,255,255,0.08)'};
  border-radius: 12px;
  padding: 12px 14px;
  width: 100%;
  margin-bottom: 14px;
`;

export const PrintStatusText = styled.Text`
  flex: 1;
  font-size: 13px;
  font-weight: bold;
  color: ${(props) =>
    props.status === 'impresso' ? '#2ECC71' :
    props.status === 'erro' ? '#E74C3C' :
    '#D3C5B4'};
  margin-left: 8px;
`;

export const ActionButtonPrimary = styled.TouchableOpacity`
  background-color: #E67E22;
  border-radius: 14px;
  height: 54px;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 14px;
  elevation: 3;
`;

export const ActionButtonPrimaryText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  margin-left: 8px;
`;

export const ActionButtonSecondary = styled.TouchableOpacity`
  background-color: transparent;
  border-width: 1.5px;
  border-color: #8C7355;
  border-radius: 14px;
  height: 54px;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 14px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

export const ActionButtonSecondaryText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #E67E22;
  margin-left: 8px;
`;

export const ShareButton = styled.TouchableOpacity`
  background-color: transparent;
  height: 44px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const ShareButtonText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #D3C5B4;
  margin-left: 6px;
`;