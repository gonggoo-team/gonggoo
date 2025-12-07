/**
 * Product Detail Screen
 *
 * 공구팟 상품 상세 화면
 * - 이미지 슬라이더
 * - 상품 정보 (가격, 상태 등)
 * - 공구팟 진행 상황
 * - 공구 정보 (슬롯, 참여자)
 * - 거래 정보 (위치, 시간)
 * - 공구장 정보
 * - Floating Action Bar (좋아요, 채팅, 참여하기)
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Alert,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThrottledNavigation, useThrottledCallback, useTypographyStyles } from '@/app/shared/hooks';
import { getProductDetailById } from '@/app/shared/services/mock';
import { addRecentProductId } from '@/app/shared/services/storage';
import { FadingIcon, ProductHeaderSection } from '@/app/features/product-detail/components';
import { useHeaderScrollAnimation } from '@/app/features/product-detail/hooks';
import {
  ProductInfoSection,
  GroupBuyInfoSection,
  TransactionInfoSection,
  HostSection,
} from '@/app/features/product-detail/sections';
import {
  FloatingActionBar,
  ImageSlider,
  ProductOptionsMenu,
  SectionDivider,
  useTheme,
  Icon,
} from '@/design-system';
import type { StatusBadgeType } from '@/design-system';

/**
 * 레이아웃 상수
 */
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;
const IMAGE_HEIGHT = 390;
const HEADER_THRESHOLD = IMAGE_HEIGHT - 60;
const BOTTOM_BAR_HEIGHT = 143;

export default function ProductDetailScreen() {
  const { theme } = useTheme();
  const typo = useTypographyStyles();
  const { back } = useThrottledNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 스크롤 애니메이션
  const { scrollY, headerBackgroundColor, whiteIconOpacity, blackIconOpacity } = useHeaderScrollAnimation();

  // 상태 관리
  const product = id ? getProductDetailById(id) : null;
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // 최근 본 상품에 추가
  useEffect(() => {
    if (id) addRecentProductId(id);
  }, [id]);

  // 에러 상태 처리
  if (!product) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
        <Text style={[styles.errorText, { color: theme.colors.surface.texticon.onnormal.text.midEmp }]}>
          상품을 찾을 수 없습니다.
        </Text>
      </View>
    );
  }

  /**
   * 현재 사용자가 상품 소유자인지 판별
   * TODO: 실제 인증 시스템 구현 후 현재 사용자 ID와 비교
   * 임시로 특정 상품 ID를 소유자로 설정 (테스트용)
   */
  const isOwner = product.id === '1' || product.id === '2'; // 임시: ID가 1 또는 2인 경우 소유자로 간주

  /**
   * 이벤트 핸들러
   */
  const handleBackPress = useCallback(() => back(), [back]);

  const handleSharePress = useThrottledCallback(() => {
    Alert.alert('공유', '공유 기능은 준비 중입니다.');
  }, 300);

  const handleLikePress = useCallback(() => {
    setIsLiked((prev) => !prev);
  }, []);

  const handleChatPress = useCallback(() => {
    Alert.alert('채팅', '채팅 기능은 준비 중입니다.');
  }, []);

  const handleJoinPress = useCallback(() => {
    const totalAmount = product.pricePerSlot * quantity;
    Alert.alert(
      '참여하기',
      `${product.title}\n수량: ${quantity}개\n총 금액: ${totalAmount.toLocaleString()}원\n\n참여하시겠습니까?`
    );
  }, [product.pricePerSlot, product.title, quantity]);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    setQuantity(newQuantity);
  }, []);

  const handleReportPress = useCallback(() => {
    Alert.alert('신고하기', '신고 기능은 준비 중입니다.');
  }, []);

  const handleHostPress = useCallback((hostId: string) => {
    // TODO: 공구장 프로필 페이지로 이동
    Alert.alert('공구장 프로필', `공구장 ID: ${hostId}\n\n프로필 페이지로 이동합니다.`);
  }, []);

  const handleProductPress = useCallback((productId: string) => {
    // TODO: 상품 상세 페이지로 이동
    Alert.alert('상품 상세', `상품 ID: ${productId}\n\n상품 상세 페이지로 이동합니다.`);
  }, []);

  const handleCancelRecruitment = useCallback(() => {
    Alert.alert(
      '모집 취소',
      '정말로 모집을 취소하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          style: 'destructive',
          onPress: () => {
            // TODO: 모집 취소 API 호출
            Alert.alert('모집 취소됨', '공구 모집이 취소되었습니다.');
          },
        },
      ]
    );
  }, []);

  const handleEditProduct = useCallback(() => {
    router.push(`/product-edit/${product.id}` as any);
  }, [router, product.id]);

  /**
   * 상품 상태에 따른 배지 타입 반환
   */
  const getStatusType = useCallback((): StatusBadgeType => {
    switch (product.recruitmentStatus) {
      case '모집 중':
        return 'recruiting';
      case '모집 완료':
        return 'recruitment-complete';
      case '거래 완료':
        return 'transaction-complete';
      default:
        return 'recruiting';
    }
  }, [product.recruitmentStatus]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      {/* 고정 헤더 - 스크롤에 따라 배경색 변경 */}
      <Animated.View style={[styles.fixedHeader, { backgroundColor: headerBackgroundColor }]}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBackPress} activeOpacity={0.8}>
          <FadingIcon
            name="back"
            blackOpacity={blackIconOpacity}
            whiteOpacity={whiteIconOpacity}
            color={theme.colors.surface.texticon.onnormal.icon.black}
          />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
        <TouchableOpacity style={styles.iconButton} onPress={handleSharePress} activeOpacity={0.8}>
          <FadingIcon
            name="share"
            blackOpacity={blackIconOpacity}
            whiteOpacity={whiteIconOpacity}
            color={theme.colors.surface.texticon.onnormal.icon.black}
          />
        </TouchableOpacity>
        {/* 소유자만 보이는 옵션 메뉴 */}
        {isOwner && (
          <View style={styles.optionsMenuWrapper}>
            <ProductOptionsMenu
              onCancel={handleCancelRecruitment}
              onEdit={handleEditProduct}
              blackOpacity={blackIconOpacity}
              whiteOpacity={whiteIconOpacity}
              blackIconColor={theme.colors.surface.texticon.onnormal.icon.black}
            />
          </View>
        )}
      </Animated.View>

      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { 
            backgroundColor: theme.colors.surface.normal.bg1,
            paddingBottom: BOTTOM_BAR_HEIGHT + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <ImageSlider
          images={product.imageUris}
          height={IMAGE_HEIGHT}
          showBackButton={false}
          showShareButton={false}
        />

        <ProductHeaderSection
          category={product.category}
          title={product.title}
          price={product.price}
          pricePerSlot={product.pricePerSlot}
          recruitmentStatus={product.recruitmentStatus}
          statusType={getStatusType()}
          daysRemaining={product.daysRemaining}
          reportable={product.reportable ?? false}
          onReportPress={handleReportPress}
        />

        <SectionDivider />
        <ProductInfoSection
          participantCount={product.progress.participantCount}
          totalSlots={product.progress.totalSlots}
        />

        <GroupBuyInfoSection
          totalSlots={product.groupBuyInfo.totalSlots}
          quantityPerSlot={product.groupBuyInfo.quantityPerSlot}
          description={product.groupBuyInfo.description}
          host={product.host}
          participants={product.participants}
        />

        <SectionDivider />
        <TransactionInfoSection
          location={product.transaction.location}
          latitude={37.5665}
          longitude={126.9780}
          timeDescription={product.transaction.timeDescription}
          deliveryAvailable={product.transaction.deliveryAvailable}
        />

        <SectionDivider />
        <HostSection
          host={product.host}
          otherProducts={[
            { id: '1', imageUri: product.imageUris[0] },
            { id: '2', imageUri: product.imageUris[0] },
            { id: '3', imageUri: product.imageUris[0] },
          ]}
          onHostPress={handleHostPress}
          onProductPress={handleProductPress}
        />
      </Animated.ScrollView>

      <View style={styles.bottomSheetContainer} pointerEvents="box-none">
        <FloatingActionBar
          onLikePress={handleLikePress}
          onChatPress={handleChatPress}
          onJoinPress={handleJoinPress}
          isLiked={isLiked}
          joinDisabled={product.recruitmentStatus === '모집 완료'}
          productTitle={product.title}
          pricePerSlot={product.pricePerSlot}
          initialQuantity={1}
          onQuantityChange={handleQuantityChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // 기본 컨테이너
  container: {
    flex: 1,
  },

  // 에러 상태
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },

  // 고정 헤더
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: STATUS_BAR_HEIGHT + 6,
    paddingHorizontal: 20,
    height: STATUS_BAR_HEIGHT + 54,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  optionsMenuWrapper: {
    marginLeft: 20,
  },

  // 스크롤 컨텐츠
  scrollContent: {
    paddingBottom: 20,
  },

  // 하단 액션 바
  bottomSheetContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
});