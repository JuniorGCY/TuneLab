import { describe, expect, it } from '@jest/globals';

import {
  carTitleFromSetup,
  DEFAULT_CAR_TITLE,
  defaultImageMode,
  hasTunedImage,
  imageForMode,
  MAX_CAR_TITLE_LENGTH,
} from '../garageCar';

const ORIGINAL = 'https://storage/original.webp';
const TUNADA = 'https://storage/tunada.webp';

describe('carTitleFromSetup', () => {
  it('usa o título do setup', () => {
    expect(carTitleFromSetup('Stage 1 + Escape Cat-back')).toBe('Stage 1 + Escape Cat-back');
  });

  it('cai no genérico quando falta título', () => {
    expect(carTitleFromSetup(undefined)).toBe(DEFAULT_CAR_TITLE);
    expect(carTitleFromSetup(null)).toBe(DEFAULT_CAR_TITLE);
    expect(carTitleFromSetup('   ')).toBe(DEFAULT_CAR_TITLE);
  });

  it('junta espaços e quebras de linha', () => {
    expect(carTitleFromSetup('  Stage 1\n +   Coilover ')).toBe('Stage 1 + Coilover');
  });

  it('corta títulos longos com reticências', () => {
    const titulo = carTitleFromSetup('a'.repeat(200));
    expect(titulo.length).toBe(MAX_CAR_TITLE_LENGTH);
    expect(titulo.endsWith('…')).toBe(true);
  });
});

describe('imagens da garagem', () => {
  it('prefere a foto tunada quando existe', () => {
    const car = { imageUrl: ORIGINAL, imagemModificadaUrl: TUNADA };
    expect(hasTunedImage(car)).toBe(true);
    expect(defaultImageMode(car)).toBe('tunada');
    expect(imageForMode(car, 'tunada')).toBe(TUNADA);
    expect(imageForMode(car, 'original')).toBe(ORIGINAL);
  });

  it('sem foto tunada, sempre a original', () => {
    for (const imagemModificadaUrl of [undefined, null, '', '  ']) {
      const car = { imageUrl: ORIGINAL, imagemModificadaUrl };
      expect(hasTunedImage(car)).toBe(false);
      expect(defaultImageMode(car)).toBe('original');
      expect(imageForMode(car, 'tunada')).toBe(ORIGINAL);
    }
  });
});
