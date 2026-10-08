import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { FONTS } from '@/constants/fonts';

import { RFValue } from 'react-native-responsive-fontsize'
import { GitMerge} from 'lucide-react-native';

export const TimelineCard = ({ phases }) => {
  return (
    <View style={styles.card}>
        <View style={styles.headerIconTitle}>
        <GitMerge size={RFValue(20)} color="#FFF" />
        <Text style={styles.sectionTitle}>Cronograma de Montagem Recomendado</Text>
        </View>

        <View style={styles.timelineContainer}>
        {phases.map((phase, index) => (
            <View key={phase.id} style={styles.timelineRow}>
            <View style={styles.timelineLeft}>
                <View style={styles.nodeCircle}>
                <Text style={styles.nodeNumber}>{phase.id}</Text>
                </View>
                
                {index !== phases.length - 1 && (
                <View style={styles.nodeLine} />
                )}
            </View>

            <View style={styles.timelineContent}>
                <Text style={styles.phaseTitle}>{phase.title}</Text>
                <Text style={styles.phaseDesc}>{phase.description}</Text>
            </View>
            </View>
        ))}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerIconTitle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '75%',
    gap: 12,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: RFValue(16),
    fontFamily: FONTS.Montserrat.bold,
    lineHeight: 22,
  },
  counterBadge: {
    alignItems: 'center',
  },
  counterNumber: {
    color: '#FFF',
    fontSize: RFValue(16),
    fontFamily: FONTS.Montserrat.bold,
  },
  counterLabel: {
    color: '#FF6B00',
    fontSize: RFValue(8),
    fontFamily: FONTS.Montserrat.bold,
  },
  categorySection: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  categoryTitle: {
    color: '#FFF',
    fontSize: RFValue(12),
    fontFamily: FONTS.Montserrat.bold,
    letterSpacing: 1,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 16,
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#888',
    marginTop: 6,
    marginRight: 10,
  },
  bulletText: {
    color: '#CCC',
    fontSize: RFValue(11),
    lineHeight: 16,
  },
  timelineContainer: {
    marginTop: 20,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 24,
    marginRight: 16,
  },
  nodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
    nodeNumber: {
    color: '#FF6B00',
    fontSize: RFValue(10),
    fontFamily: FONTS.Montserrat.bold,
  },
    nodeLine: {
    width: 2,
    flexGrow: 1,           
    minHeight: 40,    
    backgroundColor: '#333',
    marginTop: 4,
  },
    timelineContent: {
    flex: 1,
    paddingBottom: 20,
  },
  phaseTitle: {
    color: '#FFF',
    fontSize: RFValue(12),
    fontFamily: FONTS.Montserrat.bold,
    marginBottom: 4,
  },
  phaseDesc: {
    color: '#999',
    fontSize: RFValue(11),
    lineHeight: 16,
  },
});