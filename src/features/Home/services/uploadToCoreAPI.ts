import * as Localization from 'expo-localization';
import { UploadResponse } from "../types/UploadResponse";

export async function uploadMultipleToCoreAPI(
  imageUris: string[],
  objetivo: string,
  userToken: string,
  veiculo?: string
): Promise<UploadResponse> {
  try {
    console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
    console.log('Enviando imagens:', imageUris.length, 'Objetivo:', objetivo, 'Veículo:', veiculo || '(não informado)');

    const formData = new FormData();

    // 1. Anexamos o texto
    formData.append('objetivo', objetivo);

    // Marca/modelo/ano informados pelo usuário (opcional) — o backend trata como verdade.
    if (veiculo) {
      formData.append('veiculo', veiculo);
    }

    // País do usuário (ISO-3166 alpha-2, ex: "BR") — pego do locale do aparelho, sem
    // precisar pedir nada pro usuário. Usado no backend pra IA avaliar a legalidade
    // local das peças sugeridas (ponto 3).
    const regiao = Localization.getLocales()[0]?.regionCode;
    if (regiao) {
      formData.append('pais', regiao);
    }

    // 2. O Padrão Moderno (Blob): Lemos a URI local e convertemos em arquivo real!
    for (let i = 0; i < imageUris.length; i++) {
      const uri = imageUris[i];

      // Lemos o arquivo da memória do celular
      const fileResponse = await fetch(uri);
      // Transformamos em um binário puro
      const blob = await fileResponse.blob();

      // Anexamos o binário puro ao FormData (como os navegadores fazem)
      formData.append('imagens', blob, `photo_${i}.jpg`);
    }

    const url = `${process.env.EXPO_PUBLIC_API_URL}/car/upload`;
    console.log('POST (Batch) →', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    });

    const text = await response.text();
    console.log('Resposta bruta da IA:', text);

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || `Resposta inválida (status ${response.status})`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `Erro HTTP ${response.status}`);
    }

    if (!data.ai_setup) {
      throw new Error('Servidor não retornou o setup da IA');
    }

    return data as UploadResponse;

  } catch (err: any) {
    console.log('uploadMultipleToCoreAPI error:', err);
    throw err;
  }
}
