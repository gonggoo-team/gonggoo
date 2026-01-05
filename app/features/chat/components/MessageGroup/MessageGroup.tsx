/**
 * MessageGroup Component
 *
 * 5분 이내 같은 발신자의 메시지를 그룹화하여 표시합니다.
 * - 상대방 메시지: 왼쪽 정렬, 첫 그룹만 프로필 이미지 표시
 * - 내 메시지: 오른쪽 정렬
 * - 타임스탬프: 그룹의 마지막 메시지 옆에 표시
 */

import React from 'react';
import { View, Image, Text } from 'react-native';
import { useTheme } from '@/design-system';
import { formatMessageTimestamp } from '@/app/features/chat/utils';
import { MessageBubble } from '../MessageBubble';
import { createStyles } from './MessageGroup.styles';
import type { MessageGroupProps } from './MessageGroup.types';

export default function MessageGroup({ group, profileImageUri, showProfileImage }: MessageGroupProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, group.sender);
  const isMe = group.sender === 'me';

  const renderProfileImage = () => {
    if (isMe) return null;

    if (showProfileImage && profileImageUri) {
      return (
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
        </View>
      );
    }
    // 프로필 이미지가 없어도(같은 사람의 연속 메시지 등) 여백 유지
    return <View style={styles.profilePlaceholder} />;
  };

  return (
    <View style={styles.container}>
      {/* 1. 상대방 프로필 (왼쪽) */}
      {!isMe && renderProfileImage()}

      {/* 2. 메시지 영역 (말풍선 리스트 + 타임스탬프) */}
      <View style={styles.contentRow}>
        
        {/* Case A: 내 메시지일 때 타임스탬프 (왼쪽 배치) */}
        {isMe && (
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>{formatMessageTimestamp(group.timestamp)}</Text>
          </View>
        )}

        {/* 3. 말풍선 리스트 (Column) */}
        <View style={styles.bubblesColumn}>
          {group.messages.map(({ message, position }) => {
            // 시스템 메시지는 MessageBubble로 렌더링하지 않음 (별도 처리)
            if (message.type === 'system') {
              return null;
            }

            return (
              <MessageBubble
                key={message.id}
                content={message.content}
                sender={group.sender}
                position={position}
              />
            );
          })}
        </View>

        {/* Case B: 상대방 메시지일 때 타임스탬프 (오른쪽 배치) */}
        {!isMe && (
          <View style={styles.timestampContainer}>
            <Text style={styles.timestamp}>{formatMessageTimestamp(group.timestamp)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
