/**
 * HostInfoSection Types
 */

export interface HostInfo {
  /** 공구장 ID */
  id: string;

  /** 닉네임 */
  nickname: string;

  /** 프로필 이미지 URI */
  profileImageUri?: string;

  /** 평점 (0-10) */
  rating: number;
}

export interface OtherProduct {
  /** 상품 ID */
  id: string;

  /** 썸네일 이미지 URI */
  imageUri?: string;
}

export interface HostInfoSectionProps {
  /** 공구장 정보 */
  host: HostInfo;

  /** 다른 공구글 목록 */
  otherProducts?: OtherProduct[];

  /** 공구장 프로필 클릭 핸들러 */
  onHostPress?: (hostId: string) => void;

  /** 상품 클릭 핸들러 */
  onProductPress?: (productId: string) => void;
}
