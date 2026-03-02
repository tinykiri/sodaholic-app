import store from '@/store/store';
import MaskedView from '@react-native-masked-view/masked-view';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Directions, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRowIds } from 'tinybase/ui-react';

const COLS = 7;
const GAP = 2;

const getColor = (count: number): string => {
  if (count === 0) return '#3A2A1A';
  if (count === 1) return '#CC5200';
  if (count === 2) return '#FF6600';
  if (count === 3) return '#FF9248';
  return '#FFD60A';
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

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const MAX_ROWS = Math.ceil(31 / COLS);

  const rows = useMemo(() => {
    const totalSlots = MAX_ROWS * COLS;
    const result: (number | null)[][] = [];
    for (let i = 0; i < totalSlots; i += COLS) {
      const row: (number | null)[] = Array.from({ length: COLS }, (_, j) => {
        const day = i + j + 1;
        return day <= daysInMonth ? day : null;
      });
      result.push(row);
    }
    return result;
  }, [daysInMonth]);

  const monthLabel = new Date(year, month).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const goBack = useCallback(() => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }, [month]);

  const goForward = useCallback(() => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }, [month]);

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .runOnJS(true)
    .onEnd(() => goForward());

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .runOnJS(true)
    .onEnd(() => goBack());

  const swipeGesture = Gesture.Race(flingLeft, flingRight);

  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();

    const hasDrinksOn = (y: number, m: number, d: number) =>
      rowIds.some((id) => {
        const row = store.getRow('drinks', id);
        if (!row.date_of_creation) return false;
        const c = new Date(row.date_of_creation as string);
        return c.getFullYear() === y && c.getMonth() === m && c.getDate() === d;
      });

    const todayY = today.getFullYear();
    const todayM = today.getMonth();
    const todayD = today.getDate();

    if (hasDrinksOn(todayY, todayM, todayD)) count++;

    let d = new Date(todayY, todayM, todayD - 1);
    while (hasDrinksOn(d.getFullYear(), d.getMonth(), d.getDate())) {
      count++;
      d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
    }

    return count;
  }, [rowIds]);

  const onGridLayout = (e: LayoutChangeEvent) => {
    setGridWidth(e.nativeEvent.layout.width);
  };

  const cellWidth = gridWidth > 0 ? (gridWidth - (COLS - 1) * GAP) / COLS : 0;
  const cellHeight = cellWidth * 0.5;

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

      <GestureDetector gesture={swipeGesture}>
      <View>
      <View style={styles.gridOuter} onLayout={onGridLayout}>
        {gridWidth > 0 && cellWidth > 0 && (
          <View style={styles.gridContent}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {row.map((day, colIndex) => (
                  <View key={colIndex} style={{ width: cellWidth, height: cellHeight }}>
                    {day !== null && (
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
                          <View style={{ flex: 1, backgroundColor: getColor(drinksByDay[day] || 0) }} />
                        </MaskedView>
                        <Image
                          source={require('@/assets/images/can-heatmap.png')}
                          resizeMode="contain"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        />
                      </>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.legend}>
        <View style={{ flexDirection: 'row', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.streak, { color: '#E5E5E7' }]}>Streak:</Text>
          <View style={styles.streakNumberContainer}>
            <Text style={[styles.streak, { color: '#0A0A0A' }]}>{streak} {streak === 1 ? 'day' : 'days'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <Text style={styles.legendLabel}>Less</Text>
          {[0, 1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.legendBox, { backgroundColor: getColor(i) }]} />
          ))}
          <Text style={styles.legendLabel}>More</Text>
        </View>
      </View>
      </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9248',
    borderTopWidth: 3,
    borderTopColor: '#FF9248',
    backgroundColor: '#1C1C1E',
    padding: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    alignItems: 'center',
  },
  arrow: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  arrowText: {
    color: '#FF6600',
    fontSize: 22,
    fontWeight: '600',
    fontFamily: 'Silkscreen',
  },
  monthLabel: {
    color: '#F5F5F7',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Silkscreen-Bold',
  },
  streak: {
    fontSize: 11,
    fontFamily: 'Silkscreen',
    textAlign: 'center',
  },
  streakNumberContainer: {
    backgroundColor: '#FFD60A',
    borderWidth: 3,
    borderColor: '#993D00',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gridOuter: {
    width: '100%',
    marginTop: 6,
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
    marginTop: 8,
    gap: 4,
  },
  legendLabel: {
    color: '#8E8E93',
    fontSize: 10,
    marginHorizontal: 2,
    fontFamily: 'Silkscreen',
  },
  legendBox: {
    marginTop: 3,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default CalendarHeatmap;
