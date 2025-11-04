/**
 * Product Detail Screen
 *
 * 상품 상세 페이지입니다.
 * - 동적 라우트: /product/[id]
 * - Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=452-7601
 */

import { getProductDetailById } from '@/app/shared/services/mock';
import {
  Divider,
  FloatingActionBar,
  HostProfile,
  ImageSlider,
  InfoRow,
  ProductProgressSlots,
  StatusBadge,
  ThemeProvider,
  useTheme,
} from '@/design-system';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThrottledNavigationWithBack, useThrottledCallback } from '@/app/shared/hooks';

/**
 * ProductDetailScreen Component with ThemeProvider
 */
export default function ProductDetailScreen() {
  return (
    <ThemeProvider>
      <ProductDetailContent />
    </ThemeProvider>
  );
}

/**
 * ProductDetailContent Component (ThemeProvider 내부)
 */
function ProductDetailContent() {
  const { theme } = useTheme();
  const { back } = useThrottledNavigationWithBack();
  const { id } = useLocalSearchParams<{ id: string }>();

  // 상품 데이터 로드
  const product = id ? getProductDetailById(id) : null;

  // 좋아요 상태
  const [isLiked, setIsLiked] = useState(false);

  if (!product) {
    return (
      <View
        style={[
          styles.errorContainer,
          { backgroundColor: theme.colors.surface.normal.bg1 },
        ]}
      >
        <Text
          style={{
            fontSize: theme.typography.fontSize.md,
            color: theme.colors.surface.texticon.onnormal.text.midEmp,
          }}
        >
          상품을 찾을 수 없습니다.
        </Text>
      </View>
    );
  }

  // 이벤트 핸들러
  const handleBackPress = () => {
    back();
  };

  const handleSharePress = useThrottledCallback(() => {
    Alert.alert('공유', '공유 기능은 준비 중입니다.');
  }, 300);

  const handleLikePress = () => {
    setIsLiked((prev) => !prev);
  };

  const handleChatPress = () => {
    Alert.alert('채팅', '채팅 기능은 준비 중입니다.');
  };

  const handleJoinPress = () => {
    Alert.alert('참여하기', `${product.title}에 참여하시겠습니까?`);
  };

  const handleReportPress = () => {
    Alert.alert('신고하기', '신고 기능은 준비 중입니다.');
  };

  return (
    <View style={styles.container}>
      {/* 이미지 슬라이더 */}
      <ImageSlider
        images={product.imageUris}
        height={390}
        onBackPress={handleBackPress}
        onSharePress={handleSharePress}
      />

      {/* 스크롤 가능 콘텐츠 */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: theme.colors.surface.normal.bg1 },
        ]}
      >
        {/* 상품 정보 섹션 */}
        <View style={styles.section}>
          {/* 카테고리 + 신고하기 */}
          <View style={styles.categoryRow}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.xxs, // 10px
                fontWeight: theme.typography.fontWeight.medium,
                lineHeight: theme.typography.fontSize.xxs * 1.2,
                letterSpacing: theme.typography.getLetterSpacing(10),
                color: theme.colors.surface.texticon.onnormal.text.midEmp,
              }}
            >
              카테고리 &gt; {product.category}
            </Text>
            {product.reportable && (
              <Text
                style={{
                  fontSize: theme.typography.fontSize.xxs,
                  fontWeight: theme.typography.fontWeight.medium,
                  lineHeight: theme.typography.fontSize.xxs * 1.2,
                  letterSpacing: theme.typography.getLetterSpacing(10),
                  color: theme.colors.surface.texticon.onnormal.text.midEmp,
                }}
                onPress={handleReportPress}
              >
                신고하기
              </Text>
            )}
          </View>

          {/* 제목 */}
          <Text
            style={{
              fontSize: theme.typography.fontSize.md, // 16px
              fontWeight: theme.typography.fontWeight.semiBold,
              lineHeight: theme.typography.fontSize.md * 1.2,
              letterSpacing: theme.typography.getLetterSpacing(16),
              color: theme.colors.surface.texticon.onnormal.text.highEmp,
              marginTop: 14,
            }}
          >
            {product.title}
          </Text>

          {/* 가격 정보 */}
          <View style={styles.priceSection}>
            {/* 좌측: 총 가격 + 슬롯당 가격 */}
            <View style={{ gap: 1 }}>
              <Text
                style={{
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.semiBold,
                  lineHeight: theme.typography.fontSize.md * 1.2,
                  letterSpacing: theme.typography.getLetterSpacing(16),
                  color: theme.colors.surface.texticon.onnormal.text.midEmp,
                }}
              >
                {product.price.toLocaleString()}원
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5 }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: theme.typography.fontWeight.semiBold,
                    lineHeight: 25 * 1.2,
                    letterSpacing: theme.typography.getLetterSpacing(25),
                    color: theme.colors.surface.brand.primary,
                  }}
                >
                  {product.pricePerSlot.toLocaleString()}원
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semiBold,
                    height: 17,
                    lineHeight: theme.typography.fontSize.sm * 1.2,
                    letterSpacing: theme.typography.getLetterSpacing(14),
                    color: theme.colors.surface.texticon.onnormal.text.midEmp,
                  }}
                >
                  1 슬롯당
                </Text>
              </View>
            </View>

            {/* 우측: 남은 시간 + 상태 배지 */}
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <Text
                style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semiBold,
                  lineHeight: theme.typography.fontSize.sm * 1.2,
                  letterSpacing: theme.typography.getLetterSpacing(14),
                  color: theme.colors.surface.brand.primary,
                }}
              >
                {product.daysRemaining}일 남음
              </Text>
              <StatusBadge
                type="recruiting"
                label={product.recruitmentStatus}
              />
            </View>
          </View>
        </View>

        <Divider />

        {/* 공구팟 진행 상황 섹션 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.highEmp }]}>
              공구팟 진행 상황
            </Text>
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semiBold,
                lineHeight: theme.typography.fontSize.sm * 1.2,
                letterSpacing: theme.typography.getLetterSpacing(14),
                color: theme.colors.surface.brand.primary,
              }}
            >
              {product.progress.participantCount}명 참여
            </Text>
          </View>

          <ProductProgressSlots
            participantCount={product.progress.participantCount}
            totalSlots={product.progress.totalSlots}
          />
        </View>

        <Divider />

        {/* 공구 정보 섹션 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.highEmp }]}>
            공구 정보
          </Text>

          {/* 슬롯 수 + 수량 */}
          <View style={{ flexDirection: 'row', gap: 30, marginTop: 15 }}>
            <InfoRow iconName="grid" text={`${product.groupBuyInfo.totalSlots} 슬롯`} />
            <InfoRow iconName="box" text={product.groupBuyInfo.quantityPerSlot} />
          </View>

          {/* 설명 */}
          <Text
            style={{
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              lineHeight: theme.typography.fontSize.xs * 1.2,
              letterSpacing: theme.typography.getLetterSpacing(13),
              color: theme.colors.surface.texticon.onnormal.text.highEmp,
              marginTop: 15,
            }}
          >
            {product.groupBuyInfo.description}
          </Text>
        </View>

        <Divider />

        {/* 공구장 정보 섹션 */}
        <View style={styles.section}>
          <HostProfile host={product.host} participants={product.participants} />
        </View>

        <Divider />

        {/* 거래 정보 섹션 */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.highEmp }]}>
            거래 정보
          </Text>

          {/* 거래 정보 항목들 */}
          <View style={{ gap: 9, marginTop: 15 }}>
            <InfoRow iconName="location" text={product.transaction.location} />
            <InfoRow iconName="clock" text={product.transaction.timeDescription} />
            <InfoRow iconName="box" text={product.transaction.deliveryAvailable ? '가능' : '불가능'} />
          </View>
        </View>

        {/* 하단 여백 (FloatingActionBar 공간) */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* 플로팅 액션 바 */}
      <FloatingActionBar
        onLikePress={handleLikePress}
        onChatPress={handleChatPress}
        onJoinPress={handleJoinPress}
        isLiked={isLiked}
        joinDisabled={product.recruitmentStatus === '모집 완료'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 14 * 1.2,
    letterSpacing: -0.025 * 14,
  },
});
