import type { CategoryStat } from '@/hooks/useWrapData';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CategoryBreakdownProps {
  categories: CategoryStat[];
  drinkCount: number;
  formatVolume: (ml: number) => string;
}

export default function CategoryBreakdown({
  categories,
  drinkCount,
  formatVolume,
}: CategoryBreakdownProps) {
  if (categories.length === 0) return null;

  return (
    <View style={styles.container}>
      {categories.map((cat) => {
        const pct =
          drinkCount > 0 ? Math.round((cat.count / drinkCount) * 100) : 0;
        return (
          <View key={cat.name} style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.name}>{cat.name}</Text>
              <Text style={styles.detail}>
                {cat.count} {cat.count === 1 ? 'drink' : 'drinks'} · {formatVolume(cat.volume)}
              </Text>
            </View>
            <View style={styles.barArea}>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.max(pct, 3)}%` }]} />
              </View>
              <Text style={styles.pct}>{pct}%</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    backgroundColor: '#1C1C1E',
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
    padding: 14,
    gap: 12,
  },
  row: {
    gap: 6,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  name: {
    color: '#E5E5E7',
    fontSize: 12,
    fontFamily: 'Silkscreen-Bold',
  },
  detail: {
    color: '#636366',
    fontSize: 10,
    fontFamily: 'Silkscreen',
  },
  barArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#FF6600',
    borderRadius: 4,
  },
  pct: {
    color: '#8E8E93',
    fontSize: 11,
    fontFamily: 'Silkscreen',
    width: 36,
    textAlign: 'right',
  },
});
