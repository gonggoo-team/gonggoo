/**
 * AccountDeletionScreen
 *
 * 회원 탈퇴 화면
 * Figma 디자인 기반으로 구현된 회원 탈퇴 프로세스
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GNB, useTheme } from '@/design-system';
import { ConfirmationModal } from '@/app/shared/components';
import { getMockUserProfile } from '@/app/shared/services/mock';
import { NoticeSection, AgreementCheckbox, FeedbackInput } from './components';
import { useAccountDeletion } from './hooks';
import { ACCOUNT_DELETION_TEXT, getAccountDeletionColors } from './constants/accountDeletion.constants';

export default function AccountDeletionScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getAccountDeletionColors();
  const userProfile = getMockUserProfile();

  const {
    isAgreed,
    toggleAgreement,
    feedbackText,
    setFeedbackText,
    showConfirmModal,
    handleDeleteAccount,
    handleCancelDeletion,
    handleConfirmDeletion,
  } = useAccountDeletion();

  const getLetterSpacing = (fontSize: number, percentage: number) => {
    return (fontSize * percentage) / 100;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back-with-title',
          title: ACCOUNT_DELETION_TEXT.title,
          onPress: () => router.back(),
        }}
      />

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 메인 타이틀 */}
        <View style={styles.mainTitleContainer}>
          <Text
            style={[
              styles.mainTitle,
              {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semiBold,
                lineHeight: theme.typography.fontSize.xl * 1.2,
                letterSpacing: getLetterSpacing(theme.typography.fontSize.xl, -2.5),
                color: theme.colors.surface.texticon.onnormal.text.black,
              },
            ]}
          >
            {ACCOUNT_DELETION_TEXT.mainTitle(userProfile.nickname)}
          </Text>
        </View>

        {/* 안내사항 섹션 1: 개인정보 파기 및 콘텐츠 삭제 */}
        <NoticeSection items={[...ACCOUNT_DELETION_TEXT.noticeSection1.items]} />

        {/* 동의 체크박스 */}
        <View style={styles.checkboxContainer}>
          <AgreementCheckbox
            checked={isAgreed}
            onToggle={toggleAgreement}
            text={ACCOUNT_DELETION_TEXT.agreement.text}
          />
        </View>

        {/* 서브 타이틀: 떠나는 이유 */}
        <View style={styles.reasonTitleContainer}>
          <Text
            style={[
              styles.reasonTitle,
              {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semiBold,
                lineHeight: theme.typography.fontSize.xl * 1.2,
                letterSpacing: getLetterSpacing(theme.typography.fontSize.xl, -2.5),
                color: theme.colors.surface.texticon.onnormal.text.black,
              },
            ]}
          >
            {ACCOUNT_DELETION_TEXT.reasonTitle}
          </Text>
        </View>

        {/* 탈퇴 사유 입력창 */}
        <FeedbackInput value={feedbackText} onChangeText={setFeedbackText} />
      </ScrollView>

      {/* 고정된 하단 버튼 */}
      <View
        style={[
          styles.bottomButtonContainer,,
        ]}
      >
        <TouchableOpacity
          style={[
            styles.deleteButton,
            {
              backgroundColor: isAgreed
                ? colors.buttonActiveBg
                : colors.buttonInactiveBg,
            },
          ]}
          onPress={handleDeleteAccount}
          disabled={!isAgreed}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.deleteButtonText,
              {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semiBold,
                lineHeight: theme.typography.fontSize.md * 1.2,
                letterSpacing: getLetterSpacing(theme.typography.fontSize.md, -2.5),
                color: isAgreed
                  ? colors.buttonActiveText
                  : colors.buttonInactiveText,
              },
            ]}
          >
            {ACCOUNT_DELETION_TEXT.deleteButton.active}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 최종 확인 모달 */}
      <ConfirmationModal
        visible={showConfirmModal}
        title={ACCOUNT_DELETION_TEXT.confirmationModal.title}
        descriptions={[...ACCOUNT_DELETION_TEXT.confirmationModal.descriptions]}
        cancelText={ACCOUNT_DELETION_TEXT.confirmationModal.cancelText}
        confirmText={ACCOUNT_DELETION_TEXT.confirmationModal.confirmText}
        confirmColor={theme.colors.surface.brand.primary}
        onCancel={handleCancelDeletion}
        onConfirm={handleConfirmDeletion}
      />
    </View>
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
    paddingBottom: 20,
  },
  mainTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  mainTitle: {
    width: 313,
  },
  reasonTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 72, // Figma에서 섹션 2와 체크박스 사이 간격
  },
  reasonTitle: {
    width: 313,
  },
  checkboxContainer: {
    
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,    
    paddingBottom: 40,
  },
  deleteButton: {
    width: '100%',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    // Dynamic styles applied inline
  },
});
