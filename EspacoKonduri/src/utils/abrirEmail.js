import { Linking, Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';

const PROVEDORES_EMAIL = {
  'gmail.com': {
    androidPackage: 'com.google.android.gm',
    iosScheme: 'googlegmail://',
    web: 'https://mail.google.com/mail/u/0/#inbox',
  },
  'outlook.com': {
    androidPackage: 'com.microsoft.office.outlook',
    iosScheme: 'ms-outlook://',
    web: 'https://outlook.live.com/mail/0/inbox',
  },
  'hotmail.com': {
    androidPackage: 'com.microsoft.office.outlook',
    iosScheme: 'ms-outlook://',
    web: 'https://outlook.live.com/mail/0/inbox',
  },
  'yahoo.com': {
    androidPackage: 'com.yahoo.mobile.client.android.mail',
    iosScheme: 'ymail://',
    web: 'https://mail.yahoo.com',
  },
  'icloud.com': {
    web: 'https://www.icloud.com/mail',
  },
};

export async function abrirCaixaDeEntrada(email) {
  if (!email) return;

  const dominio = email.split('@')[1]?.toLowerCase();
  const provedor = PROVEDORES_EMAIL[dominio];

  if (!provedor) {
    await Linking.openURL(`https://${dominio}`).catch(() => {});
    return;
  }

  if (Platform.OS === 'android' && provedor.androidPackage) {
    try {
      await IntentLauncher.openApplication(provedor.androidPackage);
      return;
    } catch (erro) {
    }
  }

  if (Platform.OS === 'ios' && provedor.iosScheme) {
    try {
      await Linking.openURL(provedor.iosScheme);
      return;
    } catch (erro) {
    }
  }

  await Linking.openURL(provedor.web).catch(() => {});
}