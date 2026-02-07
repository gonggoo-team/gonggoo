/**
 * ProductCardCompact Component
 *
 * 컴팩트 가로형 상품 카드 컴포넌트입니다.
 * 수평 스크롤에서 사용됩니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <ProductCardCompact
 *   id="1"
 *   imageUri="..."
 *   title="남성용 패션 정장 중목 무지 양말 100세트 5명 공구 모집해요"
 *   price={75000}
 *   pricePerSlot={15000}
 *   badges={[
 *     { type: 'remaining', label: '3일 남음' },
 *     { type: 'recruiting', label: '5슬롯 모집 중' }
 *   ]}
 *   isClosed={false}
 *   onPress={() => {}}
 * />
 * ```
 */

import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { ProductImage } from '../../../primitives/ProductImage';
import { ProductPrice, ProductBadges, ProductInfo } from '../shared';
import { useTheme } from '../../../hooks';
import type { ProductCardCompactProps } from './ProductCardCompact.types';

/**
 * ProductCardCompact Component
 */
export const ProductCardCompact = React.memo<ProductCardCompactProps>(({
  imageUri,
  title,
  price,
  pricePerSlot,
  badges = [],
  isClosed = false,
  onPress,
  showPrice = true,
  showPricePerSlot = true,
  showBadges = true,
  titleLines = 2,
  imageSize = 106,
  contentGap = 6,
  priceLabel = '1슬롯',
  disablePress = false,
}) => {
  const { theme } = useTheme();

  // 터치 가능 여부
  const isPressable = !disablePress && !!onPress;

  // 컨테이너 렌더링 (Pressable 또는 View)
  const ContainerComponent = isPressable ? Pressable : View;

  const containerProps = isPressable
    ? {
        style: ({ pressed }: { pressed: boolean }) => [
          styles.container,
          { opacity: pressed ? 0.8 : 1 },
        ],
        onPress,
        delayPressIn: 0, // 즉각적 터치 피드백
        delayLongPress: 300,
        disabled: isClosed,
        android_ripple: {
          color: theme.colors.surface.normal.container10,
          borderless: false,
        },
        accessibilityRole: 'button' as const,
        accessibilityLabel: `상품: ${title}`,
        accessibilityState: { disabled: isClosed },
      }
    : {
        style: styles.container,
      };

  return (
    <ContainerComponent {...containerProps}>
      {/* 이미지 영역 */}
      <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
        <ProductImage uri={imageUri} aspectRatio={1} />

        {/* 모집 완료 오버레이 */}
        {isClosed && (
          <View
            style={[
              styles.closedOverlay,
              {
                backgroundColor: 'rgba(24, 26, 26, 0.7)', // #181A1A with 70% opacity
                borderRadius: theme.radius.md, // 12px
              },
            ]}
          >
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm, // 14px
                fontWeight: theme.typography.fontWeight.medium, // 500
                lineHeight: theme.typography.fontSize.sm * 1.4,
                letterSpacing: theme.typography.getLetterSpacing(14),
                color: theme.colors.surface.texticon.onnormal.text.white, // #FFFFFF
              }}
            >
              모집 완료
            </Text>
          </View>
        )}
      </View>

      {/* 내용 영역 */}
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          gap: contentGap,
        }}
      >
        {/* 제목 */}
        <ProductInfo title={title} maxLines={titleLines} fontSize={13} />

        {/* 하단 정보 */}
        <View style={{ gap: contentGap }}>
          {/* 가격 정보 */}
          <View style={styles.priceContainer}>
            {showPricePerSlot && <ProductPrice pricePerSlot={pricePerSlot} label={priceLabel} />}
            {showPrice && (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: theme.typography.fontWeight.medium, // 500
                  lineHeight: 13,
                  letterSpacing: theme.typography.getLetterSpacing(11),
                  color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
                }}
              >
                {price.toLocaleString()}원
              </Text>
            )}
          </View>

          {/* 배지 */}
          {showBadges && badges.length > 0 && <ProductBadges badges={badges} />}
        </View>
      </View>
    </ContainerComponent>
  );
});

const styles = StyleSheet.create({
  container: {
    // width 제거: 콘텐츠(이미지 + gap + 텍스트)에 맞게 자동 조정
    flexDirection: 'row',
    gap: 14, // Figma 기준 특수값 (토큰 없음)
  },
  imageContainer: {
    // width, height는 동적으로 설정
    position: 'relative',
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7, // Figma 기준
  },
});
