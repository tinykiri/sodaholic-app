import { useWrapData, type Period } from '@/hooks/useWrapData';
import * as Sharing from 'expo-sharing';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewShot from 'react-native-view-shot';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 64;
const STORY_ASPECT = 16 / 9;
const CARD_HEIGHT = CARD_WIDTH * STORY_ASPECT;

const PERIOD_DAYS: Record<Period, string> = {
  weekly: '7',
  monthly: '30',
  yearly: '365',
};

export default function WrapDetailScreen() {
  const { initialPeriod } = useLocalSearchParams<{ initialPeriod: string }>();
  const { period, range, stats, formatVolume, selectPeriod, goBack, goForward } =
    useWrapData();
  const [sharing, setSharing] = useState(false);
  const cardRef = useRef<ViewShot>(null);

  useEffect(() => {
    if (initialPeriod && ['weekly', 'monthly', 'yearly'].includes(initialPeriod)) {
      selectPeriod(initialPeriod as Period);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!cardRef.current?.capture) return;
    setSharing(true);
    try {
      const uri = await cardRef.current.capture();
      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Sharing not available', 'Sharing is not supported on this device.');
        return;
      }
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Share your Sodaholic wrap',
        UTI: 'public.png',
      });
    } catch {
      Alert.alert('Error', 'Could not capture or share the card.');
    } finally {
      setSharing(false);
    }
  }, []);

  const periodLabel = period.charAt(0).toUpperCase() + period.slice(1);

  return (
    <View style={styles.screen}>
      {/* Period tabs */}
      <View style={styles.tabs}>
        {(['weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.tab, period === p && styles.tabActive]}
            onPress={() => selectPeriod(p)}
          >
            <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={goBack} style={styles.arrow}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.navLabel}>{range.label}</Text>
        <TouchableOpacity onPress={goForward} style={styles.arrow}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Story card */}
      <View style={styles.cardWrapper}>
        <ViewShot
          ref={cardRef}
          options={{
            format: 'png',
            quality: 1,
            result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile',
          }}
        >
          <View style={[styles.card, { height: CARD_HEIGHT }]}>
            <View style={styles.cardDecoTop} />
            <View style={styles.cardDecoBottom} />

            <View style={styles.cardHeader}>
              <Text style={styles.cardBrand}>SODAHOLIC</Text>
              <View style={styles.cardPeriodPill}>
                <Text style={styles.cardPeriodPillText}>
                  {periodLabel} Wrap
                </Text>
              </View>
              <Text style={styles.cardDate}>{range.label}</Text>
            </View>

            {stats.drinkCount === 0 ? (
              <View style={styles.cardEmpty}>
                <Text style={styles.cardEmptyDays}>{PERIOD_DAYS[period]}</Text>
                <Text style={styles.cardEmptyLabel}>days</Text>
                <Text style={styles.cardEmptyText}>No drinks logged</Text>
                <Text style={styles.cardEmptySubtext}>for this period</Text>
              </View>
            ) : (
              <View style={styles.cardBody}>
                <View style={styles.heroSection}>
                  <Text style={styles.heroNumber}>{stats.drinkCount}</Text>
                  <Text style={styles.heroUnit}>
                    {stats.drinkCount === 1 ? 'drink' : 'drinks'}
                  </Text>
                </View>

                <View style={styles.volumeCard}>
                  <Text style={styles.volumeLabel}>Total Volume</Text>
                  <Text style={styles.volumeValue}>
                    {formatVolume(stats.totalVolume)}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.topSection}>
                  <Text style={styles.topSectionLabel}>Most Consumed</Text>
                  <View style={styles.topBadge}>
                    <Text style={styles.topBadgeText}>{stats.topCategory}</Text>
                  </View>
                  <Text style={styles.topMeta}>
                    {stats.topCount}{' '}
                    {stats.topCount === 1 ? 'drink' : 'drinks'} ·{' '}
                    {formatVolume(
                      stats.categories.find(
                        (c) => c.name === stats.topCategory,
                      )?.volume ?? 0,
                    )}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.cardFooter}>
              <View style={styles.footerLine} />
              <Text style={styles.footerText}>sodaholic</Text>
            </View>
          </View>
        </ViewShot>
      </View>

      {/* Share button */}
      <TouchableOpacity
        style={[styles.shareButton, sharing && styles.shareButtonDisabled]}
        onPress={handleShare}
        disabled={sharing}
        activeOpacity={0.7}
      >
        <Text style={styles.shareButtonText}>
          {sharing ? 'Saving...' : 'Share to Story'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
  },
  tabActive: {
    backgroundColor: '#FF6600',
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 11,
    fontFamily: 'Silkscreen-Bold',
  },
  tabTextActive: {
    color: '#0A0A0A',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  arrow: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  arrowText: {
    color: '#FF6600',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Silkscreen',
  },
  navLabel: {
    color: '#F5F5F7',
    fontSize: 13,
    fontFamily: 'Silkscreen-Bold',
    textAlign: 'center',
  },
  cardWrapper: {
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 6,
    backgroundColor: '#111111',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
    justifyContent: 'space-between',
  },
  cardDecoTop: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#FF660015',
  },
  cardDecoBottom: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FF920815',
  },
  cardHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  cardBrand: {
    color: '#FF6600',
    fontSize: 24,
    fontFamily: 'Silkscreen-Bold',
    letterSpacing: 4,
  },
  cardPeriodPill: {
    marginTop: 8,
    backgroundColor: '#FF660020',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF660040',
  },
  cardPeriodPillText: {
    color: '#FF9248',
    fontSize: 10,
    fontFamily: 'Silkscreen-Bold',
  },
  cardDate: {
    color: '#636366',
    fontSize: 10,
    fontFamily: 'Silkscreen',
    marginTop: 6,
  },
  cardEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmptyDays: {
    color: '#3A3A3C',
    fontSize: 64,
    fontFamily: 'Silkscreen-Bold',
  },
  cardEmptyLabel: {
    color: '#3A3A3C',
    fontSize: 14,
    fontFamily: 'Silkscreen',
    marginTop: -4,
  },
  cardEmptyText: {
    color: '#636366',
    fontSize: 13,
    fontFamily: 'Silkscreen-Bold',
    marginTop: 16,
  },
  cardEmptySubtext: {
    color: '#48484A',
    fontSize: 10,
    fontFamily: 'Silkscreen',
    marginTop: 4,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  heroNumber: {
    color: '#FF9248',
    fontSize: 56,
    fontFamily: 'Silkscreen-Bold',
    lineHeight: 64,
  },
  heroUnit: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: 'Silkscreen',
    marginTop: -2,
  },
  volumeCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 12,
  },
  volumeLabel: {
    color: '#636366',
    fontSize: 8,
    fontFamily: 'Silkscreen',
    marginBottom: 3,
    letterSpacing: 2,
  },
  volumeValue: {
    color: '#F5F5F7',
    fontSize: 20,
    fontFamily: 'Silkscreen-Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    marginBottom: 12,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  topSectionLabel: {
    color: '#636366',
    fontSize: 8,
    fontFamily: 'Silkscreen',
    letterSpacing: 2,
    marginBottom: 6,
  },
  topBadge: {
    backgroundColor: '#FF6600',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 2,
    borderColor: '#CC5200',
  },
  topBadgeText: {
    color: '#0A0A0A',
    fontSize: 14,
    fontFamily: 'Silkscreen-Bold',
  },
  topMeta: {
    color: '#636366',
    fontSize: 9,
    fontFamily: 'Silkscreen',
    marginTop: 6,
  },
  cardFooter: {
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 6,
  },
  footerLine: {
    width: 36,
    height: 2,
    backgroundColor: '#2C2C2E',
    borderRadius: 1,
    marginBottom: 8,
  },
  footerText: {
    color: '#3A3A3C',
    fontSize: 9,
    fontFamily: 'Silkscreen',
    letterSpacing: 3,
  },
  shareButton: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: '#FF6600',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    color: '#0A0A0A',
    fontSize: 14,
    fontFamily: 'Silkscreen-Bold',
    letterSpacing: 1,
  },
});
