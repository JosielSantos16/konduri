import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { atualizarPerfilUsuario } from '../../services/queries/usuariosQueries';
import { uploadUserPhoto } from '../../services/queries/storageQueries';
import { validateName } from '../../utils/validators';
import {
  Container,
  Title,
  Subtitle,
  PhotoPicker,
  PhotoPreview,
  PhotoPickerText,
  InputGroup,
  Label,
  InputContainer,
  Input,
  ErrorText,
  SaveButton,
  SaveButtonText,
} from './completarPerfilStyle';

export default function CompletarPerfil() {
  const router = useRouter();
  const { usuario } = useAuth();

  const [nome, setNome] = useState('');
  const [fotoLocal, setFotoLocal] = useState(null);
  const [erroNome, setErroNome] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const escolherFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às fotos para escolher uma imagem.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
});

    if (!resultado.canceled) {
      setFotoLocal(resultado.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
  const erro = validateName(nome);
  if (erro) {
    setErroNome(erro);
    return;
  }

  setSalvando(true);

  // Tenta subir a foto separadamente — se falhar (ex: serviço fora do ar),
  // avisa mas NÃO impede de salvar o nome e continuar usando o app
  let fotoUrl = null;
  if (fotoLocal) {
    try {
      fotoUrl = await uploadUserPhoto(fotoLocal);
    } catch (erroFoto) {
      console.error('Erro ao enviar foto (seguindo sem foto):', erroFoto);
      Alert.alert(
        'Foto não enviada',
        'Não foi possível enviar sua foto agora (o serviço pode estar temporariamente indisponível). Você pode continuar sem foto e adicionar depois no seu perfil.'
      );
    }
  }

  try {
    await atualizarPerfilUsuario(usuario.uid, {
      nome: nome.trim(),
      ...(fotoUrl && { foto: fotoUrl }),
    });

    if (usuario.perfil === 'adm') router.replace('/painel');
    else if (usuario.perfil === 'atendente') router.replace('/pdv');
    else router.replace('/cliente-home');
  } catch (erro) {
    console.error('Erro ao salvar perfil:', erro);
    Alert.alert('Erro', 'Não foi possível salvar seu perfil. Tente novamente.');
  } finally {
    setSalvando(false);
  }
};

  return (
    <Container>
      <Title>Complete seu perfil</Title>
      <Subtitle>Adicione uma foto e seu nome para continuar</Subtitle>

      <PhotoPicker onPress={escolherFoto}>
        {fotoLocal ? (
          <PhotoPreview source={{ uri: fotoLocal }} />
        ) : (
          <>
            <Ionicons name="camera-outline" size={28} color="#8C7355" />
            <PhotoPickerText>Adicionar{'\n'}foto</PhotoPickerText>
          </>
        )}
      </PhotoPicker>

      <InputGroup>
        <Label>Nome</Label>
        <InputContainer hasError={!!erroNome}>
          <Input
            value={nome}
            onChangeText={(v) => {
              setNome(v);
              if (erroNome) setErroNome(null);
            }}
            placeholder="Digite seu nome"
            placeholderTextColor="#A99B8F"
            maxLength={60}
          />
        </InputContainer>
        {erroNome && <ErrorText>{erroNome}</ErrorText>}
      </InputGroup>

      <SaveButton onPress={handleSalvar} disabled={salvando}>
        {salvando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
            <SaveButtonText>Continuar</SaveButtonText>
          </>
        )}
      </SaveButton>
    </Container>
  );
}