import { useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { RFValue } from 'react-native-responsive-fontsize';

import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { useAuth } from '@/contexts/AuthContext';
import { getErrorCode, getFirebaseErrorMessage } from "@/utils/FirebaseErrors";

// Só login com Google: sem senha para vazar e sem conta criada com e-mail descartável.
// Depois de entrar, o _layout redireciona para as abas assim que a API sincroniza o usuário.
export default function LoginScreen() {
    const { signInWithGoogle } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleGoogleSignIn = async () => {
        setErrorMessage('');
        setIsSigningIn(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Erro no login com Google:', error);
            setErrorMessage(getFirebaseErrorMessage(getErrorCode(error)));
        } finally {
            setIsSigningIn(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title} accessibilityRole="header">TuneLab</Text>
                <Text style={styles.subTitle}>Descubra o potencial do seu carro</Text>
            </View>

            <View style={styles.mainCard}>
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={handleGoogleSignIn}
                    disabled={isSigningIn}
                    style={styles.googleButton}
                    accessibilityLabel="Entrar com Google"
                />

                {isSigningIn && (
                    <ActivityIndicator
                        color={colors.primary}
                        style={styles.loading}
                        accessibilityLabel="Entrando"
                    />
                )}

                {errorMessage ? (
                    <Text style={styles.errorText} accessibilityRole="alert" accessibilityLiveRegion="polite">
                        {errorMessage}
                    </Text>
                ) : null}
            </View>

            <Text style={styles.legalText}>
                Ao entrar, você concorda com os Termos de Uso e a Política de Privacidade do TuneLab.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: RFValue(35),
        color: colors.primary,
        fontFamily: FONTS.Montserrat.extraBold,
        marginBottom: 5
    },
    subTitle: {
        fontSize: RFValue(14),
        color: '#FFF',
        fontFamily: FONTS.Montserrat.medium,
        textAlign: 'center',
    },
    mainCard: {
        backgroundColor: '#1C1C1E',
        alignItems: 'center',
        width: '100%',
        maxWidth: 360,
        marginVertical: 24,
        paddingVertical: 24,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    googleButton: {
        width: '100%',
        maxWidth: 312,
        height: 48,
    },
    loading: {
        marginTop: 16,
    },
    errorText: {
        marginTop: 16,
        color: '#ff4d4d',
        fontSize: RFValue(11),
        textAlign: 'center',
        fontFamily: FONTS.Montserrat.regular
    },
    legalText: {
        maxWidth: 320,
        color: '#888',
        fontSize: RFValue(9),
        textAlign: 'center',
        fontFamily: FONTS.Montserrat.regular,
    },
});
