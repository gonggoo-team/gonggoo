/**
 * LocationFilterButton Component
 *
 * 지도 화면에서 동네를 선택하는 버튼
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useThrottledNavigation } from '@/app/shared/hooks/useThrottledNavigation';
import { useTheme, Icon } from '@/design-system';

interface LocationFilterButtonProps {
  /** 현재 선택된 동네 이름 */
  neighborhood: string;
  /** 클릭 핸들러 (커스텀 동작이 필요한 경우) */
  onPress?: () => void;
}

export const LocationFilterButton: React.FC<LocationFilterButtonProps> = ({
  neighborhood,
  onPress,
}) => {
  const { theme } = useTheme();
  const { push } = useThrottledNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      push('/neighborhood-setting');
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.normal.bg1,
          shadowColor: theme.colors.surface.texticon.onnormal.text.black,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          { color: theme.colors.surface.texticon.onnormal.text.highEmp },
        ]}
        numberOfLines={1}
      >
        {neighborhood}
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
