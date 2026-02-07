/**
 * ConfirmationModal Component
 *
 * 삭제/취소 확인 모달 컴포넌트
 * Figma 디자인 사양 준수 (299×160~205px, 중앙 배치)
 *
 * **Figma Design:**
 * - Delete Modal: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C?node-id=1066-16011
 * - Cancel Modal: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C?node-id=1108-13477
 *
 * **Specifications:**
 * - Container: 299px W, 12px border radius, white background
 * - Title: 16px, 600 weight, center-aligned, -2.5% letter spacing
 * - Description: 14px, 500 weight, center-aligned, -2.5% letter spacing
 * - Buttons: 100px W × 40px H, 18px gap, 12px border radius
 * - Overlay: rgba(24, 26, 26, 0.4)
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '@/design-system';
import type { ConfirmationModalProps } from './ConfirmationModal.types';

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  descriptions,
  cancelText,
  confirmText,
  confirmColor,
  onCancel,
  onConfirm,
}) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

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
            { backgroundColor: theme.colors.surface.normal.bg1 },
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
            {title}
          </Text>

          {/* 설명 텍스트들 */}
          <View style={styles.descriptionsContainer}>
            {descriptions.map((desc, index) => (
              <Text
                key={index}
                style={[
                  styles.description,
                  {
                    fontFamily: theme.typography.fontFamily.primary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    letterSpacing: theme.typography.getLetterSpacing(14),
                    color: theme.colors.surface.texticon.onnormal.text.midEmp,
                  },
                ]}
              >
                {desc}
              </Text>
            ))}
          </View>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            {/* 취소 버튼 */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: theme.colors.surface.normal.bg1,
                  borderColor: theme.colors.border.lowEmp,
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
                    letterSpacing: theme.typography.getLetterSpacing(14),
                    color: theme.colors.surface.texticon.onnormal.text.black,
                  },
                ]}
              >
                {cancelText}
              </Text>
            </TouchableOpacity>

            {/* 확인 버튼 */}
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                { backgroundColor: confirmColor },
              ]}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.buttonText,
                  {
                    fontFamily: theme.typography.fontFamily.primary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    letterSpacing: theme.typography.getLetterSpacing(14),
                    color: theme.colors.surface.normal.white,
                  },
                ]}
              >
                {confirmText}
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
    backgroundColor: 'rgba(24, 26, 26, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: 299, // Figma 사양
    borderRadius: 12,
    padding: 25,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    marginBottom: 13, // Figma: 54px (description top) - 27px (title top) - 19px (title height) = 8px gap
  },
  descriptionsContainer: {
    gap: 11, // Figma: 85px (line 2 top) - 57px (line 1 top) - 17px (line 1 height) = 11px gap
    marginBottom: 20,
  },
  description: {
    textAlign: 'center',
    lineHeight: 16.71, // Figma: 1.193359375em × 14px = 16.70703125px
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 18, // Figma: 159px (button 2 left) - 41px (button 1 left) - 100px (button 1 width) = 18px
    justifyContent: 'center',
  },
  button: {
    width: 100, // Figma: exact button width
    height: 40, // Figma: exact button height
    borderRadius: 12, // Figma: exact border radius
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    // 색상은 props로 받음
  },
  buttonText: {
    textAlign: 'center',
  },
});
