import { useState, useRef } from 'react';
import { Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../assets/logo.jpg';
import { loginUsuario, enviarRecuperacaoSenha } from '../../services/queries/usuariosQueries';
import { validateEmail, validatePasswordRequired } from '../../utils/validators';
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
  CreateAccountButton,
  CreateAccountButtonText,
} from './loginStyle';

export default function Login() {
  const router = useRouter();
  const senhaInputRef = useRef(null);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [enviandoRecuperacao, setEnviandoRecuperacao] = useState(false);

  const [erros, setErros] = useState({ email: null, senha: null, geral: null });

  const handleChangeEmail = (value) => {
    setEmail(value);
    if (erros.email) setErros((prev) => ({ ...prev, email: null }));
  };

  const handleChangeSenha = (value) => {
    setSenha(value);
    if (erros.senha) setErros((prev) => ({ ...prev, senha: null }));
  };

  const validarFormulario = () => {
    const novosErros = {
      email: validateEmail(email),
      senha: validatePasswordRequired(senha),
      geral: null,
    };
    setErros(novosErros);
    return !novosErros.email && !novosErros.senha;
  };

  const handleLogin = async () => {
    if (!validarFormulario()) return;

    setCarregando(true);
    setErros((prev) => ({ ...prev, geral: null }));

    try {
      const usuario = await loginUsuario({ email: email.trim(), senha });
      if (usuario.perfil === 'adm') {
  router.replace('/painel');
} else if (usuario.perfil === 'atendente') {
  router.replace('/pdv');
} else {
  router.replace('/cliente-home');
}
    } catch (erro) {
      setErros((prev) => ({ ...prev, geral: mensagemDeErro(erro) }));
    } finally {
      setCarregando(false);
    }
  };

  const handleEsqueciSenha = async () => {
    const erroEmail = validateEmail(email);

    if (erroEmail) {
      setErros((prev) => ({ ...prev, email: erroEmail }));
      Alert.alert('Informe seu e-mail', 'Preencha o campo de e-mail acima para receber o link de recuperação.');
      return;
    }

    setEnviandoRecuperacao(true);

    try {
      await enviarRecuperacaoSenha(email.trim());
      Alert.alert(
        'E-mail enviado',
        'Enviamos um link de recuperação de senha para o seu e-mail. Verifique também a caixa de spam.'
      );
    } catch (erro) {
      Alert.alert('Erro', mensagemDeErro(erro));
    } finally {
      setEnviandoRecuperacao(false);
    }
  };

  const handleCreateAccount = () => {
    router.push('/cadastro');
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
              name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#8C7355"
            />
          </EyeButton>
        </InputContainer>
        {erros.senha && <ErrorText>{erros.senha}</ErrorText>}
      </InputGroup>

      <ForgotPasswordButton onPress={handleEsqueciSenha} disabled={enviandoRecuperacao}>
        <ForgotPasswordText>
          {enviandoRecuperacao ? 'Enviando...' : 'Esqueci minha senha'}
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

      <CreateAccountButton onPress={handleCreateAccount}>
        <CreateAccountButtonText>CRIAR CONTA</CreateAccountButtonText>
      </CreateAccountButton>
    </Container>
  );
}

function mensagemDeErro(erro) {
  switch (erro?.code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    default:
      return erro?.message || 'Não foi possível entrar. Tente novamente.';
  }
}