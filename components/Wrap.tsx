import type { Period } from '@/hooks/useWrapData';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Wrap() {
  const router = useRouter();

  return (
    <View style={styles.row}>
      {(['weekly', 'monthly', 'yearly'] as Period[]).map((p) => (
        <TouchableOpacity
          key={p}
          style={styles.button}
          activeOpacity={0.7}
          onPress={() => router.push({ pathname: '/wrap-detail', params: { initialPeriod: p } })}
        >
          <Text style={styles.buttonText}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 6,
    paddingVertical: 14,
    borderWidth: 3,
    borderColor: '#993D00',
    borderLeftColor: '#FF9248',
    borderTopColor: '#FF9248',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FF9248',
    fontSize: 12,
    fontFamily: 'Silkscreen-Bold',
  },
});
