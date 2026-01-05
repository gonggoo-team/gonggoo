/**
 * SearchBar Component
 *
 * 검색 입력 필드 컴포넌트입니다.
 * Figma 디자인 시스템의 검색바를 구현합니다.
 *
 * Figma 링크: https://www.figma.com/design/jPe01AFoSydgfZcPoZwncX/Untitled?node-id=116-72
 * 마지막 동기화: 2025-10-06
 *
 * 사용 예시:
 * <SearchBar
 *   value={searchText}
 *   onChangeText={setSearchText}
 *   placeholder="검색어를 입력해주세요."
 * />
 */

import React, { useState } from 'react';
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import { createSearchBarStyles, type SearchBarVariant } from './SearchBar.styles';

/**
 * SearchBar Props
 */
export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  /** 검색어 */
  value: string;

  /** 검색어 변경 핸들러 */
  onChangeText: (text: string) => void;

  /** 검색 버튼 클릭 핸들러 */
  onSearch?: (text: string) => void;

  /** 삭제 버튼 클릭 핸들러 */
  onClear?: () => void;

  /** 포커스 상태 변경 핸들러 */
  onFocusChange?: (focused: boolean) => void;

  /** 컨테이너 커스텀 스타일 */
  containerStyle?: StyleProp<ViewStyle>;

  /** 입력 필드 커스텀 스타일 */
  inputStyle?: StyleProp<TextStyle>;

  /** Placeholder (기본: "검색어를 입력해주세요.") */
  placeholder?: string;

  /**
   * 검색바 스타일 variant
   * - default: 기본 스타일 (회색 배경, 그림자 없음)
   * - map: 지도 검색창 스타일 (흰색 배경, 그림자 있음)
   */
  variant?: SearchBarVariant;
}

/**
 * SearchBar Component
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  onClear,
  onFocusChange,
  containerStyle,
  inputStyle,
  placeholder = '검색어를 입력해주세요.',
  variant = 'default',
  ...textInputProps
}) => {
  const { theme } = useTheme();
  const styles = createSearchBarStyles(theme, variant);
  const [isFocused, setIsFocused] = useState(false);

  // 포커스 핸들러
  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  // 삭제 핸들러
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChangeText('');
    }
  };

  // 검색 핸들러
  const handleSearch = () => {
    onSearch?.(value);
  };

  // 삭제 버튼 표시 여부
  const showClearButton = value.length > 0;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.contentContainer}>
        {/* Input Field */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            {...textInputProps}
          />

          {/* Cursor Line (입력 중일 때만 표시) */}
          {/* {isFocused && value.length > 0 && (
            <View style={styles.cursor} />
          )} */}
        </View>

        {/* Icons */}
        <View style={styles.iconContainer}>
          {variant === 'map' ? (
            // map variant: 검색어 있으면 close(20)만, 없으면 search(24)만 표시
            showClearButton ? (
              <TouchableOpacity
                onPress={handleClear}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="검색어 삭제"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon
                  name="close"
                  size={20}
                  color={theme.colors.surface.texticon.onnormal.icon.black}
                />
              </TouchableOpacity>
            ) : (
              <Icon
                name="search"
                size={24}
                color={theme.colors.surface.texticon.onnormal.icon.black}
              />
            )
          ) : (
            // default variant: 검색어 있으면 text-delete + search, 없으면 search만
            <>
              {/* Clear Button (텍스트가 있을 때만 표시) */}
              {showClearButton && (
                <TouchableOpacity
                  onPress={handleClear}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel="검색어 삭제"
                >
                  <Icon name="text-delete" size={24} />
                </TouchableOpacity>
              )}

              {/* Search Icon */}
              <TouchableOpacity
                onPress={handleSearch}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="검색"
              >
                <Icon
                  name="search"
                  size={24}
                  color={theme.colors.surface.texticon.onnormal.icon.black}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </View>
  );
};
