// Textos do topo do perfil, separados da tela para serem testados.

// null = ainda carregando ou falhou: mostra "—" em vez de um número errado (antes era fixo).
export const formatStat = (value: number | null | undefined): string =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 ? String(value) : '—';

export const statAccessibilityLabel = (label: string, value: number | null | undefined): string =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? `${label}: ${value}`
    : `${label}: carregando`;

// Nome e tag vêm do banco; sem eles a tela não pode mostrar "undefined!" nem "!" sozinho.
export const displayName = (nome: string | null | undefined): string => {
  const limpo = nome?.trim();
  return limpo ? limpo : 'Entusiasta';
};

export const displayTag = (tag: string | null | undefined): string | null => {
  const limpa = tag?.trim();
  return limpa ? limpa : null;
};
