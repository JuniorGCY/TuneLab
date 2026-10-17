import { describe, expect, it } from '@jest/globals';
import { dimensoesParaEnvio, LADO_MAXIMO_ENVIO } from '../imageResize';

describe('dimensoesParaEnvio', () => {
  it('reduz foto de 12 MP deitada para 1600 px de largura', () => {
    expect(dimensoesParaEnvio(4000, 3000)).toEqual({ width: 1600, height: 1200 });
  });

  it('reduz foto em pé pelo lado maior (a altura)', () => {
    expect(dimensoesParaEnvio(3000, 4000)).toEqual({ width: 1200, height: 1600 });
  });

  it('mantém a proporção de fotos 16:9', () => {
    expect(dimensoesParaEnvio(8000, 4500)).toEqual({ width: 1600, height: 900 });
  });

  it('não mexe em foto que já cabe no limite', () => {
    expect(dimensoesParaEnvio(1600, 1200)).toBeNull();
    expect(dimensoesParaEnvio(800, 600)).toBeNull();
  });

  it('ignora dimensões inválidas', () => {
    expect(dimensoesParaEnvio(0, 3000)).toBeNull();
    expect(dimensoesParaEnvio(Number.NaN, 3000)).toBeNull();
    expect(dimensoesParaEnvio(-1, 3000)).toBeNull();
  });

  it('aceita outro limite', () => {
    expect(dimensoesParaEnvio(4000, 3000, 800)).toEqual({ width: 800, height: 600 });
  });

  it('o limite padrão fica acima dos 1200 px que a API usa', () => {
    expect(LADO_MAXIMO_ENVIO).toBeGreaterThanOrEqual(1200);
  });
});
