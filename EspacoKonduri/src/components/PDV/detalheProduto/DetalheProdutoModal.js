import React from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice } from '../../../utils/formatPrice';
import {
  Overlay,
  Content,
  CloseButton,
  ImagemGrande,
  ImagemPlaceholder,
  Titulo,
  Preco,
  InfoRow,
  InfoLabel,
  InfoValue,
  Observacoes,
} from './detalheProdutoModalStyle';

export default function DetalheProdutoModal({ visible, item, onClose }) {
  if (!item) return null;

  const estoqueDisponivel = item.estoque ?? 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Overlay activeOpacity={1} onPress={onClose}>
        <Content onStartShouldSetResponder={() => true}>
          <CloseButton onPress={onClose}>
            <Ionicons name="close" size={22} color="#3D2C22" />
          </CloseButton>

          {item.image ? (
            <ImagemGrande source={{ uri: item.image }} resizeMode="cover" />
          ) : (
            <ImagemPlaceholder>
              <Ionicons name="image-outline" size={36} color="#C9BBA8" />
            </ImagemPlaceholder>
          )}

          <Titulo>{item.title}</Titulo>
          <Preco>{formatPrice(item.price)}</Preco>

          <InfoRow>
            <InfoLabel>Estoque disponível</InfoLabel>
            <InfoValue>{estoqueDisponivel} un</InfoValue>
          </InfoRow>

          {item.category && (
            <InfoRow>
              <InfoLabel>Categoria</InfoLabel>
              <InfoValue>{item.category === 'ingressos' ? 'Ingresso' : 'Produto'}</InfoValue>
            </InfoRow>
          )}

          {!!item.observacoes && (
            <Observacoes>{item.observacoes}</Observacoes>
          )}
        </Content>
      </Overlay>
    </Modal>
  );
}