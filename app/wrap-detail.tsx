import PixelCircle from '@/components/PixelCircle';
import { useWrapData, type Period } from '@/hooks/useWrapData';
import { CATEGORY_COLORS, CATEGORY_TITLES } from '@/store/store';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  }, [initialPeriod, selectPeriod]);

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

  const categoryTitle = useMemo(() => {
    if (!stats.topCategory) return '';
    const titles = CATEGORY_TITLES[stats.topCategory] ?? CATEGORY_TITLES['Other'];
    const seed = `${range.start.toISOString()}:${stats.topCategory}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash + seed.charCodeAt(i)) | 0;
    }
    const idx = Math.abs(hash) % titles.length;
    return titles[idx];
  }, [stats.topCategory, range.start]);

  return (
    <View style={styles.screen}>
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

      <View style={styles.nav}>
        <TouchableOpacity onPress={goBack} style={styles.arrow}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.navLabel}>{range.label}</Text>
        <TouchableOpacity onPress={goForward} style={styles.arrow}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

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
            <View style={styles.cardDecoTop}>
              <PixelCircle size={180} color="#FF660015" />
            </View>
            <View style={styles.cardDecoBottom}>
              <PixelCircle size={140} color="#FF920815" />
            </View>

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
                  <Text style={styles.heroLabel}>TOTAL:</Text>
                  <Text style={styles.heroNumber}>
                    {formatVolume(stats.totalVolume)}
                  </Text>
                </View>

                <View style={[styles.phraseBar, {
                  backgroundColor: CATEGORY_COLORS[stats.topCategory] || '#3d0530',
                  borderColor: CATEGORY_COLORS[stats.topCategory] || '#3d0530',
                }]}>
                  <Text style={styles.phraseBarText}>{categoryTitle}</Text>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.drinkCount}</Text>
                    <Text style={styles.statLabel}>
                      {stats.drinkCount === 1 ? 'drink' : 'drinks'}
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.topCount}</Text>
                    <Text style={styles.statLabel}>{stats.topCategory}</Text>
                  </View>
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
    color: '#E5E5E7',
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
    overflow: 'hidden',
  },
  cardDecoBottom: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 140,
    height: 140,
    overflow: 'hidden',
  },
  cardHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  cardBrand: {
    color: '#FF6600',
    fontSize: 32,
    fontFamily: 'Silkscreen-Bold',
    letterSpacing: 4,
  },
  cardPeriodPill: {
    marginTop: 8,
    backgroundColor: '#FF660020',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF660040',
  },
  cardPeriodPillText: {
    color: '#FF9248',
    fontSize: 16,
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
    marginBottom: 14,
  },
  heroLabel: {
    color: '#F5F5F7',
    fontSize: 18,
    fontFamily: 'Silkscreen-Bold',
    letterSpacing: 2,
    marginBottom: 2,
  },
  heroNumber: {
    color: '#F5F5F7',
    fontSize: 48,
    fontFamily: 'Silkscreen-Bold',
    lineHeight: 56,
  },
  phraseBar: {
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 3,
    alignItems: 'center',
    marginBottom: 14,
  },
  phraseBarText: {
    color: '#F5F5F7',
    fontSize: 16,
    fontFamily: 'Silkscreen-Bold',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#F5F5F7',
    fontSize: 22,
    fontFamily: 'Silkscreen-Bold',
    lineHeight: 28,
  },
  statLabel: {
    color: '#636366',
    fontSize: 9,
    fontFamily: 'Silkscreen',
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 2,
    height: 30,
    backgroundColor: '#2C2C2E',
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
    color: '#E5E5E7',
    fontSize: 14,
    fontFamily: 'Silkscreen-Bold',
    letterSpacing: 1,
  },
});
