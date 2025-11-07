/**
 * Search Service
 *
 * 검색 관련 비즈니스 로직 및 AsyncStorage 연동
 * - 최근 검색어: AsyncStorage에 영구 저장
 * - 인기/추천 검색어: 백엔드 API 연동 예정 (현재 Mock 데이터)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  PopularSearch,
  RecentSearch,
  RecommendedSearch,
} from '../types/search';
import type { ProductCardHorizontalData, ProductCardVerticalData } from '../types/product.types';

/**
 * AsyncStorage Keys
 */
const STORAGE_KEYS = {
  RECENT_SEARCHES: '@gonggoo/recent_searches',
} as const;

/**
 * Constants
 */
const MAX_RECENT_SEARCHES = 20; // 최근 검색어 최대 개수

/**
 * 테스트용 인기 검색어 데이터 (실시간 업데이트 기준: 16:30)
 * Figma 디자인에 표시된 데이터 기반
 */
export const MOCK_POPULAR_SEARCHES: PopularSearch[] = [
  { rank: 1, keyword: '동원참치 캔 40ea', rankingChange: 'up' },
  { rank: 2, keyword: '크리넥스 휴지', rankingChange: 'down' },
  { rank: 3, keyword: '무지 베이직 반팔 티', rankingChange: 'up' },
  { rank: 4, keyword: '고양이 간식', rankingChange: 'maintain' },
  { rank: 5, keyword: '오리젠 강아지 사료', rankingChange: 'maintain' },
  { rank: 6, keyword: '코스트코 세제', rankingChange: 'down' },
  { rank: 7, keyword: '코스트코 치약', rankingChange: 'maintain' },
  { rank: 8, keyword: '코스트코 신라면', rankingChange: 'up' },
  { rank: 9, keyword: '동원참치 캔 20ea', rankingChange: 'down' },
  { rank: 10, keyword: '동원참치 캔 20ea', rankingChange: 'maintain' },
];

/**
 * 테스트용 추천 검색어 데이터
 * Figma 디자인에 표시된 데이터 기반
 */
export const MOCK_RECOMMENDED_SEARCHES: RecommendedSearch[] = [
  { id: 'rec-1', keyword: '크리넥스 3겹 천연펄프' },
  { id: 'rec-2', keyword: '동원' },
  { id: 'rec-3', keyword: '오리온' },
  { id: 'rec-4', keyword: '건강백서' },
  { id: 'rec-5', keyword: '강아지 간식' },
  { id: 'rec-6', keyword: '고양이 사료' },
  { id: 'rec-7', keyword: '휴지' },
  { id: 'rec-8', keyword: '세제' },
  { id: 'rec-9', keyword: '치약' },
];

/**
 * 테스트용 최근 검색어 데이터 (초기 데이터, 첫 실행 시에만 사용)
 * Figma 디자인에 표시된 데이터 기반
 */
export const MOCK_RECENT_SEARCHES: RecentSearch[] = [
  { id: 'recent-1', keyword: '고양이 간식', timestamp: Date.now() - 1000 * 60 * 5 },
  { id: 'recent-2', keyword: '프로틴 바', timestamp: Date.now() - 1000 * 60 * 10 },
  { id: 'recent-3', keyword: '고양이 캔', timestamp: Date.now() - 1000 * 60 * 15 },
  { id: 'recent-4', keyword: '휴지', timestamp: Date.now() - 1000 * 60 * 20 },
];

/**
 * UUID 생성 (간단한 버전)
 */
function generateId(): string {
  return `recent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * SearchService 클래스
 * 향후 백엔드 API 연동 및 로컬 스토리지 관리를 담당
 */
export class SearchService {
  /**
   * 인기 검색어 가져오기
   * TODO: 백엔드 API 연동
   */
  static async getPopularSearches(): Promise<PopularSearch[]> {
    // 시뮬레이션: 네트워크 지연
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_POPULAR_SEARCHES;
  }

  /**
   * 추천 검색어 가져오기
   * TODO: 백엔드 API 연동
   */
  static async getRecommendedSearches(): Promise<RecommendedSearch[]> {
    // 시뮬레이션: 네트워크 지연
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_RECOMMENDED_SEARCHES;
  }

  /**
   * 최근 검색어 가져오기
   * AsyncStorage에서 읽어옴 (없으면 빈 배열 반환)
   */
  static async getRecentSearches(): Promise<RecentSearch[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      if (stored) {
        const parsed: RecentSearch[] = JSON.parse(stored);
        // 타임스탬프 순으로 정렬 (최신순)
        return parsed.sort((a, b) => b.timestamp - a.timestamp);
      }
      // 첫 실행: 초기 데이터 저장 후 반환
      await AsyncStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify(MOCK_RECENT_SEARCHES)
      );
      return MOCK_RECENT_SEARCHES;
    } catch (error) {
      console.error('[SearchService] 최근 검색어 가져오기 실패:', error);
      return [];
    }
  }

  /**
   * 최근 검색어 추가
   * - 동일한 검색어가 있으면 최상단으로 이동 (timestamp 갱신)
   * - 최대 개수 초과 시 가장 오래된 항목 삭제
   */
  static async addRecentSearch(keyword: string): Promise<void> {
    try {
      const trimmed = keyword.trim();
      if (!trimmed) return;

      const current = await this.getRecentSearches();

      // 중복 제거 (동일 검색어 제거)
      const filtered = current.filter((item) => item.keyword !== trimmed);

      // 새 항목 추가 (최상단)
      const newItem: RecentSearch = {
        id: generateId(),
        keyword: trimmed,
        timestamp: Date.now(),
      };

      const updated = [newItem, ...filtered];

      // 최대 개수 제한
      const limited = updated.slice(0, MAX_RECENT_SEARCHES);

      await AsyncStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify(limited)
      );

      console.log('[SearchService] 최근 검색어 추가:', trimmed);
    } catch (error) {
      console.error('[SearchService] 최근 검색어 추가 실패:', error);
    }
  }

  /**
   * 최근 검색어 삭제 (개별)
   */
  static async removeRecentSearch(id: string): Promise<void> {
    try {
      const current = await this.getRecentSearches();
      const updated = current.filter((item) => item.id !== id);

      await AsyncStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify(updated)
      );

      console.log('[SearchService] 최근 검색어 삭제:', id);
    } catch (error) {
      console.error('[SearchService] 최근 검색어 삭제 실패:', error);
    }
  }

  /**
   * 최근 검색어 전체 삭제
   */
  static async clearRecentSearches(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.RECENT_SEARCHES,
        JSON.stringify([])
      );

      console.log('[SearchService] 최근 검색어 전체 삭제');
    } catch (error) {
      console.error('[SearchService] 최근 검색어 전체 삭제 실패:', error);
    }
  }

  /**
   * 검색 실행
   * TODO: 백엔드 API 연동
   */
  static async search(query: string): Promise<void> {
    console.log('[SearchService] 검색 실행:', query);
    // TODO: 실제 검색 로직 구현 및 결과 페이지로 이동
  }

  /**
   * 상품 검색 (가로형 카드용)
   * Mock 데이터를 검색어로 필터링하여 반환
   * TODO: 백엔드 API 연동
   */
  static async searchProducts(query: string): Promise<ProductCardVerticalData[]> {
    // 시뮬레이션: 네트워크 지연
    await new Promise((resolve) => setTimeout(resolve, 300));

    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      return [];
    }

    // getAllProducts()에서 모든 상품 가져오기
    const { getAllProducts } = await import('./mock/products.mock');
    const allProducts = getAllProducts();

    // 검색어로 필터링 후 세로형 카드 포맷으로 변환 (검색 결과 화면은 2열 그리드)
    const results: ProductCardVerticalData[] = allProducts
      .filter((product) => product.title.toLowerCase().includes(trimmedQuery))
      .map((product) => ({
        id: product.id,
        imageUri: product.imageUri,
        title: product.title,
        price: product.price,
        pricePerSlot: product.pricePerSlot,
        priceLabelValue: product.priceLabelValue,
        badges: product.badges,
        isClosed: product.isClosed,
        likes: product.likes,
        progress: product.progress,
        showProgress: product.showProgress ?? true,
        category: product.category,
        createdAt: product.createdAt,
        discountRate: product.discountRate,
        isReservationAvailable: product.isReservationAvailable,
        slotCount: product.slotCount,
        recruitmentStatus: product.recruitmentStatus,
        targetGender: product.targetGender,
        targetAge: product.targetAge,
      }));

    console.log(
      `[SearchService] 검색 완료: "${query}" - ${results.length}개 상품 발견`
    );

    return results;
  }

  /**
   * 상품 검색 (가로형 카드용 - 레거시)
   * 하위 호환성을 위해 유지
   * @deprecated searchProducts() 사용 권장
   */
  static async searchProductsHorizontal(query: string): Promise<ProductCardHorizontalData[]> {
    const verticalResults = await this.searchProducts(query);

    // ProductCardVerticalData → ProductCardHorizontalData 변환
    return verticalResults.map((product) => ({
      id: product.id,
      imageUri: product.imageUri,
      title: product.title,
      price: product.price,
      pricePerSlot: product.pricePerSlot,
      buyersCount: Math.floor(product.progress ?? 0 / 2),
      progress: product.progress ?? 0,
      badges: product.badges ?? [],
      category: product.category,
      createdAt: product.createdAt,
      likes: product.likes,
      discountRate: product.discountRate,
      isReservationAvailable: product.isReservationAvailable,
      slotCount: product.slotCount,
      recruitmentStatus: product.recruitmentStatus,
    }));
  }
}
