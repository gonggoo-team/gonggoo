/**
 * RecommendationSection Component
 *
 * 카테고리 화면의 상품 추천 섹션입니다.
 * - 섹션 타이틀 + 수평 스크롤 상품 목록
 * - ProductCardVertical 사용
 */

import type { ProductCardVerticalData } from '@/app/shared/types';
import { ProductCardVertical, SectionHeader, useTheme } from '@/design-system';
import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';

interface RecommendationSectionProps {
  /** 추천 상품 목록 */
  products: ProductCardVerticalData[];
  /** 상품 클릭 핸들러 */
  onProductPress: (id: string) => void;
  /** 사용자 이름 (선택적) */
  userName?: string;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  products,
  onProductPress,
  userName = '만댱',
}) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  // 3열 그리드 동적 카드 너비 계산 (Figma 기준)
  const horizontalPadding = 40; // 20px × 2
  const availableWidth = screenWidth - horizontalPadding;
  const gap = 9; // Figma 기준 카드 간격
  const cardWidth = Math.floor((availableWidth - gap * 2) / 3);

  return (
    <View>
      {/* 섹션 헤더 */}
      <SectionHeader
        title={`${userName}님! 이런 공구는 어떠세요??`}
        style={{
          paddingHorizontal: theme.spacing.lg,          
        }}
      />

      {/* 상품 목록 (수평 스크롤) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.lg, // 20px
          paddingTop: theme.spacing.md, // 16px
        }}
      >
        {products.map((product, index) => (
          <View
            key={product.id}
            style={{
              marginRight: index < products.length - 1 ? theme.spacing.md : 0, // 16px gap
              width: cardWidth,
            }}
          >
            <ProductCardVertical
              id={product.id}
              imageUri={product.imageUri}
              title={product.title}
              price={product.price}
              showPrice={false}
              pricePerSlot={product.pricePerSlot}
              priceLabelValue={product.priceLabelValue}
              likes={product.likes ?? 0}
              showLikes={false}
              badges={
                // convertBadges(product.badges || [])
                []
              }
              onPress={() => onProductPress(product.id)}
              onLikePress={() => onProductPress(product.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
