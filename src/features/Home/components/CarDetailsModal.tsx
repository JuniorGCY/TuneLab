import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ActivityIndicator, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { CarroAPI } from '@/features/Home/services/listCarsAPI';
import { defaultImageMode, GarageImageMode, hasTunedImage, imageForMode } from '@/features/Home/utils/garageCar';

interface CarDetailsModalProps {
    visible: boolean;
    car: CarroAPI | null;
    onClose: () => void;
    onEdit: (car: CarroAPI) => void;
    onDelete: (carId: number) => void;
}

type ImageStatus = 'loading' | 'ready' | 'error';

const MODOS: { mode: GarageImageMode; label: string }[] = [
    { mode: 'tunada', label: 'Tunada' },
    { mode: 'original', label: 'Original' },
];

export default function CarDetailsModal({ visible, car, onClose, onEdit, onDelete }: CarDetailsModalProps) {
    const [mode, setMode] = useState<GarageImageMode>('original');
    const [imageStatus, setImageStatus] = useState<ImageStatus>('loading');

    // Cada carro abre na foto tunada, quando existe.
    useEffect(() => {
        if (car) setMode(defaultImageMode(car));
    }, [car?.id]);

    const imageUri = car ? imageForMode(car, mode) : '';

    useEffect(() => {
        setImageStatus('loading');
    }, [imageUri]);

    if (!car) return null;

    const temTunada = hasTunedImage(car);
    const mostrandoTunada = temTunada && mode === 'tunada';

    const handleDelete = () => {
        Alert.alert(
            "Excluir Veículo",
            `Tem certeza que deseja excluir o ${car.titulo}?`,
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => onDelete(car.id) }
            ]
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.image}
                            contentFit="cover"
                            transition={200}
                            cachePolicy="disk"
                            onLoad={() => setImageStatus('ready')}
                            onError={() => setImageStatus('error')}
                            accessible
                            accessibilityLabel={
                                mostrandoTunada
                                    ? `Simulação por IA do ${car.titulo} com o setup aplicado`
                                    : `Foto original do ${car.titulo}`
                            }
                        />

                        {imageStatus === 'loading' && (
                            <View style={styles.imageState}>
                                <ActivityIndicator color={colors.primary} accessibilityLabel="Carregando imagem" />
                            </View>
                        )}

                        {imageStatus === 'error' && (
                            <View style={styles.imageState} accessible accessibilityRole="alert">
                                <Text style={styles.imageStateText}>Não foi possível carregar a imagem.</Text>
                            </View>
                        )}

                        {/* A foto tunada é gerada por IA: pode mostrar peças que não existem ou não servem no carro. */}
                        {mostrandoTunada && imageStatus !== 'error' && (
                            <View style={styles.aiBadge} importantForAccessibility="no-hide-descendants">
                                <Text style={styles.aiBadgeText}>Simulação por IA · ilustrativa</Text>
                            </View>
                        )}
                    </View>

                    {temTunada && (
                        <View style={styles.segmented} accessibilityRole="tablist">
                            {MODOS.map(({ mode: opcao, label }) => {
                                const selecionado = mode === opcao;
                                return (
                                    <Pressable
                                        key={opcao}
                                        onPress={() => setMode(opcao)}
                                        style={[styles.segment, selecionado && styles.segmentSelected]}
                                        accessibilityRole="tab"
                                        accessibilityState={{ selected: selecionado }}
                                        accessibilityLabel={opcao === 'tunada' ? 'Ver simulação tunada' : 'Ver foto original'}
                                        hitSlop={4}
                                    >
                                        <Text style={[styles.segmentText, selecionado && styles.segmentTextSelected]}>
                                            {label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}

                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>{car.titulo}</Text>
                        <Text style={styles.subtitle}>{car.descricao}</Text>
                        <Text style={styles.hpText}>Potência: {car.hp} HP</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.editButton]}
                            onPress={() => onEdit(car)}
                            accessibilityRole="button"
                            accessibilityLabel={`Editar ${car.titulo}`}
                        >
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPress={handleDelete}
                            accessibilityRole="button"
                            accessibilityLabel={`Excluir ${car.titulo}`}
                        >
                            <Text style={styles.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        accessibilityRole="button"
                        accessibilityLabel="Fechar detalhes"
                    >
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: '#121212',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 5,
    },
    imageWrapper: {
        width: '100%',
        height: 220,
        backgroundColor: '#1E1E1E',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageState: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    imageStateText: {
        fontFamily: FONTS.Montserrat.regular,
        fontSize: RFValue(12),
        color: '#CCC',
        textAlign: 'center',
    },
    aiBadge: {
        position: 'absolute',
        left: 12,
        bottom: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 0, 0.6)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    aiBadgeText: {
        fontFamily: FONTS.Montserrat.bold,
        fontSize: RFValue(10),
        color: colors.primary,
    },
    segmented: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 16,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 4,
    },
    segment: {
        flex: 1,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    segmentSelected: {
        backgroundColor: colors.primary,
    },
    segmentText: {
        fontFamily: FONTS.Montserrat.bold,
        fontSize: RFValue(12),
        color: '#BBB',
    },
    segmentTextSelected: {
        color: '#FFF',
    },
    infoContainer: {
        padding: 20,
    },
    title: {
        fontFamily: FONTS.Montserrat.bold,
        fontSize: RFValue(20),
        color: colors.primary || '#FFF',
        marginBottom: 8,
    },
    subtitle: {
        fontFamily: FONTS.Montserrat.regular,
        fontSize: RFValue(14),
        color: '#FFF',
        marginBottom: 12,
    },
    hpText: {
        fontFamily: FONTS.Montserrat.regular,
        fontSize: RFValue(14),
        color: '#fff',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    editButton: {
        backgroundColor: '#000',
    },
    deleteButton: {
        backgroundColor: '#FF6B00'
    },
    buttonText: {
        fontFamily: FONTS.Montserrat.bold,
        color: '#FFF',
        fontSize: RFValue(14),
    },
    closeButton: {
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    closeButtonText: {
        fontFamily: FONTS.Montserrat.regular,
        color: '#888',
        fontSize: RFValue(14),
    }
});
