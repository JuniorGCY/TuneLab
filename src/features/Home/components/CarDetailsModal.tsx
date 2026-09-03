import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { CarroAPI } from '@/features/Home/services/listCarsAPI';

interface CarDetailsModalProps {
    visible: boolean;
    car: CarroAPI | null;
    onClose: () => void;
    onEdit: (car: CarroAPI) => void;
    onDelete: (carId: number) => void;
}

export default function CarDetailsModal({ visible, car, onClose, onEdit, onDelete }: CarDetailsModalProps) {
    if (!car) return null;

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
                    <Image source={{ uri: car.imageUrl }} style={styles.image} resizeMode="cover" />
                    
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>{car.titulo}</Text>
                        <Text style={styles.subtitle}>{car.descricao}</Text>
                        <Text style={styles.hpText}>Potência: {car.hp} HP</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.button, styles.editButton]} onPress={() => onEdit(car)}>
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                            <Text style={styles.buttonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
    image: {
        width: '100%',
        height: 200,
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