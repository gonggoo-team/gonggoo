/**
 * FilterOptionItem Component
 *
 * 필터 옵션 아이템 컴포넌트입니다.
 * 각 필터의 선택 가능한 옵션을 표시합니다.
 */

import { Icon } from '@/design-system/primitives';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../hooks';

interface FilterOptionItemProps {
  /** 옵션 텍스트 */
  label: string;

  /** 선택 여부 */
  isSelected: boolean;

  /** 클릭 핸들러 */
  onPress: () => void;
}

/**
 * FilterOptionItem Component
 */
export const FilterOptionItem: React.FC<FilterOptionItemProps> = ({
  label,
  isSelected,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderBottomWidth: theme.dimensions.borderWidth.thin, // 1px
          borderBottomColor: theme.colors.border.lowEmp, // #E1E1E1
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        style={[
          styles.text,
          {
            fontFamily: theme.typography.fontFamily.primary, // Pretendard
            fontSize: theme.typography.fontSize.sm, // 14px
            fontWeight: isSelected
              ? theme.typography.fontWeight.semiBold // 600
              : theme.typography.fontWeight.medium, // 500
            color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
            letterSpacing: theme.typography.getLetterSpacing(
              theme.typography.fontSize.sm
            ), // -0.35            
          },
          
        ]}
      >
        {label}
      </Text>
      <View style={styles.checkIcon}>
        {isSelected && (
          <Icon
            name="check"
            size={24}
            // color={theme.colors.surface.texticon.onbrand.icon.highEmp} // 아이콘 색상 (디자인 토큰 사용)
            // style={styles.checkIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingVertical: 16,
    paddingHorizontal: 20,  
    justifyContent: 'space-between',
  },
  text: {
    textAlign: 'center',
  },
  checkIcon: {
    width: 24,
    height: 24,
  }
});
