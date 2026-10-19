export interface CardCarUserProps {
    title: string;
    subtitle: string;
    hp: string;
    imageUrl: string;
    // A capa é a foto gerada por IA: mostra o selo para não parecer foto real do carro.
    isAiSimulation?: boolean;
    onPress: () => void;
}