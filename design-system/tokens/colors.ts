/**
 * Color Design Tokens
 *
 * Figma 디자인 시스템에서 추출한 색상 토큰입니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=379-5098
 * 마지막 동기화: 2025-10-05
 *
 * 구조:
 * - surface: 화면 배경/버튼 배경 등 면적 색상
 *   - normal: 일반적인 배경/컨테이너 색상
 *   - brand: 브랜드 관련 색상
 *   - env: 환경/상태 관련 색상
 * - text: 텍스트 색상
 * - icon: 아이콘 색상
 * - border: 선/테두리 색상
 *   - brand: 브랜드 관련 선 색상
 *   - normal: 일반 선 색상
 *   - env: 환경/상태 관련 선 색상
 *
 * 수정 시 주의사항:
 * 1. Figma와 동기화된 값을 변경할 때는 디자이너와 협의
 * 2. 새로운 색상 추가 시 semantic한 이름 사용
 * 3. as const를 유지하여 타입 안전성 보장
 */

export const colors = {
  /**
   * Surface Colors
   * 화면 배경/버튼 배경 등 면에 들어가는 색상
   */
  surface: {
    /**
     * Normal - 페이지 전반적으로 들어가는 무난한 색상들
     */
    normal: {
      bg1: '#FFFFFF',           // Figma: BG1 - 배경 색상 1
      bg2: '#F5F5F5',           // Figma: BG2 - 배경 색상 2
      container0: '#FFFFFF',    // Figma: Container0 - 버튼 색상 1
      container10: '#F5F5F5',   // Figma: Container10 - 버튼 색상 2
      containerRed: '#FFF4F6',  // Figma: Container red - 버튼 색상 3
      containerGreen: '#E6EDE9', // Figma: Container green - 버튼 색상 4
      none: 'transparent',       // Figma: None - 배경색이 아무것도 x(무색)
    },

    /**
     * Brand - 브랜드 컬러로 들어간 버튼 색상
     */
    brand: {
      primary: '#006242',        // Figma: primary - 버튼 색상 (그린)
    },

    /**
     * Env - 강조가 되어야 하거나, 버튼이 비활성화
     */
    env: {
      accent: '#F7514D',         // Figma: Accent - 강조색 (레드)
      disabled: '#E1E1E1',       // Figma: Disabled - 버튼 비활성화
    },

    /**
     * TextIcon - 배경이나 버튼 위에 표시되는 텍스트/아이콘에 들어가는 색상들
     */
    texticon: {
      /**
       * OnNormal - 일반 배경 위의 텍스트/아이콘
       */
      onnormal: {
        /**
         * Text - 텍스트에 사용된 모든 색상
         */
        text: {
          black: '#181A1A',      // Figma: black - 텍스트 블랙
          lowEmp: '#D1D6DA',    // Figma: LowEmp - 텍스트 그레이 (Low Emphasis)
          midEmp: '#9FA7B1',    // Figma: MidEmp - 텍스트 그레이 (Mid Emphasis)
          highEmp: '#A6A6A6',   // Figma: HighEmp - 텍스트 그레이 (High Emphasis)
          white: '#FFFFFF',      // Figma: white - 텍스트 화이트
          green: '#006242',      // Figma: green - 텍스트 그린 (브랜드 컬러)
          red: '#F7514D',        // Figma: red - 텍스트 레드 (강조색)
          blue: '#1D8BFF',       // Figma: blue - 텍스트 블루
        },

        /**
         * Icon - 아이콘에 사용된 모든 색상
         */
        icon: {
          lowEmp: '#D1D6DA',    // Figma: LowEmp - 회색 아이콘
          highEmp: '#A6A6A6',   // Figma: HighEmp - 회색 아이콘
          tabBar: '#9C9DA4',    // Figma: Tab bar icon - 하단 탭바 아이콘 비활성화
          green: '#006242',      // Figma: green - 하단 탭바 아이콘 활성화
          black: '#181A1A',      // Figma: black - 뒤로가기, 알림 버튼 등 색상
          red: '#F7514D',        // Figma: red - 레드 아이콘
          blue: '#1D8BFF',       // Figma: blue - 블루 아이콘
        },
      },
    },
  },

  /**
   * Border Colors
   * 선/테두리 색상
   */
  border: {
    /**
     * Brand - 브랜드 컬러로 표현한 선 색상
     */
    brand: {
      primary: '#006242',        // Figma: primary - 브랜드 컬러로 표현한 버튼 선 색
    },

    /**
     * 일반 선 색상
     */
    lowEmp: '#E1E1E1',          // Figma: LowEmp - 연한 회색
    midEmp: '#CACACA',          // Figma: MidEmp - 중간 회색
    highEmp: '#A6A6A6',         // Figma: HighEmp - 진한 회색

    /**
     * Env - 환경/상태 관련 선 색상
     */
    env: {
      accent: '#F7514D',         // Figma: Accent - 선을 강조할 때
    },
  },
} as const;

/**
 * Color 타입 추출
 * 다른 파일에서 색상 타입을 참조할 때 사용
 */
export type Colors = typeof colors;

/**
 * 특정 카테고리의 색상 키 타입
 */
export type SurfaceNormalColorKey = keyof typeof colors.surface.normal;
export type SurfaceBrandColorKey = keyof typeof colors.surface.brand;
export type SurfaceEnvColorKey = keyof typeof colors.surface.env;
export type SurfaceTextIconOnNormalTextColorKey = keyof typeof colors.surface.texticon.onnormal.text;
export type SurfaceTextIconOnNormalIconColorKey = keyof typeof colors.surface.texticon.onnormal.icon;
export type BorderBrandColorKey = keyof typeof colors.border.brand;
export type BorderEnvColorKey = keyof typeof colors.border.env;
