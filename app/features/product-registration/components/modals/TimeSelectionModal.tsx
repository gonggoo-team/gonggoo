/**
 * Time Selection Modal Component
 *
 * 시간 선택 모달 컴포넌트입니다.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme, Button } from '@/design-system';
import { useFocusState } from '../../hooks';

interface TimeSelectionModalProps {
  visible: boolean;
  initialTime?: string;
  onConfirm: (time: string) => void;
  onCancel: () => void;
}

export const TimeSelectionModal: React.FC<TimeSelectionModalProps> = ({
  visible,
  initialTime,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [time, setTime] = useState('');
  const { focusHandlers, focusBorderColor } = useFocusState();

  useEffect(() => {
    if (visible) {
      setTime(initialTime || '');
    }
  }, [visible, initialTime]);

  const handleConfirm = () => {
    if (time.trim()) {      
      onConfirm(time.trim());
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
            >
              시간 설정
            </Text>
          </View>

          {/* 입력 필드 */}
          <View style={styles.content}>
            <Text
              style={[
                styles.label,
                { color: theme.colors.surface.texticon.onnormal.text.highEmp },
              ]}
            >
              시간
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: 'focusBorderColor',
                  backgroundColor: theme.colors.surface.normal.bg1,
                  color: theme.colors.surface.texticon.onnormal.text.black,
                },
              ]}
              value={time}
              onChangeText={setTime}
              placeholder="시간을 입력하세요 (예: 14:00)"
              placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
              autoFocus
              {...focusHandlers}
            />
          </View>

          {/* 버튼 */}
          <View style={styles.buttonContainer}>
            <Button
              variant="full-secondary-rounded"
              onPress={onCancel}
              style={styles.button}
            >
              취소
            </Button>
            <Button
              variant="full-primary-rounded"
              onPress={handleConfirm}
              disabled={!time.trim()}
              style={styles.button}
            >
              확인
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.45,
    textAlign: 'center',
  },
  content: {
    marginBottom: 24,
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Pretendard',
    letterSpacing: -0.375,
    lineHeight: 18,
    textAlignVertical: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
