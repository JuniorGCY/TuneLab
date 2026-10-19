import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, Clock, Zap, X } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { CreditPackageCard } from '@/features/purchases/components/CreditPackageCard';
import { useCreditPurchase } from '@/features/purchases/hooks/useCreditPurchase';

export default function BuyCreditsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { etapa, carregar, comprar } = useCreditPurchase();

    const fechar = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));
    // Enquanto a folha da Google Play está aberta, fechar esta tela não cancela a compra:
    // melhor travar para o usuário não perder o acompanhamento.
    const podeFechar = etapa.nome !== 'comprando';

    const renderConteudo = () => {
        switch (etapa.nome) {
            case 'carregando':
                return (
                    <View style={styles.centered} accessibilityLiveRegion="polite">
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.description}>Carregando pacotes...</Text>
                    </View>
                );

            case 'erro-ao-carregar':
                return (
                    <View style={styles.centered}>
                        <Text style={styles.errorText} accessibilityRole="alert">{etapa.mensagem}</Text>
                        <BotaoPrincipal texto="Tentar novamente" onPress={carregar} />
                    </View>
                );

            case 'escolhendo':
            case 'comprando': {
                const comprandoId = etapa.nome === 'comprando' ? etapa.pacoteId : null;
                return (
                    <>
                        <View style={styles.lista}>
                            {etapa.pacotes.map((pacote) => (
                                <CreditPackageCard
                                    key={pacote.pacoteId}
                                    pacote={pacote}
                                    onPress={() => comprar(pacote.pacoteId)}
                                    disabled={comprandoId !== null}
                                    isBuying={comprandoId === pacote.pacoteId}
                                />
                            ))}
                        </View>
                        {etapa.nome === 'escolhendo' && etapa.erro && (
                            <Text style={styles.errorText} accessibilityRole="alert">{etapa.erro}</Text>
                        )}
                        <Text style={styles.footnote}>
                            Pagamento feito pela Google Play. Cada crédito vale 1 análise completa do seu carro.
                        </Text>
                    </>
                );
            }

            case 'confirmando':
                return (
                    <View style={styles.centered} accessibilityLiveRegion="polite">
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.successTitle}>Confirmando pagamento...</Text>
                        <Text style={styles.description}>Isso leva só alguns segundos.</Text>
                    </View>
                );

            case 'concluido':
                return (
                    <View style={styles.centered} accessibilityLiveRegion="polite">
                        <CheckCircle2 size={RFValue(48)} color={colors.success} />
                        <Text style={styles.successTitle}>Pronto!</Text>
                        <Text style={styles.description}>
                            Você agora tem {etapa.saldo === 1 ? '1 crédito' : `${etapa.saldo} créditos`} de análise.
                        </Text>
                        <BotaoPrincipal texto="Fazer uma análise" onPress={() => router.replace('/(tabs)/analysis')} />
                    </View>
                );

            case 'demorou':
                return (
                    <View style={styles.centered} accessibilityLiveRegion="polite">
                        <Clock size={RFValue(48)} color={colors.primary} />
                        <Text style={styles.successTitle}>Pagamento recebido</Text>
                        <Text style={styles.description}>
                            Seus créditos estão a caminho e podem levar alguns minutos para aparecer. Não precisa
                            comprar de novo.
                        </Text>
                        <BotaoPrincipal texto="Voltar" onPress={fechar} />
                    </View>
                );

            case 'pendente':
                return (
                    <View style={styles.centered} accessibilityLiveRegion="polite">
                        <Clock size={RFValue(48)} color={colors.primary} />
                        <Text style={styles.successTitle}>Pagamento em análise</Text>
                        <Text style={styles.description}>
                            A Google Play ainda está aprovando o pagamento. Assim que ele for aprovado, os créditos
                            entram na sua conta automaticamente.
                        </Text>
                        <BotaoPrincipal texto="Voltar" onPress={fechar} />
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
            >
                <Pressable
                    onPress={fechar}
                    disabled={!podeFechar}
                    hitSlop={8}
                    style={({ pressed }) => [styles.closeButton, !podeFechar && styles.closeDisabled, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar"
                    accessibilityState={{ disabled: !podeFechar }}
                >
                    <X size={RFValue(18)} color="#FFF" />
                </Pressable>

                <View style={styles.header}>
                    <Zap size={RFValue(36)} color={colors.primary} />
                    <Text style={styles.title} accessibilityRole="header">Comprar análises</Text>
                    <Text style={styles.description}>
                        Escolha um pacote. Quanto maior, mais barata sai cada análise.
                    </Text>
                </View>

                {renderConteudo()}
            </ScrollView>
        </View>
    );
}

const BotaoPrincipal = ({ texto, onPress }: { texto: string; onPress: () => void }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        accessibilityRole="button"
    >
        <Text style={styles.buttonText}>{texto}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    closeButton: {
        alignSelf: 'flex-end',
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1E1E',
    },
    closeDisabled: {
        opacity: 0.4,
    },
    header: {
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
        marginBottom: 32,
    },
    title: {
        fontSize: RFValue(20),
        color: '#FFF',
        fontFamily: FONTS.Montserrat.extraBold,
        textAlign: 'center',
    },
    description: {
        fontSize: RFValue(12),
        color: '#AAAAAA',
        fontFamily: FONTS.Montserrat.regular,
        textAlign: 'center',
        lineHeight: RFValue(18),
    },
    lista: {
        gap: 16,
    },
    footnote: {
        marginTop: 24,
        fontSize: RFValue(10),
        color: '#777',
        fontFamily: FONTS.Montserrat.regular,
        textAlign: 'center',
        lineHeight: RFValue(15),
    },
    button: {
        height: 52,
        marginTop: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        alignSelf: 'stretch',
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: '#FFF',
        fontSize: RFValue(13),
        fontFamily: FONTS.Montserrat.bold,
    },
    centered: {
        alignItems: 'center',
        gap: 12,
        marginTop: 24,
    },
    successTitle: {
        fontSize: RFValue(18),
        color: '#FFF',
        fontFamily: FONTS.Montserrat.extraBold,
        textAlign: 'center',
    },
    errorText: {
        marginTop: 16,
        color: '#ff4d4d',
        fontSize: RFValue(12),
        textAlign: 'center',
        fontFamily: FONTS.Montserrat.regular,
    },
});
