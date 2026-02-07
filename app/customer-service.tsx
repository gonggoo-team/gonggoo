import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme, ScreenWrapper } from '@/design-system';

export default function CustomerServiceScreen() {
  return (
    <ThemeProvider>
      <CustomerServiceScreenContent />
    </ThemeProvider>
  );
}

function CustomerServiceScreenContent() {
  const { theme } = useTheme();

  return (
    <ScreenWrapper preset="default" style={styles.container}>
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.surface.texticon.onnormal.text.black,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.bold,
            },
          ]}
        >
          고객센터
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.surface.texticon.onnormal.text.midEmp,
              fontFamily: theme.typography.fontFamily.primary,
              fontSize: theme.typography.fontSize.sm,
            },
          ]}
        >
          Stub Screen
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  title: {},
  subtitle: {},
});
