import store from "@/store/store";
import { Text, View } from "react-native";
import { useRow, useValue } from "tinybase/ui-react";

export default function DrinkItem({ id }: { id: string }) {
  const unit = useValue('unit_preferences', store);
  const drink = useRow('drinks', id);

  const volume = typeof drink.volume_ml === 'number' ? drink.volume_ml : 0;

  const displayValue = unit === 'oz'
    ? (volume / 29.57).toFixed(1)
    : volume;

  return (
    <View style={{ backgroundColor: 'blue', flexDirection: 'row', gap: 12 }}>
      {/* <Pressable onPress={() => store.delRow('drinks', id)} style={{ width: 100, height: 100 }}> */}
      <View style={{ width: 100, height: 100 }}>
        <Text style={{ color: 'red', fontSize: 20, fontFamily: 'Silkscreen' }}>
          {drink.name}
        </Text>
        <Text style={{ color: 'red', fontSize: 20, fontFamily: 'Silkscreen' }}>
          {displayValue} {unit === 'oz' ? 'oz' : 'ml'}
        </Text>
        <Text style={{ color: 'red', fontSize: 20, fontFamily: 'Silkscreen' }}>
          {drink.category_of_drink}
        </Text>
      </View>
      {/* </Pressable> */}
    </View>
  )
}