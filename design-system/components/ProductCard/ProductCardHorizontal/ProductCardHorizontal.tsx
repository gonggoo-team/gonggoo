/**
 * ProductCardHorizontal Component
 *
 * 가로형 리스트 상품 카드 컴포넌트입니다.
 * "가장 인기 있는!" 섹션에서 사용됩니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=445-6497&m=dev
 * 마지막 동기화: 2025-10-09
 *
 * 사용 예시:
 * ```tsx
 * <ProductCardHorizontal
 *   id="1"
 *   imageUri="..."
 *   title="남성용 패션 정장 중목 무지 양말 100세트"
 *   price={75000}
 *   pricePerSlot={15000}
 *   buyersCount={45}
 *   progress={66}
 *   badges={[
 *     { type: 'remaining', label: '3일 남음' },
 *     { type: 'recruiting', label: '65슬롯 모집' }
 *   ]}
 *   onPress={() => {}}
 * />
 * ```
 *
 * Note: Figma 디자인에는 좋아요 기능이 없어 likes, onLikePress는 제거되었습니다.
 */

import React, { useMemo } from 'react';
import { Dimensions, StyleSheet, Text, Pressable, View } from 'react-native';
import { useTheme } from '../../../hooks';
import { ProductImage } from '../../../primitives/ProductImage';
import { ProgressBar } from '../../../primitives/ProgressBar';
import { ProductBadges, ProductInfo, ProductPrice } from '../shared';
import type { ProductCardHorizontalProps } from './ProductCardHorizontal.types';

/**
 * ProductCardHorizontal Component
 */
export const ProductCardHorizontal = React.memo<ProductCardHorizontalProps>(({
  imageUri,
  title,
  price,
  pricePerSlot,
  priceStrikethrough = true,
  priceLabel = '슬롯',
  priceLabelValue = 1,
  priceLabelColor,
  buyersCount,
  progress,
  badges,
  onPress,
  showPrice = true,
  showPricePerSlot = true,
  showBadges = true,
  showProgress = true,
  titleLines = 2,
}) => {
  const { theme } = useTheme();

  // 반응형 레이아웃 계산
  const layout = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const containerWidth = screenWidth - 40; // 좌우 padding 20px * 2

    // 이미지 크기: 136px 기준, 최소 100px ~ 최대 136px
    const imageSize = Math.min(136, Math.max(100, containerWidth * 0.36));

    // 진행률 바 최대 너비: 97px 기준, 최소 70px
    const progressBarMaxWidth = Math.min(97, Math.max(70, containerWidth - imageSize - 100));

    return {
      imageSize,
      progressBarMaxWidth,
    };
  }, []);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          borderBottomWidth: theme.dimensions.borderWidth.thin, // 1px
          borderBottomColor: '#F4F4F4', // Figma 기준 #F4F4F4
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
      {/* 이미지 영역 (반응형) */}
      <View style={[styles.imageContainer, { width: layout.imageSize, height: layout.imageSize }]}>
        <ProductImage uri={imageUri} aspectRatio={1} />
      </View>

      {/* 내용 영역 */}
      <View
        style={{
          flex: 1,
          gap: 9, // Figma 기준: 9px (섹션 간 간격)
        }}
      >
        {/* 제목 */}
        <ProductInfo title={title} maxLines={titleLines} fontSize={theme.typography.fontSize.sm} />

        {/* 가격 정보 */}
        <View style={{ gap: 0 }}>
          {/* 총 가격 (optional, strikethrough 지원) */}
          {showPrice && price !== undefined && (
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm, // 14px
                fontWeight: theme.typography.fontWeight.medium, // 500
                lineHeight: theme.typography.fontSize.sm * 1.4,
                letterSpacing: theme.typography.getLetterSpacing(14),
                color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
                textDecorationLine: priceStrikethrough ? 'line-through' : 'none',
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
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
              fontSize={theme.typography.fontSize.sm} // 14px (Figma 기준)
            />
          )}
        </View>

        {/* 배지 */}
        {showBadges && <ProductBadges badges={badges} />}

        {/* 진행률 바 + 구매 중인 인원 (반응형) */}
        {showProgress && (
          <View style={styles.progressRow}>
            <View style={{ width: layout.progressBarMaxWidth, minWidth: 70 }}>
              <ProgressBar percentage={progress} variant="light" showLabel={true} />
            </View>
            <Text
              style={{
                fontSize: theme.typography.fontSize.xs, // 12px
                fontWeight: theme.typography.fontWeight.medium, // 500
                lineHeight: theme.typography.fontSize.xs * 1.193,
                letterSpacing: theme.typography.getLetterSpacing(12),
                color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {buyersCount}명 구매중
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    gap: 13, // Figma 기준: 13px
    paddingVertical: 15, // Figma 기준: 15px
  },
  imageContainer: {
    // width와 height는 동적으로 계산됨 (반응형)
    borderRadius: 12, // Figma 기준
    overflow: 'hidden',
  },
  pricePerSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5, // Figma 기준: 5px
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', // Figma 기준: 하단 정렬
    gap: 3, // Figma 기준: 3px (게이지와 텍스트 사이)
  },
});
