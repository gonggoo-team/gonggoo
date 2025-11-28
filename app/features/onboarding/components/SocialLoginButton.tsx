/**
 * Social Login Button Component
 *
 * 소셜 로그인용 원형 버튼 컴포넌트
 * Figma: 50x50px, border-radius 25px, white background, box shadow
 */

import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';

interface SocialLoginButtonProps {
  platform: 'kakao' | 'naver' | 'apple';
  onPress: () => void;
}

export function SocialLoginButton({ platform, onPress }: SocialLoginButtonProps) {
  /**
   * 플랫폼별 아이콘 가져오기
   */
  const getIcon = () => {
    switch (platform) {
      case 'kakao':
        return require('@/assets/images/social-icons/kakao.png');
      case 'naver':
        return require('@/assets/images/social-icons/naver.png');
      case 'apple':
        return require('@/assets/images/social-icons/apple.png');
    }
  };

  /**
   * 플랫폼별 아이콘 크기 및 스타일
   * Figma: Kakao 30x30, Naver/Apple 35x35/34
   * borderRadius를 추가하여 이미지를 둥글게 표시
   */
  const getIconStyle = () => {
    switch (platform) {
      case 'kakao':
        return { width: 30, height: 30, borderRadius: 15 };
      case 'naver':
        return { width: 35, height: 35, borderRadius: 17.5 };
      case 'apple':
        return { width: 35, height: 34, borderRadius: 17.5 };
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={getIcon()}
        style={getIconStyle()}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    // Box shadow from Figma: 2px 2px 5px 0px rgba(0, 0, 0, 0.25)
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
