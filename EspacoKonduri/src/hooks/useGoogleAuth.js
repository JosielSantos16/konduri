import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebase/fireBaseCondig';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function fazerLoginComGoogle() {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  const idToken = userInfo.data?.idToken || userInfo.idToken;

  const credential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(auth, credential);
}