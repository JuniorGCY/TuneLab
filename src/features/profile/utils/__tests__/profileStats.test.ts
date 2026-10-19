import { describe, expect, it } from '@jest/globals';

import { displayName, displayTag, formatStat, statAccessibilityLabel } from '../profileStats';

describe('formatStat', () => {
  it('mostra o número quando existe', () => {
    expect(formatStat(0)).toBe('0');
    expect(formatStat(12)).toBe('12');
  });

  it('mostra traço enquanto carrega ou quando falha', () => {
    expect(formatStat(null)).toBe('—');
    expect(formatStat(undefined)).toBe('—');
    expect(formatStat(NaN)).toBe('—');
    expect(formatStat(-1)).toBe('—');
  });
});

describe('statAccessibilityLabel', () => {
  it('lê o valor ou avisa que está carregando', () => {
    expect(statAccessibilityLabel('Setups salvos', 3)).toBe('Setups salvos: 3');
    expect(statAccessibilityLabel('Setups salvos', null)).toBe('Setups salvos: carregando');
  });
});

describe('nome e tag', () => {
  it('usa o nome do banco ou um genérico', () => {
    expect(displayName('  Sam  ')).toBe('Sam');
    expect(displayName('')).toBe('Entusiasta');
    expect(displayName(undefined)).toBe('Entusiasta');
  });

  it('esconde a tag vazia', () => {
    expect(displayTag('Iniciante')).toBe('Iniciante');
    expect(displayTag('   ')).toBeNull();
    expect(displayTag(null)).toBeNull();
  });
});
