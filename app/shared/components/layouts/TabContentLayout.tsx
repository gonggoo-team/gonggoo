/**
 * TabContentLayout Component
 *
 * 탭 콘텐츠의 기본 레이아웃을 제공하는 컴포넌트입니다.
 * - 고정 헤더 (항상 상단 고정, 배경 있음) + Collapsible 헤더 (스크롤 시 사라짐) + 일반 헤더 (스크롤) + 메인 콘텐츠 구조
 * - Animated.FlatList 기반으로 부드러운 애니메이션 지원
 * - 당근마켓 스타일 스크롤 방향 기반 헤더 숨김
 * - scrollToTop ref 노출
 *
 * 사용 예시:
 * ```tsx
 * const scrollRef = useRef<FlatList>(null);
 *
 * <TabContentLayout
 *   ref={scrollRef}
 *   fixedHeader={<CategoryFilterBar ... />}
 *   collapsibleHeader={<SortFilterBar ... />}
 *   header={
 *     <>
 *       <SectionHeader ... />
 *       <CountdownTimer ... />
 *     </>
 *   }
 *   data={products}
 *   renderItem={({ item }) => <ProductCard {...item} />}
 *   numColumns={2}
 * />
 * ```
 */

import React, { forwardRef, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';

import type { TabContentLayoutProps } from './TabContentLayout.types';

/**
 * TabContentLayout Component
 */
export const TabContentLayout = forwardRef<FlatList, TabContentLayoutProps>(
  (
    {
      fixedHeader,
      collapsibleHeader,
      header,
      data,
      renderItem,
      keyExtractor,
      numColumns = 1,
      contentContainerStyle,
      style,
      enableCollapsibleHeader = true,
      scrollEnabled = true,
    },
    ref
  ) => {
    // 스크롤 Y 위치 애니메이션 값
    const scrollY = useRef(new Animated.Value(0)).current;
    // 이전 스크롤 위치 추적
    const prevScrollY = useRef(0);
    // 헤더 표시 여부
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    // Collapsible 헤더 높이 (측정 필요 시 동적으로 변경 가능)
    const collapsibleHeaderHeight = useRef(new Animated.Value(1)).current;

    // 헤더 애니메이션 (스크롤 방향 기반)
    const headerTranslateY = collapsibleHeaderHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0], // 완전히 숨김 vs 완전히 보임
    });

    const headerOpacity = collapsibleHeaderHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    // ListHeaderComponent: Collapsible 헤더(통합) + 일반 헤더
    const ListHeaderComponent = useMemo(() => {
      if (!fixedHeader && !collapsibleHeader && !header) return undefined;

      return (
        <>
          {/* Collapsible 헤더: 카테고리 + 정렬/필터를 하나의 배경색으로 통합하여 스크롤 방향에 따라 사라짐/나타남 */}
          {(fixedHeader || collapsibleHeader) && enableCollapsibleHeader && (
            <Animated.View
              style={{
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              }}
            >
              {fixedHeader}
              {collapsibleHeader}
            </Animated.View>
          )}

          {/* Collapsible 비활성화 시 일반 View로 렌더링 */}
          {(fixedHeader || collapsibleHeader) && !enableCollapsibleHeader && (
            <View>
              {fixedHeader}
              {collapsibleHeader}
            </View>
          )}

          {/* 일반 헤더: 자연스럽게 스크롤 (제목/부제목, 타이머 등) */}
          {header && <View>{header}</View>}
        </>
      );
    }, [
      fixedHeader,
      collapsibleHeader,
      header,
      enableCollapsibleHeader,
      headerOpacity,
      headerTranslateY,
    ]);

    // onScroll 핸들러 (스크롤 방향 감지 - 쿠팡/당근마켓 스타일)
    const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: true,
      listener: (event: { nativeEvent: { contentOffset: { y: number } } }) => {
        if (!enableCollapsibleHeader) return;

        const currentScrollY = event.nativeEvent.contentOffset.y;
        const diff = currentScrollY - prevScrollY.current;

        // 최상단에 도달한 경우 무조건 헤더 표시
        if (currentScrollY < 10) {
          if (!isHeaderVisible) {
            setIsHeaderVisible(true);
            Animated.timing(collapsibleHeaderHeight, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }).start();
          }
          prevScrollY.current = currentScrollY;
          return;
        }

        // 스크롤 임계값 (5px 이상 움직여야 반응)
        const threshold = 5;

        if (Math.abs(diff) > threshold) {
          if (diff > 0 && currentScrollY > 50) {
            // 아래로 스크롤 && 50px 이상 스크롤한 경우 → 헤더 숨김
            if (isHeaderVisible) {
              setIsHeaderVisible(false);
              Animated.timing(collapsibleHeaderHeight, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }).start();
            }
          } else if (diff < 0) {
            // 위로 스크롤 → 헤더 보임
            if (!isHeaderVisible) {
              setIsHeaderVisible(true);
              Animated.timing(collapsibleHeaderHeight, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }).start();
            }
          }
        }

        prevScrollY.current = currentScrollY;
      },
    });

    // 성능 최적화: getItemLayout (고정 높이 아이템용)
    // ProductCardVertical/Horizontal 평균 높이
    const ITEM_HEIGHT = 258;
    const getItemLayout = useMemo(() => {
      if (numColumns > 1) {
        // 다중 열 그리드의 경우, 행 단위로 계산
        return (_: unknown, index: number) => {
          const rowIndex = Math.floor(index / numColumns);
          return {
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * rowIndex,
            index,
          };
        };
      }
      // 단일 열의 경우
      return (_: unknown, index: number) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      });
    }, [numColumns]);

    return (
      <Animated.FlatList
        ref={ref}
        style={[styles.container, style]}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        onScroll={enableCollapsibleHeader ? handleScroll : undefined}
        scrollEventThrottle={16}
        scrollEnabled={scrollEnabled}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={numColumns > 1 ? 10 : 5}
        windowSize={5}
        initialNumToRender={numColumns > 1 ? 10 : 5}
        updateCellsBatchingPeriod={50}
      />
    );
  }
);

TabContentLayout.displayName = 'TabContentLayout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    paddingHorizontal: 20,
  },
});
