/**
 * HostProfile Component
 *
 * 공구장 프로필 정보와 참여자 목록을 표시하는 컴포넌트입니다.
 * - 공구장 프로필 이미지, 닉네임, 평점
 * - 참여자 프로필 이미지들 (겹쳐서 표시)
 *
 * Figma: 공구장 정보 섹션
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks';
import type { HostProfileProps } from './HostProfile.types';

/**
 * 왕관 아이콘 (Figma Component 41 - crown)
 */
const CrownIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={13} height={13} viewBox="0 0 13 13">
    <Path
      d="M1 2.01L2.83 8.99H10.17L12 2.01L9.67 4.34L6.5 1.17L3.33 4.34L1 2.01Z"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
    />
  </Svg>
);

export const HostProfile: React.FC<HostProfileProps> = ({
  host,
  participants = [],
}) => {
  const { theme } = useTheme();

  // 최대 4명까지만 표시
  const displayParticipants = participants.slice(0, 4);

  return (
    <View style={styles.container}>
      {/* 공구장 정보 */}
      <View style={styles.hostSection}>
        {/* 프로필 이미지 */}
        <View
          style={[
            styles.hostImage,
            { backgroundColor: theme.colors.surface.env.disabled }, // #D9D9D9
          ]}
        >
          {host.profileImageUri ? (
            <Image
              source={{ uri: host.profileImageUri }}
              style={styles.hostImage}
            />
          ) : null}
        </View>

        {/* 닉네임 및 평점 */}
        <View style={styles.hostInfo}>
          {/* 닉네임 + 왕관 */}
          <View style={styles.nicknameRow}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm, // 14px
                fontWeight: theme.typography.fontWeight.semiBold, // 600
                lineHeight: theme.typography.fontSize.sm * 1.2,
                letterSpacing: theme.typography.getLetterSpacing(14),
                color: theme.colors.surface.texticon.onnormal.text.highEmp,
              }}
            >
              {host.nickname}
            </Text>
            <CrownIcon color={theme.colors.surface.brand.primary} />
          </View>

          {/* 평점 */}
          <View style={styles.ratingRow}>
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm, // 14px
                fontWeight: theme.typography.fontWeight.semiBold, // 600
                lineHeight: theme.typography.fontSize.sm * 1.2,
                letterSpacing: theme.typography.getLetterSpacing(14),
                color: theme.colors.surface.brand.primary, // #006242
              }}
            >
              {host.rating.toFixed(1)}
            </Text>
            <Text
              style={{
                fontSize: theme.typography.fontSize.sm, // 14px
                fontWeight: theme.typography.fontWeight.medium, // 500
                lineHeight: theme.typography.fontSize.sm * 1.2,
                letterSpacing: theme.typography.getLetterSpacing(14),
                color: theme.colors.surface.texticon.onnormal.text.midEmp, // #9FA7B1
              }}
            >
              {' '}
              / 10.0
            </Text>
          </View>
        </View>
      </View>

      {/* 참여자 목록 */}
      <View style={styles.participantsSection}>
        {displayParticipants.map((participant, index) => (
          <View
            key={participant.id}
            style={[
              styles.participantAvatar,
              {
                backgroundColor: theme.colors.surface.env.disabled, // #D9D9D9
                zIndex: displayParticipants.length - index,
                marginLeft: index > 0 ? -9 : 0, // 겹침 효과
              },
            ]}
          >
            {participant.profileImageUri ? (
              <Image
                source={{ uri: participant.profileImageUri }}
                style={styles.participantAvatar}
              />
            ) : null}
          </View>
        ))}

        {/* 추가 참여자가 있는 경우 "+" 표시 */}
        {participants.length > 4 && (
          <View
            style={[
              styles.participantAvatar,
              styles.moreIndicator,
              {
                backgroundColor: theme.colors.surface.env.disabled,
                marginLeft: -9,
              },
            ]}
          >
            <Text style={styles.moreText}>+</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  hostSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  hostImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  hostInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 4,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  moreIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 12,
    color: '#000',
  },
});
