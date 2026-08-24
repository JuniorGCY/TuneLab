import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "@/constants/colors";
import { Fonts } from "@/constants/theme";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from "@/utils/FirebaseErrors";

const loginSchema = z.object({
    email: z.string().email('Digite um e-mail válido.'),
    password: z.string().min(1, 'A senha é obrigatória.') 
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });
    
    const onSubmit = async (data: LoginFormData) => {
        setErrorMessage('');

        try {
            setIsLoggingIn(true);
            await login(data.email, data.password);
        } catch (error: any) {
            const errorMsg = getFirebaseErrorMessage(error.code);
            setErrorMessage(errorMsg);
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
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.inputfield}
                            placeholder="Digite seu email"
                            placeholderTextColor="#666"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.inputfield}
                            placeholder="Digite sua senha"
                            placeholderTextColor="#666"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry
                        />
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <Text style={{color: '#FFF', alignSelf: 'flex-end', margin: 10, fontSize: 12}}>
                    Esqueceu a senha?
                </Text>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={{color: '#FFF', textAlign: 'center', fontWeight: 'bold'}}>Entrar</Text>
                    )}
                </TouchableOpacity>
            </View>

            {errorMessage ? (
                <View className="bg-red-500/20 border border-red-500 p-3 rounded-lg mb-4 w-4/5">
                   <Text className="text-red-400 text-sm text-center">{errorMessage}</Text>
                </View>
            ) : null}

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#FFF', margin: 10}}>Não tem conta?</Text>

                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity>
                        <Text style={{color: colors.primary, margin: 10, textDecorationLine: 'underline'}}>Crie uma!</Text>
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
        fontSize: 35,
        color: colors.primary,
        fontFamily: Fonts.serif,
        marginBottom: 5
    },
    subTitle: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: Fonts.sans
    },
    mainCard: {
        backgroundColor: '#1C1C1E',
        justifyContent: 'center', 
        alignItems: 'center',
        width: '85%',
        margin: 20,
        padding: 15,
        borderRadius: 12,
    },
    inputfield: {
        width: '100%',
        maxWidth: 280,
        marginVertical: 6,
        padding: 12,
        color: '#fff',
        borderWidth: 0.5,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: '#0F0F0F',
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 11,
        alignSelf: 'flex-start',
        marginLeft: 15,
        marginBottom: 4,
    },
    button: {
        width: 280,
        padding: 15, 
        marginVertical: 10,
        borderRadius: 12, 
        backgroundColor: colors.primary, 
    }
})