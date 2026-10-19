export type Phase = {
    id: number; 
    title: string; 
    description: string
}

export type SetupData = {
    totalPower: string;
    powerGain: string;
    estimatedCost: string;
    installationTime: string;
    performanceItems: string[];
    visualItems: string[];
    timeline: Phase[];
}