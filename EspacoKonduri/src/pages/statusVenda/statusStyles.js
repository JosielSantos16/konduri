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
  margin-bottom: 30px;
`;

export const DetailsCard = styled.View`
  background-color: #FAF8F5;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  margin-bottom: 30px;
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
`;

export const ActionButtonSecondaryText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #E67E22;
  margin-left: 8px;
`;