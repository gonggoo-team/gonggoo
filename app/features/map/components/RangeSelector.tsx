/**
 * RangeSelector Component
 *
 * 지도 화면에서 거리 범위를 선택하는 가로 스크롤 버튼 컴포넌트
 * - 동적으로 범위 옵션 설정 가능
 * - 선택된 버튼: 녹색 배경, 흰색 텍스트
 * - 미선택 버튼: 흰색 배경, 검정 텍스트, 회색 테두리
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, View } from 'react-native';
import { useTheme } from '@/design-system';

export interface RangeOption {
  /** 범위 값 (km 단위) */
  value: number;
  /** 표시 텍스트 */
  label: string;
}

interface RangeSelectorProps {
  /** 범위 옵션 목록 */
  ranges: RangeOption[];
  /** 현재 선택된 범위 값 (null이면 아무것도 선택 안됨) */
  selectedRange: number | null;
  /** 범위 선택 핸들러 */
  onRangeSelect: (range: number) => void;
}

export const RangeSelector: React.FC<RangeSelectorProps> = ({
  ranges,
  selectedRange,
  onRangeSelect,
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
      bounces={false}
    >
      {ranges.map((range, index) => {
        const isSelected = range.value === selectedRange;

        return (
          <TouchableOpacity
            key={range.value}
            style={[
              styles.button,
              {
                backgroundColor: isSelected
                  ? '#006242' // 녹색
                  : theme.colors.surface.normal.bg1, // 흰색
                borderColor: isSelected ? '#006242' : '#E1E1E1',
              },
            ]}
            onPress={() => onRangeSelect(range.value)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: isSelected
                    ? '#FFFFFF' // 흰색
                    : theme.colors.surface.texticon.onnormal.text.highEmp,
                },
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingRight: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
