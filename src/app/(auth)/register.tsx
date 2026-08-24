import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { colors } from "@/constants/colors";
import { Fonts } from "@/constants/theme";
import { Link } from "expo-router";

import { useAuth } from '../../contexts/AuthContext';
import { getAuth, updateProfile } from '@react-native-firebase/auth'; 

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            setIsRegistering(true);
            
            await register(email, password);
            const authInstance = getAuth();
            
            if (authInstance.currentUser) {
                await updateProfile(authInstance.currentUser, {
                    displayName: name,
                });
            }
            
        } catch (error: any) {
            console.log('Erro ao registrar:', error.message);
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Erro', 'Este e-mail já está em uso.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Erro', 'E-mail inválido.');
            } else {
                Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
            }
        } finally {
            setIsRegistering(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.title}>Crie sua conta</Text>
                <Text style={styles.subTitle}>Comece a descobrir o potencial do seu carro</Text>
            </View>

            <View style={styles.mainCard}>
                <TextInput
                    style={styles.inputfield}
                    placeholder="Seu nome"
                    placeholderTextColor="#666"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />

                <TextInput
                    style={styles.inputfield}
                    placeholder="seu@email.com"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.inputfield}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                /> 

                <TextInput
                    style={styles.inputfield}
                    placeholder="Confirme sua senha"
                    placeholderTextColor="#666"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                /> 

                <Text style={{color: '#FFF', margin: 10, fontSize: 12, textAlign: 'center'}}>
                    Ao se cadastrar, você aceita nossos termos e condições.
                </Text>

                <View>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={isRegistering}
                    >
                        {isRegistering ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={{color: '#FFF', textAlign: 'center'}}>Cadastrar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#FFF', margin: 10}}>Já tem uma conta?</Text>
                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity>
                        <Text style={{color: '#FFF', margin: 10, textDecorationLine: 'underline'}}>Faça login!</Text>
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
        fontSize: 20,
        color: '#FFF',
        fontFamily: Fonts.sans,
        textAlign: 'center',
        marginHorizontal: 20
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