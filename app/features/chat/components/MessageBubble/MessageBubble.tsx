/**
 * MessageBubble Component
 */

import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/design-system';
import { getBorderRadiusStyle } from '@/app/features/chat/utils';
import { createStyles } from './MessageBubble.styles';
import type { MessageBubbleProps } from './MessageBubble.types';

export default function MessageBubble({ content, sender, position }: MessageBubbleProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, sender);
  // position 정보(first, middle, last, single)를 통해 테두리 둥글기 조정
  const borderRadiusStyle = getBorderRadiusStyle(position, sender); 

  return (
    <View style={[styles.bubble, borderRadiusStyle]}>
      {/* includeFontPadding: false (Android) 
        - 입력창과 렌더링 높이를 맞추기 위한 핵심 속성 
      */}
      <Text style={styles.text} textBreakStrategy="highQuality">
        {content}
      </Text>
    </View>
  );
}