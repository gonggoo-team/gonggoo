/**
 * SwipeableProductList Component
 *
 * 스와이프 삭제 기능이 있는 상품 리스트 컴포넌트
 *
 * **주요 기능:**
 * - Reveal 방식: 버튼 고정, 아이템이 밀려남
 * - 스냅 동작: 일정 거리 이상 스와이프 시 완전히 열림
 * - 삭제 확인 모달 지원
 * - 자동 닫힘: 스크롤, 다른 아이템 스와이프/탭, 빈 공간 탭 시 닫힘
 *
 * **UX 패턴:**
 * iOS Mail, Instagram, Telegram 등 주요 앱의 표준 패턴 준수
 * - iOS Human Interface Guidelines 기반
 * - 접근성(WCAG 2.1) 준수
 *
 * @see {@link https://developer.apple.com/design/human-interface-guidelines/lists-and-tables|iOS HIG - Lists and Tables}
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, SectionList, StyleSheet, Text, TouchableOpacity, View, Animated, Pressable, useWindowDimensions } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ProductCardHorizontal } from '@/design-system';
import { useTheme } from '@/design-system';
import { ConfirmationModal } from '@/app/shared/components/ConfirmationModal';
import type { SwipeableProductItem, SwipeableProductListProps, SwipeableProductSection, SwipeAction } from './SwipeableProductList.types';

/**
 * 스와이프 애니메이션 및 동작 설정 상수
 * - iOS/Android 플랫폼 표준에 기반한 값
 */
const SWIPE_CONFIG = {
  /** 스와이프 마찰력 (1.5 = 부드러운 저항감) */
  FRICTION: 1.5,
  /** Overshoot 마찰력 (높을수록 경계 넘김 어려움) */
  OVERSHOOT_FRICTION: 8,
  /** 스와이프 열림 임계값 (px) - 이 거리 이상 밀면 완전히 열림 */
  RIGHT_THRESHOLD: 40,
  /** 리스트 푸터 최소 높이 (빈 공간 탭 감지용) */
  FOOTER_MIN_HEIGHT: 100,
  /** 기본 화면 너비 기준 (반응형 계산용) */
  BASE_SCREEN_WIDTH: 375,
} as const;

/**
 * SwipeableProductList Component
 */
export const SwipeableProductList: React.FC<SwipeableProductListProps> = ({
  data,
  sections,
  onItemPress,
  onDeleteItem,
  swipeActions,
  variant = 'recent', // 기본값: recent (최근 본 상품/취소 내역)
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  refreshing,
  onRefresh,
  showDivider = true,
  centerTextVertically = false,
}) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // 동적 확인 모달 상태
  const [confirmModalState, setConfirmModalState] = useState<{
    visible: boolean;
    action: SwipeAction | null;
    item: SwipeableProductItem | null;
  }>({
    visible: false,
    action: null,
    item: null,
  });

  /**
   * 열린 스와이프를 닫는 유틸리티 함수
   *
   * **동작:**
   * - itemId가 지정된 경우: 해당 아이템 닫기
   * - itemId가 없는 경우: 현재 열린 아이템(openItemId) 닫기
   *
   * **UX 근거:**
   * - iOS HIG: 외부 탭으로 낮은 마찰의 UI 요소 닫기
   * - 접근성: 사용자에게 명확한 취소/닫기 방법 제공
   *
   * @param itemId - 닫을 아이템 ID (선택적)
   */
  const closeSwipeable = useCallback((itemId?: string) => {
    const targetId = itemId ?? openItemId;
    if (!targetId) return;

    const swipeable = swipeableRefs.current.get(targetId);
    swipeable?.close();
  }, [openItemId]);

  /**
   * 반응형 스와이프 버튼 너비 계산
   *
   * **variant별 크기:**
   * - profile: 52px 기준 (45-60px 범위)
   * - recent: 100px 기준 (90-120px 범위)
   */
  const responsiveButtonWidth = useMemo(() => {
    const baseButtonWidth = variant === 'profile' ? 52 : 100;
    const calculatedWidth = (screenWidth / SWIPE_CONFIG.BASE_SCREEN_WIDTH) * baseButtonWidth;

    // variant별 최소/최대값 설정
    if (variant === 'profile') {
      return Math.min(60, Math.max(45, calculatedWidth));
    } else {
      return Math.min(120, Math.max(90, calculatedWidth));
    }
  }, [screenWidth, variant]);

  /**
   * 스와이프 액션 렌더링 (Reveal 방식)
   */
  const renderRightActions = useCallback(
    (item: SwipeableProductItem) =>
      (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>
      ) => {
        // 액션 버튼 설정 (width를 반응형으로 변경)
        const actions: SwipeAction[] = swipeActions
          ? swipeActions.map(action => ({
              ...action,
              width: responsiveButtonWidth, // 반응형 너비 적용
            }))
          : [
              {
                label: '삭제',
                backgroundColor: theme.colors.surface.env.accent,
                textColor: theme.colors.surface.normal.white,
                width: responsiveButtonWidth,
                onPress: onDeleteItem || (() => {}),
                // 기본 삭제 버튼에 confirmModal 자동 추가
                confirmModal: {
                  title: '상품을 삭제하시겠어요?',
                  descriptions: ['삭제한 상품은 복구할 수 없어요.'],
                  cancelText: '취소',
                  confirmText: '삭제',
                },
              },
            ];

        const totalWidth = actions.reduce((sum, action) => sum + action.width, 0);

        const opacity = dragX.interpolate({
          inputRange: [-totalWidth, -totalWidth * 0.5, 0],
          outputRange: [1, 0.8, 0],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={[
              styles.actionsContainer,
              {
                width: totalWidth,
                opacity,                
              },
            ]}
          >
            {actions.map((action, index) => {
              const buttonScale = dragX.interpolate({
                inputRange: [-totalWidth, -totalWidth * 0.7, -totalWidth * 0.3, 0],
                outputRange: [1, 1, 0.8, 0.5],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: action.backgroundColor,
                      width: action.width,
                      transform: [{ scale: buttonScale }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.actionButtonTouchable}
                    onPress={() => {
                      closeSwipeable(item.id);

                      // confirmModal이 설정된 경우: 모달 표시
                      if (action.confirmModal) {
                        setConfirmModalState({
                          visible: true,
                          action,
                          item,
                        });
                      } else {
                        // confirmModal이 없는 경우: 즉시 실행
                        action.onPress(item);
                      }
                    }}
                    activeOpacity={0.7}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.title} ${action.label}`}
                    accessibilityHint={action.confirmModal ? `이 작업을 확인하는 모달이 표시됩니다` : undefined}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        { color: action.textColor },
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.View>
        );
      },
    [theme, swipeActions, onDeleteItem, responsiveButtonWidth, closeSwipeable]
  );

  /**
   * 리스트 배경(빈 공간) 탭 핸들러
   *
   * **동작:**
   * - 스와이프 열림 상태에서만 작동
   * - 리스트 전체 빈 공간 (아이템 간 간격, 여백 포함) 탭 시 스와이프 닫기
   *
   * **UX 패턴:**
   * - iOS Mail, Reminders, Telegram 등 주요 앱 표준 동작
   * - 모달 외부 탭으로 닫기와 동일한 멘탈 모델
   *
   * **접근성:**
   * - 실수로 스와이프한 경우 쉬운 취소 방법 제공
   * - 넓은 닫기 영역으로 운동 장애 사용자 지원
   * - WCAG 2.1: "완료 전 액션 중단 메커니즘" 원칙 준수
   *
   * **구현:**
   * - Pressable 래퍼 + FlatList pointerEvents="box-none"
   * - 아이템/버튼 탭은 이벤트 버블링으로 차단되어 정상 동작
   */
  const handleListBackgroundTap = useCallback(() => {
    if (openItemId) {
      closeSwipeable();
    }
  }, [openItemId, closeSwipeable]);


  const renderItem = useCallback(
    ({ item }: { item: SwipeableProductItem }) => {
      return (
        <Swipeable
          ref={(ref) => {
            if (ref) {
              swipeableRefs.current.set(item.id, ref);
            } else {
              swipeableRefs.current.delete(item.id);
            }
          }}
          renderRightActions={renderRightActions(item)}
          overshootRight={false}
          overshootFriction={SWIPE_CONFIG.OVERSHOOT_FRICTION}
          friction={SWIPE_CONFIG.FRICTION}
          rightThreshold={SWIPE_CONFIG.RIGHT_THRESHOLD}
          enableTrackpadTwoFingerGesture
          onSwipeableWillOpen={(direction) => {
            // 다른 열린 아이템 닫기 (한 번에 하나만 열림)
            swipeableRefs.current.forEach((ref, id) => {
              if (id !== item.id && ref) {
                ref.close();
              }
            });
            setOpenItemId(item.id);
          }}
          onSwipeableClose={() => {
            if (openItemId === item.id) {
              setOpenItemId(null);
            }
          }}
        >
          <View
            pointerEvents={openItemId === item.id ? 'none' : 'auto'}
            style={[styles.itemContainer, { backgroundColor: theme.colors.surface.normal.bg1, paddingHorizontal: 20 }]}
            accessible={true}
            accessibilityLabel={`${item.title} 상품`}
            accessibilityHint="왼쪽으로 스와이프하여 삭제 옵션을 표시합니다"
          >
            <ProductCardHorizontal
              id={item.id}
              imageUri={item.imageUri}
              title={item.title}
              price={item.price}
              pricePerSlot={item.pricePerSlot}
              buyersCount={item.buyersCount}
              progress={item.progress}
              badges={item.badges}
              completed={item.completed}
              variant={variant}
              showDivider={showDivider}
              centerTextVertically={centerTextVertically}
              onPress={() => {
                // 같은 아이템 탭: 스와이프 닫기 (접근성 - 쉬운 취소 방법)
                if (openItemId === item.id) {
                  closeSwipeable(item.id);
                  return;
                }

                // 다른 아이템이 열려있으면 닫기 (UX - 명확한 상태 관리)
                if (openItemId !== null) {
                  closeSwipeable(openItemId);
                  return;
                }

                // 정상 동작: 상품 상세로 이동
                onItemPress(item);
              }}
            />
          </View>
        </Swipeable>
      );
    },
    [theme, renderRightActions, onItemPress, openItemId, variant, showDivider, centerTextVertically, closeSwipeable]
  );

  const keyExtractor = useCallback((item: SwipeableProductItem) => item.id, []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: SwipeableProductSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionHeaderText, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
          {section.title}
        </Text>
      </View>
    ),
    [theme]
  );

  // 데이터 개수 계산 (FlatList 또는 SectionList)
  const itemCount = sections
    ? sections.reduce((sum, section) => sum + section.data.length, 0)
    : data?.length || 0;

  return (
    <View style={{ flex: 1 }}>
      <Pressable style={{ flex: 1 }} onPress={handleListBackgroundTap}>
      {sections ? (
        <SectionList
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScrollBeginDrag={() => {
            // 스크롤 시작 시 열린 스와이프 닫기 (UX 표준 동작)
            if (openItemId) {
              closeSwipeable();
            }
          }}
          contentContainerStyle={[
            styles.listContent,
            itemCount === 0 && styles.listContentEmpty,
          ]}
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          stickySectionHeadersEnabled={false}
          scrollEnabled={true}
          pointerEvents="box-none"
        />
      ) : (
        <FlatList
          data={data || []}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScrollBeginDrag={() => {
            // 스크롤 시작 시 열린 스와이프 닫기 (UX 표준 동작)
            if (openItemId) {
              closeSwipeable();
            }
          }}
          contentContainerStyle={[
            styles.listContent,
            itemCount === 0 && styles.listContentEmpty,
          ]}
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          scrollEnabled={true}
          pointerEvents="box-none"
        />
      )}
      </Pressable>

      {/* ConfirmationModal은 Pressable 외부에 배치하여 모달 탭이 리스트 배경 탭으로 감지되지 않도록 함 */}
      {/* 동적 확인 모달 (swipeActions의 confirmModal 설정 또는 기본 삭제 버튼 기반) */}
      {confirmModalState.visible && confirmModalState.action?.confirmModal && confirmModalState.item && (
        <ConfirmationModal
          visible={confirmModalState.visible}
          title={confirmModalState.action.confirmModal.title}
          descriptions={confirmModalState.action.confirmModal.descriptions}
          cancelText={confirmModalState.action.confirmModal.cancelText || '취소'}
          confirmText={confirmModalState.action.confirmModal.confirmText || '확인'}
          confirmColor={confirmModalState.action.backgroundColor}
          onCancel={() => {
            setConfirmModalState({
              visible: false,
              action: null,
              item: null,
            });
          }}
          onConfirm={() => {
            if (confirmModalState.item && confirmModalState.action) {
              confirmModalState.action.onPress(confirmModalState.item);
            }
            setConfirmModalState({
              visible: false,
              action: null,
              item: null,
            });
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {},
  listContentEmpty: {
    flexGrow: 1,
  },
  itemContainer: {},
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    height: '100%',
    overflow: 'hidden',
  },
  actionButtonTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.35,
    textAlign: 'center',
    lineHeight: 17,
  },
  sectionHeader: {
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
});