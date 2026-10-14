const theme = {
  // Paleta da logo Konduri: amarelo-ouro e preto, com fundo claro.
  // Verde (sucesso), vermelho (erro) e as cores de Pix/Cartão/Dinheiro
  // continuam como cores de significado, fora desta paleta.
  colors: {
    primary: '#FFD000', // amarelo da logo: botões principais, cards de destaque, abas ativas
    primaryDark: '#E0A800', // dourado: bordas e variações do amarelo
    primaryText: '#8A6A00', // dourado escuro: texto e ícones de destaque sobre fundo claro
    primaryTextStrong: '#6B5300', // dourado mais escuro: avisos e itens selecionados
    textOnPrimary: '#1A1A1A', // sempre preto sobre o amarelo (branco não dá para ler)
    textPrimary: '#1A1A1A',
    textSecondary: '#6B6B6B',
    textMuted: '#5E5E5E',
    placeholder: '#9E9E9E',
    iconMuted: '#C4C4BE',
    background: '#FAFAF7',
    surface: '#FFFFFF',
    surfaceMuted: '#F1F1EB',
    surfaceAccent: '#F4F1E6', // creme das faixas da logo
    highlightBg: '#FFF7D1', // amarelo claro para avisos e destaques
    highlightBorder: '#F2DC7C',
    border: '#E6E6E0',
    successBg: '#E6F4EA',
    successDot: '#34A853',
    successText: '#137333',
    dark: '#1A1A1A', // preto da logo: botões secundários e cards escuros
  },


  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 20,
  },

  typography: {
    title: { fontSize: 22, fontWeight: 'bold' },
    subtitle: { fontSize: 13, fontWeight: 'normal' },
    body: { fontSize: 14, fontWeight: 'normal' },
    bodyBold: { fontSize: 14, fontWeight: 'bold' },
    price: { fontSize: 15, fontWeight: 'bold' },
    total: { fontSize: 20, fontWeight: 'bold' },
  },
};

export default theme;