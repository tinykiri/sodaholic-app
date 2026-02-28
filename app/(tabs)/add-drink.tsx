import BubblesBackground from '@/components/BubblesBackground';
import CustomSlider from '@/components/CustomSlider';
import store, { TYPE_OF_DRINKS } from '@/store/store';
import MaskedView from '@react-native-masked-view/masked-view';
import { useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useValue } from 'tinybase/ui-react';

const MAX_VOLUME = 2000;

export default function AddNewDrink() {
  const unit = useValue('unit_preferences', store);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  const drinkVolume = useValue('volume_ml', store);
  const drinkCategory = useValue('category_of_drink', store) ?? TYPE_OF_DRINKS[0].value;

  let currentVolume = typeof drinkVolume === 'number' ? drinkVolume : 500;

  const fillPercentage = Math.min((currentVolume / MAX_VOLUME) * 100, 100);

  const displayValue = unit === 'oz'
    ? (currentVolume / 29.57).toFixed(1)
    : currentVolume;

  const handleAddNewDrink = () => {
    if (!inputValue.trim()) {
      setError(true);
      return;
    }
    setError(false);
    store.addRow('drinks',
      {
        name: inputValue,
        volume_ml: currentVolume,
        category_of_drink: drinkCategory
      });
    setInputValue('');
    store.setValue('volume_ml', 500);
    store.setValue('category_of_drink', TYPE_OF_DRINKS[0].value);
  };

  const handleQuickAdd = (volume: number) => {
    store.setValue('volume_ml', volume);
  };

  const setVolume = (val: number) => store.setValue('volume_ml', val);

  const bottleDims = { width: 120, height: 300 };

  return (
    <View style={styles.container}>
      <BubblesBackground />
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <View style={{ flex: 1, gap: 20 }}>

              {/* bottle area */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '55%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 36 }}>

                  <View style={{ width: bottleDims.width, height: bottleDims.height, position: 'relative' }}>

                    <MaskedView
                      style={{ flex: 1, height: '100%' }}
                      maskElement={
                        <View style={{ backgroundColor: 'transparent', flex: 1 }}>
                          <Image
                            source={require('@/assets/images/bottle-mask.png')}
                            style={{ ...bottleDims }}
                          />
                        </View>
                      }
                    >
                      <View style={{ flex: 1, backgroundColor: 'transparent' }}>

                        <View
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: `${fillPercentage}%`,
                            backgroundColor: '#FF6600',
                          }}
                        />
                      </View>
                    </MaskedView>

                    <Image
                      source={require('@/assets/images/slider-bottle.png')}
                      style={{ position: 'absolute', top: 0, left: 0, ...bottleDims }}
                    />
                  </View>

                  <CustomSlider
                    value={currentVolume}
                    onValueChange={setVolume}
                  />
                </View>
                <View>

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
                      value={inputValue}
                      onChangeText={(text) => {
                        setInputValue(text);
                        if (error) setError(false);
                      }}
                    />
                    <Text style={{ fontFamily: 'Silkscreen', color: '#E5E5E7' }}>Category</Text>
                    <Dropdown
                      style={styles.input}
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

              <TouchableOpacity onPress={handleAddNewDrink} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Drink</Text>
              </TouchableOpacity>
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
    color: '#E5E5E7',
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
});