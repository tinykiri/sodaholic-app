import store from '@/store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRow, useRowIds } from 'tinybase/ui-react';

console.log('store', store.getTables(), '-------');

function DrinkItem({ id }: { id: string }) {
  const drink = useRow('drinks', id);

  return (
    <Pressable onPress={() => store.delRow('drinks', id)}>
      <Text style={{ color: 'red', fontSize: 20 }}>{drink.name}</Text>
    </Pressable>
  )
}


export default function HomeScreen() {
  const drinksIds = useRowIds('drinks');


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
            {drinksIds.map(id => <DrinkItem key={id} id={id} />)}
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
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