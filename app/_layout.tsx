import store from '@/store/store';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider as TinyBaseProvider, useCreatePersister } from 'tinybase/ui-react';

import UnitToggle from '@/components/unit-toggle';
import * as SQLite from 'expo-sqlite';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  useCreatePersister(store, (store) =>
    createExpoSqlitePersister(store, SQLite.openDatabaseSync('sodaholic.db')),
    [],
    async (persister) => {
      await persister.load();
      await persister.startAutoSave();
    }
  );

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
