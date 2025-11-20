/**
 * PriceSection Component
 *
 * 가격 필터 섹션입니다.
 * - 가격 범위 슬라이더
 * - 가격 버튼 (양방향 동기화)
 * - 실시간 가격 표시
 */

import type { PriceButtonConfig } from '@/app/shared/types/filter.types';
import { generatePriceButtons } from '@/app/shared/types/filter.types';
import { Button, Divider, PriceRangeSlider, useTheme } from '@/design-system';
import type { Theme } from '@/design-system/theme/types';
import { triggerLightImpact } from '@/design-system/utils/haptics';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface PriceSectionProps {
  priceRange: [number, number];
  selectedPriceButton: string | null;
  onPriceRangeChange: (value: [number, number]) => void;
  onPriceButtonChange: (buttonLabel: string | null) => void;
  /** 동적 가격 범위 (최소~최대) */
  minPrice: number;
  maxPrice: number;
  /** 슬라이더 드래그 시작 콜백 (스크롤 비활성화) */
  onDragStart?: () => void;
  /** 슬라이더 드래그 종료 콜백 (스크롤 재활성화) */
  onDragEnd?: () => void;
}

export const PriceSection: React.FC<PriceSectionProps> = ({
  priceRange,
  selectedPriceButton,
  onPriceRangeChange,
  onPriceButtonChange,
  minPrice,
  maxPrice,
  onDragStart,
  onDragEnd,
}) => {
  const { theme } = useTheme();

  // 동적 가격 버튼 생성
  const priceButtons = useMemo(
    () => generatePriceButtons(minPrice, maxPrice),
    [minPrice, maxPrice]
  );

  // 동적 step 계산 (범위에 따라)
  const step = useMemo(() => {
    const range = maxPrice - minPrice;
    if (range <= 10000) return 100; // 1만원 이하: 100원 단위
    if (range <= 200000) return 1000; // 20만원 이하: 1,000원 단위
    return 10000; // 20만원 이상: 1만원 단위
  }, [minPrice, maxPrice]);

  /**
   * 가격 버튼 클릭 핸들러
   * 버튼의 정확한 범위로 슬라이더 설정
   */
  const handlePriceButtonPress = (button: PriceButtonConfig) => {
    // 햅틱 피드백
    triggerLightImpact();

    // 이미 선택된 버튼을 다시 클릭하면 선택 해제
    if (selectedPriceButton === button.label) {
      onPriceButtonChange(null);
      onPriceRangeChange([minPrice, maxPrice]); // 전체 범위로 리셋 (동적)
    } else {
      onPriceButtonChange(button.label);
      // 버튼 범위를 실제 min/max로 클램핑
      const clampedMin = Math.max(button.min, minPrice);
      const clampedMax = Math.min(button.max, maxPrice);
      onPriceRangeChange([clampedMin, clampedMax]);
    }
  };

  /**
   * 슬라이더 변경 핸들러
   * 슬라이더를 직접 조작하면 버튼 선택 해제
   */
  const handleSliderChange = (value: [number, number]) => {
    onPriceRangeChange(value);
    // 슬라이더를 직접 조작하면 버튼 선택 해제
    onPriceButtonChange(null);
  };

  const styles = createStyles(theme);

  return (
    <>
      {/* 공구 가격 섹션 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>공구 가격</Text>
          <Text style={styles.priceValue}>
            {priceRange[0].toLocaleString('ko-KR')}원~
            {priceRange[1].toLocaleString('ko-KR')}원
          </Text>
        </View>

        {/* 슬라이더 */}
        <PriceRangeSlider
          min={minPrice}
          max={maxPrice}
          step={step}
          value={priceRange}
          onValueChange={handleSliderChange}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />

        {/* 가격 버튼 */}
        <View style={styles.priceButtons}>
          {priceButtons.map((button: PriceButtonConfig, index) => (
            <Button
              key={index}
              variant={
                selectedPriceButton === button.label
                  ? 'price-selected'
                  : 'price-unselected'
              }
              onPress={() => handlePriceButtonPress(button)}
              style={styles.priceButton}
            >
              {button.label}
            </Button>
          ))}
        </View>
      </View>

      <Divider style={styles.divider} />
    </>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginBottom: theme.spacing.lg,
      gap: theme.spacing.lg
    },
    sectionTitle: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.surface.texticon.onnormal.text.black,
      letterSpacing: theme.typography.getLetterSpacing(
        theme.typography.fontSize.lg
      ),
      flexShrink: 0, // 제목은 축소되지 않음
    },
    priceValue: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.surface.brand.primary,
      letterSpacing: theme.typography.getLetterSpacing(
        theme.typography.fontSize.sm
      ),
      flexShrink: 1, // 공간이 부족하면 가격 텍스트가 축소됨      
    },
    priceButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
      marginTop: theme.spacing.lg,
    },
    priceButton: {
      marginBottom: 0,
    },
    divider: {
      marginHorizontal: theme.spacing.lg,
    },
  });
