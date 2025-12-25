/**
 * CustomMarker Component
 *
 * 커스텀 마커 컴포넌트
 * - 브랜드 컬러 사용
 * - map-pin-fill 아이콘 + 원형 배경
 * - 그림자 효과
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks';
import { Icon } from '../../../primitives/Icon';

export const CustomMarker: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.markerCircle,
          {
            backgroundColor: theme.colors.surface.brand.primary,
            shadowColor: theme.colors.border.midEmp,
          },
        ]}
      >
        <Icon
          name="map-pin-fill"
          size={24}
          color={theme.colors.surface.texticon.onnormal.text.white}
        />
      </View>
      <View
        style={[
          styles.markerPin,
          {
            borderTopColor: theme.colors.surface.brand.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.24,
    shadowRadius: 8,
    elevation: 5,
  },
  markerPin: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
});
