import BubblesBackground from '@/components/BubblesBackground';
import CalendarHeatmap from '@/components/CalendarHeatmap';
import CategoryBreakdown from '@/components/CategoryBreakdown';
import DrinkItem from '@/components/DrinkItem';
import RecapBanner from '@/components/RecapBanner';
import Wrap from '@/components/Wrap';
import { getRangeForPeriod, useWrapData } from '@/hooks/useWrapData';
import store from '@/store/store';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRowIds, useValue } from 'tinybase/ui-react';


export default function HomeScreen() {
  const drinksIds = useRowIds('drinks');
  const wrap = useWrapData();
  const seenWeekly = useValue('wrap_seen_weekly', store) as string;

  useEffect(() => {
    if (seenWeekly === '') {
      const now = new Date();
      store.setValue('wrap_seen_weekly', getRangeForPeriod('weekly', now).start.toISOString());
      store.setValue('wrap_seen_monthly', getRangeForPeriod('monthly', now).start.toISOString());
      store.setValue('wrap_seen_yearly', getRangeForPeriod('yearly', now).start.toISOString());
    }
  }, [seenWeekly]);

  return (
    <View style={styles.container}>
      <BubblesBackground />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <RecapBanner />

          {/* heatmap content */}
          <View>
            <Text style={styles.title}>Calendar Heatmap</Text>
            <CalendarHeatmap />
          </View>

          {/* recent drinks */}
          <View>
            <Text style={styles.title}>Recent Drinks</Text>
            {drinksIds.length === 0 ? (
              <Text style={styles.emptyCaption}>
                Your entered drinks will appear here
              </Text>
            ) : (
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
            )}
          </View>

          {/* wraps */}
          <View>
            <Text style={styles.title}>Wraps</Text>
            <Wrap />
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
    paddingTop: 20,
    paddingBottom: 40,
    gap: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Silkscreen-Bold',
    color: '#F5F5F7',
    marginBottom: 20,
  },
  recentDrinks: {
    gap: 12,
  },
  emptyCaption: {
    color: '#636366',
    fontSize: 12,
    fontFamily: 'Silkscreen',
    textAlign: 'center',
    paddingVertical: 24,
  },
});
