/**
 * ProductCardVertical Component
 *
 * 세로형 상품 카드 컴포넌트입니다.
 * Grid 레이아웃에서 사용됩니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=268-670&m=dev
 * 마지막 동기화: 2025-10-09
 *
 * 사용 예시:
 * ```tsx
 * <ProductCardVertical
 *   id="1"
 *   imageUri="..."
 *   title="남성용 패션 정장 중목 무지 양말 21족 세트"
 *   price={36300}
 *   priceStrikethrough={false}
 *   pricePerSlot={12100}
 *   priceLabel="1슬롯"
 *   priceLabelColor="#006242"
 *   likes={3}
 *   progress={66}
 *   showProgress={true}
 *   badges={[
 *     { type: 'deadline', label: '오늘 마감' },
 *     { type: 'recruiting', label: '3명 모집' }
 *   ]}
 *   onPress={() => {}}
 *   onLikePress={() => {}}
 * />
 * ```
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme, useResponsive } from '../../../hooks';
import { ProductImage } from '../../../primitives/ProductImage';
import { ProgressBar } from '../../../primitives/ProgressBar';

import { ProductBadges, ProductLike, ProductPrice } from '../shared';
import type { ProductCardVerticalProps } from './ProductCardVertical.types';

/**
 * ProductCardVertical Component
 */
export const ProductCardVertical = React.memo<ProductCardVerticalProps>(({
  imageUri,
  title,
  price,
  priceStrikethrough = false,
  pricePerSlot,
  priceLabel = '슬롯',
  priceLabelValue,
  priceLabelColor,
  likes,
  progress,
  showProgress = true,
  badges = [],
  onPress,
  onLikePress,
  width,
  showPrice = true,
  showPricePerSlot = true,
  showBadges = true,
  showLikes = true,
  titleLines = 2,
}) => {
  const { theme } = useTheme();
  const { fontSize: scaleFontSize, spacing, adjustLines } = useResponsive();

  // 반응형 폰트 크기 (14px → 14-16px)
  const titleFontSize = scaleFontSize(theme.typography.scalableFontSize.sm);
  const priceFontSize = scaleFontSize(theme.typography.scalableFontSize.sm);
  const titleLineHeight = titleFontSize * 1.285;

  // 큰 디바이스에서는 titleLines + 1 (잘림 방지)
  const dynamicTitleLines = adjustLines(titleLines);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          width: width ?? '100%', // 동적 너비 지원 (미지정 시 Figma 기본값 163)
          maxWidth: width ?? 200, // 동적 최대 너비 (미지정 시 iPad 대응 200)
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={onPress}
      delayLongPress={300}
      android_ripple={{
        color: theme.colors.surface.normal.container10,
        borderless: false,
      }}
      accessibilityRole="button"
      accessibilityLabel={`상품: ${title}`}
    >
      {/* 이미지 */}
      <ProductImage uri={imageUri} aspectRatio={1} />

      {/* 내용 */}
      <View
        style={{
          paddingTop: spacing(8), // 반응형 간격 (8px → 8-9px)
          gap: spacing(theme.spacing.xxs), // 반응형 간격 (4px → 4-5px)
        }}
      >
        {/* 제목 (반응형 적용) */}
        <Text
          style={{
            fontSize: titleFontSize, // 반응형: 14px → 14-16px
            fontWeight: theme.typography.fontWeight.medium, // 500
            lineHeight: titleLineHeight, // Figma 기준: 18px (반응형 계산)
            letterSpacing: theme.typography.getLetterSpacing(titleFontSize),
            color: theme.colors.surface.texticon.onnormal.text.black, // Figma 기준: 검은색 (#181A1A)
          }}
          numberOfLines={dynamicTitleLines} // 큰 디바이스: 2 → 3줄
          ellipsizeMode="tail"
        >
          {title}
        </Text>

        {/* 좋아요 (별도 행으로 이동) */}
        {showLikes && likes !== undefined && (
          <ProductLike count={likes} onPress={onLikePress} position="relative" />
        )}

        {/* 총 가격 (optional, strikethrough 지원, 반응형 적용) */}
        {showPrice && price !== undefined && (
          <Text
            style={{
              fontSize: priceFontSize, // 반응형: 14px → 14-16px
              fontWeight: theme.typography.fontWeight.medium, // 500
              lineHeight: priceFontSize * 1.4,
              letterSpacing: theme.typography.getLetterSpacing(priceFontSize),
              color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
              textDecorationLine: priceStrikethrough ? 'line-through' : 'none',
            }}
          >
            {price.toLocaleString()}원
          </Text>
        )}

        {/* 슬롯당 가격 (optional) */}
        {showPricePerSlot && pricePerSlot !== undefined && (
          <ProductPrice
            pricePerSlot={pricePerSlot}
            label={priceLabel}
            labelValue={priceLabelValue}
            labelColor={priceLabelColor}
          />
        )}

        {/* 진행률 게이지 (optional) */}
        {showProgress && progress !== undefined && (
          <ProgressBar percentage={progress} variant="light" />
        )}

        {/* 배지 */}
        {showBadges && <ProductBadges badges={badges} />}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1과 maxWidth는 inline으로 처리
  },
});
