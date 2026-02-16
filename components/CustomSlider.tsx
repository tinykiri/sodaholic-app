import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { clamp, runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const TRACK_HEIGHT = 300;
const THUMB_SIZE = 40;

export default function CustomSlider({ min = 0, max = 2000, onValueChange }) {
  const translateY = useSharedValue(0);
  const offset = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onStart(() => {
      offset.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = clamp(offset.value + e.translationY, 0, TRACK_HEIGHT - THUMB_SIZE);
      const ratio = translateY.value / (TRACK_HEIGHT - THUMB_SIZE);
      const value = max - ratio * (max - min);
      if (onValueChange) {
        runOnJS(onValueChange)(Math.round(value));
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.track}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.thumb, thumbStyle, { width: THUMB_SIZE, height: THUMB_SIZE }]}>
          <Image
            source={require('@/assets/images/duck.png')}
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
    backgroundColor: '#1A1A1A',
    borderRadius: 3,
    justifyContent: 'flex-start',
  },
  thumb: {
    position: 'absolute',
    left: -THUMB_SIZE / 2 + 3,
  },
});