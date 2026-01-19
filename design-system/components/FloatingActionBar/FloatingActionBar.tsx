import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, LayoutChangeEvent, Platform } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../hooks';
import { Icon } from '../../primitives/Icon';
// import type { FloatingActionBarProps } from './FloatingActionBar.types';

export const FloatingActionBar = ({
  onLikePress,
  onChatPress,
  onJoinPress,
  isLiked = false,
  joinDisabled = false,
  joinButtonText = '참여하기',
  productTitle,
  pricePerSlot,
  initialQuantity = 1,
  onQuantityChange,
}: any) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(initialQuantity);
  
  // ✅ [상태] 콘텐츠의 실제 높이를 저장 (기본값 130)
  const [contentHeight, setContentHeight] = useState(130);

  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // 0: 접힘, 1: 펼침
  const animatedIndex = useSharedValue(0);

  const isExpandable = productTitle && pricePerSlot !== undefined;

  // 상수 정의
  const COLLAPSED_HEIGHT = 255; // 접혔을 때 높이 (헤더 + 화살표 + 약간의 여유)

  // ✅ [핵심 개선] 스냅 포인트를 콘텐츠 높이에 맞춰 자동 조절
  const snapPoints = useMemo(() => {
    if (!isExpandable) return [COLLAPSED_HEIGHT];
    // 펼친 높이 = 접힌 높이 + 실제 콘텐츠 높이
    return [COLLAPSED_HEIGHT, COLLAPSED_HEIGHT + contentHeight];
  }, [isExpandable, contentHeight]);

  // ✅ [애니메이션] 높이 계산 시 contentHeight 사용
  const contentStyle = useAnimatedStyle(() => {
    return {
      // 안드로이드 실제 기기 호환성을 위해 opacity 최소값을 0.1로 설정 (오래된 기기 렌더링 안정성)
      opacity: interpolate(animatedIndex.value, [0, 0.5], [0.1, 1], Extrapolation.CLAMP),
      // zIndex를 항상 양수로 유지 (안드로이드에서 음수 zIndex는 렌더링 문제 발생 가능)
      zIndex: 15,
      transform: [
        {
          // 살짝 아래에서 위로 올라오는 효과
          translateY: interpolate(animatedIndex.value, [0, 1], [20, 0], Extrapolation.CLAMP)
        }
      ],
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    const rotate = interpolate(animatedIndex.value, [0, 1], [0, 180], Extrapolation.CLAMP);
    return { transform: [{ rotate: `${rotate}deg` }] };
  });

  // --- Handlers ---

  // ✅ [로직] 실제 콘텐츠 크기가 결정되면 높이 업데이트
  const handleContentLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    // 높이가 유의미하게 변했을 때만 업데이트 (불필요한 렌더링 방지)
    if (Math.abs(height - contentHeight) > 1) {
      setContentHeight(height);
    }
  }, [contentHeight]);

  const handleArrowPress = useCallback(() => {
    if (animatedIndex.value < 0.5) bottomSheetRef.current?.snapToIndex(1);
    else bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleMainAction = useCallback(() => {
    if (!isExpandable) { onJoinPress?.(); return; }
    if (animatedIndex.value < 0.5) { 
      bottomSheetRef.current?.snapToIndex(1); 
      return; 
    }
    onJoinPress?.();
  }, [isExpandable, onJoinPress]);

  const handleIncreaseQuantity = useCallback(() => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange?.(newQty);
  }, [quantity, onQuantityChange]);

  const handleDecreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange?.(newQty);
    }
  }, [quantity, onQuantityChange]);

  const totalPrice = (pricePerSlot || 0) * quantity;

  return (
    // ✅ 1. 전체를 감싸는 View (pointerEvents="box-none"으로 뒤쪽 화면 터치 허용)
    <View style={styles.container} pointerEvents="box-none">
      
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        animatedIndex={animatedIndex}
        // backdropComponent={null}
        enablePanDownToClose={false}
        enableOverDrag={false}
        handleComponent={null}
        enableContentPanningGesture={false}
        // ✅ Footer 뒤에 위치하도록 zIndex 설정
        style={{ zIndex: 10 }}
        containerStyle={{ overflow: 'visible' }}
        backgroundStyle={{
          backgroundColor: theme.colors.surface.normal.bg1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 1.5,          
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          borderWidth: 1.5,
          borderColor: 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <BottomSheetView style={[styles.flexContainer, styles.sheetContent]}>

          {/* 1. 상단 화살표 (고정) */}
          <View style={styles.headerArea}>
            {isExpandable && (
              <TouchableOpacity
                style={styles.arrowSection}
                onPress={handleArrowPress}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
              >
                <Animated.View style={arrowStyle}>
                  <Svg width="44" height="18" viewBox="0 0 44 18" fill="none">
                    <Path d="M36.5195 11.287L24.5662 6.39699C23.1545 5.81949 20.8445 5.81949 19.4328 6.39699L7.47949 11.287" stroke="#E1E1E1" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </Animated.View>
              </TouchableOpacity>
            )}
          </View>

          {/* 2. 중간 상품 정보 (Absolute + Auto Height Measure) */}
          {isExpandable && (
            <Animated.View
              style={[styles.middleContent, contentStyle]}
              collapsable={false}
              needsOffscreenAlphaCompositing={Platform.OS === 'android'}
              renderToHardwareTextureAndroid={true}
            >
              {/* ✅ onLayout을 여기에 걸어서 내부 컨텐츠의 실제 높이를 잽니다 */}
              <View onLayout={handleContentLayout} collapsable={false}>
                <View style={styles.productInfoSection} collapsable={false}>
                  <Text style={styles.titleText} numberOfLines={2}>
                    {productTitle}
                  </Text>

                  <View style={styles.priceQuantityRow}>
                    <View style={styles.priceContainer}>
                      <Text style={[styles.priceText, { color: theme.colors.surface.brand.primary }]}>
                        {totalPrice.toLocaleString()}
                      </Text>
                      <Text style={[styles.unitText, { color: theme.colors.surface.brand.primary }]}>원</Text>
                    </View>

                    <View style={styles.quantitySelector}>
                      <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.quantityButton}>
                        <Icon name="minus" size={16} color={quantity <= 1 ? '#D1D6DA' : '#000'} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity onPress={handleIncreaseQuantity} style={styles.quantityButton}>
                        <Icon name="plus" size={16} color="#000" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {/* 구분선까지 포함해서 높이를 잽니다 */}
                <View style={styles.divider} />
              </View>
            </Animated.View>
          )}

          {/* 여백 제거 - ScrollView paddingBottom으로 통합 관리 */}
        </BottomSheetView>
      </BottomSheet>

      {/* 3. 하단 액션 버튼 (Absolute로 고정) */}
      <View style={[
        styles.footerArea,
        {
          backgroundColor: theme.colors.surface.normal.bg1,          
          paddingBottom: Math.max(insets.bottom, 20), // SafeArea 또는 최소 20px          
          
        },
        !isExpandable && {elevation: 20},
        !isExpandable && {zIndex: 20}
      ]}>
        <View style={styles.iconButtons}>
          <TouchableOpacity onPress={onLikePress}>
            <Icon name={isLiked ? 'heart-fill' : 'heart-line'} size={24} color={theme.colors.surface.texticon.onnormal.icon.tabBar} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onChatPress}>
            <Icon name="chat-line" size={24} color={theme.colors.surface.texticon.onnormal.icon.highEmp} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.joinButton,
            { backgroundColor: joinDisabled ? theme.colors.surface.env.disabled : theme.colors.surface.brand.primary }
          ]}
          onPress={handleMainAction}
          disabled={joinDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.joinButtonText}>{joinButtonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ✅ [추가] 전체 화면을 덮는 컨테이너 (터치 통과)
  container: {
    ...StyleSheet.absoluteFillObject,
    // zIndex: 999, // 필요에 따라 조정
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 0, // 기존 paddingBottom 제거 (Footer가 Absolute이므로)
  },
  // ✅ BottomSheet 내부 컨텐츠에 borderRadius와 overflow 적용
  sheetContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,    
  },
  headerArea: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingTop: 8,
    paddingBottom: 8,
    // ✅ 상단 모서리에도 동일한 radius 적용
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  arrowSection: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',    
  },
  middleContent: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    // 높이는 자동(auto)으로 설정되어 자식 View 크기에 맞춰짐
    overflow: 'visible',
    zIndex: 15,
  },
  productInfoSection: { width: '90%', alignSelf: 'center', gap: 14 },
  titleText: { fontSize: 16, fontWeight: '600', color: '#181A1A' },
  priceQuantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  priceText: { fontSize: 24, fontWeight: '600' },
  unitText: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  quantitySelector: { width: 100, height: 30, borderWidth: 1, borderColor: '#A6A6A6', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5 },
  quantityButton: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  quantityText: { fontSize: 14, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#E1E1E1', marginTop: 20, width: '90%', alignSelf: 'center' },
  
  // ✅ [수정] Footer 스타일: Absolute 위치로 고정
  footerArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,            
    // paddingBottom은 SafeArea에 따라 동적 계산 (인라인 스타일)
    // zIndex: 20, // BottomSheet(z:1) 위에 오도록 설정           
  },
  iconButtons: { flexDirection: 'row', gap: 20 },
  joinButton: { 
    flex: 1, 
    height: 54, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 15 
  },
  joinButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});