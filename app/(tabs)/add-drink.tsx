import { Button, StyleSheet, TextInput, View } from 'react-native';

import CustomSlider from '@/components/CustomSlider';
import store from '@/store/store';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const SLIDER_HEIGHT = 300;

export default function AddNewDrink() {
  const [inputValue, setInputValue] = useState('');
  const [amount, setAmount] = useState(2000);

  const handleAddNewDrink = (e: any) => {
    store.addRow('drinks', { name: inputValue })
    setInputValue('');
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <CustomSlider
          onValueChange={(val) => setAmount(val)}
        />
        <TextInput
          style={{ width: 300, height: 40, borderColor: 'gray', borderWidth: 1 }}
          placeholder='Name'
          value={inputValue}
        />

        <Button title="Add" onPress={handleAddNewDrink} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: SLIDER_HEIGHT,
    height: 40,
    transform: [{ rotate: '-90deg' }],
  },
});
