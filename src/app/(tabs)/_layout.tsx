import { Tabs } from "expo-router";
import { 
    Home, 
    Car, 
    Users, 
    Map, 
    User 
} from 'lucide-react-native';
import { colors } from "@/constants/colors";
import { FONTS } from "@/constants/fonts";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#0F0F0F',
                borderTopColor: '#222',
                borderTopWidth: 1,
                height: 90,
                paddingBottom: 8,
                paddingTop: 8,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: '#666',
            tabBarLabelStyle: {
                fontFamily: FONTS.Montserrat.bold,
                fontSize: 11,
            },
        }}>
            <Tabs.Screen 
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Home color={color} size={size} />
                    )
                }}
            />
            <Tabs.Screen 
                name="analysis"
                options={{
                    title: 'Mia',
                    tabBarIcon: ({ color, size }) => (
                        <Car color={color} size={size} />
                    )
                }}
            />

            <Tabs.Screen 
                name="comunidade" 
                options={{
                    title: 'Comunidade',
                    tabBarIcon: ({ color, size }) => (
                        <Users color={color} size={size} />
                    )
                }}
            />

            <Tabs.Screen 
                name="mapa" 
                options={{
                    title: 'Mapa',
                    tabBarIcon: ({ color, size }) => (
                        <Map color={color} size={size} />
                    )
                }}
            />

            <Tabs.Screen 
                name="profile" 
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size }) => (
                        <User color={color} size={size}/>
                    )
                }}
            />
        </Tabs>
    );
}