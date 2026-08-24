import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "@/constants/colors";
import { Fonts } from "@/constants/theme";
import { Link } from "expo-router";

import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { login } = useAuth();
    
    const handleLogin = async () => {
        if (!email || !password) return;

        try {
            setIsLoggingIn(true);
            await login(email, password);
        } catch (error: any) {
            console.log('Erro ao logar:', error.message);
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.title}>TuneLab</Text>
                <Text style={styles.subTitle}>Bem-vindo de volta</Text>
            </View>

            <View style={styles.mainCard}>
                <View>
                    <TextInput
                        style={styles.inputfield}
                        placeholder="Digite seu email"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View>
                   <TextInput
                       style={styles.inputfield}
                       placeholder="Digite sua senha"
                       placeholderTextColor="#666"
                       value={password}
                       onChangeText={setPassword}
                       secureTextEntry
                    /> 
                </View>

                <Text style={{color: '#FFF', alignSelf: 'flex-end', margin: 10}}>Esqueceu a senha?</Text>

                <View>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleLogin}
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={{color: '#FFF', textAlign: 'center'}}>Entrar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#FFF', margin: 10}}>Não tem conta?</Text>
                <Link href="/register" asChild>
                    <TouchableOpacity>
                        <Text style={{color: '#FFF', margin: 10, textDecorationLine: 'underline'}}>Crie uma!</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        color: colors.primary,
        fontFamily: Fonts.serif
    },
    subTitle: {
        fontSize: 25,
        color: '#FFF',
        fontFamily: Fonts.sans
    },
    mainCard: {
        backgroundColor: '#1C1C1E',
        justifyContent: 'center', 
        alignItems: 'center',
        width: '80%',
        margin: 20,
        padding: 10,
        borderRadius: 12,
    },
    inputfield: {
        width: 250,
        marginVertical: 10,
        padding: 10,
        color: '#fff',
        borderWidth: 0.5,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: '#0F0F0F',
    },
    button: {
        width: 250,
        padding: 15, 
        marginVertical: 10,
        borderRadius: 12, 
        backgroundColor: colors.primary, 
    }
})