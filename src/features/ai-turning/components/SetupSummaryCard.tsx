import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { FONTS } from '@/constants/fonts';

import { RFValue } from 'react-native-responsive-fontsize';

export const SetupSummaryCard = ({ data }) => {
  return (
    <View style={styles.card}>
      <View style={styles.aiBadge}>
        <Text style={styles.aiBadgeText}>Recomendação da Mia</Text>
      </View>
      <Text style={styles.cardTitle}>Setup Integrado: Stage 2 + Street Aero</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Potência Total</Text>
          <Text style={styles.statValueHighlight}>{data.totalPower}</Text>
          <Text style={styles.statSub}>{data.powerGain}</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Custo Estimado</Text>
          <Text style={styles.statValue}>{data.estimatedCost}</Text>
          <Text style={styles.statSub}>peças + mão de obra</Text>
        </View>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Instalação</Text>
          <Text style={styles.statValue}>{data.installationTime}</Text>
          <Text style={styles.statSub}>tempo estimado</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  aiBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  aiBadgeText: {
    color: '#FF6B00',
    fontSize: RFValue(10),
    fontFamily: FONTS.Montserrat.bold,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: RFValue(18),
    fontFamily: FONTS.Montserrat.bold,
    marginBottom: 20,
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statColumn: {
    flex: 1,
  },
  statLabel: {
    color: '#888',
    fontSize: RFValue(11),
    marginBottom: 4,
  },
  statValue: {
    color: '#FFF',
    fontSize: RFValue(14),
    fontFamily: FONTS.Montserrat.bold,
  },
  statValueHighlight: {
    color: '#FF6B00',
    fontSize: RFValue(16),
    fontFamily: FONTS.Montserrat.bold,
  },
  statSub: {
    color: '#666',
    fontSize: RFValue(9),
    marginTop: 2,
  },
})