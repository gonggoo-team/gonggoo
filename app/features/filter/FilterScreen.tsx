/**
 * FilterScreen Component
 *
 * 동네, 오늘 마감, 추천 탭에서 공통으로 사용하는 필터 전체 화면입니다.
 * - 예약가능 공구만 보기
 * - 공구 가격 (슬라이더 + 버튼)
 * - 모집 슬롯
 * - 모집 상태
 * - 실시간 필터링 (Mock 데이터 기반)
 *
 * Figma node-id: 930-3663
 */

import React, { useState } from 'react';
import {
  DeviceEventEmitter,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThrottledNavigation } from '@/app/shared/hooks';
import { getProductPriceRange } from '@/app/shared/services/mock/products.mock';
import type { CommonFilters } from '@/app/shared/types/filter.types';
import { getDefaultFilters } from '@/app/shared/types/filter.types';
import { FILTER_SCREEN } from '@/app/shared/constants/layout';

import {
  Button,
  Checkbox,
  Divider,
  Icon,
  ScreenWrapper,
  Tooltip,
  useTheme,
} from '@/design-system';
import type { Theme } from '@/design-system/theme/types';

import { FilterHeader } from './components/FilterHeader';
import { PriceSection } from './components/PriceSection';
import { useFilterLogic } from './hooks/useFilterLogic';

/**
 * FilterScreen Component
 */
export default function FilterScreen() {
  const { theme } = useTheme();
  const { back } = useThrottledNavigation();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // ScrollView paddingBottom: 액션바 높이 + 여유 10px + SafeArea bottom
  // Galaxy S8: 100px, iPhone: 134px
  const scrollPaddingBottom = FILTER_SCREEN.getScrollPadding(insets.bottom);

  // params에서 가격 범위 추출 (검색 결과 또는 필터링된 데이터 기준)
  const paramMinPrice = params.minPrice ? parseInt(params.minPrice as string) : undefined;
  const paramMaxPrice = params.maxPrice ? parseInt(params.maxPrice as string) : undefined;

  // params가 있으면 우선 사용, 없을 때만 전체 데이터 기준 사용 (fallback)
  const productPriceRange = paramMinPrice !== undefined && paramMaxPrice !== undefined
    ? { min: paramMinPrice, max: paramMaxPrice }
    : getProductPriceRange();

  // 초기 필터 값 설정
  const initialFilters: CommonFilters = params.filters
    ? {
        ...JSON.parse(params.filters as string),
        priceRange: [productPriceRange.min, productPriceRange.max], // params 우선, fallback은 전체 데이터
      }
    : getDefaultFilters([productPriceRange.min, productPriceRange.max]);

  // params에서 productIds 추출 (필터링 대상 상품 ID 배열)
  const productIds = params.productIds
    ? (JSON.parse(params.productIds as string) as string[])
    : undefined;

  // 필터링 로직 훅
  const { filters, updateFilter, filteredCount, resetFilters, priceRangeBounds: bounds } =
    useFilterLogic(
      initialFilters,
      productPriceRange,
      params.resultCount ? parseInt(params.resultCount as string) : undefined,  // baseProductCount
      productIds  // 필터링 대상 상품 ID 배열
    );

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isSliderActive, setIsSliderActive] = useState(false);

  // 예약가능 공구만 보기 토글
  const handleToggleReservationOnly = () => {
    updateFilter('isReservationAvailable', !filters.isReservationAvailable);
  };

  // 가격 범위 변경
  const handlePriceRangeChange = (value: [number, number]) => {
    updateFilter('priceRange', value);
  };

  // 가격 버튼 변경
  const handlePriceButtonChange = (buttonLabel: string | null) => {
    updateFilter('selectedPriceButton', buttonLabel);
  };

  // 슬롯 체크박스 토글
  const handleToggleSlot = (slotRange: string) => {
    const newSlots = filters.slotRanges.includes(slotRange)
      ? filters.slotRanges.filter((s) => s !== slotRange)
      : [...filters.slotRanges, slotRange];

    updateFilter('slotRanges', newSlots);
  };

  // 모집 상태 체크박스 토글
  const handleToggleStatus = (status: string) => {
    const newStatuses = filters.recruitmentStatuses.includes(status)
      ? filters.recruitmentStatuses.filter((s) => s !== status)
      : [...filters.recruitmentStatuses, status];

    updateFilter('recruitmentStatuses', newStatuses);
  };

  // 초기화
  const handleReset = () => {
    resetFilters(getDefaultFilters([bounds.min, bounds.max]));
  };

  // 적용 (필터 이벤트 발생 + 화면 닫기)
  const handleApply = () => {
    // 1. 필터 적용 이벤트 발생
    DeviceEventEmitter.emit('filter:applied', filters);

    // 2. 화면 닫기
    back();
  };

  const styles = createStyles(theme);

  return (
    <ScreenWrapper
      preset='fullscreen'
      style={[
        styles.container,
        {
          // paddingTop: insets.top + theme.spacing.md, // Safe Area + 16px
        }
      ,]}>
      {/* Stack Screen 헤더 숨김 */}
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />

      {/* 커스텀 헤더 (고정) */}
      <FilterHeader />

      {/* 스크롤 가능한 컨텐츠 */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContentContainer,
          // { paddingBottom: scrollPaddingBottom }
        ]}
        scrollEnabled={!isSliderActive}
      >
        {/* 예약가능 공구만 보기 */}
        <View style={styles.section}>
          <Checkbox
            checked={filters.isReservationAvailable}
            label="예약가능 공구만 보기"
            position="right"
            onPress={handleToggleReservationOnly}
          />
        </View>

          <Divider style={styles.divider} />

          {/* 공구 가격 섹션 (PriceSection 컴포넌트) */}
          <PriceSection
            priceRange={filters.priceRange}
            selectedPriceButton={filters.selectedPriceButton}
            onPriceRangeChange={handlePriceRangeChange}
            onPriceButtonChange={handlePriceButtonChange}
            minPrice={bounds.min}
            maxPrice={bounds.max}
            onDragStart={() => setIsSliderActive(true)}
            onDragEnd={() => setIsSliderActive(false)}
          />

          {/* 모집 슬롯 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>모집 슬롯</Text>
              <TouchableOpacity
                onPress={() => setIsTooltipVisible(true)}
                activeOpacity={0.7}
                style={styles.questionIcon}
              >
                <Icon
                  name="question"
                  size={16}
                  color={theme.colors.surface.texticon.onnormal.icon.lowEmp}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxList}>
              <Checkbox
                checked={filters.slotRanges.includes('1~4슬롯')}
                label="1~4슬롯"
                position="right"
                onPress={() => handleToggleSlot('1~4슬롯')}
              />
              <Checkbox
                checked={filters.slotRanges.includes('5~8슬롯')}
                label="5~8슬롯"
                position="right"
                onPress={() => handleToggleSlot('5~8슬롯')}
              />
              <Checkbox
                checked={filters.slotRanges.includes('9~12슬롯')}
                label="9~12슬롯"
                position="right"
                onPress={() => handleToggleSlot('9~12슬롯')}
              />
              <Checkbox
                checked={filters.slotRanges.includes('13슬롯 이상')}
                label="13슬롯 이상"
                position="right"
                onPress={() => handleToggleSlot('13슬롯 이상')}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* 모집 상태 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>모집 상태</Text>
            </View>
            <View style={styles.checkboxList}>
              <Checkbox
                checked={filters.recruitmentStatuses.includes('모집 중')}
                label="모집 중"
                position="right"
                onPress={() => handleToggleStatus('모집 중')}
              />
              <Checkbox
                checked={filters.recruitmentStatuses.includes('마감 임박')}
                label="마감 임박"
                position="right"
                onPress={() => handleToggleStatus('마감 임박')}
              />
              <Checkbox
                checked={filters.recruitmentStatuses.includes('모집 완료 제외')}
                label="모집 완료 제외"
                position="right"
                onPress={() => handleToggleStatus('모집 완료 제외')}
              />
            </View>
          </View>

        {/* 하단 여백 */}
        {/* <View style={styles.bottomSpacing} /> */}
      </ScrollView>

      {/* 하단 액션 바 (고정) */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Icon
            name="refresh"
            size={20}
            color={theme.colors.surface.texticon.onnormal.icon.black}
          />
          <Text style={styles.resetButtonText}>초기화</Text>
        </TouchableOpacity>

        <Button
          variant="square-selected"
          onPress={handleApply}
          style={styles.applyButton}
        >
          {`${filteredCount}개 모집글 보기`}
        </Button>
      </View>

      {/* 툴팁 */}
      <Tooltip
        visible={isTooltipVisible}
        title="슬롯이란?"
        description="슬롯은 공구 참여 단위예요.&#10;1슬롯은 내가 맡을 상품 몫을 의미합니다."
        example="예: 티슈 8개를 4슬롯으로 나누면, &#10;1슬롯 = 티슈 2개, 2슬롯을 구매하면 총 티슈 4개를 구매할 수 있어요."
        onClose={() => setIsTooltipVisible(false)}
      />
    </ScreenWrapper>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface.normal.bg1,
    },
    scrollContent: {
      flex: 1,
    },
    scrollContentContainer: {
      // paddingBottom은 동적으로 계산되어 inline style로 적용됨
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,      
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.surface.texticon.onnormal.text.black,
      letterSpacing: theme.typography.getLetterSpacing(
        theme.typography.fontSize.lg
      ),      
    },
    questionIcon: {
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxList: {
      gap: 18,
    },
    divider: {
      marginHorizontal: theme.spacing.lg,
    },
    bottomSpacing: {
      height: 20,
    },
    actionBar: {
      // position: 'absolute',
      // bottom: 0,
      // left: 0,
      // right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 23,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: 13,
      paddingBottom: 13,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.lowEmp,
      backgroundColor: theme.colors.surface.normal.bg1,
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: theme.spacing.sm,
    },
    resetButtonText: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.surface.texticon.onnormal.text.black,
      letterSpacing: theme.typography.getLetterSpacing(13),
    },
    applyButton: {      
      flex: 1,
      height: 54,
    },
  });
