import { useState } from 'react';
import { Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../../assets/logo.jpg';
import { cadastrarUsuario } from '../../services/queries/usuariosQueries';
import { validateEmail, validatePasswordStrength, validateName } from '../../utils/validators';
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
  ErrorText,
  GeneralErrorBox,
  GeneralErrorText,
  CreateButton,
  CreateButtonText,
  BackButton,
  BackButtonText,
} from './cadastroStyle';

export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [erros, setErros] = useState({ nome: null, email: null, senha: null, geral: null });

  const handleChangeNome = (value) => {
    setNome(value);
    if (erros.nome) setErros(prev => ({ ...prev, nome: null }));
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
    if (erros.email) setErros(prev => ({ ...prev, email: null }));
  };

  const handleChangeSenha = (value) => {
    setSenha(value);
    if (erros.senha) setErros(prev => ({ ...prev, senha: null }));
  };

  const validarFormulario = () => {
    const novosErros = {
      nome: validateName(nome),
      email: validateEmail(email),
      senha: validatePasswordStrength(senha),
      geral: null,
    };
    setErros(novosErros);
    return !novosErros.nome && !novosErros.email && !novosErros.senha;
  };

  const handleCadastrar = async () => {
    if (!validarFormulario()) return;

    setCarregando(true);
    setErros(prev => ({ ...prev, geral: null }));

    try {
     
      await cadastrarUsuario({ nome, email, senha });

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.push('/pdv');
    } catch (erro) {
      setErros(prev => ({ ...prev, geral: mensagemDeErro(erro) }));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LogoContainer>
        <LogoImage source={Logo} />
      </LogoContainer>

      <Title>CRIAR CONTA</Title>
      <Subtitle>Cadastre-se para acessar o Espaço Konduri</Subtitle>

      <InputGroup>
        <Label>Nome</Label>
        <InputContainer hasError={!!erros.nome}>
          <Input
            value={nome}
            onChangeText={handleChangeNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#A99B8F"
          />
        </InputContainer>
        {erros.nome && <ErrorText>{erros.nome}</ErrorText>}
      </InputGroup>

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
          />
        </InputContainer>
        {erros.email && <ErrorText>{erros.email}</ErrorText>}
      </InputGroup>

      <InputGroup>
        <Label>Senha</Label>
        <InputContainer hasError={!!erros.senha}>
          <Input
            secureTextEntry
            value={senha}
            onChangeText={handleChangeSenha}
            placeholder="Digite sua senha"
            placeholderTextColor="#A99B8F"
          />
        </InputContainer>
        {erros.senha && <ErrorText>{erros.senha}</ErrorText>}
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

      <BackButton onPress={() => router.back()}>
        <BackButtonText>ENTRAR</BackButtonText>
      </BackButton>
    </Container>
  );
}

function mensagemDeErro(erro) {
  switch (erro?.code) {
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 8 caracteres.';
    default:
      return erro?.message || 'Não foi possível criar a conta. Tente novamente.';
  }
}