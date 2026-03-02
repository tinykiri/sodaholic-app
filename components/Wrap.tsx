import type { Period, PeriodPreview } from '@/hooks/useWrapData';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface WrapProps {
  previews: Record<Period, PeriodPreview>;
  formatVolume: (ml: number) => string;
}

function PreviewCard({
  label,
  period,
  drinkCount,
  totalVolume,
  topCategory,
  formatVolume,
}: {
  label: string;
  period: Period;
  drinkCount: number;
  totalVolume: number;
  topCategory: string;
  formatVolume: (ml: number) => string;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.preview}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/wrap-detail', params: { initialPeriod: period } })}
    >
      <Text style={styles.previewLabel}>{label}</Text>
      {drinkCount === 0 ? (
        <Text style={styles.previewEmpty}>--</Text>
      ) : (
        <>
          <Text style={styles.previewCount}>{drinkCount}</Text>
          <Text style={styles.previewUnit}>
            {drinkCount === 1 ? 'drink' : 'drinks'}
          </Text>
          <Text style={styles.previewVolume}>{formatVolume(totalVolume)}</Text>
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText} numberOfLines={1}>
              {topCategory}
            </Text>
          </View>
        </>
      )}
      <Text style={styles.previewTap}>Tap to open</Text>
    </TouchableOpacity>
  );
}

export default function Wrap({ previews, formatVolume }: WrapProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.previewRow}
    >
      {(['weekly', 'monthly', 'yearly'] as Period[]).map((p) => {
        const pv = previews[p];
        return (
          <PreviewCard
            key={p}
            label={p.charAt(0).toUpperCase() + p.slice(1)}
            period={p}
            drinkCount={pv.stats.drinkCount}
            totalVolume={pv.stats.totalVolume}
            topCategory={pv.stats.topCategory}
            formatVolume={formatVolume}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  previewRow: {
    gap: 10,
    paddingRight: 4,
  },
  preview: {
    width: 120,
    backgroundColor: '#1C1C1E',
    borderRadius: 6,
    padding: 12,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
    alignItems: 'center',
    gap: 2,
  },
  previewLabel: {
    color: '#FF9248',
    fontSize: 11,
    fontFamily: 'Silkscreen-Bold',
    marginBottom: 6,
  },
  previewEmpty: {
    color: '#3A3A3C',
    fontSize: 28,
    fontFamily: 'Silkscreen-Bold',
    marginVertical: 8,
  },
  previewCount: {
    color: '#F5F5F7',
    fontSize: 28,
    fontFamily: 'Silkscreen-Bold',
    lineHeight: 32,
  },
  previewUnit: {
    color: '#636366',
    fontSize: 9,
    fontFamily: 'Silkscreen',
  },
  previewVolume: {
    color: '#8E8E93',
    fontSize: 10,
    fontFamily: 'Silkscreen',
    marginTop: 4,
  },
  previewBadge: {
    backgroundColor: '#FF660025',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  previewBadgeText: {
    color: '#FF9248',
    fontSize: 8,
    fontFamily: 'Silkscreen-Bold',
  },
  previewTap: {
    color: '#48484A',
    fontSize: 8,
    fontFamily: 'Silkscreen',
    marginTop: 8,
  },
});
