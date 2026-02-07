import { useMemo } from 'react';
import {
  getScaleFactor,
  scaleSize,
  scaleFontSize,
  scaleIconSize,
  scaleSpacing,
  shouldAdjustForLargeDevices,
  getDeviceCategory,
} from '../utils/responsive';

/**
 * 반응형 스케일링을 위한 Hook
 *
 * 컴포넌트에서 디바이스 크기에 맞게 텍스트, 아이콘, 간격을 조정할 때 사용합니다.
 *
 * @returns 스케일링 유틸리티 함수들
 *
 * @example
 * const { fontSize, iconSize, spacing, scaleFactor } = useResponsive();
 *
 * <Text style={{ fontSize: fontSize(14) }}>
 *   가격: 10,000원
 * </Text>
 * <Icon name="heart" size={iconSize(24)} />
 */
export const useResponsive = () => {
  // 스케일 팩터를 메모이제이션하여 불필요한 재계산 방지
  const scaleFactor = useMemo(() => getScaleFactor(), []);

  // 디바이스 카테고리 (small, medium, large)
  const deviceCategory = useMemo(() => getDeviceCategory(), []);

  // 큰 디바이스 여부 (스케일 팩터 > 1.1)
  const isLargeDevice = useMemo(() => shouldAdjustForLargeDevices(), []);

  return {
    /**
     * 현재 디바이스의 스케일 팩터 (1.0 ~ 1.15)
     */
    scaleFactor,

    /**
     * 디바이스 크기 카테고리
     */
    deviceCategory,

    /**
     * 큰 디바이스 여부 (스케일 팩터 > 1.1)
     * numberOfLines 등을 동적으로 조정할 때 사용
     */
    isLargeDevice,

    /**
     * 폰트 크기를 스케일링합니다.
     *
     * @param baseFontSize - 기준 폰트 크기 (iPhone SE 기준)
     * @returns 스케일링된 폰트 크기
     *
     * @example
     * fontSize(14) // iPhone SE: 14, Pro Max: 16
     */
    fontSize: (baseFontSize: number) => scaleFontSize(baseFontSize),

    /**
     * 아이콘 크기를 스케일링합니다.
     *
     * @param baseIconSize - 기준 아이콘 크기
     * @returns 스케일링된 아이콘 크기
     *
     * @example
     * iconSize(24) // iPhone SE: 24, Pro Max: 28
     */
    iconSize: (baseIconSize: number) => scaleIconSize(baseIconSize),

    /**
     * 간격(spacing)을 스케일링합니다.
     *
     * @param baseSpacing - 기준 간격
     * @returns 스케일링된 간격
     *
     * @example
     * spacing(16) // iPhone SE: 16, Pro Max: 18
     */
    spacing: (baseSpacing: number) => scaleSpacing(baseSpacing),

    /**
     * 임의의 크기 값을 스케일링합니다.
     *
     * @param baseSize - 기준 크기
     * @returns 스케일링된 크기
     */
    scale: (baseSize: number) => scaleSize(baseSize),

    /**
     * numberOfLines를 디바이스 크기에 따라 조정합니다.
     *
     * @param baseLines - 기준 라인 수 (작은 디바이스)
     * @param largeDeviceLines - 큰 디바이스에서의 라인 수 (옵션)
     * @returns 조정된 라인 수
     *
     * @example
     * adjustLines(2, 3) // 작은 디바이스: 2줄, 큰 디바이스: 3줄
     * adjustLines(2) // 작은 디바이스: 2줄, 큰 디바이스: 3줄 (자동 +1)
     */
    adjustLines: (baseLines: number, largeDeviceLines?: number) => {
      if (!isLargeDevice) return baseLines;
      return largeDeviceLines ?? baseLines + 1;
    },
  };
};

/**
 * 반응형 스타일을 생성하는 헬퍼 타입
 */
export type ResponsiveStyle = {
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  gap?: number;
  width?: number;
  height?: number;
};

/**
 * 고정 크기를 사용하는 컴포넌트용 타입 가드
 * (배지, 메타데이터 등 UI 크롬)
 */
export const isFixedSizeComponent = (componentType: string): boolean => {
  const fixedComponents = [
    'badge-count',
    'status-badge-fixed',
    'metadata-text',
    'icon-badge',
  ];
  return fixedComponents.includes(componentType);
};
