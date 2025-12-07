/**
 * Neighborhood Section Component
 *
 * 우리 동네에서 모집중 섹션
 */

import React from 'react';
import { ScrollView } from 'react-native';

import { useAuth } from '@/app/shared/contexts';
import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import { formatNeighborhoodSubtitle } from '@/app/shared/utils';
import { ProductCardVertical, ProductSection, useTheme } from '@/design-system';

interface NeighborhoodSectionProps {
  products: ProductCardVerticalData[];
  onViewAll: () => void;
  onProductPress: (id: string) => void;
  onLikePress: (id: string) => void;
}

export const NeighborhoodSection = React.memo<NeighborhoodSectionProps>(({
  products,
  onViewAll,
  onProductPress,
  onLikePress,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  // 사용자 동네에 맞는 subtitle 생성
  const subtitle = formatNeighborhoodSubtitle(user?.location?.address);

  return (
    <ProductSection
      title="우리 동네에서 모집 중!"
      subtitle={subtitle}
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
            priceLabelValue={product.priceLabelValue}
            priceLabelColor={theme.colors.surface.texticon.onnormal.text.red}
            priceLabel="슬롯"
            badges={[]}
            likes={3}
            progress={60}
            showProgress={true}
            onPress={() => onProductPress(product.id)}
            onLikePress={() => onLikePress(product.id)}            
            width={150}
          />
        ))}
      </ScrollView>
    </ProductSection>
  );
});
