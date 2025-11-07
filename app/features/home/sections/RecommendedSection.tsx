/**
 * Recommended Section Component
 *
 * 00님을 위한 추천 공구팟 섹션
 */

import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import { ProductCardVertical, ProductSection, useTheme } from '@/design-system';
import React from 'react';
import { ScrollView } from 'react-native';

interface RecommendedSectionProps {
  products: ProductCardVerticalData[];
  userName?: string; // 추후 사용자 이름 표시용
  onViewAll: () => void;
  onProductPress: (id: string) => void;
  onLikePress: (id: string) => void;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  products,
  userName = '00', // 기본값
  onViewAll,
  onProductPress,
  onLikePress,
}) => {
  const { theme } = useTheme();

  return (
    <ProductSection
      title={`${userName}님을 위한 추천 공구팟`}
      subtitle="관심사를 기반으로 추천하는 특별한 공구!"
      actionLabel="전체보기"
      onActionPress={onViewAll}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        }}
      >
        {products.map((product) => (
          <ProductCardVertical
            key={product.id}
            id={product.id}
            imageUri={product.imageUri}
            title={product.title}
            price={product.price}
            pricePerSlot={product.pricePerSlot}
            priceStrikethrough={true}
            priceLabel="슬롯"
            priceLabelValue={product.priceLabelValue}
            priceLabelColor={theme.colors.surface.texticon.onnormal.text.red}
            badges={[]}
            likes={1}
            progress={0}
            showProgress={false}
            onLikePress={() => onLikePress(product.id)}
            onPress={() => onProductPress(product.id)}
            width={150}
          />
        ))}
      </ScrollView>
    </ProductSection>
  );
};
