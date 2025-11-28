/**
 * Login Link Section Component
 *
 * "이미 계정이 있나요? 로그인" 링크 섹션
 * Figma: Frame 6083
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LoginLinkSectionProps {
  onLoginPress: () => void;
}

export function LoginLinkSection({ onLoginPress }: LoginLinkSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>이미 계정이 있나요?</Text>
      <TouchableOpacity onPress={onLoginPress} activeOpacity={0.7}>
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  questionText: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14.4, // 1.2001953125em
    color: '#000000',
    textAlign: 'center',
  },
  loginText: {
    fontFamily: 'Pretendard',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 14.32, // 1.193359375em
    color: '#006242',
    textAlign: 'center',
  },
});
