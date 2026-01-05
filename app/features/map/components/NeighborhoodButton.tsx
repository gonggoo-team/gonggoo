/**
 * NeighborhoodButton Component
 *
 * 현재 지도 중심의 동네명을 표시하는 버튼
 * - 녹색 배경, 흰색 텍스트
 * - 드래그 시 동네명 실시간 업데이트
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@/design-system';

interface NeighborhoodButtonProps {
  /** 동네명 */
  neighborhood: string;
  /** 선택 상태 */
  isSelected?: boolean;
  /** 클릭 핸들러 */
  onPress?: () => void;
}

export const NeighborhoodButton: React.FC<NeighborhoodButtonProps> = ({
  neighborhood,
  isSelected = false,
  onPress,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: '#006242', // 항상 녹색 배경
          borderWidth: 0,
          borderColor: 'transparent',
          shadowColor: theme.colors.surface.texticon.onnormal.text.black,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          {
            color: '#FFFFFF', // 항상 흰색 텍스트
          },
        ]}
      >
        {neighborhood}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    // height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 60,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: '#FFFFFF',
  },
});
