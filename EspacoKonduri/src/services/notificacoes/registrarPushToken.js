import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/fireBaseCondig';

const rodandoNoExpoGo = Constants.executionEnvironment === 'storeClient';

export async function registrarPushToken(usuarioUid) {
  if (rodandoNoExpoGo) {
    console.log('Notificação push desativada: só funciona em Development Build, não no Expo Go.');
    return null;
  }

  const Notifications = await import('expo-notifications');
  const Device = await import('expo-device');

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  if (!Device.isDevice) {
    console.log('Notificações push só funcionam em aparelho físico, não em emulador.');
    return null;
  }

  const { status: statusExistente } = await Notifications.getPermissionsAsync();
  let statusFinal = statusExistente;

  if (statusExistente !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    statusFinal = status;
  }

  if (statusFinal !== 'granted') {
    console.log('Permissão de notificação negada pelo usuário.');
    return null;
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync();

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E67E22',
    });
  }

  if (usuarioUid) {
    await updateDoc(doc(db, 'usuarios', usuarioUid), { pushToken: token });
  }

  return token;
}