/**
 * BottomBar Component
 *
 * iOS 홈 인디케이터 바를 표시하는 컴포넌트
 * 온보딩 화면 등 전체 화면 컨텍스트에서 시각적 일관성을 위해 사용
 *
 * Figma: 375x21px container, 135x5px indicator
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

export function BottomBar() {
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 21,
    paddingHorizontal: 120,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 135,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 2.5,
  },
});
