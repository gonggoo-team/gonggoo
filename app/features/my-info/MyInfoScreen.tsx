/**
 * My Info Screen
 *
 * 내 정보 화면 (회원번호, 전화번호, 계좌정보, 동네설정 등)
 *
 * 주요 기능:
 * - 프로필 이미지 표시 및 프로필 수정 화면으로 이동
 * - 회원번호, 전화번호 표시
 * - 환불계좌, 입금계좌 설정
 * - 동네 설정
 * - 로그아웃 / 계정 탈퇴
 *
 * Route: /my-info
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { MenuList } from '@/app/shared/components';
import { useThrottledNavigation } from '@/app/shared/hooks';
import { getNeighborhoodDisplay } from '@/app/shared/utils';
import { useAuth } from '@/app/shared/contexts';
import type { ProfileMenuItem } from '@/app/shared/types';

import { useTheme } from '@/design-system';
import { GNB } from '@/design-system/components';

import { ProfileImageSection } from './components/ProfileImageSection';

export default function MyInfoScreen() {
  const { theme } = useTheme();
  const { push, back } = useThrottledNavigation();
  const { user, logout } = useAuth();
  const router = useRouter();

  /**
   * 프로필 수정 화면으로 이동
   * 프로필 이미지를 클릭하면 프로필 수정 화면으로 이동
   */
  const handleProfileEdit = () => {
    push('/profile-edit');
  };

  // 각 항목 클릭 핸들러
  const handleMemberIdPress = () => {
    Alert.alert('회원번호', '회원번호는 변경할 수 없습니다.');
  };

  const handleRefundAccountPress = () => {
    Alert.alert('환불계좌', '환불계좌 설정 화면으로 이동합니다. (구현 예정)');
  };

  const handleDepositAccountPress = () => {
    Alert.alert('입금계좌', '입금계좌 설정 화면으로 이동합니다. (구현 예정)');
  };

  const handleNeighborhoodPress = () => {
    Alert.alert('동네설정', '동네 설정 화면으로 이동합니다. (구현 예정)');
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          onPress: async () => {
            try {
              await logout();
              router.replace('/splash');
            } catch (error) {
              console.error('로그아웃 실패:', error);
              Alert.alert('오류', '로그아웃에 실패했습니다. 다시 시도해주세요.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    push('/account-deletion');
  };

  // ProfileMenuItem 배열 생성
  const infoItems: ProfileMenuItem[] = [
    {
      id: 'member-id',
      label: '회원번호',
      value: user?.id || '미설정',
      showChevron: true,
      onPress: handleMemberIdPress,
    },
    {
      id: 'phone-number',
      label: '전화번호',
      value: '미설정', // TODO: user.phoneNumber 필드 추가 시 업데이트
      showChevron: false,
    },
    {
      id: 'refund-account',
      label: '환불계좌',
      value: '미설정', // TODO: user.refundAccount 필드 추가 시 업데이트
      showChevron: true,
      onPress: handleRefundAccountPress,
    },
    {
      id: 'deposit-account',
      label: '입금계좌',
      value: '미설정', // TODO: user.depositAccount 필드 추가 시 업데이트
      showChevron: true,
      onPress: handleDepositAccountPress,
    },
    {
      id: 'neighborhood',
      label: '동네설정',
      value: getNeighborhoodDisplay(user?.location?.address, '미설정'),
      showChevron: true,
      onPress: handleNeighborhoodPress,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg2 }]}>
      {/* GNB */}
      <GNB
        leftSection={{
          type: 'back-with-title',
          title: '내 정보',
          onPress: back,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 이미지 + 닉네임 섹션 */}
        <ProfileImageSection
          nickname={user?.nickname || '사용자'}
          profileImageUri={user?.profileImageUri}
          onImagePress={handleProfileEdit}
        />

        {/* 흰색 배경 영역 (정보 카드) */}
        <View style={[styles.whiteSection, {
          backgroundColor: theme.colors.surface.normal.bg1,
          paddingTop: theme.spacing.xxxl, // 30px
          paddingBottom: theme.spacing.lg, // 20px
        }]}>
          {/* 정보 카드 */}
          <MenuList items={infoItems} showCard />
        </View>
      </ScrollView>

      {/* 로그아웃 / 계정 탈퇴 - 화면 하단 고정 */}
      <View style={[styles.bottomButtons, {
        backgroundColor: theme.colors.surface.normal.bg1,
        borderTopColor: theme.colors.border.lowEmp,
        paddingVertical: theme.spacing.xxxl, // 32px
      }]}>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          style={[styles.button, { padding: theme.spacing.xs }]}
          accessibilityRole="button"
          accessibilityLabel="로그아웃"
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp, // Figma 사양
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.sm, // 14px
                fontWeight: theme.typography.fontWeight.medium, // 500
                letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm),
              },
            ]}
          >
            로그아웃
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDeleteAccount}
          activeOpacity={0.7}
          style={[styles.button, { padding: theme.spacing.xs }]}
          accessibilityRole="button"
          accessibilityLabel="계정 탈퇴"
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: theme.colors.surface.texticon.onnormal.text.midEmp, // Figma 사양
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.sm, // 14px
                fontWeight: theme.typography.fontWeight.medium, // 500
                letterSpacing: theme.typography.getLetterSpacing(theme.typography.fontSize.sm),
              },
            ]}
          >
            계정 탈퇴
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 0,
    flexGrow: 1,
  },
  whiteSection: {
    flex: 1,
    // paddingTop, paddingBottom are inline (theme-based)
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 110, // Figma 사양 (특별한 간격, theme에 없음)
    // paddingVertical is inline (theme-based)
  },
  button: {
    // padding is inline (theme-based)
  },
  buttonText: {
    textAlign: 'center',
  },
});
