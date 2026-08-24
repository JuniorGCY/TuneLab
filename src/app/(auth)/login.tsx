import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { Link } from "expo-router";

//imports externos
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '../../contexts/AuthContext';
import { getFirebaseErrorMessage } from "@/utils/FirebaseErrors";
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const loginSchema = z.object({
    email: z.string().email('Digite um e-mail válido.'),
    password: z.string().min(1, 'A senha é obrigatória.') 
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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
                        <View style={styles.inputfieldContainer}>
                            <Mail color="#666" size={20} style={styles.inputIcon} />
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
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity 
                                onPress={() => setShowPassword(!showPassword)}
                                style={{ padding: 4 }}
                            >
                                {showPassword ? (
                                    <EyeOff color="#666" size={20} />
                                ) : (
                                    <Eye color="#666" size={20} />
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <TouchableOpacity>
                    <Text style={{color: '#FFF', alignSelf: 'flex-end', margin: 10, fontSize: RFValue(11), fontFamily: FONTS.Montserrat.regular}}>
                        Esqueceu a senha?
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>
            </View>

            {errorMessage ? (
                <View className="bg-red-500/20 border border-red-500 p-3 rounded-lg mb-4 w-4/5">
                   <Text className="text-red-400 text-sm text-center">{errorMessage}</Text>
                </View>
            ) : null}

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.bottomText}>Não tem conta?</Text>

                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity>
                        <Text style={styles.bottomText2}>Crie uma!</Text>
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
        fontSize: RFValue(35),
        color: colors.primary,
        fontFamily: FONTS.Montserrat.extraBold,
        marginBottom: 5
    },
    subTitle: {
        fontSize: RFValue(16),
        color: '#FFF',
        fontFamily: FONTS.Montserrat.medium
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
        fontFamily: FONTS.Montserrat.regular
    },
    errorText: {
        color: '#ff4d4d',
        fontSize: RFValue(11),
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
    },
    buttonText: {
        fontSize: RFValue(12),
        color: '#FFF', 
        textAlign: 'center',
        fontFamily: FONTS.Montserrat.bold
    },
    bottomText: {
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.light,
        color: '#FFF', 
        margin: 10
    },
    bottomText2: {
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.regular,
        color: colors.primary, 
        margin: 10   
    }
});