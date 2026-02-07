import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

/**
 * 이미지 선택 Custom Hook
 *
 * expo-image-picker를 사용하여 갤러리에서 이미지를 선택하는 공통 로직을 제공합니다.
 * 프로필 이미지 선택 등에 재사용 가능합니다.
 *
 * @returns profileImageUri - 선택된 이미지 URI
 * @returns handleImagePick - 이미지 선택 핸들러
 * @returns setProfileImageUri - 이미지 URI 직접 설정 함수
 */
export function useImagePicker(initialImageUri?: string) {
  const [profileImageUri, setProfileImageUri] = useState<string | undefined>(initialImageUri);

  const handleImagePick = useCallback(async () => {
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
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('이미지 선택 오류:', error);
      Alert.alert('오류', '이미지를 선택하는 중 오류가 발생했습니다.');
    }
  }, []);

  return {
    profileImageUri,
    handleImagePick,
    setProfileImageUri,
  };
}
