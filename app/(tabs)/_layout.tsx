
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'food',
      route: '/(tabs)/food',
      icon: 'restaurant',
      label: 'Food',
    },
    {
      name: 'water',
      route: '/(tabs)/water',
      icon: 'water-drop',
      label: 'Water',
    },
    {
      name: 'activity',
      route: '/(tabs)/activity',
      icon: 'directions-run',
      label: 'Activity',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="food" name="food" />
        <Stack.Screen key="water" name="water" />
        <Stack.Screen key="activity" name="activity" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={380} />
    </>
  );
}
