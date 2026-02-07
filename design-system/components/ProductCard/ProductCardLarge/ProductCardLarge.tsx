/**
 * ProductCardLarge Component
 *
 * 큰 사이즈의 상품 카드 컴포넌트입니다.
 * 중요한 상품을 강조할 때 사용됩니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=540-9528&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <ProductCardLarge
 *   id="1"
 *   imageUri="..."
 *   title="남성용 패션 정장 중목 무지 양말 100세트"
 *   price={75000}
 *   pricePerSlot={15000}
 *   likes={234}
 *   slotsRemaining={1}
 *   participantsCount={3}
 *   badges={[
 *     { type: 'remaining', label: '3일 남음' }
 *   ]}
 *   onPress={() => {}}
 *   onLikePress={() => {}}
 * />
 * ```
 */

import React from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { ProductImage } from '../../../primitives/ProductImage';
import { ProductPrice, ProductBadges, ProductInfo, ProductLike } from '../shared';
import { useTheme } from '../../../hooks';
import type { ProductCardLargeProps } from './ProductCardLarge.types';

/**
 * ProductCardLarge Component
 */
export const ProductCardLarge: React.FC<ProductCardLargeProps> = ({
  imageUri,
  title,
  price,
  pricePerSlot,
  likes,
  slotsRemaining,
  participantsCount,
  badges,
  onPress,
  onLikePress,
  showPrice = true,
  showPricePerSlot = true,
  showBadges = true,
  showLikes = true,
  titleLines = 2,
}) => {
  const { theme } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={onPress}
      delayPressIn={0}
      delayLongPress={300}
      android_ripple={{
        color: theme.colors.surface.normal.container10,
        borderless: false,
      }}
      accessibilityRole="button"
      accessibilityLabel={`상품: ${title}`}
    >
      {/* 이미지 영역 */}
      <ProductImage uri={imageUri} aspectRatio={335 / 184} showBorder />

      {/* 내용 영역 */}
      <View
        style={{
          paddingHorizontal: theme.spacing.xxs, // 4px
          paddingTop: theme.spacing.xs, // 8px
          gap: theme.spacing.xxs, // 4px
        }}
      >
        {/* 상단 정보 (슬롯 남음 + 참가 중 + 좋아요) */}
        <View style={styles.topInfoRow}>
          <View style={styles.statsContainer}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm, // 14px (Figma 기준)
                fontWeight: theme.typography.fontWeight.semiBold, // 600 (Figma 기준)
                lineHeight: theme.typography.fontSize.sm * 1.19,
                letterSpacing: theme.typography.getLetterSpacing(14),
                color: theme.colors.surface.env.accent, // Figma 기준 (빨간색)
              }}
            >
              {slotsRemaining}슬롯 남았어요!
            </Text>
            <View style={styles.dot} />
            <Text
              style={{
                fontSize: 13, // Figma 기준
                fontWeight: theme.typography.fontWeight.medium, // 500
                lineHeight: 13 * 1.19,
                letterSpacing: theme.typography.getLetterSpacing(13),
                color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
              }}
            >
              {participantsCount}명 참가 중
            </Text>
          </View>
          {showLikes && <ProductLike count={likes} onPress={onLikePress} position="relative" />}
        </View>

        {/* 제목 */}
        <ProductInfo title={title} maxLines={titleLines} fontSize={14} />

        {/* 하단 정보 (배지 + 가격) */}
        <View style={styles.bottomInfoRow}>
          {/* 배지 영역 */}
          <View style={{ flex: 1 }}>
            {showBadges && <ProductBadges badges={badges} />}
          </View>

          {/* 가격 영역 */}
          {showPricePerSlot && (
            <View style={styles.priceContainer}>
              <ProductPrice pricePerSlot={pricePerSlot} label="1슬롯" />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Figma 기준
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#9FA7B1', // midEmp
  },
  bottomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8, // spacing.xs
  },
  priceContainer: {
    flexShrink: 0,
  },
});
