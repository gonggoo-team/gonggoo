/**
 * Search Types
 *
 * 검색 관련 타입 정의
 */

/**
 * 인기 검색어 순위 변동 타입
 */
export type RankingChangeType = 'up' | 'down' | 'maintain';

/**
 * 최근 검색어 타입
 */
export interface RecentSearch {
  /** 고유 ID */
  id: string;

  /** 검색어 */
  keyword: string;

  /** 검색 시간 (타임스탬프) */
  timestamp: number;
}

/**
 * 추천 검색어 타입
 */
export interface RecommendedSearch {
  /** 고유 ID */
  id: string;

  /** 검색어 */
  keyword: string;
}

/**
 * 인기 검색어 타입
 */
export interface PopularSearch {
  /** 순위 (1-10) */
  rank: number;

  /** 검색어 */
  keyword: string;

  /** 순위 변동 */
  rankingChange: RankingChangeType;
}

/**
 * 검색 결과 타입 (향후 백엔드 연동용)
 */
export interface SearchResult {
  /** 검색어 */
  query: string;

  /** 상품 ID 목록 */
  productIds: string[];

  /** 검색 결과 개수 */
  totalCount: number;
}
