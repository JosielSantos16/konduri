import { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router'; 
import Logo from '../../assets/logo.jpg';
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
  ProfileSelectorContainer,
  ProfileLabel,
  ProfileOptions,
  ProfileButton,
  ProfileButtonText,
  EnterButton,
  EnterButtonText,
  CreateAccountButton,
  CreateAccountButtonText,
} from './loginStyle';

export default function Login() {
  const router = useRouter(); 
  const [email, setEmail] = useState();
  const [senha, setSenha] = useState();
  const [profile, setProfile] = useState('Atendente');

  const handleLogin = () => {
    if (profile === 'Administrador') {
      router.push('/painel'); 
    } else {
      router.push('/pdv'); 
    }
  };

  const handleCreateAccount = () => {
    alert('Indo para tela de cadastro de usuário...');
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LogoContainer>
        <LogoImage source={Logo} />
      </LogoContainer>

      <Title>ESPAÇO KONDURI</Title>
      <Subtitle>Controle de estoque e vendas pelo celular</Subtitle>

      <InputGroup>
        <Label>E-mail</Label>
        <InputContainer>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder='Digite seu email'
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#A99B8F"
          />
        </InputContainer>
      </InputGroup>

      <InputGroup>
        <Label>Senha</Label>
        <InputContainer>
          <Input
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            placeholder='Digite a sua senha'
            placeholderTextColor="#A99B8F"
          />
        </InputContainer>
      </InputGroup>

      <ProfileSelectorContainer>
        <ProfileLabel>SELECIONE O SEU PERFIL</ProfileLabel>
        <ProfileOptions>
          <ProfileButton
            selected={profile === 'Atendente'}
            onPress={() => setProfile('Atendente')}
          >
            <ProfileButtonText selected={profile === 'Atendente'}>
              Atendente
            </ProfileButtonText>
          </ProfileButton>

          <ProfileButton
            selected={profile === 'Administrador'}
            onPress={() => setProfile('Administrador')}
          >
            <ProfileButtonText selected={profile === 'Administrador'}>
              Administrador
            </ProfileButtonText>
          </ProfileButton>
        </ProfileOptions>
      </ProfileSelectorContainer>

      <EnterButton onPress={handleLogin}>
        <EnterButtonText>ENTRAR</EnterButtonText>
      </EnterButton>

      <CreateAccountButton onPress={handleCreateAccount}>
        <CreateAccountButtonText>CRIAR CONTA</CreateAccountButtonText>
      </CreateAccountButton>
    </Container>
  );
}