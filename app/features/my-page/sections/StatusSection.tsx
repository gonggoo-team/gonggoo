import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system/hooks';
import type { StatusButtonItem } from '@/app/shared/types';
import { StatusButtonGroup } from '../components';

interface StatusSectionProps {
  title: string;
  items: StatusButtonItem[];
}

export function StatusSection({ title, items }: StatusSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.semiBold,
              letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.md),
            },
          ]}
        >
          {title}
        </Text>
      </View>
      <View style={styles.buttonGroupContainer}>
        <StatusButtonGroup items={items} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    // Title styling from theme applied inline
  },
  buttonGroupContainer: {
    paddingHorizontal: 20,
  },
});
