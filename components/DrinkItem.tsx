import store from "@/store/store";
import { StyleSheet, Text, View } from "react-native";
import { useRow, useValue } from "tinybase/ui-react";

export default function DrinkItem({ id }: { id: string }) {
  const unit = useValue('unit_preferences', store);
  const drink = useRow('drinks', id);

  const volume = typeof drink.volume_ml === 'number' ? drink.volume_ml : 0;

  const displayValue = unit === 'oz'
    ? (volume / 29.57).toFixed(1)
    : volume;

  return (
    <View style={styles.container}>
      {/* <Pressable onPress={() => store.delRow('drinks', id)} style={{ width: 100, height: 100 }}> */}
      <View style={styles.content}>
        <Text style={styles.name}>{drink.name}</Text>
        <Text style={styles.detail}>
          {displayValue} {unit === 'oz' ? 'oz' : 'ml'}
        </Text>
        <Text style={styles.detail}>{drink.category_of_drink}</Text>
      </View>
      {/* </Pressable> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftWidth: 3,
    borderLeftColor: '#FF9248',
    borderTopWidth: 3,
    borderTopColor: '#FF9248',
    backgroundColor: '#1C1C1E',
    marginRight: 12,
  },
  content: {
    width: 100,
    height: 100,
    padding: 8,
    justifyContent: 'center',
  },
  name: {
    color: '#F5F5F7',
    fontSize: 14,
    fontFamily: 'Silkscreen-Bold',
  },
  detail: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: 'Silkscreen',
  },
});
