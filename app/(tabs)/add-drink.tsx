import CustomSlider from '@/components/CustomSlider';
import store, { TYPE_OF_DRINKS } from '@/store/store';
import { useState } from 'react';
import { Button, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useValue } from 'tinybase/ui-react';

export default function AddNewDrink() {
  const unit = useValue('unit_preferences', store);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  const drinkVolume = useValue('volume_ml', store);
  const drinkCategory = useValue('category_of_drink', store) ?? TYPE_OF_DRINKS[0].value;

  let currentVolume = typeof drinkVolume === 'number' ? drinkVolume : 500;

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

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={{ flex: 1, gap: 20 }}>

            {/* bottle area */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '55%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 36 }}>
                <Text>*bottle area  with svg*</Text>
                <CustomSlider
                  value={currentVolume}
                  onValueChange={setVolume}
                />
              </View>
              <View>

                {/* info area */}
                <View style={{ alignItems: 'center', gap: 10 }}>
                  <View style={{ borderWidth: 3, borderColor: 'black', width: 100, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 6 }}>
                    <Text>{displayValue} {unit === 'oz' ? 'oz' : 'ml'}</Text>
                  </View>
                  <Text style={error ? { color: 'red' } : {}}>
                    {error && <Text style={{ color: 'red' }}>*</Text>}
                    Drink Name
                  </Text>
                  <TextInput
                    style={[styles.input, { borderColor: error ? 'red' : 'black' }]}
                    placeholder='e.g. Tea'
                    value={inputValue}
                    onChangeText={(text) => {
                      setInputValue(text);
                      if (error) setError(false);
                    }}
                  />
                  <Text>Category</Text>
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
              <TouchableOpacity
                onPress={() => handleQuickAdd(355)}
                style={styles.quickAdd}
              >
                <Text style={styles.quickAddText}>
                  12oz/355ml
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleQuickAdd(500)}
                style={styles.quickAdd}
              >
                <Text style={styles.quickAddText}>
                  16.9oz/500ml
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleQuickAdd(2000)}
                style={styles.quickAdd}
              >
                <Text style={styles.quickAddText}>
                  2L
                </Text>
              </TouchableOpacity>
            </View>

            <Button title="Save Drink" onPress={handleAddNewDrink} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 160,
    height: 40,
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 6
  },
  quickAdd: {
    width: 100,
    height: 100,
    borderRadius: 6,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  quickAddText: {
    fontSize: 16,
    color: 'white',
  }
});
