/**
 * Mock Category Data
 *
 * 카테고리 테스트 데이터
 * 추후 백엔드 API로 교체 예정
 */

import type { CategoryData } from '@/app/shared/types/category.types';

/**
 * 전체 카테고리 목록 (8개)
 * Figma 디자인 기준: 2열 × 4행 그리드
 */
export const getMockCategories = (): CategoryData[] => [
  {
    id: '1',
    label: '식품',
    slug: 'food',
  },
  {
    id: '2',
    label: '생활',
    slug: 'living',
  },
  {
    id: '3',
    label: '육아',
    slug: 'childcare',
  },
  {
    id: '4',
    label: '애완용품',
    slug: 'pet',
  },
  {
    id: '5',
    label: '가전',
    slug: 'electronics',
  },
  {
    id: '6',
    label: '주방',
    slug: 'kitchen',
  },
  {
    id: '7',
    label: '리빙',
    slug: 'interior',
  },
  {
    id: '8',
    label: '기타',
    slug: 'etc',
  },
];
