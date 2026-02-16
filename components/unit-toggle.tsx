import store from "@/store/store";
import { Pressable, StyleSheet, Text, View, } from "react-native";
import { useValue } from "tinybase/ui-react";

export default function UnitToggle() {
  const unit = useValue('unit_preferences', store) || 'ml';


  const toggleUnit = () => {
    const nextUnit = unit === 'ml' ? 'oz' : 'ml';
    store.setValue('unit_preferences', nextUnit);
  };


  console.log('-------', unit, '-------');

  return (
    <Pressable style={styles.container} onPress={toggleUnit}>
      <View style={[styles.unitValueContainer, unit === 'ml' && styles.active]}>
        <Text style={unit === 'ml' ? { color: 'white' } : { color: 'grey' }}>ML</Text>
      </View>
      <View style={[styles.unitValueContainer, unit === 'oz' && styles.active]}>
        <Text style={unit === 'oz' ? { color: 'white' } : { color: 'grey' }}>OZ</Text>
      </View>
    </Pressable>
  )
}


const styles = StyleSheet.create({
  container: {
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  unitValueContainer: {
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: '#FF4B4B',
  },
});