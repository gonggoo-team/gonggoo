/**
 * SectionHeader Component
 *
 * 섹션의 제목과 부제목을 표시하는 헤더입니다.
 * - 일관된 타이포그래피
 * - 선택적 부제목
 * - 여러 탭에서 재사용 가능
 *
 * 사용 예시:
 * ```tsx
 * <SectionHeader
 *   title="우리 동네에서 모집 중!"
 *   subtitle="00동에서 모집 중인 팟을 한눈에 확인하세요!"
 * />
 * ```
 */

import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { createSectionHeaderStyles } from './SectionHeader.styles';
import type { SectionHeaderProps } from './SectionHeader.types';

/**
 * SectionHeader Component
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
}) => {
  const { theme } = useTheme();
  const styles = createSectionHeaderStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
    </View>
  );
};
