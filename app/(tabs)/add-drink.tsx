import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import store from '@/store/store';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function AddNewDrink() {
  const [inputValue, setInputValue] = useState('');

  const handleAddNewDrink = (e: any) => {
    store.addRow('drinks', { name: inputValue })
    setInputValue('');
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Add Drink</Text>
        <TextInput
          style={{ width: 300, height: 40, borderColor: 'gray', borderWidth: 1 }}
          placeholder='Name'
          value={inputValue}
          onChangeText={setInputValue}
        />
        <Button title="Add" onPress={handleAddNewDrink} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

});
