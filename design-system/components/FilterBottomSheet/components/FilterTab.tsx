/**
 * FilterTab Component
 *
 * 필터 카테고리 탭 컴포넌트입니다.
 * 성별, 연령대, 기간 중 하나를 선택할 수 있습니다.
 */

import { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks';
import type { FilterType } from '../FilterBottomSheet.types';
import { FILTER_TAB_LABELS } from '../FilterBottomSheet.types';

interface FilterTabProps {
  /** 현재 활성 탭 */
  activeTab: FilterType;

  /** 탭 변경 핸들러 */
  onTabChange: (tab: FilterType) => void;
}

/**
 * FilterTab Component
 */
export const FilterTab: React.FC<FilterTabProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { theme } = useTheme();

  const tabs: FilterType[] = ['gender', 'age', 'period'];

  return (
    <BottomSheetView style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        const textColor = isActive
          ? theme.colors.surface.texticon.onnormal.text.black // #181A1A
          : theme.colors.surface.texticon.onnormal.text.midEmp; // #9FA7B1

        return (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => onTabChange(tab)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityLabel={`${FILTER_TAB_LABELS[tab]} 필터`}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.tabText,
                {
                  fontFamily: theme.typography.fontFamily.primary,
                  fontSize: theme.typography.fontSize.md, // 16px
                  fontWeight: theme.typography.fontWeight.semiBold, // 600
                  color: textColor,
                  letterSpacing: theme.typography.getLetterSpacing(
                    theme.typography.fontSize.md
                  ), // -0.4
                },
              ]}
            >
              {FILTER_TAB_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 20,
    paddingVertical: 0,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    textAlign: 'center',
  },
});
