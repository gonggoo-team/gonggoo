/**
 * FadingIcon Component
 *
 * 스크롤에 따라 흰색/검정색 아이콘이 페이드 전환되는 컴포넌트
 */

import React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Icon } from '@/design-system';
import type { IconName } from '@/design-system';

export interface FadingIconProps {
  name: IconName;
  blackOpacity: Animated.AnimatedInterpolation<number>;
  whiteOpacity: Animated.AnimatedInterpolation<number>;
  color: string;
}

export const FadingIcon: React.FC<FadingIconProps> = ({
  name,
  blackOpacity,
  whiteOpacity,
  color,
}) => (
  <View style={styles.container}>
    <Animated.View style={[styles.layer, { opacity: blackOpacity }]}>
      <Icon name={name} size={24} color={color} />
    </Animated.View>
    <Animated.View style={[styles.layer, { opacity: whiteOpacity }]}>
      <Icon name={name} size={24} color="#FFFFFF" />
    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
  },
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
