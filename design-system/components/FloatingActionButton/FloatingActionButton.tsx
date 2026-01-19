/**
 * FloatingActionButton Component
 *
 * 화면 우하단에 고정되는 플로팅 액션 버튼 컴포넌트입니다.
 * Expo Router가 Safe Area를 자동 처리하므로 일관된 위치를 보장합니다.
 *
 * 위치 계산:
 * - Figma 기준: 화면 하단에서 109.5px
 * - 탭바 높이(84px) + 버튼 간격(25px) = 109px
 *
 * 주요 기능:
 * - visible prop으로 가시성 제어 (애니메이션 적용)
 * - 기기/OS에 관계없이 일관된 위치
 *
 * 사용 예시:
 * ```tsx
 * <FloatingActionButton
 *   onPress={() => console.log('Pressed')}
 *   icon="plus"
 *   accessibilityLabel="상품 등록"
 *   visible={!isFilterOpen}
 * />
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FLOATING_ACTION_BUTTON } from '@/app/shared/constants/layout';
import { useTheme } from '../../hooks';
import { Icon } from '../../primitives/Icon';
import type { FloatingActionButtonProps } from './FloatingActionButton.types';

/** 애니메이션 설정 */
const ANIMATION_CONFIG = {
  DURATION: 200,
  USE_NATIVE_DRIVER: true,
};

/**
 * FloatingActionButton Component
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  bottom,
  right = 20,
  icon = 'plus',
  accessibilityLabel = '플로팅 액션 버튼',
  visible = true,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // 애니메이션 값 (scale + opacity)
  const animatedValue = useRef(new Animated.Value(visible ? 1 : 0)).current;
  // 완전히 숨겨진 상태 추적 (애니메이션 완료 후)
  const [isHidden, setIsHidden] = useState(!visible);

  // visible 변경 시 애니메이션
  useEffect(() => {
    if (visible) {
      setIsHidden(false);
    }
    Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: ANIMATION_CONFIG.DURATION,
      useNativeDriver: ANIMATION_CONFIG.USE_NATIVE_DRIVER,
    }).start(() => {
      if (!visible) {
        setIsHidden(true);
      }
    });
  }, [visible, animatedValue]);

  // bottom 위치 계산: 탭바 컨텐츠(60) + 버튼 간격(25) + SafeArea bottom
  // Galaxy S8: 85px, iPhone: 119px
  const calculatedBottom = bottom ?? FLOATING_ACTION_BUTTON.getBottomPosition(insets.bottom);

  // 완전히 숨겨진 상태에서는 렌더링하지 않음
  if (isHidden) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: calculatedBottom,
          right: right,
          opacity: animatedValue,
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: theme.colors.surface.brand.primary,
            shadowColor: theme.shadows.xl.shadowColor,
            shadowOffset: theme.shadows.xl.shadowOffset,
            shadowOpacity: theme.shadows.xl.shadowOpacity,
            shadowRadius: theme.shadows.xl.shadowRadius,
            elevation: theme.shadows.xl.elevation,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        android_ripple={{
          color: 'rgba(255, 255, 255, 0.3)',
        }}
      >
        <Icon
          name={icon}
          size={24}
          color={theme.colors.surface.texticon.onnormal.text.white}
        />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
