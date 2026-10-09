import React, { useEffect, useRef, useState } from 'react';
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
import { CheckCircle2, Smartphone, X } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { usePhoneVerification } from '@/features/phone-verification/hooks/usePhoneVerification';
import { formatBrazilPhone, maskE164ForDisplay } from '@/features/phone-verification/utils/phoneNumber';

export default function VerifyPhoneScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { step, isBusy, error, resendInSeconds, sendCode, resendCode, confirmCode, changeNumber, claim } =
        usePhoneVerification();
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');

    // Conta que já tem celular vinculado: pede o bônus direto, sem novo SMS.
    const resgateAutomatico = useRef(false);
    useEffect(() => {
        if (step.name === 'claim' && !resgateAutomatico.current) {
            resgateAutomatico.current = true;
            claim();
        }
    }, [step.name, claim]);

    const fechar = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

    const renderConteudo = () => {
        switch (step.name) {
            case 'phone':
                return (
                    <>
                        <Text style={styles.label} nativeID="labelCelular">Seu celular</Text>
                        <TextInput
                            style={styles.input}
                            value={phone}
                            onChangeText={(texto) => setPhone(formatBrazilPhone(texto))}
                            placeholder="(11) 98765-4321"
                            placeholderTextColor="#666"
                            keyboardType="phone-pad"
                            textContentType="telephoneNumber"
                            autoComplete="tel"
                            maxLength={15}
                            editable={!isBusy}
                            accessibilityLabelledBy="labelCelular"
                            accessibilityLabel="Seu celular com DDD"
                            onSubmitEditing={() => sendCode(phone)}
                            returnKeyType="send"
                        />
                        <PrimaryButton label="Enviar código por SMS" onPress={() => sendCode(phone)} busy={isBusy} />
                    </>
                );

            case 'code':
                return (
                    <>
                        <Text style={styles.label} nativeID="labelCodigo">
                            Código enviado para {maskE164ForDisplay(step.phoneE164)}
                        </Text>
                        <TextInput
                            style={[styles.input, styles.codeInput]}
                            value={code}
                            onChangeText={(texto) => setCode(texto.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            placeholderTextColor="#666"
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            autoComplete="sms-otp"
                            maxLength={6}
                            editable={!isBusy}
                            accessibilityLabelledBy="labelCodigo"
                            accessibilityLabel="Código de 6 números recebido por SMS"
                            onSubmitEditing={() => confirmCode(code)}
                            returnKeyType="done"
                        />
                        <PrimaryButton label="Confirmar" onPress={() => confirmCode(code)} busy={isBusy} />

                        <View style={styles.linksRow}>
                            <Pressable
                                onPress={resendCode}
                                disabled={isBusy || resendInSeconds > 0}
                                hitSlop={8}
                                accessibilityRole="button"
                                accessibilityState={{ disabled: isBusy || resendInSeconds > 0 }}
                            >
                                <Text style={[styles.link, (isBusy || resendInSeconds > 0) && styles.linkDisabled]}>
                                    {resendInSeconds > 0 ? `Reenviar em ${resendInSeconds}s` : 'Reenviar código'}
                                </Text>
                            </Pressable>
                            <Pressable onPress={changeNumber} disabled={isBusy} hitSlop={8} accessibilityRole="button">
                                <Text style={[styles.link, isBusy && styles.linkDisabled]}>Trocar número</Text>
                            </Pressable>
                        </View>
                    </>
                );

            case 'claim':
                return isBusy ? (
                    <View style={styles.centered}>
                        <ActivityIndicator color={colors.primary} size="large" />
                        <Text style={styles.description}>Liberando sua análise grátis...</Text>
                    </View>
                ) : (
                    <PrimaryButton label="Tentar de novo" onPress={claim} busy={false} />
                );

            case 'done':
                return (
                    <View style={styles.centered}>
                        <CheckCircle2 size={RFValue(48)} color={step.granted ? colors.success : '#AAAAAA'} />
                        <Text style={styles.successTitle} accessibilityRole="header">
                            {step.granted ? 'Pronto! Sua análise grátis foi liberada.' : 'Seu celular já está confirmado.'}
                        </Text>
                        <Text style={styles.description}>
                            {step.granted
                                ? `Você tem ${step.credits === 1 ? '1 crédito' : `${step.credits} créditos`} de análise.`
                                : 'Esta conta já usou a análise grátis.'}
                        </Text>
                        {step.granted ? (
                            <PrimaryButton
                                label="Fazer minha análise"
                                onPress={() => router.replace('/(tabs)/analysis')}
                                busy={false}
                            />
                        ) : (
                            <PrimaryButton label="Voltar" onPress={fechar} busy={false} />
                        )}
                    </View>
                );
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}
                keyboardShouldPersistTaps="handled"
            >
                <Pressable
                    onPress={fechar}
                    style={styles.closeButton}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar"
                >
                    <X size={RFValue(20)} color="#FFF" />
                </Pressable>

                {step.name !== 'done' && (
                    <View style={styles.header}>
                        <Smartphone size={RFValue(32)} color={colors.primary} />
                        <Text style={styles.title} accessibilityRole="header">Ganhe 1 análise grátis</Text>
                        <Text style={styles.description}>
                            Confirme seu celular por SMS. Usamos o número só para garantir uma análise grátis por pessoa.
                        </Text>
                    </View>
                )}

                {renderConteudo()}

                {error ? (
                    <Text style={styles.errorText} accessibilityRole="alert" accessibilityLiveRegion="polite">
                        {error}
                    </Text>
                ) : null}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

type PrimaryButtonProps = {
    label: string;
    onPress: () => void;
    busy: boolean;
};

const PrimaryButton = ({ label, onPress, busy }: PrimaryButtonProps) => (
    <Pressable
        onPress={onPress}
        disabled={busy}
        style={({ pressed }) => [styles.button, busy && styles.buttonBusy, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ busy, disabled: busy }}
    >
        {busy ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{label}</Text>}
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
    label: {
        fontSize: RFValue(12),
        color: '#FFF',
        fontFamily: FONTS.Montserrat.bold,
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
    },
    codeInput: {
        letterSpacing: 8,
        textAlign: 'center',
        fontVariant: ['tabular-nums'],
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
    buttonBusy: {
        opacity: 0.7,
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
    linksRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    link: {
        color: colors.primary,
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.bold,
    },
    linkDisabled: {
        color: '#666',
    },
    centered: {
        alignItems: 'center',
        gap: 12,
        marginTop: 40,
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
