/**
 * CategoryItem Component Types
 */

export interface CategoryItemProps {
  /** 카테고리 라벨 */
  label: string;
  /** 클릭 핸들러 */
  onPress: () => void;
  /** 하단 테두리 표시 여부 (기본값: true) */
  showBorder?: boolean;
}
