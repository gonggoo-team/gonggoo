/**
 * Typography Design Tokens
 *
 * 타이포그래피 관련 토큰입니다.
 * 폰트 크기, 행간, 자간, 폰트 굵기 등을 정의합니다.
 *
 * 반응형 스케일링 전략:
 * - Scalable: 콘텐츠 텍스트, 디바이스 크기에 따라 최대 15% 증가
 * - Fixed: UI 크롬 (배지, 메타데이터), 고정 크기 유지
 *
 * 수정 시 주의사항:
 * 1. Figma의 텍스트 스타일과 동기화
 * 2. React Native와 웹 모두 지원하는 값 사용
 * 3. fontWeight는 문자열로 정의 (RN 호환성)
 * 4. 반응형 적용 시 useResponsive Hook 사용
 */

/**
 * Fixed Font Size (고정 크기 - 스케일링 안 함)
 * 배지, 메타데이터 등 UI 크롬에 사용
 */
export const fixedFontSize = {
  /** 10px - 배지 카운트, 아이콘 배지 */
  badgeCount: 10,

  /** 11px - 상태 배지 (패딩 증가 후 스케일링 적용 예정) */
  statusBadge: 11,

  /** 12px - 메타데이터, 보조 정보 */
  metadata: 12,
} as const;

/**
 * Scalable Font Size (스케일링 가능)
 * 콘텐츠 텍스트에 사용, 디바이스 크기에 따라 조정
 *
 * 기준: iPhone SE (375px)
 * 최대: 15% 증가 (iPhone 14 Pro Max - 430px)
 */
export const scalableFontSize = {
  /** 13px - 검색 버튼, 작은 라벨 → 13-15px */
  xs13: 13,

  /** 14px - 기본 본문 텍스트 → 14-16px */
  sm: 14,

  /** 15px - 카테고리 라벨 → 15-17px */
  md15: 15,

  /** 16px - 중간 텍스트, 버튼 → 16-18px */
  md: 16,

  /** 18px - 큰 텍스트, 섹션 헤더 → 18-21px */
  lg: 18,

  /** 20px - 제목 텍스트, GNB → 20-23px */
  xl: 20,

  /** 24px - 큰 제목 → 24-28px */
  xxl: 24,

  /** 25px - 상품 가격 표시 → 25-29px */
  xxl25: 25,

  /** 28px - 아주 큰 제목 → 28-32px */
  xxxl: 28,

  /** 32px - 헤드라인 → 32-37px */
  xxxxl: 32,

  /** 36px - 대형 헤드라인 → 36-41px */
  xxxxxl: 36,
} as const;

/**
 * Font Size (통합 - 하위 호환성 유지)
 * 기존 코드와의 호환을 위해 유지
 */
export const fontSize = {
  /** 10px - 아주 작은 텍스트 */
  xxs: 10,

  /** 12px - 작은 텍스트 */
  xs: 12,

  /** 13px - 검색 버튼 텍스트 */
  xs13: 13,

  /** 14px - 기본 본문 텍스트 */
  sm: 14,

  /** 15px - 카테고리 라벨 텍스트 */
  md15: 15,

  /** 16px - 중간 텍스트 */
  md: 16,

  /** 18px - 큰 텍스트 */
  lg: 18,

  /** 20px - 제목 텍스트 */
  xl: 20,

  /** 24px - 큰 제목 */
  xxl: 24,

  /** 25px - 상품 가격 표시 */
  xxl25: 25,

  /** 28px - 아주 큰 제목 */
  xxxl: 28,

  /** 32px - 헤드라인 */
  xxxxl: 32,

  /** 36px - 대형 헤드라인 */
  xxxxxl: 36,
} as const;

/**
 * Font Weight
 * 폰트 굵기 정의 (React Native 호환)
 */
export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
} as const;

/**
 * Line Height
 * 행간 정의 (비율 기반)
 */
export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

/**
 * Font Family
 * 폰트 패밀리 정의
 */
export const fontFamily = {
  /** Pretendard - 기본 폰트 */
  primary: 'Pretendard',

  /** Space Mono - 모노스페이스 폰트 */
  mono: 'Space Mono',
} as const;

/**
 * Typography 헬퍼 함수
 */
export const typographyHelpers = {
  /**
   * letterSpacing 자동 계산 (-2.5%)
   * Figma 디자인에서 letterSpacing은 fontSize의 -2.5%로 통일
   *
   * @param fontSize - 폰트 크기
   * @returns 계산된 letterSpacing 값
   *
   * @example
   * getLetterSpacing(14) // -0.35
   * getLetterSpacing(16) // -0.4
   */
  getLetterSpacing: (fontSize: number): number => fontSize * -0.025,
} as const;

/**
 * Typography 통합 객체
 */
export const typography = {
  fontSize,
  fixedFontSize,
  scalableFontSize,
  fontWeight,
  lineHeight,
  fontFamily,
  ...typographyHelpers,
} as const;

/**
 * Typography 타입 추출
 */
export type Typography = typeof typography;
export type FontSize = typeof fontSize;
export type FixedFontSize = typeof fixedFontSize;
export type ScalableFontSize = typeof scalableFontSize;
export type FontWeight = typeof fontWeight;
export type LineHeight = typeof lineHeight;
export type FontFamily = typeof fontFamily;

export type FontSizeKey = keyof typeof fontSize;
export type FixedFontSizeKey = keyof typeof fixedFontSize;
export type ScalableFontSizeKey = keyof typeof scalableFontSize;
export type FontWeightKey = keyof typeof fontWeight;
export type LineHeightKey = keyof typeof lineHeight;
export type FontFamilyKey = keyof typeof fontFamily;
