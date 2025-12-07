/**
 * Location Section Component
 *
 * 상품 등록 화면의 거래 정보 섹션입니다.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, Checkbox, Icon } from '@/design-system';
import { LocationSelectionModal, TimeSelectionModal } from './modals';

interface LocationSectionProps {
  location: { address: string; latitude?: number; longitude?: number; time?: string } | null;
  isDeliveryAvailable: boolean;
  onLocationChange: (value: { address: string; latitude?: number; longitude?: number; time?: string } | null) => void;
  onDeliveryChange: (value: boolean) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  isDeliveryAvailable,
  onLocationChange,
  onDeliveryChange,
}) => {
  const { theme } = useTheme();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);

  const handleLocationPress = () => {
    setShowLocationModal(true);
  };

  const handleLocationConfirm = (selectedLocation: { address: string; latitude?: number; longitude?: number }) => {
    onLocationChange({
      ...selectedLocation,
      time: location?.time,
    });
    setShowLocationModal(false);
  };

  const handleLocationCancel = () => {
    setShowLocationModal(false);
  };

  const handleTimePress = () => {
    setShowTimeModal(true);
  };

  const handleTimeConfirm = (selectedTime: string) => {    
    if (location) {      
      onLocationChange({
        ...location,
        time: selectedTime,
      });
    }
    setShowTimeModal(false);
  };

  const handleTimeCancel = () => {
    setShowTimeModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.normal.bg1 }]}>
      <View style={styles.content}>
        <Text
          style={[
            styles.label,
            { color: theme.colors.surface.texticon.onnormal.text.black },
          ]}
        >
          거래 정보
        </Text>

        {/* 위치 추가 (전체 너비 유지) */}
        <TouchableOpacity
          style={[
            styles.inputContainer,
            {
              borderColor: theme.colors.border.midEmp,
              backgroundColor: theme.colors.surface.normal.bg1,
            },
          ]}
          onPress={handleLocationPress}
          activeOpacity={0.7}
        >
          <View style={styles.locationRow}>
            <Text
              style={[
                styles.locationText,
                { color: theme.colors.surface.texticon.onnormal.text.highEmp },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {location ? location.address : '위치 추가'}
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

        {/* [수정] 시간 설정 & 택배 가능 (한 행에 배치) */}
        <View style={styles.rowContainer}>
          {/* 1. 시간 설정 (왼쪽) */}
          <TouchableOpacity
            style={[
              styles.inputContainer,
              styles.halfWidth, // 50% 너비
              {
                borderColor: theme.colors.border.midEmp,
                backgroundColor: theme.colors.surface.normal.bg1,
              },
            ]}
            onPress={handleTimePress}
            activeOpacity={0.7}
          >
            <View style={styles.locationRow}>
              <Text
                style={[
                  styles.locationText,
                  { color: theme.colors.surface.texticon.onnormal.text.highEmp },
                ]}
              >
                {location?.time || '시간 설정'}
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

          {/* 2. 택배 가능 (오른쪽) */}
          <View
            style={[
              styles.inputContainer, // 높이와 테두리를 맞추기 위해 같은 스타일 사용
              styles.halfWidth,      // 50% 너비
              {
                borderColor: theme.colors.border.midEmp,
                backgroundColor: theme.colors.surface.normal.bg1,
              },
            ]}
          >
            <Checkbox
              checked={isDeliveryAvailable}
              label="택배 가능"
              onPress={() => onDeliveryChange(!isDeliveryAvailable)}
              position="right" // 체크박스 아이콘을 우측에 배치 (취향에 따라 left로 변경 가능)
              style={styles.deliveryCheckbox}
            />
          </View>
        </View>
      </View>

      {/* 위치 선택 모달 */}
      <LocationSelectionModal
        visible={showLocationModal}
        initialLocation={location}
        onConfirm={handleLocationConfirm}
        onCancel={handleLocationCancel}
      />

      {/* 시간 선택 모달 */}
      <TimeSelectionModal
        visible={showTimeModal}
        initialTime={location?.time}
        onConfirm={handleTimeConfirm}
        onCancel={handleTimeCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    // 필요 시 하단 여백 추가
    // paddingBottom: 40,
  },
  content: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
  },
  // 공통 Input 스타일 (높이, 테두리, 패딩)
  inputContainer: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 48, // 고정 높이로 변경
    justifyContent: 'center', // 텍스트 수직 중앙 정렬
  },
  // [신규] 가로 배치 컨테이너
  rowContainer: {
    flexDirection: 'row',
    gap: 12, // 좌우 간격
  },
  // [신규] 반반 너비
  halfWidth: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8, // 텍스트와 아이콘 사이 간격
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Pretendard',
    letterSpacing: -0.35,
    // flex: 1, // 텍스트가 길어질 경우를 대비
  },
  deliveryCheckbox: {
    width: '100%', // 컨테이너 꽉 채우기
  },
});