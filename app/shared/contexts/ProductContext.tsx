/**
 * ProductContext
 *
 * 각 탭의 상품 데이터를 공유하기 위한 Context입니다.
 * - FilterScreen에서 동적 가격 범위 계산에 사용
 * - 탭별로 Provider를 사용하여 상품 목록 공유
 */

import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import React, { createContext, useContext, useMemo } from 'react';

/**
 * Context 타입 정의
 */
interface ProductContextValue {
  /** 전체 상품 목록 */
  products: ProductCardVerticalData[];
  /** 가격 범위 메타데이터 */
  priceRange: {
    min: number;
    max: number;
  };
}

/**
 * Context 생성
 */
const ProductContext = createContext<ProductContextValue | undefined>(undefined);

/**
 * Provider Props
 */
interface ProductProviderProps {
  products: ProductCardVerticalData[];
  children: React.ReactNode;
}

/**
 * ProductProvider Component
 */
export const ProductProvider: React.FC<ProductProviderProps> = ({ products, children }) => {
  // 가격 범위 자동 계산 (최저가 ~ 최고가) - 성능 최적화
  const priceRange = useMemo(() => {
    if (products.length === 0) {
      // 상품이 없을 경우 기본값
      return { min: 100, max: 1000000 };
    }

    // reduce를 사용하여 O(n) 한 번으로 min/max 계산 (기존 O(2n) → O(n))
    const { min, max } = products.reduce(
      (acc, product) => {
        const price = product.pricePerSlot;
        return {
          min: price < acc.min ? price : acc.min,
          max: price > acc.max ? price : acc.max,
        };
      },
      { min: Infinity, max: -Infinity }
    );

    // 최소 범위 보장 (min과 max가 같을 경우 대비)
    if (min === max) {
      return { min: Math.max(0, min - 10000), max: max + 10000 };
    }

    return { min, max };
  }, [products]);

  const value = useMemo(
    () => ({
      products,
      priceRange,
    }),
    [products, priceRange]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

/**
 * useProductContext Hook
 * ProductContext를 사용하는 커스텀 훅
 */
export const useProductContext = (): ProductContextValue => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProductContext must be used within ProductProvider');
  }

  return context;
};
