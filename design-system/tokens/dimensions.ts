/**
 * Dimensions Design Tokens
 *
 * 버튼, 컴포넌트의 크기 관련 토큰입니다.
 * Figma 디자인 기준값(375px 기준)을 토큰화하되,
 * 실제 적용 시 반응형으로 처리합니다.
 *
 * 수정 시 주의사항:
 * 1. Figma의 고정값을 기준값으로 보관
 * 2. 컴포넌트에서는 비율 또는 100%로 변환하여 사용
 * 3. maxWidth로 과도한 확대 방지
 */

/**
 * Button Heights
 * 버튼의 최소 높이 정의
 */
export const buttonHeight = {
  /** 30px - small button */
  xs: 30,

  /** 34px - category button (round chip) */
  sm: 34,

  /** 36px - search button */
  md: 36,

  /** 54px - square/full button */
  lg: 54,
} as const;

/**
 * Input Heights
 * 입력 필드의 최소 높이 정의
 */
export const inputHeight = {
  /** 22px - LabeledInput 텍스트 영역 높이 (Figma 기준) */
  text: 22,

  /** 35px - SearchBar 높이 (Figma 기준) */
  search: 35,

  /** 44px - LabeledInput 기본 높이 */
  sm: 44,

  /** 50px - SearchInput 높이 */
  md: 50,
} as const;

/**
 * Component Widths
 * Figma 기준값 (375px 디자인 기준)
 * 실제 사용 시 비율 또는 100%로 변환
 */
export const componentWidth = {
  /** 92px - small button (고정값 사용) */
  small: 92,

  /** 102px - dropdown 기준값 */
  dropdown: 102,

  /** 172px - short button 기준값 (≈45.9% of 375px) */
  short: 172,

  /** 274px - search bar content 기준값 */
  searchContent: 274,

  /** 298px - search bar 기준값 */
  searchBar: 298,

  /** 345px - long button 기준값 (≈92% of 375px) */
  long: 345,

  /** 375px - full width 기준값 (참고용, 실제로는 100% 사용) */
  reference: 375,
} as const;

/**
 * Button Widths (Deprecated - use componentWidth instead)
 * @deprecated Use componentWidth for better naming consistency
 */
export const buttonWidth = componentWidth;

/**
 * Border Width
 * 테두리 두께 정의
 */
export const borderWidth = {
  /** 0px - 테두리 없음 */
  none: 0,

  /** 1px - 얇은 테두리 */
  thin: 1,

  /** 2px - 중간 테두리 */
  medium: 2,

  /** 3px - 두꺼운 테두리 */
  thick: 3,
} as const;

/**
 * Opacity
 * 투명도 정의
 */
export const opacity = {
  /** 0.6 - 비활성 상태 */
  disabled: 0.6,

  /** 0.8 - 흐리게 */
  dimmed: 0.8,

  /** 1.0 - 완전 불투명 */
  full: 1,
} as const;

/**
 * Icon Sizes
 * 아이콘 크기 정의
 */
export const iconSize = {
  /** 10px - 작은 아이콘 (순위 화살표) */
  xs: 10,

  /** 16px - 중간 아이콘 (드롭다운 화살표) */
  sm: 16,

  /** 24px - 기본 아이콘 (검색, 삭제) */
  md: 24,
} as const;

/**
 * Dimensions 통합 객체
 */
export const dimensions = {
  buttonHeight,
  buttonWidth,
  componentWidth,
  inputHeight,
  borderWidth,
  opacity,
  iconSize,
} as const;

/**
 * Dimensions 타입 추출
 */
export type Dimensions = typeof dimensions;
export type ButtonHeight = typeof buttonHeight;
export type ButtonWidth = typeof buttonWidth;
export type ComponentWidth = typeof componentWidth;
export type InputHeight = typeof inputHeight;
export type BorderWidth = typeof borderWidth;
export type Opacity = typeof opacity;
export type IconSize = typeof iconSize;

export type ButtonHeightKey = keyof typeof buttonHeight;
export type ButtonWidthKey = keyof typeof buttonWidth;
export type ComponentWidthKey = keyof typeof componentWidth;
export type InputHeightKey = keyof typeof inputHeight;
export type BorderWidthKey = keyof typeof borderWidth;
export type OpacityKey = keyof typeof opacity;
export type IconSizeKey = keyof typeof iconSize;
