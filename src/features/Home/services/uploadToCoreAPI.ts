import * as Localization from 'expo-localization';
import { UploadResponse } from "../types/UploadResponse";
import { uploadErrorFromResponse } from "../utils/uploadErrors";
import { prepararFotosParaEnvio } from "./prepareImagesForUpload";

// Reexporta para a tela de análise continuar importando daqui.
export {
  isNoCreditsError,
  isVehicleMismatchError,
  NoCreditsError,
  VehicleMismatchError,
} from "../utils/uploadErrors";

// Logs só em desenvolvimento: em produção eles iriam para o logcat do aparelho com o texto
// do usuário e a resposta inteira da IA.
const logDev = (...args: unknown[]) => {
  if (__DEV__) console.log(...args);
};

type UploadOptions = {
  // Pula a checagem "fotos x carro digitado" depois que o usuário confirmou.
  confirmVehicle?: boolean;
};

export async function uploadMultipleToCoreAPI(
  imageUris: string[],
  objetivo: string,
  userToken: string,
  veiculo?: string,
  options: UploadOptions = {}
): Promise<UploadResponse> {
  try {
    logDev('API URL:', process.env.EXPO_PUBLIC_API_URL);
    logDev('Enviando imagens:', imageUris.length, 'Objetivo:', objetivo, 'Veículo:', veiculo || '(não informado)');

    const formData = new FormData();

    // 1. Anexamos o texto
    formData.append('objetivo', objetivo);

    // Marca/modelo/ano informados pelo usuário (opcional) — o backend trata como verdade.
    if (veiculo) {
      formData.append('veiculo', veiculo);
    }

    if (options.confirmVehicle) {
      formData.append('confirmarVeiculo', 'true');
    }

    // País do usuário (ISO-3166 alpha-2, ex: "BR") — pego do locale do aparelho, sem
    // precisar pedir nada pro usuário. Usado no backend pra IA avaliar a legalidade
    // local das peças sugeridas (ponto 3).
    const regiao = Localization.getLocales()[0]?.regionCode;
    if (regiao) {
      formData.append('pais', regiao);
    }

    // 2. Reduz as fotos grandes para 1600 px antes de enviar (envio mais rápido e com menos
    // dados móveis; a API reduz para 1200 px de qualquer jeito).
    const fotos = await prepararFotosParaEnvio(imageUris);

    // 3. O Padrão Moderno (Blob): Lemos a URI local e convertemos em arquivo real!
    for (let i = 0; i < fotos.length; i++) {
      const uri = fotos[i];

      // Lemos o arquivo da memória do celular
      const fileResponse = await fetch(uri);
      // Transformamos em um binário puro
      const blob = await fileResponse.blob();

      // Anexamos o binário puro ao FormData (como os navegadores fazem)
      formData.append('imagens', blob, `photo_${i}.jpg`);
    }

    const url = `${process.env.EXPO_PUBLIC_API_URL}/car/upload`;
    logDev('POST (Batch) →', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    });

    const text = await response.text();
    logDev('Resposta bruta da IA:', text);

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(text || `Resposta inválida (status ${response.status})`);
    }

    if (!response.ok) {
      // 409 (carro diferente), 429 (limite de tentativas), 402 (sem crédito) e o resto.
      throw uploadErrorFromResponse(response.status, data);
    }

    if (!data.ai_setup) {
      throw new Error('Servidor não retornou o setup da IA');
    }

    return data as UploadResponse;

  } catch (err: any) {
    logDev('uploadMultipleToCoreAPI error:', err);
    throw err;
  }
}
