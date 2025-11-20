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
import { StyleSheet, Text, Pressable, View, useWindowDimensions } from 'react-native';
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
  variant = 'default',
  completed = false,
  showPrice = true,
  showPricePerSlot = true,
  showBadges = true,
  showProgress = true,
  titleLines = 2,
  showDivider = true,
  centerTextVertically = false,
}) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  // variant에 따른 설정
  const isRecentVariant = variant === 'recent';
  const isProfileVariant = variant === 'profile';

  // recent/profile variant는 진행률 바를 표시하지 않음
  const finalShowProgress = (isRecentVariant || isProfileVariant) ? false : showProgress;

  // profile variant는 배지를 표시하지 않음
  const finalShowBadges = isProfileVariant ? false : showBadges;

  // 반응형 레이아웃 계산
  const layout = useMemo(() => {
    const containerWidth = screenWidth - 40; // 좌우 padding 20px * 2

    // profile variant: 62px 고정
    // recent variant: 106px 고정
    // default variant: 136px 기준, 최소 100px ~ 최대 136px
    const imageSize = isProfileVariant
      ? 62
      : isRecentVariant
      ? 106
      : Math.min(136, Math.max(100, containerWidth * 0.36));

    // 진행률 바 최대 너비: 97px 기준, 최소 70px
    const progressBarMaxWidth = Math.min(97, Math.max(70, containerWidth - imageSize - 100));

    return {
      imageSize,
      progressBarMaxWidth,
    };
  }, [screenWidth, isRecentVariant, isProfileVariant]);

  // variant별 스타일 계산
  const variantStyles = useMemo(() => {
    if (isProfileVariant) {
      return {
        paddingVertical: 4,  // 상하 4px 공백 (이미지 62px + 상하 8px = 70px 전체 높이)
        gap: 10,             // 이미지-내용 간격
        contentGap: 4,       // 내부 요소 간격 (더 타이트하게)
      };
    }
    return {
      paddingVertical: 15,
      gap: 13, // 이미지-내용 간격
      contentGap: 9, // 내부 요소 간격
    };
  }, [isProfileVariant]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          borderBottomWidth: showDivider ? theme.dimensions.borderWidth.thin : 0, // 1px or 0
          borderBottomColor: showDivider ? theme.colors.surface.normal.bg3 : 'transparent',
          opacity: pressed ? 0.8 : 1,
          paddingVertical: variantStyles.paddingVertical,
          gap: variantStyles.gap,
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

        {/* 모집 완료 오버레이 (recent/profile variant 전용) */}
        {(isRecentVariant || isProfileVariant) && completed && (
          <View style={styles.completedOverlay}>
            <Text style={[styles.completedText, {
              fontSize: theme.typography.fontSize.sm, // 14px
              fontWeight: theme.typography.fontWeight.medium, // 500
              lineHeight: theme.typography.fontSize.sm * 1.193,
              letterSpacing: theme.typography.getLetterSpacing(14),
            }]}>
              모집 완료
            </Text>
          </View>
        )}
      </View>

      {/* 내용 영역 */}
      <View
        style={{
          flex: 1,
          gap: variantStyles.contentGap, // variant별 간격
          justifyContent: centerTextVertically || isProfileVariant ? 'center' : 'flex-start', // 중앙 정렬 옵션
          height: centerTextVertically || isProfileVariant ? layout.imageSize : undefined, // 중앙 정렬 시 이미지 높이와 동일
        }}
      >
        {/* 제목 */}
        <ProductInfo
          title={title}
          maxLines={titleLines}
          fontSize={isProfileVariant ? theme.typography.fontSize.xs : theme.typography.fontSize.sm}
        />

        {/* 가격 정보 - 한 줄 표시: "1슬롯 15,000원 75,000원" */}
        <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* 슬롯당 가격 (optional) */}
          {showPricePerSlot && pricePerSlot !== undefined && (
            <ProductPrice
              pricePerSlot={pricePerSlot}
              label={priceLabel}
              labelValue={priceLabelValue}
              labelColor={priceLabelColor}
              fontSize={isProfileVariant ? theme.typography.fontSize.xs : theme.typography.fontSize.sm}
            />
          )}

          {/* 총 가격 (optional, strikethrough 지원) */}
          {showPrice && price !== undefined && (
            <Text
              style={{
                fontSize: isProfileVariant ? theme.typography.fontSize.xs : theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semiBold, // 600
                lineHeight: isProfileVariant ? theme.typography.fontSize.xs * 1.4 : theme.typography.fontSize.sm * 1.4,
                letterSpacing: theme.typography.getLetterSpacing(isProfileVariant ? 12 : 14),
                color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
                textDecorationLine: priceStrikethrough ? 'line-through' : 'none',
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {price.toLocaleString()}원
            </Text>
          )}
        </View>

        {/* 배지 */}
        {finalShowBadges && <ProductBadges badges={badges} />}

        {/* 진행률 바 + 구매 중인 인원 (반응형) */}
        {finalShowProgress && (
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
    // gap과 paddingVertical은 variant별로 동적 설정됨
  },
  imageContainer: {
    // width와 height는 동적으로 계산됨 (반응형)
    borderRadius: 12, // Figma 기준
    overflow: 'hidden',
    position: 'relative',
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
  // 모집 완료 오버레이 (recent variant 전용)
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(24, 26, 26, 0.7)', // Figma 기준: #181A1A 70% opacity
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12, // 부모 컨테이너와 동일
  },
  completedText: {
    color: '#FFFFFF', // Figma 기준: 흰색 텍스트
  },
});
