/**
 * NoticeSection Component
 *
 * 회원 탈퇴 화면의 안내사항 박스 컴포넌트
 * Figma 디자인 기반으로 안내 메시지를 표시합니다.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/design-system';
import { getAccountDeletionColors } from '../constants/accountDeletion.constants';

interface NoticeSectionProps {
  /** 안내 항목 리스트 (여러 줄) */
  items?: string[];
  /** 단일 텍스트 (여러 줄을 \n으로 구분) */
  text?: string;
}

export function NoticeSection({ items, text }: NoticeSectionProps) {
  const { theme } = useTheme();
  const colors = getAccountDeletionColors();

  const getLetterSpacing = (fontSize: number, percentage: number) => {
    return (fontSize * percentage) / 100;
  };

  return (
    <View style={styles.container}>
      <View style={styles.noticeBox}>
        {items ? (
          items.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.noticeText,
                {
                  fontFamily: theme.typography.fontFamily.primary,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  lineHeight: theme.typography.fontSize.sm * 1.2,
                  letterSpacing: getLetterSpacing(theme.typography.fontSize.sm, -2.5),
                  color: colors.noticeTextColor,
                },
              ]}
            >
              {item}
            </Text>
          ))
        ) : text ? (
          <Text
            style={[
              styles.noticeText,
              {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                lineHeight: theme.typography.fontSize.sm * 1.8,
                letterSpacing: getLetterSpacing(theme.typography.fontSize.sm, -2.5),
                color: colors.noticeTextColor,
              },
            ]}
          >
            {text}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const createStyles = () => {
  const colors = getAccountDeletionColors();
  return StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    noticeBox: {
      backgroundColor: colors.noticeBgColor,
      borderRadius: 10,
      padding: 16,
      gap: 20,
    },
    noticeText: {},
  });
};

const styles = createStyles();
