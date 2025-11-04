
/**
 * 반응형 스케일링 유틸리티
 *
 * iPhone SE (375px)를 기준으로 디바이스 크기에 따라 텍스트와 아이콘 크기를 조정합니다.
 * 최대 15% 증가로 제한하여 레이아웃 안정성을 유지합니다.
 */


// 디자인 기준 너비 (iPhone SE - Figma 기준)
export const BASE_WIDTH = 375;

// 스케일링 제한
export const MAX_SCALE = 1.15; // 최대 15% 증가
export const MIN_SCALE = 1.0;  // 기준 이하로 축소 안 함

/**
 * 현재 디바이스의 스케일 팩터를 계산합니다.
 *
 * @returns 스케일 팩터 (1.0 ~ 1.15)
 *
 * @example
 * // iPhone SE (375px) → 1.0
 * // iPhone 11 (414px) → 1.104
 * // iPhone 14 Pro Max (430px) → 1.15 (capped)
 */
export const getScaleFactor = (): number => {
  // const screenWidth = Dimensions.get('window').width;
  // const scale = screenWidth / BASE_WIDTH;
  // return Math.max(MIN_SCALE, Math.min(scale, MAX_SCALE));
  return 1.0;
};

/**
 * 크기 값을 디바이스에 맞게 스케일링합니다.
 *
 * @param baseSize - 기준 크기 (iPhone SE 기준)
 * @returns 스케일링된 크기 (반올림)
 *
 * @example
 * scaleSize(14) // iPhone SE: 14, Pro Max: 16
 * scaleSize(24) // iPhone SE: 24, Pro Max: 28
 */
export const scaleSize = (baseSize: number): number => {
  return Math.round(baseSize * getScaleFactor());
};

/**
 * 폰트 크기를 스케일링합니다. (scaleSize의 별칭)
 *
 * @param baseFontSize - 기준 폰트 크기
 * @returns 스케일링된 폰트 크기
 */
export const scaleFontSize = (baseFontSize: number): number => {
  return scaleSize(baseFontSize);
};

/**
 * 아이콘 크기를 스케일링합니다. (scaleSize의 별칭)
 *
 * @param baseIconSize - 기준 아이콘 크기
 * @returns 스케일링된 아이콘 크기
 */
export const scaleIconSize = (baseIconSize: number): number => {
  return scaleSize(baseIconSize);
};

/**
 * 간격(spacing) 값을 스케일링합니다.
 * 텍스트보다 완만하게 스케일링하여 레이아웃 안정성을 높입니다.
 *
 * @param baseSpacing - 기준 간격
 * @returns 스케일링된 간격
 *
 * @example
 * scaleSpacing(16) // iPhone SE: 16, Pro Max: 18
 */
export const scaleSpacing = (baseSpacing: number): number => {
  const factor = getScaleFactor();
  // 간격은 더 완만하게 스케일링 (최대 10%)
  const spacingFactor = 1 + (factor - 1) * 0.7;
  return Math.round(baseSpacing * spacingFactor);
};

/**
 * 스케일 팩터가 특정 임계값을 초과하는지 확인합니다.
 * numberOfLines 등을 동적으로 조정할 때 사용합니다.
 *
 * @param threshold - 임계값 (기본값: 1.1)
 * @returns 임계값 초과 여부
 *
 * @example
 * if (shouldAdjustForLargeDevices()) {
 *   numberOfLines = 3; // 큰 기기에서는 3줄
 * }
 */
export const shouldAdjustForLargeDevices = (threshold: number = 1.1): boolean => {
  return getScaleFactor() > threshold;
};

/**
 * 디바이스 크기 카테고리를 반환합니다.
 *
 * @returns 'small' | 'medium' | 'large'
 */
export const getDeviceCategory = (): 'small' | 'medium' | 'large' => {
  const factor = getScaleFactor();
  if (factor >= 1.1) return 'large';
  if (factor >= 1.05) return 'medium';
  return 'small';
};
