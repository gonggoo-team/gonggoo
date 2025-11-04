import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface ValueTooltipProps {
  /** 표시할 가격 */
  value: number;
  /** 핸들의 x 위치 (픽셀) */
  position: number;
  /** 툴팁 표시 여부 */
  visible: boolean;
  /** 핸들 타입 (최소/최대) */
  type: 'min' | 'max';
}

/**
 * ValueTooltip
 *
 * 가격 슬라이더 드래그 중 현재 값을 표시하는 툴팁
 */
export const ValueTooltip: React.FC<ValueTooltipProps> = ({
  value,
  position,
  visible,
  type,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    if (visible) {
      // Fade In + 위로 올라오는 애니메이션
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade Out
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  // 가격 포맷팅 (천 단위 콤마)
  const formattedValue = `${value.toLocaleString('ko-KR')}원`;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: position,
          opacity,
          transform: [{ translateY }, { translateX: -32 }], // 중앙 정렬 (container width / 2)
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.bubble}>
        <Text style={styles.text}>{formattedValue}</Text>
      </View>
      <View style={styles.arrow} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -60, // 핸들 위 60px
    alignItems: 'center',
    zIndex: 1000,
  },
  bubble: {
    backgroundColor: '#006242', // 브랜드 그린
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android 그림자
    minWidth: 64, // 최소 너비 보장
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#006242', // 브랜드 그린
    marginTop: -1, // 약간 겹치도록
  },
});
