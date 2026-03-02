import store from "@/store/store";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRow, useValue } from "tinybase/ui-react";

export default function DrinkItem({ id }: { id: string }) {
  const unit = useValue('unit_preferences', store);
  const drink = useRow('drinks', id);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const volume = typeof drink.volume_ml === 'number' ? drink.volume_ml : 0;

  const displayValue = unit === 'oz'
    ? (volume / 29.57).toFixed(1)
    : volume;

  return (
    <>
      <Pressable onPress={() => setConfirmVisible(true)} style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.name}>{drink.name}</Text>
          <Text style={styles.detail}>
            {displayValue} {unit === 'oz' ? 'oz' : 'ml'}
          </Text>
          <Text style={styles.detail}>{drink.category_of_drink}</Text>
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
    width: 100,
    height: 100,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: '#F5F5F7',
    fontSize: 14,
    fontFamily: 'Silkscreen-Bold',
    marginBottom: 4,
  },
  detail: {
    color: '#8E8E93',
    fontSize: 10,
    fontFamily: 'Silkscreen',
    textAlign: 'center',
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
