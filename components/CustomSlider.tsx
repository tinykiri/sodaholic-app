import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { clamp, runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const HAPTIC_STEP = 50;

const TRACK_HEIGHT = 300;
const THUMB_SIZE = 30;
const TRAVEL_DIST = TRACK_HEIGHT - THUMB_SIZE;

interface CustomSliderProps {
  value: number;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void;
}

export default function CustomSlider({
  value,
  min = 0,
  max = 2000,
  onValueChange
}: CustomSliderProps) {

  const translateY = useSharedValue(0);
  const context = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const lastHapticValue = useSharedValue(-1);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  useEffect(() => {
    if (isDragging.value) return;

    const safeValue = isNaN(value) ? 500 : value;
    const range = max - min;
    const ratio = (max - safeValue) / range;
    const newPosition = clamp(ratio * TRAVEL_DIST, 0, TRAVEL_DIST);

    translateY.value = newPosition;
  }, [value, max, min]);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      context.value = translateY.value;
    })
    .onUpdate((e) => {
      const newPos = clamp(context.value + e.translationY, 0, TRAVEL_DIST);
      translateY.value = newPos;

      const ratio = newPos / TRAVEL_DIST;
      const calculatedValue = max - ratio * (max - min);

      if (lastHapticValue.value === -1 || Math.abs(calculatedValue - lastHapticValue.value) >= HAPTIC_STEP) {
        lastHapticValue.value = calculatedValue;
        runOnJS(triggerHaptic)();
      }

      if (onValueChange) {
        runOnJS(onValueChange)(Math.round(calculatedValue));
      }
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.track}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <Image
            source={require('@/assets/images/slider-thumb.png')}
            style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 6,
    height: TRACK_HEIGHT,
    backgroundColor: '#3A3A3C',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    left: -THUMB_SIZE / 2 + 3,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
});