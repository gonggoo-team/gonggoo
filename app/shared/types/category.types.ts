/**
 * Category Types
 *
 * 카테고리 관련 타입 정의
 */

/**
 * 카테고리 데이터 인터페이스
 */
export interface CategoryData {
  /** 카테고리 고유 ID */
  id: string;
  /** 카테고리 라벨 (표시명) */
  label: string;
  /** 카테고리 슬러그 (URL 등에 사용) */
  slug: string;
}
