/**
 * ImageSlider Types
 */

export interface ImageSliderProps {
  /** 이미지 URI 배열 */
  images: string[];
  /** 높이 */
  height?: number;
  /** 뒤로가기 버튼 클릭 핸들러 */
  onBackPress?: () => void;
  /** 공유 버튼 클릭 핸들러 */
  onSharePress?: () => void;
  /** 뒤로가기 버튼 표시 여부 */
  showBackButton?: boolean;
  /** 공유 버튼 표시 여부 */
  showShareButton?: boolean;
}
