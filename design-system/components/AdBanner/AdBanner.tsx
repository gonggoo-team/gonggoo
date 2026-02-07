/**
 * AdBanner Component
 *
 * 홈화면 상단 프로모션 배너 컴포넌트입니다.
 *
 * Figma 링크: https://www.figma.com/design/IcB57n6VE5UKU4Np0RNr5C/공구팟_기획?node-id=445-6474&m=dev
 * 마지막 동기화: 2025-10-07
 *
 * 사용 예시:
 * ```tsx
 * <AdBanner
 *   items={bannerData}
 *   onBannerPress={(item) => console.log(item)}
 *   autoPlay={true}
 *   autoPlayInterval={3000}
 *   height={120}
 * />
 * ```
 */

import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  View,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../hooks';
import type { AdBannerItem, AdBannerProps } from './AdBanner.types';

/**
 * AdBanner Component
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  items,
  onBannerPress,
  autoPlay = false,
  autoPlayInterval = 3000,
  height = 375,
  width = 375,
  fullWidth = false,
  aspectRatio,
}) => {
  const { theme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList<AdBannerItem>>(null);
  const currentIndexRef = useRef(0);

  // 이미지 너비 계산
  const imageWidth = fullWidth ? screenWidth : (width || screenWidth - 40);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % items.length;
      flatListRef.current?.scrollToIndex({
        index: currentIndexRef.current,
        animated: true,
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const renderBannerItem = ({ item }: { item: AdBannerItem }) => {
    // 이미지 스타일: aspectRatio 우선, 없으면 height 사용
    const imageStyle: {
      width: number;
      borderRadius: number;
      backgroundColor: string;
      aspectRatio?: number;
      height?: number;
    } = {
      width: imageWidth,
      borderRadius: fullWidth ? 0 : 10, // fullWidth일 때는 borderRadius 제거
      backgroundColor: '#D9D9D9',
    };

    if (aspectRatio) {
      imageStyle.aspectRatio = aspectRatio;
    } else {
      imageStyle.height = height;
    }

    return (
      <Pressable
        onPress={() => onBannerPress?.(item)}
        delayLongPress={300}
        android_ripple={{
          color: theme.colors.surface.normal.container10,
          borderless: false,
        }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.9 : 1,
        })}
        accessibilityRole="button"
        accessibilityLabel="프로모션 배너"
      >
        <Image
          source={{ uri: item.imageUri }}
          style={[styles.bannerImage, imageStyle]}
          resizeMode="cover"
        />
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: fullWidth ? 0 : theme.spacing.lg, // fullWidth일 때 padding 제거
        },
      ]}
    >
      <FlatList
        ref={flatListRef}
        data={items}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={imageWidth}
        contentContainerStyle={fullWidth ? undefined : { gap: theme.spacing.md }} // fullWidth일 때 gap 제거
        onScrollToIndexFailed={() => {
          // Handle scroll to index failure silently
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bannerImage: {
    // width는 imageWidth prop으로 동적 계산 (inline style)
    // height는 prop으로 전달받아 inline style로 처리
  },
});
