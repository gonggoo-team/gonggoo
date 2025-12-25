/**
 * LocationButton Component
 *
 * 내 위치 버튼 컴포넌트
 * - 우측 하단 고정 위치
 * - 버튼 스타일링 (그림자, 원형)
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks';
import { Icon } from '../../../primitives/Icon';

interface LocationButtonProps {
  onPress: () => void;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.colors.surface.normal.bg1,
          shadowColor: theme.colors.border.midEmp,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="내 위치로 이동"
    >
      <Icon
        name="map-pin-fill"
        size={24}
        color={theme.colors.surface.brand.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
});
