import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Start from '../screens/MainTabs/Start';
import Support from '../screens/MainTabs/Support';
import Profile from '../screens/MainTabs/Profile';
import Alarms from '../screens/MainTabs/Alarms';

import { styles, colors } from './MainTabs.styles';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // Menu inferior
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: insets.bottom + 12,
          },
        ],

        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIconStyle,

        // Cores
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,

        // Ícones
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          }

          if (route.name === 'Suporte') {
            iconName = focused
              ? 'help-circle'
              : 'help-circle-outline';
          }

          if (route.name === 'Perfil') {
            iconName = focused
              ? 'person'
              : 'person-outline';
          }

          if (route.name === 'Alarmes') {
            iconName = focused
              ? 'notifications'
              : 'notifications-outline';
          }
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={Start}
      />

      <Tab.Screen
        name="Alarmes"
        component={Alarms}
      />

      <Tab.Screen
        name="Perfil"
        component={Profile}
      />

      <Tab.Screen
        name="Suporte"
        component={Support}
      />
    </Tab.Navigator>
  );
}
