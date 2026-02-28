import store from '@/store/store';
import MaskedView from '@react-native-masked-view/masked-view';
import React, { useMemo, useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRowIds } from 'tinybase/ui-react';

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const GAP = 1;
const CAN_ASPECT_RATIO = 1;

const getColor = (count: number): string => {
  if (count === 0) return '#161b22';
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

  const grid: (number | null)[][] = Array.from({ length: numWeeks }, () =>
    Array(7).fill(null)
  );

  for (let day = 1; day <= daysInMonth; day++) {
    const slotIndex = firstDayOfWeek + (day - 1);
    const weekIndex = Math.floor(slotIndex / 7);
    const dayIndex = slotIndex % 7;
    grid[weekIndex][dayIndex] = day;
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

  const onGridLayout = (e: LayoutChangeEvent) => {
    setGridWidth(e.nativeEvent.layout.width);
  };

  const cellWidth = gridWidth > 0 ? (gridWidth - (6 * GAP)) / 7 : 0;
  const cellHeight = cellWidth > 0 ? cellWidth / CAN_ASPECT_RATIO : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.arrow}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.monthLabel}>{monthLabel}</Text>
        </View>
        <TouchableOpacity onPress={goForward} style={styles.arrow}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridOuter} onLayout={onGridLayout}>
        {gridWidth > 0 && (
          <>
            <View style={styles.dayLabelsRow}>
              {DAY_LABELS.map((label, i) => (
                <View key={i} style={{ width: cellWidth, alignItems: 'center' }}>
                  <Text style={styles.dayLabelText}>{label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.gridContent}>
              {grid.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.gridRow}>
                  {week.map((day, dayIndex) => {
                    const count = day ? drinksByDay[day] || 0 : 0;
                    return (
                      <View key={dayIndex} style={{ width: cellWidth, height: cellHeight }}>
                        {day ? (
                          <>
                            <MaskedView
                              style={{ flex: 1 }}
                              maskElement={
                                <View style={{ backgroundColor: 'transparent', flex: 1 }}>
                                  <Image
                                    source={require('@/assets/images/can-heatmap-mask.png')}
                                    resizeMode="contain"
                                    style={{ width: '100%', height: '100%' }}
                                  />
                                </View>
                              }>
                              <View style={{ flex: 1, backgroundColor: getColor(count) }} />
                            </MaskedView>
                            <Image
                              source={require('@/assets/images/can-heatmap.png')}
                              resizeMode="contain"
                              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            />
                          </>
                        ) : (
                          <View style={{ flex: 1 }} />
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.legend}>
        <View style={{ flexDirection: 'row', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.streak, { color: '#000000' }]}>Streak:</Text>
          <View style={styles.streakNumberContainer}>
            <Text style={[styles.streak, { color: '#ffffff' }]}>{streak} {streak === 1 ? 'day' : 'days'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#010101',
    borderLeftWidth: 3,
    borderLeftColor: '#79acdc',
    borderTopWidth: 3,
    borderTopColor: '#79acdc',
    backgroundColor: '#3465a7',
    padding: 12,
    overflow: 'hidden',
    height: 390,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  streak: {
    fontSize: 14,
    fontFamily: 'Silkscreen',
    textAlign: 'center',
  },
  streakNumberContainer: {
    backgroundColor: '#cfeaf5',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 3,
    textAlign: 'center',
    padding: 2,
  },
  gridOuter: {
    width: '100%',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    gap: GAP,
    marginBottom: 8,
  },
  dayLabelText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Silkscreen',
    textAlign: 'center',
  },
  gridContent: {
    flexDirection: 'column',
    gap: GAP,
  },
  gridRow: {
    flexDirection: 'row',
    gap: GAP,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 4,
  },
  legendLabel: {
    color: '#000000',
    fontSize: 14,
    marginHorizontal: 4,
    fontFamily: 'Silkscreen',
  },
  legendBox: {
    marginTop: 3,
    width: 12,
    height: 12,
    borderRadius: 3
  },
});

export default CalendarHeatmap;