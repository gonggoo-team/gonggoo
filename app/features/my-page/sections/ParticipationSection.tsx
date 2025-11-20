import React from 'react';
import type { ParticipationStats, StatusButtonItem } from '@/app/shared/types';
import { StatusSection } from './StatusSection';

interface ParticipationSectionProps {
  stats: ParticipationStats;
  onWishlistPress: () => void;
  onJoinedPress: () => void;
  onTransactionCompletePress: () => void;
}

export function ParticipationSection({
  stats,
  onWishlistPress,
  onJoinedPress,
  onTransactionCompletePress,
}: ParticipationSectionProps) {
  const statusItems: StatusButtonItem[] = [
    {
      id: 'wishlist',
      label: '찜 목록',
      count: stats.wishlist,
      iconName: 'heart-line',
      onPress: onWishlistPress,
    },
    {
      id: 'joined',
      label: '참여 완료',
      count: stats.joined,
      iconName: 'joined',
      onPress: onJoinedPress,
    },
    {
      id: 'transaction-complete',
      label: '거래 완료',
      count: stats.transactionComplete,
      iconName: 'group-complete',
      onPress: onTransactionCompletePress,
    },
  ];

  return <StatusSection title="나의 공구 참여" items={statusItems} />;
}
