import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../firebase/fireBaseCondig";
import { garantirUsuarioNoFirestore } from "../services/queries/usuariosQueries";
import { getRotaPosLogin } from "../utils/rotaPosLogin";

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      if (!firebaseUser.emailVerified) {
        router.replace("/verificar-email");
        return;
      }

      const usuario = await garantirUsuarioNoFirestore({
        uid: firebaseUser.uid,
        nome: firebaseUser.displayName || "",
        email: firebaseUser.email,
      });

      router.replace(getRotaPosLogin(usuario, firebaseUser));
    });

    return unsubscribe;
  }, []);
}