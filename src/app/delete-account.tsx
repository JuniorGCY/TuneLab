import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, Trash2, X } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { useAuth } from '@/contexts/AuthContext';
import { getCreditsAPI } from '@/features/Home/services/getCreditsAPI';
import { useDeleteAccount } from '@/features/account-deletion/hooks/useDeleteAccount';
import { CONFIRMATION_WORD, isConfirmationValid } from '@/features/account-deletion/utils/confirmationPhrase';

// Vermelho com contraste suficiente para texto branco (WCAG AA).
const DANGER = '#D32F2F';

const BUTTON_LABEL = {
    idle: 'Excluir minha conta',
    reauthenticating: 'Confirmando sua conta Google...',
    deleting: 'Excluindo sua conta...',
    deleted: 'Conta excluída',
} as const;

export default function DeleteAccountScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { getToken, logout } = useAuth();
    const { step, error, isBusy, deleteAccount } = useDeleteAccount();
    const [typed, setTyped] = useState('');
    const unusedCredits = useUnusedCredits(getToken);

    const canDelete = isConfirmationValid(typed) && !isBusy;
    const fechar = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

    if (step === 'deleted') {
        return (
            <View style={[styles.container, styles.centered, { paddingTop: insets.top + 24 }]}>
                <CheckCircle2 size={RFValue(48)} color={colors.success} />
                <Text style={styles.title} accessibilityRole="header">Conta excluída</Text>
                <Text style={styles.description}>Seus dados foram apagados. Obrigado por usar o TuneLab.</Text>
                <ActivityIndicator color={colors.primary} accessibilityLabel="Saindo da conta" />
                <Pressable onPress={logout} style={styles.secondaryButton} accessibilityRole="button" hitSlop={8}>
                    <Text style={styles.secondaryButtonText}>Ir para o login</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
                keyboardShouldPersistTaps="handled"
            >
                <Pressable
                    onPress={fechar}
                    disabled={isBusy}
                    style={styles.closeButton}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar"
                    accessibilityState={{ disabled: isBusy }}
                >
                    <X size={RFValue(20)} color="#FFF" />
                </Pressable>

                <View style={styles.header}>
                    <Trash2 size={RFValue(32)} color={DANGER} />
                    <Text style={styles.title} accessibilityRole="header">Excluir conta</Text>
                    <Text style={styles.description}>
                        Sua conta do TuneLab será apagada de forma permanente. Não dá para desfazer.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>O que será apagado</Text>
                    <Text style={styles.cardItem}>• Seus carros e análises salvas</Text>
                    <Text style={styles.cardItem}>• As fotos que você enviou</Text>
                    <Text style={styles.cardItem}>• Seus créditos de análise que não foram usados</Text>
                    {unusedCredits !== null && unusedCredits > 0 ? (
                        <Text style={styles.warning}>
                            {unusedCredits === 1
                                ? 'Você tem 1 análise não usada. Ela será perdida.'
                                : `Você tem ${unusedCredits} análises não usadas. Elas serão perdidas.`}
                        </Text>
                    ) : null}
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>O que fica guardado</Text>
                    <Text style={styles.cardItem}>
                        • O registro das suas compras, por exigência fiscal
                    </Text>
                    <Text style={styles.cardItem}>
                        • Um código cifrado do seu celular, para a análise grátis não ser usada de novo
                    </Text>
                </View>

                <Text style={styles.label} nativeID="labelConfirmacao">
                    Digite {CONFIRMATION_WORD} para confirmar
                </Text>
                <TextInput
                    style={styles.input}
                    value={typed}
                    onChangeText={setTyped}
                    placeholder={CONFIRMATION_WORD}
                    placeholderTextColor="#666"
                    autoCapitalize="characters"
                    autoCorrect={false}
                    editable={!isBusy}
                    accessibilityLabelledBy="labelConfirmacao"
                    accessibilityLabel={`Digite ${CONFIRMATION_WORD} para confirmar`}
                    returnKeyType="done"
                />
                <Text style={styles.hint}>Vamos pedir para você entrar com o Google mais uma vez.</Text>

                <Pressable
                    onPress={deleteAccount}
                    disabled={!canDelete}
                    style={({ pressed }) => [styles.dangerButton, !canDelete && styles.buttonDisabled, pressed && styles.pressed]}
                    accessibilityRole="button"
                    accessibilityLabel={BUTTON_LABEL[step]}
                    accessibilityState={{ disabled: !canDelete, busy: isBusy }}
                >
                    {isBusy ? (
                        <View style={styles.busyRow}>
                            <ActivityIndicator color="#FFF" />
                            <Text style={styles.buttonText}>{BUTTON_LABEL[step]}</Text>
                        </View>
                    ) : (
                        <Text style={styles.buttonText}>{BUTTON_LABEL.idle}</Text>
                    )}
                </Pressable>

                <Pressable
                    onPress={fechar}
                    disabled={isBusy}
                    style={styles.secondaryButton}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isBusy }}
                    hitSlop={8}
                >
                    <Text style={[styles.secondaryButtonText, isBusy && styles.textDisabled]}>Cancelar</Text>
                </Pressable>

                {error ? (
                    <Text style={styles.errorText} accessibilityRole="alert" accessibilityLiveRegion="polite">
                        {error}
                    </Text>
                ) : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Saldo para avisar o que será perdido. Se falhar, a tela segue com o aviso genérico.
function useUnusedCredits(getToken: (forceRefresh?: boolean) => Promise<string | null>) {
    const [credits, setCredits] = useState<number | null>(null);
    useEffect(() => {
        let ativo = true;
        (async () => {
            try {
                const token = await getToken();
                if (!token) return;
                const { creditos } = await getCreditsAPI(token);
                if (ativo) setCredits(creditos);
            } catch (e) {
                console.warn('Não foi possível ler o saldo antes da exclusão:', e);
            }
        })();
        return () => {
            ativo = false;
        };
    }, [getToken]);
    return credits;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
    },
    centered: {
        alignItems: 'center',
        gap: 12,
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
    header: {
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
        marginBottom: 24,
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
    card: {
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        gap: 6,
    },
    cardTitle: {
        fontSize: RFValue(13),
        color: '#FFF',
        fontFamily: FONTS.Montserrat.bold,
        marginBottom: 4,
    },
    cardItem: {
        fontSize: RFValue(12),
        color: '#CCCCCC',
        fontFamily: FONTS.Montserrat.regular,
        lineHeight: RFValue(18),
    },
    warning: {
        marginTop: 6,
        fontSize: RFValue(12),
        color: '#FF8A80',
        fontFamily: FONTS.Montserrat.bold,
        lineHeight: RFValue(18),
    },
    label: {
        fontSize: RFValue(12),
        color: '#FFF',
        fontFamily: FONTS.Montserrat.bold,
        marginTop: 12,
        marginBottom: 8,
    },
    input: {
        height: 52,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#333333',
        backgroundColor: '#1E1E1E',
        color: '#FFF',
        fontSize: RFValue(15),
        fontFamily: FONTS.Montserrat.medium,
        letterSpacing: 2,
    },
    hint: {
        marginTop: 8,
        fontSize: RFValue(11),
        color: '#AAAAAA',
        fontFamily: FONTS.Montserrat.regular,
    },
    dangerButton: {
        height: 52,
        marginTop: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DANGER,
        alignSelf: 'stretch',
    },
    buttonDisabled: {
        opacity: 0.45,
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    busyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: RFValue(13),
        fontFamily: FONTS.Montserrat.bold,
    },
    secondaryButton: {
        minHeight: 44,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
    },
    secondaryButtonText: {
        color: '#FFF',
        fontSize: RFValue(13),
        fontFamily: FONTS.Montserrat.medium,
    },
    textDisabled: {
        color: '#666',
    },
    errorText: {
        marginTop: 16,
        color: '#ff4d4d',
        fontSize: RFValue(12),
        textAlign: 'center',
        fontFamily: FONTS.Montserrat.regular,
    },
});
