/**
 * Profile Image Input Component
 *
 * 프로필 이미지 + 카메라 아이콘으로 구성된 프로필 이미지 입력 컴포넌트
 * Figma: 165x165px 원형 이미지, 우측 하단에 45x45px 카메라 버튼
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image as RNImage } from 'react-native';
import { Image } from 'expo-image';
import { useTheme, Icon } from '@/design-system';

export interface ProfileImageInputProps {
  /** 프로필 이미지 URI (없으면 기본 아이콘 표시) */
  imageUri?: string;

  /** 이미지 클릭 핸들러 (이미지 선택) */
  onPress: () => void;

  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

export function ProfileImageInput({
  imageUri,
  onPress,
  accessibilityLabel = '프로필 이미지 변경',
}: ProfileImageInputProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* 프로필 이미지 */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.imageContainer,
          {
            borderColor: theme.colors.border.brand.primary,
          },
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={[styles.placeholderContainer, { backgroundColor: theme.colors.surface.normal.bg2 }]}>
            <Icon
              name="profile-default"
              size={200}
              color={theme.colors.surface.texticon.onnormal.icon.lowEmp}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* 카메라 버튼 (우측 하단) */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.cameraButton,
          { backgroundColor: theme.colors.surface.normal.bg1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="프로필 이미지 선택"
      >
        <View style={[styles.cameraIconContainer, { backgroundColor: theme.colors.surface.brand.primary }]}>
          <Icon
            name="camera"
            size={30}
            color={theme.colors.surface.texticon.onnormal.text.white}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginVertical: 30, // Figma: 상단 여백
  },
  imageContainer: {
    width: 165,
    height: 165,
    borderRadius: 82.5, // 원형
    borderWidth: 1.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 카메라 버튼 (우측 하단)
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 50, // 버튼 터치 영역
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    width: 45, // Figma: 45x45
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
