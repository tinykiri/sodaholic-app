import store, { ML_PER_OZ } from "@/store/store";
import { useState } from "react";
import { Image, ImageSourcePropType, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRow, useValue } from "tinybase/ui-react";

const CATEGORY_IMAGES: Record<string, ImageSourcePropType> = {
  'Classic Soda': require('@/assets/images/classic.png'),
  'Zero/Diet': require('@/assets/images/zero-diet.png'),
  'Energy': require('@/assets/images/energy.png'),
  'Sparkling Water': require('@/assets/images/sparkling.png'),
  'Other': require('@/assets/images/other.png'),
};

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DrinkItem({ id }: { id: string }) {
  const unit = useValue('unit_preferences', store);
  const drink = useRow('drinks', id);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const volume = typeof drink.volume_ml === 'number' ? drink.volume_ml : 0;
  const displayValue = unit === 'oz'
    ? (volume / ML_PER_OZ).toFixed(1)
    : volume;

  const dateStr = formatDate(typeof drink.date_of_creation === 'string' ? drink.date_of_creation : '');
  const category = typeof drink.category_of_drink === 'string' ? drink.category_of_drink : 'Other';
  const categoryImage = CATEGORY_IMAGES[category] ?? CATEGORY_IMAGES['Other'];

  return (
    <>
      <Pressable onPress={() => setConfirmVisible(true)} style={styles.container}>
        <View style={styles.content}>
          <Image source={categoryImage} style={styles.categoryImage} resizeMode="contain" />
          <Text style={styles.name} numberOfLines={1}>{drink.name ?? 'Unknown'}</Text>
          <Text style={styles.volume}>
            {displayValue} {unit === 'oz' ? 'oz' : 'ml'}
          </Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
      </Pressable>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setConfirmVisible(false)}>
          <View style={styles.dialog} onStartShouldSetResponder={() => true}>
            <Text style={styles.dialogTitle}>Delete Drink</Text>
            <Text style={styles.dialogMessage}>
              Are you sure you want to delete "{drink.name}"?
            </Text>
            <View style={styles.dialogButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setConfirmVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  store.delRow('drinks', id);
                  setConfirmVisible(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
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
    width: 110,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  categoryImage: {
    width: 48,
    height: 48,
  },
  name: {
    color: '#F5F5F7',
    fontSize: 11,
    fontFamily: 'Silkscreen-Bold',
    textAlign: 'center',
  },
  volume: {
    color: '#FF9248',
    fontSize: 12,
    fontFamily: 'Silkscreen-Bold',
  },
  date: {
    color: '#636366',
    fontSize: 9,
    fontFamily: 'Silkscreen',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: 280,
    backgroundColor: '#1C1C1E',
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  dialogTitle: {
    color: '#F5F5F7',
    fontSize: 16,
    fontFamily: 'Silkscreen-Bold',
  },
  dialogMessage: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: 'Silkscreen',
    textAlign: 'center',
    lineHeight: 18,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#3A3A3C',
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
  },
  cancelText: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: 'Silkscreen-Bold',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
    backgroundColor: '#FF6600',
    alignItems: 'center',
  },
  deleteText: {
    color: '#E5E5E7',
    fontSize: 12,
    fontFamily: 'Silkscreen-Bold',
  },
});
