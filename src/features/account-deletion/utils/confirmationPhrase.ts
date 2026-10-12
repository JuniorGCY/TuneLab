// A exclusão só libera depois que a pessoa digita a palavra. Evita apagar a conta por um toque
// acidental, e o texto deixa claro que não tem volta.
export const CONFIRMATION_WORD = 'EXCLUIR';

export function isConfirmationValid(typed: string): boolean {
  return typed.trim().toLocaleUpperCase('pt-BR') === CONFIRMATION_WORD;
}
