/**
 * Title Section Component
 *
 * 상품 등록 화면의 제목 섹션입니다.
 */

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Icon } from '@/design-system';
import { useFocusState } from '../hooks';

interface TitleSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export const TitleSection: React.FC<TitleSectionProps> = ({ value, onChange }) => {
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
          제목
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
              placeholder="제목을 입력하세요"
              placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
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
    // minHeight: 48,
  },
  input: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
    lineHeight: 17,
    padding: 0,
    paddingHorizontal: 4,
    textAlignVertical: 'center',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    // padding: 4,
  },
});
