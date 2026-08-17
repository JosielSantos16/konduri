import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [conectado, setConectado] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConectado(state.isConnected && state.isInternetReachable !== false);
    });
    return unsubscribe;
  }, []);

  return conectado;
}