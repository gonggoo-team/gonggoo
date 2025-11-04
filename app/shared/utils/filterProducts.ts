/**
 * filterProducts Utility
 *
 * 공통 필터링 로직을 제공하는 유틸리티 함수입니다.
 * 여러 화면에서 동일한 필터링 로직을 재사용할 수 있습니다.
 */

import type { ProductCardVerticalData, ProductCardHorizontalData } from '@/app/shared/types/product.types';
import type { CommonFilters, PriceRangeBounds } from '@/app/shared/types/filter.types';

/**
 * 필터링 가능한 상품 타입 (공통 필드만 사용)
 */
type FilterableProduct = ProductCardVerticalData | ProductCardHorizontalData;

/**
 * 슬롯 범위 문자열을 [min, max]로 파싱
 * 예: "1~4슬롯" → [1, 4]
 */
const parseSlotRange = (rangeStr: string): [number, number] => {
  if (rangeStr.includes('이상')) {
    const min = parseInt(rangeStr.replace(/[^\d]/g, ''), 10);
    return [min, Infinity];
  }

  const numbers = rangeStr.match(/\d+/g);
  if (!numbers || numbers.length < 2) {
    return [0, Infinity];
  }

  return [parseInt(numbers[0], 10), parseInt(numbers[1], 10)];
};

/**
 * 상품 배열에서 가격 범위(pricePerSlot 기준)를 계산합니다.
 * 계산된 범위는 1000원 단위로 반올림됩니다.
 *
 * @param products - 가격 범위를 계산할 상품 배열
 * @returns 최소/최대 가격 범위 (1000원 단위 반올림)
 *
 * @example
 * const products = [{ pricePerSlot: 5500 }, { pricePerSlot: 12300 }];
 * calculatePriceRange(products); // { min: 5000, max: 13000 }
 */
export const calculatePriceRange = <T extends FilterableProduct>(
  products: T[]
): PriceRangeBounds => {
  if (products.length === 0) {
    return { min: 100, max: 100000 }; // 기본값
  }

  const prices = products.map((product) => product.pricePerSlot);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // 1000원 단위로 반올림 (최소는 내림, 최대는 올림)
  const roundedMin = Math.floor(minPrice / 1000) * 1000;
  const roundedMax = Math.ceil(maxPrice / 1000) * 1000;

  return { min: roundedMin, max: roundedMax };
};

/**
 * 상품 목록에 필터 조건을 적용합니다.
 *
 * 모든 필터는 AND 조건으로 적용됩니다 (모든 조건을 동시에 만족해야 함).
 *
 * @param products - 필터링할 상품 목록
 * @param filters - 적용할 필터 조건
 * @returns 필터링된 상품 목록
 *
 * @description
 * ## 필터 적용 순서 및 로직
 *
 * ### 1. 예약 가능 필터 (isReservationAvailable)
 * - `false` (기본값): 모든 상품 포함
 * - `true`: `isReservationAvailable === true`인 상품만 포함
 *
 * ### 2. 가격 범위 필터 (priceRange)
 * - `pricePerSlot` 기준으로 필터링
 * - 범위: `[minPrice, maxPrice]`
 * - 조건: `minPrice <= pricePerSlot <= maxPrice`
 * - 슬라이더 또는 가격 버튼으로 설정 가능
 *
 * ### 3. 슬롯 범위 필터 (slotRanges)
 * - **모두 선택** (`['1~4슬롯', '5~8슬롯', '9~12슬롯', '13슬롯 이상']`):
 *   → 모든 슬롯 수 포함
 * - **일부 선택** (예: `['1~4슬롯', '5~8슬롯']`):
 *   → 선택된 범위에 속하는 슬롯만 포함 (OR 조건)
 * - **모두 해제** (`[]`):
 *   → 빈 배열 반환 (아무것도 표시 안함)
 * - **범위 파싱**:
 *   - `"1~4슬롯"` → `[1, 4]` (1 이상 4 이하)
 *   - `"13슬롯 이상"` → `[13, Infinity]` (13 이상)
 *
 * ### 4. 모집 상태 필터 (recruitmentStatuses)
 * - **모두 선택** (예: `['모집 중', '마감 임박', '모집 완료']`):
 *   → 선택된 상태만 포함
 * - **"모집 완료 제외" 특수 처리**:
 *   - `['모집 중', '마감 임박', '모집 완료 제외']` 포함 시:
 *     → `recruitmentStatus === '모집 완료'`인 상품 **제외**
 *     → 다른 조건은 무시됨 (제외 조건이 우선)
 *   - `['모집 중', '마감 임박']` (기본값):
 *     → 선택된 상태만 포함
 * - **모두 해제** (`[]`):
 *   → 빈 배열 반환 (아무것도 표시 안함)
 *
 * ## 필터 조합 예시
 *
 * @example
 * // 예시 1: 기본 상태 (모든 필터 해제)
 * const result1 = applyFilters(products, {
 *   isReservationAvailable: false,
 *   priceRange: [100, 1000000],
 *   slotRanges: ['1~4슬롯', '5~8슬롯', '9~12슬롯', '13슬롯 이상'],
 *   recruitmentStatuses: ['모집 중', '마감 임박'],
 * });
 * // → 모든 상품 중 '모집 중' 또는 '마감 임박' 상태만 포함
 *
 * @example
 * // 예시 2: 슬롯 범위 모두 해제
 * const result2 = applyFilters(products, {
 *   isReservationAvailable: false,
 *   priceRange: [100, 1000000],
 *   slotRanges: [], // 모두 해제
 *   recruitmentStatuses: ['모집 중'],
 * });
 * // → 빈 배열 반환 (슬롯 범위가 없으므로)
 *
 * @example
 * // 예시 3: 예약 가능 + 가격 1만원 이하 + 슬롯 1~4개
 * const result3 = applyFilters(products, {
 *   isReservationAvailable: true,
 *   priceRange: [100, 10000],
 *   slotRanges: ['1~4슬롯'],
 *   recruitmentStatuses: ['모집 중', '마감 임박'],
 * });
 * // → 예약 가능 AND 가격 1만원 이하 AND 슬롯 1~4개 AND (모집 중 OR 마감 임박)
 *
 * @example
 * // 예시 4: 모집 완료 제외
 * const result4 = applyFilters(products, {
 *   isReservationAvailable: false,
 *   priceRange: [100, 1000000],
 *   slotRanges: ['1~4슬롯', '5~8슬롯'],
 *   recruitmentStatuses: ['모집 중', '마감 임박', '모집 완료 제외'],
 * });
 * // → 모집 완료 상태가 아닌 모든 상품 (다른 recruitmentStatuses는 무시됨)
 *
 * @example
 * // 예시 5: 복합 조건 (모든 필터 활성)
 * const result5 = applyFilters(products, {
 *   isReservationAvailable: true,
 *   priceRange: [5000, 50000],
 *   slotRanges: ['5~8슬롯', '9~12슬롯'],
 *   recruitmentStatuses: ['모집 중'],
 * });
 * // → 예약 가능 AND 5천~5만원 AND (5~8 OR 9~12 슬롯) AND 모집 중
 *
 * ## 엣지 케이스
 *
 * - **빈 상품 배열**: `[]` 반환
 * - **필터 없음** (모든 체크박스 해제): 빈 배열 반환
 * - **가격 범위 벗어남**: 해당 상품 제외
 * - **상품에 필드 없음** (예: `slotCount === undefined`): 해당 필터 조건 스킵
 *
 * @see {@link CommonFilters} 필터 타입 정의
 * @see {@link DEFAULT_SLOT_RANGES} 기본 슬롯 범위 상수
 * @see {@link DEFAULT_RECRUITMENT_STATUSES} 기본 모집 상태 상수
 */
export const applyFilters = <T extends FilterableProduct>(
  products: T[],
  filters: CommonFilters
): T[] => {
  return products.filter((product) => {
    // 1. 예약가능 체크
    if (filters.isReservationAvailable && !product.isReservationAvailable) {
      return false;
    }

    // 2. 가격 범위 체크 (pricePerSlot 기준)
    const [minPrice, maxPrice] = filters.priceRange;
    if (
      product.pricePerSlot < minPrice ||
      product.pricePerSlot > maxPrice
    ) {
      return false;
    }

    // 3. 슬롯 범위 체크
    if (filters.slotRanges.length > 0 && product.slotCount !== undefined) {
      const isInSlotRange = filters.slotRanges.some((range) => {
        const [min, max] = parseSlotRange(range);
        return product.slotCount! >= min && product.slotCount! <= max;
      });
      if (!isInSlotRange) {
        return false;
      }
    }

    // 4. 모집 상태 체크
    if (filters.recruitmentStatuses.length > 0 && product.recruitmentStatus) {
      // "모집 완료 제외" 처리
      if (filters.recruitmentStatuses.includes('모집 완료 제외')) {
        if (product.recruitmentStatus === '모집 완료') {
          return false;
        }
      } else {
        // 일반 모집 상태 체크
        if (!filters.recruitmentStatuses.includes(product.recruitmentStatus)) {
          return false;
        }
      }
    }

    return true;
  });
};
