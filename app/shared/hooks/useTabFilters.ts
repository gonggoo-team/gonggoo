/**
 * useTabFilters Hook
 *
 * 탭 콘텐츠에서 사용하는 필터 로직을 재사용 가능한 훅으로 분리합니다.
 * - 카테고리 필터 상태 관리
 * - 공통 필터 상태 관리 (CommonFilters)
 * - 필터 이벤트 리스너 (DeviceEventEmitter)
 */

import { useEffect, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { getDefaultFilters } from '@/app/shared/types/filter.types';
import type { CommonFilters } from '@/app/shared/types/filter.types';

/**
 * useTabFilters Hook
 *
 * @param initialCategory - 초기 선택 카테고리 (기본값: '전체')
 * @param initialPriceRange - 초기 가격 범위 [최소, 최대] (상품 데이터 기반 동적 계산 권장)
 * @returns 필터 상태 및 핸들러
 */
export const useTabFilters = (
  initialCategory: string = '전체',
  initialPriceRange: [number, number] = [100, 100000]
) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [filters, setFilters] = useState<CommonFilters>(
    getDefaultFilters(initialPriceRange)
  );

  // 필터 이벤트 리스너
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'filter:applied',
      (appliedFilters: CommonFilters) => {
        setFilters(appliedFilters);
      }
    );

    return () => subscription.remove();
  }, []);

  return {
    selectedCategory,
    setSelectedCategory,
    filters,
    setFilters,
  };
};
