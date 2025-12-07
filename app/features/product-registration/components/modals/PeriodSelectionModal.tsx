/**
 * Period Selection Modal Component
 *
 * 기간 선택 모달 컴포넌트입니다.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme, Button } from '@/design-system';

interface PeriodSelectionModalProps {
  visible: boolean;
  initialPeriod?: { startDate?: Date; endDate?: Date } | null;
  onConfirm: (period: { startDate: Date; endDate: Date }) => void;
  onCancel: () => void;
}

export const PeriodSelectionModal: React.FC<PeriodSelectionModalProps> = ({
  visible,
  initialPeriod,
  onConfirm,
  onCancel,
}) => {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setStartDate(initialPeriod?.startDate || new Date());
      setEndDate(initialPeriod?.endDate || new Date());
    }
  }, [visible, initialPeriod]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      // 시작일이 종료일보다 늦으면 종료일을 시작일로 맞춤
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      // 종료일이 시작일보다 이르면 설정하지 않음
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm({ startDate, endDate });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
            >
              기간 설정
            </Text>
          </View>

          {/* 날짜 선택 */}
          <View style={styles.content}>
            {/* 시작일 */}
            <View style={styles.dateRow}>
              <Text
                style={[
                  styles.dateLabel,
                  { color: theme.colors.surface.texticon.onnormal.text.highEmp },
                ]}
              >
                시작일
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    borderColor: theme.colors.border.midEmp,
                    backgroundColor: theme.colors.surface.normal.bg1,
                  },
                ]}
                onPress={() => setShowStartPicker(true)}
              >
                <Text
                  style={[
                    styles.dateText,
                    { color: theme.colors.surface.texticon.onnormal.text.black },
                  ]}
                >
                  {formatDate(startDate)}
                </Text>
              </TouchableOpacity>
            </View>

            {/* 종료일 */}
            <View style={styles.dateRow}>
              <Text
                style={[
                  styles.dateLabel,
                  { color: theme.colors.surface.texticon.onnormal.text.highEmp },
                ]}
              >
                종료일
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    borderColor: theme.colors.border.midEmp,
                    backgroundColor: theme.colors.surface.normal.bg1,
                  },
                ]}
                onPress={() => setShowEndPicker(true)}
              >
                <Text
                  style={[
                    styles.dateText,
                    { color: theme.colors.surface.texticon.onnormal.text.black },
                  ]}
                >
                  {formatDate(endDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DateTimePicker for Start Date */}
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
            />
          )}

          {/* DateTimePicker for End Date */}
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndDateChange}
              minimumDate={startDate}
            />
          )}

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
              style={styles.button}
            >
              확인
            </Button>
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
    gap: 16,
    marginBottom: 24,
  },
  dateRow: {
    gap: 12,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Pretendard',
    letterSpacing: -0.375,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
