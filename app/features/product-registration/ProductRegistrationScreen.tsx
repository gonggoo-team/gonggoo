/**
 * Product Registration Screen
 *
 * 공구 상품 등록 화면입니다.
 * Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=1162-12412&m=dev
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GNB, Button, useTheme, Divider } from '@/design-system';
import {
  ImageUploadSection,
  TitleSection,
  TransactionSection,
  DescriptionSection,
  LocationSection,
} from './components';
import { useProductRegistration } from './hooks';

/**
 * ProductRegistrationScreen Component
 */
export default function ProductRegistrationScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    formData,
    updateField,
    handleSubmit,
    isSubmitting,
  } = useProductRegistration();

  const handleClose = () => {
    router.back();
  };

  const handleSave = () => {
    // TODO: 임시 저장 기능
    console.log('Save draft:', formData);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* GNB */}
      <GNB
        leftSection={{ type: 'close', onPress: handleClose }}
        centerSection={{ type: 'title', text: '공구 상품 등록하기' }}
        rightTextButton={{
          type: 'text-button',
          text: '저장',
          variant: 'primary',
          onPress: handleSave,
        }}
      />

      {/* Divider */}
      <Divider color="lowEmp" />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 109 }, // 작성완료 버튼 높이 + insets
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 사진 섹션 */}
        <ImageUploadSection
          images={formData.images}
          onImagesChange={(images) => updateField('images', images)}
        />

        {/* 제목 섹션 */}
        <TitleSection
          value={formData.title}
          onChange={(value) => updateField('title', value)}
        />

        {/* 거래방식 섹션 */}
        <TransactionSection
          isFree={formData.isFree}
          price={formData.price}
          period={formData.period}
          slots={formData.slots}
          onFreeChange={(value) => updateField('isFree', value)}
          onPriceChange={(value) => updateField('price', value)}
          onPeriodChange={(value) => updateField('period', value)}
          onSlotsChange={(value) => updateField('slots', value)}
        />

        {/* 추가설명 섹션 */}
        <DescriptionSection
          value={formData.description}
          onChange={(value) => updateField('description', value)}
        />

        {/* 거래 정보 섹션 */}
        <LocationSection
          location={formData.location}
          isDeliveryAvailable={formData.isDeliveryAvailable}
          onLocationChange={(value) => updateField('location', value)}
          onDeliveryChange={(value) => updateField('isDeliveryAvailable', value)}
        />
      </ScrollView>

      {/* 작성완료 버튼 */}
      <View
        style={[
          styles.bottomButtonContainer,
          {
            paddingBottom: insets.bottom + theme.spacing.sm,
            backgroundColor: theme.colors.surface.normal.bg1,
          },
        ]}
      >
        <Button
          variant="full-primary-rounded"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          작성 완료
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
  },
});
