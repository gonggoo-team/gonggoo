import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system/hooks';
import { Icon } from '@/design-system/primitives';
import type { IconName } from '@/design-system/primitives/Icon/types';

interface StatusButtonProps {
  iconName: IconName;
  label: string;
  onPress: () => void;
  position: 'first' | 'middle' | 'last';
}

export function StatusButton({ iconName, label, onPress, position }: StatusButtonProps) {
  const { theme } = useTheme();

  // Position-based border radius
  const getBorderRadius = () => {
    switch (position) {
      case 'first':
        return { borderTopLeftRadius: 12, borderBottomLeftRadius: 12 };
      case 'last':
        return { borderTopRightRadius: 12, borderBottomRightRadius: 12 };
      default:
        return {};
    }
  };

  // Internal divider line rendering
  const showRightLine = position === 'first';
  const showLeftLine = position === 'last';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        getBorderRadius(),
        {
          backgroundColor: theme.colors.surface.normal.bg1,
        },
      ]}
    >
      <View style={styles.content}>
        <Icon
          name={iconName}
          size={24}
          color={theme.colors.surface.texticon.onnormal.icon.black}
        />        
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.regular,
              letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.xs),
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>

      {/* Internal divider lines */}
      {showRightLine && (
        <View
          style={[
            styles.dividerLine,
            styles.rightLine,
            { backgroundColor: theme.colors.border.lowEmp },
          ]}
        />
      )}
      {showLeftLine && (
        <View
          style={[
            styles.dividerLine,
            styles.leftLine,
            { backgroundColor: theme.colors.border.lowEmp },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    gap: 5,    
  },
  label: {
    textAlign: 'center',
  },
  dividerLine: {
    position: 'absolute',
    width: 1,
    height: 41,
    top: 15,
  },
  rightLine: {
    right: 0,
  },
  leftLine: {
    left: 0,
  },
});
