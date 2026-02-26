import store from '@/store/store';
import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRowIds } from 'tinybase/ui-react';

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];
const GRID_HEIGHT = 140;
const GAP = 4;
const DAY_LABEL_WIDTH = 30;
const NUM_ROWS = 7;

const getColor = (count: number): string => {
  if (count === 0) return 'rgba(255, 255, 255, 0.68)';
  if (count === 1) return '#0e4429';
  if (count === 2) return '#006d32';
  if (count === 3) return '#26a641';
  return '#39d353';
};

const CalendarHeatmap = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [gridWidth, setGridWidth] = useState(0);

  const rowIds = useRowIds('drinks', store);

  const drinksByDay = useMemo(() => {
    const map: Record<number, number> = {};
    for (const id of rowIds) {
      const row = store.getRow('drinks', id);
      if (!row.date_of_creation) continue;
      const d = new Date(row.date_of_creation as string);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        map[day] = (map[day] || 0) + 1;
      }
    }
    return map;
  }, [year, month, rowIds]);

  const monthLabel = new Date(year, month).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const goBack = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };

  const goForward = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (() => {
    const d = new Date(year, month, 1).getDay();
    return d === 0 ? 6 : d - 1;
  })();

  const totalSlots = firstDayOfWeek + daysInMonth;
  const numWeeks = Math.ceil(totalSlots / 7);

  const grid: (number | null)[][] = Array.from({ length: 7 }, () =>
    Array(numWeeks).fill(null)
  );

  for (let day = 1; day <= daysInMonth; day++) {
    const slotIndex = firstDayOfWeek + (day - 1);
    grid[slotIndex % 7][Math.floor(slotIndex / 7)] = day;
  }

  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();

    const hasDrinksOn = (year: number, month: number, day: number) =>
      rowIds.some((id) => {
        const row = store.getRow('drinks', id);
        if (!row.date_of_creation) return false;
        const c = new Date(row.date_of_creation as string);
        return c.getFullYear() === year && c.getMonth() === month && c.getDate() === day;
      });

    const todayY = today.getFullYear();
    const todayM = today.getMonth();
    const todayD = today.getDate();

    if (hasDrinksOn(todayY, todayM, todayD)) {
      count++;
    }

    let d = new Date(todayY, todayM, todayD - 1);
    while (hasDrinksOn(d.getFullYear(), d.getMonth(), d.getDate())) {
      count++;
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    }

    if (count === 0) {
      d = new Date(todayY, todayM, todayD - 1);
      while (hasDrinksOn(d.getFullYear(), d.getMonth(), d.getDate())) {
        count++;
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
      }
    }

    return count;
  }, [rowIds]);

  const cellHeight = (GRID_HEIGHT - GAP * (NUM_ROWS - 1)) / NUM_ROWS;
  const cellWidth = gridWidth > 0
    ? (gridWidth - GAP * (numWeeks - 1)) / numWeeks
    : 0;

  const onGridLayout = (e: LayoutChangeEvent) => {
    setGridWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.arrow}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
          <Text style={styles.subtitle}>Streak: {streak} {streak === 1 ? 'day' : 'days'}</Text>
        </View>
        <TouchableOpacity onPress={goForward} style={styles.arrow}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.gridOuter, { height: GRID_HEIGHT }]}>
        <View style={[styles.dayLabelsCol, { width: DAY_LABEL_WIDTH }]}>
          {DAY_LABELS.map((label, i) => (
            <View key={i} style={{ height: cellHeight, justifyContent: 'center' }}>
              <Text style={styles.dayLabelText}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.gridContent} onLayout={onGridLayout}>
          {gridWidth > 0 &&
            grid.map((row, dayIndex) => (
              <View key={dayIndex} style={styles.gridRow}>
                {row.map((day, weekIndex) => {
                  const count = day ? drinksByDay[day] || 0 : 0;
                  return (
                    <View
                      key={weekIndex}
                      style={{
                        width: cellWidth,
                        height: cellHeight,
                        borderRadius: Math.min(cellWidth, cellHeight) * 0.2,
                        backgroundColor:
                          day !== null ? getColor(count) : 'transparent',
                      }}
                    />
                  );
                })}
              </View>
            ))}
        </View>
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less</Text>
        {[0, 1, 2, 3, 4].map(i => (
          <View
            key={i}
            style={[styles.legendBox, { backgroundColor: getColor(i) }]}
          />
        ))}
        <Text style={styles.legendLabel}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(189, 189, 189)',
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 6,
    padding: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerCenter: {
    alignItems: 'center'
  },
  arrow: {
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  arrowText: {
    color: '#000000',
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'Silkscreen',
  },
  monthLabel: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Silkscreen-Bold',
  },
  subtitle: {
    color: '#000000',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Silkscreen',
  },
  gridOuter: {
    flexDirection: 'row',
    gap: GAP,
  },
  dayLabelsCol: {
    justifyContent: 'space-between',
  },
  dayLabelText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Silkscreen',
  },
  gridContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 14,
    gap: 4,
  },
  legendLabel: {
    color: '#000000',
    fontSize: 10,
    marginHorizontal: 4,
    fontFamily: 'Silkscreen',
  },
  legendBox: { width: 12, height: 12, borderRadius: 3 },
});

export default CalendarHeatmap;