
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
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/mood-log-modal')}
              style={{ padding: 8 }}
            >
              <IconSymbol
                ios_icon_name="face.smiling"
                android_material_icon_name="mood"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
