import React from 'react';
import { View} from 'react-native'
import { SetupData } from '../types/TuningResultProps';

// Componentes
import { SetupSummaryCard } from './SetupSummaryCard';
import { PackageItemsCard } from './PackageItemsCard';
import { TimelineCard } from './TimelineCard';

// Dados falsos
const mockSetupData: SetupData = {
  totalPower: '248 hp',
  powerGain: '+43hp ganho',
  estimatedCost: 'R$ 18.200',
  installationTime: '3 a 4 dias',
  performanceItems: [
    'Stage 1 ECU Remap (+35hp / +55Nm)',
    'Cold Air Intake c/ Defletor (+8hp)',
    'Downpipe High-Flow em Inox (+15hp)'
  ],
  visualItems: [
    'Body Kit Mugen Style (Lip dianteiro, saias e difusor)',
    'Rodas Enkei 18" esportivas',
    'Molas Eibach Pro-Kit (-30mm)',
    'Faróis Full LED Vland Sequence'
  ],
  timeline: [
    { id: 1, title: 'Admissão & Escape', description: 'Instalação do Cold Air Intake e Downpipe High-Flow (base mecânica).' },
    { id: 2, title: 'Remap & Acerto Dinamômetro', description: 'Calibração Stage 2 customizada com medição de potência e torque em tempo real.' },
    { id: 3, title: 'Rodas, Suspensão & Aerodinâmica', description: 'Montagem das molas Eibach, rodas Enkei, alinhamento técnico e kit estético.' },
  ]
}

export const TuningResult = () => {
  return (
    <View>
      <SetupSummaryCard data={mockSetupData} />
      <PackageItemsCard data={mockSetupData} />
      <TimelineCard phases={mockSetupData.timeline} />
    </View>
  );
};
