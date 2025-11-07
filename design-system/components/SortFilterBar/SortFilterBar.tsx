/**
 * SortFilterBar Component
 *
 * 정렬 버튼과 필터 버튼을 함께 표시하는 바입니다.
 * - 드롭다운 위치를 동적으로 계산하여 Portal로 렌더링
 * - 필터 버튼 클릭 시 외부 핸들러 호출
 * - 여러 탭에서 재사용 가능
 *
 * 사용 예시:
 * ```tsx
 * const dropdownPortal = (
 *   <SortFilterBar
 *     sortOptions={DEFAULT_SORT_OPTIONS}
 *     selectedSort={selectedSort}
 *     onSortSelect={handleSortSelect}
 *     onSortPress={handleSortPress}
 *     onFilterPress={handleFilterPress}
 *     isDropdownVisible={isDropdownVisible}
 *     onDropdownClose={handleDropdownClose}
 *   />
 * );
 *
 * return (
 *   <>
 *     <TabContentLayout ... />
 *     {dropdownPortal}
 *   </>
 * );
 * ```
 */

import React, { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { DropdownMenu } from '../../primitives/DropdownMenu';
import { SortButton } from '../../primitives/SortButton';
import { DropdownOverlay } from '../DropdownOverlay';
import { createSortFilterBarStyles } from './SortFilterBar.styles';
import type { SortFilterBarProps } from './SortFilterBar.types';

/**
 * SortFilterBar Component
 */
export const SortFilterBar: React.FC<SortFilterBarProps> = ({
  sortOptions,
  selectedSort,
  onSortSelect,
  onSortPress,
  onFilterPress,
  isDropdownVisible,
  onDropdownClose,
  resultsCount,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createSortFilterBarStyles(theme);
  const sortButtonRef = useRef<View>(null);
  const containerRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // 드롭다운이 열릴 때 정렬 버튼의 정확한 위치 측정
  React.useEffect(() => {
    if (isDropdownVisible && sortButtonRef.current) {
      sortButtonRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPosition({
          top: y + height + 8, // 정렬 버튼 아래 8px 간격 (Figma 디자인 기준)
          right: 20, // 화면 우측 여백
        });
      });
    }
  }, [isDropdownVisible]);

  return (
    <>
      <View
        ref={containerRef}
        style={[styles.container, style]}
      >
        {/* 총 개수 표시 (Figma 디자인: 왼쪽 절대 위치) */}
        {resultsCount !== undefined && (
          <Text style={styles.resultsCountText}>
            총 {resultsCount}개
          </Text>
        )}

        {/* 정렬 및 필터 버튼 (우측 정렬) */}
        <View style={styles.buttonsContainer}>
          <View ref={sortButtonRef} style={styles.sortButtonWrapper}>
            <SortButton label={selectedSort} onPress={onSortPress} isOpen={isDropdownVisible} />
          </View>
          <SortButton label="필터" icon="filter" onPress={onFilterPress} />
        </View>
      </View>

      {/* 드롭다운 오버레이 - 헤더 바로 아래 고정 위치 */}
      {sortOptions && (
        <DropdownOverlay visible={isDropdownVisible} onClose={onDropdownClose}>
          <View
            style={{
              position: 'absolute',
              top: dropdownPosition.top,
              right: dropdownPosition.right,
              zIndex: 1001,
              minWidth: 150,
            }}
          >
            <DropdownMenu
              options={sortOptions}
              selectedOption={selectedSort}
              onSelect={onSortSelect}
            />
          </View>
        </DropdownOverlay>
      )}
    </>
  );
};
