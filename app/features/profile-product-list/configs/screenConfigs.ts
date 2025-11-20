/**
 * Profile Screen Configurations
 *
 * 6개 프로필 화면의 설정 정의
 */

import { Alert } from 'react-native';
import type { ProfileScreenConfig } from '../types';
import type { SwipeableProductItem } from '@/app/shared/components';
import { theme } from '@/design-system/theme';

/**
 * 1. 모집 중
 */
export const RECRUITING_CONFIG: ProfileScreenConfig = {
  screenTitle: '모집 중',
  headerTitle: '모집 중인 공구!',
  headerSubtitle: '현재 모집 중인 공구 목록입니다.\n좌측으로 밀어 공구를 수정하거나 취소할 수 있어요.',
  statusType: 'recruiting',
  swipeActions: [
    {
      label: '공구\n수정',
      backgroundColor: theme.colors.surface.brand.primary,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      onPress: (item: SwipeableProductItem) => {
        Alert.alert('공구 수정', `${item.title}\n공구 수정 화면으로 이동합니다.`);
      },
    },
    {
      label: '모집\n취소',
      backgroundColor: theme.colors.surface.env.accent,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      confirmModal: {
        title: '정말 모집을 취소하시겠어요?',
        descriptions: [
          '취소하면 다시 복구되지 않아요.',
          '이미 참여한 사람들에게는 금액이 환불됩니다.',
        ],
        cancelText: '아니요',
        confirmText: '취소하기',
      },
      onPress: (item: SwipeableProductItem) => {
        // TODO: 실제 모집 취소 API 호출
        Alert.alert('모집 취소 완료', `${item.title}\n모집이 취소되었습니다.`);
      },
    },
  ],
  emptyState: {
    message: '모집 중인 공구가 없습니다',
    description: '새로운 공구를 개설해보세요',
  },
};

/**
 * 2. 모집 완료
 */
export const RECRUITMENT_COMPLETE_CONFIG: ProfileScreenConfig = {
  screenTitle: '모집 완료',
  headerTitle: '모집 완료된 공구!',
  headerSubtitle: '모집이 완료된 공구 목록입니다.\n채팅방에서 참여자들과 소통할 수 있어요.',
  statusType: 'recruitment-complete',
  swipeActions: [
    {
      label: '채팅\n가기',
      backgroundColor: theme.colors.surface.brand.primary,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      onPress: (item: SwipeableProductItem) => {
        Alert.alert('채팅 가기', `${item.title}\n채팅방으로 이동합니다.`);
      },
    },
    {
      label: '모집\n취소',
      backgroundColor: theme.colors.surface.env.accent,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      confirmModal: {
        title: '정말 모집을 취소하시겠어요?',
        descriptions: [
          '취소하면 다시 복구되지 않아요.',
          '이미 참여한 사람들에게는 금액이 환불됩니다.',
        ],
        cancelText: '아니요',
        confirmText: '취소하기',
      },
      onPress: (item: SwipeableProductItem) => {
        // TODO: 실제 모집 취소 API 호출
        Alert.alert('모집 취소 완료', `${item.title}\n모집이 취소되었습니다.`);
      },
    },
  ],
  emptyState: {
    message: '모집 완료된 공구가 없습니다',
  },
};

/**
 * 3. 공구 완료
 */
export const GROUP_COMPLETE_CONFIG: ProfileScreenConfig = {
  screenTitle: '공구 완료',
  headerTitle: '공구 완료된 목록',
  headerSubtitle: '공구가 성공적으로 완료되었습니다.\n목록 정리가 필요하면 삭제할 수 있어요.',
  statusType: 'group-complete',
  swipeActions: [
    {
      label: '목록\n삭제',
      backgroundColor: theme.colors.surface.env.accent,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      confirmModal: {
        title: '목록에서 삭제하시겠어요?',
        descriptions: ['삭제한 항목은 복구할 수 없어요.'],
        cancelText: '취소',
        confirmText: '삭제',
      },
      onPress: (item: SwipeableProductItem) => {
        // TODO: 실제 삭제 API 호출
        Alert.alert('삭제 완료', `${item.title}\n목록에서 삭제되었습니다.`);
      },
    },
  ],
  emptyState: {
    message: '공구 완료된 목록이 없습니다',
  },
};

/**
 * 4. 찜 목록
 */
export const WISHLIST_CONFIG: ProfileScreenConfig = {
  screenTitle: '찜 목록',
  headerTitle: '찜한 공구',
  headerSubtitle: '관심 있는 공구를 저장했어요.\n마감 전에 참여를 결정해보세요.',
  statusType: 'wishlist',
  rightButton: {
    text: '전체 삭제',
    variant: 'secondary',
  },
  swipeActions: [
    {
      label: '목록\n삭제',
      backgroundColor: theme.colors.surface.env.accent,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      confirmModal: {
        title: '찜 목록에서 삭제하시겠어요?',
        descriptions: ['삭제한 항목은 복구할 수 없어요.'],
        cancelText: '취소',
        confirmText: '삭제',
      },
      onPress: (item: SwipeableProductItem) => {
        // TODO: 실제 삭제 API 호출
        Alert.alert('삭제 완료', `${item.title}\n찜 목록에서 삭제되었습니다.`);
      },
    },
  ],
  emptyState: {
    message: '찜한 공구가 없습니다',
    description: '마음에 드는 공구를 찜해보세요',
  },
};

/**
 * 5. 참여 완료
 */
export const JOINED_CONFIG: ProfileScreenConfig = {
  screenTitle: '참여 완료',
  headerTitle: '참여 중인 공구',
  headerSubtitle: '참여 중인 공구 목록입니다.\n거래가 완료되면 거래 완료 버튼을 눌러주세요.',
  statusType: 'joined',
  swipeActions: [
    {
      label: '거래\n완료',
      backgroundColor: theme.colors.surface.brand.primary,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      onPress: (item: SwipeableProductItem) => {
        Alert.alert('거래 완료', `${item.title}\n거래를 완료 처리하시겠습니까?`);
      },
    },
    {
      label: '취소',
      backgroundColor: theme.colors.surface.env.accent,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      confirmModal: {
        title: '참여를 취소하시겠어요?',
        descriptions: [
          '취소하면 다시 복구되지 않아요.',
          '결제한 금액은 환불됩니다.',
        ],
        cancelText: '아니요',
        confirmText: '취소하기',
      },
      onPress: (item: SwipeableProductItem) => {
        // TODO: 실제 참여 취소 API 호출
        Alert.alert('취소 완료', `${item.title}\n참여가 취소되었습니다.`);
      },
    },
  ],
  emptyState: {
    message: '참여 중인 공구가 없습니다',
  },
};

/**
 * 6. 거래 완료
 */
export const TRANSACTION_COMPLETE_CONFIG: ProfileScreenConfig = {
  screenTitle: '거래 완료',
  headerTitle: '거래 완료된 공구',
  headerSubtitle: '거래가 완료된 공구 기록입니다.\n필요 없는 항목은 삭제할 수 있어요.',
  statusType: 'transaction-complete',
  swipeActions: [
    {
      label: '목록\n삭제',
      backgroundColor: theme.colors.surface.env.accent,
      textColor: theme.colors.surface.normal.white,
      width: 52,
      confirmModal: {
        title: '목록에서 삭제하시겠어요?',
        descriptions: ['삭제한 항목은 복구할 수 없어요.'],
        cancelText: '취소',
        confirmText: '삭제',
      },
      onPress: (item: SwipeableProductItem) => {
        // TODO: 실제 삭제 API 호출
        Alert.alert('삭제 완료', `${item.title}\n목록에서 삭제되었습니다.`);
      },
    },
  ],
  emptyState: {
    message: '거래 완료된 공구가 없습니다',
  },
};
