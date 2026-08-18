import { View,Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { router } from "expo-router";

import CardCarUser from "@/features/Home/components/CardCarUser";
import CardSuggestionsUser from "@/features/Home/components/CardSuggestionsUser";
import { colors } from "@/constants/colors";

export default function HomeScreen() {
    const goBack = () => {
        router.replace('/(auth)/login')
    }

    const { width } = Dimensions.get('window');
    const CARD_WIDTH = width * 0.20;

    const TestCard = [
        { id: '1', title: 'Nissan GT-R', subtitle: 'R35 Nismo', hp: '600hp'},
        { id: '2', title: 'Card 2', subtitle: 'Promoção imperdível', hp: '600hp'},
        { id: '3', title: 'Card 3', subtitle: 'Novo lançamento', hp: '600hp'},
    ]

    return (
        <View style={styles.container}>

            <View style={styles.headerView}>
                <TouchableOpacity>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>ANALISAR MEU CARRO</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Talvez no futuro se a demandar por performance exigir, trocar pelo FlashList. */}
            <View style={styles.flatListViewCars}>
                <Text style={styles.textsPrimary}>Meus carros</Text>

                <FlatList 
                    data={TestCard}
                    renderItem={({ item }) => (
                        <CardCarUser 
                        title={item.title} 
                        subtitle={item.subtitle} 
                        hp={item.hp} 
                        onPress={() => {console.log("foi")}} 
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                    decelerationRate="fast"
                    snapToInterval={CARD_WIDTH + 16}
                />
            </View>

            

             <TouchableOpacity onPress={goBack}>
                    <Text style={{color: '#FFF', margin: 10}}>Ir para tela Login</Text>
            </TouchableOpacity>

            <View style={styles.flatListViewSuggestions}>
                <Text style={styles.textsPrimary}>Sugestoes para voce</Text>

                <FlatList
                    data={TestCard}
                    renderItem={({item }) => (
                        <CardSuggestionsUser 
                           title={item.title}
                           subtitle={item.subtitle}
                           onPress={() => {console.log("foi")}}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                    decelerationRate={"fast"}
                    snapToInterval={CARD_WIDTH + 16}
                   />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#000'
    },
    headerView: {
        marginTop: 80,
        marginHorizontal: 25
    },
    button: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 12
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textsPrimary: {
        fontSize: 30,
        color: '#FFF',
        alignSelf: 'flex-start',
        marginBottom: 16,
    },
    flatListViewCars: {
        paddingTop: 30,
    },
    scrollContainer: {
        paddingHorizontal: 16,
    },
    flatListViewSuggestions: {
        paddingTop: 40,
    }
})