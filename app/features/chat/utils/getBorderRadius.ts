/**
 * Border Radius Utility
 *
 * Figma 디자인 기반으로 메시지 말풍선의 border radius를 계산합니다.
 * Instagram DM 스타일의 연결된 메시지 모양을 구현합니다.
 */

import type { BorderRadiusPosition, MessageSender } from '@/app/shared/types';

/** 기본 border radius 값 */
const RADIUS = 20;

/**
 * Figma 디자인 기반 border radius 계산
 *
 * 상대방 메시지 (왼쪽 정렬):
 * - single: 모든 모서리 둥글게
 * - first: 왼쪽 하단 각짐 (연결 시작)
 * - middle: 왼쪽 상/하단 각짐 (연결 중간)
 * - last: 왼쪽 상단 각짐 (연결 끝)
 *
 * 내 메시지 (오른쪽 정렬):
 * - single: 모든 모서리 둥글게
 * - first: 오른쪽 하단 각짐 (연결 시작)
 * - middle: 오른쪽 상/하단 각짐 (연결 중간)
 * - last: 오른쪽 상단 각짐 (연결 끝)
 *
 * @param position 메시지 그룹 내 위치
 * @param sender 발신자 (me/other)
 * @returns borderRadius 값 (topLeft topRight bottomRight bottomLeft 순서)
 */
export function getBorderRadius(
  position: BorderRadiusPosition,
  sender: MessageSender
): number {
  // React Native는 각 모서리별로 borderRadius를 설정
  // 반환값은 숫자로 하고, 각 모서리는 별도로 처리
  return RADIUS;
}

/**
 * 각 모서리별 border radius 값 계산
 * @param position 메시지 그룹 내 위치
 * @param sender 발신자 (me/other)
 * @returns 각 모서리별 radius 값
 */
export function getBorderRadiusStyle(
  position: BorderRadiusPosition,
  sender: MessageSender
): {
  borderTopLeftRadius: number;
  borderTopRightRadius: number;
  borderBottomRightRadius: number;
  borderBottomLeftRadius: number;
} {
  // 시스템 메시지는 MessageBubble로 렌더링하지 않으므로 이 함수가 호출되지 않아야 함
  // 방어 코드로 추가
  if (sender === 'system') {
    return {
      borderTopLeftRadius: RADIUS,
      borderTopRightRadius: RADIUS,
      borderBottomRightRadius: RADIUS,
      borderBottomLeftRadius: RADIUS,
    };
  }

  if (sender === 'other') {
    // 상대방 메시지 (왼쪽 정렬)
    switch (position) {
      case 'single':
        return {
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: RADIUS,
          borderBottomRightRadius: RADIUS,
          borderBottomLeftRadius: RADIUS,
        };
      case 'first':
        return {
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: RADIUS,
          borderBottomRightRadius: RADIUS,
          borderBottomLeftRadius: 0, // 왼쪽 하단 각짐
        };
      case 'middle':
        return {
          borderTopLeftRadius: 0, // 왼쪽 상단 각짐
          borderTopRightRadius: RADIUS,
          borderBottomRightRadius: RADIUS,
          borderBottomLeftRadius: 0, // 왼쪽 하단 각짐
        };
      case 'last':
        return {
          borderTopLeftRadius: 0, // 왼쪽 상단 각짐
          borderTopRightRadius: RADIUS,
          borderBottomRightRadius: RADIUS,
          borderBottomLeftRadius: RADIUS,
        };
    }
  } else {
    // 내 메시지 (오른쪽 정렬)
    switch (position) {
      case 'single':
        return {
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: RADIUS,
          borderBottomRightRadius: RADIUS,
          borderBottomLeftRadius: RADIUS,
        };
      case 'first':
        return {
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: RADIUS,
          borderBottomRightRadius: 0, // 오른쪽 하단 각짐
          borderBottomLeftRadius: RADIUS,
        };
      case 'middle':
        return {
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: 0, // 오른쪽 상단 각짐
          borderBottomRightRadius: 0, // 오른쪽 하단 각짐
          borderBottomLeftRadius: RADIUS,
        };
      case 'last':
        return {
          borderTopLeftRadius: RADIUS,
          borderTopRightRadius: 0, // 오른쪽 상단 각짐
          borderBottomRightRadius: RADIUS,
          borderBottomLeftRadius: RADIUS,
        };
    }
  }
}
