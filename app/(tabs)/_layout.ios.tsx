
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="food" name="food">
        <Icon sf="fork.knife" />
        <Label>Food</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="water" name="water">
        <Icon sf="drop.fill" />
        <Label>Water</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="activity" name="activity">
        <Icon sf="figure.walk" />
        <Label>Activity</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="mood" name="mood">
        <Icon sf="face.smiling" />
        <Label>Mood</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
