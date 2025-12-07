/**
 * useProductEdit Hook
 *
 * 상품 수정 폼 데이터 관리 및 제출 로직을 담당합니다.
 */

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getBaseProductById, toFormData } from '@/app/shared/services/mock';
import type { ProductRegistrationFormData } from '@/app/features/product-registration/types';

/**
 * useProductEdit Hook
 */
export const useProductEdit = (productId: string) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ProductRegistrationFormData>({
    images: [],
    title: '',
    isFree: false,
    price: '',
    period: null,
    slots: 2,
    description: '',
    location: null,
    isDeliveryAvailable: false,
  });

  // 기존 상품 데이터 로드 및 폼 초기화
  useEffect(() => {
    const loadProduct = () => {
      try {
        const product = getBaseProductById(productId);

        if (!product) {
          Alert.alert('오류', '상품을 찾을 수 없습니다.', [
            { text: '확인', onPress: () => router.back() },
          ]);
          return;
        }

        // 기존 데이터로 폼 초기화 (toFormData 유틸리티 사용)
        setFormData(toFormData(product));
      } catch (error) {
        console.error('상품 로드 오류:', error);
        Alert.alert('오류', '상품을 불러오는 중 오류가 발생했습니다.', [
          { text: '확인', onPress: () => router.back() },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId, router]);

  /**
   * 필드 업데이트
   */
  const updateField = <K extends keyof ProductRegistrationFormData>(
    field: K,
    value: ProductRegistrationFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * 폼 유효성 검사
   */
  const validateForm = (): boolean => {
    if (formData.images.length === 0) {
      Alert.alert('알림', '사진을 최소 1장 이상 등록해주세요.');
      return false;
    }

    if (!formData.title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return false;
    }

    if (!formData.isFree && !formData.price) {
      Alert.alert('알림', '가격을 입력해주세요.');
      return false;
    }

    if (!formData.description.trim()) {
      Alert.alert('알림', '추가 설명을 입력해주세요.');
      return false;
    }

    if (!formData.location) {
      Alert.alert('알림', '거래 위치를 설정해주세요.');
      return false;
    }

    return true;
  };

  /**
   * 폼 제출
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API 호출 (수정)
      console.log('Update product:', productId, formData);

      // 임시: 2초 대기
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert('성공', '공구글이 수정되었습니다.', [
        {
          text: '확인',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('수정 오류:', error);
      Alert.alert('오류', '수정 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    handleSubmit,
    isSubmitting,
    isLoading,
  };
};
