import React from 'react';
import {
  Header,
  UserInfo,
  UserName,
  UserRole,
  HeaderRight,
  StatusBadge,
  StatusDot,
  StatusText,
  UserAvatar,
} from './pdvHeaderStyle';

export default function PdvHeader({ name, role, statusLabel, avatarUri }) {
  return (
    <Header>
      <UserInfo>
        <UserName>{name}</UserName>
        <UserRole>{role}</UserRole>
      </UserInfo>
      <HeaderRight>
        <StatusBadge>
          <StatusDot />
          <StatusText>{statusLabel}</StatusText>
        </StatusBadge>
        <UserAvatar source={{ uri: avatarUri }} />
      </HeaderRight>
    </Header>
  );
}