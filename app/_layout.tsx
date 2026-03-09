import store from '@/store/store';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
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
SystemUI.setBackgroundColorAsync('#000000');

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
    if (fontsLoaded && ready) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, ready]);

  useCreatePersister(
    store,
    (store) =>
      createExpoSqlitePersister(store, SQLite.openDatabaseSync('sodaholic.db')),
    [],
    async (persister) => {
      try {
        await persister.load();
        await persister.startAutoSave();
      } catch (e) {
        console.error('Failed to load persisted data:', e);
      } finally {
        setReady(true);
      }
    }
  );

  if (!fontsLoaded || !ready) return <View style={{ flex: 1, backgroundColor: '#000000' }} />;

  return (
    <TinyBaseProvider store={store}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
        <Stack>
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
        </Stack>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </TinyBaseProvider>
  );
}
