import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#1C1C1E',
          borderTopWidth: 3,
          borderTopColor: '#993D00',
          height: 80,
        },
        tabBarActiveTintColor: '#FFD60A',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontFamily: 'Silkscreen',
          fontSize: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-drink"
        options={{
          title: 'Add Drink',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.rectangle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
