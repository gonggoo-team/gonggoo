/**
 * SortButton Component
 *
 * 정렬 옵션을 선택할 수 있는 버튼 컴포넌트입니다.
 * Figma 디자인 시스템의 정렬 버튼을 구현합니다.
 *
 * Figma 링크: https://www.figma.com/design/jPe01AFoSydgfZcPoZwncX/Untitled?node-id=116-72
 * 마지막 동기화: 2025-10-06
 *
 * 사용 예시:
 * <SortButton
 *   label="추천순"
 *   isOpen={isOpen}
 *   onPress={() => setIsOpen(!isOpen)}
 * />
 */

import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { useTheme } from '../../hooks';
import { createSortButtonStyles } from './SortButton.styles';
import { Icon } from '../Icon';

/**
 * SortButton Props
 */
export interface SortButtonProps {
  /** 버튼 라벨 (예: "추천순", "최신순" 등) */
  label: string;

  /** 드롭다운 열림 상태 */
  isOpen?: boolean;

  /** 클릭 핸들러 */
  onPress: () => void;

  /** 아이콘 타입 (기본: 'drop') */
  icon?: 'drop' | 'filter';

  /** 컨테이너 커스텀 스타일 */
  style?: StyleProp<ViewStyle>;

  /** 텍스트 커스텀 스타일 */
  textStyle?: StyleProp<TextStyle>;

  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

/**
 * SortButton Component
 */
export const SortButton: React.FC<SortButtonProps> = ({
  label,
  isOpen = false,
  onPress,
  icon = 'drop',
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();
  const styles = createSortButtonStyles(theme);

  // 아이콘 회전 애니메이션 (drop 아이콘만 적용)
  const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    if (icon === 'drop') {
      Animated.timing(rotateAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, icon, rotateAnim]);

  // 회전 각도 계산 (0deg → 180deg)
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${label} ${icon === 'filter' ? '필터' : '정렬'} 옵션 선택`}
      accessibilityState={{ expanded: isOpen }}
    >
      <Text style={[styles.label, textStyle]}>{label}</Text>
      {icon === 'drop' ? (
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon
            name="drop"
            size={16}
            color={theme.colors.surface.texticon.onnormal.icon.black}
          />
        </Animated.View>
      ) : (
        <Icon
          name={icon}
          size={16}
          color={theme.colors.surface.texticon.onnormal.icon.black}
        />
      )}
    </TouchableOpacity>
  );
};
