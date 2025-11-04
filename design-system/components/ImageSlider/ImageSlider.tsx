/**
 * ImageSlider Component
 *
 * 상품 이미지를 슬라이드 형태로 표시하는 컴포넌트입니다.
 * - 좌우 스와이프로 이미지 전환
 * - 하단에 페이지 인디케이터 표시
 * - 상단에 뒤로가기/공유 버튼 오버레이
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks';
import { Icon } from '../../primitives/Icon';
import type { ImageSliderProps } from './ImageSlider.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  height = 390,
  onBackPress,
  onSharePress,
  showBackButton = true,
  showShareButton = true,
}) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const renderImage = useCallback(({ item }: { item: string }) => (
    <View style={[styles.imageContainer, { width: SCREEN_WIDTH }]}>
      <Image
        source={{ uri: item }}
        style={[styles.image, { height }]}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        priority="high"
      />
    </View>
  ), [height]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  }), []);

  return (
    <View style={[styles.container, { height }]}>
      {/* 이미지 슬라이더 */}
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        keyExtractor={(_, index) => `image-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        removeClippedSubviews={true}
      />

      {/* 상단 오버레이 버튼 */}
      <View
        style={[
          styles.topOverlay,
          {
            paddingTop: 6,
            paddingHorizontal: 20,
          },
        ]}
      >
        {showBackButton && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBackPress}
            activeOpacity={0.8}
          >
            <Icon name="back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }} />

        {showShareButton && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSharePress}
            activeOpacity={0.8}
          >
            <Icon name="share" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* 페이지 인디케이터 */}
      {images.length > 1 && (
        <View style={styles.paginationContainer}>
          {images.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex
                      ? theme.colors.surface.normal.bg1 // 흰색
                      : 'rgba(255, 255, 255, 0.5)', // 반투명 흰색
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  imageContainer: {
    backgroundColor: '#EAEAEA', // Figma 디자인 참고
  },
  image: {
    width: '100%',
  },
  topOverlay: {
    position: 'absolute',
    top: 44, // Status bar 아래
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    // Gradient background from Figma
    // linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 100%)
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 44, // Figma 기준 위치
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
