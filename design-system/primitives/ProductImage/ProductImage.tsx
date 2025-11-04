/**
 * ProductImage Component
 *
 * 상품 이미지를 표시하는 반응형 컴포넌트입니다.
 * aspectRatio를 사용하여 모든 디바이스에서 일관된 비율 유지합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <ProductImage uri="..." aspectRatio={1} />  // 정사각형
 * <ProductImage uri="..." aspectRatio={335/184} showBorder />  // 가로형 + 테두리
 * ```
 */

import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks';
import { createProductImageStyles } from './ProductImage.styles';
import type { ProductImageProps } from './ProductImage.types';

/**
 * ProductImage Component
 */
export const ProductImage: React.FC<ProductImageProps> = ({
  uri,
  aspectRatio,
  showBorder = false,
}) => {
  const { theme } = useTheme();
  const styles = createProductImageStyles(theme, showBorder);

  return (
    <View style={[styles.container, { aspectRatio }]}>
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        priority="high"
        accessibilityLabel="상품 이미지"
      />
    </View>
  );
};
