import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

import CardCarUser from "@/features/Home/components/CardCarUser";
import CardSuggestionsUser from "@/features/Home/components/CardSuggestionsUser";
import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; 

export default function HomeScreen() {
    const TestCard = [
        { id: '1', imageUrl: "https://firebasestorage.googleapis.com/v0/b/tunelab-348d7.firebasestorage.app/o/Cars%2Fnissan-gt-r-r35-565ps.jpg?alt=media&token=da283be0-511e-473a-87e6-61afa84e56fe", title: 'Nissan GT-R', subtitle: 'R35 Nismo', hp: '600hp'},
        { id: '2', imageUrl: "https://firebasestorage.googleapis.com/v0/b/tunelab-348d7.firebasestorage.app/o/Cars%2FBMW-M3-GTR-4-150x150.jpg?alt=media&token=f01ddb60-6aa5-470f-bb73-03a7e6b8872f", title: 'BMW', subtitle: 'M3 GTR', hp: '600hp'},
    ]

    const TestCard2 = [
        { id: '1', title: 'Stage 2 Remap', subtitle: '+85 HP'},
        { id: '2', title: 'Carbon Aero Kit', subtitle: 'Downforce Optimization'},
    ]

    const handleTest = () => {
        Alert.alert("Futuramente!")
    }
    const handleTest2 = () => {
        Alert.alert("Eu já nao disse FUTURAMENTE?!")
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerView}>
                <TouchableOpacity activeOpacity={0.8}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>ANALISAR MEU CARRO</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.flatListViewCars}>
                <Text style={styles.textsPrimary}>Meus carros</Text>

                <FlatList 
                    data={TestCard}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                    decelerationRate="fast"
                    snapToInterval={CARD_WIDTH + 16} 
                    renderItem={({ item }) => (
                        <CardCarUser 
                            title={item.title} 
                            subtitle={item.subtitle} 
                            hp={item.hp} 
                            imageUrl={item.imageUrl}
                            onPress={() => {handleTest()}}
                        />
                    )}
                />
            </View>

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
                           onPress={() => {handleTest2()}}
                        />
                    )}
                />
            </View>
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