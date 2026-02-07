/**
 * DropdownMenu Component
 *
 * 드롭다운 메뉴 컴포넌트입니다.
 * Figma 디자인 시스템의 드롭다운 박스를 구현합니다.
 *
 * Figma 링크: https://www.figma.com/design/jPe01AFoSydgfZcPoZwncX/Untitled?node-id=116-72
 * 마지막 동기화: 2025-10-06
 *
 * 사용 예시:
 * <DropdownMenu
 *   options={['최신순', '오래된 순', '인기순', '할인율 높은 순']}
 *   onSelect={(option) => console.log(option)}
 *   selectedOption="최신순"
 * />
 */

import React from 'react';
import {
  FlatList,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks';
import { createDropdownMenuStyles } from './DropdownMenu.styles';

/**
 * DropdownMenu Option
 */
export interface DropdownMenuOption {
  label: string;
  value: string;
}

/**
 * DropdownMenu Props
 */
export interface DropdownMenuProps {
  /** 옵션 목록 (문자열 배열 또는 객체 배열) */
  options: string[] | DropdownMenuOption[];

  /** 선택된 옵션 */
  selectedOption?: string;

  /** 옵션 선택 핸들러 */
  onSelect: (value: string) => void;

  /** 컨테이너 커스텀 스타일 */
  style?: StyleProp<ViewStyle>;

  /** 옵션 아이템 커스텀 스타일 */
  itemStyle?: StyleProp<ViewStyle>;

  /** 옵션 텍스트 커스텀 스타일 */
  textStyle?: StyleProp<TextStyle>;

  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

/**
 * DropdownMenu Component
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  options,
  selectedOption,
  onSelect,
  style,
  itemStyle,
  textStyle,
  accessibilityLabel = '정렬 옵션 메뉴',
}) => {
  const { theme } = useTheme();
  const styles = createDropdownMenuStyles(theme);

  // 옵션을 표준 형식으로 변환
  const normalizedOptions: DropdownMenuOption[] = options.map((option) =>
    typeof option === 'string'
      ? { label: option, value: option }
      : option
  );

  // 옵션 선택 핸들러
  const handleSelect = (value: string) => {
    onSelect(value);
  };

  // 옵션 렌더링
  const renderItem = ({ item, index }: { item: DropdownMenuOption; index: number }) => {
    const isFirst = index === 0;
    const isLast = index === normalizedOptions.length - 1;
    const isSelected = item.value === selectedOption;

    // 각 아이템의 border radius 결정
    const itemContainerStyle = isFirst
      ? [styles.item, styles.firstItem]
      : isLast
      ? [styles.item, styles.lastItem]
      : styles.item;

    return (
      <TouchableOpacity
        style={[itemContainerStyle, itemStyle]}
        onPress={() => handleSelect(item.value)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${item.label} 선택`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text
          style={[styles.itemText, textStyle]}
          // numberOfLines={1}
          // ellipsizeMode="tail"
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, style]}
      accessibilityRole="menu"
      accessibilityLabel={accessibilityLabel}
    >
      <FlatList        
        data={normalizedOptions}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
        scrollEnabled={false} // 드롭다운이므로 스크롤 비활성화
        style={styles.listContainer} 
      />
    </View>
  );
};
