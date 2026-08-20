import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { deslogarUsuario } from '../../../services/queries/usuariosQueries';
import NotificacoesBell from '../../../components/notificacoes/NotificacoesBell';
import {
  Header,
  UserInfo,
  UserName,
  HeaderRight,
} from './pdvHeaderStyle';

export default function PdvHeader({ name, role, statusLabel, aberto, avatarUri }) {
  const router = useRouter();

  const handleSair = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await deslogarUsuario();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <Header>
      <UserInfo>
        <UserName>{name}</UserName>
      </UserInfo>
       
      <HeaderRight>
        <NotificacoesBell />
         {/* <StatusBadge aberto={aberto}>
          <StatusDot aberto={aberto} />
          <StatusText aberto={aberto}>{statusLabel}</StatusText>
        </StatusBadge> */}
      </HeaderRight>
    </Header>
  );
}