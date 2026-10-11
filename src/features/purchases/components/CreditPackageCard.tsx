import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Zap } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import type { PacoteDeCreditos } from '@/features/purchases/utils/creditPackages';

type CreditPackageCardProps = {
  pacote: PacoteDeCreditos;
  onPress: () => void;
  disabled: boolean;
  isBuying: boolean;
};

export const CreditPackageCard = ({ pacote, onPress, disabled, isBuying }: CreditPackageCardProps) => {
  const descricaoAcessivel = [
    `${pacote.titulo} por ${pacote.preco}`,
    pacote.precoPorAnalise && `${pacote.precoPorAnalise} cada`,
    pacote.destaque && 'mais escolhido',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        pacote.destaque && styles.cardDestaque,
        disabled && !isBuying && styles.cardDisabled,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={descricaoAcessivel}
      accessibilityState={{ disabled, busy: isBuying }}
    >
      {pacote.destaque && (
        <View style={styles.selo}>
          <Text style={styles.seloTexto}>Mais escolhido</Text>
        </View>
      )}

      <View style={styles.icone}>
        <Zap size={RFValue(18)} color={colors.primary} />
      </View>

      <View style={styles.textos}>
        <Text style={styles.titulo}>{pacote.titulo}</Text>
        {pacote.precoPorAnalise && <Text style={styles.porAnalise}>{pacote.precoPorAnalise} por análise</Text>}
      </View>

      {isBuying ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text style={styles.preco}>{pacote.preco}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333333',
  },
  cardDestaque: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 107, 0, 0.08)',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  selo: {
    position: 'absolute',
    top: -10,
    right: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  seloTexto: {
    color: '#FFF',
    fontSize: RFValue(9),
    fontFamily: FONTS.Montserrat.bold,
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    color: '#FFF',
    fontSize: RFValue(14),
    fontFamily: FONTS.Montserrat.bold,
  },
  porAnalise: {
    color: '#AAAAAA',
    fontSize: RFValue(11),
    fontFamily: FONTS.Montserrat.regular,
    fontVariant: ['tabular-nums'],
  },
  preco: {
    color: '#FFF',
    fontSize: RFValue(15),
    fontFamily: FONTS.Montserrat.extraBold,
    fontVariant: ['tabular-nums'],
  },
});
