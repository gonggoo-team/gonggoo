/**
 * 레이아웃 상수
 *
 * 앱 전체에서 사용되는 레이아웃 관련 상수를 중앙 관리합니다.
 * 디자인 변경 시 이 파일만 수정하면 모든 화면에 자동 반영됩니다.
 */

/**
 * 탭바 레이아웃 상수
 *
 * Figma 디자인 기준:
 * - 컨텐츠 영역: 60px (아이콘 + 패딩)
 * - SafeArea bottom은 동적으로 추가됨
 *   - Galaxy S8: 60 + 0 = 60px
 *   - iPhone: 60 + 34 = 94px
 */
export const TAB_BAR = {
  /** 탭바 컨텐츠 높이 (SafeArea 제외) */
  CONTENT_HEIGHT: 60,

  /**
   * 탭바 전체 높이 계산
   * @param bottomInset - useSafeAreaInsets().bottom 값
   * @returns 전체 탭바 높이
   */
  getTotalHeight: (bottomInset: number) => TAB_BAR.CONTENT_HEIGHT + bottomInset,
} as const;

/**
 * FloatingActionButton 레이아웃 상수
 *
 * 위치 계산:
 * - 탭바 컨텐츠 위 + 간격
 * - Galaxy S8: 60 + 25 + 0 = 85px
 * - iPhone: 60 + 25 + 34 = 119px
 */
export const FLOATING_ACTION_BUTTON = {
  /** 탭바와 버튼 사이 간격 */
  SPACING_FROM_TAB: 25,

  /**
   * 버튼 bottom 위치 계산
   * @param bottomInset - useSafeAreaInsets().bottom 값
   * @returns 화면 하단에서 버튼까지의 거리
   */
  getBottomPosition: (bottomInset: number) =>
    TAB_BAR.CONTENT_HEIGHT + FLOATING_ACTION_BUTTON.SPACING_FROM_TAB + bottomInset,
} as const;

/**
 * FloatingActionBar 레이아웃 상수
 *
 * 상품 상세 화면의 하단 액션 바
 */
export const FLOATING_ACTION_BAR = {
  /** Footer 영역 높이 (absolute positioned) */
  FOOTER_HEIGHT: 84,

  /**
   * ScrollView paddingBottom 계산
   * @param bottomInset - useSafeAreaInsets().bottom 값
   * @returns ScrollView의 하단 여백
   */
  getScrollPadding: (bottomInset: number) =>
    FLOATING_ACTION_BAR.FOOTER_HEIGHT + 20 + bottomInset, // 84 + 여유 20 + SafeArea
} as const;

/**
 * 필터 화면 레이아웃 상수
 */
export const FILTER_SCREEN = {
  /** 하단 액션바 높이 (paddingTop + button + paddingBottom) */
  ACTION_BAR_HEIGHT: 90,

  /**
   * ScrollView paddingBottom 계산
   * @param bottomInset - useSafeAreaInsets().bottom 값
   * @returns ScrollView의 하단 여백
   */
  getScrollPadding: (bottomInset: number) =>
    FILTER_SCREEN.ACTION_BAR_HEIGHT + 10 + bottomInset, // 90 + 여유 10 + SafeArea
} as const;

/**
 * 콘텐츠 영역 paddingBottom 계산 유틸리티
 *
 * 탭이 있는 화면에서 콘텐츠가 탭바에 가려지지 않도록 여백 추가
 */
export const CONTENT_PADDING = {
  /**
   * 탭 화면 콘텐츠 paddingBottom 계산
   * @param bottomInset - useSafeAreaInsets().bottom 값
   * @param extraPadding - 추가 여유 공간 (기본 20px)
   * @returns 콘텐츠 하단 여백
   */
  getTabScreenPadding: (bottomInset: number, extraPadding: number = 20) =>
    TAB_BAR.CONTENT_HEIGHT + bottomInset + extraPadding,
} as const;

/**
 * GNB 레이아웃 상수
 */
export const GNB = {
  /** 세로 패딩 */
  VERTICAL_PADDING: 16,

  /** 가로 패딩 */
  HORIZONTAL_PADDING: 20,

  /** 아이콘 크기 */
  ICON_SIZE: 24,
} as const;

/**
 * ChatInput 레이아웃 상수
 */
export const CHAT_INPUT = {
  /** 상단 패딩 */
  PADDING_TOP: 12,

  /** 기본 하단 패딩 (SafeArea 제외) */
  BASE_PADDING_BOTTOM: 12,

  /**
   * 전체 paddingBottom 계산
   * @param bottomInset - useSafeAreaInsets().bottom 값
   * @returns 입력창 하단 여백
   */
  getPaddingBottom: (bottomInset: number) =>
    CHAT_INPUT.BASE_PADDING_BOTTOM + bottomInset,
} as const;
