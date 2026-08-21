import React from "react";
import { DividerRow, DividerLine, DividerText } from "./authDividerStyle";

export default function AuthDivider({ text = "ou continue com" }) {
  return (
    <DividerRow>
      <DividerLine />
      <DividerText>{text}</DividerText>
      <DividerLine />
    </DividerRow>
  );
}