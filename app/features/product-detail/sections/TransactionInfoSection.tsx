/**
 * TransactionInfoSection Component
 *
 * 거래 정보 섹션
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InfoRow, MapView, useTheme } from '@/design-system';

export interface TransactionInfoSectionProps {
  location: string;
  latitude: number;
  longitude: number;
  timeDescription: string;
  deliveryAvailable: boolean;
}

export const TransactionInfoSection: React.FC<TransactionInfoSectionProps> = ({
  location,
  latitude,
  longitude,
  timeDescription,
  deliveryAvailable,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
        거래 정보
      </Text>
      <View style={{ marginTop: 15 }}>
        <MapView latitude={latitude} longitude={longitude} address={location} height={200} />
      </View>
      <View style={{ gap: 9, marginTop: 15 }}>
        <InfoRow iconName="location" text={location} />
        <InfoRow iconName="clock" text={timeDescription} />
        <InfoRow iconName="box" text={deliveryAvailable ? '가능' : '불가능'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 16.8,
  },
});
