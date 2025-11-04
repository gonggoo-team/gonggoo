/**
 * ProductImage Types
 *
 * 상품 이미지 컴포넌트의 타입 정의입니다.
 */

/**
 * ProductImage Props
 */
export interface ProductImageProps {
  /**
   * 이미지 URI
   */
  uri: string;

  /**
   * 이미지 종횡비 (width / height)
   * @example 1 (정사각형), 335/184 (가로형), 106/106 (정사각형)
   */
  aspectRatio: number;

  /**
   * 테두리 표시 여부
   * @default false
   */
  showBorder?: boolean;
}
