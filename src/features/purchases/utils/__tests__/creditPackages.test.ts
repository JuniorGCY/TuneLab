import { describe, expect, it } from '@jest/globals';
import { montarPacotes, type PacoteDaLoja } from '../creditPackages';

const pacote = (identifier: string, produto: string, price: number, priceString: string): PacoteDaLoja => ({
  identifier,
  product: { identifier: produto, price, priceString, currencyCode: 'BRL' },
});

// Moeda formatada pelo Intl usa espaço não separável entre "R$" e o número.
const semEspacoEspecial = (texto: string | null) => texto?.replace(/\s/g, ' ');

describe('montarPacotes', () => {
  it('ordena do menor para o maior pacote e marca o de 5 como destaque', () => {
    const pacotes = montarPacotes([
      pacote('creditos_15', 'tunelab_creditos_15', 59.9, 'R$ 59,90'),
      pacote('creditos_1', 'tunelab_creditos_1', 6.9, 'R$ 6,90'),
      pacote('creditos_5', 'tunelab_creditos_5', 24.9, 'R$ 24,90'),
    ]);

    expect(pacotes.map((p) => p.creditos)).toEqual([1, 5, 15]);
    expect(pacotes.map((p) => p.destaque)).toEqual([false, true, false]);
    expect(pacotes.map((p) => p.titulo)).toEqual(['1 análise', '5 análises', '15 análises']);
  });

  it('usa o preço da loja e calcula o preço por análise', () => {
    const [um, cinco] = montarPacotes([
      pacote('creditos_1', 'tunelab_creditos_1', 6.9, 'R$ 6,90'),
      pacote('creditos_5', 'tunelab_creditos_5', 24.9, 'R$ 24,90'),
    ]);

    expect(um.preco).toBe('R$ 6,90');
    expect(um.precoPorAnalise).toBeNull();
    expect(cinco.preco).toBe('R$ 24,90');
    expect(semEspacoEspecial(cinco.precoPorAnalise)).toBe('R$ 4,98');
  });

  it('ignora produto que o app não conhece', () => {
    const pacotes = montarPacotes([
      pacote('creditos_1', 'tunelab_creditos_1', 6.9, 'R$ 6,90'),
      pacote('pro_mensal', 'tunelab_pro_mensal', 24.9, 'R$ 24,90'),
    ]);

    expect(pacotes.map((p) => p.produtoId)).toEqual(['tunelab_creditos_1']);
  });

  it('esconde o preço por análise quando a moeda é inválida', () => {
    const [cinco] = montarPacotes([
      { identifier: 'creditos_5', product: { identifier: 'tunelab_creditos_5', price: 24.9, priceString: '24,90', currencyCode: 'XX' } },
    ]);

    expect(cinco.precoPorAnalise).toBeNull();
    expect(cinco.preco).toBe('24,90');
  });
});
