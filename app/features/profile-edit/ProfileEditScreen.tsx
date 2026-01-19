/**
 * Profile Edit Screen
 *
 * 프로필 수정 화면 (프로필 이미지 + 닉네임 수정)
 * Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=678-6601
 *
 * 주요 기능:
 * - 프로필 이미지 업로드/변경
 * - 닉네임 입력 및 검증
 * - 완료 버튼으로 저장
 *
 * Route: /profile-edit
 */

import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme, GNB, ScreenWrapper } from '@/design-system';
import { useThrottledNavigation, useThrottledCallback } from '@/app/shared/hooks';
import { ProfileImageInput, NicknameInput } from './components';
import { useProfileEdit } from './hooks';

/**
 * 프로필 수정 화면
 */
export default function ProfileEditScreen() {
  const { theme } = useTheme();
  const { back } = useThrottledNavigation();

  const {
    nickname,
    profileImageUri,
    hasError,
    handleNicknameChange,
    handleNicknameClear,
    handleImagePick,
    handleSave,
  } = useProfileEdit();

  /**
   * 완료 버튼 핸들러 (쓰로틀링 적용)
   * 저장 성공 시 이전 화면으로 이동
   */
  const handleComplete = useThrottledCallback(() => {
    const success = handleSave();

    if (success) {
      Alert.alert(
        '프로필 수정 완료',
        '프로필이 성공적으로 수정되었습니다.',
        [
          {
            text: '확인',
            onPress: back,
          },
        ]
      );
    }
  }, 300);

  return (
    <ScreenWrapper style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back-with-title',
          title: '프로필 수정',
          onPress: back,
        }}
        rightTextButton={{
          type: 'text-button',
          text: '완료',
          onPress: handleComplete,
        }}
      />

      {/* 스크롤 가능한 콘텐츠 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 프로필 이미지 */}
        <ProfileImageInput
          imageUri={profileImageUri}
          onPress={handleImagePick}
        />

        {/* 닉네임 입력 */}
        <NicknameInput
          value={nickname}
          onChangeText={handleNicknameChange}
          onClear={handleNicknameClear}
          hasError={hasError}
          errorMessage="닉네임을 입력해주세요!"
        />
      </ScrollView>
    </ScreenWrapper>
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
    paddingBottom: 40, // 하단 여백
  },
});
