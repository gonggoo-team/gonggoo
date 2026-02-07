/**
 * useFilterLogic Hook
 *
 * 필터링 로직을 처리하는 커스텀 훅입니다.
 * - 실시간 필터 상태 관리
 * - URL params로 전달받은 상품 데이터 사용
 * - 동적 가격 범위 계산
 */

import { useState, useMemo } from 'react';
import { getMockDeadlineProducts } from '@/app/shared/services/mock';
import { applyFilters } from '@/app/shared/utils/filterProducts';
import { DEFAULT_SLOT_RANGES, DEFAULT_RECRUITMENT_STATUSES } from '@/app/shared/constants/filter.constants';
import type { CommonFilters, PriceRangeBounds } from '@/app/shared/types/filter.types';

/**
 * 배열 비교 헬퍼 함수 (순서 무관)
 */
const arraysEqual = <T>(arr1: readonly T[], arr2: readonly T[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, idx) => val === sorted2[idx]);
};

export const useFilterLogic = (
  initialFilters: CommonFilters,
  priceRangeBounds: PriceRangeBounds,
  baseProductCount?: number,  // 필터 전 상품 개수 (검색 결과 또는 탭의 실제 상품 개수)
  productIds?: string[]  // 필터링 대상 상품 ID 배열 (검색 결과 또는 탭의 상품 ID)
) => {
  const [filters, setFilters] = useState<CommonFilters>(initialFilters);

  // 필터링 대상 데이터 로드
  const allProducts = useMemo(() => {
    const mockData = getMockDeadlineProducts();

    // productIds가 있으면 해당 ID만 필터링 대상으로 사용 (검색 결과 범위 내)
    if (productIds && productIds.length > 0) {
      return mockData.filter((p) => productIds.includes(p.id));
    }

    // productIds가 없으면 전체 데이터 사용 (동네/오늘마감 탭)
    return mockData;
  }, [productIds]);

  // 필터링된 상품 목록 (공통 유틸리티 함수 사용)
  const filteredProducts = useMemo(() => {
    return applyFilters(allProducts, filters);
  }, [allProducts, filters]);

  // 필터링된 상품 개수
  // 필터 조건이 초기 상태일 때는 baseProductCount 사용 (검색 결과/탭의 실제 개수)
  // 필터 조건이 변경되면 실제 필터링 계산
  const filteredCount = useMemo(() => {
    // 필터 조건이 초기 상태인지 확인 (하드코딩 제거, 동적 비교)
    const isDefaultFilters =
      !filters.isReservationAvailable &&
      filters.priceRange[0] === priceRangeBounds.min &&
      filters.priceRange[1] === priceRangeBounds.max &&
      arraysEqual(filters.slotRanges, DEFAULT_SLOT_RANGES) &&
      arraysEqual(filters.recruitmentStatuses, DEFAULT_RECRUITMENT_STATUSES);

    // 초기 상태일 때는 baseProductCount 사용
    if (isDefaultFilters && baseProductCount !== undefined) {
      return baseProductCount;
    }

    // 필터 조건이 변경되면 실제 계산
    return filteredProducts.length;
  }, [filters, filteredProducts.length, baseProductCount, priceRangeBounds]);

  // 실시간 가격 범위 계산 (필터링된 상품 기준)
  const dynamicPriceRange: PriceRangeBounds = useMemo(() => {
    if (filteredProducts.length === 0) {
      // 필터링된 결과가 없으면 전체 상품 기준 범위 사용
      return priceRangeBounds;
    }

    const prices = filteredProducts.map((p) => p.pricePerSlot);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    // 최소 범위 보장
    if (min === max) {
      return { min: Math.max(0, min - 10000), max: max + 10000 };
    }

    return { min, max };
  }, [filteredProducts, priceRangeBounds]);

  // 필터 초기화
  const resetFilters = (defaultFilters: CommonFilters) => {
    setFilters(defaultFilters);
  };

  // 개별 필터 업데이트
  const updateFilter = <K extends keyof CommonFilters>(
    key: K,
    value: CommonFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    filters,
    setFilters,
    filteredCount,
    filteredProducts,
    resetFilters,
    updateFilter,
    // 동적 가격 범위 추가
    priceRangeBounds, // 초기 범위는 URL params에서 전달받음
    dynamicPriceRange, // 필터링된 상품 기준 범위
  };
};
