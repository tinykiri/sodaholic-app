import CalendarHeatmap from '@/components/CalendarHeatmap';
import DrinkItem from '@/components/DrinkItem';
import Wrap from '@/components/Wrap';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRowIds } from 'tinybase/ui-react';


export default function HomeScreen() {
  const drinksIds = useRowIds('drinks');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/bg.png')}
        resizeMode='cover'
        style={{ flex: 1 }}
        imageStyle={{ opacity: 0.6 }}
      >
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.content}>
            {/* heatmap content */}
            <View>
              <Text style={styles.title}>Calendar Heatmap</Text>
              <CalendarHeatmap />
            </View>

            {/* recent drinks */}
            <View>
              <Text style={styles.title}>Recent Drinks (you can press to delete)</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.recentDrinks}
              >
                {drinksIds.map(id =>
                  <DrinkItem
                    key={id}
                    id={id}
                  />
                )}
              </ScrollView>
            </View>
            {/* wraps */}
            <View>
              <Text style={styles.title}>Wraps</Text>
              <Wrap />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3987cc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Silkscreen-Bold',
    color: '#000000',
    marginBottom: 20,
  },
  recentDrinks: {
    gap: 12,
  }
});