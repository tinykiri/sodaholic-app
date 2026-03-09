import { getRangeForPeriod, type Period } from '@/hooks/useWrapData';
import store from '@/store/store';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useValue } from 'tinybase/ui-react';

const SEEN_KEYS: Record<Period, 'wrap_seen_weekly' | 'wrap_seen_monthly' | 'wrap_seen_yearly'> = {
  weekly: 'wrap_seen_weekly',
  monthly: 'wrap_seen_monthly',
  yearly: 'wrap_seen_yearly',
};

export default function RecapBanner() {
  const router = useRouter();
  const seenWeekly = useValue('wrap_seen_weekly', store) as string;
  const seenMonthly = useValue('wrap_seen_monthly', store) as string;
  const seenYearly = useValue('wrap_seen_yearly', store) as string;

  const pending = useMemo(() => {
    const now = new Date();
    const periods: Period[] = ['weekly', 'monthly', 'yearly'];
    const seen: Record<Period, string> = {
      weekly: seenWeekly,
      monthly: seenMonthly,
      yearly: seenYearly,
    };

    for (const p of periods) {
      const currentStart = getRangeForPeriod(p, now).start.toISOString();
      if (seen[p] !== '' && seen[p] !== currentStart) {
        return p;
      }
    }
    return null;
  }, [seenWeekly, seenMonthly, seenYearly]);

  if (!pending) return null;

  const handlePress = () => {
    const now = new Date();
    const currentStart = getRangeForPeriod(pending, now).start.toISOString();
    store.setValue(SEEN_KEYS[pending], currentStart);
    router.push({ pathname: '/wrap-detail', params: { initialPeriod: pending } });
  };

  return (
    <TouchableOpacity style={styles.banner} activeOpacity={0.8} onPress={handlePress}>
      <Text style={styles.bannerText}>
        Your {pending} recap is ready, check it out!
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FF6600',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
  },
  bannerText: {
    color: '#E5E5E7',
    fontSize: 11,
    fontFamily: 'Silkscreen-Bold',
    textAlign: 'center',
  },
});
