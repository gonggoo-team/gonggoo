/**
 * ProductBottomSheet Component
 *
 * 지도 화면 하단의 상품 리스트 BottomSheet
 * @gorhom/bottom-sheet 라이브러리 사용
 * - 탭: 동네 모집 중, 개최 중
 * - 카테고리 버튼 (가로 스크롤)
 * - 필터 버튼
 */

import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, ProductCardHorizontal, Icon } from '@/design-system';
import { useAuth } from '@/app/shared/contexts';
import type { ProductCardVerticalData } from '@/app/shared/types/product.types';
import type { SharedValue } from 'react-native-reanimated';

interface ProductBottomSheetProps {
  /** 상품 리스트 (이미 MapScreen에서 필터링됨) */
  products: ProductCardVerticalData[];
  /** 초기 BottomSheet 인덱스 (0: 탭까지, 1: 상품 1-2개, 2: 최대 펼침) */
  initialIndex?: number;
  /** 검색창 하단 위치 (px) */
  searchBarBottom?: number;
  /** BottomSheet 인덱스 변경 핸들러 */
  onSheetChange?: (index: number) => void;
  /** BottomSheet의 실시간 위치 (Reanimated Shared Value) */
  animatedPosition?: SharedValue<number>;
  /** 선택된 상품 ID (선택 시 해당 상품만 표시) */
  selectedProductId?: string | null;
  /** 활성 탭 (0: 동네 모집 중, 1: 개최 중) */
  activeTab?: number;
  /** 선택된 카테고리 */
  selectedCategory?: string;
  /** 탭 변경 핸들러 */
  onTabChange?: (tab: number) => void;
  /** 카테고리 변경 핸들러 */
  onCategoryChange?: (category: string) => void;
}

// 카테고리 목록
const CATEGORIES = [
  '전체',
  '식품',
  '생활',
  '육아',
  '애완용품',
  '가전',
  '주방',
  '리빙',
  '기타',
];

export const ProductBottomSheet = forwardRef<BottomSheet, ProductBottomSheetProps>(({
  products,
  initialIndex = 1,
  searchBarBottom,
  onSheetChange,
  animatedPosition,
  selectedProductId,
  activeTab = 0,
  selectedCategory = '전체',
  onTabChange,
  onCategoryChange,
}, ref) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: windowHeight } = useWindowDimensions();

  // 현재 BottomSheet 인덱스 추적
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Snap points  
  const snapPoints = useMemo(() => {
    return [
      '12%', // 1단계: 탭까지만
      '40%', // 2단계: 상품 몇 개 보임
      '85%', // 3단계: 최대 펼침 (100% 방지)
    ];
  }, [windowHeight, searchBarBottom]);

  /**
   * 필터링은 이미 MapScreen에서 수행됨
   * 선택된 상품이 있으면 해당 상품만 표시
   */
  const displayProducts = useMemo(() => {
    if (selectedProductId) {
      const selected = products.find((p) => p.id === selectedProductId);
      return selected ? [selected] : [];
    }
    return products;
  }, [products, selectedProductId]);

  /**
   * BottomSheet 위치 변경 핸들러
   */
  const handleSheetChange = useCallback((index: number) => {
    setCurrentIndex(index);
    onSheetChange?.(index); // 부모로 전달
  }, [onSheetChange]);

  /**
   * 외부에서 BottomSheet를 제어할 수 있도록 ref 노출
   */
  useImperativeHandle(ref, () => bottomSheetRef.current as BottomSheet, []);

  /**
   * 필터 버튼 클릭 핸들러
   */
  const handleFilterPress = useCallback(() => {
    // TODO: 추가 필터 옵션 모달 열기 (가격 범위, 정렬 방식 등)
    console.log('[ProductBottomSheet] 필터 버튼 클릭 - 추가 필터 기능 예정');
  }, []);

  /**
   * Backdrop 렌더링 (제거 - 어두운 효과 없음)
   */
  const renderBackdrop = useCallback(
    () => null,
    []
  );

  /**
   * 상품 카드 렌더링
   *
   * 🔥 안전장치:
   * - null/undefined 데이터 검증
   * - 필수 필드 기본값 보장
   * - 에러 경계 처리
   */
  const renderItem = useCallback(
    ({ item }: { item: ProductCardVerticalData }) => {
      try {
        // 🔥 안전장치: 필수 필드 검증
        if (!item || !item.id) {
          console.error('[ProductBottomSheet] ❌ 유효하지 않은 상품 데이터:', item);
          return null;
        }

        const buyersCount = Math.floor((item.progress || 0) * (item.slotCount || 1) / 100);

        return (
          <View style={styles.cardWrapper}>
            <ProductCardHorizontal
              id={item.id}
              imageUri={item.imageUri}
              title={item.title || '제목 없음'}
              price={item.price || 0}
              pricePerSlot={item.pricePerSlot || 0}
              buyersCount={buyersCount}
              progress={item.progress || 0}
              badges={item.badges || []}
              onPress={() => router.push(`/product/${item.id}`)}
            />
          </View>
        );
      } catch (error) {
        console.error('[ProductBottomSheet] 상품 카드 렌더링 오류:', error, item);
        return null;
      }
    },
    [router]
  );

  /**
   * 상품 개수 메모이제이션 (성능 최적화)
   * - products 배열 전체 대신 length만 의존성으로 사용
   */
  const productsCount = useMemo(() => products.length, [products.length]);

  /**
   * 리스트 헤더 렌더링
   *
   * 🔥 성능 최적화:
   * - productsCount를 사용하여 불필요한 재렌더링 방지
   */
  const renderHeader = useCallback(
    () => (
      <View style={[styles.header, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
        <View
          style={[
            styles.handle,
            { backgroundColor: theme.colors.surface.texticon.onnormal.icon.lowEmp },
          ]}
        />

        {/* 탭 (선택된 상품이 없을 때만 표시) */}
        {!selectedProductId && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                {
                  borderBottomWidth: activeTab === 0 ? 2 : 1,
                  borderBottomColor: activeTab === 0 ? '#006242' : '#CACACA',
                },
              ]}
              onPress={() => onTabChange?.(0)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === 0
                        ? theme.colors.surface.texticon.onnormal.text.highEmp
                        : theme.colors.surface.texticon.onnormal.text.highEmp,
                    fontWeight: activeTab === 0 ? '600' : '600',
                  },
                ]}
              >
                동네 모집 중 {activeTab === 0 && `${productsCount}개`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                {
                  borderBottomWidth: activeTab === 1 ? 2 : 1,
                  borderBottomColor: activeTab === 1 ? '#006242' : '#CACACA',
                },
              ]}
              onPress={() => onTabChange?.(1)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === 1
                        ? theme.colors.surface.texticon.onnormal.text.highEmp
                        : theme.colors.surface.texticon.onnormal.text.highEmp,
                    fontWeight: activeTab === 1 ? '600' : '600',
                  },
                ]}
              >
                개최 중 {activeTab === 1 && `${productsCount}개`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 카테고리 및 필터 (동네 모집 중 탭에서만 표시, 선택된 상품이 없을 때만) */}
        {activeTab === 0 && !selectedProductId && (
          <View style={styles.filterContainer}>
            <View style={styles.filterRow}>
              {/* 필터 버튼 */}
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: theme.colors.surface.normal.bg1,
                    borderColor: '#E1E1E1',
                  },
                ]}
                onPress={handleFilterPress}
                activeOpacity={0.7}
              >
                <Icon name="filter" size={16} color={theme.colors.surface.texticon.onnormal.icon.black} />
              </TouchableOpacity>

              {/* 카테고리 버튼들 */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScrollContainer}
                style={styles.categoryScrollView}
              >
                {CATEGORIES.map((category) => {
                  const isSelected = category === selectedCategory;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        {
                          backgroundColor: isSelected
                            ? '#E6EDE9'
                            : theme.colors.surface.normal.bg1,
                          borderColor: isSelected ? '#006242' : '#E1E1E1',
                        },
                      ]}
                      onPress={() => onCategoryChange?.(category)}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          {
                            color: isSelected
                              ? '#006242'
                              : theme.colors.surface.texticon.onnormal.text.highEmp,
                          },
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    ),
    [activeTab, selectedCategory, theme, handleFilterPress, selectedProductId, productsCount, onTabChange, onCategoryChange]
  );

  /**
   * 빈 리스트 렌더링
   */
  const renderEmpty = useCallback(() => {
    // 개최 중 탭의 빈 상태 UI
    if (activeTab === 1) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            {/* <Icon
              name="megaphone-line"
              size={48}
              color={theme.colors.surface.texticon.onnormal.icon.lowEmp}
            /> */}
          </View>
          {/* <Text
            style={[
              styles.emptyTitle,
              { color: theme.colors.surface.texticon.onnormal.text.highEmp },
            ]}
          >
            개최 중인 공구가 없어요
          </Text> */}
          <Text
            style={[
              styles.emptyDescription,
              { color: theme.colors.surface.texticon.onnormal.text.lowEmp },
            ]}
          >
            현재 내가 개최한 공구가 없어요!
          </Text>
          <TouchableOpacity
            style={[
              styles.emptyButton,
              {
                backgroundColor: theme.colors.surface.brand.primary,
              },
            ]}
            onPress={() => router.push('/product-registration')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.emptyButtonText,
                { color: theme.colors.surface.texticon.onnormal.text.white },
              ]}
            >
              모집글 작성하러 가기
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // 동네 모집 중 탭의 빈 상태 UI
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Icon
            name="map-pin-line"
            size={48}
            color={theme.colors.surface.texticon.onnormal.icon.lowEmp}
          />
        </View>
        <Text
          style={[
            styles.emptyTitle,
            { color: theme.colors.surface.texticon.onnormal.text.highEmp },
          ]}
        >
          주변에 공구상품이 없어요
        </Text>
        <Text
          style={[
            styles.emptyDescription,
            { color: theme.colors.surface.texticon.onnormal.text.lowEmp },
          ]}
        >
          지도를 이동하거나 범위를 넓혀보세요
        </Text>
      </View>
    );
  }, [theme, activeTab, router]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={initialIndex}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      animatedPosition={animatedPosition} // 실시간 위치 추적
      backgroundStyle={{
        backgroundColor: theme.colors.surface.normal.bg1,
      }}
      handleIndicatorStyle={{
        display: 'none', // 커스텀 핸들 사용
      }}
      // 당근마켓 스타일 제스처 옵션
      enablePanDownToClose={false}       // 완전히 닫히지 않도록 (최소 snap point까지만)
      animateOnMount={true}              // 마운트 시 부드러운 애니메이션
      enableOverDrag={false}             // 과도한 드래그 방지 (100% 펼침 방지)
      enableContentPanningGesture={true} // 콘텐츠 영역에서도 드래그 가능
      activeOffsetY={[-5, 5]}           // 세로 드래그 감도 조정
      overDragResistanceFactor={5}      // 드래그 저항 (높을수록 80% 이상 펼쳐지지 않음)
      enableDynamicSizing={false}        // 동적 크기 조정 비활성화 (snap points 고정)
      animationConfigs={{
        // Spring 애니메이션 설정 (부드럽고 자연스러운 움직임)
        damping: 500,                    // 감쇠 (높을수록 빠르게 멈춤)
        stiffness: 1000,                 // 강성 (높을수록 빠르게 움직임)
        mass: 3,                         // 질량 (높을수록 느리게 움직임)
        overshootClamping: true,         // 오버슛 방지 (snap point를 넘어가지 않음)
      }}
      keyboardBehavior="interactive"    // 키보드와 상호작용
      keyboardBlurBehavior="restore"    // 키보드 닫을 때 원래 위치로
    >
      {renderHeader()}
      <BottomSheetFlatList
        data={displayProducts}
        renderItem={renderItem}
        keyExtractor={(item: ProductCardVerticalData) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
      />
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingBottom: 0,
  },
  handle: {
    width: 43,
    height: 3,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.4,
  },
  filterContainer: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  categoryScrollView: {
    flex: 1,
  },
  categoryScrollContainer: {
    gap: 5,
    paddingRight: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 40,
    borderWidth: 1,
    // height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17,
    letterSpacing: -0.35,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  emptyContainer: {
    paddingVertical: 80,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.45,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.35,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.375,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
