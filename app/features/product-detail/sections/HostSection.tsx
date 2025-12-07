/**
 * HostSection Component
 *
 * 공구장 정보 섹션
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HostInfoSection, useTheme } from '@/design-system';
import type { HostInfo } from '@/app/shared/types';

export interface ProductPreview {
  id: string;
  imageUri: string;
}

export interface HostSectionProps {
  host: HostInfo;
  otherProducts: ProductPreview[];
  onHostPress: (hostId: string) => void;
  onProductPress: (productId: string) => void;
}

export const HostSection: React.FC<HostSectionProps> = ({
  host,
  otherProducts,
  onHostPress,
  onProductPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
        공구장 정보
      </Text>
      <View style={{ marginTop: 15 }}>
        <HostInfoSection
          host={{
            id: host.id,
            nickname: host.nickname,
            profileImageUri: host.profileImageUri,
            rating: host.rating,
          }}
          otherProducts={otherProducts}
          onHostPress={onHostPress}
          onProductPress={onProductPress}
        />
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
