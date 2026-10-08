import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type CreditsBadgeProps = {
  // null = saldo ainda não carregado ou indisponível.
  creditos: number | null;
};

const rotuloDosCreditos = (creditos: number | null): string => {
  if (creditos === null) return '— créditos';
  if (creditos === 0) return 'Sem créditos';
  return creditos === 1 ? '1 crédito' : `${creditos} créditos`;
};

export const CreditsBadge = ({ creditos }: CreditsBadgeProps) => {
  const semCreditos = creditos === 0;
  const rotulo = rotuloDosCreditos(creditos);

  return (
    <View
      style={[styles.badge, semCreditos && styles.badgeEmpty]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={
        creditos === null ? 'Créditos de análise indisponíveis' : `Você tem ${rotulo} de análise`
      }
    >
      <Zap size={RFValue(12)} color={semCreditos ? '#AAAAAA' : colors.primary} />
      <Text style={[styles.text, semCreditos && styles.textEmpty]}>{rotulo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.35)',
  },
  badgeEmpty: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333333',
  },
  text: {
    color: colors.primary,
    fontSize: RFValue(11),
    fontFamily: FONTS.Montserrat.bold,
  },
  textEmpty: {
    color: '#AAAAAA',
  },
});
