import React, { useRef } from "react";
import { Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/logo.jpg";
import { fazerLoginComGoogle } from "../../hooks/useGoogleAuth";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";
import { useLogin } from "../../hooks/useLogin";
import GoogleSignInButton from "../../components/auth/GoogleSignInButton";
import AuthDivider from "../../components/auth/authDivider/AuthDivider";
import AuthFooter from "../../components/auth/authFooter/AuthFooter";
import {
  Container,
  LogoContainer,
  LogoImage,
  Title,
  Subtitle,
  InputGroup,
  Label,
  InputContainer,
  Input,
  EyeButton,
  ForgotPasswordButton,
  ForgotPasswordText,
  ErrorText,
  GeneralErrorBox,
  GeneralErrorText,
  EnterButton,
  EnterButtonText,
} from "./loginStyle";

export default function Login() {
  const router = useRouter();
  const senhaInputRef = useRef(null);

  useAuthRedirect();

  const {
    email,
    senha,
    senhaVisivel,
    setSenhaVisivel,
    carregando,
    enviandoRecuperacao,
    erros,
    handleChangeEmail,
    handleChangeSenha,
    handleLogin,
    handleEsqueciSenha,
  } = useLogin();

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LogoContainer>
        <LogoImage source={Logo} />
      </LogoContainer>

      <Title>LOGIN</Title>
      <Subtitle>Autentique-se para acessar o Espaço Konduri</Subtitle>

      <InputGroup>
        <Label>E-mail</Label>
        <InputContainer hasError={!!erros.email}>
          <Input
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
            placeholder="Digite a sua senha"
            placeholderTextColor="#A99B8F"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
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

      <ForgotPasswordButton onPress={handleEsqueciSenha} disabled={enviandoRecuperacao}>
        <ForgotPasswordText>
          {enviandoRecuperacao ? "Enviando..." : "Esqueci minha senha"}
        </ForgotPasswordText>
      </ForgotPasswordButton>

      {erros.geral && (
        <GeneralErrorBox>
          <GeneralErrorText>{erros.geral}</GeneralErrorText>
        </GeneralErrorBox>
      )}

      <EnterButton onPress={handleLogin} disabled={carregando}>
        {carregando ? (
          <ActivityIndicator color="#3D2C22" />
        ) : (
          <EnterButtonText>ENTRAR</EnterButtonText>
        )}
      </EnterButton>

      <AuthDivider />

      <GoogleSignInButton onPress={fazerLoginComGoogle} disabled={false} />

      <AuthFooter
        texto="Não tem uma conta?"
        linkTexto="Criar conta"
        onPress={() => router.push("/cadastro")}
      />
    </Container>
  );
}