
import { Stack } from 'expo-router';
import { DataProvider } from '@/contexts/DataContext';

export default function RootLayout() {
  return (
    <DataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="transparent-modal" 
          options={{ 
            presentation: 'transparentModal',
            headerShown: false,
            animation: 'fade',
          }} 
        />
        <Stack.Screen 
          name="formsheet" 
          options={{ 
            presentation: 'formSheet',
            headerShown: false,
          }} 
        />
      </Stack>
    </DataProvider>
  );
}
