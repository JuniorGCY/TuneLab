import { describe, expect, it } from '@jest/globals';
import { isConfirmationValid } from '../confirmationPhrase';

describe('isConfirmationValid', () => {
  it('aceita a palavra em qualquer caixa e com espaços nas pontas', () => {
    expect(isConfirmationValid('EXCLUIR')).toBe(true);
    expect(isConfirmationValid(' excluir ')).toBe(true);
    expect(isConfirmationValid('Excluir')).toBe(true);
  });

  it('recusa vazio, parcial ou outra palavra', () => {
    expect(isConfirmationValid('')).toBe(false);
    expect(isConfirmationValid('EXCLUI')).toBe(false);
    expect(isConfirmationValid('EXCLUIR CONTA')).toBe(false);
    expect(isConfirmationValid('apagar')).toBe(false);
  });
});
