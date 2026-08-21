import React, { useRef } from "react";
import { Platform, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/logo.jpg";
import { fazerLoginComGoogle } from "../../hooks/useGoogleAuth";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import { useCadastro } from "../../hooks/useCadastro";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import PasswordChecklist from "../../components/auth/passwordChecklist/PasswordChecklist";
import AuthDivider from "../../components/auth/authDivider/AuthDivider";
import AuthFooter from "../../components/auth/authFooter/AuthFooter";
import {
  LogoContainer,
  LogoImage,
  Title,
  Subtitle,
  InputGroup,
  Label,
  InputContainer,
  Input,
  EyeButton,
  ErrorText,
  GeneralErrorBox,
  GeneralErrorText,
  CreateButton,
  CreateButtonText,
} from "./cadastroStyle";

export default function Cadastro() {
  const router = useRouter();
  const emailInputRef = useRef(null);
  const senhaInputRef = useRef(null);
  const confirmarSenhaInputRef = useRef(null);

  useAuthRedirect();

  const {
    email,
    senha,
    confirmarSenha,
    senhaVisivel,
    setSenhaVisivel,
    confirmarSenhaVisivel,
    setConfirmarSenhaVisivel,
    carregando,
    erros,
    checksAtuais,
    mostrarChecklist,
    handleChangeEmail,
    handleChangeSenha,
    handleChangeConfirmarSenha,
    handleCadastrar,
  } = useCadastro();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FAF8F5", justifyContent: "center", padding: 24 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LogoContainer>
        <LogoImage source={Logo} />
      </LogoContainer>

      <Title>CRIAR CONTA</Title>
      <Subtitle>Cadastre-se para acessar o Espaço Konduri</Subtitle>

      <InputGroup>
        <Label>E-mail</Label>
        <InputContainer hasError={!!erros.email}>
          <Input
            ref={emailInputRef}
            value={email}
            onChangeText={handleChangeEmail}
            placeholder="Digite seu email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#A99B8F"
            returnKeyType="next"
            onSubmitEditing={() => senhaInputRef.current?.focus()}
            blurOnSubmit={false}
          />
        </InputContainer>
        {erros.email && <ErrorText>{erros.email}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>Senha</Label>
        <InputContainer hasError={!!erros.senha}>
          <Input
            ref={senhaInputRef}
            secureTextEntry={!senhaVisivel}
            autoCapitalize="none"
            value={senha}
            onChangeText={handleChangeSenha}
            placeholder="Digite sua senha"
            placeholderTextColor="#A99B8F"
            returnKeyType="next"
            onSubmitEditing={() => confirmarSenhaInputRef.current?.focus()}
            blurOnSubmit={false}
          />
          <EyeButton onPress={() => setSenhaVisivel((prev) => !prev)}>
            <Ionicons
              name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#8C7355"
            />
          </EyeButton>
        </InputContainer>
        {erros.senha && <ErrorText>{erros.senha}</ErrorText>}
      </InputGroup>

      {mostrarChecklist && <PasswordChecklist checks={checksAtuais} />}

      <InputGroup>
        <Label>Confirme sua senha</Label>
        <InputContainer hasError={!!erros.confirmarSenha}>
          <Input
            ref={confirmarSenhaInputRef}
            secureTextEntry={!confirmarSenhaVisivel}
            autoCapitalize="none"
            value={confirmarSenha}
            onChangeText={handleChangeConfirmarSenha}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#A99B8F"
            returnKeyType="done"
            onSubmitEditing={handleCadastrar}
          />
          <EyeButton onPress={() => setConfirmarSenhaVisivel((prev) => !prev)}>
            <Ionicons
              name={confirmarSenhaVisivel ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#8C7355"
            />
          </EyeButton>
        </InputContainer>
        {erros.confirmarSenha && <ErrorText>{erros.confirmarSenha}</ErrorText>}
      </InputGroup>

      {erros.geral && (
        <GeneralErrorBox>
          <GeneralErrorText>{erros.geral}</GeneralErrorText>
        </GeneralErrorBox>
      )}

      <CreateButton onPress={handleCadastrar} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <CreateButtonText>CRIAR CONTA</CreateButtonText>
        )}
      </CreateButton>

      <AuthDivider />

      <GoogleSignInButton onPress={fazerLoginComGoogle} disabled={false} />

      <AuthFooter texto="Já tem uma conta?" linkTexto="Entrar" onPress={() => router.back()} />
    </KeyboardAvoidingView>
  );
}