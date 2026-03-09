import PixelCircle from '@/components/PixelCircle';
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
      <PixelCircle
        size={snappedSize}
        color="rgba(255, 102, 0, 0.06)"
        borderColor="rgba(255, 102, 0, 0.08)"
        pixelSize={PX}
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
