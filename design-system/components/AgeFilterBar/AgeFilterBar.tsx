/**
 * AgeFilterBar Component
 *
 * 가로 스크롤이 가능한 연령대 필터 버튼 바입니다.
 * - 추천 탭에서 사용
 * - Button 컴포넌트 기반 (category-selected/category-unselected variant)
 * - 반응형 지원
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=465-9362&m=dev
 * 마지막 동기화: 2025-10-23
 *
 * 사용 예시:
 * ```tsx
 * <AgeFilterBar
 *   ageGroups={['전체', '10대', '20대', '30대', '40대', '50대', '60대 이상']}
 *   selectedAgeGroup={selectedAgeGroup}
 *   onSelect={setSelectedAgeGroup}
 * />
 * ```
 */

import React from 'react';
import { FlatList, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Button } from '../../primitives/Button';
import { createAgeFilterBarStyles } from './AgeFilterBar.styles';
import type { AgeFilterBarProps } from './AgeFilterBar.types';

/**
 * AgeFilterBar Component
 */
export const AgeFilterBar: React.FC<AgeFilterBarProps> = ({
  ageGroups,
  selectedAgeGroup,
  onSelect,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createAgeFilterBarStyles(theme);

  return (
    <View style={[styles.container, style]}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={ageGroups}
        keyExtractor={(item) => item}
        scrollEnabled={true}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <View style={{ marginRight: theme.spacing.xxs }}>
            <Button
              variant={selectedAgeGroup === item ? 'category-selected' : 'category-unselected'}
              onPress={() => onSelect(item)}
            >
              {item}
            </Button>
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};
