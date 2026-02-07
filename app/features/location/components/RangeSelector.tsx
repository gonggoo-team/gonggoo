/**
 * Range Selector Component
 *
 * 동네 범위 선택 UI (2km, 5km, 10km)
 * 3개 버튼 방식으로 간소화
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/design-system';

interface RangeSelectorProps {
  selectedRange: 2 | 5 | 10;
  onRangeSelect: (range: 2 | 5 | 10) => void;
}

const RANGES: Array<2 | 5 | 10> = [2, 5, 10];

export function RangeSelector({ selectedRange, onRangeSelect }: RangeSelectorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.surface.texticon.onnormal.text.black,
            fontFamily: theme.typography.fontFamily.primary,
            fontWeight: theme.typography.fontWeight.semiBold,
          },
        ]}
      >
        동네 범위 설정
      </Text>

      {/* 3개 버튼 그룹 */}
      <View style={styles.buttonGroup}>
        {RANGES.map((range) => {
          const isSelected = selectedRange === range;
          return (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeButton,
                {
                  backgroundColor: isSelected
                    ? theme.colors.surface.brand.primary
                    : theme.colors.surface.normal.bg1,
                  borderColor: isSelected
                    ? theme.colors.surface.brand.primary
                    : theme.colors.border.lowEmp,
                },
              ]}
              onPress={() => {
                onRangeSelect(range);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.rangeButtonText,
                  {
                    color: isSelected
                      ? '#FFFFFF' // 선택된 버튼: 흰색 텍스트
                      : theme.colors.surface.texticon.onnormal.text.black,
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight: isSelected
                      ? theme.typography.fontWeight.semiBold
                      : theme.typography.fontWeight.medium,
                  },
                ]}
              >
                {range}km
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.4,
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  rangeButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeButtonText: {
    fontSize: 15,
    lineHeight: 18,
    letterSpacing: -0.3,
  },
});
