
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
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                console.log('Mood button pressed from header');
                router.push('/mood-log-modal');
              }}
              style={{ 
                padding: 8,
                marginRight: 8,
                backgroundColor: colors.primary,
                borderRadius: 20,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol
                ios_icon_name="face.smiling"
                android_material_icon_name="mood"
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
}
