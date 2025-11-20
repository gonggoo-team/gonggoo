/**
 * SwipeableProductList Types
 */

/**
 * 스와이프 액션 확인 모달 설정
 */
export interface SwipeActionConfirmModal {
  /** 모달 타이틀 */
  title: string;
  /** 모달 설명 (배열: 각 줄) */
  descriptions: string[];
  /** 취소 버튼 텍스트 (기본값: "취소") */
  cancelText?: string;
  /** 확인 버튼 텍스트 (기본값: "확인") */
  confirmText?: string;
}

/**
 * 스와이프 액션 버튼 설정
 */
export interface SwipeAction {
  /** 액션 라벨 (줄바꿈 지원: "공구\n수정") */
  label: string;
  /** 배경색 */
  backgroundColor: string;
  /** 텍스트 색상 */
  textColor: string;
  /** 버튼 너비 (px) */
  width: number;
  /** 액션 실행 핸들러 */
  onPress: (item: SwipeableProductItem) => void;
  /**
   * 확인 모달 설정 (선택적)
   * - 설정 시: 모달 확인 후 onPress 실행
   * - 미설정 시: onPress 즉시 실행
   */
  confirmModal?: SwipeActionConfirmModal;
}

export interface SwipeableProductSection {
  /** 섹션 제목 */
  title: string;
  /** 섹션 데이터 */
  data: SwipeableProductItem[];
}

export interface SwipeableProductItem {
  /** 상품 고유 ID */
  id: string;
  /** 상품 이미지 URI */
  imageUri: string;
  /** 상품 제목 */
  title: string;
  /** 전체 가격 (optional) */
  price?: number;
  /** 슬롯당 가격 (optional) */
  pricePerSlot?: number;
  /** 구매 중인 인원 수 */
  buyersCount: number;
  /** 진행률 (0-100) */
  progress: number;
  /** 배지 목록 */
  badges: Array<{
    type: 'remaining' | 'recruiting' | 'closed';
    label: string;
  }>;
  /** 모집 완료 여부 */
  completed?: boolean;
  /** 환불 상태 (취소 내역에서 사용) */
  refundStatus?: 'refunding' | 'refunded';
}

export interface SwipeableProductListProps {
  /** 상품 목록 (data와 sections 중 하나만 사용) */
  data?: SwipeableProductItem[];

  /** 섹션 목록 (data와 sections 중 하나만 사용) */
  sections?: SwipeableProductSection[];

  /** 상품 클릭 이벤트 */
  onItemPress: (item: SwipeableProductItem) => void;

  /** 상품 삭제 이벤트 (swipeActions가 없을 때 사용) */
  onDeleteItem?: (item: SwipeableProductItem) => void;

  /** 스와이프 액션 설정 (선택적, 설정 시 기본 삭제 버튼 대체) */
  swipeActions?: SwipeAction[];

  /**
   * ProductCard variant
   * - recent: 최근 본 상품/취소 내역 (이미지 106px, 진행률 바 없음, 배지 표시)
   * - profile: 프로필 상품 리스트 (이미지 62px, 진행률 바/배지 없음, 더 좁은 간격)
   * @default 'recent'
   */
  variant?: 'recent' | 'profile';

  /** 빈 상태 컴포넌트 */
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;

  /** 헤더 컴포넌트 */
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;

  /** 푸터 컴포넌트 */
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;

  /** 새로고침 중 여부 */
  refreshing?: boolean;

  /** 새로고침 핸들러 */
  onRefresh?: () => void;

  /**
   * 구분선(divider) 표시 여부
   * @default true
   */
  showDivider?: boolean;

  /**
   * 텍스트 영역 상하 중앙 정렬 여부
   * true일 경우 텍스트 컨테이너를 이미지 높이 기준으로 상하 중앙에 배치
   * @default false
   */
  centerTextVertically?: boolean;
}
