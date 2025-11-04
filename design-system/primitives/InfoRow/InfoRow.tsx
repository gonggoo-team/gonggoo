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
import Svg, { G, Path } from 'react-native-svg';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import type { InfoRowProps } from './InfoRow.types';

/**
 * 간단한 SVG 아이콘 컴포넌트들
 * (Figma의 Component 41에서 추출)
 */
const GridIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16">
    <Path
      d="M1.33 1.33H7.33V7.33H1.33V1.33Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M8 1.33H14V7.33H8V1.33Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M1.33 8H7.33V14H1.33V8Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const BoxIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16">
    <G>
      <Path
        d="M1.59 1.33H14.41L13.18 3.63H2.82L1.59 1.33Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M5.89 3.4V6.05"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M1.59 1.33V13.34H14.41V1.33"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M5.01 2.73H11.33V6.09H5.01V2.73Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </G>
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

  const defaultIconColor = iconColor || theme.colors.surface.texticon.onnormal.icon.highEmp;
  const defaultTextColor = textColor || theme.colors.surface.texticon.onnormal.text.highEmp;

  // 아이콘 렌더링
  const renderIcon = () => {
    if (iconComponent) {
      return iconComponent;
    }

    // Figma에서 사용된 아이콘들을 직접 렌더링
    switch (iconName) {
      case 'grid':
        return <GridIcon color={defaultIconColor} />;
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9, // Figma 기준
  },
});
