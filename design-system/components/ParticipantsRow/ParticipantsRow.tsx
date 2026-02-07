/**
 * ParticipantsRow Component
 *
 * 공구에 참여한 사람들의 정보를 표시하는 컴포넌트입니다.
 * - 공구장 정보: 프로필 이미지 + "공구장" 텍스트 + 왕관 아이콘
 * - 참여자 정보: 최대 3개 프로필 이미지 + "..." 표시
 *
 * Figma: node-id=688-11112
 */

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks';
import type { ParticipantsRowProps } from './ParticipantsRow.types';

/**
 * 왕관 아이콘 (공구장 왕관)
 */
const CrownIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
    <Path
      d="M1 8.27971V3.09055C1 2.37013 1.41708 2.1968 1.92625 2.70596L3.32917 4.10888C3.54042 4.32013 3.88708 4.32013 4.09292 4.10888L6.03208 2.1643C6.24333 1.95305 6.59 1.95305 6.79583 2.1643L8.74042 4.10888C8.95167 4.32013 9.29833 4.32013 9.50417 4.10888L10.9071 2.70596C11.4162 2.1968 11.8333 2.37013 11.8333 3.09055V8.28513C11.8333 9.91013 10.75 10.9935 9.125 10.9935H3.70833C2.21333 10.988 1 9.77471 1 8.27971Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

/**
 * 더보기 표시 (3개 점)
 * Figma: Group 36900
 */
const MoreIndicator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.5 14C7.32843 14 8 13.3284 8 12.5C8 11.6716 7.32843 11 6.5 11C5.67157 11 5 11.6716 5 12.5C5 13.3284 5.67157 14 6.5 14Z"
        fill={theme.colors.surface.env.disabled}
      />
      <Path
        d="M12.5 14C13.3284 14 14 13.3284 14 12.5C14 11.6716 13.3284 11 12.5 11C11.6716 11 11 11.6716 11 12.5C11 13.3284 11.6716 14 12.5 14Z"
        fill={theme.colors.surface.env.disabled}
      />
      <Path
        d="M18.5 14C19.3284 14 20 13.3284 20 12.5C20 11.6716 19.3284 11 18.5 11C17.6716 11 17 11.6716 17 12.5C17 13.3284 17.6716 14 18.5 14Z"
        fill={theme.colors.surface.env.disabled}
      />
    </Svg>
  );
};

export const ParticipantsRow: React.FC<ParticipantsRowProps> = ({
  host,
  participants = [],
}) => {
  const { theme } = useTheme();

  // 최대 3개 참여자만 표시
  const displayParticipants = participants.slice(0, 3);
  const hasMoreParticipants = participants.length > 3;

  return (
    <View style={styles.container}>
      {/* 공구장 정보 */}
      <View style={styles.hostSection}>
        {/* 프로필 이미지 */}
        <View
          style={[
            styles.hostAvatar,
            { backgroundColor: theme.colors.surface.env.disabled }, // #D9D9D9
          ]}
        >
          {host.profileImageUri ? (
            <Image
              source={{ uri: host.profileImageUri }}
              style={styles.hostAvatar}
            />
          ) : null}
        </View>

        {/* "공구장" 텍스트 + 왕관 */}
        <View style={styles.hostLabel}>
          <Text
            style={{
              fontSize: theme.typography.fontSize.sm, // 14px
              fontWeight: theme.typography.fontWeight.semiBold, // 600
              lineHeight: theme.typography.fontSize.sm * 1.2,
              letterSpacing: theme.typography.getLetterSpacing(14),
              color: theme.colors.surface.texticon.onnormal.text.black, // #181A1A
            }}
          >
            공구장
          </Text>
          <CrownIcon color={theme.colors.surface.brand.primary} />
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

        {/* 추가 참여자 표시 */}
        {hasMoreParticipants && <MoreIndicator />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 109, // Figma 기준
    alignSelf: 'stretch',
  },
  hostSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  hostAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  hostLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
