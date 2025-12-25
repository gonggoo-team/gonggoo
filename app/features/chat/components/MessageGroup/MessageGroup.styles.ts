/**
 * MessageGroup Styles
 */

import { StyleSheet } from 'react-native';
import type { Theme } from '@/design-system';
import type { MessageSender } from '@/app/shared/types';

export const createStyles = (theme: Theme, sender: MessageSender) => {
  const isMe = sender === 'me';

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
      paddingHorizontal: 16,
      width: '100%', // 전체 컨테이너는 화면 꽉 차게
      // 정렬 방향: 내가 보낸건 오른쪽 끝, 상대방은 왼쪽 끝
      justifyContent: isMe ? 'flex-end' : 'flex-start',
    },
    
    // ... 프로필 관련 스타일은 기존 유지 ...
    profileImageContainer: {
      width: 36, height: 36, marginRight: 8, marginTop: 0,
    },
    profileImage: {
      width: 36, height: 36, borderRadius: 14, backgroundColor: theme.colors.surface.normal.bg2,
    },
    profilePlaceholder: { width: 36, marginRight: 8 },

    /**
     * [핵심 수정 영역]
     * contentRow: 말풍선 리스트와 타임스탬프를 감싸는 래퍼
     */
    contentRow: {
      flexDirection: 'row',
      alignItems: 'flex-end', // 타임스탬프 하단 정렬
      
      // 1. 최대 너비 제한 (화면의 80%까지만 늘어남)
      maxWidth: '80%', 
      
      // 2. [중요] 내용물 크기만큼만 차지하도록 설정 (Shrink-wrapping)
      // 이 속성이 없으면 짧은 메시지여도 불필요하게 넓게 잡힐 수 있음
      alignSelf: isMe ? 'flex-end' : 'flex-start',
    },

    /**
     * bubblesColumn: 말풍선들이 수직으로 쌓이는 곳
     */
    bubblesColumn: {
      flexDirection: 'column',
      gap: 4,
      
      // 3. [중요] 타임스탬프 공간을 확보하고, 
      // 텍스트가 길어지면 이 컬럼이 줄어들며(shrink) 줄바꿈 발생
      flexShrink: 1, 
      
      alignItems: isMe ? 'flex-end' : 'flex-start',
    },

    timestampContainer: {
      // 4. 말풍선과의 간격 조정
      marginLeft: isMe ? 0 : 4,  // 상대 메시지일 땐 왼쪽에 말풍선이 있으니 왼쪽 간격 필요
      marginRight: isMe ? 4 : 0, // 내 메시지일 땐 오른쪽에 말풍선이 있으니 오른쪽 간격 필요
      marginBottom: 2, // 말풍선 텍스트와 베이스라인 정렬
      minWidth: 40, // 시간 텍스트 최소 확보
    },
    timestamp: {
      fontSize: 11,
      fontWeight: '400',
      lineHeight: 13, // 정확한 베이스라인 정렬을 위한 lineHeight
      color: theme.colors.surface.texticon.onnormal.text.midEmp,
      textAlign: isMe ? 'right' : 'left',
    },
  });
};