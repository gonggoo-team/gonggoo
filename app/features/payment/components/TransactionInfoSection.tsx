/**
 * TransactionInfoSection Component
 *
 * 결제 페이지 거래 정보 섹션
 * Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=1114-11948
 *
 * - "거래 장소" 라벨 + 거래 장소 텍스트
 * - "거래 시간" 라벨 + 시간 칩들 (회색 배경, 여러 개 가로 나열)
 */

import React, { useMemo } from 'react';
import { View, Text } from 'react-native';

import { useTheme } from '@/design-system';
import { styles } from './TransactionInfoSection.styles';

export interface TransactionInfoSectionProps {
  /** 거래 장소 */
  location: string;
  /** 거래 시간 설명 */
  timeDescription: string;
}

/**
 * 시간 설명을 파싱하여 칩 배열로 변환
 * 예: "평일 저녁 18:00~21:00" → ["평일", "저녁", "18:00~21:00"]
 */
const parseTimeDescription = (timeDescription: string): string[] => {
  // 공백으로 분리
  const parts = timeDescription.split(' ').filter((part) => part.trim() !== '');

  // 의미 있는 단위로 그룹화
  if (parts.length === 0) {
    return [timeDescription];
  }

  return parts;
};

export const TransactionInfoSection: React.FC<TransactionInfoSectionProps> = ({
  location,
  timeDescription,
}) => {
  const { theme } = useTheme();

  // 시간 설명을 칩 배열로 파싱
  const timeChips = useMemo(
    () => parseTimeDescription(timeDescription),
    [timeDescription]
  );

  const textColor = theme.colors.surface.texticon.onnormal.text.black;

  return (
    <View style={styles.container}>
      {/* 섹션 타이틀 */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        거래 정보
      </Text>

      {/* 정보 컨테이너 */}
      <View style={styles.infoContainer}>
        {/* 거래 장소 행 */}
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: textColor }]}>
            거래 장소
          </Text>
          <Text style={[styles.value, { color: textColor }]}>
            {location}
          </Text>
        </View>

        {/* 거래 시간 행 */}
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: textColor }]}>
            거래 시간
          </Text>
          <View style={styles.timeChipsWrapper}>
            <View style={styles.timeChipsRow}>
              {timeChips.map((chip, index) => (
                <View key={index} style={styles.timeChip}>
                  <Text style={[styles.timeChipText, { color: textColor }]}>
                    {chip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
