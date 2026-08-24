import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { Link } from "expo-router";
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from "@/utils/FirebaseErrors";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { User, Mail, LockKeyhole} from 'lucide-react-native'

const registerSchema = z.object({
    name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
    email: z.string().email('Digite um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { register } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: RegisterFormData) => {
        setErrorMessage('');

        try {
            setIsRegistering(true);
            await register(data.email, data.password, data.name);
        } catch (error: any) {
            const errorMsg = getFirebaseErrorMessage(error.code);
            setErrorMessage(errorMsg);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.title}>Crie sua conta</Text>
                <Text style={styles.subTitle}>Comece a descobrir o potencial do seu carro</Text>
            </View>

            <View style={styles.mainCard}>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputfieldContainer}>
                            <User color="#666" size={20} style={styles.inputIcon} />
                            <TextInput
                                style={styles.inputfield}
                                placeholder="Seu nome"
                                placeholderTextColor="#666"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                autoCapitalize="words"
                            />
                        </View>
                    )}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputfieldContainer}>
                            <Mail color="#666" size={20} style={styles.inputIcon} />
                            <TextInput
                            style={styles.inputfield}
                            placeholder="seu@email.com"
                            placeholderTextColor="#666"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        </View>
                    )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputfieldContainer}>
                            <LockKeyhole color="#666" size={20} style={styles.inputIcon} />
                            <TextInput
                            style={styles.inputfield}
                            placeholder="Digite sua senha"
                            placeholderTextColor="#666"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry
                        />
                        </View>
                       
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={styles.inputfieldContainer}> 
                            <LockKeyhole color="#666" size={20} style={styles.inputIcon} />
                            <TextInput
                            style={styles.inputfield}
                            placeholder="Confirme sua senha"
                            placeholderTextColor="#666"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry
                        />
                        </View>
                    )}
                />
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

                <Text style={{color: '#FFF', margin: 10, fontSize: 12, textAlign: 'center'}}>
                    Ao se cadastrar, você aceita nossos termos e condições.
                </Text>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isRegistering}
                >
                    {isRegistering ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={{color: '#FFF', textAlign: 'center', fontWeight: 'bold'}}>Cadastrar</Text>
                    )}
                </TouchableOpacity>
            </View>

            {errorMessage ? (
                <View className="bg-red-500/20 border border-red-500 p-3 rounded-lg mb-4 w-4/5">
                   <Text className="text-red-400 text-sm text-center">{errorMessage}</Text>
                </View>
            ) : null}

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#FFF', margin: 10}}>Já tem uma conta?</Text>
                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity>
                        <Text style={{color: colors.primary, margin: 10, textDecorationLine: 'underline'}}>Faça login!</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
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
        fontFamily: FONTS.Montserrat.extraBold
    },
    subTitle: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: FONTS.Montserrat.bold,
        textAlign: 'center',
        marginHorizontal: 20,
        marginTop: 5
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
    inputfieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: 280,
        marginVertical: 6,
        paddingHorizontal: 12,
        borderWidth: 0.5,
        borderColor: colors.border,
        borderRadius: 12,
        backgroundColor: '#0F0F0F',
        height: 48,
    },
    inputIcon: {
        marginRight: 8,
    },
    inputfield: {
        flex: 1,
        height: '100%',
        color: '#fff',
        paddingVertical: 0,
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: 11,
        alignSelf: 'flex-start',
        marginLeft: 15,
        marginBottom: 4,
        fontFamily: FONTS.Montserrat.regular
    },
    button: {
        width: 280,
        padding: 15, 
        marginVertical: 10,
        borderRadius: 12, 
        backgroundColor: colors.primary, 
    }
});