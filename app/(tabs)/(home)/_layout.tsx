
import { Platform, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { router } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: Platform.OS === 'ios',
          title: 'Home',
          headerLargeTitle: false,
          headerTransparent: false,
          headerBlurEffect: 'systemMaterial',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log('Mood button pressed');
                router.push('/mood-log-modal');
              }}
              style={{ 
                padding: 8,
                marginRight: 4,
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol
                ios_icon_name="face.smiling"
                android_material_icon_name="mood"
                size={26}
                color={colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
