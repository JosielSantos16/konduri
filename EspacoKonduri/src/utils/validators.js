const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PALAVRAS_PROIBIDAS = [
  'piroca',
  'buceta',
  'caralho',
  'porra',
  'puta',
  'putz',
  'merda',
  'cacete',
  'foda',
  'fdp',
  'arrombado',
  'desgraca',
  'viado',
  'corno',
  'otario',
  'idiota',
  'burro',
  'imbecil',
];

const SENHAS_FRACAS_COMUNS = [
  '12345678',
  '123456789',
  '87654321',
  'password',
  'senha123',
  'qwertyui',
  'abcdefgh',
  '11111111',
  '00000000',
  'admin123',
];

const LEETSPEAK_MAP = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  '$': 's',
  '!': 'i',
};

function normalizarParaFiltro(texto) {
  let normalizado = texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  normalizado = normalizado
    .split('')
    .map(char => LEETSPEAK_MAP[char] || char)
    .join('');

  normalizado = normalizado.replace(/[\s._\-]/g, '');

  normalizado = normalizado.replace(/(.)\1+/g, '$1');

  return normalizado;
}

const PALAVRAS_PROIBIDAS_NORMALIZADAS = PALAVRAS_PROIBIDAS.map(normalizarParaFiltro);

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Informe seu e-mail.';
  if (!EMAIL_REGEX.test(email.trim())) return 'E-mail inválido.';
  return null;
}

export function validatePasswordRequired(senha) {
  if (!senha) return 'Informe sua senha.';
  return null;
}

export function validatePasswordStrength(senha) {
  if (!senha) return 'Informe uma senha.';

  if (senha.length < 8) {
    return 'A senha precisa ter no mínimo 8 caracteres.';
  }

  if (!/[a-z]/.test(senha)) {
    return 'A senha precisa ter pelo menos uma letra minúscula.';
  }

  if (!/[A-Z]/.test(senha)) {
    return 'A senha precisa ter pelo menos uma letra maiúscula.';
  }

  if (!/[0-9]/.test(senha)) {
    return 'A senha precisa ter pelo menos um número.';
  }

  if (isSequenciaNumerica(senha)) {
    return 'Evite sequências numéricas óbvias, como 12345678.';
  }

  if (/^(.)\1+$/.test(senha)) {
    return 'A senha não pode ser um caractere repetido.';
  }

  if (SENHAS_FRACAS_COMUNS.includes(senha.toLowerCase())) {
    return 'Essa senha é muito comum. Escolha uma mais segura.';
  }

  return null;
}

function isSequenciaNumerica(senha) {
  const apenasNumeros = senha.replace(/\D/g, '');
  if (apenasNumeros.length < 4) return false;

  let crescente = true;
  let decrescente = true;

  for (let i = 1; i < apenasNumeros.length; i++) {
    const atual = Number(apenasNumeros[i]);
    const anterior = Number(apenasNumeros[i - 1]);

    if (atual !== anterior + 1) crescente = false;
    if (atual !== anterior - 1) decrescente = false;
  }

  return crescente || decrescente;
}

export function validateName(nome) {
  if (!nome || !nome.trim()) return 'Informe seu nome.';

  const nomeLimpo = nome.trim();

  if (nomeLimpo.length < 3) return 'O nome precisa ter no mínimo 3 caracteres.';

  if (!/^[A-Za-zÀ-ÿ0-9\s'.\-_@$!]+$/.test(nomeLimpo)) {
    return 'O nome contém caracteres não permitidos.';
  }

  const nomeNormalizado = normalizarParaFiltro(nomeLimpo);
  const contemPalavraProibida = PALAVRAS_PROIBIDAS_NORMALIZADAS.some(palavra =>
    nomeNormalizado.includes(palavra)
  );

  if (contemPalavraProibida) {
    return 'Esse nome contém termos não permitidos.';
  }

  return null;
}