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
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function CustomHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, backgroundColor: '#1C1C1E' }}>
      <View
        style={{
          height: 44,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flex: 1 }} />
        <Text style={{ fontFamily: 'Silkscreen-Bold', color: '#FF6600', fontSize: 17 }}>
          Sodaholic
        </Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <UnitToggle />
        </View>
      </View>
    </View>
  );
}

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
              header: () => <CustomHeader />,
            }}
          />
          <Stack.Screen
            name="wrap-detail"
            options={{
              presentation: 'modal',
              headerShown: false,
              contentStyle: { backgroundColor: '#0A0A0A' },
            }}
          />
          <Stack.Screen name="unit-toggle" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </TinyBaseProvider>
  );
}
