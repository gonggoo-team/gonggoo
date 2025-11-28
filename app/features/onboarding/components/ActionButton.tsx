/**
 * Action Button Component
 *
 * 온보딩 화면용 큰 액션 버튼 컴포넌트
 * Figma 디자인 기반 정확한 크기 및 스타일링
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';

interface ActionButtonProps {
  title: string;
  variant: 'primary' | 'secondary' | 'tertiary';
  onPress: () => void;
}

export function ActionButton({ title, variant, onPress }: ActionButtonProps) {
  const { theme } = useTheme();

  /**
   * Variant별 높이
   * Figma: Primary 54px, Secondary 42px
   */
  const getHeight = () => {
    switch (variant) {
      case 'primary':
        return 54;
      case 'secondary':
        return 54;
      case 'tertiary':
        return undefined; // Auto height
      default:
        return 54;
    }
  };

  /**
   * Variant별 폰트 크기
   * Figma: Primary 16px, Secondary 14px
   */
  const getFontSize = () => {
    switch (variant) {
      case 'primary':
        return 16;
      case 'secondary':
        return 14;
      case 'tertiary':
        return 12;
      default:
        return 16;
    }
  };

  /**
   * Variant별 폰트 굵기
   * Figma: Primary SemiBold (600), Secondary Medium (500)
   */
  const getFontWeight = (): '400' | '500' | '600' | '700' => {
    switch (variant) {
      case 'primary':
        return '600'; // SemiBold
      case 'secondary':
        return '500'; // Medium
      case 'tertiary':
        return '400'; // Regular
      default:
        return '500';
    }
  };

  /**
   * Variant별 배경색
   */
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary':
        return '#006242'; // Brand primary green
      case 'secondary':
        return '#E1E1E1'; // Disabled gray
      case 'tertiary':
        return 'transparent';
      default:
        return '#006242';
    }
  };

  /**
   * Variant별 텍스트 색상
   */
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return '#FFFFFF'; // White
      case 'secondary':
        return '#181A1A'; // Black
      case 'tertiary':
        return theme.colors.surface.texticon.onnormal.text.midEmp;
      default:
        return '#FFFFFF';
    }
  };

  /**
   * Letter spacing 계산 (-2.5%)
   */
  const getLetterSpacing = () => {
    const fontSize = getFontSize();
    return fontSize * -0.025;
  };

  /**
   * Line height 계산
   */
  const getLineHeight = () => {
    const fontSize = getFontSize();
    return fontSize * 1.2; // Figma: 1.2001953125em
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          height: getHeight(),
          backgroundColor: getBackgroundColor(),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: getFontSize(),
            fontWeight: getFontWeight(),
            letterSpacing: getLetterSpacing(),
            lineHeight: getLineHeight(),
            color: getTextColor(),
            fontFamily: theme.typography.fontFamily.primary,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 345,
    maxWidth: '92%', // Responsive: 345/375 = 0.92
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  text: {
    textAlign: 'center',
  },
});
