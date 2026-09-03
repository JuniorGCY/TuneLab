import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert, ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import CardCarUser from "@/features/Home/components/CardCarUser";
import CardSuggestionsUser from "@/features/Home/components/CardSuggestionsUser";
import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import CameraScreen from '@/features/Home/components/CameraView';
import { useAuth } from '../../contexts/AuthContext'; 
import { listCarsAPI, CarroAPI, deleteCarAPI, updateCarAPI } from '../../features/Home/services/listCarsAPI'; 
import CarDetailsModal from '@/features/Home/components/CarDetailsModal';
import EditCarModal from '@/features/Home/components/EditCarModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; 

const TestCard2 = [
    { id: '1', title: 'Stage 2 Remap', subtitle: '+85 HP'},
    { id: '2', title: 'Carbon Aero Kit', subtitle: 'Downforce Optimization'},
]

export default function HomeScreen() {
    const { getToken } = useAuth();
    const [showCamera, setShowCamera] = useState(false);
    const [carros, setCarros] = useState<CarroAPI[]>([]);
    const [loadingCarros, setLoadingCarros] = useState(true);
    const [selectedCar, setSelectedCar] = useState<CarroAPI | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Função responsável por buscar os dados no Go
    const carregarCarros = async () => {
        setLoadingCarros(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("Usuário não autenticado");

            const listaDeCarros = await listCarsAPI(token);
            setCarros(listaDeCarros);
        } catch (error) {
            console.error("Erro ao carregar carros:", error);
        } finally {
            setLoadingCarros(false);
        }
    };

    useEffect(() => {
        carregarCarros();
    }, []);

    const handleTest2 = () => {
        Alert.alert("Eu já nao disse FUTURAMENTE?!")
    }

    const handleAnalyzeCar = () => {
        setShowCamera(true);
    };

    const handleCloseCamera = () => {
        setShowCamera(false);
        carregarCarros(); 
    };

    const handleOpenCarDetails = (car: CarroAPI) => {
        setSelectedCar(car);
        setModalVisible(true);
    };

    const handleOpenEdit = (car: CarroAPI) => {
        setModalVisible(false);
        setTimeout(() => {
            setEditModalVisible(true);
        }, 300);
    };

    const handleDeleteCar = async (carId: number) => {
        try {
            const token = await getToken();
            if (!token) return;
            setModalVisible(false); 
            await deleteCarAPI(token, carId);
            carregarCarros(); 
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível excluir o veículo.");
        }
        setModalVisible(false);
    };

    const handleSaveEdit = async (id: number, titulo: string, descricao: string, hp: number) => {
        const token = await getToken();
        if (!token) throw new Error("Usuário não autenticado");
        await updateCarAPI(token, id, titulo, descricao, hp);
        carregarCarros(); 
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <TouchableOpacity activeOpacity={0.8} onPress={handleAnalyzeCar}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>ANALISAR MEU CARRO</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.flatListViewCars}>
                <Text style={styles.textsPrimary}>Meus carros</Text>
                
                {loadingCarros ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
                ) : carros.length === 0 ? (
                    <Text style={{ color: '#888', paddingHorizontal: 20 }}>Você ainda não tem carros analisados.</Text>
                ) : (
                    <FlatList 
                        data={carros} 
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContainer}
                        decelerationRate="fast"
                        snapToInterval={CARD_WIDTH + 16} 
                        renderItem={({ item }) => (
                            <CardCarUser 
                                title={item.titulo} 
                                subtitle={item.descricao} 
                                hp={`${item.hp} hp`}
                                imageUrl={item.imageUrl}
                                onPress={() => handleOpenCarDetails(item)}
                            />
                        )}
                    />
                )}
            </View>

            <CarDetailsModal 
                visible={modalVisible}
                car={selectedCar}
                onClose={() => setModalVisible(false)}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteCar}
            />

            <EditCarModal
                visible={editModalVisible}
                car={selectedCar}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSaveEdit}
            />

            <View style={styles.flatListViewSuggestions}>
                <Text style={styles.textsPrimary}>Sugestões para você</Text>
                <FlatList
                    data={TestCard2}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                    renderItem={({item }) => (
                        <CardSuggestionsUser 
                           title={item.title}
                           subtitle={item.subtitle}
                           onPress={handleTest2}
                        />
                    )}
                />
            </View>

            {showCamera && (
                <View style={StyleSheet.absoluteFill}>
                    <CameraScreen onClose={handleCloseCamera} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    headerView: {
        marginTop: 80,
        marginHorizontal: 25
    },
    button: {
        width: CARD_WIDTH,
        height: 60,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 12
    },
    buttonText: {
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.bold,
        color: '#FFF',
        textAlign: 'center'
    },
    textsPrimary: {
        fontSize: RFValue(17),
        fontFamily: FONTS.Montserrat.regular,
        color: '#FFF',
        alignSelf: 'flex-start',
        marginBottom: 16,
        paddingHorizontal: 20, 
    },
    flatListViewCars: {
        paddingTop: 30,
    },
    scrollContainer: {
        paddingLeft: 20, 
        paddingRight: 40,
    },
    flatListViewSuggestions: {
        flex: 1,
        paddingTop: 40,
    }
});