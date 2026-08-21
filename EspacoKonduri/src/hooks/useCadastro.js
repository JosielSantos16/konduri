import { useState } from "react";
import { useRouter } from "expo-router";
import { cadastrarUsuario } from "../services/queries/usuariosQueries";
import {
  validateEmail,
  validatePasswordStrength,
  validatePasswordConfirmacao,
  getPasswordChecks,
} from "../utils/validators";

export function useCadastro() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({
    email: null,
    senha: null,
    confirmarSenha: null,
    geral: null,
  });

  const checksAtuais = getPasswordChecks(senha);
  const mostrarChecklist = senha.length > 0;

  const handleChangeEmail = (value) => {
    setEmail(value);
    if (erros.email) setErros((prev) => ({ ...prev, email: null }));
  };

  const handleChangeSenha = (value) => {
    setSenha(value);
    if (erros.senha) setErros((prev) => ({ ...prev, senha: null }));
    if (erros.confirmarSenha)
      setErros((prev) => ({ ...prev, confirmarSenha: null }));
  };

  const handleChangeConfirmarSenha = (value) => {
    setConfirmarSenha(value);
    if (erros.confirmarSenha)
      setErros((prev) => ({ ...prev, confirmarSenha: null }));
  };

  const validarFormulario = () => {
    const novosErros = {
      email: validateEmail(email),
      senha: validatePasswordStrength(senha),
      confirmarSenha: validatePasswordConfirmacao(senha, confirmarSenha),
      geral: null,
    };
    setErros(novosErros);
    return !novosErros.email && !novosErros.senha && !novosErros.confirmarSenha;
  };

  const handleCadastrar = async () => {
    if (!validarFormulario()) return;

    setCarregando(true);
    setErros((prev) => ({ ...prev, geral: null }));

    try {
      await cadastrarUsuario({ nome: "", email: email.trim(), senha });
      router.replace("/verificar-email");
    } catch (erro) {
      setErros((prev) => ({ ...prev, geral: mensagemDeErro(erro) }));
    } finally {
      setCarregando(false);
    }
  };

  return {
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
  };
}

function mensagemDeErro(erro) {
  switch (erro?.code) {
    case "auth/email-already-in-use":
      return 'Este e-mail já tem uma conta criada. Se você ainda não verificou, toque em "Entrar" abaixo e use a senha que você escolheu — lá tem a opção de reenviar a verificação.';
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/weak-password":
      return "A senha precisa ter pelo menos 8 caracteres.";
    default:
      return erro?.message || "Não foi possível criar a conta. Tente novamente.";
  }
}