/**
 * TransactionCompleteModal Component
 *
 * 거래 완료 요청 확인 모달
 * Figma: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C?node-id=1327-16341
 *
 * - 선택된 공구원 수 표시
 * - 거래 완료 요청 전송 확인
 * - 나중에 보낼게요 취소
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/design-system';
import type { TransactionCompleteModalProps } from './TransactionCompleteModal.types';

export const TransactionCompleteModal: React.FC<TransactionCompleteModalProps> = ({
  visible,
  selectedCount,
  onCancel,
  onConfirm,
}) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      {/* 배경 오버레이 */}
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onCancel}
        />

        {/* 모달 컨테이너 */}
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.colors.surface.normal.bg2 }, // #F5F5F5
          ]}
        >
          {/* 타이틀 */}
          <Text
            style={[
              styles.title,
              {
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.md,
                fontWeight: theme.typography.fontWeight.semiBold,
                letterSpacing: theme.typography.getLetterSpacing(16),
                color: theme.colors.surface.texticon.onnormal.text.black,
              },
            ]}
          >
            거래 완료 요청
          </Text>

          {/* 설명 텍스트들 */}
          <View style={styles.descriptionsContainer}>
            <Text
              style={[
                styles.description,
                {
                  fontFamily: theme.typography.fontFamily.primary,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  letterSpacing: theme.typography.getLetterSpacing(14),
                  color: theme.colors.surface.texticon.onnormal.text.black,
                },
              ]}
            >
              {selectedCount} 명의 거래자에게
            </Text>
            <Text
              style={[
                styles.description,
                {
                  fontFamily: theme.typography.fontFamily.primary,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  letterSpacing: theme.typography.getLetterSpacing(14),
                  color: theme.colors.surface.texticon.onnormal.text.black,
                },
              ]}
            >
              거래 완료 요청을 전송하시겠습니까?
            </Text>
            <Text
              style={[
                styles.notice,
                {
                  fontFamily: theme.typography.fontFamily.primary,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semiBold,
                  letterSpacing: theme.typography.getLetterSpacing(14),
                  color: theme.colors.surface.brand.primary, // #006242
                },
              ]}
            >
              * 거래가 완료되면 전송해주세요
            </Text>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            {/* 거래 완료 요청 전송 버튼 */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: theme.colors.surface.brand.primary },
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.buttonText,
                  styles.confirmButtonText,
                  {
                    fontFamily: theme.typography.fontFamily.primary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.semiBold,
                    letterSpacing: theme.typography.getLetterSpacing(14),
                    color: theme.colors.surface.normal.white,
                  },
                ]}
              >
                거래 완료 요청 전송
              </Text>
            </TouchableOpacity>

            {/* 나중에 보낼게요 버튼 */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: 'transparent',
                },
              ]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontFamily: theme.typography.fontFamily.primary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    letterSpacing: theme.typography.getLetterSpacing(12),
                    color: theme.colors.surface.brand.primary,
                  },
                ]}
              >
                나중에 보낼게요
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // 좌우 여백 확보
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '100%', // 반응형 너비
    maxWidth: 280, // 최대 너비 제한
    minWidth: 257, // 최소 너비 (Figma 사양)
    borderRadius: 20,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  descriptionsContainer: {
    gap: 7,
  },
  description: {
    textAlign: 'center',
    lineHeight: 16.8, // 1.2em
    flexWrap: 'wrap',
  },
  notice: {
    textAlign: 'center',
    lineHeight: 16.8,
    flexWrap: 'wrap',
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    alignSelf: 'stretch',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16, // 유연한 패딩
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40, // 최소 높이 확보
  },
  confirmButton: {
    // 색상은 theme에서 받음
  },
  cancelButton: {
    paddingVertical: 8,
  },
  buttonText: {
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  confirmButtonText: {
    // confirmButton용 추가 스타일
  },
});
