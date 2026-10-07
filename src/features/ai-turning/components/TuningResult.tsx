import React from 'react';
import { View } from 'react-native';

// Componentes
import { SetupSummaryCard } from './SetupSummaryCard';
import { PackageItemsCard } from './PackageItemsCard';
import { TimelineCard } from './TimelineCard';

import { AISetupData } from '@/features/Home/types/UploadResponse';

interface Props {
  setupData: AISetupData;
}

export const TuningResult = ({ setupData }: Props) => {
  const summary = setupData?.setup_summary || {
    totalPower: 'N/D',
    powerGain: 'Indisponível',
    estimatedCost: 'N/D',
    installationTime: 'N/D'
  };

  const perfItems = setupData?.performance_items || [];
  const visItems = setupData?.visual_items || [];
  const timelinePhases = setupData?.timeline || [];

  const packageDataFormated = {
    performanceItems: perfItems.map((item) => `${item.title} (${item.gains})`),
    visualItems: visItems.map((item) => `${item.title} (${item.effect})`)
  };

  return (
    <View>
      <SetupSummaryCard data={setupData.setup_summary} />
      <PackageItemsCard data={packageDataFormated} />
      <TimelineCard phases={setupData.timeline} />
    </View>
  );
};