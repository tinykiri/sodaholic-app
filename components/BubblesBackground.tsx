import React, { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUBBLE_COUNT = 20;
const PX = 6;

interface Bubble {
  id: number;
  size: number;
  x: number;
  startY: number;
  delay: number;
  duration: number;
}

function PixelBubble({ size, color, borderColor }: { size: number; color: string; borderColor: string }) {
  const rows = Math.ceil(size / PX);
  const r = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      {Array.from({ length: rows }, (_, i) => {
        const y = (i + 0.5) * PX - r;
        const half = Math.sqrt(Math.max(0, r * r - y * y));
        const w = Math.round((half * 2) / PX) * PX;
        if (w <= 0) return null;
        const isEdge = i === 0 || i === rows - 1 ||
          Math.round((Math.sqrt(Math.max(0, r * r - ((i + 1.5) * PX - r) ** 2)) * 2) / PX) * PX !== w ||
          Math.round((Math.sqrt(Math.max(0, r * r - ((i - 0.5) * PX - r) ** 2)) * 2) / PX) * PX !== w;

        return (
          <View key={i} style={{ width: w, height: PX, flexDirection: 'row' }}>
            {isEdge ? (
              <>
                <View style={{ width: PX, height: PX, backgroundColor: borderColor }} />
                <View style={{ flex: 1, height: PX, backgroundColor: color }} />
                {w > PX && (
                  <View style={{ width: PX, height: PX, backgroundColor: borderColor }} />
                )}
              </>
            ) : (
              <>
                <View style={{ width: PX, height: PX, backgroundColor: borderColor }} />
                <View style={{ flex: 1, height: PX, backgroundColor: color }} />
                <View style={{ width: PX, height: PX, backgroundColor: borderColor }} />
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

function AnimatedBubbleView({ bubble }: { bubble: Bubble }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      bubble.delay,
      withRepeat(
        withTiming(-SCREEN_HEIGHT - bubble.size, {
          duration: bubble.duration,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      bubble.delay,
      withRepeat(
        withTiming(1, {
          duration: bubble.duration * 0.1,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const snappedSize = Math.round(bubble.size / PX) * PX;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: bubble.x,
          bottom: -snappedSize,
          width: snappedSize,
          height: snappedSize,
        },
        animatedStyle,
      ]}
    >
      <PixelBubble
        size={snappedSize}
        color="rgba(255, 102, 0, 0.06)"
        borderColor="rgba(255, 102, 0, 0.08)"
      />
    </Animated.View>
  );
}

export default function BubblesBackground() {
  const bubbles = useMemo<Bubble[]>(() =>
    Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
      id: i,
      size: 20 + Math.random() * 60,
      x: Math.random() * SCREEN_WIDTH,
      startY: 0,
      delay: Math.random() * 8000,
      duration: 10000 + Math.random() * 12000,
    })),
    [],
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {bubbles.map((b) => (
        <AnimatedBubbleView key={b.id} bubble={b} />
      ))}
    </View>
  );
}
