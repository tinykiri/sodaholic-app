import BubblesBackground from '@/components/BubblesBackground';
import CalendarHeatmap from '@/components/CalendarHeatmap';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import DrinkItem from '@/components/DrinkItem';
import Wrap from '@/components/Wrap';
import { useWrapData } from '@/hooks/useWrapData';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRowIds } from 'tinybase/ui-react';


export default function HomeScreen() {
  const drinksIds = useRowIds('drinks');
  const wrap = useWrapData();

  return (
    <View style={styles.container}>
      <BubblesBackground />
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
            <Wrap
              previews={wrap.previews}
              formatVolume={wrap.formatVolume}
            />
          </View>

          {/* category breakdown */}
          {wrap.stats.categories.length > 0 && (
            <View>
              <Text style={styles.title}>Breakdown</Text>
              <CategoryBreakdown
                categories={wrap.stats.categories}
                drinkCount={wrap.stats.drinkCount}
                formatVolume={wrap.formatVolume}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Silkscreen-Bold',
    color: '#F5F5F7',
    marginBottom: 20,
  },
  recentDrinks: {
    gap: 12,
  }
});
