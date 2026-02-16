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
        {/* <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={2000}
          minimumTrackTintColor="#FF4B4B"
          maximumTrackTintColor="#1A1A1A"
          thumbImage={{
            uri: 'https://png.pngtree.com/png-vector/20230318/ourmid/pngtree-duck-poultry-animal-transparent-on-white-background-png-image_6653170.png'
          }}
          vertical={true}
        /> */}

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
