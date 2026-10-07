import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Image, TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { RFValue } from "react-native-responsive-fontsize";
import { CarFront, Car, Cpu, Upload, X } from "lucide-react-native";
import { useRouter } from "expo-router";

import { useAuth } from '@/contexts/AuthContext';
import { uploadMultipleToCoreAPI } from '@/features/Home/services/uploadToCoreAPI';
import AITuningAnalysisModal from "@/features/ai-turning/components/AITuningAnalysisModal";
import { UploadResponse } from "@/features/Home/types/UploadResponse";
import CameraScreen from "@/features/analysis/components/CameraView";
import AnalysisLoadingOverlay from "@/features/analysis/components/AnalysisLoadingOverlay";

const { width } = Dimensions.get('window');
const button_width = width * 0.75;

const SCAN_ITEMS = [
  { id: 0, title: 'Frente', icon: CarFront },
  { id: 1, title: 'Lateral', icon: Car },
  { id: 2, title: 'Traseira', icon: CarFront },
  { id: 3, title: 'Motor', icon: Cpu },
];

export default function Analysis() {
    const router = useRouter();
    const { getToken } = useAuth();

    const [fotosMatriz, setFotosMatriz] = useState<(string | null)[]>([null, null, null, null]);
    const [objetivo, setObjetivo] = useState('');
    // Marca/modelo/ano (opcional). Com isso a IA não precisa adivinhar a geração do carro pela foto.
    const [veiculo, setVeiculo] = useState('');
    const [loading, setLoading] = useState(false);

    // Controle da Câmera
    const [showCamera, setShowCamera] = useState(false);
    const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [analiseResultado, setAnaliseResultado] = useState<UploadResponse | null>(null);

    const totalFotosPreenchidas = fotosMatriz.filter((uri) => uri !== null).length;

    // Quando clica em um slot vazio, abre a câmera guardando qual botão foi clicado
    const handleOpenCapture = (index: number) => {
        setActiveSlotIndex(index);
        setShowCamera(true);
    };

    // Quando a câmera (ou galeria) devolve a foto
    const handlePictureTaken = (uri: string) => {
        if (activeSlotIndex !== null) {
            const novasFotos = [...fotosMatriz];
            novasFotos[activeSlotIndex] = uri;
            setFotosMatriz(novasFotos);
        }
        setShowCamera(false);
        setActiveSlotIndex(null);
    };

    const handleRemoveImage = (index: number, e: any) => {
        e.stopPropagation();
        const novasFotos = [...fotosMatriz];
        novasFotos[index] = null;
        setFotosMatriz(novasFotos);
    };

    const handleStartAnalysis = async () => {
        if (totalFotosPreenchidas === 0) {
            Alert.alert("Atenção", "Adicione pelo menos uma foto do veículo na matriz.");
            return;
        }
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("Usuário não autenticado.");

            const fotosValidas = fotosMatriz.filter((uri): uri is string => uri !== null);
            const respostaIA = await uploadMultipleToCoreAPI(fotosValidas, objetivo || "Melhoria de performance e visual", token, veiculo.trim());

            setAnaliseResultado(respostaIA);
            setModalVisible(true);

        } catch (error: any) {
            console.error("Erro na análise IA:", error);
            Alert.alert("Erro", error?.message || "Não foi possível concluir a análise.");
        } finally {
            setLoading(false);
        }
    };

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
                        <Text style={styles.titleHeader}>Escaneie seu veículo</Text>
                        <Text style={styles.subtitleHeader}>
                            Capture as fotos nos ângulos indicados para que nossa IA de alta performance analise o potencial de tunagem do seu carro.
                        </Text>
                    </View>

                    <View style={styles.mainView}>
                        <Text style={styles.matrizText}>
                            Matriz de Captura {totalFotosPreenchidas}/4
                        </Text>

                        <View style={styles.gridContainer}>
                            {SCAN_ITEMS.map((item) => {
                                const IconComponent = item.icon;
                                const fotoAtual = fotosMatriz[item.id];

                                return (
                                    <Pressable
                                        key={item.id}
                                        style={styles.cardWrapper}
                                        onPress={() => handleOpenCapture(item.id)} // ABRE A CÂMERA
                                    >
                                        <View style={[styles.cardView, fotoAtual ? styles.cardViewActive : null]}>
                                            {fotoAtual ? (
                                                <>
                                                    <Image source={{ uri: fotoAtual }} style={styles.cardImagePreview} />
                                                    <TouchableOpacity
                                                        style={styles.removeImageIcon}
                                                        onPress={(e) => handleRemoveImage(item.id, e)}
                                                    >
                                                        <X size={RFValue(14)} color="#FFF" />
                                                    </TouchableOpacity>
                                                </>
                                            ) : (
                                                <>
                                                    <IconComponent size={RFValue(26)} color="#FFF" />
                                                    <Text style={styles.cardText}>{item.title}</Text>
                                                </>
                                            )}
                                        </View>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textInputText}>Qual é o seu carro? (opcional)</Text>
                        <TextInput
                            placeholder="Ex: Honda Civic 2003"
                            placeholderTextColor="#666"
                            style={styles.textInputSingleLine}
                            value={veiculo}
                            onChangeText={setVeiculo}
                            maxLength={100}
                            autoCapitalize="words"
                            returnKeyType="next"
                            accessibilityLabel="Marca, modelo e ano do seu carro"
                        />
                        <Text style={styles.inputHint}>
                            Informar marca, modelo e ano deixa as peças sugeridas muito mais precisas.
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textInputText}>O que você busca?</Text>
                        <TextInput
                            placeholder="Mais potência, mais agressivo, mais bonito...."
                            placeholderTextColor="#666"
                            style={styles.textInput}
                            multiline={true}
                            textAlignVertical="top"
                            value={objetivo}
                            onChangeText={setObjetivo}
                        />
                    </View>

                    <Pressable onPress={handleStartAnalysis} disabled={loading}>
                        <View style={[styles.button, loading && { opacity: 0.7 }]}>
                            {loading ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <>
                                    <Upload size={RFValue(20)} color="#FFF" />
                                    <Text style={styles.buttonText}>PROCESSAR ANÁLISE COM IA</Text>
                                </>
                            )}
                        </View>
                    </Pressable>
                </View>
            </ScrollView>

            {/* MODAL DA CÂMERA POR CIMA DE TUDO */}
            {showCamera && (
                <View style={StyleSheet.absoluteFill}>
                    <CameraScreen
                        onClose={() => setShowCamera(false)}
                        onPictureTaken={handlePictureTaken}
                    />
                </View>
            )}

            {analiseResultado && (
                <AITuningAnalysisModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    data={analiseResultado}
                />
            )}

            {loading && <AnalysisLoadingOverlay />}
        </KeyboardAvoidingView>
    );
}

// ... Os seus styles do Analysis.tsx continuam exatamente os mesmos aqui no final!
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
        overflow: 'hidden',
    },
    cardViewActive: {
        borderColor: colors.primary,
        borderWidth: 1,
    },
    cardImagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
    },
    removeImageIcon: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 10,
        padding: 4,
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
        marginTop: RFValue(20),
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
    textInputSingleLine: {
        width: '100%',
        height: 48,
        paddingHorizontal: RFValue(12),
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.regular,
        backgroundColor: '#1e1e1e',
        borderColor: '#E0E0E0',
        borderWidth: 0.2,
        borderRadius: 12,
        color: '#FFF'
    },
    inputHint: {
        marginTop: RFValue(6),
        fontSize: RFValue(9),
        fontFamily: FONTS.Montserrat.regular,
        color: '#888',
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
