import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Start from '../screens/MainTabs/Start';
import Sensors from '../screens/MainTabs/Sensors';

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

          if (route.name === 'Start') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          }

          if (route.name === 'Sensors') {
            iconName = focused
              ? 'speedometer'
              : 'speedometer-outline';
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
        name="Start"
        component={Start}
      />

      <Tab.Screen
        name="Sensors"
        component={Sensors}
      />
    </Tab.Navigator>
  );
}
