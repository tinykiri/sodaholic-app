import BubblesBackground from '@/components/BubblesBackground';
import CustomSlider from '@/components/CustomSlider';
import store, { ML_PER_OZ, TYPE_OF_DRINKS } from '@/store/store';
import MaskedView from '@react-native-masked-view/masked-view';
import { Canvas, Group, Rect, Skia } from '@shopify/react-native-skia';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useValue } from 'tinybase/ui-react';

const MAX_VOLUME = 2000;
const WAVE_HEIGHT = 3;
const WAVE_COUNT = 2;
const PIXEL_SIZE = 2;
const BOTTLE_DIMS = { width: 120, height: 300 };
const TILT = 0.06;

export default function AddNewDrink() {
  const unit = useValue('unit_preferences', store);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveScale = useSharedValue(1);
  const saveAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const drinkVolume = useValue('volume_ml', store);
  const drinkCategory = useValue('category_of_drink', store) ?? TYPE_OF_DRINKS[0].value;

  let currentVolume = typeof drinkVolume === 'number' ? drinkVolume : 500;

  const fillPercentage = Math.min((currentVolume / MAX_VOLUME) * 100, 100);
  const fillPercent = fillPercentage / 100;

  const waveSvgPath = useMemo(() => {
    const w = BOTTLE_DIMS.width;
    const steps = Math.ceil(w / PIXEL_SIZE);
    let path = '';

    for (let i = 0; i <= steps; i++) {
      const x = i * PIXEL_SIZE;
      const t = x / w;
      const rawY = Math.sin(t * WAVE_COUNT * 2 * Math.PI) * WAVE_HEIGHT;
      const y = Math.round(rawY / PIXEL_SIZE) * PIXEL_SIZE;
      if (i === 0) {
        path += `M${x},${y}`;
      } else {
        const prevRawY = Math.sin(((i - 1) * PIXEL_SIZE / w) * WAVE_COUNT * 2 * Math.PI) * WAVE_HEIGHT;
        const prevY = Math.round(prevRawY / PIXEL_SIZE) * PIXEL_SIZE;
        path += `H${x}`;
        if (y !== prevY) path += `V${y}`;
      }
    }

    path += `V${BOTTLE_DIMS.height + WAVE_HEIGHT}`;
    path += `H0`;
    path += `Z`;

    return path;
  }, []);

  const waveX = useSharedValue(0);
  const fillSV = useSharedValue(fillPercent);

  useEffect(() => {
    waveX.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    fillSV.value = withTiming(fillPercent, { duration: 80 });
  }, [fillPercent]);

  const wavePath = useDerivedValue(() => {
    const p = Skia.Path.MakeFromSVGString(waveSvgPath);
    if (!p) return Skia.Path.Make();
    const tilt = (waveX.value * 2 - 1) * TILT;
    const m = Skia.Matrix();
    m.translate(BOTTLE_DIMS.width / 2, (1 - fillSV.value) * BOTTLE_DIMS.height - WAVE_HEIGHT);
    m.skew(0, tilt);
    m.translate(-BOTTLE_DIMS.width / 2, 0);
    p.transform(m);
    return p;
  });

  const displayValue = unit === 'oz'
    ? (currentVolume / ML_PER_OZ).toFixed(1)
    : currentVolume;

  const handleAddNewDrink = useCallback(() => {
    if (!inputValue.trim()) {
      setError(true);
      return;
    }
    setError(false);
    try {
      store.addRow('drinks', {
        name: inputValue,
        volume_ml: currentVolume,
        category_of_drink: drinkCategory,
        date_of_creation: new Date().toISOString(),
      });
      setInputValue('');
      store.setValue('volume_ml', 500);
      store.setValue('category_of_drink', TYPE_OF_DRINKS[0].value);
      setSaved(true);
      saveScale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
      setTimeout(() => setSaved(false), 1800);
    } catch (e) {
      console.error('Failed to save drink:', e);
    }
  }, [inputValue, currentVolume, drinkCategory]);

  const handleQuickAdd = useCallback((volume: number) => {
    store.setValue('volume_ml', volume);
  }, []);

  const setVolume = useCallback((val: number) => store.setValue('volume_ml', val), []);

  return (
    <View style={styles.container}>
      <BubblesBackground />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <View style={{ flex: 1, gap: 20 }}>

              {/* bottle area */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '55%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 36 }}>

                  <View style={{ width: BOTTLE_DIMS.width, height: BOTTLE_DIMS.height, position: 'relative' }}>

                    <MaskedView
                      style={{ flex: 1, height: '100%' }}
                      maskElement={
                        <View style={{ backgroundColor: 'transparent', flex: 1 }}>
                          <Image
                            source={require('@/assets/images/bottle-mask.png')}
                            style={{ ...BOTTLE_DIMS }}
                          />
                        </View>
                      }
                    >
                      <Canvas style={{ width: BOTTLE_DIMS.width, height: BOTTLE_DIMS.height }}>
                        <Group clip={wavePath}>
                          <Rect
                            x={0}
                            y={0}
                            width={BOTTLE_DIMS.width}
                            height={BOTTLE_DIMS.height}
                            color="#FF6600"
                          />
                        </Group>
                      </Canvas>
                    </MaskedView>

                    <Image
                      source={require('@/assets/images/slider-bottle.png')}
                      style={{ position: 'absolute', top: 0, left: 0, ...BOTTLE_DIMS }}
                    />
                  </View>

                  <CustomSlider
                    value={currentVolume}
                    onValueChange={setVolume}
                  />
                </View>
                <View style={{ width: '100%', marginLeft: 20 }}>

                  {/* info area */}
                  <View style={{ alignItems: 'center', gap: 10 }}>
                    <View style={styles.volumeDisplay}>
                      <Text style={styles.volumeDisplayText}>{displayValue}</Text>
                    </View>
                    <Text style={error ? { color: '#FF6600', fontFamily: 'Silkscreen' } : { color: '#E5E5E7', fontFamily: 'Silkscreen' }}>
                      {error && <Text style={{ color: '#FF6600', fontFamily: 'Silkscreen' }}>*</Text>}
                      Drink Name
                    </Text>
                    <TextInput
                      style={[styles.input, { borderColor: error ? '#FF6600' : '#3A3A3C', fontFamily: 'Silkscreen' }]}
                      placeholder='e.g. Tea'
                      placeholderTextColor='#6f6f70'
                      value={inputValue}
                      maxLength={20}
                      onChangeText={(text) => {
                        setInputValue(text);
                        if (error) setError(false);
                      }}
                    />
                    <Text style={{ fontFamily: 'Silkscreen', color: '#E5E5E7' }}>Category</Text>
                    <Dropdown
                      style={styles.input}
                      placeholderStyle={{ fontFamily: 'Silkscreen' }}
                      selectedTextStyle={{ fontFamily: 'Silkscreen', color: '#E5E5E7' }}
                      containerStyle={{ backgroundColor: '#2C2C2E' }}
                      itemTextStyle={{ fontFamily: 'Silkscreen', color: '#E5E5E7' }}
                      itemContainerStyle={{ backgroundColor: '#2C2C2E' }}
                      activeColor="#FF6600"
                      data={TYPE_OF_DRINKS}
                      onChange={(value) => store.setValue('category_of_drink', value.value)}
                      placeholder={TYPE_OF_DRINKS[0].label}
                      value={drinkCategory}
                      labelField="label"
                      valueField="value"
                    />
                  </View>

                </View>
              </View>

              {/* quick add */}
              <Text style={styles.title}>Quick Add</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <TouchableOpacity onPress={() => handleQuickAdd(355)} style={styles.quickAdd}>
                  <Image
                    source={require('@/assets/images/can-quick-btn.png')}
                    style={{ width: 70, height: 70 }}
                    resizeMode='contain'
                  />
                  <Text style={styles.quickAddText}>12oz/355ml</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQuickAdd(500)} style={styles.quickAdd}>
                  <Image
                    source={require('@/assets/images/bottle-500-quick-btn.png')}
                    style={{ width: 70, height: 70 }}
                    resizeMode='contain'
                  />
                  <Text style={styles.quickAddText}>16.9oz/500ml</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQuickAdd(2000)} style={styles.quickAdd}>
                  <Image
                    source={require('@/assets/images/bottle-2-quick-btn.png')}
                    style={{ width: 70, height: 70 }}
                    resizeMode='contain'
                  />
                  <Text style={styles.quickAddText}>2L</Text>
                </TouchableOpacity>
              </View>

              <Animated.View style={saveAnimStyle}>
                <TouchableOpacity onPress={handleAddNewDrink} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save Drink</Text>
                </TouchableOpacity>
              </Animated.View>
              {saved && (
                <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={styles.savedBanner}>
                  <Text style={styles.savedBannerText}>Drink saved!</Text>
                </Animated.View>
              )}
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Silkscreen-Bold',
    color: '#F5F5F7',
    textAlign: 'center',
  },
  volumeDisplay: {
    borderWidth: 3,
    borderColor: '#3A3A3C',
    width: 160,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#000000',
    padding: 2,
  },
  volumeDisplayText: {
    color: '#FF6600',
    fontSize: 44,
    fontFamily: 'Silkscreen-Bold',
  },
  input: {
    width: 160,
    height: 40,
    borderColor: '#3A3A3C',
    borderWidth: 3,
    borderRadius: 6,
    backgroundColor: '#2C2C2E',
    padding: 8,
    color: '#E5E5E7'
  },
  quickAdd: {
    gap: 4,
    width: 110,
    height: 110,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9248',
    borderTopWidth: 3,
    borderTopColor: '#FF9248',
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  quickAddText: {
    fontSize: 10,
    color: '#E5E5E7',
    fontFamily: 'Silkscreen',
  },
  saveButton: {
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9248',
    borderTopWidth: 3,
    borderTopColor: '#FF9248',
    backgroundColor: '#FF6600',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#F5F5F7',
    fontSize: 18,
    fontFamily: 'Silkscreen-Bold',
  },
  savedBanner: {
    backgroundColor: '#2C2C2E',
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#00C853',
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  savedBannerText: {
    color: '#00C853',
    fontSize: 14,
    fontFamily: 'Silkscreen-Bold',
  },
});