import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Start from '../screens/MainTabs/Start';
import Sensors from '../screens/MainTabs/Sensors';

import { styles, colors } from './MainTabs.styles';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIconStyle,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
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