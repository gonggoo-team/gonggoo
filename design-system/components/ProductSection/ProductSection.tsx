/**
 * ProductSection Component
 *
 * 홈화면 제품 섹션 컴포넌트입니다.
 * 섹션 제목, 부제목(optional), 액션 버튼, 제품 카드 리스트를 포함합니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=445-6477&m=dev
 * 마지막 동기화: 2025-10-09
 *
 * 사용 예시:
 * ```tsx
 * <ProductSection
 *   title="우리 동네에서 모집 중!"
 *   subtitle="00동에서 모집 중인 팟을 한눈에 확인하세요!"
 *   actionLabel="전체보기"
 *   onActionPress={() => {}}
 * >
 *   <ScrollView horizontal>
 *     <ProductCardCompact {...productData} />
 *   </ScrollView>
 * </ProductSection>
 * ```
 */

import { Icon } from '@/design-system/primitives';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks';
import type { ProductSectionProps } from './ProductSection.types';

/**
 * ProductSection Component
 */
export const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  children,
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const backgroundColor =
    variant === 'highlight'
      ? theme.colors.surface.normal.bg2 // #F5F5F5
      : theme.colors.surface.normal.bg1; // #FFFFFF

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* 헤더 영역 */}
      <View
        style={{
          paddingHorizontal: theme.spacing.lg, // 20px
          gap: subtitle ? 5 : 0, // Figma: 제목-부제 간격 5px
        }}
      >
        {/* 제목 + 액션 버튼 */}
        <View style={styles.titleRow}>
          {/* 제목 */}
          <Text
            style={{
              fontSize: 16, // Figma: 16px
              fontWeight: theme.typography.fontWeight.semiBold, // 600
              lineHeight: 16 * 1.2, // Figma 기준
              letterSpacing: theme.typography.getLetterSpacing(16),
              color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
            }}
          >
            {title}
          </Text>

          {/* 액션 버튼 */}
          {actionLabel && onActionPress && (
            <TouchableOpacity
              onPress={onActionPress}
              style={styles.actionButton}
              accessibilityRole="button"
              accessibilityLabel={actionLabel}
            >
              <Text
                style={{
                  fontSize: 13, // Figma: 13px
                  fontWeight: theme.typography.fontWeight.medium, // 500
                  lineHeight: 13 * 1.2, // Figma 기준
                  letterSpacing: theme.typography.getLetterSpacing(13),
                  color: theme.colors.surface.texticon.onnormal.text.highEmp, // Figma 기준 #A6A6A6
                }}
              >
                {actionLabel}
              </Text>
              <Icon 
                name='back-mini'
                size={12}
                color={theme.colors.surface.texticon.onnormal.text.highEmp} // Figma 기준 #A6A6A6
              />
            </TouchableOpacity>
          )}
        </View>

        {/* 부제목 */}
        {subtitle && (
          <Text
            style={{
              fontSize: 13, // Figma: 13px
              fontWeight: theme.typography.fontWeight.medium, // 500
              lineHeight: 13 * 1.193, // Figma 기준
              letterSpacing: theme.typography.getLetterSpacing(13),
              color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* 콘텐츠 영역 */}
      <View style={{ marginTop: 15 }}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6, // Figma: 전체보기 텍스트와 아이콘 사이 6px
  },
});
