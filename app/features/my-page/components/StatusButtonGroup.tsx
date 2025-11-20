import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system/hooks';
import type { StatusButtonItem } from '@/app/shared/types';
import { StatusButton } from './StatusButton';

interface StatusButtonGroupProps {
  items: StatusButtonItem[];
}

export function StatusButtonGroup({ items }: StatusButtonGroupProps) {
  const { theme } = useTheme();

  const getPosition = (index: number): 'first' | 'middle' | 'last' => {
    if (index === 0) return 'first';
    if (index === items.length - 1) return 'last';
    return 'middle';
  };

  return (
    <View style={[
      styles.container,
      {
        borderColor: theme.colors.border.midEmp,
        backgroundColor: theme.colors.surface.normal.white,
      }
    ]}>
      {items.map((item, index) => (
        <StatusButton
          key={item.id}
          iconName={item.iconName as any}
          label={item.label}
          onPress={item.onPress}
          position={getPosition(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
