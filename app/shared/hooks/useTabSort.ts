/**
 * useTabSort Hook
 *
 * 탭 콘텐츠에서 사용하는 정렬 로직을 재사용 가능한 훅으로 분리합니다.
 * - 정렬 옵션 상태 관리
 * - 드롭다운 표시 상태 관리
 * - 정렬 적용 함수
 */

import { useState } from 'react';
import type { ProductCardVerticalData, ProductCardHorizontalData } from '@/app/shared/types/product.types';

/**
 * 정렬 가능한 상품 타입 (공통 필드만 사용)
 */
type SortableProduct = ProductCardVerticalData | ProductCardHorizontalData;

/**
 * 정렬 함수
 */
const sortProducts = <T extends SortableProduct>(
  products: T[],
  sortOption: string
): T[] => {
  return [...products].sort((a, b) => {
    switch (sortOption) {
      case '최신순':
        return (b.createdAt || 0) - (a.createdAt || 0);
      case '오래된 순':
        return (a.createdAt || 0) - (b.createdAt || 0);
      case '인기순':
        return (b.likes || 0) - (a.likes || 0);
      case '할인율 높은 순':
        return (b.discountRate || 0) - (a.discountRate || 0);
      default:
        return 0;
    }
  });
};

/**
 * useTabSort Hook
 *
 * @param initialSort - 초기 정렬 옵션 (기본값: '추천순')
 * @returns 정렬 상태 및 핸들러
 */
export const useTabSort = (initialSort: string = '추천순') => {
  const [selectedSort, setSelectedSort] = useState<string>(initialSort);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSortPress = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSortSelect = (sort: string) => {
    setSelectedSort(sort);
    setIsDropdownVisible(false);
  };

  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
  };

  const applySorting = <T extends SortableProduct>(products: T[]) => {
    return sortProducts(products, selectedSort);
  };

  return {
    selectedSort,
    isDropdownVisible,
    handleSortPress,
    handleSortSelect,
    handleDropdownClose,
    applySorting,
  };
};
