/**
 * SearchTag Component
 *
 * 검색 태그 컴포넌트입니다.
 * 최근 검색어 및 추천 검색어를 표시하는 칩 형태의 버튼입니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=449-8791&m=dev
 * 마지막 동기화: 2025-10-24
 *
 * 주요 기능:
 * - 두 가지 variant (recent, recommended)
 * - recent: X 버튼 포함, 흰 배경, 회색 테두리
 * - recommended: X 버튼 없음, 회색 배경
 * - 긴 텍스트 자동 말줄임 처리
 * - 클릭 이벤트 지원
 *
 * 반응형 디자인:
 * - 텍스트 길이에 따라 자동으로 크기 조절
 * - 최대 너비 제한 없음 (부모 컨테이너에서 제어)
 * - 모든 디바이스에서 정상 작동
 *
 * 사용 예시:
 * ```tsx
 * // 최근 검색어
 * <SearchTag
 *   variant="recent"
 *   text="고양이 간식"
 *   onPress={(text) => handleSearch(text)}
 *   onDelete={(text) => handleDelete(text)}
 * />
 *
 * // 추천 검색어
 * <SearchTag
 *   variant="recommended"
 *   text="크리넥스 3겹 천연펄프"
 *   onPress={(text) => handleSearch(text)}
 * />
 * ```
 */

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../Icon';
import { createSearchTagStyles } from './SearchTag.styles';
import type { SearchTagProps } from './SearchTag.types';

/**
 * SearchTag Component
 */
export const SearchTag: React.FC<SearchTagProps> = ({
  text,
  variant,
  onPress,
  onDelete,
  style,
  accessibilityLabel,
  testID,
}) => {
  const { theme } = useTheme();
  const styles = createSearchTagStyles(theme);

  // 클릭 핸들러
  const handlePress = () => {
    onPress?.(text);
  };

  // 삭제 핸들러 (recent variant만)
  const handleDelete = (e: { stopPropagation?: () => void }) => {
    // 이벤트 전파 방지 (태그 클릭과 구분)
    e?.stopPropagation?.();
    onDelete?.(text);
  };

  // 접근성 라벨 생성
  const defaultAccessibilityLabel =
    variant === 'recent'
      ? `최근 검색어 ${text}, 삭제하려면 X 버튼 클릭`
      : `추천 검색어 ${text}`;

  return (
    <TouchableOpacity
      style={[styles.container, styles[variant], style]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
      testID={testID || `search-tag-${variant}-${text}`}
    >
      {/* 텍스트 */}
      <View style={styles.textContainer}>
        <Text
          style={styles.text}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {text}
        </Text>
      </View>

      {/* X 버튼 (recent variant만) */}
      {variant === 'recent' && onDelete && (
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.iconContainer}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`${text} 삭제`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon
            name="small-x"
            size={13}
            color={theme.colors.surface.texticon.onnormal.icon.black}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};
