import { View, Text, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import { colors } from "@/constants/colors";
import { Fonts } from "@/constants/theme";
import { Link } from "expo-router";


export default function RegisterScreen() {
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
                />

                <TextInput
                    style={styles.inputfield}
                    placeholder="seu@email.com"
                />

                <TextInput
                    style={styles.inputfield}
                    placeholder="Digite sua senha"
                    keyboardType="numeric"
                /> 

                <TextInput
                    style={styles.inputfield}
                    placeholder="Confirme sua senha"
                    keyboardType="numeric"
                /> 

                <Text style={{color: '#FFF', margin: 10}}>Aceito os termos e condições</Text>

                <View>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{color: '#FFF', textAlign: 'center'}}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#FFF', margin: 10}}>Já tem uma conta?</Text>
                <Link href="/login">
                    <Text style={{color: '#FFF', margin: 10, textDecorationLine: 'underline'}}>Faça login!</Text>
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