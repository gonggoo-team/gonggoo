/**
 * useProductList Hook
 *
 * 탭 콘텐츠에서 사용하는 상품 리스트 로직을 재사용 가능한 훅으로 분리합니다.
 * - 제품 데이터 로드
 * - 카테고리 필터 적용
 * - 공통 필터 적용
 * - 정렬 적용
 * - 최종 제품 목록 반환
 */

import { useMemo } from 'react';

import type { CommonFilters } from '@/app/shared/types/filter.types';
import type { ProductCardVerticalData, ProductCardHorizontalData } from '@/app/shared/types/product.types';
import { applyFilters } from '@/app/shared/utils/filterProducts';

/**
 * 필터링 가능한 상품 타입
 */
type FilterableProduct = ProductCardVerticalData | ProductCardHorizontalData;

/**
 * useProductList Hook (Generic)
 *
 * @param allProducts - 전체 상품 목록
 * @param selectedCategory - 선택된 카테고리
 * @param filters - 공통 필터
 * @param applySorting - 정렬 적용 함수 (useTabSort에서 제공)
 * @returns 필터링 및 정렬이 적용된 최종 상품 목록
 */
export const useProductList = <T extends FilterableProduct>(
  allProducts: T[],
  selectedCategory: string,
  filters: CommonFilters,
  applySorting: (products: T[]) => T[]
): T[] => {
  // 카테고리별 필터링된 상품
  const categoryFiltered = useMemo(() => {
    return selectedCategory === '전체'
      ? allProducts
      : allProducts.filter((product) => product.category === selectedCategory);
  }, [allProducts, selectedCategory]);

  // 공통 필터 적용
  const commonFiltered = useMemo(() => {
    return applyFilters(categoryFiltered, filters);
  }, [categoryFiltered, filters]);

  // 정렬 적용
  const finalProducts = useMemo(() => {
    return applySorting(commonFiltered);
  }, [commonFiltered, applySorting]);

  return finalProducts;
};
