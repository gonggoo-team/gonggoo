/**
 * ProductPrice Component
 *
 * 상품 가격 표시 컴포넌트입니다.
 * "1슬롯 15,000원" 형태로 표시합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme, useResponsive } from '../../../hooks';

/**
 * ProductPrice Props
 */
export interface ProductPriceProps {
  /**
   * 슬롯당 가격
   */
  pricePerSlot: number;

  /**
   * 라벨 (예: "1인", "1슬롯", "1팩")
   */
  label?: string;

  /**
   * 라벨 값 (예: 1, 2, 3)
   */
  labelValue?: string | number;

  /**
   * 라벨 색상 (optional, 기본값: #F7514D 빨간색)
   */
  labelColor?: string;

  /**
   * 폰트 크기 (optional, 기본값: 16px)
   * ProductCardHorizontal에서는 14px 사용
   */
  fontSize?: number;
}

/**
 * ProductPrice Component
 */
export const ProductPrice: React.FC<ProductPriceProps> = ({
  pricePerSlot,
  label,
  labelValue,
  labelColor,
  fontSize,
}) => {
  const { theme } = useTheme();
  const { fontSize: scaleFontSize, spacing } = useResponsive();

  const finalLabelColor = labelColor || theme.colors.surface.texticon.onnormal.text.red; // 기본값: #F7514D

  // 반응형 폰트 크기 적용 (기준: 16px → 16-18px, 또는 14px → 14-16px)
  const baseFontSize = fontSize || theme.typography.scalableFontSize.md; // 기본값: 16px
  const finalFontSize = scaleFontSize(baseFontSize);

  return (
    <View style={[styles.container, { gap: spacing(5) }]}>
      <Text
        style={{
          fontSize: finalFontSize,
          fontWeight: theme.typography.fontWeight.semiBold, // 600
          lineHeight: finalFontSize * 1.193, // Figma 기준
          letterSpacing: theme.typography.getLetterSpacing(finalFontSize),
          color: finalLabelColor,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {labelValue}{label}
      </Text>
      <Text
        style={{
          fontSize: finalFontSize,
          fontWeight: theme.typography.fontWeight.semiBold, // 600
          lineHeight: finalFontSize * 1.193, // Figma 기준
          letterSpacing: theme.typography.getLetterSpacing(finalFontSize),
          color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A (디자인 시스템 토큰)
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {pricePerSlot.toLocaleString()}원
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // gap은 인라인 스타일로 동적 적용 (5px → 5-6px)
  },
});
