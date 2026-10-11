import { describe, expect, it } from '@jest/globals';
import { classificarErroDeCompra, mensagemDoErroDeCompra } from '../purchaseErrors';

describe('classificarErroDeCompra', () => {
  it.each([
    [{ code: '1', userCancelled: true }, 'cancelado'],
    [{ code: '1' }, 'cancelado'],
    [{ userCancelled: true }, 'cancelado'],
    [{ code: '20' }, 'pendente'],
    [{ code: '10' }, 'sem-rede'],
    [{ code: '3' }, 'nao-permitido'],
    [{ code: '5' }, 'indisponivel'],
    [{ code: '23' }, 'indisponivel'],
    [{ code: 10 }, 'sem-rede'],
    [{ code: '999' }, 'desconhecido'],
    [new Error('qualquer coisa'), 'desconhecido'],
    [null, 'desconhecido'],
    ['texto', 'desconhecido'],
  ])('%p vira %s', (erro, esperado) => {
    expect(classificarErroDeCompra(erro)).toBe(esperado);
  });
});

describe('mensagemDoErroDeCompra', () => {
  it('avisa que nada foi cobrado quando falta internet', () => {
    expect(mensagemDoErroDeCompra('sem-rede')).toMatch(/Nada foi cobrado/);
  });

  it('não promete que não houve cobrança quando o erro é desconhecido', () => {
    // Num erro desconhecido a cobrança pode ter acontecido; o crédito entra pelo webhook.
    expect(mensagemDoErroDeCompra('desconhecido')).not.toMatch(/Nada foi cobrado/);
  });
});
