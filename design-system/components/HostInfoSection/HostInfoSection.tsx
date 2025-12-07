/**
 * HostInfoSection Component
 *
 * 공구장 상세 정보를 표시하는 섹션 컴포넌트입니다.
 * - 공구장 프로필 이미지 (48x48)
 * - 공구장 닉네임
 * - 평점 (8.3 / 10.0)
 * - 다른 공구글 목록 (3개)
 *
 * Figma: node-id=688-11138
 */

import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../hooks';
import type { HostInfoSectionProps } from './HostInfoSection.types';

/**
 * Crown 아이콘 (공구장 왕관)
 */
const CrownIcon: React.FC<{ color?: string }> = ({ color = '#006242' }) => (
  <Svg width={13} height={13} viewBox="0 0 13 13">
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

export const HostInfoSection: React.FC<HostInfoSectionProps> = ({
  host,
  otherProducts = [],
  onHostPress,
  onProductPress,
}) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  // 동적 썸네일 크기 계산 (가로세로 비율 유지: 74:76 from Figma)
  const thumbnailDimensions = useMemo(() => {
    const horizontalPadding = 40; // 20px each side
    const avatarWidth = 48;
    const gapBetweenAvatarAndThumbnails = 16;
    const gapBetweenThumbnails = 13;

    // Available width for 3 thumbnails
    const availableWidth = screenWidth - horizontalPadding - avatarWidth - gapBetweenAvatarAndThumbnails - 20;

    // Width for each thumbnail (3 thumbnails with 2 gaps)
    const widthPerThumbnail = (availableWidth - (gapBetweenThumbnails * 2)) / 3;

    // Calculate height maintaining Figma aspect ratio (74:76)
    const width = Math.floor(widthPerThumbnail);
    const height = Math.floor(width * (76 / 74));

    return { width, height };
  }, [screenWidth]);

  // 최대 3개 다른 공구글만 표시
  const displayProducts = otherProducts.slice(0, 3);

  return (
    <View style={styles.container}>
      {/* 공구장 정보 */}
      <TouchableOpacity
        style={styles.hostInfo}
        onPress={onHostPress ? () => onHostPress(host.id) : undefined}
        disabled={!onHostPress}
        activeOpacity={0.7}
      >
        {/* 프로필 이미지 */}
        <View style={styles.avatarContainer}>
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
          {/* Crown 아이콘 */}
          {/* <View style={styles.crownBadge}>
            <CrownIcon color={theme.colors.surface.brand.primary} />
          </View> */}
        </View>

        {/* 닉네임 */}
        <Text
          style={{
            fontSize: theme.typography.fontSize.sm, // 14px
            fontWeight: theme.typography.fontWeight.semiBold, // 600
            lineHeight: theme.typography.fontSize.sm * 1.2,
            letterSpacing: theme.typography.getLetterSpacing(14),
            color: theme.colors.surface.texticon.onnormal.text.highEmp, // #181A1A
            alignSelf: 'stretch',
            textAlign: 'center',
          }}
        >
          {host.nickname}
        </Text>

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
      </TouchableOpacity>

      {/* 다른 공구글 */}
      <View style={styles.productsSection}>
        {displayProducts.map((product, index) => (
          <TouchableOpacity
            key={product.id}
            style={[
              {
                backgroundColor: theme.colors.surface.env.disabled, // #D9D9D9
                width: thumbnailDimensions.width,
                height: thumbnailDimensions.height,
              },
            ]}
            onPress={onProductPress ? () => onProductPress(product.id) : undefined}
            disabled={!onProductPress}
            activeOpacity={0.7}
          >
            {product.imageUri ? (
              <Image
                source={{ uri: product.imageUri }}
                style={{
                  width: thumbnailDimensions.width,
                  height: thumbnailDimensions.height,
                }}
              />
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    gap: 16,
  },
  hostInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  avatarContainer: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  crownBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 4,
  },
  productsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
});
