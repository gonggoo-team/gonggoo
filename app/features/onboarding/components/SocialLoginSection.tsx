/**
 * Social Login Section Component
 *
 * 소셜 로그인 영역 (구분선 + 3개 소셜 버튼)
 * Figma: Frame 6077, 375x127px
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SocialLoginButton } from './SocialLoginButton';

export function SocialLoginSection() {
  /**
   * 카카오 로그인 핸들러
   */
  const handleKakaoLogin = () => {
    // TODO: Implement Kakao login
  };

  /**
   * 네이버 로그인 핸들러
   */
  const handleNaverLogin = () => {
    // TODO: Implement Naver login
  };

  /**
   * 애플 로그인 핸들러
   */
  const handleAppleLogin = () => {
    // TODO: Implement Apple login
  };

  return (
    <View style={styles.container}>
      {/* Divider with text overlay */}
      <View style={styles.dividerContainer}>
        {/* Background line */}
        <View style={styles.line} />

        {/* Text overlay on white background */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>소셜 계정으로 로그인</Text>
        </View>
      </View>

      {/* Social buttons row */}
      <View style={styles.buttonsRow}>
        <SocialLoginButton platform="kakao" onPress={handleKakaoLogin} />
        <SocialLoginButton platform="naver" onPress={handleNaverLogin} />
        <SocialLoginButton platform="apple" onPress={handleAppleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 375,
    height: 127,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 10,
  },
  dividerContainer: {
    width: 248,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
    width: 248,
    height: 1,
    backgroundColor: '#D1D6DA',
    top: 18,
  },
  textContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  text: {
    fontFamily: 'Pretendard',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16.8,
    letterSpacing: -0.35, // 14 * -0.025
    color: '#9FA7B1',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 35,
    alignItems: 'center',
  },
});
