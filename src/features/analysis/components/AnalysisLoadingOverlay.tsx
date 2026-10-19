import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Easing } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { FONTS } from '@/constants/fonts';
import { colors } from '@/constants/colors';

// Tela cheia exibida enquanto a IA pesquisa (com acesso à web) peças compatíveis,
// legalidade local e preços — isso deixa a análise mais lenta que antes (ponto 3),
// então o usuário precisa de um feedback claro de que o app não travou.
export default function AnalysisLoadingOverlay() {
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.overlay}>
      <Animated.Image
        source={require('../../../../assets/images/logo-glow.png')}
        style={[styles.logo, { opacity: pulseAnim }]}
        resizeMode="contain"
      />
      <Text style={styles.title}>Analisando seu veículo…</Text>
      <Text style={styles.subtitle}>
        Nossa IA está pesquisando peças compatíveis, legalidade local e preços de mercado.
        Isso pode levar até 1 minuto.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 15, 15, 0.97)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(32),
    zIndex: 20,
  },
  logo: {
    width: RFValue(120),
    height: RFValue(120),
    marginBottom: RFValue(24),
  },
  title: {
    color: '#FFF',
    fontSize: RFValue(16),
    fontFamily: FONTS.Montserrat.bold,
    marginBottom: RFValue(10),
    textAlign: 'center',
  },
  subtitle: {
    color: '#AAA',
    fontSize: RFValue(11),
    fontFamily: FONTS.Montserrat.regular,
    textAlign: 'center',
    lineHeight: RFValue(18),
  },
  accentDot: {
    color: colors.primary,
  },
});
