/**
 * Image Upload Section Component
 *
 * 상품 등록 화면의 이미지 업로드 섹션입니다.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, Icon } from '@/design-system';

interface ImageUploadSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const MAX_IMAGES = 10;

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  images,
  onImagesChange,
}) => {
  const { theme } = useTheme();

  const handleAddImage = async () => {
    if (images.length >= MAX_IMAGES) {
      return;
    }

    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: MAX_IMAGES - images.length,
      });

      if (!result.canceled && result.assets.length > 0) {
        const newImageUris = result.assets.map((asset) => asset.uri);
        onImagesChange([...images, ...newImageUris]);
      }
    } catch (error) {
      console.error('이미지 선택 오류:', error);
      Alert.alert('오류', '이미지를 선택하는 중 오류가 발생했습니다.');
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      <View style={styles.content}>
        {/* 사진 추가 버튼 */}
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: theme.colors.surface.normal.bg2 }]}
          onPress={handleAddImage}
          activeOpacity={0.7}
        >
          <Icon
            name="camera"
            size={24}
            color={theme.colors.surface.texticon.onnormal.icon.highEmp}
          />
          <View style={styles.countTextContainer}>
            <Text
              style={[
                styles.uploadButtonText,
                { color: theme.colors.surface.brand.primary },
              ]}
            >
              {images.length}
            </Text>
            <Text
              style={[
                styles.uploadButtonText,
                { color: theme.colors.surface.texticon.onnormal.text.midEmp },
              ]}
            >
              /{MAX_IMAGES}
            </Text>
          </View>
        </TouchableOpacity>

        {/* 업로드된 이미지들 */}
        {images.map((uri, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={[styles.removeButton, { backgroundColor: theme.colors.surface.normal.bg1 }]}
              onPress={() => handleRemoveImage(index)}
              activeOpacity={0.7}
            >
              <Icon
                name="x"
                size={16}
                color={theme.colors.surface.texticon.onnormal.icon.black}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  uploadButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  uploadButtonText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Pretendard',
  },
  countTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
