/**
 * Icon Component
 *
 * SVG 기반 아이콘 컴포넌트입니다.
 * Figma 디자인 시스템의 모든 아이콘을 지원합니다.
 * 반응형: 디바이스 크기에 따라 아이콘 크기가 자동 조정됩니다.
 *
 * 사용 예시:
 * <Icon name="search" size={24} /> // 반응형: 24px → 24-28px
 * <Icon name="bell" size={16} responsive={false} /> // 고정: 16px
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Line, G, Circle } from 'react-native-svg';
import { useResponsive } from '../../hooks';
import { ICON_PATHS } from './icons';
import type { IconProps } from './types';

/**
 * Icon Component
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  accessibilityLabel,
  testID,
  responsive = true,
}) => {
  const { iconSize } = useResponsive();

  // 반응형 크기 계산 (responsive=true인 경우에만)
  const finalSize = responsive ? iconSize(size) : size;
  const iconData = ICON_PATHS[name];

  if (!iconData) {
    console.warn(`Icon "${name}" not found in ICON_PATHS`);
    // Fallback: 아이콘이 없을 때 회색 placeholder 표시
    return (
      <View
        style={{
          width: finalSize,
          height: finalSize,
          backgroundColor: '#E0E0E0',
          borderRadius: finalSize / 2,
        }}
        testID={testID}
        accessibilityLabel={accessibilityLabel || `${name} icon (placeholder)`}
      />
    );
  }

  const { viewBox, paths, circles } = iconData;

  // ViewBox에서 원본 크기 추출
  const viewBoxValues = viewBox.split(' ').map(Number);
  const originalWidth = viewBoxValues[2];
  const originalHeight = viewBoxValues[3];

  return (
    <Svg
      width={finalSize}
      height={finalSize}
      viewBox={viewBox}
      accessibilityLabel={accessibilityLabel || `${name} icon`}
      testID={testID}
    >
      {/* Circle 렌더링 */}
      {circles?.map((circleData, index) => {
        const fillColor = circleData.fill === 'currentColor'
          ? (color || '#000000')
          : circleData.fill || 'none';

        const strokeColor = circleData.stroke === 'currentColor'
          ? (color || '#000000')
          : circleData.stroke || 'none';

        return (
          <Circle
            key={`circle-${index}`}
            cx={circleData.cx}
            cy={circleData.cy}
            r={circleData.r}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={circleData.strokeWidth}
          />
        );
      })}

      {/* Path 렌더링 */}
      {paths?.map((pathData, index) => {
        // currentColor를 실제 색상으로 변환
        const fillColor = pathData.fill === 'currentColor'
          ? (color || '#000000')
          : pathData.fill || 'none';

        const strokeColor = pathData.stroke === 'currentColor'
          ? (color || '#000000')
          : pathData.stroke || 'none';

        return (
          <Path
            key={`path-${index}`}
            d={pathData.d}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={pathData.strokeWidth}
            strokeLinecap={pathData.strokeLinecap}
            strokeLinejoin={pathData.strokeLinejoin}
            strokeMiterlimit={pathData.strokeMiterlimit}
            fillRule={pathData.fillRule}
            clipRule={pathData.clipRule}
          />
        );
      })}
    </Svg>
  );
};
