import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Start from '../screens/MainTabs/Start';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Start"
        component={Start}
      />
    </Tab.Navigator>
  );
}