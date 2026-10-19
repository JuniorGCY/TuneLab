import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert, Linking, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { FONTS } from "@/constants/fonts";
import { colors } from "@/constants/colors";
import { useAuth } from '../../contexts/AuthContext';
import { RFValue } from 'react-native-responsive-fontsize';
import { Avatar } from '@/features/Home/components/AvatarUser';
import { useHomeData } from '@/features/Home/hooks/useHomeData';
import { displayName, displayTag, formatStat, statAccessibilityLabel } from '@/features/profile/utils/profileStats';

import {
    User,
    SlidersVertical,
    Bell,
    Settings,
    Headphones,
    FileText,
    LogOut,
    ChevronRight,
    Trash2,
    type LucideIcon,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const card_width = width * 0.42;

// Nome e foto vêm da conta Google (a API lê do token a cada login), então a edição é lá.
const GOOGLE_PERSONAL_INFO_URL = 'https://myaccount.google.com/personal-info';

type MenuItemProps = {
    icon: LucideIcon;
    title: string;
    onPress?: () => void;
    // Itens ainda não construídos ficam visíveis, mas desligados e marcados "Em breve",
    // para o grupo de teste não achar que o app está quebrado.
    comingSoon?: boolean;
};

const MenuItem = ({ icon: Icon, title, onPress, comingSoon = false }: MenuItemProps) => (
    <TouchableOpacity
        style={[styles.menuItem, comingSoon && styles.menuItemDisabled]}
        onPress={onPress}
        disabled={comingSoon}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={comingSoon ? `${title}, em breve` : title}
        accessibilityState={{ disabled: comingSoon }}
    >
        <View style={styles.menuItemLeft}>
            <View style={styles.iconContainer}>
                <Icon size={20} color={colors.primary} />
            </View>
            <Text style={styles.menuItemText}>{title}</Text>
        </View>
        {comingSoon ? (
            <Text style={styles.comingSoon}>Em breve</Text>
        ) : (
            <ChevronRight size={20} color="#666" />
        )}
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const router = useRouter();
    const { logout, dbUser } = useAuth();
    // Mesma fonte da Home: atualiza sempre que a aba ganha foco.
    const { carros, carsStatus, creditos } = useHomeData();

    const setupsSalvos = carsStatus === 'ready' ? carros.length : null;
    const tag = displayTag(dbUser?.tag);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log("Erro ao deslogar:", error);
        }
    };

    const handleEditProfile = () => {
        Alert.alert(
            'Editar perfil',
            'Seu nome e sua foto vêm da sua conta Google. Para alterar, edite na conta Google e entre de novo no TuneLab.',
            [
                { text: 'Agora não', style: 'cancel' },
                {
                    text: 'Abrir conta Google',
                    onPress: () => {
                        Linking.openURL(GOOGLE_PERSONAL_INFO_URL).catch(() =>
                            Alert.alert('Não foi possível abrir', 'Acesse myaccount.google.com pelo navegador.')
                        );
                    },
                },
            ]
        );
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <Avatar imageUrl={dbUser?.perfil_url} />
                    <Text style={styles.textHeader} accessibilityRole="header">{displayName(dbUser?.nome)}</Text>
                    {tag && <Text style={styles.subTextHeader}>{tag}</Text>}
                </View>

                <View style={styles.topCardsRow}>
                    <Pressable
                        style={({ pressed }) => [styles.cardContainer, pressed && styles.pressed]}
                        onPress={() => router.push('/(tabs)')}
                        accessibilityRole="button"
                        accessibilityLabel={statAccessibilityLabel('Setups salvos', setupsSalvos)}
                        accessibilityHint="Abre a garagem"
                    >
                        <Text style={styles.cardText}>Setups {'\n'}salvos</Text>
                        <Text style={styles.cardTextSub}>{formatStat(setupsSalvos)}</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [styles.cardContainer, pressed && styles.pressed]}
                        onPress={() => router.push('/buy-credits')}
                        accessibilityRole="button"
                        accessibilityLabel={statAccessibilityLabel('Análises disponíveis', creditos)}
                        accessibilityHint="Abre a compra de análises"
                    >
                        <Text style={styles.cardText}>Análises {'\n'}disponíveis</Text>
                        <Text style={styles.cardTextSub}>{formatStat(creditos)}</Text>
                    </Pressable>
                </View>

                <View style={styles.menuContainer}>
                    <MenuItem icon={User} title="Editar perfil" onPress={handleEditProfile} />
                    <MenuItem icon={SlidersVertical} title="Meus setups" onPress={() => router.push('/(tabs)')} />
                    <MenuItem icon={Bell} title="Notificações" comingSoon />
                    <MenuItem icon={Settings} title="Preferências" comingSoon />
                    <MenuItem icon={Headphones} title="Ajuda e suporte" comingSoon />
                    <MenuItem icon={FileText} title="Termos e privacidade" comingSoon />

                    <MenuItem icon={LogOut} title="Sair" onPress={handleLogout} />
                </View>

                <TouchableOpacity
                    style={styles.deleteAccount}
                    onPress={() => router.push('/delete-account')}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Excluir conta"
                    hitSlop={8}
                >
                    <Trash2 size={18} color="#FF6B6B" />
                    <Text style={styles.deleteAccountText}>Excluir conta</Text>
                </TouchableOpacity>
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
    pressed: {
        opacity: 0.7,
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
        minHeight: 44,
    },
    menuItemDisabled: {
        opacity: 0.5,
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
    },
    comingSoon: {
        fontSize: RFValue(11),
        fontFamily: FONTS.Montserrat.regular,
        color: '#999',
    },
    // Fora do menu e discreto: ação sem volta não fica ao lado das opções do dia a dia.
    deleteAccount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 44,
        marginHorizontal: 20,
        marginBottom: 24,
    },
    deleteAccountText: {
        fontSize: RFValue(13),
        fontFamily: FONTS.Montserrat.regular,
        color: '#FF6B6B',
    }
});
