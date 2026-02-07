/**
 * Product and Banner Types
 *
 * 상품, 배너 등의 공통 타입 정의
 * 백엔드 API 스펙과 일치하는 완전한 타입 정의
 */

/**
 * 상품 이미지
 */
export interface ProductImage {
  id: string;
  uri: string;
  order: number; // 0이 대표 이미지
}

/**
 * 거래 장소 정보
 */
export interface MeetingLocation {
  address: string;      // "서울 강남구 강남대로 지하 396"
  placeName: string;    // "강남역 10번 출구"
  latitude: number;
  longitude: number;
  detailAddress?: string; // "1층 엘리베이터 근처", "카페 안" 등 세부 위치
}

/**
 * 거래 정보
 */
export interface TransactionDetails {
  meetingLocation: MeetingLocation;
  meetingTime: string;      // "평일 저녁 18:00~21:00"
  deliveryAvailable: boolean;
  deliveryFee?: number;     // 택배비 (원), undefined면 무료 배송
}

/**
 * 상품 설명
 */
export interface ProductDescription {
  features: string;      // 상품 특징/스펙
  groupBuyReason: string; // 공구 이유
  notes: string;         // 주의사항
}

/**
 * 배지 타입
 */
export type BadgeType = 'deadline' | 'remaining' | 'recruiting' | 'closed';

export interface Badge {
  type: BadgeType;
  label: string;
}

/**
 * 타겟 성별 타입
 */
export type TargetGender = '성별 전체' | '남성' | '여성';

/**
 * 타겟 연령대 타입
 */
export type TargetAge = '연령대 전체' | '10대' | '20대' | '30대' | '40대' | '50대 이상';

/**
 * 모집 상태 타입
 */
export type RecruitmentStatus = '모집 중' | '마감 임박' | '모집 완료' | '거래 완료';

/**
 * 광고 배너 아이템
 */
export interface AdBannerItem {
  id: string;
  imageUri: string;
  link: string;
}

/**
 * 세로형 상품 카드 데이터
 */
export interface ProductCardVerticalData {
  id: string;
  imageUri: string;
  title: string;
  price: number;
  pricePerSlot: number;
  priceLabelValue?: number;
  badges?: Badge[];
  isClosed?: boolean;
  likes?: number;
  progress?: number;
  showProgress?: boolean;
  priceStrikethrough?: boolean;
  /** 카테고리 (필터링용) */
  category: string;
  /** 생성 시간 (정렬용, Unix timestamp) */
  createdAt: number;
  /** 할인율 (정렬용, 0-100) */
  discountRate: number;
  /** 예약 가능 여부 (필터링용) */
  isReservationAvailable: boolean;
  /** 모집 슬롯 수 (필터링용) */
  slotCount: number;
  /** 모집 상태 (필터링용) */
  recruitmentStatus: RecruitmentStatus;
  /** 타겟 성별 (인기 탭 필터링용) */
  targetGender: TargetGender;
  /** 타겟 연령대 (인기 탭 필터링용) */
  targetAge: TargetAge;
  /** 주소 (동네 필터링용) */
  address?: string;
  /** 위도 (거리 기반 필터링용) */
  latitude?: number;
  /** 경도 (거리 기반 필터링용) */
  longitude?: number;
  /** 공구장 ID (개최중 탭 필터링용) */
  hostId?: string;
}

/**
 * 가로형 상품 카드 데이터
 */
export interface ProductCardHorizontalData {
  id: string;
  imageUri: string;
  title: string;
  price: number;
  pricePerSlot: number;
  buyersCount: number;
  progress: number;
  badges: Badge[];
  category?: string; // 카테고리 (검색 결과 필터링용)
  /** 생성 시간 (정렬용, Unix timestamp) */
  createdAt?: number;
  /** 좋아요 수 (정렬용) */
  likes?: number;
  /** 할인율 (정렬용, 0-100) */
  discountRate?: number;
  /** 예약 가능 여부 (필터링용) */
  isReservationAvailable?: boolean;
  /** 모집 슬롯 수 (필터링용) */
  slotCount?: number;
  /** 모집 상태 (필터링용) */
  recruitmentStatus?: RecruitmentStatus;
  /** 주소 (동네 필터링용) */
  address?: string;
  /** 위도 (거리 기반 필터링용) */
  latitude?: number;
  /** 경도 (거리 기반 필터링용) */
  longitude?: number;
  /** 공구장 ID (개최중 탭 필터링용) */
  hostId?: string;
}

/**
 * 대형 상품 카드 데이터 (Featured)
 */
export interface FeaturedProductData {
  id: string;
  imageUri: string;
  title: string;
  price: number;
  pricePerSlot: number;
  likes: number;
  progress: number;
  badges: Badge[];
  description: string;
}

/**
 * 공구장 정보
 */
export interface HostInfo {
  /** 공구장 ID */
  id: string;
  /** 공구장 닉네임 */
  nickname: string;
  /** 프로필 이미지 URI */
  profileImageUri?: string;
  /** 평점 (0-10) */
  rating: number;
  /** 리뷰 개수 */
  reviewCount?: number;
}

/**
 * 참여자 정보
 */
export interface Participant {
  /** 참여자 ID */
  id: string;
  /** 프로필 이미지 URI */
  profileImageUri?: string;
  /** 닉네임 */
  nickname?: string;
}

/**
 * 거래 정보
 */
export interface TransactionInfo {
  /** 거래 장소 */
  location: string;
  /** 위도 */
  latitude: number;
  /** 경도 */
  longitude: number;
  /** 거래 시간 */
  timeDescription: string;
  /** 택배 가능 여부 */
  deliveryAvailable: boolean;
}

/**
 * 공구 정보
 */
export interface GroupBuyInfo {
  /** 총 슬롯 수 */
  totalSlots: number;
  /** 슬롯당 수량 설명 (예: "티슈 2팩") */
  quantityPerSlot: string;
  /** 공구 상세 설명 */
  description: string;
}

/**
 * 상품 상세 페이지 데이터
 */
export interface ProductDetailData {
  /** 상품 ID */
  id: string;
  /** 카테고리 */
  category: string;
  /** 상품 제목 */
  title: string;
  /** 이미지 URI 배열 (슬라이더용) */
  imageUris: string[];
  /** 총 가격 */
  price: number;
  /** 슬롯당 가격 */
  pricePerSlot: number;
  /** 좋아요 수 */
  likes: number;
  /** 배지 목록 */
  badges: Badge[];
  /** 모집 상태 */
  recruitmentStatus: RecruitmentStatus;
  /** 남은 시간 (일 단위, 예: 14) */
  daysRemaining: number;

  /** 공구팟 진행 상황 */
  progress: {
    /** 현재 참여자 수 */
    participantCount: number;
    /** 총 슬롯 수 */
    totalSlots: number;
    /** 진행률 (0-100) */
    percentage: number;
  };

  /** 공구 정보 */
  groupBuyInfo: GroupBuyInfo;

  /** 공구장 정보 */
  host: HostInfo;

  /** 참여자 목록 (최대 4명 표시) */
  participants: Participant[];

  /** 거래 정보 */
  transaction: TransactionInfo;

  /** 신고하기 가능 여부 */
  reportable?: boolean;
}
