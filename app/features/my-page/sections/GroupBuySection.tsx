import React from 'react';
import type { GroupBuyStats, StatusButtonItem } from '@/app/shared/types';
import { StatusSection } from './StatusSection';

interface GroupBuySectionProps {
  stats: GroupBuyStats;
  onRecruitingPress: () => void;
  onRecruitmentCompletePress: () => void;
  onGroupCompletePress: () => void;
}

export function GroupBuySection({
  stats,
  onRecruitingPress,
  onRecruitmentCompletePress,
  onGroupCompletePress,
}: GroupBuySectionProps) {
  const statusItems: StatusButtonItem[] = [
    {
      id: 'recruiting',
      label: '모집 중',
      count: stats.recruiting,
      iconName: 'recruiting',
      onPress: onRecruitingPress,
    },
    {
      id: 'recruitment-complete',
      label: '모집 완료',
      count: stats.recruitmentComplete,
      iconName: 'recruitment-complete',
      onPress: onRecruitmentCompletePress,
    },
    {
      id: 'group-complete',
      label: '공구 완료',
      count: stats.groupComplete,
      iconName: 'group-complete',
      onPress: onGroupCompletePress,
    },
  ];

  return <StatusSection title="나의 공구 개설" items={statusItems} />;
}
