/**
 * DateSeparator Component
 *
 * 채팅 메시지의 날짜 구분선을 표시합니다.
 * 회색 선 + 중앙 날짜 텍스트 형식입니다.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/design-system';
import { createStyles } from './DateSeparator.styles';
import type { DateSeparatorProps } from './DateSeparator.types';

export default function DateSeparator({ date }: DateSeparatorProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{date}</Text>
      <View style={styles.line} />
    </View>
  );
}
