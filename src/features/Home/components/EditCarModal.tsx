import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { CarroAPI } from '@/features/Home/services/listCarsAPI';

interface EditCarModalProps {
    visible: boolean;
    car: CarroAPI | null;
    onClose: () => void;
    onSave: (id: number, titulo: string, descricao: string, hp: number) => Promise<void>;
}

export default function EditCarModal({ visible, car, onClose, onSave }: EditCarModalProps) {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [hp, setHp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (car) {
            setTitulo(car.titulo);
            setDescricao(car.descricao);
            setHp(car.hp.toString());
        }
    }, [car]);

    const handleSave = async () => {
        if (!car) return;
        
        if (!titulo.trim()) {
            alert('O título não pode estar vazio.');
            return;
        }

        setIsLoading(true);
        try {
            const hpNumber = parseInt(hp, 10) || 0;
            await onSave(car.id, titulo, descricao, hpNumber);
            onClose();
        } catch (error) {
            console.error("Erro no formulário de edição:", error);
            alert("Não foi possível salvar as alterações.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!car) return null;

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <KeyboardAvoidingView 
                style={styles.overlay} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.modalContainer}>
                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                        <Text style={styles.headerTitle}>Editar Veículo</Text>

                        <Text style={styles.label}>Título do Projeto</Text>
                        <TextInput
                            style={styles.input}
                            value={titulo}
                            onChangeText={setTitulo}
                            placeholder="Ex: Golf GTI Stage 2"
                            placeholderTextColor="#666"
                        />

                        <Text style={styles.label}>Descrição</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={descricao}
                            onChangeText={setDescricao}
                            placeholder="Detalhes do projeto..."
                            placeholderTextColor="#666"
                            multiline
                            numberOfLines={3}
                        />

                        <Text style={styles.label}>Potência (HP)</Text>
                        <TextInput
                            style={styles.input}
                            value={hp}
                            onChangeText={setHp}
                            placeholder="Ex: 250"
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                        />

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={isLoading}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave} disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.buttonText}>Salvar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
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
        width: '90%',
        backgroundColor: colors.background || '#1E1E1E',
        borderRadius: 16,
        maxHeight: '80%',
        elevation: 5,
    },
    scrollContent: {
        padding: 20,
    },
    headerTitle: {
        fontFamily: FONTS.Montserrat.bold,
        fontSize: RFValue(20),
        color: colors.primary || '#FFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontFamily: FONTS.Montserrat.medium,
        fontSize: RFValue(14),
        color: '#CCC',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        color: '#FFF',
        fontFamily: FONTS.Montserrat.regular,
        fontSize: RFValue(14),
        marginBottom: 15,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#555',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        fontFamily: FONTS.Montserrat.bold,
        color: '#FFF',
        fontSize: RFValue(14),
    }
});