/**
 * GroupBuyInfoSection Component
 *
 * 공구 정보 섹션
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InfoRow, ParticipantsRow, useTheme } from '@/design-system';
import { useTypographyStyles } from '@/app/shared/hooks';
import type { HostInfo, Participant } from '@/app/shared/types';

export interface GroupBuyInfoSectionProps {
  totalSlots: number;
  quantityPerSlot: string;
  description: string;
  host: HostInfo;
  participants: Participant[];
}

export const GroupBuyInfoSection: React.FC<GroupBuyInfoSectionProps> = ({
  totalSlots,
  quantityPerSlot,
  description,
  host,
  participants,
}) => {
  const { theme } = useTheme();
  const typo = useTypographyStyles();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.surface.texticon.onnormal.text.black }]}>
        공구 정보
      </Text>
      <View style={{ flexDirection: 'row', gap: 30 }}>
        <InfoRow iconName="grid" text={`${totalSlots} 슬롯`} />
        <InfoRow iconName="package" text={quantityPerSlot} />
      </View>
      <Text style={{ ...typo.xs, color: theme.colors.surface.texticon.onnormal.text.black, marginTop: 10 }}>
        {description}
      </Text>
      <View style={{ marginTop: 15 }}>
        <ParticipantsRow host={host} participants={participants} />
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
