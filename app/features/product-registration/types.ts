/**
 * Product Registration Types
 */

/**
 * 상품 등록 폼 데이터
 */
export interface ProductRegistrationFormData {
  /** 이미지 URI 배열 (최대 10개) */
  images: string[];

  /** 제목 */
  title: string;

  /** 나눔 여부 */
  isFree: boolean;

  /** 가격 */
  price: string;

  /** 기간 */
  period: {
    startDate?: Date;
    endDate?: Date;
  } | null;

  /** 슬롯 수 */
  slots: number;

  /** 추가 설명 */
  description: string;

  /** 위치 */
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
    time?: string;
  } | null;

  /** 택배 가능 여부 */
  isDeliveryAvailable: boolean;
}

/**
 * 이미지 정보
 */
export interface ImageInfo {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
}
