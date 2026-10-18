// Regras de exibição de um carro da garagem, separadas dos componentes para serem testadas.

export const DEFAULT_CAR_TITLE = 'Projeto Tuning IA';

// O título vai para o banco e aparece no card: corta textos enormes que a IA possa devolver.
export const MAX_CAR_TITLE_LENGTH = 80;

export type GarageImageMode = 'original' | 'tunada';

type CarImages = {
  imageUrl: string;
  imagemModificadaUrl?: string | null;
};

// Título salvo na garagem: o nome do setup que a análise já devolve
// (ex: "Stage 1 + Escape Cat-back + Visual Most Wanted"), ou o genérico quando faltar.
export const carTitleFromSetup = (setupTitle: string | undefined | null): string => {
  const cleaned = setupTitle?.replace(/\s+/g, ' ').trim();
  if (!cleaned) return DEFAULT_CAR_TITLE;
  if (cleaned.length <= MAX_CAR_TITLE_LENGTH) return cleaned;
  return `${cleaned.slice(0, MAX_CAR_TITLE_LENGTH - 1).trimEnd()}…`;
};

export const hasTunedImage = (car: CarImages): boolean => !!car.imagemModificadaUrl?.trim();

// Capa do card: a foto tunada chama mais atenção, então é a preferida quando existe.
export const defaultImageMode = (car: CarImages): GarageImageMode =>
  hasTunedImage(car) ? 'tunada' : 'original';

// URL a mostrar para o modo escolhido. Pedir "tunada" num carro sem ela cai na original,
// em vez de deixar a tela sem imagem.
export const imageForMode = (car: CarImages, mode: GarageImageMode): string =>
  mode === 'tunada' && hasTunedImage(car) ? (car.imagemModificadaUrl as string) : car.imageUrl;
