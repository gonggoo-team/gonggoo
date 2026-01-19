/**
 * TermsSection Component
 *
 * 결제 페이지 약관 동의 섹션
 * Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=1114-11973
 *
 * - 체크박스 + 약관 동의 텍스트 + 드롭다운 아이콘
 * - 드롭다운 아이콘 클릭 시 약관 전문 펼침/접힘
 * - 체크박스 클릭 시 동의/비동의 토글
 */

import React, { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';

import { useTheme, Icon } from '@/design-system';
import { styles } from './TermsSection.styles';

export interface TermsSectionProps {
  /** 약관 동의 여부 */
  isAgreed: boolean;
  /** 동의 토글 핸들러 */
  onToggle: () => void;
}

/** 약관 동의 텍스트 */
const TERMS_TITLE = '주문 상품정보 및 결제대행 서비스 이용약관에 모두 동의합니다.';

/** 약관 전문 내용 */
const TERMS_CONTENT = `개별 판매자가 등록한 상품에 대한 광고, 상품주문, 배송 및 환불의 의무와 책임은 각 판매자가 부담하고, 이에 대하여 회사는 통신판매중개자로서 통신판매의 당사자가 아니므로 일체 책임을 지지 않습니다.`;

export const TermsSection: React.FC<TermsSectionProps> = ({
  isAgreed,
  onToggle,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  // 애니메이션 값
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  // 펼치기/접기 토글
  const toggleExpand = useCallback(() => {
    const toValue = isExpanded ? 0 : 1;

    Animated.parallel([
      // 아이콘 회전 애니메이션
      Animated.timing(rotateAnim, {
        toValue,
        duration: 200,
        useNativeDriver: true,
      }),
      // 높이 애니메이션
      Animated.timing(heightAnim, {
        toValue,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  }, [isExpanded, rotateAnim, heightAnim]);

  // 회전 인터폴레이션
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // 높이 인터폴레이션 (0 -> 약 70px)
  const heightInterpolate = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        {/* 체크박스 + 텍스트 */}
        {/* <Pressable onPress={onToggle} style={styles.termsRow}> */}
          {/* 체크박스 */}
          {/* <View
            style={[
              styles.checkbox,
              isAgreed && styles.checkboxChecked,
            ]}
          >
            {isAgreed && (
              <Icon
                name="check"
                size={12}
                color={theme.colors.surface.texticon.onnormal.text.white}
              />
            )}
          </View> */}

          {/* 약관 동의 텍스트 */}
          <Pressable onPress={toggleExpand}>
            <Text style={styles.termsText}>
              {TERMS_TITLE}
            </Text>
          </Pressable>
        {/* </Pressable> */}

        {/* 드롭다운 아이콘 (클릭 시 펼침/접힘) */}
        <Pressable onPress={toggleExpand}>
          <Animated.View
            style={[
              styles.dropdownIcon,
              { transform: [{ rotate: rotateInterpolate }] },
            ]}
          >
            <Icon
              name="drop"
              size={16}
              color={theme.colors.surface.texticon.onnormal.icon.highEmp}
            />
          </Animated.View>
        </Pressable>
      </View>

      {/* 약관 내용 (애니메이션) */}
      <Animated.View
        style={[
          styles.contentContainer,
          { maxHeight: heightInterpolate },
        ]}
      >
        <View style={styles.contentWrapper}>
          <Text style={styles.expandedText}>
            {TERMS_CONTENT}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};
