import store from "@/store/store";
import { Pressable, StyleSheet, Text, View, } from "react-native";
import { useValue } from "tinybase/ui-react";

export default function UnitToggle() {
  const unit = useValue('unit_preferences', store) || 'ml';

  const toggleUnit = () => {
    const nextUnit = unit === 'ml' ? 'oz' : 'ml';
    store.setValue('unit_preferences', nextUnit);
  };

  return (
    <Pressable style={styles.container} onPress={toggleUnit}>
      <View style={[styles.unitValueContainer, unit === 'ml' && styles.active]}>
        <Text style={[styles.label, unit === 'ml' && styles.activeText]}>ML</Text>
      </View>
      <View style={[styles.unitValueContainer, unit === 'oz' && styles.active]}>
        <Text style={[styles.label, unit === 'oz' && styles.activeText]}>OZ</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  unitValueContainer: {
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#3A3A3C',
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: '#48484A',
  },
  active: {
    backgroundColor: '#FFD60A',
    borderColor: '#993D00',
  },
  label: {
    fontFamily: 'Silkscreen',
    color: '#8E8E93',
    fontSize: 12,
  },
  activeText: {
    color: '#0A0A0A',
  },
});
