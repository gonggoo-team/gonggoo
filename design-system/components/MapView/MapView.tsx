/**
 * MapView Component
 *
 * 지도를 표시하는 플레이스홀더 컴포넌트입니다.
 * 추후 실제 지도 라이브러리로 교체할 수 있습니다.
 *
 * Figma: 거래 정보 섹션
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import type { MapViewProps } from './MapView.types';

export const MapView: React.FC<MapViewProps> = ({
  latitude,
  longitude,
  address,
  height = 200,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: theme.colors.surface.env.disabled, // #D9D9D9
        },
      ]}
    >
      <Text
        style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.surface.texticon.onnormal.text.midEmp,
        }}
      >
        지도 (추후 구현)
      </Text>
      {address && (
        <Text
          style={{
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.surface.texticon.onnormal.text.midEmp,
            marginTop: 8,
          }}
        >
          {address}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
