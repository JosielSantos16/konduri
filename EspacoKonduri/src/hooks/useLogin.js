import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { auth } from "../firebase/fireBaseCondig";
import { getRotaPosLogin } from "../utils/rotaPosLogin";
import { loginUsuario, enviarRecuperacaoSenha } from "../services/queries/usuariosQueries";
import { validateEmail, validatePasswordRequired } from "../utils/validators";

export function useLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
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

      router.replace(getRotaPosLogin(usuario, auth.currentUser));

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
      Alert.alert(
        "Informe seu e-mail",
        "Preencha o campo de e-mail acima para receber o link de recuperação."
      );
      return;
    }

    setEnviandoRecuperacao(true);
    try {
      await enviarRecuperacaoSenha(email.trim());
      Alert.alert(
        "E-mail enviado",
        "Enviamos um link de recuperação de senha para o seu e-mail. Verifique também a caixa de spam."
      );
    } catch (erro) {
      Alert.alert("Erro", mensagemDeErro(erro));
    } finally {
      setEnviandoRecuperacao(false);
    }
  };

  return {
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
  };
}

function mensagemDeErro(erro) {
  switch (erro?.code) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde.";
    default:
      return erro?.message || "Não foi possível entrar. Tente novamente.";
  }
}