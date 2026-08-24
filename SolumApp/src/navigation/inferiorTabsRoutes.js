import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Start from '../screens/MainTabs/Start';
import Sensors from '../screens/MainTabs/Sensors';

import { styles } from './MainTabs.styles';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: true,

        // Cores
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#6B7280',

        // Menu inferior
        tabBarStyle: styles.tabBar,

        // Texto
        tabBarLabelStyle: styles.tabBarLabel,
      }}
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