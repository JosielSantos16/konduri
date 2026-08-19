import React from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Overlay,
  Content,
  Header,
  Title,
  Input,
  SaveButton,
  SaveButtonText,
} from './observacaoModalStyle';

export default function ObservacaoModal({ visible, onClose, value, onChangeText }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Overlay>
        <Content>
          <Header>
            <Title>Alguma observação?</Title>
            <Ionicons name="close" size={22} color="#3D2C22" onPress={onClose} />
          </Header>

          <Input
            placeholder="Ex: sem gelo, embalar pra viagem..."
            placeholderTextColor="#A99B8F"
            value={value}
            onChangeText={onChangeText}
            multiline
            autoFocus
          />

          <SaveButton onPress={onClose}>
            <SaveButtonText>Salvar</SaveButtonText>
          </SaveButton>
        </Content>
      </Overlay>
    </Modal>
  );
}