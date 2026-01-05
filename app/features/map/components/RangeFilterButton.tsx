/**
 * RangeFilterButton Component
 *
 * 지도 화면에서 동네 범위를 설정하는 버튼
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme, Icon } from '@/design-system';

interface RangeFilterButtonProps {
  /** 현재 범위 (km) */
  range: number;
  /** 클릭 핸들러 */
  onPress: () => void;
}

export const RangeFilterButton: React.FC<RangeFilterButtonProps> = ({
  range,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.normal.bg1,
          shadowColor: theme.colors.surface.texticon.onnormal.text.black,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon
        name="map-pin-fill"
        size={16}
        color={theme.colors.surface.texticon.onnormal.icon.black}
      />
      <Text
        style={[
          styles.text,
          { color: theme.colors.surface.texticon.onnormal.text.highEmp },
        ]}
      >
        {range}km
      </Text>
      <Icon
        name="drop"
        size={16}
        color={theme.colors.surface.texticon.onnormal.icon.black}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
