// Tamanho das fotos enviadas para análise.
//
// A API reduz tudo para 1200 px de largura antes da IA. Mandar a foto original (3–15 MB) só
// gasta o plano de dados do usuário e deixa o envio lento. 1600 px no lado maior dá folga
// sobre os 1200 px da API sem perder nada da análise.
export const LADO_MAXIMO_ENVIO = 1600;

// Qualidade JPEG das fotos reduzidas (0–1): ~300–600 KB por foto a 1600 px.
export const QUALIDADE_ENVIO = 0.8;

export type Dimensoes = { width: number; height: number };

// Devolve o tamanho de envio mantendo a proporção, ou null quando a foto já é pequena o
// bastante (não vale a pena reprocessar).
export function dimensoesParaEnvio(
  largura: number,
  altura: number,
  ladoMaximo: number = LADO_MAXIMO_ENVIO,
): Dimensoes | null {
  if (!(largura > 0) || !(altura > 0)) return null;
  const maior = Math.max(largura, altura);
  if (maior <= ladoMaximo) return null;
  const escala = ladoMaximo / maior;
  return {
    width: Math.max(1, Math.round(largura * escala)),
    height: Math.max(1, Math.round(altura * escala)),
  };
}
