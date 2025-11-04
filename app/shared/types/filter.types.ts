/**
 * Filter Types
 *
 * 필터 관련 타입 정의
 */

import { DEFAULT_SLOT_RANGES, DEFAULT_RECRUITMENT_STATUSES } from '@/app/shared/constants/filter.constants';

/**
 * 가격 범위 메타데이터 타입
 */
export interface PriceRangeBounds {
  /** 최소 가격 */
  min: number;
  /** 최대 가격 */
  max: number;
}

/**
 * 공통 필터 상태 타입
 */
export interface CommonFilters {
  /** 예약가능 공구만 보기 */
  isReservationAvailable: boolean;
  /** 가격 범위 [최소, 최대] */
  priceRange: [number, number];
  /** 선택된 가격 버튼 (버튼 선택 시 식별용) */
  selectedPriceButton: string | null;
  /** 모집 슬롯 범위 */
  slotRanges: string[];
  /** 모집 상태 */
  recruitmentStatuses: string[];
}

/**
 * 가격 버튼 설정 타입
 */
export interface PriceButtonConfig {
  label: string;
  min: number;
  max: number;
}

/**
 * 가격 범위에 따라 동적으로 가격 버튼 생성
 */
export const generatePriceButtons = (
  minPrice: number,
  maxPrice: number
): PriceButtonConfig[] => {
  const buttons: PriceButtonConfig[] = [];
  const range = maxPrice - minPrice;

  // 범위에 따라 적절한 구간 설정
  if (range <= 10000) {
    // 1만원 이하: 2-3개 버튼
    const mid = Math.floor((minPrice + maxPrice) / 2 / 1000) * 1000;
    buttons.push({ label: `${(minPrice / 1000).toFixed(0)}천원 이하`, min: minPrice, max: mid });
    buttons.push({ label: `${(mid / 1000).toFixed(0)}천원 이상`, min: mid, max: maxPrice });
  } else if (range <= 50000) {
    // 5만원 이하: 3-4개 버튼
    buttons.push({ label: '1만원 이하', min: minPrice, max: 10000 });
    if (maxPrice > 30000) {
      buttons.push({ label: '1~3만원', min: 10000, max: 30000 });
      buttons.push({ label: '3만원 이상', min: 30000, max: maxPrice });
    } else {
      buttons.push({ label: '1만원 이상', min: 10000, max: maxPrice });
    }
  } else if (range <= 200000) {
    // 20만원 이하: 4-5개 버튼
    buttons.push({ label: '1만원 이하', min: minPrice, max: 10000 });
    buttons.push({ label: '1~5만원', min: 10000, max: 50000 });
    buttons.push({ label: '5~10만원', min: 50000, max: 100000 });
    if (maxPrice > 150000) {
      buttons.push({ label: '10~15만원', min: 100000, max: 150000 });
      buttons.push({ label: '15만원 이상', min: 150000, max: maxPrice });
    } else {
      buttons.push({ label: '10만원 이상', min: 100000, max: maxPrice });
    }
  } else {
    // 20만원 이상: 기존 로직 유지
    buttons.push({ label: '1만원 이하', min: minPrice, max: 10000 });
    buttons.push({ label: '1~5만원', min: 10000, max: 50000 });
    buttons.push({ label: '5~10만원', min: 50000, max: 100000 });
    buttons.push({ label: '10~20만원', min: 100000, max: 200000 });
    if (maxPrice > 300000) {
      buttons.push({ label: '20~30만원', min: 200000, max: 300000 });
      buttons.push({ label: '30만원 이상', min: 300000, max: maxPrice });
    } else {
      buttons.push({ label: '20만원 이상', min: 200000, max: maxPrice });
    }
  }

  // 실제 범위 내에서만 버튼 필터링
  return buttons.filter((btn) => btn.max > minPrice && btn.min < maxPrice);
};

/**
 * 기본 필터 값 (하드코딩된 가격 범위 - 하위 호환성 유지)
 * @deprecated 대신 getDefaultFilters() 사용 권장
 */
export const DEFAULT_FILTERS: CommonFilters = {
  isReservationAvailable: false,
  priceRange: [100, 100000],
  selectedPriceButton: null,
  slotRanges: [...DEFAULT_SLOT_RANGES],
  recruitmentStatuses: [...DEFAULT_RECRUITMENT_STATUSES],
};

/**
 * 동적 가격 범위를 받아 기본 필터 값 생성
 * @param priceRange 실제 상품 데이터 기반 가격 범위 [최소, 최대]
 * @returns 동적 가격 범위가 적용된 기본 필터
 */
export const getDefaultFilters = (priceRange: [number, number]): CommonFilters => {
  return {
    isReservationAvailable: false,
    priceRange,
    selectedPriceButton: null,
    slotRanges: [...DEFAULT_SLOT_RANGES],
    recruitmentStatuses: [...DEFAULT_RECRUITMENT_STATUSES],
  };
};
