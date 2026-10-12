import { describe, expect, it } from '@jest/globals';
import { parseDeleteAccountResponse, RECENT_LOGIN_CODE } from '../deleteAccountResponse';

describe('parseDeleteAccountResponse', () => {
  it('204 é conta excluída', () => {
    expect(parseDeleteAccountResponse(204, '')).toEqual({ kind: 'deleted' });
  });

  it('403 com o código de login recente pede para entrar de novo', () => {
    const corpo = JSON.stringify({ error: 'Entre de novo', codigo: RECENT_LOGIN_CODE });
    expect(parseDeleteAccountResponse(403, corpo)).toEqual({ kind: 'recent-login-required' });
  });

  it('403 sem o código é falha comum', () => {
    expect(parseDeleteAccountResponse(403, 'Proibido')).toEqual({
      kind: 'failed',
      message: 'Não foi possível excluir a conta agora. Tente de novo em instantes.',
    });
  });

  it('usa a mensagem da API quando vem em JSON', () => {
    const corpo = JSON.stringify({ error: 'Banco fora do ar' });
    expect(parseDeleteAccountResponse(500, corpo)).toEqual({ kind: 'failed', message: 'Banco fora do ar' });
  });

  it('401 fala de sessão expirada', () => {
    const resultado = parseDeleteAccountResponse(401, 'Acesso Negado');
    expect(resultado.kind).toBe('failed');
    expect(resultado).toHaveProperty('message', 'Sua sessão expirou. Entre de novo e tente outra vez.');
  });

  it('ignora campos que não são texto', () => {
    const corpo = JSON.stringify({ error: 42, codigo: null });
    expect(parseDeleteAccountResponse(500, corpo)).toEqual({
      kind: 'failed',
      message: 'Não foi possível excluir a conta agora. Tente de novo em instantes.',
    });
  });
});
