import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { FONTS } from "@/constants/fonts";
import { colors } from "@/constants/colors";
import { useAuth } from '../../contexts/AuthContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { Avatar } from '@/features/Home/components/AvatarUser';



import { 
    User, 
    SlidersVertical, 
    Bell, 
    Settings, 
    Headphones, 
    FileText, 
    LogOut, 
    ChevronRight 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const card_width = width * 0.42; 

const MenuItem = ({ icon: Icon, title, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
                <Icon size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>{title}</Text>
        </View>
        <ChevronRight size={20} color="#666" />
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const { logout } = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error: any) {
            console.log("Erro ao deslogar:", error);
        }
    }
    const { dbUser } = useAuth()
    
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Avatar imageUrl={dbUser?.perfil_url}/>
                    <Text style={styles.textHeader}>{dbUser?.nome}!</Text>
                    <Text style={styles.subTextHeader}>{dbUser?.tag}!</Text>
                </View>

                <View style={styles.topCardsRow}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.cardText}>Meus {'\n'}carros</Text>
                        <Text style={styles.cardTextSub}>3</Text>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.cardText}>Setups {'\n'}Salvos</Text>
                        <Text style={styles.cardTextSub}>12</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    <MenuItem icon={User} title="Editar perfil" />
                    <MenuItem icon={SlidersVertical} title="Meus setups" />
                    <MenuItem icon={Bell} title="Notificações" />
                    <MenuItem icon={Settings} title="Preferências" />
                    <MenuItem icon={Headphones} title="Ajuda e suporte" />
                    <MenuItem icon={FileText} title="Termos e privacidade" />
                    
                    <MenuItem icon={LogOut} title="Sair" onPress={handleLogout} />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0F0F0F',
        paddingBottom: 40,
    },
    headerView: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    textHeader: {
        fontSize: RFValue(16),
        fontFamily: FONTS.Montserrat.regular,
        color: '#FFF',
        marginTop: 12,
    },
    subTextHeader: {
        fontSize: RFValue(12),
        fontFamily: FONTS.Montserrat.regular,
        color: '#94a3b8',
        marginTop: 4,
    },
    topCardsRow: {
        flexDirection: 'row', 
        marginHorizontal: 20, 
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cardContainer: {
        width: card_width,
        height: 120,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#1C1C1E',
        borderRadius: 16,
    },
    cardText: {
        fontSize: RFValue(13),
        fontFamily: FONTS.Montserrat.regular,
        color: '#FFF',
        marginBottom: 10,
    },
    cardTextSub: {
        fontSize: RFValue(20),
        fontFamily: FONTS.Montserrat.regular,
        color: '#FFF',
    },
    menuContainer: {
        flex: 1, 
        marginHorizontal: 20,
        marginTop: 30,
        paddingBottom: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        marginBottom: 8,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 107, 0, 0.1)', 
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuItemText: {
        fontSize: RFValue(14),
        fontFamily: FONTS.Montserrat.regular,
        color: '#FFF',
    }
});