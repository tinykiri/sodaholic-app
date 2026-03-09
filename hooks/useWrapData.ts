import store, { ML_PER_OZ, TYPE_OF_DRINKS } from '@/store/store';
import { useCallback, useMemo, useState } from 'react';
import { useRowIds, useValue } from 'tinybase/ui-react';

export type Period = 'weekly' | 'monthly' | 'yearly';

export interface CategoryStat {
  name: string;
  count: number;
  volume: number;
}

export interface WrapStats {
  totalVolume: number;
  drinkCount: number;
  topCategory: string;
  topCount: number;
  categories: CategoryStat[];
}

export interface WrapRange {
  start: Date;
  end: Date;
  label: string;
}

function getWeekRange(date: Date): WrapRange {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - diff);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  const fmt = (dt: Date) =>
    `${dt.toLocaleString('default', { month: 'short' })} ${dt.getDate()}`;
  return { start, end, label: `${fmt(start)} – ${fmt(end)}` };
}

function getMonthRange(date: Date): WrapRange {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start,
    end,
    label: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
  };
}

function getYearRange(date: Date): WrapRange {
  const start = new Date(date.getFullYear(), 0, 1);
  const end = new Date(date.getFullYear(), 11, 31);
  return { start, end, label: `${date.getFullYear()}` };
}

export function getRangeForPeriod(period: Period, date: Date): WrapRange {
  if (period === 'weekly') return getWeekRange(date);
  if (period === 'monthly') return getMonthRange(date);
  return getYearRange(date);
}

function navigatePeriod(date: Date, period: Period, direction: number): Date {
  if (period === 'weekly')
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 * direction);
  if (period === 'monthly')
    return new Date(date.getFullYear(), date.getMonth() + direction, 1);
  return new Date(date.getFullYear() + direction, date.getMonth(), 1);
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function computeStats(rowIds: string[], range: WrapRange): WrapStats {
  const startTs = startOfDay(range.start);
  const endTs = startOfDay(range.end) + 86400000; //  the number of milliseconds in 24 hours 

  let totalVolume = 0;
  let drinkCount = 0;
  const categoryCount: Record<string, number> = {};
  const categoryVolume: Record<string, number> = {};

  for (const id of rowIds) {
    const row = store.getRow('drinks', id);
    if (!row.date_of_creation) continue;
    const ts = new Date(row.date_of_creation as string).getTime();
    if (ts < startTs || ts >= endTs) continue;

    const vol = typeof row.volume_ml === 'number' ? row.volume_ml : 0;
    const cat = (row.category_of_drink as string) || 'Other';

    totalVolume += vol;
    drinkCount++;
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    categoryVolume[cat] = (categoryVolume[cat] || 0) + vol;
  }

  let topCategory = '';
  let topCount = 0;
  for (const cat of Object.keys(categoryCount)) {
    if (categoryCount[cat] > topCount) {
      topCount = categoryCount[cat];
      topCategory = cat;
    }
  }

  const categories = TYPE_OF_DRINKS
    .map((t) => ({
      name: t.value,
      count: categoryCount[t.value] || 0,
      volume: categoryVolume[t.value] || 0,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return { totalVolume, drinkCount, topCategory, topCount, categories };
}

export function useWrapData() {
  const [period, setPeriod] = useState<Period>('weekly');
  const [anchor, setAnchor] = useState(new Date());
  const rowIds = useRowIds('drinks', store);
  const unit = (useValue('unit_preferences', store) ?? 'ml') as string;

  const range = useMemo<WrapRange>(
    () => getRangeForPeriod(period, anchor),
    [period, anchor],
  );

  const stats = useMemo<WrapStats>(
    () => computeStats(rowIds, range),
    [rowIds, range],
  );

  const formatVolume = useCallback((ml: number) => {
    if (unit === 'oz') return `${(ml / ML_PER_OZ).toFixed(1)} oz`;
    if (ml >= 1000) return `${(ml / 1000).toFixed(1)}L`;
    return `${ml} ml`;
  }, [unit]);

  const selectPeriod = useCallback((p: Period) => {
    setPeriod(p);
    setAnchor(new Date());
  }, []);

  const goBack = useCallback(() => setAnchor((a) => navigatePeriod(a, period, -1)), [period]);
  const goForward = useCallback(() => setAnchor((a) => navigatePeriod(a, period, 1)), [period]);

  return { period, range, stats, formatVolume, selectPeriod, goBack, goForward };
}
