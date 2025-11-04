/**
 * FilterBottomSheet Component
 *
 * 재사용 가능한 필터 바텀시트 컴포넌트입니다.
 * 성별, 연령대, 기간 3가지 필터를 지원합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=555-9539&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <FilterBottomSheet
 *   isVisible={isVisible}
 *   onClose={() => setIsVisible(false)}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   selectedFilters={selectedFilters}
 *   onSelectOption={handleSelectOption}
 *   onReset={handleReset}
 *   onApply={handleApply}
 *   resultCount={42}
 * />
 * ```
 */

import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Button } from '../../primitives/Button';
import { Divider } from '../../primitives/Divider';
import { Icon } from '../../primitives/Icon';
import { FilterOptionItem } from './components/FilterOptionItem';
import { FilterTab } from './components/FilterTab';
import { createFilterBottomSheetStyles } from './FilterBottomSheet.styles';
import type { FilterBottomSheetProps } from './FilterBottomSheet.types';
import { DEFAULT_FILTER_OPTIONS } from './FilterBottomSheet.types';

/**
 * FilterBottomSheet Component
 */
export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isVisible,
  onClose,
  activeTab,
  onTabChange,
  selectedFilters,
  onSelectOption,
  onReset,
  onApply,
  resultCount,
}) => {
  const { theme } = useTheme();
  const styles = createFilterBottomSheetStyles(theme);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points (바텀시트 높이)
  const snapPoints = useMemo(() => ['60%'], []);

  // isVisible 변경 시 바텀시트 열기/닫기
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  // 바텀시트 닫힐 때 콜백
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Backdrop 렌더링 함수 (Figma 디자인: rgba(24, 26, 26, 0.4))
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        style={[
          props.style,
          { backgroundColor: 'rgba(24, 26, 26, 0.4)' }
        ]}
      />
    ),
    []
  );

  // 현재 활성 탭의 옵션 가져오기
  const currentOptions = DEFAULT_FILTER_OPTIONS[activeTab];

  // 현재 활성 탭의 선택된 값
  const currentSelectedValue = selectedFilters[activeTab];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1} // 처음엔 닫힌 상태
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={handleClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: theme.colors.surface.normal.bg1,
      }}
      handleIndicatorStyle={{
        // backgroundColor: 'transparent', // 핸들 바의 색상을 투명하게 만듭니다.
      }}
    >
      <View style={styles.container}>
        {/* 카테고리 탭 */}
        <View style={styles.tabContainer}>
          <FilterTab activeTab={activeTab} onTabChange={onTabChange} />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <Divider color="lowEmp" />
        </View>

        {/* 옵션 리스트 */}
        <View style={styles.optionsContainer}>
          <ScrollView style={styles.optionsScrollView}>
            {currentOptions.map((option) => (
              <FilterOptionItem
                key={option}
                label={option}
                isSelected={currentSelectedValue === option}
                onPress={() => onSelectOption(activeTab, option)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomAreaContainer}>
          {/* 현재 필터 상태 버튼들 */}
          <View style={styles.buttonsContainer}>
            <Button variant="category-unselected">{selectedFilters.gender}</Button>
            <Button variant="category-unselected">{selectedFilters.age}</Button>
            <Button variant="category-unselected">{selectedFilters.period}</Button>
          </View>
          {/* 하단 영역 (초기화 + 모집글 보기) */}
          <View style={styles.footerContainer}>
            {/* 초기화 버튼 */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={onReset}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="필터 초기화"
            >
              <Icon
                name="refresh"
                size={20}
                color={theme.colors.surface.texticon.onnormal.icon.lowEmp} // #D1D6DA
              />
              <Text style={styles.resetText}>초기화</Text>
            </TouchableOpacity>

            {/* 모집글 보기 버튼 */}
            <View style={styles.applyButtonContainer}>
              <Button variant="square-selected" onPress={onApply}>
                {`${resultCount}개 모집글 보기`}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};
