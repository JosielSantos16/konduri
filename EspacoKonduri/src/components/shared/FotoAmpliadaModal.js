import React from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Overlay, FotoGrande, CloseButton } from './fotoAmpliadaStyle';

export default function FotoAmpliadaModal({ uri, onClose }) {
  return (
    <Modal visible={!!uri} transparent animationType="fade" onRequestClose={onClose}>
      <Overlay activeOpacity={1} onPress={onClose}>
        <CloseButton onPress={onClose}>
          <Ionicons name="close" size={22} color="#FFFFFF" />
        </CloseButton>
        {uri && <FotoGrande source={{ uri }} resizeMode="cover" />}
      </Overlay>
    </Modal>
  );
}