import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

// O módulo real é nativo; o teste usa um manipulador falso injetado.
jest.mock('expo-image-manipulator', () => ({ ImageManipulator: {}, SaveFormat: { JPEG: 'jpeg' } }));

import { prepararFotosParaEnvio, type ManipuladorDeImagem } from '../prepareImagesForUpload';
import type { Dimensoes } from '../../utils/imageResize';

function manipuladorFalso(tamanhos: Record<string, Dimensoes>, falhaEm: string[] = []) {
  const reduzidas: { uri: string; alvo: Dimensoes; qualidade: number }[] = [];
  const manipulador: ManipuladorDeImagem = {
    dimensoes: async (uri) => {
      if (falhaEm.includes(uri)) throw new Error('arquivo ilegível');
      const tamanho = tamanhos[uri];
      if (!tamanho) throw new Error(`sem tamanho para ${uri}`);
      return tamanho;
    },
    reduzir: async (uri, alvo, qualidade) => {
      reduzidas.push({ uri, alvo, qualidade });
      return `${uri}-reduzida.jpg`;
    },
  };
  return { manipulador, reduzidas };
}

describe('prepararFotosParaEnvio', () => {
  // Os casos de falha registram "enviando a original" em __DEV__; aqui isso é esperado.
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('reduz as fotos grandes e mantém as pequenas, na mesma ordem', async () => {
    const { manipulador, reduzidas } = manipuladorFalso({
      'file://grande.jpg': { width: 4000, height: 3000 },
      'file://pequena.jpg': { width: 1200, height: 900 },
    });

    const resultado = await prepararFotosParaEnvio(['file://grande.jpg', 'file://pequena.jpg'], manipulador);

    expect(resultado).toEqual(['file://grande.jpg-reduzida.jpg', 'file://pequena.jpg']);
    expect(reduzidas).toEqual([
      { uri: 'file://grande.jpg', alvo: { width: 1600, height: 1200 }, qualidade: 0.8 },
    ]);
  });

  it('envia a original quando não consegue ler a foto', async () => {
    const { manipulador } = manipuladorFalso({ 'file://ok.jpg': { width: 4000, height: 3000 } }, ['file://ruim.jpg']);

    const resultado = await prepararFotosParaEnvio(['file://ruim.jpg', 'file://ok.jpg'], manipulador);

    expect(resultado).toEqual(['file://ruim.jpg', 'file://ok.jpg-reduzida.jpg']);
  });

  it('envia a original quando a redução falha', async () => {
    const manipulador: ManipuladorDeImagem = {
      dimensoes: async () => ({ width: 4000, height: 3000 }),
      reduzir: async () => {
        throw new Error('sem memória');
      },
    };

    expect(await prepararFotosParaEnvio(['file://a.jpg'], manipulador)).toEqual(['file://a.jpg']);
  });

  it('lista vazia devolve lista vazia', async () => {
    const { manipulador } = manipuladorFalso({});
    expect(await prepararFotosParaEnvio([], manipulador)).toEqual([]);
  });
});
