/**
 * Payment Complete Screen
 *
 * 결제 완료 후 참여완료 화면
 * Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=1468-7741&m=dev
 */

import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import {
  GNB,
  Button,
  useTheme,
  Divider,
  ScreenWrapper,
} from '@/design-system';
import { styles } from './PaymentCompleteScreen.styles';

export default function PaymentCompleteScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{
    productId?: string;
    productTitle?: string;
    amount?: string;
    quantity?: string;
  }>();

  /**
   * 닫기 버튼 핸들러
   * 홈 화면으로 이동
   */
  const handleClose = useCallback(() => {
    // 결제 관련 화면 스택을 모두 제거하고 홈으로 이동
    router.dismissAll();
    router.replace('/(tabs)');
  }, [router]);

  /**
   * 확인 버튼 핸들러
   * 홈 화면으로 이동
   */
  const handleConfirm = useCallback(() => {
    // 결제 관련 화면 스택을 모두 제거하고 홈으로 이동
    router.dismissAll();
    router.replace('/(tabs)');
  }, [router]);

  return (
    <ScreenWrapper preset="fullscreen">
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.surface.normal.bg1 },
        ]}
      >
        {/* GNB */}
        <GNB
          leftSection={{ type: 'close', onPress: handleClose }}
          centerSection={{ type: 'title', text: '참여완료' }}
        />

        {/* Divider */}
        <Divider color="lowEmp" />

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.surface.texticon.onnormal.text.black },
            ]}
          >
            공구 참여가 완료되었어요!
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.surface.texticon.onnormal.text.black },
            ]}
          >
            {`공구 모집이 완료되면 알려드릴게요.\n공구장과 거래 장소를 조율해보세요.`}
          </Text>
        </View>

        {/* 하단 고정 영역: 확인 버튼 */}
        <View
          style={[
            styles.bottomContainer,
            { backgroundColor: theme.colors.surface.normal.bg1 },
          ]}
        >
          <Button variant="full-primary-rounded" onPress={handleConfirm}>
            확인
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
}
