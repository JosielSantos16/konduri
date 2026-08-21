import React, { useState, useEffect } from "react";
import { abrirCaixaDeEntrada } from '../../utils/abrirEmail';
import { Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth } from "../../firebase/fireBaseCondig";
import { useAuth } from "../../hooks/useAuth";
import {
  reenviarEmailVerificacao,
  deslogarUsuario,
} from "../../services/queries/usuariosQueries";
import {
  Container,
  IconCircle,
  Title,
  Subtitle,
  EmailText,
  PrimaryButton,
  PrimaryButtonText,
  SecondaryButton,
  SecondaryButtonText,
  LogoutText,
  SpamNotice,
  SpamNoticeText,
  SpamNoticeTextBold
} from "./verificarEmailStyle";

const COOLDOWN_SEGUNDOS = 30;

export default function VerificarEmail() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [verificando, setVerificando] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const irParaProximaTela = () => {
    if (!usuario?.nome) {
      router.replace("/completar-perfil");
    } else if (usuario.perfil === "adm") {
      router.replace("/painel");
    } else if (usuario.perfil === "atendente") {
      router.replace("/pdv");
    } else {
      router.replace("/cliente-home");
    }
  };

  const handleJaConfirmei = async () => {
    setVerificando(true);
    try {
      await auth.currentUser.reload();

      if (auth.currentUser.emailVerified) {
        irParaProximaTela();
      } else {
        Alert.alert(
          "Ainda não verificado",
          "Não encontramos a confirmação ainda. Verifique se você clicou no link do e-mail (e confira a caixa de spam).",
        );
      }
    } catch (erro) {
      console.error("Erro ao verificar status do e-mail:", erro);
      Alert.alert("Erro", "Não foi possível verificar agora. Tente novamente.");
    } finally {
      setVerificando(false);
    }
  };

  const handleReenviar = async () => {
    if (cooldown > 0) return;

    setReenviando(true);
    try {
      await reenviarEmailVerificacao();
      Alert.alert(
        "E-mail reenviado",
        "Confira sua caixa de entrada (e o spam) novamente.",
      );
      setCooldown(COOLDOWN_SEGUNDOS);
    } catch (erro) {
      console.error("Erro ao reenviar verificação:", erro);
      Alert.alert(
        "Erro",
        "Não foi possível reenviar agora. Tente novamente em instantes.",
      );
    } finally {
      setReenviando(false);
    }
  };

  const handleSair = async () => {
    await deslogarUsuario();
    router.replace("/login");
  };

  return (
    <Container>
      <IconCircle>
        <Ionicons name="mail-outline" size={40} color="#E67E22" />
      </IconCircle>

      <Title>Confirme seu e-mail</Title>
      <Subtitle>Enviamos um link de confirmação para:</Subtitle>
      <TouchableOpacity onPress={() => abrirCaixaDeEntrada(usuario?.email || auth.currentUser?.email)}>
  <EmailText style={{ textDecorationLine: 'underline' }}>
    {usuario?.email || auth.currentUser?.email}
  </EmailText>
</TouchableOpacity>
      <Subtitle>
        Abra seu e-mail, clique no link, e depois toque no botão abaixo para
        continuar.
      </Subtitle>

      <SpamNotice>
        <Ionicons name="alert-circle-outline" size={16} color="#B85D00" />
        <SpamNoticeText>
          Não encontrou? Verifique também a pasta de{" "}
          <SpamNoticeTextBold>Spam ou Lixo Eletrônico</SpamNoticeTextBold>.
        </SpamNoticeText>
      </SpamNotice>

      <PrimaryButton
        onPress={handleJaConfirmei}
        disabled={verificando}
        style={{ marginTop: 20 }}
      >
        {verificando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color="#FFFFFF"
            />
            <PrimaryButtonText>Já confirmei, continuar</PrimaryButtonText>
          </>
        )}
      </PrimaryButton>

      <SecondaryButton
        onPress={handleReenviar}
        disabled={reenviando || cooldown > 0}
      >
        <SecondaryButtonText>
          {cooldown > 0
            ? `Reenviar e-mail (${cooldown}s)`
            : reenviando
              ? "Reenviando..."
              : "Reenviar e-mail"}
        </SecondaryButtonText>
      </SecondaryButton>

      <SecondaryButton onPress={handleSair}>
        <LogoutText>Sair</LogoutText>
      </SecondaryButton>
    </Container>
  );
}
