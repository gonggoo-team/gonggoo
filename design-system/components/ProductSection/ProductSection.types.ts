/**
 * ProductSection Types
 */

import type { ReactNode } from 'react';

export interface ProductSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 섹션 부제목 (제목 하단에 작은 텍스트) */
  subtitle?: string;
  /** 섹션 우측 액션 버튼 라벨 (optional) */
  actionLabel?: string;
  /** 액션 버튼 클릭 이벤트 */
  onActionPress?: () => void;
  /** 섹션 내용 (ProductCard 리스트) */
  children: ReactNode;
  /** 배경색 스타일 (default: 'default') */
  variant?: 'default' | 'highlight';
}
