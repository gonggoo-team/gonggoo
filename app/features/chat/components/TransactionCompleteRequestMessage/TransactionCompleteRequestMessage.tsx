/**
 * TransactionCompleteRequestMessage Component
 *
 * 거래 완료 요청 시스템 메시지
 * Figma: 거래 완료 요청 메시지
 *
 * - 공구장이 공구원에게 거래 완료를 요청하는 메시지
 * - 거래 완료 버튼 클릭 시 거래 완료 처리
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/design-system';
import { createStyles } from './TransactionCompleteRequestMessage.styles';
import type { TransactionCompleteRequestMessageProps } from './TransactionCompleteRequestMessage.types';

export default function TransactionCompleteRequestMessage({
  onCompleteTransaction,
}: TransactionCompleteRequestMessageProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* 텍스트 영역 */}
      <View style={styles.textContainer}>
        {/* 제목 */}
        <Text style={styles.title}>만족스러운 거래 하셨나요?</Text>

        {/* 설명 */}
        <Text style={styles.description}>
          거래가 완료되었다면,{'\n'}거래 완료 버튼을 눌러주세요!
        </Text>

        {/* 주의사항 */}
        <Text style={styles.notice}>* 꼭 전문 받은 후에 눌러주세요</Text>
      </View>

      {/* 거래 완료 버튼 */}
      <TouchableOpacity
        style={styles.button}
        onPress={onCompleteTransaction}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>거래 완료</Text>
      </TouchableOpacity>
    </View>
  );
}
