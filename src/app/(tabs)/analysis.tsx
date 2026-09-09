import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { RFValue } from "react-native-responsive-fontsize";
import { CarFront, Car, Cpu, Upload } from "lucide-react-native"; 

import { useRouter } from "expo-router";

const { width } = Dimensions.get('window')
const button_width = width * 0.75
const router = useRouter();

const SCAN_ITEMS = [
  { id: '1', title: 'Frente', icon: CarFront },
  { id: '2', title: 'Lateral', icon: Car },
  { id: '3', title: 'Traseira', icon: CarFront },
  { id: '4', title: 'Motor', icon: Cpu },
];

export default function Analysis() {
    
    const test = () => {
        router.push('/AITuningAnalysisModal')
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: '#0F0F0F' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1, paddingBottom: RFValue(40) }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <View style={styles.headerView}>
                        <Text style={styles.titleHeader}>Escaneie seu veiculo</Text>
                        <Text style={styles.subtitleHeader}>
                            Capture as fotos nos ângulos indicados para que nossa IA de alta performance analise o potencial de tunagem do seu carro.
                        </Text>
                    </View>

                    <View style={styles.mainView}>
                        <Text style={styles.matrizText}>
                            Matriz de Captura 0/4
                        </Text>

                        <View style={styles.gridContainer}>
                            {SCAN_ITEMS.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <Pressable key={item.id} style={styles.cardWrapper}>
                                        <View style={styles.cardView}>
                                            <IconComponent size={RFValue(26)} color="#FFF" />
                                            <Text style={styles.cardText}>
                                                {item.title}
                                            </Text>
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    <Pressable onPress={test}>
                        <View style={styles.button}>
                            <Upload size={RFValue(20)} color="#FFF" />
                            <Text style={styles.buttonText}>
                                Fazer upload da galeria
                            </Text>
                        </View>
                    </Pressable>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textInputText}>
                            O que voce busca?
                        </Text>
                        <TextInput 
                            placeholder="Mais potencia, mais agressivo, mais bonito...."
                            placeholderTextColor="#666"
                            style={styles.textInput}
                            multiline={true}
                            textAlignVertical="top"
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: '#0F0F0F',
        width: '100%'
    },
    headerView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: RFValue(40),
        paddingHorizontal: RFValue(20),
    },
    titleHeader: {
        fontSize: RFValue(20),
        color: colors.primary,
        fontFamily: FONTS.Montserrat.extraBold,
    },
    subtitleHeader: {
        fontSize: RFValue(10),
        color: "#FFF",
        fontFamily: FONTS.Montserrat.bold,
        textAlign: "center",
        marginTop: RFValue(6)
    },
    mainView: {
        width: '100%',
        marginTop: RFValue(30),
        paddingHorizontal: RFValue(20),
    },
    matrizText: {
        fontSize: RFValue(16),
        color: "#FFF",
        fontFamily: FONTS.Montserrat.regular,
        marginBottom: RFValue(15),
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48%',
        flexGrow: 1,
        maxWidth: '48%',
        marginBottom: RFValue(12),
    },
    cardView: {
        height: RFValue(100),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#1e1e1e',
        padding: RFValue(10),
        borderRadius: 12,
        borderWidth: 0.2,
        borderColor: "#E0E0E0",
        elevation: 2
    },
    cardText: {
        fontSize: RFValue(14),
        fontFamily: FONTS.Montserrat.regular,
        color: "#FFF",
        marginTop: RFValue(8),
    },
    button: {   
        width: button_width,
        height: 60,
        marginTop: RFValue(10),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 12
    },
    buttonText: {
        marginStart: RFValue(9),
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.bold,
        color: '#FFF',
        textAlign: 'center'
    },
    inputContainer: {
        width: '100%',
        paddingHorizontal: RFValue(20),
        marginTop: RFValue(20)
    },
    textInputText: {
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.bold,
        color: '#FFF',
        textAlign: 'left',
        marginBottom: RFValue(6)
    },
    textInput: {
        width: '100%',
        height: 100,
        padding: RFValue(12),
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.regular,
        backgroundColor: '#1e1e1e',
        borderColor: '#E0E0E0',
        borderWidth: 0.2,
        borderRadius: 12,
        color: '#FFF'
    }
});