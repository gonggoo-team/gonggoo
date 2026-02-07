/**
 * Popular Section Component
 *
 * 가장 인기 있는! 섹션 (가로형 스크롤 + 인디케이터)
 */

import React, { useState } from 'react';
import { ScrollView, View, NativeSyntheticEvent, NativeScrollEvent, useWindowDimensions } from 'react-native';
import { ProductSection, ProductCardHorizontal, ScrollIndicator, useTheme } from '@/design-system';
import type { ProductCardHorizontalData } from '@/app/shared/types/product.types';

interface PopularSectionProps {
  products: ProductCardHorizontalData[];
  onViewAll: () => void;
  onProductPress: (id: string) => void;
}

export const PopularSection = React.memo<PopularSectionProps>(({
  products,
  onViewAll,
  onProductPress,
}) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View>
      <ProductSection
        title="가장 인기 있는!"
        subtitle="가장 인기 있는 공구를 만나보세요!"
        actionLabel="전체보기"
        onActionPress={onViewAll}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            gap: 0,
          }}
        >
          {/* 3개씩 묶어서 페이지 생성 */}
          {Array.from({ length: Math.ceil(products.length / 3) }, (_, pageIndex) => (
            <View
              key={`page-${pageIndex}`}
              style={{
                width: screenWidth,
                paddingHorizontal: theme.spacing.lg,
              }}
            >
              {products.slice(pageIndex * 3, (pageIndex + 1) * 3).map((product) => (
                <ProductCardHorizontal
                  key={product.id}
                  id={product.id}
                  imageUri={product.imageUri}
                  title={product.title}
                  price={product.price}
                  pricePerSlot={product.pricePerSlot}
                  buyersCount={product.buyersCount}
                  progress={product.progress}
                  badges={product.badges}
                  onPress={() => onProductPress(product.id)}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </ProductSection>

      {/* 스크롤 인디케이터 */}
      <ScrollIndicator
        currentIndex={currentIndex}
        currentPage={currentIndex}
        totalPages={Math.ceil(products.length / 3)}
      />
    </View>
  );
});
