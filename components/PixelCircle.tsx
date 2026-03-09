import React from 'react';
import { View } from 'react-native';

interface PixelCircleProps {
  size: number;
  color: string;
  borderColor?: string;
  pixelSize?: number;
}

export default function PixelCircle({ size, color, borderColor, pixelSize = 10 }: PixelCircleProps) {
  const rows = Math.ceil(size / pixelSize);
  const r = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      {Array.from({ length: rows }, (_, i) => {
        const y = (i + 0.5) * pixelSize - r;
        const half = Math.sqrt(Math.max(0, r * r - y * y));
        const w = Math.round((half * 2) / pixelSize) * pixelSize;
        if (w <= 0) return null;

        if (!borderColor) {
          return (
            <View
              key={i}
              style={{ width: w, height: pixelSize, backgroundColor: color }}
            />
          );
        }

        const isEdge =
          i === 0 ||
          i === rows - 1 ||
          Math.round((Math.sqrt(Math.max(0, r * r - ((i + 1.5) * pixelSize - r) ** 2)) * 2) / pixelSize) * pixelSize !== w ||
          Math.round((Math.sqrt(Math.max(0, r * r - ((i - 0.5) * pixelSize - r) ** 2)) * 2) / pixelSize) * pixelSize !== w;

        return (
          <View key={i} style={{ width: w, height: pixelSize, flexDirection: 'row' }}>
            {isEdge ? (
              <>
                <View style={{ width: pixelSize, height: pixelSize, backgroundColor: borderColor }} />
                <View style={{ flex: 1, height: pixelSize, backgroundColor: color }} />
                {w > pixelSize && (
                  <View style={{ width: pixelSize, height: pixelSize, backgroundColor: borderColor }} />
                )}
              </>
            ) : (
              <>
                <View style={{ width: pixelSize, height: pixelSize, backgroundColor: borderColor }} />
                <View style={{ flex: 1, height: pixelSize, backgroundColor: color }} />
                <View style={{ width: pixelSize, height: pixelSize, backgroundColor: borderColor }} />
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}
