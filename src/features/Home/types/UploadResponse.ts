export interface PerformanceItem {
  id: string;
  title: string;
  category: string;
  gains: string;
  gainHp?: number;
  cost: string;
  costValue?: number;
  difficulty: number;
}

export interface VisualItem {
  id: string;
  title: string;
  category: string;
  effect: string;
  cost: string;
  costValue?: number;
  difficulty: number;
}

export interface SetupSummary {
  // Nome do setup gerado pela IA (ex: "Stage 1 + Suspensão Coilover"). Opcional porque
  // setups salvos antes desse campo não o têm. Use resolveSetupTitle para exibir.
  title?: string;
  totalPower: string;
  powerGain: string;
  estimatedCost: string;
  installationTime: string;
}

export interface TimelinePhase {
  id: number;
  title: string;
  description: string;
}

export interface AISetupData {
  setup_summary: SetupSummary;
  performance_items: PerformanceItem[];
  visual_items: VisualItem[];
  timeline: TimelinePhase[];
}

export interface UploadResponse {
  imageUrl: string;
  todasImagens: string[];
  ai_setup: AISetupData;
  // Foto do carro já com o setup visual aplicado pela IA (ponto 2). Pode vir vazia —
  // a geração de imagem não é bloqueante no backend (depende de crédito no Gemini).
  imagemModificadaUrl?: string;
}
