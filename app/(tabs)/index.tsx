import { LinearGradient } from 'expo-linear-gradient';
import * as SQLite from 'expo-sqlite';
import { Button, FlatList, ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { createMergeableStore } from 'tinybase/mergeable-store';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import { useCreateMergeableStore, useCreatePersister, useProvideStore, useRow, useRowIds, useStore } from 'tinybase/ui-react';

const TABLE_NAME = "tasks";
const TEXT_CELL = "text";
const DONE_CELL = "done";

function AddTask() {
  const store = useStore(TABLE_NAME);
  const handleAddTask = () => {
    store?.addRow(TABLE_NAME, {
      [TEXT_CELL]: getRandomTask(),
      [DONE_CELL]: false,
    });
  };
  return <Button title="Add Task" onPress={handleAddTask} />;
}

function TaskList() {
  const rowIds = useRowIds(TABLE_NAME, TABLE_NAME);
  return (
    <FlatList
      data={rowIds}
      renderItem={({ item: id }) => <TaskRow id={id} />}
    />
  )
}

function TaskRow({ id }: { id: string }) {
  const row = useRow(TABLE_NAME, id, TABLE_NAME);
  const store = useStore(TABLE_NAME);
  return (
    <Pressable
      style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      onPress={() => store?.delRow(TABLE_NAME, id)}
    >
      <Text style={{ color: 'white' }}>{id} - {row?.[TEXT_CELL]}</Text>
    </Pressable>
  )
}

export default function HomeScreen() {
  const store = useCreateMergeableStore(() => createMergeableStore());

  useCreatePersister(store, (store) =>
    createExpoSqlitePersister(store, SQLite.openDatabaseSync('sodaholic.db')),
    [],
    (persister) => persister.load().then(persister.startAutoSave)
  );
  useProvideStore(TABLE_NAME, store);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5AC8FB', '#2459D8']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ImageBackground
        source={require('@/assets/images/bg.png')}
        resizeMode='cover'
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.content}>
            <Text style={styles.title}>Sodaholic</Text>
            <AddTask />
            <TaskList />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const getRandomTask = () => {
  const tasts = ["Do the laundry", "Buy groceries", "Clean the house", "Finish the project", "Call a friend"];
  return tasts[Math.floor(Math.random() * tasts.length)];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  }
});