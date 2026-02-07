/**
 * CategoryTabBar Component
 *
 * 메인 홈 상단에 위치하는 카테고리 탭 바입니다.
 * - 7개 카테고리: 홈, 동네, 오늘 마감, 인기, 추천, 나눔, 이벤트
 * - 수평 스크롤 지원 (모든 디바이스 대응)
 * - 선택된 카테고리에 따라 스타일 변경
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=545-9534&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * const [selectedCategory, setSelectedCategory] = useState<CategoryType>('home');
 *
 * <CategoryTabBar
 *   selectedCategory={selectedCategory}
 *   onCategoryChange={setSelectedCategory}
 * />
 * ```
 */

import React, { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../../hooks';
import { createCategoryTabBarStyles } from './CategoryTabBar.styles';
import type { CategoryTabBarProps, CategoryType } from './CategoryTabBar.types';
import { CATEGORY_ORDER } from './CategoryTabBar.types';
import { CategoryTabItem } from './components/CategoryTabItem';

/**
 * CategoryTabBar Component
 */
export const CategoryTabBar: React.FC<CategoryTabBarProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createCategoryTabBarStyles(theme), [theme]);

  // 메모이제이션된 핸들러 생성
  const handleCategoryPress = useCallback(
    (category: CategoryType) => {
      onCategoryChange(category);
    },
    [onCategoryChange]
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {CATEGORY_ORDER.map((category) => (
          <CategoryTabItem
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onPress={handleCategoryPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};
