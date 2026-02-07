/**
 * InfoRow Component
 *
 * 아이콘과 텍스트를 나란히 표시하는 정보 행 컴포넌트입니다.
 * - 공구 정보, 거래 정보 섹션에서 사용
 * - 아이콘 + 텍스트 조합
 *
 * Figma: 공구 정보, 거래 정보 섹션
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, G, Mask, Path } from 'react-native-svg';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import type { InfoRowProps } from './InfoRow.types';

/**
 * 간단한 SVG 아이콘 컴포넌트들
 * (Figma의 Component 41에서 추출)
 */

/**
 * Grid-2 아이콘 (슬롯)
 * 4개 사각형 그리드 형태
 */
const GridIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16">
    <Path
      d="M6.00016 14.6663H10.0002C13.3335 14.6663 14.6668 13.333 14.6668 9.99967V5.99967C14.6668 2.66634 13.3335 1.33301 10.0002 1.33301H6.00016C2.66683 1.33301 1.3335 2.66634 1.3335 5.99967V9.99967C1.3335 13.333 2.66683 14.6663 6.00016 14.6663Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M8 1.33301V14.6663"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M1.3335 8H14.6668"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

/**
 * Package 아이콘 (공구물품명)
 * Figma: node-id=1431-14923
 * 모서리가 둥근 사각형 형태
 */
const PackageIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Defs>
      <Mask id="package-mask-inside" fill="white">
        <Path d="M2 10C2 5.58172 5.58172 2 10 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V10Z" />
      </Mask>
    </Defs>
    <Path
      d="M2 10C2 5.58172 5.58172 2 10 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V10Z"
      stroke={color}
      strokeWidth={3}
      strokeLinejoin="round"
      mask="url(#package-mask-inside)"
      fill="none"
    />
  </Svg>
);

/**
 * Box 아이콘 (배송)
 * 3D 박스 형태
 */
const BoxIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16">
    <Path
      d="M2.11328 4.95996L7.99994 8.36662L13.8466 4.97994"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M8 14.407V8.36035"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M6.6204 1.65301L3.0604 3.63303C2.25374 4.0797 1.59375 5.19968 1.59375 6.11968V9.88637C1.59375 10.8064 2.25374 11.9264 3.0604 12.373L6.6204 14.353C7.3804 14.773 8.62706 14.773 9.38706 14.353L12.9471 12.373C13.7537 11.9264 14.4137 10.8064 14.4137 9.88637V6.11968C14.4137 5.19968 13.7537 4.0797 12.9471 3.63303L9.38706 1.65301C8.6204 1.22634 7.3804 1.22634 6.6204 1.65301Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M11.3335 8.82674V6.38676L5.00684 2.7334"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const LocationIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16">
    <Path
      d="M7.92 8.96C8.65 8.96 9.25 8.36 9.25 7.63C9.25 6.9 8.65 6.3 7.92 6.3C7.19 6.3 6.59 6.9 6.59 7.63C6.59 8.36 7.19 8.96 7.92 8.96Z"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
    />
    <Path
      d="M2.25 5.65C3.72 -0.75 12.29 -0.74 13.75 5.66C14.64 9.52 12.12 12.77 9.92 14.89C8.37 16.37 7.5 16.37 5.94 14.89C3.75 12.77 1.23 9.51 2.25 5.65Z"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
    />
  </Svg>
);

const ClockIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16">
    <Path
      d="M14.67 8C14.67 11.68 11.68 14.67 8 14.67C4.32 14.67 1.33 11.68 1.33 8C1.33 4.32 4.32 1.33 8 1.33C11.68 1.33 14.67 4.32 14.67 8Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M10.47 10.12L8.4 8.89C8.03 8.67 7.73 8.16 7.73 7.73V5.01"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const InfoRow: React.FC<InfoRowProps> = ({
  iconName,
  iconComponent,
  text,
  iconColor,
  textColor,
}) => {
  const { theme } = useTheme();

  const defaultIconColor = iconColor || theme.colors.surface.texticon.onnormal.icon.green;
  const defaultTextColor = textColor || theme.colors.surface.texticon.onnormal.text.black;

  // 아이콘 렌더링
  const renderIcon = () => {
    if (iconComponent) {
      return iconComponent;
    }

    // Figma에서 사용된 아이콘들을 직접 렌더링
    switch (iconName) {
      case 'grid':
        return <GridIcon color={defaultIconColor} />;
      case 'package':
        return <PackageIcon color={defaultIconColor} />;
      case 'box':
        return <BoxIcon color={defaultIconColor} />;
      case 'location':
        return <LocationIcon color={defaultIconColor} />;
      case 'clock':
        return <ClockIcon color={defaultIconColor} />;
      default:
        // 기존 Icon 컴포넌트 사용
        if (iconName) {
          return <Icon name={iconName as any} size={16} color={defaultIconColor} />;
        }
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderIcon()}
      <Text
        style={{
          fontSize: theme.typography.fontSize.xs, // 13px
          fontWeight: theme.typography.fontWeight.medium, // 500
          lineHeight: theme.typography.fontSize.xs * 1.2,
          letterSpacing: theme.typography.getLetterSpacing(13),
          color: defaultTextColor,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9, // Figma 기준
  },
});
