import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Alert, ActivityIndicator, Pressable } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshCw } from 'lucide-react-native';

import CardCarUser from "@/features/Home/components/CardCarUser";
import CardSuggestionsUser from "@/features/Home/components/CardSuggestionsUser";
import { CreditsBadge } from '@/features/Home/components/CreditsBadge';
import { useHomeData } from '@/features/Home/hooks/useHomeData';
import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";
import { useAuth } from '../../contexts/AuthContext'; 
import { CarroAPI, deleteCarAPI, updateCarAPI } from '../../features/Home/services/listCarsAPI'; 
import CarDetailsModal from '@/features/Home/components/CarDetailsModal';
import EditCarModal from '@/features/Home/components/EditCarModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; 

const TestCard2 = [
    { id: '1', title: 'Stage 2 Remap', subtitle: '+85 HP'},
    { id: '2', title: 'Carbon Aero Kit', subtitle: 'Downforce Optimization'},
];

export default function HomeScreen() {
    const { getToken } = useAuth();
    const insets = useSafeAreaInsets();
    const { carros, carsStatus, creditos, isRefreshing, refresh } = useHomeData();
    const [selectedCar, setSelectedCar] = useState<CarroAPI | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const handleTest2 = () => {
        Alert.alert("Aviso", "Eu já não disse FUTURAMENTE?!");
    }

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
            refresh(); 
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível excluir o veículo.");
        }
    };

    const handleSaveEdit = async (id: number, titulo: string, descricao: string, hp: number) => {
        const token = await getToken();
        if (!token) throw new Error("Usuário não autenticado");
        await updateCarAPI(token, id, titulo, descricao, hp);
        refresh(); 
    };

    const renderGaragem = () => {
        if (carsStatus === 'loading') {
            return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />;
        }

        if (carsStatus === 'error') {
            return (
                <View style={styles.feedbackBox}>
                    <Text style={styles.emptyText}>Não foi possível carregar sua garagem.</Text>
                    <Pressable
                        onPress={refresh}
                        disabled={isRefreshing}
                        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
                        accessibilityRole="button"
                        accessibilityLabel="Tentar carregar a garagem novamente"
                    >
                        <Text style={styles.retryText}>{isRefreshing ? 'Carregando...' : 'Tentar novamente'}</Text>
                    </Pressable>
                </View>
            );
        }

        if (carros.length === 0) {
            return <Text style={styles.emptyText}>Você ainda não tem projetos na garagem.</Text>;
        }

        return (
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
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <CreditsBadge creditos={creditos} />
            </View>

            <View style={styles.flatListViewCars}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Meus carros</Text>
                    <Pressable
                        onPress={refresh}
                        disabled={isRefreshing}
                        hitSlop={8}
                        style={({ pressed }) => [styles.refreshButton, pressed && styles.pressed]}
                        accessibilityRole="button"
                        accessibilityLabel="Atualizar garagem e créditos"
                        accessibilityState={{ busy: isRefreshing, disabled: isRefreshing }}
                    >
                        {isRefreshing ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <RefreshCw size={RFValue(16)} color="#FFF" />
                        )}
                    </Pressable>
                </View>

                {renderGaragem()}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    textsPrimary: {
        fontSize: RFValue(17),
        fontFamily: FONTS.Montserrat.regular,
        color: '#FFF',
        alignSelf: 'flex-start',
        marginBottom: 16,
        paddingHorizontal: 20, 
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: RFValue(17),
        fontFamily: FONTS.Montserrat.regular,
        color: '#FFF',
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E1E1E',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.96 }],
    },
    flatListViewCars: {
        paddingTop: 24,
    },
    feedbackBox: {
        gap: 12,
        alignItems: 'flex-start',
    },
    emptyText: {
        color: '#888',
        paddingHorizontal: 20,
        fontFamily: FONTS.Montserrat.regular,
    },
    retryButton: {
        marginLeft: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    retryText: {
        color: colors.primary,
        fontFamily: FONTS.Montserrat.bold,
        fontSize: RFValue(12),
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
