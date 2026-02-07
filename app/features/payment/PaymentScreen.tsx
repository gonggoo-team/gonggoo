/**
 * Payment Screen
 *
 * 결제 페이지 화면
 * - 상품 정보 표시 (ProductCardCompact 사용)
 * - 거래 정보 표시
 * - 약관 동의 (하단)
 * - 결제 버튼
 */

import React from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GNB,
  Button,
  useTheme,
  Divider,
  ScreenWrapper,
  ProductCardCompact,
} from '@/design-system';
import {
  TransactionInfoSection,
  TermsSection,
} from './components';
import { usePayment } from './hooks/usePayment';
import { styles } from './PaymentScreen.styles';

export default function PaymentScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const {
    product,
    quantity,
    totalAmount,
    isTermsAgreed,
    isLoading,
    isProcessing,
    error,
    setIsTermsAgreed,
    handlePayment,
  } = usePayment();

  const handleClose = () => {
    router.back();
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <ScreenWrapper preset="fullscreen">
        <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
          <GNB
            leftSection={{ type: 'close', onPress: handleClose }}
            centerSection={{ type: 'title', text: '결제하기' }}
          />
          <Divider color="lowEmp" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.surface.brand.primary} />
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  // 에러 상태
  if (error || !product) {
    return (
      <ScreenWrapper preset="fullscreen">
        <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
          <GNB
            leftSection={{ type: 'close', onPress: handleClose }}
            centerSection={{ type: 'title', text: '결제하기' }}
          />
          <Divider color="lowEmp" />
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error || '상품 정보를 불러올 수 없습니다.'}
            </Text>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  // 결제 버튼 비활성화 여부 (결제 진행 중이거나 약관 미동의 시)
  const isPaymentDisabled = isProcessing; // || !isTermsAgreed;

  // 가격 라벨 (수량에 따라 동적)
  const priceLabel = `${quantity}슬롯`;

  return (
    <ScreenWrapper preset="fullscreen">
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* GNB */}
        <GNB
          leftSection={{ type: 'close', onPress: handleClose }}
          centerSection={{ type: 'title', text: '결제하기' }}
        />

        {/* Divider */}
        <Divider color="lowEmp" />

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            // { paddingBottom: insets.bottom + 150 }, // 약관 + 버튼 영역 고려
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* 상품 정보 섹션 - ProductCardCompact 사용 */}
          <View style={styles.productSection}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              lineHeight: 16.8,
            }}>
              상품 정보
            </Text>
            <ProductCardCompact
              id={product.id}
              imageUri={product.imageUris[0]}
              title={product.title}
              price={product.price}
              pricePerSlot={product.pricePerSlot * quantity}
              showBadges={false}
              disablePress={true}
              imageSize={60}
              contentGap={4}
              priceLabel={priceLabel}
            />
          </View>

          {/* 섹션 구분선 */}
          <View style={styles.sectionDivider} />

          {/* 거래 정보 섹션 */}
          <TransactionInfoSection
            location={product.transaction.location}
            timeDescription={product.transaction.timeDescription}
          />
        </ScrollView>

        {/* 하단 고정 영역: 약관 + 결제 버튼 */}
        <View
          style={[
            styles.bottomContainer,
            {
              backgroundColor: theme.colors.surface.normal.bg1,
              // paddingBottom: insets.bottom + 15,
            },
          ]}
        >
          {/* 약관 동의 섹션 */}
          <TermsSection
            isAgreed={isTermsAgreed}
            onToggle={() => setIsTermsAgreed(!isTermsAgreed)}
          />

          {/* 결제 버튼 */}
          <View style={styles.buttonWrapper}>
            <Button
              variant="full-primary-rounded"
              onPress={handlePayment}
              disabled={isPaymentDisabled}
            >
              {isProcessing
                ? '결제 처리 중...'
                : `${totalAmount.toLocaleString()}원 결제하기`}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
