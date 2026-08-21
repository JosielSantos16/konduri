import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GoogleButton, GoogleButtonText } from './googleSignInButtonStyle';

export default function GoogleSignInButton({ onPress, disabled, carregando }) {
  return (
    <GoogleButton onPress={onPress} disabled={disabled} style={{ opacity: disabled ? 0.6 : 1 }}>
      {carregando ? (
        <ActivityIndicator color="#3C4043" />
      ) : (
        <>
          <Ionicons name="logo-google" size={18} color="#4285F4" />
          <GoogleButtonText>Continuar com Google</GoogleButtonText>
        </>
      )}
    </GoogleButton>
  );
}