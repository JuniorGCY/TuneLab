import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Fonts } from '@/constants/theme';

const { width } = Dimensions.get('window')
const card_width = width * 0.40

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <Text style={styles.textHeader}>Sam Campos</Text>
                <Text style={styles.subTextHeader}>Desalmado</Text>
            </View>

            <View style={{flexDirection: 'row', marginHorizontal: 20, justifyContent: 'space-between'}}>
                <View style={styles.cardContainer}>
                    <Text style={styles.cardText}>Meus {'\n'}carros</Text>
                    <Text style={styles.cardTextSub}>3</Text>
                </View>

                <View style={styles.cardContainer}>
                    <Text style={styles.cardText}>Setup {'\n'}Salvos</Text>
                    <Text style={styles.cardTextSub}>12</Text>
                </View>
            </View>

            <View style={styles.cardBottomContainer}>
                <View style={styles.cardBottom}>
                    <Text style={styles.cardBottomText}>Editar Perfil</Text>
                </View>

                <View style={styles.cardBottom}>
                    <Text style={styles.cardBottomText}>Meus Setup</Text>
                </View>

                <View style={styles.cardBottom}>
                    <Text style={styles.cardBottomText}>Notificacoes</Text>
                </View>

                <View style={styles.cardBottom}>
                    <Text style={styles.cardBottomText}>Preferencias</Text>
                </View>

                <View style={styles.cardBottom}>
                    <Text style={styles.cardBottomText}>Ajuda e suporte</Text>
                </View>

                <View style={styles.cardBottom}>
                    <Text style={styles.cardBottomText}>Termos e privacidade</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    headerView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    textHeader: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
        fontFamily: Fonts.serif
    },
    subTextHeader: {
        fontSize: 20,
        color: '#FFF',
        fontFamily: Fonts.serif
    },
    cardContainer: {
        width: card_width,
        height: 120,
        marginVertical: 20,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
    },
    cardText: {
        marginBottom: 10,
        color: '#FFF',
        fontSize: 16,
        fontFamily: Fonts.serif,
    },
    cardTextSub: {
        color: '#FFF',
        fontSize: 22,
        fontFamily: Fonts.serif
    },
    cardBottomContainer: {
        width: card_width,
        marginVertical: 20,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: 12
    },
    cardBottom: {
        padding: 10,
        borderBottomWidth: 0.4,
        borderBottomColor: '#FFF'
    },
    cardBottomText: {
        marginBottom: 10,
        color: '#FFF',
        fontSize: 20,
        fontFamily: Fonts.serif,
    }
})