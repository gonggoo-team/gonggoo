/**
 * ProductInfo Component
 *
 * 상품 제목을 표시하는 컴포넌트입니다.
 * numberOfLines로 텍스트 오버플로우를 처리합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 */

import React from 'react';
import { Text } from 'react-native';
import { useTheme, useResponsive } from '../../../hooks';

/**
 * ProductInfo Props
 */
export interface ProductInfoProps {
  /**
   * 상품 제목
   */
  title: string;

  /**
   * 최대 라인 수
   * @default 2
   */
  maxLines?: number;

  /**
   * 폰트 크기 (옵션)
   */
  fontSize?: number;

  /**
   * 텍스트 색상 (옵션)
   */
  color?: string;
}

/**
 * ProductInfo Component
 */
export const ProductInfo: React.FC<ProductInfoProps> = ({
  title,
  maxLines = 2,
  fontSize,
  color,
}) => {
  const { theme } = useTheme();
  const { fontSize: scaleFontSize, adjustLines } = useResponsive();

  // 반응형 폰트 크기 적용 (기준: 14px → 14-16px)
  const baseFontSize = fontSize || theme.typography.scalableFontSize.sm; // 14px
  const finalFontSize = scaleFontSize(baseFontSize);
  const finalColor = color || theme.colors.surface.texticon.onnormal.text.black; // #181A1A

  // 큰 디바이스에서는 라인 수를 1 증가 (텍스트 잘림 방지)
  const dynamicMaxLines = adjustLines(maxLines);

  return (
    <Text
      numberOfLines={dynamicMaxLines}
      ellipsizeMode="tail"
      style={{
        fontSize: finalFontSize,
        fontWeight: theme.typography.fontWeight.medium, // 500
        lineHeight: finalFontSize * 1.4, // 일관된 line-height
        letterSpacing: theme.typography.getLetterSpacing(finalFontSize),
        color: finalColor,
      }}
    >
      {title}
    </Text>
  );
};
