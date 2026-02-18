import CalendarHeatmap from '@/components/CalendarHeatmap';
import Wrap from '@/components/Wrap';
import store from '@/store/store';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRow, useRowIds, useValue } from 'tinybase/ui-react';

function DrinkItem({ id }: { id: string }) {
  const unit = useValue('unit_preferences', store);
  const drink = useRow('drinks', id);

  const volume = typeof drink.volume_ml === 'number' ? drink.volume_ml : 0;

  console.log('-------unit', unit);
  console.log('-------drinkAmount', volume);

  const displayValue = unit === 'oz'
    ? (volume / 29.57).toFixed(1)
    : volume;

  return (
    <View>
      {/* <Pressable onPress={() => store.delRow('drinks', id)}> */}
      <Text style={{ color: 'red', fontSize: 20 }}>
        {drink.name}
      </Text>
      <Text style={{ color: 'red', fontSize: 20 }}>
        {displayValue} {unit === 'oz' ? 'oz' : 'ml'}
      </Text>
      <Text style={{ color: 'red', fontSize: 20 }}>
        {drink.category_of_drink}
      </Text>
      {/* </Pressable> */}
    </View>
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
        <ScrollView>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.content}>
              {/* heatmap content */}
              <View>
                <Text style={styles.title}>Calendar Heatmap</Text>
                <CalendarHeatmap />
              </View>

              {/* recent drinks */}
              <View>
                <Text style={styles.title}>Recent Drinks (you can press to delete)</Text>
                <View style={styles.recentDrinks}>
                  {drinksIds.map(id =>
                    <DrinkItem
                      key={id}
                      id={id}
                    />
                  )}
                </View>
              </View>
              {/* wraps */}
              <View>
                <Text style={styles.title}>Wraps</Text>
                <Wrap />
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>

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
    paddingHorizontal: 16,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginBottom: 20,
  },
  recentDrinks: {
    gap: 12
  }
});