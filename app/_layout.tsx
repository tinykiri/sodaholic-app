import store from '@/store/store';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider as TinyBaseProvider, useCreatePersister } from 'tinybase/ui-react';

import UnitToggle from '@/components/unit-toggle';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [fontsLoaded] = useFonts({
    'Silkscreen': require('@/assets/fonts/Silkscreen-Regular.ttf'),
    'Silkscreen-Bold': require('@/assets/fonts/Silkscreen-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useCreatePersister(
    store,
    (store) =>
      createExpoSqlitePersister(store, SQLite.openDatabaseSync('sodaholic.db')),
    [],
    async (persister) => {
      await persister.load();
      await persister.startAutoSave();
      setReady(true);
    }
  );

  if (!fontsLoaded) return null;

  return (
    <TinyBaseProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <UnitToggle />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: true,
              headerTitleAlign: 'center',
              headerTitle: 'Sodaholic',
              headerTitleStyle: { fontFamily: 'Silkscreen-Bold' },
              headerRight: () => {
                return <UnitToggle />;
              },
            }}
          />
          <Stack.Screen name="unit-toggle" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </TinyBaseProvider>
  );
}
