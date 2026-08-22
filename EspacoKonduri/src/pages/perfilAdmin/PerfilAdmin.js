import React, { useState } from "react";
import { Alert, ActivityIndicator, Modal, RefreshControl, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import {
  deslogarUsuario,
  atualizarPerfilUsuario,
  trocarSenha,
  excluirConta,
} from "../../services/queries/usuariosQueries";
import { uploadUserPhoto } from "../../services/queries/storageQueries";
import NavBar from "../../components/painel/navBar/NavBar";
import FotoAmpliadaModal from "../../components/shared/FotoAmpliadaModal";
import {
  Container,
  ScrollContainer,
  Header,
  AvatarImage,
  AvatarPlaceholder,
  Nome,
  Cargo,
  InfoCard,
  InfoRow,
  InfoRowLast,
  InfoTextGroup,
  InfoLabel,
  InfoValue,
  ToggleRow,
  ToggleTextGroup,
  ToggleTitle,
  ToggleSubtitle,
  EditButton,
  EditButtonText,
  LogoutButton,
  LogoutButtonText,
  DangerButton,
  DangerButtonText,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalLabel,
  ModalInputRow,
  ModalInput,
  ModalSaveButton,
  ModalSaveButtonText,
} from "./perfilAdminStyle";

export default function PerfilAdmin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { usuario, refetchUsuario } = useAuth();

  const [atualizando, setAtualizando] = useState(false);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [modalNomeVisivel, setModalNomeVisivel] = useState(false);
  const [modalTelefoneVisivel, setModalTelefoneVisivel] = useState(false);
  const [modalSenhaVisivel, setModalSenhaVisivel] = useState(false);
  const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);
  const [novoNome, setNovoNome] = useState(usuario?.nome || "");
  const [novoTelefone, setNovoTelefone] = useState(usuario?.telefone || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [senhaExclusao, setSenhaExclusao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const notificacoesAtivadas = usuario?.notificacoesAtivadas !== false;

  const handleRefresh = async () => {
    setAtualizando(true);
    await refetchUsuario();
    setAtualizando(false);
  };

  const handleSair = () => {
    Alert.alert("Sair da conta", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await deslogarUsuario();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleTrocarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert("Permissão necessária", "Precisamos de acesso às fotos para escolher uma imagem.");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (resultado.canceled) return;

    try {
      const fotoUrl = await uploadUserPhoto(resultado.assets[0].uri);
      await atualizarPerfilUsuario(usuario.uid, { foto: fotoUrl });
      await refetchUsuario();
      Alert.alert("Pronto!", "Sua foto foi atualizada.");
    } catch (erro) {
      console.error("Erro ao trocar foto:", erro);
      Alert.alert("Erro", "Não foi possível enviar a foto agora. Tente novamente.");
    }
  };

  const handleSalvarNome = async () => {
    if (!novoNome.trim() || novoNome.trim().length < 3) {
      Alert.alert("Nome inválido", "Digite um nome com pelo menos 3 caracteres.");
      return;
    }

    setSalvando(true);
    try {
      await atualizarPerfilUsuario(usuario.uid, { nome: novoNome.trim() });
      await refetchUsuario();
      setModalNomeVisivel(false);
    } catch (erro) {
      console.error("Erro ao salvar nome:", erro);
      Alert.alert("Erro", "Não foi possível salvar o nome. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarTelefone = async () => {
    setSalvando(true);
    try {
      await atualizarPerfilUsuario(usuario.uid, { telefone: novoTelefone.trim() });
      await refetchUsuario();
      setModalTelefoneVisivel(false);
    } catch (erro) {
      console.error("Erro ao salvar telefone:", erro);
      Alert.alert("Erro", "Não foi possível salvar o telefone. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarSenha = async () => {
    if (!senhaAtual) {
      Alert.alert("Informe sua senha atual");
      return;
    }
    if (novaSenha.length < 8) {
      Alert.alert("Senha muito curta", "A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (novaSenha !== confirmarNovaSenha) {
      Alert.alert("As senhas não coincidem", "Confirme a nova senha corretamente.");
      return;
    }

    setSalvando(true);
    try {
      await trocarSenha(senhaAtual, novaSenha);
      Alert.alert("Pronto!", "Sua senha foi alterada com sucesso.");
      setModalSenhaVisivel(false);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");
    } catch (erro) {
      console.error("Erro ao trocar senha:", erro);
      const mensagem =
        erro?.code === "auth/wrong-password" || erro?.code === "auth/invalid-credential"
          ? "Senha atual incorreta."
          : "Não foi possível trocar a senha. Tente novamente.";
      Alert.alert("Erro", mensagem);
    } finally {
      setSalvando(false);
    }
  };

  const handleToggleNotificacoes = async (valor) => {
    try {
      await atualizarPerfilUsuario(usuario.uid, { notificacoesAtivadas: valor });
      await refetchUsuario();
    } catch (erro) {
      console.error("Erro ao atualizar preferência de notificação:", erro);
      Alert.alert("Erro", "Não foi possível salvar essa preferência agora.");
    }
  };

  const handleExcluirConta = async () => {
    setExcluindo(true);
    try {
      await excluirConta(senhaExclusao);
      router.replace("/login");
    } catch (erro) {
      console.error("Erro ao excluir conta:", erro);
      const mensagem =
        erro?.code === "auth/wrong-password" || erro?.code === "auth/invalid-credential"
          ? "Senha incorreta."
          : erro?.code === "auth/requires-recent-login"
          ? "Por segurança, saia e entre novamente antes de excluir sua conta."
          : "Não foi possível excluir a conta agora. Tente novamente.";
      Alert.alert("Erro", mensagem);
    } finally {
      setExcluindo(false);
    }
  };

  const confirmarExclusao = () => {
    Alert.alert(
      "Excluir conta",
      "Essa ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Continuar", style: "destructive", onPress: () => setModalExcluirVisivel(true) },
      ]
    );
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <ScrollContainer
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={handleRefresh} colors={["#F39C12"]} tintColor="#F39C12" />
        }
      >
        <Header>
          {usuario?.foto ? (
            <TouchableOpacity onPress={() => setFotoAmpliada(usuario.foto)} onLongPress={handleTrocarFoto}>
              <AvatarImage source={{ uri: usuario.foto }} resizeMode="cover" />
            </TouchableOpacity>
          ) : (
            <AvatarPlaceholder onTouchEnd={handleTrocarFoto}>
              <Ionicons name="camera-outline" size={28} color="#F39C12" />
            </AvatarPlaceholder>
          )}
          <Nome>{usuario?.nome || "Administrador"}</Nome>
          <Cargo>Administrador</Cargo>
        </Header>

        <InfoCard>
          <InfoRow>
            <Ionicons name="mail-outline" size={20} color="#8C7355" />
            <InfoTextGroup>
              <InfoLabel>E-MAIL</InfoLabel>
              <InfoValue>{usuario?.email || "—"}</InfoValue>
            </InfoTextGroup>
          </InfoRow>

          <InfoRow>
            <Ionicons name="call-outline" size={20} color="#8C7355" />
            <InfoTextGroup>
              <InfoLabel>TELEFONE / WHATSAPP</InfoLabel>
              <InfoValue>{usuario?.telefone || "Não informado"}</InfoValue>
            </InfoTextGroup>
          </InfoRow>

          <InfoRowLast>
            <Ionicons name="calendar-outline" size={20} color="#8C7355" />
            <InfoTextGroup>
              <InfoLabel>CADASTRADO EM</InfoLabel>
              <InfoValue>
                {usuario?.criadoEm ? new Date(usuario.criadoEm).toLocaleDateString("pt-BR") : "—"}
              </InfoValue>
            </InfoTextGroup>
          </InfoRowLast>
        </InfoCard>

        <InfoCard>
          <ToggleRow>
            <ToggleTextGroup>
              <ToggleTitle>Notificações</ToggleTitle>
              <ToggleSubtitle>Vendas, estoque baixo e pedidos</ToggleSubtitle>
            </ToggleTextGroup>
            <Switch
              value={notificacoesAtivadas}
              onValueChange={handleToggleNotificacoes}
              trackColor={{ false: '#E6DFD5', true: '#FBD9A0' }}
              thumbColor={notificacoesAtivadas ? '#F39C12' : '#FFFFFF'}
            />
          </ToggleRow>
        </InfoCard>

        <EditButton onPress={() => setModalNomeVisivel(true)}>
          <Ionicons name="pencil-outline" size={16} color="#F39C12" />
          <EditButtonText>Editar Nome</EditButtonText>
        </EditButton>

        <EditButton onPress={() => setModalTelefoneVisivel(true)}>
          <Ionicons name="call-outline" size={16} color="#F39C12" />
          <EditButtonText>Editar Telefone</EditButtonText>
        </EditButton>

        <EditButton onPress={() => setModalSenhaVisivel(true)}>
          <Ionicons name="lock-closed-outline" size={16} color="#F39C12" />
          <EditButtonText>Alterar Senha</EditButtonText>
        </EditButton>

        <LogoutButton onPress={handleSair}>
          <Ionicons name="log-out-outline" size={20} color="#C0392B" />
          <LogoutButtonText>Sair da Conta</LogoutButtonText>
        </LogoutButton>

        <DangerButton onPress={confirmarExclusao}>
          <Ionicons name="trash-outline" size={16} color="#C0392B" />
          <DangerButtonText>Excluir minha conta</DangerButtonText>
        </DangerButton>
      </ScrollContainer>

      <NavBar />

      <Modal visible={modalNomeVisivel} transparent animationType="fade" onRequestClose={() => setModalNomeVisivel(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Editar Nome</ModalTitle>
              <Ionicons name="close" size={22} color="#3D2C22" onPress={() => setModalNomeVisivel(false)} />
            </ModalHeader>
            <ModalLabel>Nome</ModalLabel>
            <ModalInputRow>
              <ModalInput value={novoNome} onChangeText={setNovoNome} placeholder="Seu nome" maxLength={60} />
            </ModalInputRow>
            <ModalSaveButton onPress={handleSalvarNome} disabled={salvando}>
              {salvando ? <ActivityIndicator color="#FFFFFF" /> : <ModalSaveButtonText>Salvar</ModalSaveButtonText>}
            </ModalSaveButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Modal visible={modalTelefoneVisivel} transparent animationType="fade" onRequestClose={() => setModalTelefoneVisivel(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Editar Telefone</ModalTitle>
              <Ionicons name="close" size={22} color="#3D2C22" onPress={() => setModalTelefoneVisivel(false)} />
            </ModalHeader>
            <ModalLabel>Telefone / WhatsApp</ModalLabel>
            <ModalInputRow>
              <ModalInput
                value={novoTelefone}
                onChangeText={setNovoTelefone}
                placeholder="(00) 00000-0000"
                keyboardType="phone-pad"
                maxLength={20}
              />
            </ModalInputRow>
            <ModalSaveButton onPress={handleSalvarTelefone} disabled={salvando}>
              {salvando ? <ActivityIndicator color="#FFFFFF" /> : <ModalSaveButtonText>Salvar</ModalSaveButtonText>}
            </ModalSaveButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Modal visible={modalSenhaVisivel} transparent animationType="fade" onRequestClose={() => setModalSenhaVisivel(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Alterar Senha</ModalTitle>
              <Ionicons name="close" size={22} color="#3D2C22" onPress={() => setModalSenhaVisivel(false)} />
            </ModalHeader>
            <ModalLabel>Senha atual</ModalLabel>
            <ModalInputRow>
              <ModalInput
                value={senhaAtual}
                onChangeText={setSenhaAtual}
                placeholder="Digite sua senha atual"
                secureTextEntry
                autoCapitalize="none"
              />
            </ModalInputRow>
            <ModalLabel>Nova senha</ModalLabel>
            <ModalInputRow>
              <ModalInput
                value={novaSenha}
                onChangeText={setNovaSenha}
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
                autoCapitalize="none"
              />
            </ModalInputRow>
            <ModalLabel>Confirme a nova senha</ModalLabel>
            <ModalInputRow>
              <ModalInput
                value={confirmarNovaSenha}
                onChangeText={setConfirmarNovaSenha}
                placeholder="Digite novamente"
                secureTextEntry
                autoCapitalize="none"
              />
            </ModalInputRow>
            <ModalSaveButton onPress={handleSalvarSenha} disabled={salvando}>
              {salvando ? <ActivityIndicator color="#FFFFFF" /> : <ModalSaveButtonText>Salvar</ModalSaveButtonText>}
            </ModalSaveButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Modal visible={modalExcluirVisivel} transparent animationType="fade" onRequestClose={() => setModalExcluirVisivel(false)}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Confirmar Exclusão</ModalTitle>
              <Ionicons name="close" size={22} color="#3D2C22" onPress={() => setModalExcluirVisivel(false)} />
            </ModalHeader>
            <ModalLabel>Digite sua senha para confirmar</ModalLabel>
            <ModalInputRow>
              <ModalInput
                value={senhaExclusao}
                onChangeText={setSenhaExclusao}
                placeholder="Sua senha"
                secureTextEntry
                autoCapitalize="none"
              />
            </ModalInputRow>
            <ModalSaveButton onPress={handleExcluirConta} disabled={excluindo} style={{ backgroundColor: '#C0392B' }}>
              {excluindo ? <ActivityIndicator color="#FFFFFF" /> : <ModalSaveButtonText>Excluir Conta</ModalSaveButtonText>}
            </ModalSaveButton>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <FotoAmpliadaModal uri={fotoAmpliada} onClose={() => setFotoAmpliada(null)} />
    </Container>
  );
}