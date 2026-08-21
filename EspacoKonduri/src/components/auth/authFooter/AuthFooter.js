import React from "react";
import { FooterRow, FooterText, FooterLink, FooterLinkText } from "./authFooterStyle";

export default function AuthFooter({ texto, linkTexto, onPress }) {
  return (
    <FooterRow>
      <FooterText>{texto}</FooterText>
      <FooterLink onPress={onPress}>
        <FooterLinkText>{linkTexto}</FooterLinkText>
      </FooterLink>
    </FooterRow>
  );
}