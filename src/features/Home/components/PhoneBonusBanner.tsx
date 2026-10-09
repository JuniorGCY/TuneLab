import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, Gift } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type PhoneBonusBannerProps = {
  onPress: () => void;
};

// Convite da Home para ganhar a análise grátis confirmando o celular.
export const PhoneBonusBanner = ({ onPress }: PhoneBonusBannerProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
    accessibilityRole="button"
    accessibilityLabel="Ganhe 1 análise grátis confirmando seu celular"
  >
    <Gift size={RFValue(20)} color={colors.primary} />
    <View style={styles.texts}>
      <Text style={styles.title}>Ganhe 1 análise grátis</Text>
      <Text style={styles.subtitle}>Confirme seu celular por SMS</Text>
    </View>
    <ChevronRight size={RFValue(18)} color="#AAAAAA" />
  </Pressable>
);

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.35)',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: '#FFF',
    fontSize: RFValue(13),
    fontFamily: FONTS.Montserrat.bold,
  },
  subtitle: {
    color: '#AAAAAA',
    fontSize: RFValue(11),
    fontFamily: FONTS.Montserrat.regular,
  },
});
