/**
 * Deadline Section Component
 *
 * 오늘 마감 섹션 (카운트다운 타이머 포함)
 */

import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import { CountdownTimer, ProductCardVertical, ProductSection, useTheme } from '@/design-system';
import React from 'react';
import { ScrollView, View } from 'react-native';

interface DeadlineSectionProps {
  products: ProductCardVerticalData[];
  targetTime: Date;
  onViewAll: () => void;
  onProductPress: (id: string) => void;
  onLikePress: (id: string) => void;
  onExpire: () => void;
}

export const DeadlineSection: React.FC<DeadlineSectionProps> = ({
  products,
  targetTime,
  onViewAll,
  onProductPress,
  onLikePress,
  onExpire,
}) => {
  const { theme } = useTheme();

  return (
    <View>
      <ProductSection
        title="오늘 마감"
        subtitle="오늘 마감되는 핫한 공구를 놓치지 마세요!"
        actionLabel="전체보기"
        onActionPress={onViewAll}
      >
        {/* 카운트다운 타이머 */}
        <CountdownTimer targetTime={targetTime} onExpire={onExpire} />
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
              priceStrikethrough={true}
              pricePerSlot={product.pricePerSlot}
              priceLabelColor={theme.colors.surface.texticon.onnormal.text.red}
              priceLabel="슬롯"
              priceLabelValue={product.priceLabelValue}
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
    </View>
  );
};
