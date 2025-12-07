/**
 * Transaction Section Component
 *
 * 상품 등록 화면의 거래방식 섹션입니다.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Checkbox, Icon } from '@/design-system';
import { formatPriceWithCommas, parseFormattedPrice } from '../utils';
import { PeriodSelectionModal } from './modals';
import { useFocusState } from '../hooks';

interface TransactionSectionProps {
  isFree: boolean;
  price: string;
  period: { startDate?: Date; endDate?: Date } | null;
  slots: number;
  onFreeChange: (value: boolean) => void;
  onPriceChange: (value: string) => void;
  onPeriodChange: (value: { startDate?: Date; endDate?: Date } | null) => void;
  onSlotsChange: (value: number) => void;
}

export const TransactionSection: React.FC<TransactionSectionProps> = ({
  isFree,
  price,
  period,
  slots,
  onFreeChange,
  onPriceChange,
  onPeriodChange,
  onSlotsChange,
}) => {
  const { theme } = useTheme();
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const { focusHandlers: priceFocusHandlers, focusBorderColor: priceBorderColor } = useFocusState();

  const handlePriceChange = (text: string) => {
    // 숫자만 추출하여 저장
    const numericValue = text.replace(/[^\d]/g, '');
    onPriceChange(numericValue);
  };

  const handleSlotDecrease = () => {
    if (slots > 1) {
      onSlotsChange(slots - 1);
    }
  };

  const handleSlotIncrease = () => {
    if (slots < 99) {
      onSlotsChange(slots + 1);
    }
  };

  const handlePeriodPress = () => {
    setShowPeriodModal(true);
  };

  const handlePeriodConfirm = (selectedPeriod: { startDate: Date; endDate: Date }) => {
    onPeriodChange(selectedPeriod);
    setShowPeriodModal(false);
  };

  const handlePeriodCancel = () => {
    setShowPeriodModal(false);
  };

  const formatPeriodText = (): string => {
    if (!period?.startDate || !period?.endDate) {
      return '기간 설정';
    }
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}. ${month}. ${day}`;
    };
    return `${formatDate(period.startDate)} ~ ${formatDate(period.endDate)}`;
  };

  const calculatePricePerSlot = (): string => {
    if (isFree || !price || parseInt(price) === 0 || slots === 0) {
      return '';
    }
    const pricePerSlot = Math.floor(parseInt(price) / slots);
    return formatPriceWithCommas(pricePerSlot.toString());
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          
            <Text
              style={[
                styles.label,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
            >
              거래 방식
            </Text>
          
          
            <Checkbox
              checked={isFree}
              label="나눔"
              onPress={() => onFreeChange(!isFree)}
              position="left"
            />
          
        </View>

        {/* 가격 입력 */}
        <View
          style={[
            styles.inputContainer,
            {
              borderColor: priceBorderColor,
              backgroundColor: theme.colors.surface.normal.bg1,
            },
          ]}
        >
          <View style={styles.priceInputRow}>
            <Text
              style={[
                styles.currencySymbol,
                { color: isFree || !price ? theme.colors.surface.texticon.onnormal.text.lowEmp : theme.colors.surface.texticon.onnormal.text.black },
              ]}
            >
              ₩
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
              value={formatPriceWithCommas(price)}
              onChangeText={handlePriceChange}
              placeholder="가격을 입력하세요"
              placeholderTextColor={theme.colors.surface.texticon.onnormal.text.lowEmp}
              keyboardType="number-pad"
              editable={!isFree}
              {...priceFocusHandlers}
            />
          </View>
        </View>

        {/* 기간 설정 */}
        <TouchableOpacity
          style={[
            styles.inputContainer,
            {
              borderColor: theme.colors.border.midEmp,
              backgroundColor: theme.colors.surface.normal.bg1,
            },
          ]}
          onPress={handlePeriodPress}
          activeOpacity={0.7}
        >
          <View style={styles.periodRow}>
            <Text
              style={[
                styles.periodText,
                { color: theme.colors.surface.texticon.onnormal.text.highEmp },
              ]}
            >
              {formatPeriodText()}
            </Text>
            <View style={{ transform: [{ rotate: '180deg' }] }}>
              <Icon
                name="back"
                size={12}
                color={theme.colors.surface.texticon.onnormal.icon.black}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* 슬롯 */}
        <View style={styles.halfWidth}>
          <View
            style={[
              styles.inputContainer,
              {
                borderColor: theme.colors.border.midEmp,
                backgroundColor: theme.colors.surface.normal.bg1,
                position: 'relative',                 
              },
            ]}
          >
            <View style={styles.slotRow}>
              <Text
                style={[
                  styles.slotLabel,
                  { color: theme.colors.surface.texticon.onnormal.text.highEmp },
                ]}
              >
                슬롯
              </Text>
              {/* 슬롯당 가격 */}
              {calculatePricePerSlot() && (
                <Text
                  style={[
                    styles.pricePerSlot,
                    { color: theme.colors.surface.texticon.onnormal.text.green },
                  ]}
                >
                  * 1슬롯 당 {calculatePricePerSlot()}원
                </Text>
              )}
              <View style={styles.slotControl}>
                <TouchableOpacity
                  onPress={handleSlotDecrease}
                  disabled={slots <= 1}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="minus"
                    size={16}
                    color={
                      slots <= 1
                        ? theme.colors.surface.texticon.onnormal.icon.lowEmp
                        : theme.colors.surface.texticon.onnormal.icon.highEmp
                    }
                  />
                </TouchableOpacity>
                <View style={styles.slotValueContainer}>
                  <Text
                    style={[
                      styles.slotValue,
                      { color: theme.colors.surface.texticon.onnormal.text.black },
                    ]}
                  >
                    {slots}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleSlotIncrease}
                  disabled={slots >= 99}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="plus"
                    size={16}
                    color={
                      slots >= 99
                        ? theme.colors.surface.texticon.onnormal.icon.lowEmp
                        : theme.colors.surface.texticon.onnormal.icon.black
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 기간 설정 모달 */}
      <PeriodSelectionModal
        visible={showPeriodModal}
        initialPeriod={period}
        onConfirm={handlePeriodConfirm}
        onCancel={handlePeriodCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    // minHeight: 48,
    
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 4,    
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
    lineHeight: 17,
    padding: 0,
    textAlignVertical: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,    
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',    
  },
  slotLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,    
  },
  slotControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,    
  },
  slotValueContainer: {
    paddingHorizontal: 9,    
  },
  slotValue: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Pretendard',
    letterSpacing: -0.325,
    textAlign: 'center',    
  },
  pricePerSlot: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Pretendard',
    letterSpacing: -0.3,    
    position: 'absolute', // 박스 흐름에 영향을 주지 않고 둥둥 띄움
    top: 8,               // 바닥에서 6px 위로 (박스 테두리와의 간격)
    left: 44,             // 왼쪽 패딩과 라인 맞춤      
  },
});
