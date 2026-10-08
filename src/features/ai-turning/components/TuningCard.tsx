import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { FONTS } from "@/constants/fonts"; 
import { TuningCardProps } from '../types/TuningCardProps';

import { RFValue } from "react-native-responsive-fontsize";

export const TuningCard = ({ item }: TuningCardProps) => {

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardColumn}>
          <Text style={styles.label}>Ganhos</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoTextValue}>{item.gains}</Text>
          </View>
        </View>

        <View style={styles.cardColumn2}>
          <Text style={styles.label}>Custo</Text>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>$</Text>
            <Text style={styles.infoTextValue}>{item.cost}</Text>
          </View>
        </View>
      </View>

      <View style={styles.difficultyContainer}>

        <Text style={styles.label}>Dificuldade</Text>
      </View>
      
      <View style={styles.difficultyBars}>
        {[1, 2, 3].map((level) => (
          <View 
            key={level} 
            style={[
              styles.bar, 
              level <= item.difficulty ? styles.barActive : styles.barInactive
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#202020',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  // flex:1 deixa o título quebrar em várias linhas em vez de empurrar a categoria pra fora do card
  cardTitle: {
    flex: 1,
    marginRight: 12,
    color: '#FFF',
    fontSize: RFValue(12),
    fontFamily: FONTS.Montserrat.bold
  },
  cardCategory: {
    flexShrink: 0,
    alignSelf: 'flex-start',
    color: '#FF6B00',
    fontSize: RFValue(10),
    fontWeight: '900',
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  // Ganhos pode ter texto longo (inclui aviso de legalidade): ocupa o espaço que sobra e quebra linha.
  // Custo é curto e nunca deve ser espremido.
  cardColumn: {
    flex: 1,
    marginRight: 12,
    alignItems: 'flex-start'
  },
  cardColumn2: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  label: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#FF6B00',
    fontSize: RFValue(12),
    marginRight: 6,
    marginTop: 2,
  },
  infoTextValue: {
    color: '#FFF',
    fontSize: RFValue(12),
    fontFamily: FONTS.Montserrat.bold,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  difficultyBars: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  bar: {
    height: 4,
    width: 24,
    borderRadius: 2,
    marginRight: 4,
  },
  barActive: {
    backgroundColor: '#FF6B00',
  },
  barInactive: {
    backgroundColor: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  saveButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});