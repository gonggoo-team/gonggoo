/**
 * TransactionInfoSection Component
 *
 * 거래 정보 섹션
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InfoRow, MapView, useTheme, StaticMapImage } from '@/design-system';
import { STATIC_MAP_CONFIG } from '@/app/shared/config/staticMap.config';
import { generateNaverStaticMapUrl, getNaverStaticMapSource } from '@/app/shared/utils/staticMapUtils';
import { showMapAppSelector } from '@/app/shared/utils/mapDeepLinks';

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
  
  const staticMapSource = useMemo(() => {
    return getNaverStaticMapSource({
      latitude,
      longitude,
      width: STATIC_MAP_CONFIG.width,
      height: STATIC_MAP_CONFIG.height,
      zoom: STATIC_MAP_CONFIG.zoom,
      markerSize: STATIC_MAP_CONFIG.markerSize,
    });
  }, [latitude, longitude]);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
        거래 정보
      </Text>
      <View style={{ marginTop: 15 }}>
        {STATIC_MAP_CONFIG.enabled ? (
          /* Static Map */
          <StaticMapImage
            source={staticMapSource}
            height={200}
            onPress={() =>
              showMapAppSelector({
                latitude,
                longitude,
                address: location,
              })
            }
          />
        ) : (
          /* Dynamic Map (기존 방식) */
          <MapView latitude={latitude} longitude={longitude} address={location} height={200} />
        )}
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
