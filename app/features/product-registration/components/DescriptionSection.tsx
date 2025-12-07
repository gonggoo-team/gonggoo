/**
 * Description Section Component
 *
 * 상품 등록 화면의 추가설명 섹션입니다.
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Icon } from '@/design-system';
import { useFocusState } from '../hooks';

interface DescriptionSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  value,
  onChange,
}) => {
  const { theme } = useTheme();
  const { focusHandlers, focusBorderColor } = useFocusState();

  const handleClear = () => {
    onChange('');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      <View style={styles.content}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.surface.texticon.onnormal.text.black },
          ]}
        >
          추가 설명
        </Text>
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: focusBorderColor,
                backgroundColor: theme.colors.surface.normal.bg1,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
              value={value}
              onChangeText={onChange}
              placeholder="상세 설명을 입력하세요"
              placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
              multiline
              textAlignVertical="top"
              {...focusHandlers}
            />
          </View>
          {value.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <Icon
                name="text-delete"
                size={20}
                color={theme.colors.surface.texticon.onnormal.icon.lowEmp}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  content: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 109,
  },
  input: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
    lineHeight: 17,
    padding: 0,
    paddingHorizontal: 4,
    minHeight: 85,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    // right: 12,
    // top: 16,
    // padding: 4,
  },
});
