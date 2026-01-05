/**
 * StaticMapImage Component
 *
 * 정적 지도 이미지를 표시하는 컴포넌트입니다.
 * TransactionInfoSection에서 비용 절감을 위해 사용됩니다.
 *
 * Features:
 * - Static map 이미지 URL을 받아서 표시
 * - TouchableOpacity로 감싸서 딥링크 실행 가능
 * - 로딩 상태 (ActivityIndicator)
 * - 에러 상태 (placeholder with icon)
 * - 오버레이 배지: "지도 앱에서 보기"
 */

import React, { useState } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../../primitives';

export interface StaticMapImageProps {
  /** Static map 이미지 URL */
  imageUrl?: string;
  source: any;
  /** 지도 높이 */
  height?: number;
  /** 클릭 핸들러 (딥링크 실행) */
  onPress?: () => void;
  /** 접근성 라벨 */
  accessibilityLabel?: string;
}

export const StaticMapImage: React.FC<StaticMapImageProps> = ({
  source,
  height = 200,
  onPress,
  accessibilityLabel = '지도 보기',
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { height }]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {/* 로딩 인디케이터 */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={theme.colors.surface.brand.primary}
          />
        </View>
      )}

      {/* 에러 Placeholder */}
      {hasError ? (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: theme.colors.surface.normal.bg2 },
          ]}
        >
          <Icon
            name="map-pin-fill"
            size={32}
            color={theme.colors.surface.texticon.onnormal.icon.highEmp}
          />
          <Text
            style={[
              styles.errorText,
              { color: theme.colors.surface.texticon.onnormal.text.midEmp },
            ]}
          >
            지도를 불러올 수 없습니다
          </Text>
        </View>
      ) : (
        /* 지도 이미지 */
        <Image
          source={source}
          style={styles.image}
          onLoad={handleLoad}
          onError={handleError}
          resizeMode="cover"
        />
      )}

      {/* 오버레이 배지: "지도 앱에서 보기" */}
      {onPress && !hasError && (
        <View style={styles.overlay}>
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.surface.normal.bg1 },
            ]}
          >
            <Icon
              name="map-pin-fill"
              size={16}
              color={theme.colors.surface.brand.primary}
            />
            <Text
              style={[
                styles.badgeText,
                { color: theme.colors.surface.texticon.onnormal.text.black },
              ]}
            >
              지도 앱에서 보기
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Pretendard',
    fontWeight: '500',
    letterSpacing: -0.35,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    alignItems: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Pretendard',
    fontWeight: '600',
    letterSpacing: -0.3,
  },
});
