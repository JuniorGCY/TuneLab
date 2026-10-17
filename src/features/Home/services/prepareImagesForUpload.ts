import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { dimensoesParaEnvio, QUALIDADE_ENVIO, type Dimensoes } from '../utils/imageResize';

// Único ponto do app que conversa com o expo-image-manipulator. A interface existe para o
// teste trocar a biblioteca por uma falsa.
export type ManipuladorDeImagem = {
  dimensoes: (uri: string) => Promise<Dimensoes>;
  reduzir: (uri: string, alvo: Dimensoes, qualidade: number) => Promise<string>;
};

const manipuladorExpo: ManipuladorDeImagem = {
  dimensoes: async (uri) => {
    const imagem = await ImageManipulator.manipulate(uri).renderAsync();
    return { width: imagem.width, height: imagem.height };
  },
  reduzir: async (uri, alvo, qualidade) => {
    const imagem = await ImageManipulator.manipulate(uri).resize(alvo).renderAsync();
    const salva = await imagem.saveAsync({ format: SaveFormat.JPEG, compress: qualidade });
    return salva.uri;
  },
};

// Reduz cada foto grande para o tamanho de envio, na mesma ordem. Foto pequena segue como
// está. Se a redução falhar, segue a original: a API aceita até 20 MB e reduz do lado dela,
// então o pior caso é só um envio mais lento, nunca uma análise perdida.
export async function prepararFotosParaEnvio(
  uris: string[],
  manipulador: ManipuladorDeImagem = manipuladorExpo,
): Promise<string[]> {
  const preparadas: string[] = [];
  for (const uri of uris) {
    preparadas.push(await prepararUma(uri, manipulador));
  }
  return preparadas;
}

async function prepararUma(uri: string, manipulador: ManipuladorDeImagem): Promise<string> {
  try {
    const { width, height } = await manipulador.dimensoes(uri);
    const alvo = dimensoesParaEnvio(width, height);
    if (!alvo) return uri;
    return await manipulador.reduzir(uri, alvo, QUALIDADE_ENVIO);
  } catch (erro) {
    if (__DEV__) console.log('Não deu para reduzir a foto, enviando a original:', erro);
    return uri;
  }
}
