import { useState, useRef } from 'react';
import { Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../assets/logo.jpg';
import { cadastrarUsuario } from '../../services/queries/usuariosQueries';
import {
  validateEmail,
  validatePasswordStrength,
  validatePasswordConfirmacao,
  validateName,
  getPasswordChecks,
} from '../../utils/validators';
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
  ChecklistContainer,
  ChecklistRow,
  ChecklistText,
  ErrorText,
  GeneralErrorBox,
  GeneralErrorText,
  CreateButton,
  CreateButtonText,
  BackButton,
  BackButtonText,
} from './cadastroStyle';

const REQUISITOS_SENHA = [
  { key: 'minLength', label: 'Mínimo de 8 caracteres' },
  { key: 'hasUpper', label: 'Pelo menos 1 letra maiúscula' },
  { key: 'hasLower', label: 'Pelo menos 1 letra minúscula' },
  { key: 'hasNumber', label: 'Pelo menos 1 número' },
  { key: 'semSequenciaOuRepeticao', label: 'Sem sequência ou repetição óbvia' },
];

export default function Cadastro() {
  const router = useRouter();
  const emailInputRef = useRef(null);
  const senhaInputRef = useRef(null);
  const confirmarSenhaInputRef = useRef(null);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [erros, setErros] = useState({
    nome: null,
    email: null,
    senha: null,
    confirmarSenha: null,
    geral: null,
  });

  const checksAtuais = getPasswordChecks(senha);
  const mostrarChecklist = senha.length > 0;

  const handleChangeNome = (value) => {
    setNome(value);
    if (erros.nome) setErros((prev) => ({ ...prev, nome: null }));
  };

  const handleChangeEmail = (value) => {
    setEmail(value);
    if (erros.email) setErros((prev) => ({ ...prev, email: null }));
  };

  const handleChangeSenha = (value) => {
    setSenha(value);
    if (erros.senha) setErros((prev) => ({ ...prev, senha: null }));
    if (erros.confirmarSenha) setErros((prev) => ({ ...prev, confirmarSenha: null }));
  };

  const handleChangeConfirmarSenha = (value) => {
    setConfirmarSenha(value);
    if (erros.confirmarSenha) setErros((prev) => ({ ...prev, confirmarSenha: null }));
  };

  const validarFormulario = () => {
    const novosErros = {
      nome: validateName(nome),
      email: validateEmail(email),
      senha: validatePasswordStrength(senha),
      confirmarSenha: validatePasswordConfirmacao(senha, confirmarSenha),
      geral: null,
    };
    setErros(novosErros);
    return !novosErros.nome && !novosErros.email && !novosErros.senha && !novosErros.confirmarSenha;
  };

  const handleCadastrar = async () => {
    if (!validarFormulario()) return;

    setCarregando(true);
    setErros((prev) => ({ ...prev, geral: null }));

    try {
      await cadastrarUsuario({ nome: nome.trim(), email: email.trim(), senha });

      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.push('/cliente-home');
    } catch (erro) {
      setErros((prev) => ({ ...prev, geral: mensagemDeErro(erro) }));
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
            returnKeyType="next"
            onSubmitEditing={() => emailInputRef.current?.focus()}
            blurOnSubmit={false}
          />
        </InputContainer>
        {erros.nome && <ErrorText>{erros.nome}</ErrorText>}
      </InputGroup>

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
              name={senhaVisivel ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#8C7355"
            />
          </EyeButton>
        </InputContainer>
        {erros.senha && <ErrorText>{erros.senha}</ErrorText>}
      </InputGroup>

      {mostrarChecklist && (
        <ChecklistContainer>
          {REQUISITOS_SENHA.map((req) => (
            <ChecklistRow key={req.key}>
              <Ionicons
                name={checksAtuais[req.key] ? 'checkmark-circle' : 'ellipse-outline'}
                size={14}
                color={checksAtuais[req.key] ? '#2E5A1E' : '#A99B8F'}
              />
              <ChecklistText ok={checksAtuais[req.key]}>{req.label}</ChecklistText>
            </ChecklistRow>
          ))}
        </ChecklistContainer>
      )}

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
              name={confirmarSenhaVisivel ? 'eye-off-outline' : 'eye-outline'}
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